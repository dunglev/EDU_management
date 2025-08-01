# Tạo môi trường ảo (tùy chọn, nhưng khuyến nghị)
python -m venv venv
source venv/bin/activate  # Trên Windows: venv\Scripts\activate

# Cài đặt tất cả các thư viện cần thiết
pip install fastapi uvicorn pandas openpyxl sqlalchemy python-jose[cryptography] passlib[bcrypt] python-multipart psycopg2-binary
pip install databases
pip install asyncmy
pip install python-dotenv

# Chạy chương trình
uvicorn main:app --reload --log-level debug --host 0.0.0.0 --port 8000

#bổ sung thêm chức năng
    1-Thống kê số thí sinh: 
        +Điểm tốt nghiệp loại giỏi
        +Điểm tốt nghiệp loại khá
        +Điểm Tốt nghiệp lại trung bình
        +Trượt tốt nghiệp
    3-Tống số học sinh miễn môn thi ngoại ngữ


#các môn thi 
    Toán
    Văn
    Lý
    Hóa
    Sinh
    Sử
    Địa
    GDCD
    NN
    Tin
    CNCN
    CNNN   