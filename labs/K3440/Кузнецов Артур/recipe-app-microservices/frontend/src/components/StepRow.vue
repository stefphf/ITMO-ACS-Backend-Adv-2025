<template>
    <div class="step-row">
        <div class="d-flex justify-content-between align-items-center mb-2">
            <strong>Шаг {{ index + 1 }}</strong>
            <button type="button" class="btn btn-sm btn-outline-danger" @click="$emit('remove')"
                    aria-label="Удалить шаг">
                &times;
            </button>
        </div>
        <div class="mb-3">
            <label class="form-label">Описание шага<span aria-hidden="true">*</span></label>
            <textarea
                :value="modelValue.instruction"
                @input="updateField('instruction', $event.target.value)"
                class="form-control"
                rows="3"
                required
                aria-required="true"
            ></textarea>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: Object,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue', 'remove']);

function updateField(field, value) {
    emit('update:modelValue', { ...props.modelValue, [field]: value });
}
</script>

