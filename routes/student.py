from fastapi import APIRouter, HTTPException, Depends
from config.database import database, students
from config.logging import logger
from config.jwt import get_current_user
from sqlalchemy.sql import select, func, and_
from typing import Optional

router = APIRouter()

@router.get("/search")
async def search_students(
    page: int = 1,
    page_size: int = 30,
    name: Optional[str] = None,
    class_name: Optional[str] = None,
    cmnd: Optional[str] = None,
    council_code: Optional[str] = None,
    math_min: Optional[float] = None,
    math_max: Optional[float] = None,
    literature_min: Optional[float] = None,
    literature_max: Optional[float] = None,
    foreign_language_min: Optional[float] = None,
    foreign_language_max: Optional[float] = None,
    current_user: dict = Depends(get_current_user)
):
    try:
        offset = (page - 1) * page_size
        conditions = []
        
        #if current_user["role"] != "admin":
        #    conditions.append(students.c.site == current_user["site"])        

        conditions.append(students.c.site == current_user["site"])        
        if name:
            conditions.append(students.c.name.ilike(f"%{name}%"))
        if class_name:
            conditions.append(students.c.class_name.ilike(f"%{class_name}%"))
        if cmnd:
            conditions.append(students.c.cmnd.ilike(f"%{cmnd}%"))
        if council_code:
            conditions.append(students.c.council_code.ilike(f"%{council_code}%"))        
        if math_min is not None:
            conditions.append(students.c.math_score >= math_min)
        if math_max is not None:
            conditions.append(students.c.math_score <= math_max)
        if literature_min is not None:
            conditions.append(students.c.literature_score >= literature_min)
        if literature_max is not None:
            conditions.append(students.c.literature_score <= literature_max)
        if foreign_language_min is not None:
            conditions.append(students.c.foreign_language_score >= foreign_language_min)
        if foreign_language_max is not None:
            conditions.append(students.c.foreign_language_score <= foreign_language_max)
        
        query = students.select()
        if conditions:
            query = query.where(and_(*conditions))
        query = query.offset(offset).limit(page_size)
        
        students_list = await database.fetch_all(query)
        
        count_query = select(func.count()).select_from(students)
        if conditions:
            count_query = count_query.where(and_(*conditions))
        total_records = await database.fetch_val(count_query)
        total_pages = (total_records + page_size - 1) // page_size
        
        logger.info(f"Tìm kiếm học sinh bởi {current_user['username']} tại cơ sở {current_user['site']}, kết quả: {len(students_list)} bản ghi")
        return {
            "students": [dict(student) for student in students_list],
            "total_records": total_records,
            "total_pages": total_pages,
            "current_page": page
        }
    except Exception as e:
        logger.error(f"Lỗi khi tìm kiếm học sinh: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi khi tìm kiếm học sinh: {str(e)}")

@router.get("/paginated")
async def get_students_paginated(page: int = 1, page_size: int = 30, current_user: dict = Depends(get_current_user)):
    try:
        offset = (page - 1) * page_size
        query = students.select().where(students.c.site == current_user["site"]).offset(offset).limit(page_size)
        #if current_user["role"] == "admin":
        #    query = students.select().offset(offset).limit(page_size)
        students_list = await database.fetch_all(query)
        total_query = f"SELECT COUNT(*) FROM students WHERE site = :site"
        total_params = {"site": current_user["site"]}
        if current_user["role"] == "admin":
            total_query = "SELECT COUNT(*) FROM students"
            total_params = {}
        total_result = await database.fetch_one(total_query, total_params)
        total_records = total_result[0]
        total_pages = (total_records + page_size - 1) // page_size
        
        return {
            "students": [dict(student) for student in students_list],
            "total_records": total_records,
            "total_pages": total_pages,
            "current_page": page
        }
    except Exception as e:
        logger.error(f"Lỗi khi lấy danh sách học sinh phân trang: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi khi lấy danh sách học sinh: {str(e)}")

@router.get("/")
async def get_students(current_user: dict = Depends(get_current_user)):
    try:
        query = students.select().where(students.c.site == current_user["site"])
        students_list = await database.fetch_all(query)
        if not students_list:
            logger.info(f"Không có dữ liệu học sinh cho cơ sở {current_user['site']}")
            return {"message": "No data available"}
        return [dict(student) for student in students_list]
    except Exception as e:
        logger.error(f"Lỗi khi lấy danh sách học sinh: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi khi lấy danh sách học sinh: {str(e)}")