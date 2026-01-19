<template>
    <div class="col">
        <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <span class="badge bg-secondary">{{ recipe.dishType?.name || 'Без категории' }}</span>
                    </div>
                    <small class="text-muted">{{ formatTime(recipe.preparation_time + recipe.cooking_time) }}</small>
                </div>
                <h5 class="card-title">{{ recipe.title }}</h5>
                <p class="card-text text-muted flex-grow-1">{{ recipe.description ?? 'Без описания' }}</p>
                <p class="mb-3 text-muted">Сложность: {{ recipe.recipeDifficulty?.name || '-' }}</p>
                <router-link :to="`/recipe/${recipe.id}`" class="btn btn-primary mt-auto align-self-start">
                    Открыть
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatMinutesToText } from '@/utils/helpers';

defineProps({
    recipe: {
        type: Object,
        required: true,
    },
});

function formatTime(minutes) {
    return formatMinutesToText(minutes);
}
</script>

