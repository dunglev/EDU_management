from fastapi import APIRouter, HTTPException, Depends
from config.database import database, students, engine, ScoreAvg, teachers
from config.logging import logger
from config.jwt import get_current_user
from sqlalchemy.sql import text
import pandas as pd
from datetime import datetime

router = APIRouter()

@router.get("/class-scores")
async def class_scores(current_user: dict = Depends(get_current_user)):
    try:
        query = students.select().where(students.c.site == current_user["site"])
        students_list = await database.fetch_all(query)
        df = pd.DataFrame(students_list)
        if df.empty:
            logger.info(f"Không có dữ liệu học sinh cho cơ sở {current_user['site']}")
            return {"message": "No data available"}
        
        score_columns = [
            "math_score", "literature_score", "physics_score", "chemistry_score",
            "biology_score", "history_score", "geography_score", "civic_education_score",
            "foreign_language_score"
        ]
        avg_scores = df.groupby("class_name")[score_columns].mean().to_dict()
        logger.info(f"Báo cáo điểm trung bình theo lớp được tạo cho cơ sở {current_user['site']}")
        return {"class_averages": avg_scores}
    except Exception as e:
        logger.error(f"Lỗi khi tạo báo cáo điểm trung bình theo lớp: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi khi tạo báo cáo: {str(e)}")

@router.get("/class-stats")
async def class_stats(current_user: dict = Depends(get_current_user)):
    try:
        logger.info(f"Starting class-stats for user {current_user['username']} at site {current_user['site']}")
        query = students.select().where( students.c.site == current_user["site"].strip())        
        df = pd.read_sql(query, engine)
        if df.empty:
            logger.info(f"No student data for site {current_user['site']}")
            return {"message": "No data available"}
        
        if 'class_name' not in df.columns:
            logger.error("Column 'class_name' not found in DataFrame")
            raise HTTPException(status_code=500, detail="Column 'class_name' not found in data")
        
        score_columns = {
            "math_score": "Toán",
            "literature_score": "Văn",
            "physics_score": "Lý",
            "chemistry_score": "Hóa",
            "biology_score": "Sinh",
            "history_score": "Sử",
            "geography_score": "Địa",
            "civic_education_score": "GDCD",
            "cs_score": "Tin",
            "itech_score": "CNCN",
            "atech_score": "CNNN",
            "foreign_language_score": "Ngoại ngữ"
        }
        
        for col in score_columns:
            if col in df:
                try:
                    df[col] = pd.to_numeric(df[col], errors='coerce')
                except Exception as e:
                    logger.error(f"Invalid data in {col}: {str(e)}")
                    raise HTTPException(status_code=500, detail=f"Invalid data in {col}: {str(e)}")
        
        total_students = len(df[df[list(score_columns.keys())].notna().any(axis=1)])
        
        result = {}
        for class_name, group in df.groupby("class_name"):
            stats = {}
            for col, subject in score_columns.items():
                if col in group and not group[col].isna().all():
                    stats[subject] = {
                        "avg": round(group[col].mean(), 2) if not group[col].isna().all() else None,
                        "max": round(group[col].max(), 2) if not group[col].isna().all() else None,
                        "min": round(group[col].min(), 2) if not group[col].isna().all() else None
                    }
                else:
                    stats[subject] = {"avg": None, "max": None, "min": None}
            result[class_name] = stats
        
        overall_stats = {}
        overall_student_counts = {}
        for col, subject in score_columns.items():
            if col in df and not df[col].isna().all():
                overall_stats[subject] = {
                    "avg": round(df[col].mean(), 2) if not df[col].isna().all() else None,
                    "max": round(df[col].max(), 2) if not df[col].isna().all() else None,
                    "min": round(df[col].min(), 2) if not df[col].isna().all() else None
                }
                overall_student_counts[subject] = int(df[col].notna().sum())
            else:
                overall_stats[subject] = {"avg": None, "max": None, "min": None}
                overall_student_counts[subject] = 0
        
        logger.info(f"Class stats report generated for site {current_user['site']}")
        
        current_year = datetime.now().year
        query = ScoreAvg.select().where(ScoreAvg.c.year == str(current_year))
        if current_user["role"] == "admin":
            query = ScoreAvg.select()
        df = pd.read_sql(query, engine)
        
        if df.empty:
            logger.info(f"No data for year {current_year}")
            return {"message": "No data available"}
        
        area_scores = {}
        for col, subject in score_columns.items():
            area_scores["name"] = df["name"].tolist()
            if col in df and not df[col].isna().all():
                area_scores[subject] = {
                    "qg": round(df[col][0], 2) if not df[col].isna().all() and len(df[col]) > 0 else None,
                    "hn": round(df[col][1], 2) if not df[col].isna().all() and len(df[col]) > 1 else None,
                }
            else:
                area_scores[subject] = {"qg": None, "hn": None}
        
        return {
            "class_stats": result,
            "overall_stats": overall_stats,
            "overall_student_counts": overall_student_counts,
            "total_students": total_students,
            "area_scores": area_scores
        }
    except Exception as e:
        logger.error(f"Error in class-stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")

