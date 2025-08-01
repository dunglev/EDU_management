from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from config.logging import setup_logging, logger
from config.database import database
from routes.auth import router as auth_router
from routes.student import router as student_router
from routes.import_data import router as import_data
from routes.report import router as report_router

# Thiết lập logging
setup_logging()

# Khởi tạo ứng dụng FastAPI
app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Kết nối database
@app.on_event("startup")
async def startup():
    try:
        await database.connect()                
        logger.info("Kết nối cơ sở dữ liệu thành công")
    except Exception as e:
        logger.error(f"Lỗi khi kết nối cơ sở dữ liệu: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown():
    try:
        await database.disconnect()
        logger.info("Ngắt kết nối cơ sở dữ liệu")
    except Exception as e:
        logger.error(f"Lỗi khi ngắt kết nối cơ sở dữ liệu: {str(e)}")

# Đăng ký các router
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(student_router, prefix="/students", tags=["students"])
app.include_router(import_data, prefix="/import_data", tags=["import_data"])
app.include_router(report_router, prefix="/report", tags=["report"])

# Trang chủ
@app.get("/", response_class=HTMLResponse)
async def root():
    try:
        with open("static/index.html", encoding='utf-8') as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        logger.error("Không tìm thấy index.html")
        raise HTTPException(status_code=500, detail="Không tìm thấy file index.html")