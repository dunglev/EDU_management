#EDU_management

# Tạo môi trường ảo (tùy chọn, nhưng khuyến nghị)
python -m venv venv
source venv/bin/activate  # Trên Windows: venv\Scripts\activate

# Cài đặt tất cả các thư viện cần thiết
pip install fastapi uvicorn pandas openpyxl sqlalchemy python-jose[cryptography] passlib[bcrypt] python-multipart psycopg2-binary
pip install databases
pip install asyncmy
pip install python-dotenv

# tạo cơ sở dữ liệu trên MySQL, chú ý chọn bảng mã utf8_unicode_ci khi tạo cở sở dữ liệu school_db_new
mysqldump school_db_new > SQL\mysql_dump_data_17-7-2025.sql


# Chạy chương trình
uvicorn main:app --reload --log-level debug --host 0.0.0.0 --port 8000

# usename và passowrd chạy thử
    usename:admin    
    passowrd:123

