from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Project, Intervention, FieldEvidence, Watershed
from pydantic import BaseModel
from datetime import date

router = APIRouter(prefix="/projects", tags=["Projects"])

class ProjectSummary(BaseModel):
    id: str
    watershed_id: str
    watershed_code: str
    name: str
    scheme_name: str
    status: str
    sanctioned_budget_inr: float
    expenditure_inr: float
    budget_utilization_pct: float
    start_date: date
    target_date: date | None = None
    description: str | None = None
    total_structures: int
    completed_structures: int

    class Config:
        from_attributes = True

@router.get("", response_model=List[ProjectSummary])
def list_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    result = []
    for p in projects:
        ws = db.query(Watershed).filter(Watershed.id == p.watershed_id).first()
        interventions = db.query(Intervention).filter(Intervention.project_id == p.id).all()
        total_struct = len(interventions)
        completed_struct = sum(1 for i in interventions if i.status in ("Completed", "Operational"))
        
        utilization = round((p.expenditure_inr / p.sanctioned_budget_inr * 100), 1) if p.sanctioned_budget_inr > 0 else 0.0

        result.append(ProjectSummary(
            id=p.id,
            watershed_id=p.watershed_id,
            watershed_code=ws.code if ws else "Unknown",
            name=p.name,
            scheme_name=p.scheme_name,
            status=p.status,
            sanctioned_budget_inr=p.sanctioned_budget_inr,
            expenditure_inr=p.expenditure_inr,
            budget_utilization_pct=utilization,
            start_date=p.start_date,
            target_date=p.target_date,
            description=p.description,
            total_structures=total_struct,
            completed_structures=completed_struct
        ))
    return result
