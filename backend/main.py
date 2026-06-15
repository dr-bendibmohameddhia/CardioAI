"""
Heart Disease Prediction API
Production-ready FastAPI backend with ML model serving and SHAP explanations
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator
from typing import List, Dict, Any, Optional
import numpy as np
import joblib
import json
import os
import shap
import warnings
from contextlib import asynccontextmanager

warnings.filterwarnings('ignore')

# ──────────────────────────────────────────────────────────────
# Configuration
# ──────────────────────────────────────────────────────────────

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "scaler.pkl")
INFO_PATH = os.path.join(os.path.dirname(__file__), "model_info.json")

# ──────────────────────────────────────────────────────────────
# Lifespan (startup/shutdown events)
# ──────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML model and scaler on startup"""
    global model, scaler, feature_names, feature_descriptions, explainer

    try:
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)

        with open(INFO_PATH, 'r') as f:
            model_info = json.load(f)

        feature_names = model_info['features']
        feature_descriptions = model_info['feature_descriptions']

        # Initialize SHAP explainer
        explainer = shap.TreeExplainer(model)

        print("✅ Model, scaler, and SHAP explainer loaded successfully")

    except Exception as e:
        print(f"❌ Error loading model: {e}")
        raise

    yield

    # Cleanup (if needed)
    print("🛑 Shutting down API")

# ──────────────────────────────────────────────────────────────
# FastAPI App
# ──────────────────────────────────────────────────────────────

