console.clear();
console.log("[boot] app.js loaded", new Date().toISOString());

function setStatus(msg)   { results.innerHTML = `<p>${msg}</p>`; }
function showLoading(msg = "Loading…") { results.innerHTML = `<p role="status">${msg}</p>`; }
function showError(msg)   { results.innerHTML = `<p role="alert">${msg}</p>`; }

//Cache elements
const form = document.getElementById("search-form");
const input = document.getElementById("q");
const results = document.getElementById("results");

//Small helpers (rendering stubs)
function setStatus(msg) { results.innerHTML = `<p>${msg}</p>`; }
function clearResults() { results.innerHTML = ""; }

//Submit Handler
/*
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

        const weather = await fetchCurrentWeather(place.lat, place.lon);
        console.log(weather);
        setStatus("Weather data fetched. Rendering...");
    })();
*/

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const q = (input.value || "").trim();
        console.log("[submit] q =", q);
        if (!q) {
            setStatus("Please enter a city (e.g., London or London,UK)");
            return;
        }

        try {
            showLoading("Searching...");
            const place = await fetchCoords(q);
            console.log("[geocode] place =", place);
            setStatus(
                `Found ${place.name}${place.state ? ", " + place.state : ""}, ${place.country}. Fetching weather…`
            );

            showLoading("Fetching current weather…");
            const weather = await fetchCurrentWeather(place.lat, place.lon);
            console.log("[weather] data =", weather);
            setStatus("Weather data fetched. Rendering…");
            renderWeatherCard(place, weather);
        } 
        catch (err) {
            console.error("[error] ", err);
            showError(err.message || "Something went wrong.");
        }
    });

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

    async function fetchCurrentWeather(lat, lon) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OWM_API_KEY}`;
        const resp = await fetch(url, { method: "GET" });

        if (!resp.ok) throw new Error(`Weather fetch failed: ${resp.statusText}`);
        const data = await resp.json();

        //Pull a few fields
        const city = data.name;
        const tempC = Math.round(data.main?.temp);
        const humidity = data.main?.humidity;
        const wind = data.wind?.speed;
        const desc = data.weather?.[0]?.description || "";
        const icon = data.weather?.[0]?.icon || "";
        return {city, tempC, humidity, wind, desc, icon};

    }

    function renderWeatherCard(place, weather) {
        const loc = `${place.name}${place.state ? ", " + place.state : ""}, ${place.country}`;

        const iconURL = weather.icon ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png` : "";

        results.innerHTML = `
            <article class="card" aria-label="Current weather">
                <header>
                    <h2>${loc}</h2>
                    <p>${weather.desc}</p>
                </header>
                <div class="row">
                    <div class="tempt">
                        <div class="big">${weather.tempC}&deg;C</div>
                        ${iconURL ? `<img src="${iconURL}}" alt="Icon: ${weather.desc}"` : ""}
                        </div>
                        <ul class="meta">
                            <li><strong>Humidity:</strong> ${weather.humidity}%</li>
                            <li><strong>Wind:</strong> ${weather.wind} m/s</li>
                        </ul>
                    </div>
                </div>
            </article>
        `;
    }
//});