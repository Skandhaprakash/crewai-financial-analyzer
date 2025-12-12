# CrewAI Financial Analyzer - Setup Guide

## Quick Start (3 Steps)

### Step 1: Clone Repository
```bash
git clone https://github.com/Skandhaprakash/crewai-financial-analyzer.git
cd crewai-financial-analyzer
```

### Step 2: Get API Key
Choose ONE:
- **Google Gemini** (FREE): https://aistudio.google.com
- **OpenAI**: https://openai.com/api ($0.05-0.15 per query)
- **Anthropic Claude**: https://console.anthropic.com

### Step 3: Configure & Run
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your API key
nano .env  # or use your editor

# Install dependencies
pip install -r backend/requirements.txt

# Run the app
python backend/main.py
```

Application starts at: `http://localhost:8000`
Frontend: Open `frontend/index.html` in browser

## Features
- 📊 5-year financial metrics display
- 📈 6 interactive charts (revenue, margins, ROE, D/E, WC, cash)
- ⚠️ Automated anomaly detection (3 severity levels)
- 💬 AI-generated analyst insights
- 🎨 Dark/Light theme toggle
- 📱 Mobile-responsive design

## Project Structure
```
crewai-financial-analyzer/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── crews/               # CrewAI agents
│   ├── tools/               # Data fetching tools
│   ├── requirements.txt     # Dependencies
│   └── .env.example         # Config template
├── frontend/
│   ├── index.html           # Dashboard
│   ├── style.css            # Styling
│   └── script.js            # Functionality
└── Documentation files
```

## Troubleshooting
- **Port 8000 in use**: Change `API_PORT` in .env
- **API key errors**: Verify key format in .env
- **CORS issues**: Frontend and backend must be accessible

## Next Steps
- Deploy to Render, Railway, or AWS
- Integrate real financial data APIs
- Add more CrewAI agents for deeper analysis
