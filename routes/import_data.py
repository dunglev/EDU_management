from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy import and_
from config.database import database, ScoreAvg, ExamBlock, teachers,students
from config.logging import logger
from config.jwt import get_current_user
from datetime import datetime
import pandas as pd
import io

router = APIRouter()

@router.post("/import-score-avg")
async def import_score_avg(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        logger.warning(f"Thử import không được phép bởi {current_user['username']}")
        raise HTTPException(status_code=403, detail="Chỉ admin được phép import")
    if not file.filename.endswith('.xlsx'):
        logger.error("Định dạng file không hợp lệ")
        raise HTTPException(status_code=400, detail="File phải là Excel (.xlsx)")
    
    try:
        logger.info(f"Bắt đầu import Excel bởi {current_user['username']} tại cơ sở {current_user['site']}")
        
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents), skiprows=0, engine='openpyxl')
        
        expected_num_columns = 15
        actual_num_columns = len(df.columns)
        if actual_num_columns != expected_num_columns:
            logger.error(f"Mẫu Excel không hợp lệ. Cần {expected_num_columns} cột, nhận được {actual_num_columns}")
            raise HTTPException(status_code=400, detail=f"Mẫu Excel không hợp lệ. Cần {expected_num_columns} cột, nhận được {actual_num_columns}")
        
        current_year = datetime.now().year
        logger.info(f"Xóa dữ liệu học sinh hiện tại của cơ sở {current_user['site']}")
        query = ScoreAvg.delete().where(ScoreAvg.c.year == str(current_year))
        await database.execute(query)
        
        df.columns = [
            "name", "year", "math_score", "literature_score", "physics_score", "chemistry_score",
            "biology_score", "history_score", "geography_score", "civic_education_score",
            "cs_score","itech_score","atech_score",
            "foreign_language_score", "foreign_language"
        ]
        
        df["year"] = current_year
        
        logger.info("Lưu dữ liệu vào database")
        inserted_rows = 0
        total_rows = len(df)
        for index, row in df.iterrows():
            data = {
                "name": str(row["name"]).strip(),
                "year": str(row["year"]).strip() if pd.notna(row["year"]) else None,
                "math_score": float(row["math_score"]) if pd.notna(row["math_score"]) else None,
                "literature_score": float(row["literature_score"]) if pd.notna(row["literature_score"]) else None,
                "physics_score": float(row["physics_score"]) if pd.notna(row["physics_score"]) else None,
                "chemistry_score": float(row["chemistry_score"]) if pd.notna(row["chemistry_score"]) else None,
                "biology_score": float(row["biology_score"]) if pd.notna(row["biology_score"]) else None,
                "history_score": float(row["history_score"]) if pd.notna(row["history_score"]) else None,
                "geography_score": float(row["geography_score"]) if pd.notna(row["geography_score"]) else None,
                "civic_education_score": float(row["civic_education_score"]) if pd.notna(row["civic_education_score"]) else None,
                "cs_score": float(row["cs_score"]) if pd.notna(row["cs_score"]) else None,
                "itech_score": float(row["itech_score"]) if pd.notna(row["itech_score"]) else None,
                "atech_score": float(row["atech_score"]) if pd.notna(row["atech_score"]) else None,
                "foreign_language_score": float(row["foreign_language_score"]) if pd.notna(row["foreign_language_score"]) else None,
                "foreign_language": str(row["foreign_language"]).strip() if pd.notna(row["foreign_language"]) else None,
            }
            query = ScoreAvg.insert().values(**data)
            await database.execute(query)
            inserted_rows += 1
            if inserted_rows % 100 == 0:
                logger.info(f"Đã lưu {inserted_rows}/{total_rows} dòng")
        
        logger.info(f"Hoàn tất import {inserted_rows} bản ghi điểm trung bình năm 2025")
        return {
            "message": f"Imported {inserted_rows} records successfully",
            "total_rows": total_rows,
            "inserted_rows": inserted_rows
        }
    except Exception as e:
        logger.error(f"Lỗi khi import Excel: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi khi import Excel: {str(e)}")


