from dotenv import load_dotenv
import os

# Tải biến môi trường
load_dotenv()

# Cấu hình JWT
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30