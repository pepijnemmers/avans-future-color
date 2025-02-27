import { Ingredient } from "./Ingredient.js";

export class PaintBucket {
    /**
     * @param {string | null} id
     * @param {Ingredient[] | null} ingredients
     * @param {number} mixSpeed
     */
    constructor(id, ingredients) {
        this.id = id || self.crypto.randomUUID();
        this.ingredients = ingredients;
        this.mixSpeed = ingredients[0]?.mixSpeed ?? 0;
    }

    /**
     * add an ingredient to the paint bucket
     * @param {Ingredient} ingredient
     */
    addIngredient(ingredient) {
        this.ingredients.push(ingredient);
        this.mixSpeed = this.ingredients[0]?.mixSpeed ?? 0;
    }
}
