console.clear();
console.log("[boot] app.js loaded", new Date().toISOString());

function showLoading(msg = "Loading…") { results.innerHTML = `<p role="status">${msg}</p>`; }
function showError(msg)   { results.innerHTML = `<p role="alert">${msg}</p>`; }

//Cache elements
const form = document.getElementById("search-form");
const input = document.getElementById("q");
const results = document.getElementById("results");

//Unit controls
const unitRadios = document.querySelectorAll('input[name="unit"]');
let unit = "C";  //Current display unit
let lastPlace = null;
let lastWeather = null;

//Load last unit preference if saved
try {
    const savedUnit = localStorage.getItem("lastUnit");
    if (savedUnit === "C" || savedUnit === "F")
    {
        unit = savedUnit;
        unitRadios.forEach(radio => 
            radio.checked = (radio.value === unit)
        )
    }
} catch {}

//When the user changes unit, remember it and re-render current card
unitRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
        unit = e.target.value;
        try {
            localStorage.setItem("lastUnit", unit);
        } catch {}
        if (lastPlace && lastWeather) {
            renderWeatherCard(lastPlace, lastWeather);
        }
    });
});

//Pre-fill the search input with the last query
try {
    const last = localStorage.getItem("lastQuery");
    if (last && last !== "[object HTMLInputElement]") 
    {
        input.value = last;
    } 
    else 
    {
        localStorage.removeItem("lastQuery");
    }
} catch {}

//Small helpers (rendering stubs)
function setStatus(msg) { results.innerHTML = `<p>${msg}</p>`; }
function clearResults() { results.innerHTML = ""; }

const toF = (c) => Math.round((c * 9/5) + 32);
const toMph = (mps) => Math.round(mps * 2.23694);

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    //Input is trimmed, leading/trailing spaces are removed. (" New York,US " => "New York,US")
    const raw = (input.value || "").trim(); 
    const normalized = raw
        .replace(/\s*,\s*/g, ",") //Removes spaces around commas ("New York , US" => "New York,US")
        .replace(/\s+/g, " "); //Removes unnecessary spaces ("New  York,US" => "New York,US")

    if (normalized !== raw) input.value = normalized; //If the normalized value is different from the original, update the input.

    const query = normalized;
    if (!query) {
        setStatus("Please enter a city (e.g., London or London,UK)");
        return;
    }

    try {
        showLoading("Searching...");
        const place = await fetchCoords(query);
        console.log("[geocode] place =", place);
        setStatus(
            `Found ${place.name}${place.state ? ", " + place.state : ""}, ${place.country}. Fetching weather…`
        );

        showLoading("Fetching current weather…");
        const weather = await fetchCurrentWeather(place.lat, place.lon);
        console.log("[weather] data =", weather);
        setStatus("Weather data fetched. Rendering…");
        lastPlace = place;
        lastWeather = weather;
        renderWeatherCard(place, weather);
        try { localStorage.setItem("lastQuery", query); } catch {}
    } 
    catch (err) {
        console.error("[error] ", err);
        showError(err.message || "Something went wrong.");
    }
});

async function fetchCoords(query) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${OWM_API_KEY}`;
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
    lastPlace = place;
    lastWeather = weather;

    const loc = `${place.name}${place.state ? ", " + place.state : ""}, ${place.country}`;
    const iconURL = weather.icon ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png` : "";

    const symbol = unit ==="F" ? "°F" : "°C";
    const temp = unit === "F" ? toF(weather.tempC) : weather.tempC;
    const windStr = unit === "F" ? `${toMph(weather.wind)} mph` : `${weather.wind} m/s`;

    results.innerHTML = `
        <article class="card" aria-label="Current weather">
            <header>
                <h2>${loc}</h2>
                <p>${weather.desc}</p>
            </header>
            <div class="row">
                <div class="temp">
                    <div class="big">${temp}${symbol}</div>
                    ${iconURL ? `<img src="${iconURL}" alt="Icon: ${weather.desc}" />` : ""}
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

