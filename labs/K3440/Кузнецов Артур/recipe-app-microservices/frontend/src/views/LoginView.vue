<template>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow" role="form">
                    <div class="card-body">
                        <h3 class="mb-3">Вход</h3>
                        <InlineAlert :message="errorMessage" type="danger" />
                        <form @submit.prevent="handleSubmit" novalidate>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input
                                    id="email"
                                    v-model="email"
                                    class="form-control"
                                    type="email"
                                    required
                                    autocomplete="email"
                                    aria-required="true"
                                />
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Пароль</label>
                                <input
                                    id="password"
                                    v-model="password"
                                    class="form-control"
                                    type="password"
                                    required
                                    autocomplete="current-password"
                                    aria-required="true"
                                />
                            </div>
                            <button class="btn btn-primary w-100" type="submit" :disabled="isLoading">
                                {{ isLoading ? 'Вход...' : 'Войти' }}
                            </button>
                        </form>
                        <hr />
                        <p class="small mb-0">
                            Нет аккаунта?
                            <router-link to="/register">Зарегистрироваться</router-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import InlineAlert from '@/components/InlineAlert.vue';

const route = useRoute();
const router = useRouter();
const { login, isLoading } = useAuth();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

async function handleSubmit() {
    errorMessage.value = '';
    if (!email.value || !password.value) {
        errorMessage.value = 'Email и пароль обязательны';
        return;
    }

    const result = await login(email.value, password.value);
    if (result.success) {
        const redirect = route.query.redirect || '/user?mode=me';
        await router.push(redirect);
    } else {
        errorMessage.value = result.error;
    }
}
</script>

<style scoped>
.card {
    background-color: var(--card-bg);
}
</style>
