console.log("app.js loaded");

//Cache elements
const form = document.getElementById("search-form");
const input = document.getElementById("q");
const results = document.getElementById("results");

//Small helpers (rendering stubs)
function setStatus(msg) { results.innerHTML = `<p>${msg}</p>`; }
function clearResults() { results.innerHTML = ""; }

//Submit Handler
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = (input.value || "").trim();

    if (!q) {
        setStatus("Please enter a city (e.g. London or London,UK)");
        return; 
    }

    (async () => {
        try {
            setStatus("Searching...");
            const place = await fetchCoords(q);
            setStatus(`Found ${place.name}${place.state ? "," + place.state : ""} ${place.country}. Fetching weather...`)
        }
        catch (err) {
            setStatus(err.message || "Failed to search location.");
        }
    })();


    async function fetchCoords(q) {
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=1&appid=${OWM_API_KEY}`;
        const resp = await fetch(url, { method: "GET" });

        if (!resp.ok) throw new Error(`Geocoding failed: ${resp.statusText}`);
        const data = await resp.json();

        if (!Array.isArray(data) || data.length ===0) 
        {
            throw new Error("City not found. Try City or City,CountryCode (e.g. London,UK)");
        }

        const {lat, lon, name, country, state} = data[0];
        return {lat, lon, name, country, state};
    }
});