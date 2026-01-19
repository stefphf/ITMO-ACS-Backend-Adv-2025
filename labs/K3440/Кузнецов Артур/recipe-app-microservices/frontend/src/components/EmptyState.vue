<template>
    <div class="entity-list-empty">{{ text }}</div>
</template>

<script setup>
defineProps({
    text: {
        type: String,
        required: true,
    },
});
</script>

