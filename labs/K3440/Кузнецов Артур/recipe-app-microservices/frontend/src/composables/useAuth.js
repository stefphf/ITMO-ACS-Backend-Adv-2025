import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from './useApi';

const authState = reactive({
    currentUser: null,
    isLoading: false,
});

export function useAuth() {
    const router = useRouter();
    const { sendJsonRequest, saveToken, readToken, API_BASE } = useApi();

    const isAuthenticated = computed(() => Boolean(readToken()));

    function redirectToLogin() {
        router.push('/login');
    }

    function requireAuth() {
        if (!isAuthenticated.value) {
            redirectToLogin();
            return false;
        }
        return true;
    }

    async function fetchCurrentUser() {
        if (!isAuthenticated.value) return null;

        authState.isLoading = true;
        try {
            const response = await sendJsonRequest(`${API_BASE.AUTH}/user/me`);
            if (response.ok) {
                authState.currentUser = response.data;
                return response.data;
            } else {
                saveToken(null);
                authState.currentUser = null;
                return null;
            }
        } catch (error) {
            console.warn('Failed to fetch current user:', error);
            saveToken(null);
            authState.currentUser = null;
            return null;
        } finally {
            authState.isLoading = false;
        }
    }

    async function login(email, password) {
        authState.isLoading = true;
        try {
            const response = await sendJsonRequest(`${API_BASE.AUTH}/auth/login`, 'POST', {
                email,
                password,
            });
            if (response.ok) {
                saveToken(response.data.token);
                await fetchCurrentUser();
                return { success: true };
            } else {
                return { success: false, error: response.data?.message || 'Ошибка входа' };
            }
        } catch (error) {
            return { success: false, error: 'Ошибка сети' };
        } finally {
            authState.isLoading = false;
        }
    }

    async function register(firstName, lastName, email, password) {
        authState.isLoading = true;
        try {
            const response = await sendJsonRequest(`${API_BASE.AUTH}/auth/register`, 'POST', {
                first_name: firstName,
                last_name: lastName,
                email,
                password,
            });
            if (response.ok) {
                saveToken(response.data.token);
                await fetchCurrentUser();
                return { success: true };
            } else {
                return { success: false, error: response.data?.message || 'Ошибка регистрации' };
            }
        } catch (error) {
            return { success: false, error: 'Ошибка сети' };
        } finally {
            authState.isLoading = false;
        }
    }

    function logout() {
        saveToken(null);
        authState.currentUser = null;
        router.push('/search');
    }

    async function init() {
        if (isAuthenticated.value) {
            await fetchCurrentUser();
        }
    }

    return {
        currentUser: computed(() => authState.currentUser),
        isLoading: computed(() => authState.isLoading),
        isAuthenticated,
        requireAuth,
        redirectToLogin,
        fetchCurrentUser,
        login,
        register,
        logout,
        init,
    };
}