@router.post("/import-exam-block")
async def import_excel_exam_block(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        logger.warning(f"Thử import không được phép bởi {current_user['username']}")
        raise HTTPException(status_code=403, detail="Chỉ admin được phép import")
    if not file.filename.endswith('.xlsx'):
        logger.error("Định dạng file không hợp lệ")
        raise HTTPException(status_code=400, detail="File phải là Excel (.xlsx)")
    
    try:
        logger.info(f"Bắt đầu import Excel danh mục khối thi bởi {current_user['username']}")
        
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents), skiprows=0, engine='openpyxl')
        
        expected_num_columns = 5
        actual_num_columns = len(df.columns)
        if actual_num_columns != expected_num_columns:
            logger.error(f"Mẫu Excel không hợp lệ. Cần {expected_num_columns} cột, nhận được {actual_num_columns}")
            raise HTTPException(status_code=400, detail=f"Mẫu Excel không hợp lệ. Cần {expected_num_columns} cột, nhận được {actual_num_columns}")
        
        query = ExamBlock.delete()
        await database.execute(query)
        
        df.columns = ["block_code", "subject1", "subject2", "subject3", "field_study"]
        
        logger.info("Lưu danh mực khối thi vào database")
        inserted_rows = 0
        total_rows = len(df)
        for index, row in df.iterrows():
            data = {
                "block_code": str(row["block_code"]).strip(),
                "subject1": str(row["subject1"]).strip() if pd.notna(row["subject1"]) else None,
                "subject2": str(row["subject2"]).strip() if pd.notna(row["subject2"]) else None,
                "subject3": str(row["subject3"]).strip() if pd.notna(row["subject3"]) else None,
                "field_study": str(row["field_study"]).strip() if pd.notna(row["field_study"]) else None
            }
            query = ExamBlock.insert().values(**data)
            await database.execute(query)
            inserted_rows += 1
            if inserted_rows % 100 == 0:
                logger.info(f"Đã lưu {inserted_rows}/{total_rows} dòng")
        
        logger.info(f"Hoàn tất import {inserted_rows} bản ghi khối thi")
        return {
            "message": f"Imported {inserted_rows} Examblock records successfully",
            "total_rows": total_rows,
            "inserted_rows": inserted_rows
        }
    except Exception as e:
        logger.error(f"Lỗi khi import Excel: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi khi import Excel: {str(e)}")


@router.post("/import-teacher")
async def import_teacher(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        logger.warning(f"Thử import không được phép bởi {current_user['username']}")
        raise HTTPException(status_code=403, detail="Chỉ admin được phép import")
    if not file.filename.endswith('.xlsx'):
        logger.error("Định dạng file không hợp lệ")
        raise HTTPException(status_code=400, detail="File phải là Excel (.xlsx)")
    
    try:
        logger.info(f"Bắt đầu import Excel bởi {current_user['username']} tại cơ sở {current_user['site']}")        
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents), skiprows=2, engine='openpyxl')
        
        expected_num_columns = 5
        actual_num_columns = len(df.columns)
        if actual_num_columns != expected_num_columns:
            logger.error(f"Mẫu Excel không hợp lệ. Cần {expected_num_columns} cột, nhận được {actual_num_columns}")
            raise HTTPException(status_code=400, detail=f"Mẫu Excel không hợp lệ. Cần {expected_num_columns} cột, nhận được {actual_num_columns}")
        
        current_year = datetime.now().year
        current_site = current_user['site']
        logger.info(f"Xóa dữ liệu giáo viên hiện tại của cơ sở {current_site}")
        query = teachers.delete().where (and_(
                                            teachers.c.year == str(current_year),
                                            teachers.c.site == current_site
    )                                   )
        await database.execute(query)
        
        df.columns = ["name", "subject", "class_name", "year", "site"]
        
        logger.info("Lưu dữ liệu vào database")
        inserted_rows = 0
        total_rows = len(df)
        for index, row in df.iterrows():
            data = {
                "name": str(row["name"]).strip(),
                "subject": str(row["subject"]).strip(),
                "class_name": str(row["class_name"]).strip(),
                "year": str(current_year),
                "site": current_site
            }
            query = teachers.insert().values(**data)
            await database.execute(query)
            inserted_rows += 1
            if inserted_rows % 100 == 0:
                logger.info(f"Đã lưu {inserted_rows}/{total_rows} dòng")
        
        logger.info(f"Hoàn tất import {inserted_rows} bản ghi phân công giảng viên năm 2025")
        return {
            "message": f"Imported {inserted_rows} Teachers records successfully",
            "total_rows": total_rows,
            "inserted_rows": inserted_rows
        }
    except Exception as e:
        logger.error(f"Lỗi khi import Excel: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi khi import Excel: {str(e)}")

