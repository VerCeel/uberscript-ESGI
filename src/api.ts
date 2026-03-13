import { Meal } from './types.js';

export async function fetchMeals(): Promise<Meal[]> {
  try {
    const response = await fetch('https://keligmartin.github.io/api/meals.json');
    if (!response.ok) {
        throw new Error(`Erreur réseau: ${response.status}`);
    }
    const data: Meal[] = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors du chargement des repas");

    throw error;
  }
}
