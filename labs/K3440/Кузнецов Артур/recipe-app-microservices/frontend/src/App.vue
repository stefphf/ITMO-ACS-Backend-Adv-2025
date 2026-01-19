<template>
    <div id="app">
        <AppHeader />
        <router-view />
        <AppFooter />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useTheme } from '@/composables/useTheme';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

const { init } = useAuth();
const { theme } = useTheme();

onMounted(async () => {
    await init();
});
</script>

<style>
#app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

main {
    flex: 1;
}
</style>

