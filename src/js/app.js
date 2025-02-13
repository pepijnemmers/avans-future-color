import { renderBucketPanel } from "./views/paintBucketPanel.js";
import { renderWeatherPanel } from "./views/weatherPanel.js";
import { renderIngredientPanel } from "./views/ingredientsPanel.js";

document.getElementById("paintBucketPanel").innerHTML = renderBucketPanel();
document.getElementById("weatherPanel").innerHTML = renderWeatherPanel();
document.getElementById("ingredientsPanel").innerHTML = renderIngredientPanel();
