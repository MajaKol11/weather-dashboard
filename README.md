Search a city and view current weather (°C, description + icon, humidity, wind). Built with plain HTML/CSS/JS and the OpenWeather API.

Features:
    Search by City or City,CountryCode (e.g., Paris,FR)
    Geocoding → current weather fetch
    Loading and error states (with ARIA roles)
    Result card with temperature (°C), description, icon, humidity, wind (m/s)
    Remembers your last successful query in localStorage

Tech Stack:
    HTML, CSS, vanilla JS
    OpenWeather Geocoding + Current Weather APIs
    No build tools required

Prerequisites:
    A free OpenWeather API key
    VS Code with Live Server extension (Ritwick Dey), or Python for simple local server

Setup:
    1. Clone and open repo in VS Code
    2. Create local config (ignored by Git)
        a. Copy src/config.example.js 
        b. Create config.example.js (or simply config.js) into the src folder
        c. Paste your key (Can get one for free from openweathermap.org)
            ->    const OMW_API_KEY = "YOUR_KEY"; 
        d. Keep src/config.js out of Git (already in .gitignore)
    
    3. Run locally
        a. With live server
            VS Code -> right-click on src/index.html -> Open with Live Server (Extension required)
        b. With python
            ->  cd src
            -> python -m http.server 5500
            Visit http://localhost:5500
    
Usage:
    1. Type a city (London) or City,CountryCode (London,GB) into input field.
    2. Select unti (°C or F)
    3. Search
    4. App shows:
        City, Country, and State if present
        Temperature, Description, and Icon
        Humidity (%), wind (m/s)
    Last successfull search is prefilled on reload.