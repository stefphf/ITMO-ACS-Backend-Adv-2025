<template>
    <div v-if="message" :class="['alert', 'inline-alert', `alert-${type}`]" role="alert" :aria-live="ariaLive">
        <span v-if="!isHtml">{{ message }}</span>
        <span v-else v-html="message"></span>
    </div>
</template>

<script setup>
defineProps({
    message: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: 'danger',
    },
    ariaLive: {
        type: String,
        default: 'polite',
    },
    isHtml: {
        type: Boolean,
        default: false,
    },
});
</script>

<style scoped>
.inline-alert {
    display: block;
}
</style>

