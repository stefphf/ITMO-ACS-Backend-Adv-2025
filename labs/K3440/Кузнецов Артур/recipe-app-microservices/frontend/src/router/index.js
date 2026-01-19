import { createRouter, createWebHistory } from 'vue-router';
import { TOKEN_KEY } from '@/config/api';

function isAuthenticated() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
}

const routes = [
    {
        path: '/',
        redirect: '/search',
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('@/views/SearchView.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
        meta: { requiresGuest: true },
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/RegisterView.vue'),
        meta: { requiresGuest: true },
    },
    {
        path: '/recipe/:id',
        name: 'Recipe',
        component: () => import('@/views/RecipeView.vue'),
        props: true,
    },
    {
        path: '/create-recipe',
        name: 'CreateRecipe',
        component: () => import('@/views/RecipeFormView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/edit-recipe/:id',
        name: 'EditRecipe',
        component: () => import('@/views/RecipeFormView.vue'),
        props: true,
        meta: { requiresAuth: true },
    },
    {
        path: '/user',
        name: 'User',
        component: () => import('@/views/UserView.vue'),
        props: (route) => ({ query: route.query }),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const authenticated = isAuthenticated();

    if (to.meta.requiresAuth && !authenticated) {
        next({ name: 'Login', query: { redirect: to.fullPath } });
        return;
    }

    if (to.meta.requiresGuest && authenticated) {
        next({ name: 'Search' });
        return;
    }

    next();
});

export default router;
