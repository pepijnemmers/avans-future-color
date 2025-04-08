import { Structure } from "../enums/Structure.js";
import { Ingredient } from "../models/Ingredient.js";
import { Machine } from "../models/Machine.js";
import { ColorService } from "./ColorService.js";
import { StorageService } from "./LocalStorageService.js";
import { PaintBucketService } from "./PaintBucketService.js";

const storageService = new StorageService();
const storageKey = "machines";
const paintBucketService = PaintBucketService.getInstance();
const colorService = ColorService.getInstance();

export class MachineService {
    static instance;

    constructor() {
        if (MachineService.instance) {
            return MachineService.instance;
        }

        this.machines = storageService.loadFromLocalStorage(storageKey);
        MachineService.instance = this;
    }

    /**
     * Get the singleton instance of the MachineService
     * @returns {MachineService}
     */
    static getInstance() {
        if (!MachineService.instance) {
            MachineService.instance = new MachineService();
        }
        return MachineService.instance;
    }

    /**
     * Add a machine to the list and save it to local storage
     * @param {number} mixSpeed
     * @param {number} mixingHall
     * @returns {Machine}
     */
    addMachine(mixSpeed, mixingHall) {
        const machine = new Machine(null, mixSpeed, mixingHall, null, 0);

        this.machines.push(machine);
        storageService.saveToLocalStorage(storageKey, this.machines);

        return machine;
    }

    /**
     * Remove a machine from the list and local storage
     * @param {string} id
     */
    removeMachine(id) {
        this.machines = this.machines.filter((machine) => machine.id !== id);
        storageService.saveToLocalStorage(storageKey, this.machines);
    }

    /**
     * Get all machines from local storage
     * @returns {Machine[]} list with all machines
     */
    getAllMachines() {
        const storedMachines = storageService.loadFromLocalStorage(storageKey);
        this.machines = storedMachines.map(
            (m) =>
                new Machine(
                    m.id,
                    m.mixSpeed,
                    m.mixingHall,
                    m.bucket,
                    m.shakeStart
                )
        );
        return this.machines;
    }

    /**
     * Get all machines from a specific mixing hall
     * @param {number} mixingHall
     * @returns {Machine[]} list with all machines from the mixing hall
     */
    getAllMachinesByMixingHall(mixingHall) {
        const machines = this.getAllMachines();
        return machines.filter((m) => m.mixingHall == mixingHall);
    }

    /**
     * Get a machine by id
     * @param {string} id
     * @returns {Machine | null} The machine with the given id or null
     */
    getMachineById(id) {
        return this.getAllMachines().find((m) => m.id === id);
    }

    /**
     * Add a paint bucket to a machine
     * @param {string} bucketId
     * @param {string} machineId
     * @returns {boolean} True if the bucket is added to the machine
     */
    addBucketToMachine(bucketId, machineId) {
        const machine = this.getMachineById(machineId);
        const bucket = paintBucketService.getPainBucketById(bucketId);

        if (
            !machine ||
            !bucket ||
            machine.mixSpeed !== bucket.mixSpeed ||
            machine.bucket
        ) {
            return false;
        }

        machine.bucket = bucket;
        machine.shakeStart = Date.now();
        storageService.saveToLocalStorage(storageKey, this.machines);

        return true;
    }

    /**
     * Reset a machine and save the new mix to local storage
     * @param {Machine} machine
     * @param {number} shakeDurationMs
     */
    resetMachineAndSaveNewMix(machine, shakeDurationMs) {
        // get new color
        const colors = machine.bucket.ingredients.map((i) => i.hexColor);
        const newColor = colorService.mixColors(colors);

        // get most used structure
        const structureCounts = machine.bucket.ingredients.reduce(
            (counts, ingredient) => {
                counts[ingredient.structure] =
                    (counts[ingredient.structure] || 0) + 1;
                return counts;
            },
            {}
        );
        const newStructure = Object.keys(structureCounts).reduce((a, b) =>
            structureCounts[a] > structureCounts[b] ? a : b
        );

        // remove old and add new paint bucket
        paintBucketService.addPaintBucket([
            new Ingredient(
                null,
                newColor,
                shakeDurationMs,
                machine.mixSpeed,
                Structure[newStructure]
            ),
        ]);

        // reset machine
        machine.bucket = null;
        machine.shakeStart = 0;

        const machines = this.getAllMachines();
        const index = machines.findIndex((m) => m.id === machine.id);
        machines[index] = machine;

        storageService.saveToLocalStorage(storageKey, machines);
    }
}
