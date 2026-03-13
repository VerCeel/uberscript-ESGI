export type Meal = {
  id: number;
  name: string;
  calories: number;
  price: number;
};

export type Order = {
  id: number;
  meals: Meal[];
  total: number;
};


export type MealDraft = Omit<Meal, 'id'>;
export type PartialMeal = Partial<Meal>;
export type MealDictionary = Record<number, Meal>;
