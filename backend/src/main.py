
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from dotenv import load_dotenv
import os

from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise ValueError("Supabase URL and Anon Key must be set in .env file")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

app = FastAPI(
    title="BeatMM Pro Backend API",
    description="API for BeatMM Pro music streaming platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get current user
async def get_current_user(token: str = Depends(lambda x: x.headers.get("Authorization"))):
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization header missing")
    try:
        # Remove "Bearer " prefix
        token = token.replace("Bearer ", "")
        user_response = supabase.auth.get_user(token)
        if user_response.user:
            # Fetch user profile from 'users' table
            user_profile = supabase.from("users").select("*").eq("id", user_response.user.id).single().execute()
            if user_profile.data:
                return user_profile.data
            else:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found")
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

# Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    username: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfileUpdate(BaseModel):
    username: Optional[str] = None
    avatar_url: Optional[str] = None

class TrackCreate(BaseModel):
    title: str
    artist: str
    description: Optional[str] = None
    audio_url: str
    cover_url: Optional[str] = None
    duration: int
    genre: str
    tags: List[str] = []
    is_vip_only: bool = False

class CommentCreate(BaseModel):
    content: str
    track_id: str

class VipPurchaseCreate(BaseModel):
    plan_type: str  # e.g., monthly, yearly, lifetime
    amount: float

class WalletRecharge(BaseModel):
    amount: float

class LiveStreamCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str

class DjApplicationCreate(BaseModel):
    real_name: str
    experience: str
    portfolio_url: Optional[str] = None

class AdminTrackUpdate(BaseModel):
    is_approved: Optional[bool] = None
    is_vip_only: Optional[bool] = None

# Routes
@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to BeatMM Pro API!"}

# Auth Routes
@app.post("/auth/register", tags=["Auth"])
async def register_user(user: UserCreate):
    try:
        # Sign up user with Supabase Auth
        auth_response = supabase.auth.sign_up({"email": user.email, "password": user.password})
        if auth_response.user:
            # Create user profile in 'users' table
            user_profile_data = {
                "id": auth_response.user.id,
                "email": user.email,
                "username": user.username,
                "is_vip": False,
                "wallet_balance": 100, # New user bonus
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            }
            supabase.from("users").insert(user_profile_data).execute()
            return {"message": "User registered successfully. Please check your email for verification.", "user_id": auth_response.user.id}
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=auth_response.session.user.identities[0].identity_data)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@app.post("/auth/login", tags=["Auth"])
async def login_user(user: UserLogin):
    try:
        auth_response = supabase.auth.sign_in_with_password({"email": user.email, "password": user.password})
        if auth_response.user:
            return {"message": "Login successful", "access_token": auth_response.session.access_token, "token_type": "bearer"}
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@app.post("/auth/logout", tags=["Auth"])
async def logout_user(current_user: dict = Depends(get_current_user)):
    try:
        supabase.auth.sign_out()
        return {"message": "Logout successful"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# User Routes
@app.get("/users/me", tags=["Users"])
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    return current_user

@app.put("/users/me", tags=["Users"])
async def update_my_profile(profile_update: UserProfileUpdate, current_user: dict = Depends(get_current_user)):
    try:
        update_data = profile_update.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.now().isoformat()
        response = supabase.from("users").update(update_data).eq("id", current_user["id"]).execute()
        return {"message": "Profile updated successfully", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.get("/users/{user_id}/tracks", tags=["Users"])
async def get_user_tracks(user_id: str):
    try:
        response = supabase.from("tracks").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.get("/users/me/history", tags=["Users"])
async def get_my_play_history(current_user: dict = Depends(get_current_user)):
    try:
        # This would typically involve a 'play_history' table linked to users and tracks
        # For now, returning a placeholder
        return {"message": "Play history feature coming soon", "user_id": current_user["id"]}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.get("/users/me/favorites", tags=["Users"])
async def get_my_favorites(current_user: dict = Depends(get_current_user)):
    try:
        response = supabase.from("likes").select("track_id").eq("user_id", current_user["id"]).execute()
        track_ids = [item["track_id"] for item in response.data]
        if track_ids:
            tracks_response = supabase.from("tracks").select("*").in_("id", track_ids).execute()
            return tracks_response.data
        return []
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# Tracks Routes
@app.post("/tracks", tags=["Tracks"])
async def upload_track(track: TrackCreate, current_user: dict = Depends(get_current_user)):
    try:
        track_data = track.dict()
        track_data["user_id"] = current_user["id"]
        track_data["plays_count"] = 0
        track_data["likes_count"] = 0
        track_data["created_at"] = datetime.now().isoformat()
        track_data["updated_at"] = datetime.now().isoformat()
        response = supabase.from("tracks").insert(track_data).execute()
        return {"message": "Track uploaded successfully", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.get("/tracks", tags=["Tracks"])
async def get_tracks(query: Optional[str] = None, genre: Optional[str] = None, limit: int = 20, offset: int = 0):
    try:
        tracks_query = supabase.from("tracks").select("*")
        if query:
            tracks_query = tracks_query.or_(f"title.ilike.%{query}%", f"artist.ilike.%{query}%", f"tags.cs.{{\"{query}\"}}")
        if genre:
            tracks_query = tracks_query.eq("genre", genre)
        response = tracks_query.order("created_at", desc=True).range(offset, offset + limit - 1).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.get("/tracks/{track_id}", tags=["Tracks"])
async def get_track_details(track_id: str):
    try:
        response = supabase.from("tracks").select("*").eq("id", track_id).single().execute()
        if response.data:
            return response.data
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Track not found")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/tracks/{track_id}/comments", tags=["Tracks"])
async def add_comment_to_track(track_id: str, comment: CommentCreate, current_user: dict = Depends(get_current_user)):
    try:
        comment_data = {
            "track_id": track_id,
            "user_id": current_user["id"],
            "content": comment.content,
            "created_at": datetime.now().isoformat()
        }
        response = supabase.from("comments").insert(comment_data).execute()
        return {"message": "Comment added successfully", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.get("/tracks/{track_id}/comments", tags=["Tracks"])
async def get_track_comments(track_id: str):
    try:
        response = supabase.from("comments").select("*, users(username, avatar_url)").eq("track_id", track_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/tracks/{track_id}/like", tags=["Tracks"])
async def like_track(track_id: str, current_user: dict = Depends(get_current_user)):
    try:
        # Check if already liked
        existing_like = supabase.from("likes").select("id").eq("track_id", track_id).eq("user_id", current_user["id"]).single().execute()
        if existing_like.data:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Track already liked by this user")

        # Add like
        supabase.from("likes").insert({"track_id": track_id, "user_id": current_user["id"], "created_at": datetime.now().isoformat()}).execute()
        # Increment likes_count in tracks table (using RPC for atomic update)
        supabase.rpc("increment_likes_count", {"track_id": track_id}).execute()
        return {"message": "Track liked successfully"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/tracks/{track_id}/unlike", tags=["Tracks"])
async def unlike_track(track_id: str, current_user: dict = Depends(get_current_user)):
    try:
        # Check if liked
        existing_like = supabase.from("likes").select("id").eq("track_id", track_id).eq("user_id", current_user["id"]).single().execute()
        if not existing_like.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Track not liked by this user")

        # Remove like
        supabase.from("likes").delete().eq("track_id", track_id).eq("user_id", current_user["id"]).execute()
        # Decrement likes_count in tracks table (using RPC for atomic update)
        supabase.rpc("decrement_likes_count", {"track_id": track_id}).execute()
        return {"message": "Track unliked successfully"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# VIP Routes
@app.post("/vip/purchase", tags=["VIP"])
async def purchase_vip(vip_purchase: VipPurchaseCreate, current_user: dict = Depends(get_current_user)):
    try:
        # Deduct from wallet (simplified, real implementation needs more checks)
        user_profile = supabase.from("users").select("wallet_balance").eq("id", current_user["id"]).single().execute().data
        if not user_profile or user_profile["wallet_balance"] < vip_purchase.amount:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient wallet balance")

        new_balance = user_profile["wallet_balance"] - vip_purchase.amount
        supabase.from("users").update({"wallet_balance": new_balance}).eq("id", current_user["id"]).execute()

        # Update VIP status and record purchase
        expires_at = None
        if vip_purchase.plan_type == "monthly":
            expires_at = (datetime.now() + timedelta(days=30)).isoformat()
        elif vip_purchase.plan_type == "yearly":
            expires_at = (datetime.now() + timedelta(days=365)).isoformat()
        # For lifetime, expires_at remains None or a very distant future date

        supabase.from("users").update({"is_vip": True, "vip_expires_at": expires_at}).eq("id", current_user["id"]).execute()
        supabase.from("vip_purchases").insert({
            "user_id": current_user["id"],
            "plan_type": vip_purchase.plan_type,
            "amount": vip_purchase.amount,
            "expires_at": expires_at,
            "created_at": datetime.now().isoformat()
        }).execute()

        # Record wallet transaction
        supabase.from("wallet_transactions").insert({
            "user_id": current_user["id"],
            "type": "payment",
            "amount": -vip_purchase.amount,
            "description": f"购买VIP套餐: {vip_purchase.plan_type}",
            "created_at": datetime.now().isoformat()
        }).execute()

        return {"message": "VIP purchased successfully"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# Wallet Routes
@app.post("/wallet/recharge", tags=["Wallet"])
async def recharge_wallet(recharge: WalletRecharge, current_user: dict = Depends(get_current_user)):
    try:
        user_profile = supabase.from("users").select("wallet_balance").eq("id", current_user["id"]).single().execute().data
        if not user_profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found")

        new_balance = user_profile["wallet_balance"] + recharge.amount
        supabase.from("users").update({"wallet_balance": new_balance}).eq("id", current_user["id"]).execute()

        supabase.from("wallet_transactions").insert({
            "user_id": current_user["id"],
            "type": "recharge",
            "amount": recharge.amount,
            "description": f"钱包充值: {recharge.amount}",
            "created_at": datetime.now().isoformat()
        }).execute()

        return {"message": "Wallet recharged successfully", "new_balance": new_balance}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.get("/wallet/transactions", tags=["Wallet"])
async def get_wallet_transactions(current_user: dict = Depends(get_current_user)):
    try:
        response = supabase.from("wallet_transactions").select("*").eq("user_id", current_user["id"]).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# Live Stream Routes
@app.post("/live/streams", tags=["Live Streams"])
async def create_live_stream(stream: LiveStreamCreate, current_user: dict = Depends(get_current_user)):
    try:
        stream_data = stream.dict()
        stream_data["dj_id"] = current_user["id"]
        stream_data["is_live"] = True
        stream_data["viewers_count"] = 0
        stream_data["started_at"] = datetime.now().isoformat()
        stream_data["created_at"] = datetime.now().isoformat()
        response = supabase.from("live_streams").insert(stream_data).execute()
        return {"message": "Live stream created successfully", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.get("/live/streams", tags=["Live Streams"])
async def get_live_streams(is_live: Optional[bool] = None, category: Optional[str] = None):
    try:
        streams_query = supabase.from("live_streams").select("*, users(username, avatar_url)")
        if is_live is not None:
            streams_query = streams_query.eq("is_live", is_live)
        if category:
            streams_query = streams_query.eq("category", category)
        response = streams_query.order("started_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/live/streams/{stream_id}/end", tags=["Live Streams"])
async def end_live_stream(stream_id: str, current_user: dict = Depends(get_current_user)):
    try:
        # Only the DJ who started the stream can end it
        stream = supabase.from("live_streams").select("dj_id").eq("id", stream_id).single().execute().data
        if not stream or stream["dj_id"] != current_user["id"]:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to end this stream")

        supabase.from("live_streams").update({"is_live": False, "ended_at": datetime.now().isoformat()}).eq("id", stream_id).execute()
        return {"message": "Live stream ended"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# DJ Routes
@app.post("/dj/apply", tags=["DJ"])
async def apply_for_dj(application: DjApplicationCreate, current_user: dict = Depends(get_current_user)):
    try:
        application_data = application.dict()
        application_data["user_id"] = current_user["id"]
        application_data["status"] = "pending"
        application_data["created_at"] = datetime.now().isoformat()
        response = supabase.from("dj_applications").insert(application_data).execute()
        return {"message": "DJ application submitted successfully", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.get("/dj/status", tags=["DJ"])
async def get_dj_status(current_user: dict = Depends(get_current_user)):
    try:
        response = supabase.from("dj_applications").select("*").eq("user_id", current_user["id"]).order("created_at", desc=True).limit(1).single().execute()
        if response.data:
            return response.data
        return {"status": "not_applied"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# Admin Routes (requires admin role, not implemented yet)
@app.get("/admin/users", tags=["Admin"])
async def get_all_users(current_user: dict = Depends(get_current_user)):
    # Placeholder for admin check
    if not current_user.get("is_admin"): # Assume an 'is_admin' field in user profile
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    try:
        response = supabase.from("users").select("*").order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.put("/admin/tracks/{track_id}", tags=["Admin"])
async def update_track_by_admin(track_id: str, update_data: AdminTrackUpdate, current_user: dict = Depends(get_current_user)):
    # Placeholder for admin check
    if not current_user.get("is_admin"): 
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    try:
        response = supabase.from("tracks").update(update_data.dict(exclude_unset=True)).eq("id", track_id).execute()
        return {"message": "Track updated by admin", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.get("/admin/dj_applications", tags=["Admin"])
async def get_dj_applications(status: Optional[str] = None, current_user: dict = Depends(get_current_user)):
    # Placeholder for admin check
    if not current_user.get("is_admin"): 
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    try:
        query = supabase.from("dj_applications").select("*, users(username, email)")
        if status:
            query = query.eq("status", status)
        response = query.order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/admin/dj_applications/{application_id}/approve", tags=["Admin"])
async def approve_dj_application(application_id: str, current_user: dict = Depends(get_current_user)):
    # Placeholder for admin check
    if not current_user.get("is_admin"): 
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    try:
        # Update application status
        supabase.from("dj_applications").update({"status": "approved"}).eq("id", application_id).execute()
        
        # Get user_id from application and update user role/status
        application_data = supabase.from("dj_applications").select("user_id").eq("id", application_id).single().execute().data
        if application_data and application_data["user_id"]:
            supabase.from("users").update({"is_dj": True}).eq("id", application_data["user_id"]).execute() # Assume 'is_dj' field

        return {"message": "DJ application approved"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# Database functions (RPC calls)
# These functions need to be created as SQL functions in Supabase
# For example, for increment_play_count:
# CREATE OR REPLACE FUNCTION increment_play_count(track_id_param uuid)
# RETURNS void LANGUAGE plpgsql AS $$
# BEGIN
#   UPDATE tracks SET plays_count = plays_count + 1 WHERE id = track_id_param;
# END;
# $$;

# For increment_likes_count:
# CREATE OR REPLACE FUNCTION increment_likes_count(track_id_param uuid)
# RETURNS void LANGUAGE plpgsql AS $$
# BEGIN
#   UPDATE tracks SET likes_count = likes_count + 1 WHERE id = track_id_param;
# END;
# $$;

# For decrement_likes_count:
# CREATE OR REPLACE FUNCTION decrement_likes_count(track_id_param uuid)
# RETURNS void LANGUAGE plpgsql AS $$
# BEGIN
#   UPDATE tracks SET likes_count = likes_count - 1 WHERE id = track_id_param;
# END;
# $$;

from datetime import timedelta


