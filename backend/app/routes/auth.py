import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import User
from app.schemas import UserLoginRequest, UserRegisterRequest, UserResponse, TokenResponse
from app.utils import AuthService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(request: UserRegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user
    
    Args:
        request: Registration request with email, password, name
        db: Database session
        
    Returns:
        Token response with access and refresh tokens
        
    Raises:
        HTTPException: If email already exists
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        logger.warning(f"Registration attempt with existing email: {request.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    try:
        # Create new user
        hashed_password = AuthService.hash_password(request.password)
        new_user = User(
            email=request.email,
            password_hash=hashed_password,
            name=request.name
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        logger.info(f"New user registered: {new_user.email}")
        
        # Generate tokens
        tokens = AuthService.create_token_pair(new_user.id, new_user.email)
        
        return tokens
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error during registration: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error during registration"
        )

@router.post("/login", response_model=TokenResponse)
async def login(request: UserLoginRequest, db: Session = Depends(get_db)):
    """
    Login user and get tokens
    
    Args:
        request: Login request with email and password
        db: Database session
        
    Returns:
        Token response with access and refresh tokens
        
    Raises:
        HTTPException: If credentials invalid or user not found
    """
    # Find user by email
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        logger.warning(f"Login attempt with non-existent email: {request.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not AuthService.verify_password(request.password, user.password_hash):
        logger.warning(f"Failed login attempt for: {request.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )
    
    logger.info(f"User logged in: {user.email}")
    
    # Generate tokens
    tokens = AuthService.create_token_pair(user.id, user.email)
    
    return tokens

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(authorization: str = None, db: Session = Depends(get_db)):
    """
    Refresh access token using refresh token
    
    Args:
        authorization: Bearer token header
        db: Database session
        
    Returns:
        New token pair
        
    Raises:
        HTTPException: If refresh token invalid
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )
    
    # Extract token from "Bearer <token>"
    try:
        token = authorization.split(" ")[1]
    except IndexError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format"
        )
    
    # Verify refresh token
    token_data = AuthService.verify_token(token, token_type="refresh")
    
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    
    # Verify user still exists and is active
    user = db.query(User).filter(User.id == token_data.user_id).first()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or disabled"
        )
    
    # Create new token pair
    tokens = AuthService.create_token_pair(user.id, user.email)
    
    logger.info(f"Token refreshed for: {user.email}")
    
    return tokens

@router.get("/me", response_model=UserResponse)
async def get_current_user(authorization: str = None, db: Session = Depends(get_db)):
    """
    Get current authenticated user profile
    
    Args:
        authorization: Bearer token from header
        db: Database session
        
    Returns:
        Current user information
        
    Raises:
        HTTPException: If not authenticated
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )
    
    # Extract token
    try:
        token = authorization.split(" ")[1]
    except IndexError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format"
        )
    
    # Verify access token
    token_data = AuthService.verify_token(token, token_type="access")
    
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    # Get user
    user = db.query(User).filter(User.id == token_data.user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout():
    """
    Logout user (client-side token invalidation)
    
    Note: Actual implementation would involve token blacklisting
    For now, this is a placeholder for client to clear tokens
    """
    return None
