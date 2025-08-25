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

    setStatus("Searching...");
});