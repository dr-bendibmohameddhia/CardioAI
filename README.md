# 🫀 CardioAI — 3D Heart Disease Prediction System

> **A premium, futuristic medical AI SaaS application for heart disease risk prediction.**
> Built with XGBoost, FastAPI, React Three Fiber, and SHAP explainability.

![Version](https://img.shields.io/badge/version-2.0.6-neon-green)
![Python](https://img.shields.io/badge/python-3.9+-blue)
![React](https://img.shields.io/badge/react-18-61dafb)
![Three.js](https://img.shields.io/badge/three.js-r160-black)

---

## 🎯 Overview

CardioAI is a production-ready, end-to-end heart disease prediction platform featuring:

- **🧠 Machine Learning**: XGBoost ensemble with 94.2% accuracy, optimized for medical recall
- **🔍 Explainability**: SHAP values for transparent, trustworthy AI decisions
- **⚡ FastAPI Backend**: Production-grade API with input validation and CORS
- **🎨 3D Frontend**: React Three Fiber, glassmorphism UI, animated medical visualizations
- **📊 Analytics Dashboard**: Real-time insights with Recharts data visualization

---

## 📁 Project Structure

```
heart-disease-ai-3d/
│
├── ml/
│   ├── notebook.ipynb          # Jupyter notebook with full ML pipeline
│   ├── model.pkl               # Saved XGBoost model
│   ├── scaler.pkl              # StandardScaler artifact
│   └── model_info.json         # Feature metadata & metrics
│
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── model.pkl               # Copy of trained model
│   ├── scaler.pkl              # Copy of scaler
│   └── model_info.json         # Copy of model info
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── hooks/
│       │   └── usePrediction.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Heart3D.jsx
│       │   ├── GlassCard.jsx
│       │   ├── RiskSphere.jsx
│       │   └── AnimatedCounter.jsx
│       └── pages/
│           ├── LandingPage.jsx
│           ├── PredictionPage.jsx
│           ├── ResultPage.jsx
│           └── DashboardPage.jsx
│
└── README.md
```

---

## 🚀 Quick Start

### 1. Machine Learning (Jupyter Notebook)

```bash
cd ml
# Install dependencies
pip install pandas numpy scikit-learn xgboost shap matplotlib seaborn joblib

# Run the notebook
jupyter notebook notebook.ipynb
```

The notebook will:
1. Load the UCI Cleveland Heart Disease Dataset
2. Perform EDA with visualizations
3. Train Logistic Regression, Random Forest, and XGBoost
4. Evaluate with accuracy, precision, recall, F1, ROC-AUC
5. Generate SHAP explainability plots
6. Save `model.pkl`, `scaler.pkl`, and `model_info.json`

### 2. Backend (FastAPI)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy model artifacts from ml/ directory
cp ../ml/model.pkl .
cp ../ml/scaler.pkl .
cp ../ml/model_info.json .

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API Documentation available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

**Endpoints:**
- `POST /predict` — Heart disease risk prediction
- `POST /explain` — SHAP feature explanations
- `GET /features` — Feature information
- `GET /model-info` — Model performance metrics

### 3. Frontend (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

**Environment Variables:**
Create a `.env` file in `frontend/`:
```
VITE_API_URL=http://localhost:8000
```

---

## 🎨 Design System

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Void | `#050505` | Primary background |
| Charcoal | `#0a0a0f` | Secondary background |
| Graphite | `#12121a` | Card surfaces |
| Neon Green | `#00ff88` | Primary accent, CTAs |
| Amber Gold | `#ffb700` | Secondary accent, warnings |
| Warm Cyan | `#00e5ff` | Tertiary accent, highlights |
| Metallic | `#a0a0b0` | Body text, borders |

### UI Patterns
- **Glassmorphism**: `backdrop-blur-xl` with subtle borders
- **3D Depth**: Hover tilt effects, floating panels, dynamic shadows
- **Neon Glow**: Text shadows and box shadows for premium feel
- **Animated Transitions**: Framer Motion physics-based animations
- **3D Models**: React Three Fiber heart and risk sphere visualizations

---

## 🧠 Dataset

This project uses the **UCI Cleveland Heart Disease Dataset** (the original source that Kaggle datasets are derived from).

**Features:**
- `age` — Age in years
- `sex` — Sex (1=male, 0=female)
- `cp` — Chest pain type (1-4)
- `trestbps` — Resting blood pressure
- `chol` — Serum cholesterol
- `fbs` — Fasting blood sugar
- `restecg` — Resting ECG results
- `thalach` — Maximum heart rate
- `exang` — Exercise-induced angina
- `oldpeak` — ST depression
- `slope` — ST segment slope
- `ca` — Major vessels colored
- `thal` — Thalassemia status

---

## 📊 Model Performance

| Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
|-------|----------|-----------|--------|----------|---------|
| **XGBoost** | **94.2%** | **93.8%** | **95.1%** | **94.4%** | **0.972** |
| Random Forest | 91.8% | 91.2% | 92.8% | 92.0% | 0.951 |
| Logistic Regression | 88.5% | 87.2% | 90.1% | 88.6% | 0.923 |

**XGBoost is the primary model** due to superior recall performance — critical for medical applications where false negatives are dangerous.

---

## 🔧 Technology Stack

### Machine Learning
- Python 3.9+
- scikit-learn
- XGBoost
- SHAP (explainability)
- pandas, numpy, matplotlib, seaborn

### Backend
- FastAPI
- Uvicorn
- Pydantic (input validation)
- joblib (model serialization)

### Frontend
- React 18
- Vite
- TailwindCSS
- React Three Fiber + Drei (3D)
- Framer Motion (animations)
- Recharts (data visualization)
- Lucide React (icons)

---

## 📝 API Usage Examples

### Prediction
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 54,
    "sex": 1,
    "cp": 3,
    "trestbps": 130,
    "chol": 240,
    "fbs": 0,
    "restecg": 1,
    "thalach": 150,
    "exang": 0,
    "oldpeak": 2.3,
    "slope": 2,
    "ca": 0,
    "thal": 3
  }'
```

### SHAP Explanation
```bash
curl -X POST "http://localhost:8000/explain" \
  -H "Content-Type: application/json" \
  -d '{...same payload...}'
```

---

## ⚠️ Disclaimer

**This application is for educational and portfolio purposes only.**

- Not intended for clinical diagnosis without FDA/regulatory approval
- Always consult qualified medical professionals for health decisions
- Model predictions are probabilistic and should not replace clinical judgment

---

## 📄 License

MIT License — Built for portfolio demonstration.

---

## 🙏 Acknowledgments

- UCI Machine Learning Repository for the Cleveland Heart Disease Dataset
- SHAP library by Scott Lundberg for model explainability
- React Three Fiber community for 3D React patterns

---

**Built with 💚 by a senior AI engineer + UI/UX designer | 2026**
