# 📈 AI Agent for Trading

An autonomous AI trading assistant built with Python FastAPI, Google Gemini API, and Yahoo Finance to deliver real-time financial data, technical indicator analysis, and structured trade recommendations.

---

## 🎯 Problem Statement
Retail traders and individual investors often struggle to process real-time market data, technical movements, and risk factors simultaneously, leading to delayed or emotionally biased trading decisions.

## 👥 Target Users
- Retail stock and crypto traders.
- Financial market enthusiasts and students.
- Individual investors seeking quick AI-driven risk analysis.

## 🚀 Key Features
- **Real-Time Data**: Fetches latest stock prices, daily price/percentage changes, and 52-week highs/lows.
- **AI Sentiment Analysis**: Powered by Google Gemini to analyze market trends and technical momentum.
- **Actionable Insights**: Generates clear Buy/Hold/Sell recommendations alongside risk factors.
- **Modern Dashboard**: Responsive and minimal dark-mode user interface.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: HTML5, CSS3, JavaScript (Fetch API, Marked.js)
- **Backend**: Python 3.10+, FastAPI, Uvicorn
- **AI / LLM Integration**: Google Gemini API (`google-genai` SDK)
- **Financial Data API**: Yahoo Finance (`yfinance`)
- **Hosting**: Vercel (Frontend), Render (Backend)

---

## 💻 Local Setup Instructions

### Prerequisites
- Python 3.10 or higher
- Git installed on your local machine
- Free Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/muhammadihtisham125/ai-trading-agent.git
   cd ai-trading-agent