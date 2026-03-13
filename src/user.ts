import { Meal, Order } from './types.js';
import { TropPauvreErreur } from './errors.js';

export class User {
    id: number;
    name: string;
    wallet: number;
    orders: Order[];

    constructor(id: number, name: string, initialWallet: number) {
        this.id = id;
        this.name = name;
        this.wallet = initialWallet;
        this.orders = [];
        this.loadHistory();
    }

    orderMeal(meal: Meal): Order {
        if (this.wallet < meal.price) {
            throw new TropPauvreErreur("Fonds insuffisants", this.wallet, meal.price);
        }

        this.wallet -= meal.price;
        const newOrder: Order = {
            id: Date.now(), 
            meals: [meal],
            total: meal.price
        };
        
        this.orders.unshift(newOrder); 
        this.saveHistory();
        return newOrder;
    }

    removeOrder(orderId: number): void {
        const orderIndex = this.orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {

            this.wallet += this.orders[orderIndex].total;
            this.orders.splice(orderIndex, 1);
            this.saveHistory();
        }
    }

    getTotalSpent(): number {
        return this.orders.reduce((sum, order) => sum + order.total, 0);
    }

    private saveHistory(): void {

        const dataToSave = {
            wallet: this.wallet,
            orders: this.orders
        };
        localStorage.setItem(`user_${this.id}_data`, JSON.stringify(dataToSave));
    }

    private loadHistory(): void {
        const savedData = localStorage.getItem(`user_${this.id}_data`);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                this.wallet = parsed.wallet;
                this.orders = parsed.orders;
            } catch (e) {
                console.error("Erreur lors de la lecture de l'historique", e);
            }
        }
    }
}
