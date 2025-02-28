import { Machine } from "./Machine";

export class MixingHall {
    /**
     * @param {string | null} id
     * @param {number} hallNumber
     * @param {Machine[] | null} machines
     */
    constructor(id, hallNumber, machines) {
        this.id = id || self.crypto.randomUUID();
        this.hallNumber = hallNumber;
        this.machines = machines;
    }

    /**
     * add an machine to the mixing hall
     * @param {Machine} machine
     */
    addMachine(machine) {
        this.machines.push(machine);
    }
}
