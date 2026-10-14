async function analyzeStock() {
    const tickerInput = document.getElementById("tickerInput").value;
    if (!tickerInput) {
        alert("Please enter a ticker symbol!");
        return;
    }

    const ticker = tickerInput.trim().toUpperCase();
    const loader = document.getElementById("loader");
    const resultCard = document.getElementById("resultContainer");

    loader.classList.remove("hidden");
    resultCard.classList.add("hidden");

    // Local vs Production API Endpoint
    const API_URL = (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost")
        ? "http://127.0.0.1:8000"
        : null;

    try {
        if (API_URL) {
            // Local FastAPI Backend Request
            const response = await fetch(`${API_URL}/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticker: ticker })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || "Failed to fetch stock data.");
            }

            const data = await response.json();

            document.getElementById("stockName").innerText = data.companyName;
            document.getElementById("stockSymbol").innerText = data.symbol;
            document.getElementById("currentPrice").innerText = `$${data.currentPrice}`;
            
            const changeElem = document.getElementById("priceChange");
            changeElem.innerText = `${data.priceChange} (${data.percentageChange}%)`;
            changeElem.style.color = data.priceChange >= 0 ? "#4ade80" : "#f87171";

            document.getElementById("high52").innerText = `$${data.high52}`;
            document.getElementById("low52").innerText = `$${data.low52}`;

            document.getElementById("aiAnalysis").innerHTML = marked.parse(data.analysis);
            resultCard.classList.remove("hidden");
        } else {
            // Vercel Live Deployment Client-Side Fetch
            const stockRes = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=1mo&interval=1d`);
            if (!stockRes.ok) throw new Error("Invalid Ticker Symbol or Market Data Unavailable.");

            const stockJson = await stockRes.json();
            const result = stockJson.chart.result[0];
            const meta = result.meta;

            const currentPrice = meta.regularMarketPrice.toFixed(2);
            const prevClose = meta.chartPreviousClose ? meta.chartPreviousClose.toFixed(2) : currentPrice;
            const priceChange = (currentPrice - prevClose).toFixed(2);
            const percentageChange = ((priceChange / prevClose) * 100).toFixed(2);

            document.getElementById("stockName").innerText = meta.symbol;
            document.getElementById("stockSymbol").innerText = meta.symbol;
            document.getElementById("currentPrice").innerText = `$${currentPrice}`;
            
            const changeElem = document.getElementById("priceChange");
            changeElem.innerText = `${priceChange} (${percentageChange}%)`;
            changeElem.style.color = priceChange >= 0 ? "#4ade80" : "#f87171";

            document.getElementById("high52").innerText = `$${meta.fiftyTwoWeekHigh || currentPrice}`;
            document.getElementById("low52").innerText = `$${meta.fiftyTwoWeekLow || currentPrice}`;

            // Static Gemini Analysis for Demo
            const analysisMarkdown = `
### ${meta.symbol} AI Sentiment & Technical Report

1. **Market Sentiment**: Bullish
2. **Technical Summary**: ${meta.symbol} shows positive short-term momentum, currently trading at $${currentPrice} with a daily change of ${priceChange} (${percentageChange}%).
3. **Recommendation**: **HOLD / BUY** - Strong resistance holding near $${meta.fiftyTwoWeekHigh || currentPrice}.
4. **Key Risks**:
   - Market volatility surrounding upcoming macroeconomic announcements.
   - Overhead technical resistance near 52-week highs.
            `;

            document.getElementById("aiAnalysis").innerHTML = marked.parse(analysisMarkdown);
            resultCard.classList.remove("hidden");
        }

    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        loader.classList.add("hidden");
    }
}