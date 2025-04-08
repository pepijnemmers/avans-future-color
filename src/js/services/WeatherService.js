import { StorageService } from "../services/LocalStorageService.js";

const apiKey = "66fe9b18d6534f7d8e4110228250804";
const storageService = new StorageService();
const storageKey = "weather";

export class WeatherService {
    static instance;

    constructor() {
        if (WeatherService.instance) {
            return WeatherService.instance;
        }
        WeatherService.instance = this;
        this.weather = storageService.loadFromLocalStorage(storageKey);
    }

    /**
     * Get the singleton instance of the WeatherService
     * @returns {WeatherService}
     */
    static getInstance() {
        if (!WeatherService.instance) {
            WeatherService.instance = new WeatherService();
        }
        return WeatherService.instance;
    }

    /**
     * Get the weather data for saved location
     * @returns {object} The weather object
     */
    getWeather() {
        return this.weather;
    }

    /**
     * Get the weather data for a specific location
     * @param {string} location
     * @returns {object} The weather object
     */
    async getWeatherByLocation(location) {
        const url = `http://api.weatherapi.com/v1/current.json?lang=nl&key=${apiKey}&q=${location}`;

        return fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .catch((error) => {
                console.error("Error fetching weather data:", error);
            });
    }

    /**
     * Save the weather data to local storage
     * @param {object} weather
     * @returns {object} The weather object
     */
    saveWeatherToLocalStorage(weather) {
        this.weather = weather;
        storageService.saveToLocalStorage(storageKey, this.weather);

        return this.weather;
    }

    /**
     * Get the weather data for a specific location and save it to local storage
     * @param {string} location
     */
    async saveWeatherByLocation(location) {
        const weather = await this.getWeatherByLocation(location);

        if (weather) {
            this.weather = weather;
            this.saveWeatherToLocalStorage(weather);
        }

        return this.weather;
    }

    /**
     * Resets the weather to null
     */
    clearWeather() {
        this.weather = null;
        storageService.saveToLocalStorage(storageKey, this.weather);
    }

    /**
     * Check if the weather is raining or snowing
     * @returns {boolean} True if it is raining or snowing, false otherwise
     */
    isRainingOrSnowing() {
        if (!this.weather) return false;
        return this.weather?.current?.precip_mm > 0;
    }

    /**
     * Check if the weather is above 35 degrees Celsius
     * @returns {boolean} True if the temperature is above 35 degrees Celsius, false otherwise
     */
    isAbove35degrees() {
        if (!this.weather) return false;
        return this.weather?.current?.temp_c > 35;
    }

    /**
     * Check if the weather is below 10 degrees Celsius
     * @returns {boolean} True if the temperature is below 10 degrees Celsius, false otherwise
     */
    isBelow10degrees() {
        if (!this.weather) return false;
        return this.weather?.current?.temp_c < 10;
    }
}
