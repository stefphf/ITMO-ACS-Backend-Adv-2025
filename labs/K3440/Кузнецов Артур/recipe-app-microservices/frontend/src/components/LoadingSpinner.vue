<template>
    <div class="d-flex align-items-center gap-2 text-muted">
        <div class="spinner-border spinner-border-sm" role="status"></div>
        <span>{{ text }}</span>
    </div>
</template>

<script setup>
defineProps({
    text: {
        type: String,
        default: 'Загрузка...',
    },
});
</script>

