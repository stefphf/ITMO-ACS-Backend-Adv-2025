<template>
    <div>
        <LoadingSpinner v-if="loading || isProcessing" :text="loadingText" />
        <EmptyState v-else-if="processedUsers.length === 0" :text="emptyText" />
        <div v-else>
            <div v-for="user in processedUsers" :key="user.id" class="card mb-2">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">{{ user.name }}</h6>
                        <p class="text-muted mb-0">ID: {{ user.id }} • {{ formatDate(user.date) }}</p>
                    </div>
                    <router-link :to="`/user?id=${user.id}`" class="btn btn-sm btn-outline-primary">
                        Перейти
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useSocial } from '@/composables/useSocial';
import LoadingSpinner from './LoadingSpinner.vue';
import EmptyState from './EmptyState.vue';

const props = defineProps({
    users: {
        type: Array,
        default: () => [],
    },
    loading: {
        type: Boolean,
        default: false,
    },
    emptyText: {
        type: String,
        default: 'Список пуст.',
    },
    loadingText: {
        type: String,
        default: 'Загрузка...',
    },
    userIdField: {
        type: String,
        default: 'id',
    },
});

const { loadUser } = useSocial();
const processedUsers = ref([]);
const isProcessing = ref(false);

async function processUsers() {
    if (!props.users.length) {
        processedUsers.value = [];
        return;
    }

    isProcessing.value = true;
    try {
        const uniqueIds = [...new Set(props.users.map((entry) => entry[props.userIdField]))];
        const userMap = new Map();

        await Promise.all(
            uniqueIds.map(async (id) => {
                try {
                    const user = await loadUser(id);
                    userMap.set(id, `${user.first_name} ${user.last_name}`);
                } catch {
                    userMap.set(id, `Пользователь #${id}`);
                }
            }),
        );

        processedUsers.value = props.users.map((entry) => ({
            id: entry[props.userIdField],
            name: userMap.get(entry[props.userIdField]) || `Пользователь #${entry[props.userIdField]}`,
            date: entry.created_at,
        }));
    } catch (error) {
        console.error('Failed to process users', error);
        processedUsers.value = [];
    } finally {
        isProcessing.value = false;
    }
}

watch(() => props.users, processUsers, { immediate: true });

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('ru-RU');
}
</script>
