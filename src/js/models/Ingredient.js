import { Structure } from "../enums/Structure.js";

export class Ingredient {
    /**
     * @param {string | null} id
     * @param {string} hexColor
     * @param {number} mixTime
     * @param {number} mixSpeed
     * @param {Structure} structure
     */
    constructor(id, hexColor, mixTime, mixSpeed, structure) {
        this.id = id || self.crypto.randomUUID();
        this.hexColor = hexColor;
        this.mixTime = mixTime;
        this.mixSpeed = mixSpeed;
        this.structure = structure;
    }
}
