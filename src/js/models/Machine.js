export class Machine {
    /**
     * @param {string | null} id
     * @param {number} mixSpeed
     */
    constructor(id, mixSpeed) {
        this.id = id || self.crypto.randomUUID();
        this.mixSpeed = mixSpeed;
    }
}
