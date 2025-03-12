import { PaintBucket } from "./PaintBucket.js";

export class Machine {
    /**
     * @param {string | null} id
     * @param {number} mixSpeed
     * @param {number} mixingHall
     * @param {PaintBucket | null} bucket
     * @param {Date} shakeStart
     */
    constructor(id, mixSpeed, mixingHall, bucket, shakeStart) {
        this.id = id || self.crypto.randomUUID();
        this.mixSpeed = mixSpeed;
        this.mixingHall = mixingHall;
        this.bucket = bucket || null;
        this.shakeStart = shakeStart || 0;
    }
}
