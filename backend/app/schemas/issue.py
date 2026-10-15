
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class IssueCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=10, max_length=5000)
    category: str = Field(default="Other", max_length=100)
    location: str = Field(min_length=2, max_length=200)


class IssueStatusUpdate(BaseModel):
    status: str


class IssueResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    location: str
    priority: str
    status: str
    predicted_category: str | None
    reporter_id: int | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