app = FastAPI(
    title="CardioAI - Heart Disease Prediction API",
    description="Production-grade medical AI API for heart disease risk prediction with SHAP explainability",
    version="2.0.6",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────────────────────
# Pydantic Models
# ──────────────────────────────────────────────────────────────

class PatientData(BaseModel):
    """Patient medical data for heart disease prediction"""
    age: float = Field(..., ge=0, le=120, description="Age in years")
    sex: int = Field(..., ge=0, le=1, description="Sex (1=male, 0=female)")
    cp: int = Field(..., ge=1, le=4, description="Chest pain type (1-4)")
    trestbps: float = Field(..., ge=50, le=250, description="Resting blood pressure (mm Hg)")
    chol: float = Field(..., ge=100, le=600, description="Serum cholesterol (mg/dl)")
    fbs: int = Field(..., ge=0, le=1, description="Fasting blood sugar > 120 mg/dl (1=true, 0=false)")
    restecg: int = Field(..., ge=0, le=2, description="Resting ECG results (0-2)")
    thalach: float = Field(..., ge=50, le=250, description="Maximum heart rate achieved")
    exang: int = Field(..., ge=0, le=1, description="Exercise induced angina (1=yes, 0=no)")
    oldpeak: float = Field(..., ge=0, le=10, description="ST depression induced by exercise")
    slope: int = Field(..., ge=1, le=3, description="Slope of peak exercise ST segment (1-3)")
    ca: float = Field(..., ge=0, le=3, description="Number of major vessels colored by fluoroscopy (0-3)")
    thal: float = Field(..., ge=3, le=7, description="Thalassemia (3=normal, 6=fixed, 7=reversible)")

    @validator('thal')
    def validate_thal(cls, v):
        if v not in [3, 6, 7]:
            raise ValueError('thal must be 3 (normal), 6 (fixed defect), or 7 (reversible defect)')
        return v

class PredictionResponse(BaseModel):
    prediction: int
    probability: float
    risk_level: str
    risk_color: str
    confidence: str
    message: str
    input_features: Dict[str, Any]

class SHAPExplanation(BaseModel):
    feature: str
    description: str
    value: float
    shap_value: float
    impact: str
    impact_score: float

class ExplanationResponse(BaseModel):
    prediction: int
    probability: float
    base_value: float
    shap_values: List[SHAPExplanation]
    top_positive_features: List[Dict[str, Any]]
    top_negative_features: List[Dict[str, Any]]
    summary: str

class HealthResponse(BaseModel):
    status: str
    version: str
    model_loaded: bool
    features: List[str]

# ──────────────────────────────────────────────────────────────
# Helper Functions
# ──────────────────────────────────────────────────────────────

def get_risk_level(probability: float) -> tuple:
    """Determine risk level and color based on probability"""
    if probability < 0.3:
        return "Low Risk", "#22c55e", "High Confidence"
    elif probability < 0.6:
        return "Moderate Risk", "#f59e0b", "Medium Confidence"
    elif probability < 0.8:
        return "High Risk", "#f97316", "Review Recommended"
    else:
        return "Critical Risk", "#ef4444", "Immediate Attention Required"

def prepare_features(data: PatientData) -> np.ndarray:
    """Convert patient data to model input format"""
    features = np.array([[
        data.age,
        data.sex,
        data.cp,
        data.trestbps,
        data.chol,
        data.fbs,
        data.restecg,
        data.thalach,
        data.exang,
        data.oldpeak,
        data.slope,
        data.ca,
        data.thal
    ]])
    return features

# ──────────────────────────────────────────────────────────────
# API Endpoints
# ──────────────────────────────────────────────────────────────

@app.get("/", response_model=HealthResponse, tags=["Health"])
async def root():
    """API health check and info"""
    return HealthResponse(
        status="operational",
        version="2.0.6",
        model_loaded=True,
        features=feature_names
    )

@app.get("/health", tags=["Health"])
async def health_check():
    """Simple health check endpoint"""
    return {"status": "healthy", "timestamp": "2026-06-15"}

@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
async def predict(data: PatientData):
    """
    Predict heart disease risk based on patient medical data.

    Returns:
    - prediction: 0 (no disease) or 1 (disease)
    - probability: Risk probability (0-1)
    - risk_level: Human-readable risk assessment
    - confidence: Confidence level of prediction
    """
    try:
        # Prepare features
        features = prepare_features(data)

        # Get prediction and probability
        prediction = int(model.predict(features)[0])
        probability = float(model.predict_proba(features)[0][1])

        # Determine risk level
        risk_level, risk_color, confidence = get_risk_level(probability)

        # Generate message
        if prediction == 1:
            message = f"⚠️ Heart disease detected with {probability*100:.1f}% probability. {confidence}."
        else:
            message = f"✅ No heart disease detected. Risk probability: {probability*100:.1f}%. {confidence}."

        return PredictionResponse(
            prediction=prediction,
            probability=round(probability, 4),
            risk_level=risk_level,
            risk_color=risk_color,
            confidence=confidence,
            message=message,
            input_features=data.dict()
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {str(e)}"
        )

@app.post("/explain", response_model=ExplanationResponse, tags=["Explainability"])
async def explain(data: PatientData):
    """
    Generate SHAP explanation for the prediction.

    Provides feature-level explanations showing which factors
    contributed positively or negatively to the prediction.
    """
    try:
        # Prepare features
        features = prepare_features(data)
        features_df = prepare_features(data)

        # Get prediction
        prediction = int(model.predict(features)[0])
        probability = float(model.predict_proba(features)[0][1])

        # Compute SHAP values
        shap_values = explainer.shap_values(features)

        # Handle binary classification SHAP values
        if isinstance(shap_values, list):
            shap_values = shap_values[1]  # Use class 1 (disease) SHAP values

        shap_values = shap_values.flatten()
        base_value = float(explainer.expected_value)
        if isinstance(base_value, (list, np.ndarray)):
            base_value = float(base_value[1])

        # Build explanation list
        explanations = []
        for i, feature_name in enumerate(feature_names):
            shap_val = float(shap_values[i])
            feature_val = float(features[0][i])

            if shap_val > 0:
                impact = "increases risk"
                impact_score = abs(shap_val)
            else:
                impact = "decreases risk"
                impact_score = abs(shap_val)

            explanations.append(SHAPExplanation(
                feature=feature_name,
                description=feature_descriptions.get(feature_name, feature_name),
                value=feature_val,
                shap_value=round(shap_val, 6),
                impact=impact,
                impact_score=round(impact_score, 6)
            ))

        # Sort by absolute impact
        explanations.sort(key=lambda x: abs(x.shap_value), reverse=True)

        # Top positive and negative contributors
        top_positive = [
            {"feature": e.feature, "value": e.value, "impact": e.shap_value}
            for e in explanations if e.shap_value > 0
        ][:5]

        top_negative = [
            {"feature": e.feature, "value": e.value, "impact": e.shap_value}
            for e in explanations if e.shap_value < 0
        ][:5]

        # Generate summary
        if top_positive:
            top_feature = top_positive[0]['feature']
            summary = f"The prediction is primarily driven by '{top_feature}' which increases the risk. "
        else:
            summary = "All features contribute to lowering the risk. "

        if prediction == 1:
            summary += f"Overall model confidence: {probability*100:.1f}% for heart disease presence."
        else:
            summary += f"Overall model confidence: {(1-probability)*100:.1f}% for no heart disease."

        return ExplanationResponse(
            prediction=prediction,
            probability=round(probability, 4),
            base_value=round(base_value, 6),
            shap_values=explanations,
            top_positive_features=top_positive,
            top_negative_features=top_negative,
            summary=summary
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Explanation error: {str(e)}"
        )

@app.get("/features", tags=["Info"])
async def get_features():
    """Get feature information and descriptions"""
    return {
        "features": feature_names,
        "descriptions": feature_descriptions,
        "count": len(feature_names)
    }

@app.get("/model-info", tags=["Info"])
async def get_model_info():
    """Get model performance metrics and info"""
    try:
        with open(INFO_PATH, 'r') as f:
            info = json.load(f)
        return info
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error loading model info: {str(e)}"
        )

# ──────────────────────────────────────────────────────────────
# Error Handlers
# ──────────────────────────────────────────────────────────────

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "status": "error"}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": str(exc), "status": "error"}
    )

# ──────────────────────────────────────────────────────────────
# Run (for development)
# ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
