import { Ingredient } from "../models/Ingredient.js";
import { PaintBucket } from "../models/PaintBucket.js";
import { StorageService } from "../services/LocalStorageService.js";
import { IngredientService } from "./IngredientService.js";

const storageService = new StorageService();
const storageKey = "paintbuckets";

export class PaintBucketService {
    static instance;

    constructor() {
        if (PaintBucketService.instance) {
            return PaintBucketService.instance;
        }

        this.paintBuckets = storageService.loadFromLocalStorage(storageKey);
        PaintBucketService.instance = this;
    }

    /**
     * Get the singleton instance of the PaintBucketService
     * @returns {PaintBucketService}
     */
    static getInstance() {
        if (!PaintBucketService.instance) {
            PaintBucketService.instance = new PaintBucketService();
        }
        return PaintBucketService.instance;
    }

    /**
     * add an paint bucket to the list and save it to local storage
     * @param {Ingredient[]} ingredients
     * @returns {PaintBucket}
     */
    addPaintBucket(ingredients) {
        const paintBucket = new PaintBucket(null, ingredients);

        this.paintBuckets.push(paintBucket);
        storageService.saveToLocalStorage(storageKey, this.paintBuckets);

        return paintBucket;
    }

    /**
     * add an ingredient to a paint bucket
     * @param {PaintBucket} paintBucket
     * @param {Ingredient} ingredient
     */
    addIngredientToPaintBucket(paintBucket, ingredient) {
        paintBucket.addIngredient(ingredient);
        storageService.saveToLocalStorage(storageKey, this.paintBuckets);
    }

    /**
     * remove a paint bucket from the list and local storage
     * @param {string} id
     */
    removePaintBucket(id) {
        this.paintBuckets = this.paintBuckets.filter(
            (paintBucket) => paintBucket.id !== id
        );
        storageService.saveToLocalStorage(storageKey, this.paintBuckets);
    }

    /**
     * Gets all paint buckets from local storage
     * @returns {PaintBucket[]} list of all paint buckets
     */
    getAllPaintBuckets() {
        const storedPaintBuckets =
            storageService.loadFromLocalStorage(storageKey);
        this.paintBuckets = storedPaintBuckets.map(
            (b) => new PaintBucket(b.id, b.ingredients)
        );
        return this.paintBuckets;
    }

    /**
     * Get a paint bucket by id
     * @param {string} id
     * @returns {PaintBucket} paint bucket or null
     */
    getPainBucketById(id) {
        return this.getAllPaintBuckets().find((bucket) => bucket.id === id);
    }
}
