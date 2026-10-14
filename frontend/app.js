async function analyzeStock() {
    const tickerInput = document.getElementById("tickerInput").value;
    if (!tickerInput) {
        alert("Please enter a ticker symbol!");
        return;
    }

    const ticker = tickerInput.upperCase ? tickerInput.toUpperCase().trim() : tickerInput.trim();
    const loader = document.getElementById("loader");
    const resultCard = document.getElementById("resultContainer");

    loader.classList.remove("hidden");
    resultCard.classList.add("hidden");

    try {
        // Fetch Real-time Stock Data via Yahoo Finance Public API
        const stockResponse = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=1mo&interval=1d`);
        
        if (!stockResponse.ok) {
            throw new Error("Invalid Ticker Symbol or Market Data Unavailable.");
        }

        const stockJson = await stockResponse.json();
        const meta = stockJson.chart.result[0].meta;
        const prices = stockJson.chart.result[0].indicators.quote[0].close;

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

        // Direct Gemini AI Analysis via REST API
        const GEMINI_KEY = "YOUR_GEMINI_API_KEY_HERE"; // Paste your key here
        
        const promptText = `Analyze stock ${meta.symbol} at $${currentPrice} (${priceChange}% today). Provide: 1. Sentiment 2. Technical Summary 3. Recommendation (BUY/HOLD/SELL) 4. Key Risks. Keep it concise.`;

        const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const aiData = await aiResponse.json();
        const analysisText = aiData.candidates[0].content.parts[0].text;

        document.getElementById("aiAnalysis").innerHTML = marked.parse(analysisText);
        resultCard.classList.remove("hidden");

    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        loader.classList.add("hidden");
    }
}