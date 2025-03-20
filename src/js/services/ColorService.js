import { StorageService } from "../services/LocalStorageService.js";
import { PaintBucketService } from "./PaintBucketService.js";

const bucketService = new PaintBucketService();
const storageService = new StorageService();
const storageKey = "colorFormat";
const storageKeyColorGrid = "colorGrid";

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
     * Add a color to the color grid
     * @param {string | null} bucketId
     * @param {number} colorGridId
     */
    addBucketToColorGrid(bucketId, colorGridId) {
        const bucket = bucketService.getPainBucketById(bucketId);
        const color = bucket.ingredients[0].hexColor;

        this.colorGrid = this.getColorGridItems();
        this.colorGrid[colorGridId] = color;
        storageService.saveToLocalStorage(storageKeyColorGrid, this.colorGrid);
    }

    /**
     * remove a color from the color grid
     * @param {string} colorGridId
     * @returns {string[]} array of colors in the color grid
     */
    removeColorFromColorGrid(colorGridId) {
        this.colorGrid = this.getColorGridItems();
        this.colorGrid[colorGridId] = null;
        storageService.saveToLocalStorage(storageKeyColorGrid, this.colorGrid);

        return this.colorGrid;
    }

    /**
     * Get all colors in the color grid
     * @returns {string[]} array of colors in the color grid
     */
    getColorGridItems() {
        this.colorGrid =
            storageService.loadFromLocalStorage(storageKeyColorGrid);

        if (!this.colorGrid || this.colorGrid.length !== 9) {
            this.colorGrid = Array(9).fill(null);
            storageService.saveToLocalStorage(
                storageKeyColorGrid,
                this.colorGrid
            );
        }

        return this.colorGrid;
    }

    /**
     * Mix colors together and return the result
     * @param {string[]} colors array of colors to mix (hex format)
     * @returns {string} new color after mixing (hex format)
     */
    mixColors(colors) {
        const mixChannel = (channelValues) => {
            const total = channelValues.reduce((sum, value) => sum + value, 0);
            return Math.round(total / channelValues.length);
        };

        const hexToRgbChannels = (hex) => [
            parseInt(hex.slice(1, 3), 16),
            parseInt(hex.slice(3, 5), 16),
            parseInt(hex.slice(5, 7), 16),
        ];

        const mixedRgbChannels = colors
            .map(hexToRgbChannels)
            .reduce(
                (acc, channels) => {
                    acc[0].push(channels[0]);
                    acc[1].push(channels[1]);
                    acc[2].push(channels[2]);
                    return acc;
                },
                [[], [], []]
            )
            .map(mixChannel);

        const color = `#${mixedRgbChannels
            .map((channel) => channel.toString(16).padStart(2, "0"))
            .join("")}`;

        return color;
    }

    /**
     * Get the selected color format from local storage
     * @returns {string} color format
     */
    getColorFormat() {
        return storageService.loadFromLocalStorage(storageKey);
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
     * Insert one hex color and get a list of triadic colors
     * @param {string} hexColor
     * @returns {string[]} array of 3 colors in hex format
     */
    getTriadicColors(hexColor) {
        const hsl = this.hexToHsl(hexColor).replace(/\s/g, "");
        const h = parseInt(hsl.slice(4, 7));
        const s = parseInt(hsl.slice(11, 14));
        const l = parseInt(hsl.slice(15, 18));

        const triadic1 = this.hslToHex((h + 120) % 360, s, l);
        const triadic2 = this.hslToHex((h + 240) % 360, s, l);

        // todo: niet altijd goede kleur komt eruit, soms wel maar soms niet
        return [hexColor, triadic1, triadic2];
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

    /**
     * Convert hsl color to hex format
     * @param {number} h
     * @param {number} s
     * @param {number} l
     * @returns {string} hex color
     */
    hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        const toHex = (x) => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
}