@router.post("/import-diem-totnghiep")
async def import_diem_totnghiep(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        logger.warning(f"Thử import không được phép bởi {current_user['username']}")
        raise HTTPException(status_code=403, detail="Chỉ admin được phép import")
    if not file.filename.endswith('.xlsx'):
        logger.error("Định dạng file không hợp lệ")
        raise HTTPException(status_code=400, detail="File phải là Excel (.xlsx)")
    
    try:
        logger.info(f"Bắt đầu import Excel bởi {current_user['username']} tại cơ sở {current_user['site']}")
        
        # Bước 1: Đọc file Excel
        logger.info("Đang đọc file Excel")
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents), skiprows=6, engine='openpyxl')
        
        # Kiểm tra số cột
        expected_num_columns = 23
        actual_num_columns = len(df.columns)
        if actual_num_columns != expected_num_columns:
            logger.error(f"Mẫu Excel không hợp lệ. Cần {expected_num_columns} cột, nhận được {actual_num_columns}")
            raise HTTPException(status_code=400, detail=f"Mẫu Excel không hợp lệ. Cần {expected_num_columns} cột, nhận được {actual_num_columns}")
        
        # Bước 2: Xóa dữ liệu cũ
        logger.info(f"Xóa dữ liệu học sinh hiện tại của cơ sở {current_user['site']}")
        query = students.delete().where(students.c.site == current_user["site"])
        await database.execute(query)
        
        # Đổi tên cột
        df.columns = [
            "stt", "class_name", "cmnd", "name", "gender", "dob", "birth_place", "ethnicity",
            "council_code", "math_score", "literature_score", "physics_score", "chemistry_score",
            "biology_score", "history_score", "geography_score", "civic_education_score",
            "cs_score","itech_score","atech_score",
            "foreign_language_score", "foreign_language", "site"
        ]
        
        # Gán site từ current_user
        df["site"] = current_user["site"]
        
        # Bước 3: Lọc dữ liệu
        logger.info("Lọc và kiểm tra dữ liệu")
        df = df.dropna(subset=["name", "cmnd"]).reset_index(drop=True)
        
        # Kiểm tra dữ liệu
        score_columns = [
            "math_score", "literature_score", "physics_score", "chemistry_score",
            "biology_score", "history_score", "geography_score", "civic_education_score",
            "cs_score","itech_score","atech_score",
            "foreign_language_score"
        ]
        cmnd_set = set()
        for index, row in df.iterrows():
            cmnd = str(row["cmnd"]).strip()
            if cmnd in cmnd_set:
                logger.error(f"CMND trùng lặp tại dòng {index + 8}: {cmnd}")
                raise HTTPException(status_code=400, detail=f"CMND trùng lặp tại dòng {index + 8}: {cmnd}")
            cmnd_set.add(cmnd)
            for col in score_columns:
                if pd.notna(row[col]):
                    score = float(row[col])
                    if not (0 <= score <= 10):
                        logger.error(f"Điểm không hợp lệ tại dòng {index + 8}, cột {col}: {score}")
                        raise HTTPException(status_code=400, detail=f"Điểm không hợp lệ tại dòng {index + 8}, cột {col}: {score}")
        
        # Bước 4: Lưu dữ liệu
        logger.info("Lưu dữ liệu vào database")
        inserted_rows = 0
        total_rows = len(df)
        for index, row in df.iterrows():
            data = {
                "name": str(row["name"]).strip(),
                "class_name": str(row["class_name"]).strip(),
                "cmnd": str(row["cmnd"]).strip(),
                "council_code": str(row["council_code"]).strip() if pd.notna(row["council_code"]) else None,
                "gender": str(row["gender"]).strip() if pd.notna(row["gender"]) else None,
                "dob": str(row["dob"]).strip() if pd.notna(row["dob"]) else None,
                "birth_place": str(row["birth_place"]).strip() if pd.notna(row["birth_place"]) else None,
                "ethnicity": str(row["ethnicity"]).strip() if pd.notna(row["ethnicity"]) else None,
                "math_score": float(row["math_score"]) if pd.notna(row["math_score"]) else None,
                "literature_score": float(row["literature_score"]) if pd.notna(row["literature_score"]) else None,
                "physics_score": float(row["physics_score"]) if pd.notna(row["physics_score"]) else None,
                "chemistry_score": float(row["chemistry_score"]) if pd.notna(row["chemistry_score"]) else None,
                "biology_score": float(row["biology_score"]) if pd.notna(row["biology_score"]) else None,
                "history_score": float(row["history_score"]) if pd.notna(row["history_score"]) else None,
                "geography_score": float(row["geography_score"]) if pd.notna(row["geography_score"]) else None,
                "civic_education_score": float(row["civic_education_score"]) if pd.notna(row["civic_education_score"]) else None,
                "cs_score": float(row["cs_score"]) if pd.notna(row["cs_score"]) else None,
                "itech_score": float(row["itech_score"]) if pd.notna(row["itech_score"]) else None,
                "atech_score": float(row["atech_score"]) if pd.notna(row["atech_score"]) else None,
                "foreign_language_score": float(row["foreign_language_score"]) if pd.notna(row["foreign_language_score"]) else None,
                "foreign_language": str(row["foreign_language"]).strip() if pd.notna(row["foreign_language"]) else None,
                "site": str(row["site"]).strip(),
            }
            query = students.insert().values(**data)
            await database.execute(query)
            inserted_rows += 1
            if inserted_rows % 100 == 0:
                logger.info(f"Đã lưu {inserted_rows}/{total_rows} dòng")
        
        logger.info(f"Hoàn tất import {inserted_rows} bản ghi học sinh cho cơ sở {current_user['site']}")
        return {
            "message": f"Imported {inserted_rows} student records successfully",
            "total_rows": total_rows,
            "inserted_rows": inserted_rows
        }
    except Exception as e:
        logger.error(f"Lỗi khi import Excel: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi khi import Excel: {str(e)}")