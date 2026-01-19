<template>
    <main class="container py-4" role="main">
        <InlineAlert :message="alertMessage" :type="alertType" aria-live="assertive" aria-atomic="true" />

        <section v-if="profileUser" class="page-header d-flex flex-wrap justify-content-between gap-3">
            <div>
                <p class="text-muted mb-1">Профиль пользователя</p>
                <h1 class="mb-2 d-flex align-items-center">
                    <svg class="me-2" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                        <use href="#userCircle"></use>
                    </svg>
                    <span>{{ profileUser.first_name }} {{ profileUser.last_name }}</span>
                </h1>
                <ul class="list-inline text-muted mb-0">
                    <li class="list-inline-item">
                        <strong>{{ stats.recipes }}</strong> рецептов
                    </li>
                    <li class="list-inline-item">
                        <strong>{{ stats.subscriptions }}</strong> подписок
                    </li>
                    <li class="list-inline-item">
                        <strong>{{ stats.followers }}</strong> подписчиков
                    </li>
                    <li class="list-inline-item">
                        <strong>{{ stats.likes }}</strong> лайков
                    </li>
                </ul>
            </div>
            <div v-if="showActions" class="d-flex flex-column align-items-end gap-2">
                <router-link v-if="isOwnProfile" to="/create-recipe" class="btn btn-primary btn-sm">
                    Создать рецепт
                </router-link>
                <button
                    v-if="!isOwnProfile && isAuthenticated"
                    class="btn btn-sm"
                    :class="subscription ? 'btn-outline-danger' : 'btn-outline-primary'"
                    @click="toggleSubscription"
                    :disabled="isLoading"
                >
                    {{ subscription ? 'Отписаться' : 'Подписаться' }}
                </button>
            </div>
        </section>

        <section v-if="profileUser">
            <ul class="nav nav-tabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button
                        class="nav-link"
                        :class="{ active: activeTab === 'recipes' }"
                        @click="activeTab = 'recipes'"
                        type="button"
                        role="tab"
                    >
                        Рецепты
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button
                        class="nav-link"
                        :class="{ active: activeTab === 'subscriptions' }"
                        @click="activeTab = 'subscriptions'"
                        type="button"
                        role="tab"
                    >
                        Подписки
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button
                        class="nav-link"
                        :class="{ active: activeTab === 'followers' }"
                        @click="activeTab = 'followers'"
                        type="button"
                        role="tab"
                    >
                        Подписчики
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button
                        class="nav-link"
                        :class="{ active: activeTab === 'likes' }"
                        @click="activeTab = 'likes'"
                        type="button"
                        role="tab"
                    >
                        Лайки
                    </button>
                </li>
            </ul>

            <div class="tab-content pt-3">
                <div v-if="activeTab === 'recipes'" class="tab-pane fade show active">
                    <div v-if="isLoading" class="row">
                        <div class="col-12">
                            <LoadingSpinner text="Загружаем рецепты..." />
                        </div>
                    </div>
                    <div v-else-if="recipes.length === 0" class="row">
                        <div class="col-12">
                            <EmptyState text="Пока нет опубликованных рецептов." />
                        </div>
                    </div>
                    <div v-else class="row row-cols-1 row-cols-md-2 g-3">
                        <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
                    </div>
                </div>

                <div v-if="activeTab === 'subscriptions'" class="tab-pane fade"
                     :class="{ 'show active': activeTab === 'subscriptions' }">
                    <UserList
                        :users="subscriptions"
                        :loading="isLoading"
                        empty-text="Список подписок пуст."
                        loading-text="Загружаем подписки..."
                        user-id-field="followingId"
                    />
                </div>

                <div v-if="activeTab === 'followers'" class="tab-pane fade"
                     :class="{ 'show active': activeTab === 'followers' }">
                    <UserList
                        :users="followers"
                        :loading="isLoading"
                        empty-text="Список подписчиков пуст."
                        loading-text="Загружаем подписчиков..."
                        user-id-field="followerId"
                    />
                </div>

                <div v-if="activeTab === 'likes'" class="tab-pane fade"
                     :class="{ 'show active': activeTab === 'likes' }">
                    <LikesList :likes="likes" :loading="isLoading" />
                </div>
            </div>
        </section>

        <LoadingSpinner v-else text="Загрузка профиля..." />
    </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useSocial } from '@/composables/useSocial';
