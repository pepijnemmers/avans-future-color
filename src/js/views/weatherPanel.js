/**
 * Renders the weather panel
 * @returns {string} HTML for the weather panel
 */
export function renderWeatherPanel() {
    return `
        <div class="card">
            <h2>Weerbericht</h2>
            <p>Selecteer de locatie van de menghallen.</p>
            <div id="weather">
                <!-- Weather input for location, temperature, and effect will be loaded here dynamically -->
            </div>
        </div>    
    `;
}
