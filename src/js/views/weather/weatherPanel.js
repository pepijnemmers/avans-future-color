/**
 * @returns {template} The template with the weather panel
 */
export function renderWeatherPanel() {
    const template = document.createElement("template");
    template.innerHTML = `
        <div class="card">
            <h2>Weerbericht</h2>
            <p>Selecteer de locatie van de menghallen.</p>
            <div id="weather">
                <!-- Weather input for location, temperature, and effect will be loaded here dynamically -->
                <p class="text-center text-gray-600 italic py-4">De weer API kan niet geladen worden</p>
            </div>
        </div>    
    `;
    return template;
}