import RecipeCard from '@/components/RecipeCard.vue';
import InlineAlert from '@/components/InlineAlert.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import EmptyState from '@/components/EmptyState.vue';
import UserList from '@/components/UserList.vue';
import LikesList from '@/components/LikesList.vue';

const route = useRoute();
const { currentUser, isAuthenticated } = useAuth();
const {
    loadUser,
    loadUserRecipes,
    loadSubscriptions,
    loadFollowers,
    loadUserLikes,
    subscribe,
    unsubscribe,
    checkSubscriptionStatus,
} = useSocial();

const profileUser = ref(null);
const recipes = ref([]);
const subscriptions = ref([]);
const followers = ref([]);
const likes = ref([]);
const subscription = ref(null);
const activeTab = ref('recipes');
const isLoading = ref(false);
const alertMessage = ref('');
const alertType = ref('danger');

const stats = reactive({
    recipes: 0,
    subscriptions: 0,
    followers: 0,
    likes: 0,
});

const profileUserId = computed(() => {
    if (route.query.mode === 'me') {
        return currentUser.value?.id;
    }
    return route.query.id ? Number(route.query.id) : currentUser.value?.id;
});

const isOwnProfile = computed(() => {
    return currentUser.value && profileUserId.value === currentUser.value.id;
});

const showActions = computed(() => {
    return isOwnProfile.value || (isAuthenticated.value && !isOwnProfile.value);
});

async function loadProfile() {
    if (!profileUserId.value) {
        alertMessage.value = 'Укажите пользователя или авторизуйтесь';
        return;
    }

    isLoading.value = true;
    try {
        profileUser.value = await loadUser(profileUserId.value);
        await Promise.all([loadStats(), loadSubscriptionStatus()]);
    } catch (error) {
        alertMessage.value = error.message || 'Не удалось загрузить профиль';
    } finally {
        isLoading.value = false;
    }
}

async function loadStats() {
    try {
        const [recipesData, subs, followersData, likesData] = await Promise.all([
            loadUserRecipes(profileUserId.value),
            loadSubscriptions(profileUserId.value),
            loadFollowers(profileUserId.value),
            loadUserLikes(profileUserId.value),
        ]);

        stats.recipes = recipesData.length;
        stats.subscriptions = subs.length;
        stats.followers = followersData.length;
        stats.likes = likesData.length;
    } catch (error) {
        console.error('Failed to load stats', error);
    }
}

async function loadSubscriptionStatus() {
    if (!isAuthenticated.value || isOwnProfile.value) return;

    try {
        subscription.value = await checkSubscriptionStatus(profileUserId.value, currentUser.value.id);
    } catch (error) {
        console.error('Failed to check subscription', error);
    }
}

async function loadTabData() {
    if (!profileUserId.value) return;

    isLoading.value = true;
    try {
        switch (activeTab.value) {
            case 'recipes':
                recipes.value = await loadUserRecipes(profileUserId.value);
                break;
            case 'subscriptions':
                subscriptions.value = await loadSubscriptions(profileUserId.value);
                break;
            case 'followers':
                followers.value = await loadFollowers(profileUserId.value);
                await loadSubscriptionStatus();
                break;
            case 'likes':
                likes.value = await loadUserLikes(profileUserId.value);
                break;
        }
    } catch (error) {
        alertMessage.value = error.message || 'Ошибка загрузки данных';
    } finally {
        isLoading.value = false;
    }
}

async function toggleSubscription() {
    if (!isAuthenticated.value) return;

    isLoading.value = true;
    try {
        if (subscription.value) {
            await unsubscribe(subscription.value.id);
            subscription.value = null;
            stats.followers--;
        } else {
            await subscribe(profileUserId.value);
            subscription.value = { followerId: currentUser.value.id };
            stats.followers++;
        }
    } catch (error) {
        alertMessage.value = error.message || 'Ошибка изменения подписки';
    } finally {
        isLoading.value = false;
    }
}

watch(
    () => activeTab.value,
    () => {
        loadTabData();
    },
);

watch(
    () => route.query,
    () => {
        loadProfile().then(() => {
            if (activeTab.value === 'recipes') {
                loadTabData();
            }
        });
    },
    { deep: true },
);

onMounted(async () => {
    await loadProfile();
    await loadTabData();
});
</script>
