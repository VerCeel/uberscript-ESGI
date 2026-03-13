import { fetchMeals } from './api.js';
import { User } from './user.js';
import { Meal, MealDraft } from './types.js';
import { TropPauvreErreur } from './errors.js';
import { 
    renderMeals, 
    renderWallet, 
    renderOrderHistory, 
    showGlobalError, 
    showWalletError,
    setupPriceFilter
} from './ui.js';


let availableMeals: Meal[] = [];
const currentUser = new User(1, "Alice", 50);

async function init() {

    updateUIAfterStateChange();

    try {
        availableMeals = await fetchMeals();
        renderMeals(availableMeals, handleOrder);
    } catch (error) {
        showGlobalError("Erreur lors du chargement des repas. Veuillez rafraîchir la page.");
        console.error(error);
    }


    setupPriceFilter(() => availableMeals, handleOrder);
    setupMealCreation();
}

function handleOrder(meal: Meal) {
    try {
        currentUser.orderMeal(meal);
        updateUIAfterStateChange();
    } catch (error) {
        if (error instanceof TropPauvreErreur) {
            showWalletError(`Fonds insuffisants ! Prix: ${error.orderTotal}€, Solde: ${error.remainingWallet.toFixed(2)}€`);
        } else {
            showWalletError("Une erreur est survenue lors de la commande.");
            console.error(error);
        }
    }
}

function handleRemoveOrder(orderId: number) {
    currentUser.removeOrder(orderId);
    updateUIAfterStateChange();
}

function updateUIAfterStateChange() {
    renderWallet(currentUser);
    renderOrderHistory(currentUser, handleRemoveOrder);
}

function setupMealCreation() {
    const addBtn = document.getElementById('addMealBtn');
    const nameInput = document.getElementById('mealName') as HTMLInputElement;
    const caloriesInput = document.getElementById('mealCalories') as HTMLInputElement;
    const priceInput = document.getElementById('mealPrice') as HTMLInputElement;

    if (addBtn && nameInput && caloriesInput && priceInput) {
        addBtn.addEventListener('click', () => {
            const name = nameInput.value.trim();
            const calories = parseInt(caloriesInput.value, 10);
            const price = parseFloat(priceInput.value);

            if (name && !isNaN(calories) && !isNaN(price)) {

                const newMealDraft: MealDraft = { name, calories, price };
                const newMeal: Meal = {
                    id: Date.now(),
                    ...newMealDraft
                };

                availableMeals.push(newMeal);
                renderMeals(availableMeals, handleOrder);

                nameInput.value = '';
                caloriesInput.value = '';
                priceInput.value = '';
            } else {
                showGlobalError("Veuillez remplir correctement tous les champs pour créer un repas.");
            }
        });
    }
}


init();
