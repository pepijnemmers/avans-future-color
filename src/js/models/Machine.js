export class Machine {
    /**
     * @param {string | null} id
     * @param {number} mixSpeed
     * @param {number} mixingHall
     */
    constructor(id, mixSpeed, mixingHall) {
        this.id = id || self.crypto.randomUUID();
        this.mixSpeed = mixSpeed;
        this.mixingHall = mixingHall;
    }
}
