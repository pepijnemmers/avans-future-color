import { WeatherService } from "../../services/WeatherService.js";

/**
 * @returns {template} The template with the weather panel
 */
export function renderWeatherPanel(location) {
    const template = document.createElement("template");
    template.innerHTML = `
        <div class="card">
            <h2>Locatie van de menghallen</h2>

            <form data-action="weather" class="flex gap-2 mt-2">
                <input 
                    type="text" 
                    id="location" 
                    name="location"
                    value="${location || ""}" 
                    placeholder="Vul een stad in (bijv. Utrecht) of 'mijn locatie'" 
                    class="w-full !pl-8 bg-no-repeat bg-[length:1.5rem_1.5rem] bg-[position:0.3rem_50%] bg-[url('/src/assets/images/location.svg')]"
                />
                <button type="submit" class="btn-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </button>
            </form>
                   
            ${getWeather()}
        </div>    
    `;
    return template;
}

// Service
const weatherService = WeatherService.getInstance();

function getWeather() {
    const weather = weatherService.getWeather();
    if (!weather || weather.length === 0) {
        return `<p class="text-center text-gray-600 italic m-0 pt-4">Geen weergegevens gevonden</p>`;
    } else {
        return `
            <div class="flex items-center gap-4 mt-4">
                <div class="flex flex-col items-center">
                    <img src="${weather.current.condition.icon}" 
                        alt="${weather.current.condition.text}" 
                        class="w-14 h-14 -my-4 object-contain">
                    <span class="font-bold text-gray-600 pt-1">
                        ${weather.current.temp_c}°C
                    </span>
                </div>
                <div>
                    ${getWeatherDependency(weather)}
                </div>
            </div>
        `;
    }
}

function getWeatherDependency() {
    if (weatherService.isRainingOrSnowing()) {
        return "De machines hebben 10% meer mengtijd vanwege het weer.";
    } else if (weatherService.isAbove35degrees()) {
        return "Er mag maximaal 1 machine draaien vanwege het weer.";
    } else if (weatherService.isBelow10degrees()) {
        return "De machines hebben 15% meer mengtijd vanwege het weer.";
    }
    return "Er zijn geen beïnvloedingen door het weer.";
}
