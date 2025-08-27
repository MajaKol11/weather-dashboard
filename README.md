# Weather Dashboard (HTML/CSS/JS)

Search a city and view current weather (°C, description + icon, humidity, wind). Built with plain HTML/CSS/JS and the OpenWeather API.

## Features
- Search by City or City,CountryCode (e.g., `Paris,FR`)
- Geocoding → current weather fetch
- Loading and error states (with ARIA roles)
- Result card with temperature (°C), description, icon, humidity, wind (m/s)
- Remembers your last successful query in `localStorage`

## Tech Stack
- HTML, CSS, vanilla JS
- OpenWeather Geocoding + Current Weather APIs
- No build tools required

## Project Structure
```bash
/assets/                 
└── /src/
    ├── index.html
    ├── styles.css
    ├── app.js
    └── config.example.js   
.gitignore
README.md
```

## Prerequisites
- A free OpenWeather API key
- VS Code with Live Server extension (Ritwick Dey), or Python for a simple local server

## Setup
1. Clone and open repo in VS Code
2. Create local config (ignored by Git)  
   - a. Copy `src/config.example.js`  
   - b. Create `config.js` in the `src` folder  
   - c. Paste your key (you can get one free from openweathermap.org):  
     ```js
     const OWM_API_KEY = "YOUR_KEY";
     ```
   - d. Keep `src/config.js` out of Git (already in `.gitignore`)
3. Run locally  
   - a. With Live Server  
     &nbsp;&nbsp;&nbsp;&nbsp;In VS Code, right-click `src/index.html` → **Open with Live Server** (extension required)  
   - b. With Python
     ```bash
     cd src
     python -m http.server 5500
     ```
     Visit `http://localhost:5500`.

## Usage
1. Type a city (`London`) or `City,CountryCode` (`London,GB`) into the input field.  
2. Select unit (°C or °F).  
3. Click **Search**.  
4. The app shows:
   - City, Country, and State if present
   - Temperature (°C and F), Description, and Icon
   - Humidity (%), wind (m/s)

Last successful search is prefilled on reload.
