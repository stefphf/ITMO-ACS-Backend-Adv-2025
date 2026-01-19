<template>
    <main id="main-content" class="container py-4" role="main">
        <InlineAlert :message="alertMessage" :type="alertType" aria-live="polite" />

        <section class="page-header">
            <h1 id="searchPageTitle" class="d-flex align-items-center">
                <svg class="me-2" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                    <use href="#search"></use>
                </svg>
                <span>Поиск рецептов</span>
            </h1>
            <p class="text-muted mb-0">Фильтруйте рецепты по типу блюда, сложности и ингредиентам.</p>
        </section>

        <section class="card shadow-sm filter-card">
            <div class="card-body">
                <form @submit.prevent="handleSearch" class="row g-3 align-items-end" role="search">
                    <div class="col-md-4">
                        <label for="titleFilter" class="form-label">Название рецепта</label>
                        <input
                            id="titleFilter"
                            v-model="filters.title"
                            class="form-control"
                            type="text"
                            placeholder="Например, борщ или паста"
                            aria-label="Поиск по названию рецепта"
                            autocomplete="off"
                        />
                    </div>
                    <div class="col-md-3">
                        <label for="dishTypeFilter" class="form-label">Тип блюда</label>
                        <select
                            id="dishTypeFilter"
                            v-model="filters.dishTypeId"
                            class="form-select"
                            aria-label="Фильтр по типу блюда"
                        >
                            <option value="">Выберите тип блюда</option>
                            <option v-for="dishType in dishTypes" :key="dishType.id" :value="dishType.id">
                                {{ dishType.name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="difficultyFilter" class="form-label">Сложность</label>
                        <select
                            id="difficultyFilter"
                            v-model="filters.difficultyId"
                            class="form-select"
                            aria-label="Фильтр по сложности приготовления"
                        >
                            <option value="">Уровень сложности</option>
                            <option v-for="difficulty in difficulties" :key="difficulty.id" :value="difficulty.id">
                                {{ difficulty.name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="ingredientFilter" class="form-label">
                            Ингредиенты <span class="text-muted">(несколько по Ctrl/Cmd)</span>
                        </label>
                        <select
                            id="ingredientFilter"
                            v-model="filters.ingredientIds"
                            class="form-select"
                            multiple
                            size="5"
                            aria-label="Выбор ингредиентов, можно выбрать несколько"
                        >
                            <option v-for="ingredient in ingredients" :key="ingredient.id" :value="ingredient.id">
                                {{ ingredient.name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-primary w-100" type="submit" aria-label="Выполнить поиск рецептов">
                            Найти
                        </button>
                    </div>
                </form>
            </div>
        </section>

        <section class="mt-4" aria-labelledby="resultsHeading">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 id="resultsHeading" class="h5 mb-0">Результаты</h2>
                <span v-if="recipes.length > 0" class="data-summary" aria-live="polite" aria-atomic="true">
          Найдено рецептов: {{ recipes.length }}
        </span>
            </div>
            <div v-if="isLoading" class="row">
                <div class="col-12">
                    <LoadingSpinner text="Ищем рецепты..." />
                </div>
            </div>
            <div v-else-if="recipes.length === 0 && hasSearched" class="row">
                <div class="col-12">
                    <EmptyState text="По заданным условиям ничего не найдено." />
                </div>
            </div>
            <div v-else class="row row-cols-1 row-cols-md-2 g-3" role="list">
                <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
            </div>
        </section>
    </main>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useApi } from '@/composables/useApi';
import RecipeCard from '@/components/RecipeCard.vue';
import InlineAlert from '@/components/InlineAlert.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import EmptyState from '@/components/EmptyState.vue';

const { sendJsonRequest, API_BASE } = useApi();

const dishTypes = ref([]);
const difficulties = ref([]);
const ingredients = ref([]);
const recipes = ref([]);
const isLoading = ref(false);
const hasSearched = ref(false);
const alertMessage = ref('');
const alertType = ref('danger');

const filters = reactive({
    title: '',
    dishTypeId: '',
    difficultyId: '',
    ingredientIds: [],
});

async function loadFilters() {
    try {
        const [dishTypesRes, difficultiesRes, ingredientsRes] = await Promise.all([
            sendJsonRequest(`${API_BASE.RECIPE}/dish-type`),
            sendJsonRequest(`${API_BASE.RECIPE}/recipe-difficulty`),
            sendJsonRequest(`${API_BASE.RECIPE}/ingredient`),
        ]);

        if (dishTypesRes.ok) dishTypes.value = dishTypesRes.data ?? [];
        if (difficultiesRes.ok) difficulties.value = difficultiesRes.data ?? [];
        if (ingredientsRes.ok) ingredients.value = ingredientsRes.data ?? [];
    } catch (error) {
        console.error('Failed to load filters', error);
        alertMessage.value = 'Не удалось загрузить справочники. Попробуйте обновить страницу.';
    }
}

async function loadRecipes() {
    isLoading.value = true;
    alertMessage.value = '';
    hasSearched.value = true;

    const queryParams = new URLSearchParams();
    if (filters.title) queryParams.append('title', filters.title);
    if (filters.dishTypeId) queryParams.append('dishTypeId', filters.dishTypeId);
    if (filters.difficultyId) queryParams.append('difficultyId', filters.difficultyId);
    if (filters.ingredientIds?.length) {
        queryParams.append('ingredientIds', filters.ingredientIds.join(','));
    }

    const queryString = queryParams.toString();
    const url = `${API_BASE.RECIPE}/recipe${queryString ? `?${queryString}` : ''}`;

    try {
        const response = await sendJsonRequest(url, 'GET');
        if (response.ok) {
            recipes.value = response.data ?? [];
        } else {
            recipes.value = [];
            alertMessage.value = response.data?.message || 'Ошибка при загрузке рецептов.';
        }
    } catch (error) {
        recipes.value = [];
        alertMessage.value = 'Не удалось загрузить рецепты. Попробуйте позже.';
    } finally {
        isLoading.value = false;
    }
}

function handleSearch() {
    loadRecipes();
}

onMounted(async () => {
    await loadFilters();
    await loadRecipes();
});
</script>

