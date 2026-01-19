<template>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-7">
                <div class="card shadow" role="form">
                    <div class="card-body">
                        <h3 class="mb-3">Регистрация</h3>
                        <InlineAlert :message="errorMessage" type="danger" />
                        <form @submit.prevent="handleSubmit" novalidate>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="firstName" class="form-label">Имя</label>
                                    <input
                                        id="firstName"
                                        v-model="firstName"
                                        class="form-control"
                                        type="text"
                                        required
                                        autocomplete="given-name"
                                        aria-required="true"
                                    />
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="lastName" class="form-label">Фамилия</label>
                                    <input
                                        id="lastName"
                                        v-model="lastName"
                                        class="form-control"
                                        type="text"
                                        required
                                        autocomplete="family-name"
                                        aria-required="true"
                                    />
                                </div>
                            </div>
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
                                <label for="password" class="form-label">Пароль (мин. 8 символов)</label>
                                <input
                                    id="password"
                                    v-model="password"
                                    class="form-control"
                                    type="password"
                                    required
                                    autocomplete="new-password"
                                    aria-required="true"
                                    minlength="8"
                                />
                            </div>
                            <button class="btn btn-primary w-100" type="submit" :disabled="isLoading">
                                {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
                            </button>
                        </form>
                        <hr />
                        <p class="small mb-0">
                            Уже есть аккаунт?
                            <router-link to="/login">Войти</router-link>
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
const { register, isLoading } = useAuth();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');

async function handleSubmit() {
    errorMessage.value = '';
    if (!firstName.value || !lastName.value || !email.value || !password.value) {
        errorMessage.value = 'Все поля обязательны';
        return;
    }

    const result = await register(firstName.value, lastName.value, email.value, password.value);
    if (result.success) {
        const redirect = route.query.redirect || '/user?mode=me';
        router.push(redirect);
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
