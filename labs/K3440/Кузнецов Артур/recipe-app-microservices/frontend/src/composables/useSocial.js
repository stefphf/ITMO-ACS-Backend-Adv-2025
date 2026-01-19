import { useApi } from './useApi';

export function useSocial() {
    const { sendJsonRequest, API_BASE } = useApi();

    async function loadUser(userId) {
        const response = await sendJsonRequest(`${API_BASE.AUTH}/user/${userId}`);
        if (!response.ok) {
            throw new Error(response.data?.message || 'Пользователь не найден');
        }
        return response.data;
    }

    async function loadUserRecipes(userId) {
        const response = await sendJsonRequest(`${API_BASE.RECIPE}/recipe/user/${userId}`);
        if (!response.ok) {
            throw new Error(response.data?.message || 'Не удалось загрузить рецепты');
        }
        return response.data ?? [];
    }

    async function loadSubscriptions(userId) {
        const response = await sendJsonRequest(`${API_BASE.SOCIAL}/subscription/following/${userId}`);
        if (!response.ok) {
            throw new Error(response.data?.message || 'Не удалось загрузить подписки');
        }
        return response.data ?? [];
    }

    async function loadFollowers(userId) {
        const response = await sendJsonRequest(`${API_BASE.SOCIAL}/subscription/followers/${userId}`);
        if (!response.ok) {
            throw new Error(response.data?.message || 'Не удалось загрузить подписчиков');
        }
        return response.data ?? [];
    }

    async function loadUserLikes(userId) {
        const response = await sendJsonRequest(`${API_BASE.SOCIAL}/like/user/${userId}`);
        if (!response.ok) {
            throw new Error(response.data?.message || 'Не удалось загрузить лайки');
        }
        return response.data ?? [];
    }

    async function subscribe(followingId) {
        const response = await sendJsonRequest(`${API_BASE.SOCIAL}/subscription`, 'POST', {
            followingId,
        });
        if (!response.ok) {
            throw new Error(response.data?.message || 'Не удалось подписаться');
        }
        return response.data;
    }

    async function unsubscribe(subscriptionId) {
        const response = await sendJsonRequest(`${API_BASE.SOCIAL}/subscription/${subscriptionId}`, 'DELETE');
        if (!response.ok) {
            throw new Error(response.data?.message || 'Не удалось отписаться');
        }
    }

    async function checkSubscriptionStatus(profileUserId, currentUserId) {
        if (!currentUserId || currentUserId === profileUserId) return null;

        const followers = await loadFollowers(profileUserId);
        const subscription = followers.find((entry) => entry.followerId === currentUserId);
        return subscription || null;
    }

    async function resolveRecipeTitle(recipeId) {
        const response = await sendJsonRequest(`${API_BASE.RECIPE}/recipe/${recipeId}`);
        if (response.ok) {
            return response.data?.title || `Рецепт #${recipeId}`;
        }
        return `Рецепт #${recipeId}`;
    }

    return {
        loadUser,
        loadUserRecipes,
        loadSubscriptions,
        loadFollowers,
        loadUserLikes,
        subscribe,
        unsubscribe,
        checkSubscriptionStatus,
        resolveRecipeTitle,
    };
}

