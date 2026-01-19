<template>
    <div class="ingredient-row">
        <div class="row g-3 align-items-end">
            <div class="col-md-5">
                <label class="form-label">Ингредиент<span aria-hidden="true">*</span></label>
                <select
                    :value="modelValue.ingredientId"
                    @input="updateField('ingredientId', Number($event.target.value))"
                    class="form-select"
                    required
                    aria-required="true"
                >
                    <option value="">Выберите</option>
                    <option v-for="ingredient in ingredients" :key="ingredient.id" :value="ingredient.id">
                        {{ ingredient.name }}
                    </option>
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label">Количество<span aria-hidden="true">*</span></label>
                <input
                    :value="modelValue.quantity"
                    @input="updateField('quantity', Number($event.target.value))"
                    type="number"
                    class="form-control"
                    min="0.1"
                    step="0.1"
                    required
                    aria-required="true"
                />
            </div>
            <div class="col-md-3">
                <label class="form-label">Единица измерения<span aria-hidden="true">*</span></label>
                <input
                    :value="modelValue.unit"
                    @input="updateField('unit', $event.target.value)"
                    type="text"
                    class="form-control"
                    required
                    aria-required="true"
                />
            </div>
            <div class="col-md-1 text-end">
                <button type="button" class="btn btn-outline-danger" aria-label="Удалить" @click="$emit('remove')">
                    &times;
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: Object,
        required: true,
    },
    ingredients: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue', 'remove']);

function updateField(field, value) {
    emit('update:modelValue', { ...props.modelValue, [field]: value });
}
</script>
