from fastapi import APIRouter, HTTPException
from models.user import LoginInput, UserInput, UserResponse
from config.database import database, users
from config.jwt import create_access_token
from config.logging import logger
from passlib.context import CryptContext

router = APIRouter()

# Mã hóa mật khẩu
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/login", response_model=UserResponse)
async def login(user: LoginInput):
    try:
        query = users.select().where(users.c.username == user.username)
        db_user = await database.fetch_one(query)
        if not db_user or not pwd_context.verify(user.password, db_user["password"]):
            logger.warning(f"Đăng nhập không hợp lệ cho {user.username}")
            raise HTTPException(status_code=401, detail="Thông tin đăng nhập không hợp lệ")
        token = create_access_token({"sub": db_user["username"], "role": db_user["role"], "site": str(db_user["site"])})
        logger.info(f"Đăng nhập thành công cho {user.username} tại cơ sở {db_user['site']}")
        return {
            "username": db_user["username"],
            "role": db_user["role"],
            "site": db_user["site"],
            "token": token
        }    
    except Exception as e:
        logger.error(f"Lỗi khi đăng nhập: {str(e)}")
        raise HTTPException(status_code=500, detail="Lỗi hệ thống khi đăng nhập")

@router.post("/register")
async def register(user: UserInput):
    try:
        if not user.username.strip():
            logger.error("Tên người dùng không được để trống")
            raise HTTPException(status_code=400, detail="Tên người dùng không được để trống")
        if not user.site.strip():
            logger.error("Cơ sở không được để trống")
            raise HTTPException(status_code=400, detail="Cơ sở không được để trống")
        if user.password != user.confirm_password:
            logger.warning(f"Mật khẩu không khớp cho {user.username}")
            raise HTTPException(status_code=400, detail="Mật khẩu không khớp")
        query = users.select().where(users.c.username == user.username)
        if await database.fetch_one(query):
            logger.warning(f"Tên người dùng {user.username} đã tồn tại")
            raise HTTPException(status_code=400, detail="Tên người dùng đã tồn tại")
                
        hashed_password = pwd_context.hash(user.password)
        query = users.insert().values(
            username=user.username,
            password=hashed_password,
            role="user",
            site=user.site
        )
        await database.execute(query)
        logger.info(f"Đăng ký thành công cho {user.username} tại cơ sở {user.site}")
        return {"message": f"Đăng ký thành công cho {user.username}"}
    except Exception as e:
        logger.error(f"Lỗi khi đăng ký: {str(e)}")
        raise HTTPException(status_code=500, detail="Lỗi hệ thống khi đăng ký")