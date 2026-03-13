import { Meal } from './types.js';
import { User } from './user.js';

const mealListEl = document.getElementById('mealList') as HTMLUListElement;
const userNameEl = document.getElementById('userName') as HTMLSpanElement;
const userWalletEl = document.getElementById('userWallet') as HTMLSpanElement;
const orderHistoryListEl = document.getElementById('orderHistoryList') as HTMLUListElement;
const totalSpentEl = document.getElementById('totalSpent') as HTMLSpanElement;
const globalErrorEl = document.getElementById('globalError') as HTMLDivElement;
const walletErrorEl = document.getElementById('walletError') as HTMLDivElement;
const priceFilterInput = document.getElementById('priceFilter') as HTMLInputElement;

export function renderMeals(meals: Meal[], onOrderClick: (meal: Meal) => void) {
    if (!mealListEl) return;
    mealListEl.innerHTML = '';
    
    const maxPrice = priceFilterInput && priceFilterInput.value ? parseFloat(priceFilterInput.value) : Infinity;
    
    meals.filter(meal => meal.price <= maxPrice).forEach(meal => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2';
        
        const detailsSpan = document.createElement('span');
        detailsSpan.innerHTML = `<strong>${meal.name}</strong> - ${meal.price}€ <small class="text-muted">(${meal.calories} kcal)</small>`;
        
        const orderBtn = document.createElement('button');
        orderBtn.className = 'btn btn-sm btn-outline-success';
        orderBtn.textContent = 'Commander';
        orderBtn.onclick = () => onOrderClick(meal);
        
        li.appendChild(detailsSpan);
        li.appendChild(orderBtn);
        mealListEl.appendChild(li);
    });
}

export function renderWallet(user: User) {
    if (userNameEl) userNameEl.textContent = user.name;
    if (userWalletEl) userWalletEl.textContent = user.wallet.toFixed(2);
}

export function renderOrderHistory(user: User, onRemoveClick: (orderId: number) => void) {
    if (!orderHistoryListEl) return;
    
    orderHistoryListEl.innerHTML = '';
    
    user.orders.forEach(order => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center text-sm py-1';
        
        const mealNames = order.meals.map(m => m.name).join(', ');
        
        const detailsSpan = document.createElement('span');
        detailsSpan.innerHTML = `Commande #${order.id.toString().slice(-4)}: <strong>${mealNames}</strong> - ${order.total}€`;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-sm btn-outline-danger py-0 px-2';
        removeBtn.innerHTML = '&times;';
        removeBtn.title = "Supprimer la commande";
        removeBtn.onclick = () => onRemoveClick(order.id);
        
        li.appendChild(detailsSpan);
        li.appendChild(removeBtn);
        orderHistoryListEl.appendChild(li);
    });
    
    if (totalSpentEl) totalSpentEl.textContent = user.getTotalSpent().toFixed(2);
}

export function showGlobalError(message: string) {
    if (!globalErrorEl) return;
    globalErrorEl.textContent = message;
    globalErrorEl.classList.remove('d-none');
    setTimeout(() => {
        globalErrorEl.classList.add('d-none');
    }, 5000);
}

export function showWalletError(message: string) {
    if (!walletErrorEl) return;
    walletErrorEl.textContent = message;
    setTimeout(() => {
        walletErrorEl.textContent = '';
    }, 4000);
}

export function setupPriceFilter(getMeals: () => Meal[], onOrderClick: (meal: Meal) => void) {
    if (!priceFilterInput) return;
    priceFilterInput.addEventListener('input', () => {
        renderMeals(getMeals(), onOrderClick);
    });
}
