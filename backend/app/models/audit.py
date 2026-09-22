from datetime import datetime
import uuid
from sqlalchemy import Column, String, DateTime, Text, JSON
from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_name = Column(String(100), default="System")
    role = Column(String(50), default="ANALYST")
    action = Column(String(100), nullable=False) # EVIDENCE_UPLOAD, REVIEW_DECISION, CONSISTENCY_FLAG
    resource_type = Column(String(50), nullable=False) # field_evidence, project, intervention
    resource_id = Column(String(36), nullable=False)
    details = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.utcnow)
