from fastapi import HTTPException, Header
from config.settings import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from config.logging import logger
import jwt
from datetime import datetime, timedelta
from typing import Optional

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        logger.warning("Không có header ủy quyền được cung cấp")
        raise HTTPException(status_code=401, detail="Không có token")
    try:
        token = authorization.replace("Bearer ", "")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        site: str = payload.get("site")
        if username is None or role is None or site is None:
            logger.warning("Payload token không hợp lệ")
            raise HTTPException(status_code=401, detail="Token không hợp lệ")
        return {"username": username, "role": role, "site": site}
    except jwt.ExpiredSignatureError:
        logger.warning("Token đã hết hạn")
        raise HTTPException(status_code=401, detail="Token đã hết hạn")
    except jwt.InvalidTokenError:
        logger.warning("Token không hợp lệ")
        raise HTTPException(status_code=401, detail="Token không hợp lệ")