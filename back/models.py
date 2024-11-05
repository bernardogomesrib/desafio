from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone
from uuid import uuid4
import bson

class MessageModel(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid4()), alias="_id")
    message: str
    isMyMessage: Optional[bool] = Field(default=True)
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ChatModel(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid4()), alias="_id")
    name: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    messages: Optional[list[MessageModel]] = Field(default_factory=list, exclude=True)