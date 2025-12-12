from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import asyncio
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI(
    title="CrewAI Financial Analyzer API",
    description="Financial analysis powered by CrewAI multi-agent system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class AnalysisRequest(BaseModel):
    symbol: str
    market: str = "NSE"

class MetricsData(BaseModel):
    year: str
    revenue: float
    ebitda: float
    operating_margin: float
    roe: float
    debt_to_equity: float
    working_capital_days: float
    cash_ratio: float

class Anomaly(BaseModel):
    metric: str
    severity: str  # RED, ORANGE, YELLOW
    description: str
    recommendation: str

class AnalysisResponse(BaseModel):
    symbol: str
    market: str
    metrics: List[MetricsData]
    anomalies: List[Anomaly]
    analyst_notes: str
    summary: str

# Mock financial data generator
def get_mock_financial_data(symbol: str, market: str) -> AnalysisResponse:
    """Returns mock financial data for demonstration"""
    metrics = [
        MetricsData(year="FY25", revenue=1000.5, ebitda=250.1, operating_margin=25.0, roe=15.0, debt_to_equity=0.30, working_capital_days=30, cash_ratio=1.5),
        MetricsData(year="FY24", revenue=950.2, ebitda=220.3, operating_margin=23.2, roe=14.0, debt_to_equity=0.28, working_capital_days=28, cash_ratio=1.6),
        MetricsData(year="FY23", revenue=880.7, ebitda=185.5, operating_margin=21.1, roe=12.5, debt_to_equity=0.25, working_capital_days=26, cash_ratio=1.8),
        MetricsData(year="FY22", revenue=750.3, ebitda=150.2, operating_margin=20.0, roe=11.0, debt_to_equity=0.22, working_capital_days=24, cash_ratio=2.0),
        MetricsData(year="FY21", revenue=680.1, ebitda=130.4, operating_margin=19.2, roe=10.5, debt_to_equity=0.20, working_capital_days=22, cash_ratio=2.1),
    ]
    
    anomalies = [
        Anomaly(metric="Working Capital Days", severity="RED", description="WC days increased from 26 to 30 (up 15%)", recommendation="Tighten AR collection policy"),
        Anomaly(metric="Leverage Ratio", severity="ORANGE", description="D/E ratio increased from 0.25 to 0.30", recommendation="Monitor debt levels carefully"),
    ]
    
    return AnalysisResponse(
        symbol=symbol,
        market=market,
        metrics=metrics,
        anomalies=anomalies,
        analyst_notes=f"Analysis for {symbol}. Strong revenue growth of 8% CAGR over 5 years. Operating margins expanding. Working capital management needs attention.",
        summary="Strong fundamentals with some operational concerns"
    )

@app.get("/")
async def root():
    return {"message": "CrewAI Financial Analyzer API", "version": "1.0.0"}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(request: AnalysisRequest):
    """Analyze financial data for a given stock symbol"""
    try:
        # For now, return mock data. Replace with CrewAI logic later
        result = get_mock_financial_data(request.symbol, request.market)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
