// Local testing Backend URL
const API_URL = "https://ai-trading-agent-woad.vercel.app";

async function analyzeStock() {
    const ticker = document.getElementById("tickerInput").value;
    if (!ticker) {
        alert("Please enter a ticker symbol!");
        return;
    }

    const loader = document.getElementById("loader");
    const resultCard = document.getElementById("resultContainer");

    loader.classList.remove("hidden");
    resultCard.classList.add("hidden");

    try {
        const response = await fetch(`${API_URL}/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ticker: ticker })
        });

        if (!response.ok) {
            throw new Error("Failed to fetch stock data or invalid ticker.");
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

        // Render AI analysis Markdown
        document.getElementById("aiAnalysis").innerHTML = marked.parse(data.analysis);

        resultCard.classList.remove("hidden");
    } catch (err) {
        alert(err.message);
    } finally {
        loader.classList.add("hidden");
    }
}