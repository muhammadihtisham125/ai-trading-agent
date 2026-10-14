// Dynamic API URL for Local Testing and Live Deployment
const API_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost" || window.location.protocol === "file:"
    ? "http://127.0.0.1:8000"
    : "";

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

    try {
        const response = await fetch(`${API_URL}/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ticker: ticker })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to fetch stock data.");
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

    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        loader.classList.add("hidden");
    }
}