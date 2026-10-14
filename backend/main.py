import os
import json
import urllib.request
import urllib.parse
import yfinance as yf
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Trading Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class StockRequest(BaseModel):
    ticker: str

@app.get("/")
def read_root():
    return {"status": "AI Trading Agent API is running"}

@app.post("/analyze")
def analyze_stock(req: StockRequest):
    ticker_symbol = req.ticker.upper().strip()
    
    if not ticker_symbol:
        raise HTTPException(status_code=400, detail="Ticker symbol cannot be empty.")

    try:
        stock = yf.Ticker(ticker_symbol)
        hist = stock.history(period="1mo")
        info = stock.info

        if hist.empty or len(hist) < 1:
            raise HTTPException(status_code=404, detail=f"No stock data found for ticker '{ticker_symbol}'.")

        current_price = round(float(hist['Close'].iloc[-1]), 2)
        prev_close = round(float(hist['Close'].iloc[-2]), 2) if len(hist) > 1 else current_price
        price_change = round(current_price - prev_close, 2)
        percentage_change = round((price_change / prev_close) * 100, 2)
        
        high_52 = info.get('fiftyTwoWeekHigh', 'N/A')
        low_52 = info.get('fiftyTwoWeekLow', 'N/A')
        market_cap = info.get('marketCap', 'N/A')
        company_name = info.get('shortName') or info.get('longName') or ticker_symbol

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Market Data Error: {str(e)}")

    ai_recommendation = "Gemini API key is missing."
    
    if GEMINI_API_KEY:
        try:
            prompt = f"""
            You are an expert AI Stock Analyst.
            Analyze stock data for '{company_name} ({ticker_symbol})':
            - Current Price: ${current_price}
            - Daily Change: ${price_change} ({percentage_change}%)
            - 52-Week High: ${high_52}
            - 52-Week Low: ${low_52}

            Provide formatted Markdown response:
            1. **Market Sentiment**: Bullish, Bearish, or Neutral
            2. **Technical Summary**: Short commentary.
            3. **Recommendation**: BUY, HOLD, or SELL with brief reasoning.
            4. **Key Risks**: 2 bullet points.
            """

            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            headers = {'Content-Type': 'application/json'}
            data = json.dumps({
                "contents": [{"parts": [{"text": prompt}]}]
            }).encode('utf-8')

            req_obj = urllib.request.Request(url, data=data, headers=headers)
            with urllib.request.urlopen(req_obj) as response:
                result = json.loads(response.read().decode('utf-8'))
                ai_recommendation = result['candidates'][0]['content']['parts'][0]['text']

        except Exception as e:
            ai_recommendation = f"AI Analysis Error: {str(e)}"

    return {
        "symbol": ticker_symbol,
        "companyName": company_name,
        "currentPrice": current_price,
        "priceChange": price_change,
        "percentageChange": percentage_change,
        "high52": high_52,
        "low52": low_52,
        "marketCap": market_cap,
        "analysis": ai_recommendation
    }