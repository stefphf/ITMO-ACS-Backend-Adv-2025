<template>
    <main id="main-content" class="container py-4" role="main">
        <InlineAlert :message="alertMessage" :type="alertType" :is-html="true" aria-live="assertive"
                     aria-atomic="true" />

        <section class="page-header">
            <h1>{{ isEdit ? 'Редактировать рецепт' : 'Создать рецепт' }}</h1>
            <p class="text-muted mb-0">Заполните форму.</p>
        </section>

        <form v-if="dictionariesLoaded" @submit.prevent="handleSubmit" role="form">
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <h2 class="h5 mb-3">Основная информация</h2>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="titleInput" class="form-label">Название<span aria-hidden="true">*</span></label>
                            <input
                                id="titleInput"
                                v-model="form.title"
                                class="form-control"
                                type="text"
                                required
                                aria-required="true"
                            />
                        </div>
                        <div class="col-md-3">
                            <label for="dishTypeSelect" class="form-label">Тип блюда<span
                                aria-hidden="true">*</span></label>
                            <select
                                id="dishTypeSelect"
                                v-model.number="form.dishTypeId"
                                class="form-select"
                                required
                                aria-required="true"
                                aria-label="Тип блюда"
                            >
                                <option value="">Выберите тип блюда</option>
                                <option v-for="dishType in dictionaries.dishTypes" :key="dishType.id"
                                        :value="dishType.id">
                                    {{ dishType.name }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="difficultySelect" class="form-label">Сложность<span aria-hidden="true">*</span></label>
                            <select
                                id="difficultySelect"
                                v-model.number="form.difficultyId"
                                class="form-select"
                                required
                                aria-required="true"
                                aria-label="Сложность"
                            >
                                <option value="">Сложность</option>
                                <option v-for="difficulty in dictionaries.difficulties" :key="difficulty.id"
                                        :value="difficulty.id">
                                    {{ difficulty.name }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="descriptionInput" class="form-label">Описание</label>
                            <textarea
                                id="descriptionInput"
                                v-model="form.description"
                                class="form-control"
                                rows="3"
                                aria-label="Описание рецепта"
                            ></textarea>
                        </div>
                        <div class="col-md-2">
                            <label for="prepTimeInput" class="form-label">Подготовка (мин)<span
                                aria-hidden="true">*</span></label>
                            <input
                                id="prepTimeInput"
                                v-model.number="form.preparationTime"
                                class="form-control"
                                type="number"
                                min="1"
                                required
                                aria-required="true"
                                aria-label="Время подготовки в минутах"
                            />
                        </div>
                        <div class="col-md-2">
                            <label for="cookTimeInput" class="form-label">Готовка (мин)<span aria-hidden="true">*</span></label>
                            <input
                                id="cookTimeInput"
                                v-model.number="form.cookingTime"
                                class="form-control"
                                type="number"
                                min="1"
                                required
                                aria-required="true"
                                aria-label="Время готовки в минутах"
                            />
                        </div>
                        <div class="col-md-2">
                            <label for="servingsInput" class="form-label">Порции<span
                                aria-hidden="true">*</span></label>
                            <input
                                id="servingsInput"
                                v-model.number="form.servings"
                                class="form-control"
                                type="number"
                                min="1"
                                required
                                aria-required="true"
                                aria-label="Количество порций"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <h2 class="h5 mb-3">Медиа</h2>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="imageInput" class="form-label">Ссылка на фото</label>
                            <input
                                id="imageInput"
                                v-model="form.image"
                                class="form-control"
                                type="url"
                                placeholder="https://..."
                                aria-label="Ссылка на фотографию рецепта"
                            />
                        </div>
                        <div class="col-md-6">
                            <label for="videoInput" class="form-label">Ссылка на видео</label>
                            <input
                                id="videoInput"
                                v-model="form.video"
                                class="form-control"
                                type="url"
                                placeholder="https://..."
                                aria-label="Ссылка на видео рецепта"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h2 class="h5 mb-0">Ингредиенты</h2>
                        <button type="button" class="btn btn-sm btn-outline-primary" @click="addIngredient"
                                aria-label="Добавить ингредиент">
                            Добавить
                        </button>
                    </div>
                    <div aria-live="polite" aria-atomic="false">
                        <IngredientRow
                            v-for="(ingredient, index) in ingredients"
                            :key="index"
                            v-model="ingredients[index]"
                            :ingredients="dictionaries.ingredients"
                            @remove="removeIngredient(index)"
                        />
                    </div>
                </div>
            </div>

            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h2 class="h5 mb-0">Шаги приготовления</h2>
                        <button type="button" class="btn btn-sm btn-outline-primary" @click="addStep"
                                aria-label="Добавить шаг">
                            Добавить
                        </button>
                    </div>
                    <div aria-live="polite" aria-atomic="false">
                        <StepRow
                            v-for="(step, index) in steps"
                            :key="index"
                            v-model="steps[index]"
                            :index="index"
                            @remove="removeStep(index)"
                        />
                    </div>
                </div>
            </div>

            <div class="text-end">
                <button class="btn btn-primary btn-lg" type="submit" :disabled="isSaving" aria-label="Сохранить рецепт">
                    {{ isSaving ? 'Сохраняем...' : isEdit ? 'Сохранить изменения' : 'Создать рецепт' }}
                </button>
            </div>
        </form>

        <LoadingSpinner v-else text="Загрузка данных..." />
    </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useRecipe } from '@/composables/useRecipe';
import InlineAlert from '@/components/InlineAlert.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import IngredientRow from '@/components/IngredientRow.vue';
import StepRow from '@/components/StepRow.vue';

const route = useRoute();
const router = useRouter();
const { requireAuth } = useAuth();
const { loadDictionaries, loadRecipe, saveRecipe } = useRecipe();

const isEdit = computed(() => Boolean(route.params.id));
const recipeId = computed(() => (route.params.id ? Number(route.params.id) : null));

const dictionaries = reactive({ dishTypes: [], difficulties: [], ingredients: [] });
const dictionariesLoaded = ref(false);
const isSaving = ref(false);
const alertMessage = ref('');
const alertType = ref('danger');

const form = reactive({
    title: '',
    description: '',
    dishTypeId: null,
    difficultyId: null,
    preparationTime: null,
    cookingTime: null,
    servings: null,
    image: '',
    video: '',
});

const ingredients = ref([{ ingredientId: '', quantity: '', unit: '' }]);
const steps = ref([{ instruction: '' }]);

function addIngredient() {
    ingredients.value.push({ ingredientId: '', quantity: '', unit: '' });
}

function removeIngredient(index) {
    ingredients.value.splice(index, 1);
}

function addStep() {
    steps.value.push({ instruction: '' });
}

function removeStep(index) {
    steps.value.splice(index, 1);
}

async function loadRecipeData() {
    if (!recipeId.value) return;

    try {
        const recipe = await loadRecipe(recipeId.value);
        form.title = recipe.title || '';
        form.description = recipe.description || '';
        form.dishTypeId = recipe.dishType?.id || null;
        form.difficultyId = recipe.recipeDifficulty?.id || null;
        form.preparationTime = recipe.preparation_time || null;
        form.cookingTime = recipe.cooking_time || null;
        form.servings = recipe.servings || null;
        form.image = recipe.image || '';
        form.video = recipe.video || '';

        const recipeIngredients = recipe.recipeIngredients ?? [];
        ingredients.value =
            recipeIngredients.length > 0
                ? recipeIngredients.map((entry) => ({
                    ingredientId: entry.ingredient?.id || '',
                    quantity: entry.quantity || '',
                    unit: entry.unit || '',
                }))
                : [{ ingredientId: '', quantity: '', unit: '' }];

        const recipeSteps = (recipe.steps ?? []).sort((a, b) => a.step_number - b.step_number);
        steps.value =
            recipeSteps.length > 0
                ? recipeSteps.map((step) => ({ instruction: step.instruction || '' }))
                : [{ instruction: '' }];
    } catch (error) {
        alertMessage.value = error.message || 'Не удалось загрузить рецепт';
        alertType.value = 'danger';
    }
}

async function handleSubmit() {
    if (!requireAuth()) return;

    alertMessage.value = '';

    const validIngredients = ingredients.value.filter(
        (ing) => ing.ingredientId && ing.quantity && ing.unit,
    );
    const validSteps = steps.value.filter((step) => step.instruction.trim());

    if (validIngredients.length === 0) {
        alertMessage.value = 'Добавьте хотя бы один ингредиент.';
        alertType.value = 'danger';
        return;
    }

    if (validSteps.length === 0) {
        alertMessage.value = 'Добавьте хотя бы один шаг приготовления.';
        alertType.value = 'danger';
        return;
    }

    isSaving.value = true;

    try {
        const recipeData = isEdit.value
            ? {
                title: form.title.trim(),
                description: form.description.trim() || null,
                dishType: { id: form.dishTypeId },
                recipeDifficulty: { id: form.difficultyId },
                preparation_time: form.preparationTime,
                cooking_time: form.cookingTime,
                servings: form.servings,
                image: form.image.trim() || null,
                video: form.video.trim() || null,
            }
            : {
                title: form.title.trim(),
                description: form.description.trim() || null,
                dishTypeId: form.dishTypeId,
                recipeDifficultyId: form.difficultyId,
                preparation_time: form.preparationTime,
                cooking_time: form.cookingTime,
                servings: form.servings,
                image: form.image.trim() || null,
                video: form.video.trim() || null,
            };

        const savedRecipeId = await saveRecipe(
            recipeData,
            validIngredients.map((ing) => ({
                ingredientId: Number(ing.ingredientId),
                quantity: Number(ing.quantity),
                unit: ing.unit.trim(),
            })),
            validSteps,
            recipeId.value,
        );

        alertMessage.value = `Рецепт успешно сохранен. Переход на страницу рецепта...`;
        alertType.value = 'success';

        setTimeout(() => {
            router.push(`/recipe/${savedRecipeId}`);
        }, 1500);
    } catch (error) {
        alertMessage.value = error.message || 'Произошла ошибка. Попробуйте повторить.';
        alertType.value = 'danger';
    } finally {
        isSaving.value = false;
    }
}

onMounted(async () => {
    if (!requireAuth()) return;

    try {
        const dicts = await loadDictionaries();
        dictionaries.dishTypes = dicts.dishTypes;
        dictionaries.difficulties = dicts.difficulties;
        dictionaries.ingredients = dicts.ingredients;
        dictionariesLoaded.value = true;

        if (isEdit.value) {
            await loadRecipeData();
        }
    } catch (error) {
        alertMessage.value = error.message || 'Ошибка загрузки данных';
        alertType.value = 'danger';
    }
});
</script>
