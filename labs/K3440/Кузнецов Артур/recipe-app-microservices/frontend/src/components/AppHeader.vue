<template>
    <header class="bg-white border-bottom" role="banner">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: none;">
            <symbol id="appLogo" viewBox="0 0 16 16">
                <path
                    d="M13 .5c0-.276-.226-.506-.498-.465-1.703.257-2.94 2.012-3 8.462a.5.5 0 0 0 .498.5c.56.01 1 .13 1 1.003v5.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5zM4.25 0a.25.25 0 0 1 .25.25v5.122a.128.128 0 0 0 .256.006l.233-5.14A.25.25 0 0 1 5.24 0h.522a.25.25 0 0 1 .25.238l.233 5.14a.128.128 0 0 0 .256-.006V.25A.25.25 0 0 1 6.75 0h.29a.5.5 0 0 1 .498.458l.423 5.07a1.69 1.69 0 0 1-1.059 1.711l-.053.022a.92.92 0 0 0-.58.884L6.47 15a.971.971 0 1 1-1.942 0l.202-6.855a.92.92 0 0 0-.58-.884l-.053-.022a1.69 1.69 0 0 1-1.059-1.712L3.462.458A.5.5 0 0 1 3.96 0z" />
            </symbol>
            <symbol id="search" viewBox="0 0 16 16">
                <path
                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </symbol>
            <symbol id="userCircle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                <path fill-rule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
            </symbol>
        </svg>
        <a class="visually-hidden-focusable" href="#main-content">Пропустить к содержимому</a>
        <nav class="navbar navbar-expand-lg navbar-light container" role="navigation" aria-label="Главная навигация">
            <router-link class="navbar-brand d-flex align-items-center" to="/search">
                <svg class="me-2" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                    <use href="#appLogo"></use>
                </svg>
                <span>RecipeApp</span>
            </router-link>
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mainNav"
                aria-controls="mainNav"
                aria-expanded="false"
                aria-label="Открыть и закрыть меню"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mainNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link" :class="{ active: $route.path === '/search' }" to="/search">
                            Поиск
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" :class="{ active: $route.path === '/create-recipe' }"
                                     to="/create-recipe">Создать рецепт
                        </router-link>
                    </li>
                </ul>
                <div class="d-flex gap-2 align-items-center">
                    <button
                        class="btn btn-outline-secondary btn-sm"
                        aria-label="Переключить тему"
                        title="Переключить тему"
                        @click="toggleTheme"
                    >
                        <span>{{ theme === 'light' ? '🌙' : '☀️' }}</span>
                    </button>
                    <template v-if="!isAuthenticated">
                        <router-link class="btn btn-outline-primary btn-sm" to="/login">Войти</router-link>
                        <router-link class="btn btn-primary btn-sm" to="/register">Регистрация</router-link>
                    </template>
                    <template v-else>
                        <router-link class="btn btn-outline-secondary btn-sm" to="/user?mode=me">Мой профиль
                        </router-link>
                        <button class="btn btn-outline-danger btn-sm" aria-label="Выйти из аккаунта" @click="logout">
                            Выйти
                        </button>
                    </template>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth';
import { useTheme } from '@/composables/useTheme';

const { isAuthenticated, logout } = useAuth();
const { theme, toggleTheme } = useTheme();
</script>
