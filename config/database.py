from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from databases import Database
from config.logging import logger
from config.metadata import metadata
from models.tables import users, students, teachers, ScoreAvg, ExamBlock

# Cấu hình MySQL
DATABASE_URL = f"mysql+asyncmy://root:@localhost/school_db_new?charset=utf8mb4"
database = Database(DATABASE_URL)

# Tạo engine và bảng
try:
    engine = create_engine(DATABASE_URL.replace("asyncmy", "pymysql").replace("?charset=utf8mb4", ""))
    metadata.create_all(engine)
    logger.info("Bảng cơ sở dữ liệu được tạo thành công")
except Exception as e:
    logger.error(f"Lỗi khi tạo engine cơ sở dữ liệu: {str(e)}")
    raise

# Tạo session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)