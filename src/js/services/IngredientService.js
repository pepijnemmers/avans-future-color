import { Ingredient } from "../models/Ingredient.js";
import { Structure } from "../enums/Structure.js";
import { StorageService } from "../services/LocalStorageService.js";

const storageService = new StorageService();
const storageKey = "ingredients";

export class IngredientService {
    constructor() {
        this.ingredients = storageService.loadFromLocalStorage(storageKey);
    }

    /**
     * add an ingredient to the list and save it to local storage
     * @param {string} hexColor
     * @param {number} mixTime
     * @param {number} mixSpeed
     * @param {Structure} structure
     * @returns {Ingredient}
     */
    addIngredient(hexColor, mixTime, mixSpeed, structure) {
        const ingredient = new Ingredient(
            null,
            hexColor,
            mixTime,
            mixSpeed,
            structure
        );

        this.ingredients.push(ingredient);
        storageService.saveToLocalStorage(storageKey, this.ingredients);

        return ingredient;
    }

    /**
     * remove an ingredient from the list and local storage
     * @param {string} id
     */
    removeIngredient(id) {
        this.ingredients = this.ingredients.filter(
            (ingredient) => ingredient.id !== id
        );
        storageService.saveToLocalStorage(storageKey, this.ingredients);
    }

    /**
     * Get all ingredients from local storage
     * @returns {Ingredient[]} list with ingredients
     */
    getAllIngredients() {
        const storedIngredients =
            storageService.loadFromLocalStorage(storageKey);
        this.ingredients = storedIngredients.map(
            (i) =>
                new Ingredient(
                    i.id,
                    i.hexColor,
                    i.mixTime,
                    i.mixSpeed,
                    i.structure
                )
        );
        return this.ingredients;
    }

    /**
     * Get an ingredient by id
     * @param {string} id
     * @returns {Ingredient} ingredient or null
     */
    findIngredientById(id) {
        return (
            this.getAllIngredients().find(
                (ingredient) => ingredient.id === id
            ) || null
        );
    }
}
