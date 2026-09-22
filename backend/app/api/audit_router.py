from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import AuditLog
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/audit-logs", tags=["Audit & Security"])

class AuditLogItem(BaseModel):
    id: str
    user_name: str
    role: str
    action: str
    resource_type: str
    resource_id: str
    details: dict
    timestamp: datetime

    class Config:
        from_attributes = True

@router.get("", response_model=List[AuditLogItem])
def list_audit_logs(limit: int = 50, db: Session = Depends(get_db)):
    """Returns immutable security and operational audit trail."""
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
