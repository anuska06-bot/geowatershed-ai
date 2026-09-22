from typing import List, Dict, Any
from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/economics", tags=["Economic Feasibility"])

class EconomicParams(BaseModel):
    number_of_interventions: int = Field(default=25, ge=1)
    field_visits_per_year: int = Field(default=6, ge=1)
    cost_per_manual_visit_inr: float = Field(default=3500.0, ge=100.0) # Travel, DA, fuel, surveyor time
    digital_review_time_savings_pct: float = Field(default=65.0, ge=0.0, le=95.0) # Percentage of routine visits replaced by targeted audit
    platform_annual_cost_inr: float = Field(default=75000.0, ge=0.0) # Hosting, maintenance, satellite data prep

class SensitivityRow(BaseModel):
    scenario: str
    manual_cost_inr: float
    hybrid_cost_inr: float
    net_savings_inr: float
    roi_pct: float

class EconomicCalculationResult(BaseModel):
    conventional_annual_monitoring_cost_inr: float
    geowatershed_hybrid_cost_inr: float
    estimated_annual_cost_difference_inr: float
    estimated_roi_pct: float
    payback_period_months: float
    sensitivity_analysis: List[SensitivityRow]
    disclaimer: str

@router.post("/calculate", response_model=EconomicCalculationResult)
def calculate_economic_feasibility(params: EconomicParams):
    """
    Computes an illustrative cost-benefit comparison between conventional
    un-targeted physical inspection versus GeoWatershed AI evidence-targeted monitoring.
    """
    # Conventional Cost = structures * visits * cost_per_visit
    conventional_cost = params.number_of_interventions * params.field_visits_per_year * params.cost_per_manual_visit_inr
    
    # Hybrid monitoring: routine visits reduced by digital_review_time_savings_pct, plus platform cost
    physical_visits_retained = 1.0 - (params.digital_review_time_savings_pct / 100.0)
    reduced_field_cost = conventional_cost * physical_visits_retained
    hybrid_cost = reduced_field_cost + params.platform_annual_cost_inr

    savings = conventional_cost - hybrid_cost
    roi = round((savings / params.platform_annual_cost_inr * 100), 1) if params.platform_annual_cost_inr > 0 else 0.0
    
    payback_months = round((params.platform_annual_cost_inr / (savings / 12.0)), 1) if savings > 0 else 999.0

    # Sensitivity Analysis: Base, -20% visit cost, +20% visit cost, -15% savings efficiency
    sensitivity = [
        SensitivityRow(
            scenario="Optimistic (+20% Travel Cost Escalation)",
            manual_cost_inr=round(conventional_cost * 1.2, 0),
            hybrid_cost_inr=round(reduced_field_cost * 1.2 + params.platform_annual_cost_inr, 0),
            net_savings_inr=round(conventional_cost * 1.2 - (reduced_field_cost * 1.2 + params.platform_annual_cost_inr), 0),
            roi_pct=round(((conventional_cost * 1.2 - (reduced_field_cost * 1.2 + params.platform_annual_cost_inr)) / params.platform_annual_cost_inr) * 100, 1)
        ),
        SensitivityRow(
            scenario="Base Baseline Scenario",
            manual_cost_inr=round(conventional_cost, 0),
            hybrid_cost_inr=round(hybrid_cost, 0),
            net_savings_inr=round(savings, 0),
            roi_pct=roi
        ),
        SensitivityRow(
            scenario="Conservative (-20% Field Cost)",
            manual_cost_inr=round(conventional_cost * 0.8, 0),
            hybrid_cost_inr=round(reduced_field_cost * 0.8 + params.platform_annual_cost_inr, 0),
            net_savings_inr=round(conventional_cost * 0.8 - (reduced_field_cost * 0.8 + params.platform_annual_cost_inr), 0),
            roi_pct=round(((conventional_cost * 0.8 - (reduced_field_cost * 0.8 + params.platform_annual_cost_inr)) / params.platform_annual_cost_inr) * 100, 1)
        )
    ]

    return EconomicCalculationResult(
        conventional_annual_monitoring_cost_inr=round(conventional_cost, 2),
        geowatershed_hybrid_cost_inr=round(hybrid_cost, 2),
        estimated_annual_cost_difference_inr=round(savings, 2),
        estimated_roi_pct=roi,
        payback_period_months=min(60.0, max(0.0, payback_months)),
        sensitivity_analysis=sensitivity,
        disclaimer="Illustrative estimate based on user-provided operational assumptions. Does not guarantee market savings or replacement of statutory audits."
    )
