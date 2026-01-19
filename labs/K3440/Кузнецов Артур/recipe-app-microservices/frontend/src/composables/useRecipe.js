import { useRouter } from 'vue-router';
import { useApi } from './useApi';

export function useRecipe() {
    const router = useRouter();
    const { sendJsonRequest, API_BASE } = useApi();

    async function loadDictionaries() {
        const [dishTypesRes, difficultyRes, ingredientsRes] = await Promise.all([
            sendJsonRequest(`${API_BASE.RECIPE}/dish-type`),
            sendJsonRequest(`${API_BASE.RECIPE}/recipe-difficulty`),
            sendJsonRequest(`${API_BASE.RECIPE}/ingredient`),
        ]);

        if (!dishTypesRes.ok || !difficultyRes.ok || !ingredientsRes.ok) {
            throw new Error('Не удалось загрузить справочные данные.');
        }

        return {
            dishTypes: dishTypesRes.data ?? [],
            difficulties: difficultyRes.data ?? [],
            ingredients: ingredientsRes.data ?? [],
        };
    }

    async function loadRecipe(recipeId) {
        const response = await sendJsonRequest(`${API_BASE.RECIPE}/recipe/${recipeId}`);
        if (!response.ok) {
            throw new Error(response.data?.message || 'Рецепт не найден');
        }
        return response.data;
    }

    async function saveRecipe(recipeData, ingredients, steps, recipeId = null) {
        const endpoint = recipeId
            ? `${API_BASE.RECIPE}/recipe/${recipeId}`
            : `${API_BASE.RECIPE}/recipe`;
        const method = recipeId ? 'PUT' : 'POST';

        const response = await sendJsonRequest(endpoint, method, recipeData);
        if (!response.ok) {
            throw new Error(response.data?.message || 'Не удалось сохранить рецепт.');
        }

        const savedRecipeId = response.data?.id || recipeId;
        if (!savedRecipeId) {
            throw new Error('Сервис не вернул идентификатор рецепта.');
        }

        let existingRecipe = null;
        if (recipeId) {
            try {
                existingRecipe = await loadRecipe(recipeId);
            } catch (error) {
                console.warn('Failed to load existing recipe for sync', error);
            }
        }

        if (recipeId && existingRecipe?.recipeIngredients) {
            const existingIds = existingRecipe.recipeIngredients.map((entry) => entry.id);
            for (const id of existingIds) {
                await sendJsonRequest(`${API_BASE.RECIPE}/recipe-ingredient/${recipeId}/${id}`, 'DELETE');
            }
        }

        for (const entry of ingredients) {
            await sendJsonRequest(`${API_BASE.RECIPE}/recipe-ingredient/${savedRecipeId}`, 'POST', entry);
        }

        if (recipeId && existingRecipe?.steps) {
            const existingSteps = existingRecipe.steps.map((step) => step.step_number);
            for (const stepNumber of existingSteps) {
                await sendJsonRequest(`${API_BASE.RECIPE}/recipe-step/${recipeId}/${stepNumber}`, 'DELETE');
            }
        }

        for (let i = 0; i < steps.length; i++) {
            await sendJsonRequest(`${API_BASE.RECIPE}/recipe-step/${savedRecipeId}`, 'POST', {
                step_number: i + 1,
                instruction: steps[i].instruction,
            });
        }

        return savedRecipeId;
    }

    return {
        loadDictionaries,
        loadRecipe,
        saveRecipe,
    };
}
