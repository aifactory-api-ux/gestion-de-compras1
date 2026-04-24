from fastapi import APIRouter, Depends, HTTPException, status
from datetime import timedelta

from backend.shared.models import TokenResponse, LoginRequest
from backend.shared.config import JWT_EXPIRE_MINUTES
from backend.auth_service.service import (
    get_auth_service,
    AuthService,
    create_access_token,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, auth_service: AuthService = Depends(get_auth_service)):
    user = auth_service.authenticate_user(request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=JWT_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "rol": user.rol},
        expires_delta=access_token_expires,
    )

    auth_service.create_session(user, access_token)

    return TokenResponse(access_token=access_token, token_type="bearer")