@router.get("/top-students-by-block")
async def top_students_by_block(current_user: dict = Depends(get_current_user)):
    try:
        logger.info(f"Starting top-students-by-block for user {current_user['username']} at site {current_user['site']}")
        site_value = current_user["site"]
        query = text("CALL get_top_student_exam_scores(:site,:top)")
        with engine.connect() as conn:
            result = conn.execute(query, {"site": site_value, "top": 5})
            df = pd.DataFrame(result.fetchall(), columns=result.keys())
        
        logger.info(f"Student Exam Scores DataFrame: {len(df)} rows")
        if df.empty:
            logger.info(f"No student exam scores data for site {current_user['site']}")
            return {"message": "No data available"}
        
        results = []
        for block_code, group in df.groupby('block_code'):
            students = []
            for _, row in group.iterrows():
                students.append({
                    'student_id': row['student_id'],
                    'student_name': row['student_name'],
                    'cmnd': row['cmnd'],
                    'class_name': row['class_name'],
                    'site': row['site'],
                    'subject1': row['subject1'],
                    'score1': round(row['score1'], 2) if pd.notna(row['score1']) else None,
                    'subject2': row['subject2'],
                    'score2': round(row['score2'], 2) if pd.notna(row['score2']) else None,
                    'subject3': row['subject3'],
                    'score3': round(row['score3'], 2) if pd.notna(row['score3']) else None,
                    'total_score': round(row['total_score'], 2) if pd.notna(row['total_score']) else None
                })
            results.append({
                'block_code': block_code,
                'students': students
            })
        
        if not results:
            logger.info("No students found")
            return {"message": "No students found"}
        
        logger.info(f"Students by block report generated: {len(results)} blocks")
        return {"blocks": results}
    except Exception as e:
        logger.error(f"Error in top-students-by-block: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")

@router.get("/stc-stats")
async def stc_stats(current_user: dict = Depends(get_current_user)):
    try:
        logger.info(f"Starting top-students-by-block for user {current_user['username']} at site {current_user['site']}")        
        current_year = str(datetime.now().year)
        query = teachers.select().where(teachers.c.site == current_user["site"] and teachers.c.year == current_year)
        df = pd.read_sql(query, engine)
        logger.info(f"STC DataFrame columns: {list(df.columns)}")
        
        if df.empty:
            logger.info(f"No student data for site {current_user['site']}")
            return {"message": "No data available"}
                       
        results = []
        df_sort = df.sort_values(by=['subject', 'name'], ascending=[True, False])
        for subject, group in df_sort.groupby('subject'):
            teacher = []
            for _, row in group.iterrows():
                teacher.append({
                    'teacher_name': row['name'],
                    'class_name': row['class_name'],
                    'site': row['site']                    
                })
            results.append({
                'subject': subject,
                'teachers': teacher
            })
        
        if not results:
            logger.info("No teacher found")
            return {"message": "No teacher found"}
        
        logger.info(f"STC - Teachers by subject report generated: {len(results)} subjects")        
        return {"stc": results}
    except Exception as e:
        logger.error(f"Error in stc-stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")
                
@router.get("/teacher-quality")
async def teacher_quality(current_user: dict = Depends(get_current_user)):
    try:
        logger.info(f"Starting teacher_report for user {current_user['username']} at site {current_user['site']}")
        site_value = current_user["site"]
        current_year = datetime.now().year
        query = text("CALL get_subject_teacher_report(:year,:site)")
        
        with engine.connect() as conn:
            result = conn.execute(query, {"year": current_year, "site": site_value})
            df = pd.DataFrame(result.fetchall(), columns=result.keys())
        
        logger.info(f"Subject teacher Scores DataFrame: {len(df)} rows")
        if df.empty:
            logger.info(f"No data for site {current_user['site']}")
            return {"message": "No data available"}
        
        results = []
        df_sort = df.sort_values(by=['subject', 'teacher_name'], ascending=[True, False])
      
        for subject, group in df_sort.groupby('subject'):
            teachers = []        
            for _, row in group.iterrows():
                teachers.append({
                    'teacher_name': row['teacher_name'],
                    'class_name': row['class_name'],
                                      
                    'avg_score_class': "" if pd.isna(row['avg_score_class']) else row['avg_score_class'],
                    'max_score_class': "" if pd.isna(row['max_score_class']) else row['max_score_class'],
                    'min_score_class': "" if pd.isna(row['min_score_class']) else row['min_score_class'],
                    'avg_score_teacher': "" if pd.isna(row['avg_score_teacher']) else row['avg_score_teacher'],
                    'max_score_teacher': "" if pd.isna(row['max_score_teacher']) else row['max_score_teacher'],
                    'min_score_teacher': "" if pd.isna(row['min_score_teacher']) else row['min_score_teacher']
                })
           
            results.append({
                'subject': subject,
                'teachers': teachers
            })
        
        if not results:
            logger.info("No teacher found")
            return {"message": "No teacher found"}
                
        logger.info(f"Teachers by subject report generated: {len(results)} subjects")        
        return {"subjects": results}
    except Exception as e:
        logger.error(f"Error in teacher_quality: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")