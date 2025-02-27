import { StorageService } from "../services/LocalStorageService.js";

const storageService = new StorageService();
const storageKey = "ingredients";

export class ColorService {
    static instance;

    constructor() {
        if (ColorService.instance) {
            return ColorService.instance;
        }
        ColorService.instance = this;
    }

    /**
     * Get the singleton instance of the ColorService
     * @returns {ColorService}
     */
    static getInstance() {
        if (!ColorService.instance) {
            ColorService.instance = new ColorService();
        }
        return ColorService.instance;
    }

    /**
     * Get the selected color format from local storage
     * @returns {string} color format
     */
    getColorFormat() {
        return storageService.loadFromLocalStorage("colorFormat");
    }

    /**
     * Get color in the saved format from local storage
     * @param {string} hexColor
     */
    colorToSelectedFormat(hexColor) {
        const format = this.getColorFormat();
        const formatFunctions = {
            rgb: this.hexToRgb,
            hsl: this.hexToHsl,
        };
        return formatFunctions[format]?.call(this, hexColor) || hexColor;
    }

    /**
     * Convert hex color to rgb format
     * @param {string} hexColor
     * @returns {string} rgb color
     */
    hexToRgb(hexColor) {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
    }

    /**
     * Convert hex color to hsl format
     * @param {string} hexColor
     * @returns {string} hsl color
     */
    hexToHsl(hexColor) {
        const r = parseInt(hexColor.slice(1, 3), 16) / 255;
        const g = parseInt(hexColor.slice(3, 5), 16) / 255;
        const b = parseInt(hexColor.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h,
            s,
            l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h = (h / 6) * 360;
        }

        // Round to max 3 decimal places
        h = h.toFixed(0);
        s = (s * 100).toFixed(0);
        l = (l * 100).toFixed(0);

        return `hsl(${h}deg, ${s}%, ${l}%)`;
    }
}
