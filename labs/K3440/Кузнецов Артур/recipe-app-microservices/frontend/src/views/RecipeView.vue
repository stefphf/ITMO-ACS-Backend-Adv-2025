<template>
  <main id="main-content" class="container py-4" role="main">
    <InlineAlert :message="alertMessage" :type="alertType" aria-live="assertive" aria-atomic="true" />

    <section v-if="recipe" class="page-header d-flex flex-wrap justify-content-between gap-3">
      <div>
        <p class="text-muted mb-1">Рецепт</p>
        <h1 class="mb-2">{{ recipe.title }}</h1>
        <p class="text-muted mb-1" aria-label="Метаданные рецепта">{{ recipeMeta }}</p>
        <p class="text-muted mb-0" aria-label="Автор рецепта">
          Автор: <router-link v-if="authorId" :to="`/user?id=${authorId}`" class="text-decoration-none">{{ authorName }}</router-link><span v-else>{{ authorName }}</span>
        </p>
      </div>
    </section>

    <div v-if="recipe" class="row g-4 mt-1">
      <div class="col-lg-8">
        <article class="card shadow-sm">
          <div class="card-body">
            <img
              v-if="recipe.image"
              :src="recipe.image"
              :alt="recipe.title"
              class="img-fluid rounded mb-3"
            />
            <p class="mb-0" aria-label="Описание рецепта">
              {{ recipe.description || 'Описание отсутствует.' }}
            </p>
          </div>
        </article>

        <article class="card shadow-sm mt-3">
          <div class="card-body">
            <h2 class="h5">Шаги приготовления</h2>
            <div v-if="steps.length === 0" class="entity-list-empty mt-3">
              Шаги приготовления появятся позже.
            </div>
            <div v-else class="mt-3">
              <div
                v-for="step in steps"
                :key="step.step_number"
                class="step-row"
              >
                <div class="d-flex align-items-center mb-2">
                  <span class="step-number-badge">{{ step.step_number }}</span>
                  <h6 class="mb-0">Шаг {{ step.step_number }}</h6>
                </div>
                <p class="mb-0">{{ step.instruction }}</p>
              </div>
            </div>
          </div>
        </article>

        <article class="card shadow-sm mt-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h5 mb-0">Комментарии</h2>
              <span class="data-summary">Всего: {{ comments.length }}</span>
            </div>
            <div v-if="comments.length === 0" class="entity-list-empty">Комментариев пока нет.</div>
            <div v-else>
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="card comment-card mb-3"
              >
                <div class="card-body">
                  <div class="comment-meta mb-2">
                    <router-link v-if="comment.userId" :to="`/user?id=${comment.userId}`" class="text-decoration-none fw-semibold">{{ comment.userName || `Пользователь #${comment.userId}` }}</router-link>
                    <span v-else>Пользователь #{{ comment.userId }}</span>
                    <span class="ms-2">{{ formatDate(comment.created_at) }}</span>
                  </div>
                  <p class="mb-0">{{ comment.content }}</p>
                </div>
              </div>
            </div>

            <div v-if="isAuthenticated" class="mt-4">
              <form @submit.prevent="handleCommentSubmit">
                <div class="mb-3">
                  <label for="commentText" class="form-label">Ваш комментарий</label>
                  <textarea
                    id="commentText"
                    v-model="commentText"
                    class="form-control"
                    rows="3"
                    required
                    aria-required="true"
                    aria-label="Текст комментария"
                  ></textarea>
                </div>
                <button class="btn btn-primary" type="submit" aria-label="Отправить комментарий">
                  Отправить
                </button>
              </form>
            </div>
            <div v-else class="alert alert-info mb-0 mt-4">
              Чтобы оставить комментарий, <router-link to="/login" class="alert-link">войдите</router-link> в аккаунт.
            </div>
          </div>
        </article>
      </div>

      <div class="col-lg-4">
        <section class="card shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h2 class="h5 mb-0">Ингредиенты</h2>
              <span class="badge bg-light text-dark">Всего {{ ingredients.length }}</span>
            </div>
            <ul v-if="ingredients.length > 0" class="list-group list-group-flush">
              <li
                v-for="(ingredient, index) in ingredients"
                :key="index"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{{ ingredient.ingredient?.name || 'Ингредиент' }}</span>
                <span class="text-muted">{{ ingredient.quantity }} {{ ingredient.unit }}</span>
              </li>
            </ul>
            <div v-else class="text-muted">Ингредиенты не указаны.</div>
          </div>
        </section>

        <section class="card shadow-sm mt-3">
          <div class="card-body">
            <h2 class="h6 text-uppercase text-muted">Действия</h2>
            <p class="mb-1">Лайков: <strong>{{ likes.length }}</strong></p>
            <button
              v-if="!isAuthenticated"
              class="btn btn-outline-primary w-100 mb-2"
              @click="$router.push('/login')"
            >
              Войти, чтобы поставить лайк
            </button>
            <button
              v-else
              class="btn w-100 mb-2"
              :class="hasUserLike ? 'btn-primary' : 'btn-outline-primary'"
              @click="toggleLike"
            >
              {{ hasUserLike ? 'Убрать лайк' : 'Нравится' }}
            </button>
            <button
              v-if="canEdit"
              class="btn btn-outline-secondary w-100 mb-2"
              @click="$router.push(`/edit-recipe/${recipeId}`)"
            >
              Редактировать
            </button>
            <button
              class="btn btn-outline-dark w-100"
              @click="showShareModal = true"
              aria-haspopup="dialog"
              aria-controls="shareModal"
            >
              Поделиться
            </button>
          </div>
        </section>
      </div>
    </div>

    <LoadingSpinner v-else text="Загрузка рецепта..." />

    <!-- Share Modal -->
    <div
      v-if="showShareModal"
      class="modal fade show"
      id="shareModal"
      tabindex="-1"
      style="display: block;"
      aria-hidden="false"
      aria-labelledby="shareModalLabel"
      aria-describedby="shareModalDesc"
    >
      <div class="modal-dialog" @click.self="showShareModal = false">
        <div class="modal-content" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h5 id="shareModalLabel" class="modal-title">Поделиться рецептом</h5>
            <button type="button" class="btn-close" @click="showShareModal = false" aria-label="Закрыть"></button>
          </div>
          <div id="shareModalDesc" class="modal-body">
            <p class="mb-2">Скопируйте ссылку и поделитесь рецептом с друзьями:</p>
            <div class="input-group">
              <input
                id="shareLinkInput"
                :value="shareLink"
                class="form-control"
                type="text"
                readonly
                aria-label="Ссылка на рецепт"
              />
              <button class="btn btn-outline-primary" type="button" @click="copyShareLink" aria-label="Скопировать ссылку">
                Скопировать
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showShareModal = false" aria-label="Закрыть окно Поделиться">
              Закрыть
            </button>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" @click="showShareModal = false"></div>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '@/composables/useApi';
import { useAuth } from '@/composables/useAuth';
import { useSocial } from '@/composables/useSocial';
import { formatMinutesToText } from '@/utils/helpers';
import InlineAlert from '@/components/InlineAlert.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const route = useRoute()
const { sendJsonRequest, API_BASE } = useApi()
const { isAuthenticated, currentUser } = useAuth()
const { loadUser } = useSocial()

const recipeId = computed(() => Number(route.params.id))
const recipe = ref(null)
const authorName = ref('неизвестно')
const authorId = ref(null)
const ingredients = ref([])
const steps = ref([])
const comments = ref([])
const likes = ref([])
const hasUserLike = ref(false)
const canEdit = ref(false)
const commentText = ref('')
const alertMessage = ref('')
const alertType = ref('danger')
const shareLink = ref('')
const showShareModal = ref(false)

const recipeMeta = computed(() => {
  if (!recipe.value) return ''
  return [
    `Тип: ${recipe.value.dishType?.name || '-'}`,
    `Сложность: ${recipe.value.recipeDifficulty?.name || '-'}`,
    `Порций: ${recipe.value.servings}`,
    `Время подготовки: ${formatMinutesToText(recipe.value.preparation_time)}`,
    `Время готовки: ${formatMinutesToText(recipe.value.cooking_time)}`,
  ].join(' • ')
})

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('ru-RU')
}

async function loadRecipe() {
  try {
    const response = await sendJsonRequest(`${API_BASE.RECIPE}/recipe/${recipeId.value}`)
    if (!response.ok) {
      alertMessage.value = response.data?.message || 'Рецепт не найден'
      return
    }

    recipe.value = response.data
    ingredients.value = recipe.value.recipeIngredients ?? []
    steps.value = (recipe.value.steps ?? []).sort((a, b) => a.step_number - b.step_number)
    canEdit.value = currentUser.value?.id === recipe.value.userId
    shareLink.value = window.location.href

    await Promise.all([loadAuthor(), loadComments(), loadLikes()])
  } catch (error) {
    alertMessage.value = 'Не удалось загрузить рецепт'
  }
}

async function loadAuthor() {
  if (!recipe.value?.userId) return
  authorId.value = recipe.value.userId
  try {
    const response = await sendJsonRequest(`${API_BASE.AUTH}/user/${recipe.value.userId}`)
    if (response.ok && response.data) {
      authorName.value = `${response.data.first_name} ${response.data.last_name}`.trim() || 'Профиль пользователя'
    }
  } catch (error) {
    console.warn('Failed to load author', error)
  }
}

async function loadComments() {
  try {
    const response = await sendJsonRequest(`${API_BASE.SOCIAL}/comment/${recipeId.value}`)
    if (response.ok) {
      const commentsData = response.data ?? []
      // Загружаем имена пользователей для каждого комментария
      comments.value = await Promise.all(
        commentsData.map(async (comment) => {
          if (comment.userId) {
            try {
              const user = await loadUser(comment.userId)
              return {
                ...comment,
                userName: `${user.first_name} ${user.last_name}`.trim() || `Пользователь #${comment.userId}`,
              }
            } catch (error) {
              return {
                ...comment,
                userName: `Пользователь #${comment.userId}`,
              }
            }
          }
          return comment
        })
      )
    }
  } catch (error) {
    console.error('Failed to load comments', error)
  }
}

async function loadLikes() {
  try {
    const response = await sendJsonRequest(`${API_BASE.SOCIAL}/like/recipe/${recipeId.value}`)
    if (response.ok) {
      likes.value = response.data ?? []
      hasUserLike.value = currentUser.value
        ? likes.value.some((like) => like.userId === currentUser.value.id)
        : false
    }
  } catch (error) {
    console.error('Failed to load likes', error)
  }
}

async function toggleLike() {
  if (!isAuthenticated.value) return

  try {
    if (hasUserLike.value) {
      const userLike = likes.value.find((like) => like.userId === currentUser.value.id)
      if (userLike) {
        const response = await sendJsonRequest(`${API_BASE.SOCIAL}/like/${userLike.id}`, 'DELETE')
        if (response.ok) {
          await loadLikes()
        }
      }
    } else {
      const response = await sendJsonRequest(`${API_BASE.SOCIAL}/like`, 'POST', {
        recipeId: recipeId.value,
      })
      if (response.ok) {
        await loadLikes()
      }
    }
  } catch (error) {
    alertMessage.value = 'Не удалось изменить лайк'
  }
}

async function handleCommentSubmit() {
  if (!commentText.value.trim()) {
    alertMessage.value = 'Введите текст комментария.'
    return
  }

  try {
    const response = await sendJsonRequest(
      `${API_BASE.SOCIAL}/comment/${recipeId.value}`,
      'POST',
      { content: commentText.value.trim() }
    )
    if (response.ok) {
      commentText.value = ''
      alertMessage.value = ''
      await loadComments()
    } else {
      alertMessage.value = response.data?.message || 'Не удалось отправить комментарий.'
    }
  } catch (error) {
    alertMessage.value = 'Не удалось отправить комментарий'
  }
}

function copyShareLink() {
  const input = document.getElementById('shareLinkInput')
  if (input) {
    input.select()
    input.setSelectionRange(0, input.value.length)
    navigator.clipboard.writeText(input.value)
      .then(() => {
        alertMessage.value = 'Ссылка скопирована в буфер обмена.'
        alertType.value = 'success'
        setTimeout(() => {
          alertMessage.value = ''
        }, 2500)
      })
      .catch(() => {
        alertMessage.value = 'Не удалось скопировать ссылку.'
        alertType.value = 'danger'
      })
  }
}

watch(() => route.params.id, () => {
  loadRecipe()
}, { immediate: true })

onMounted(() => {
  loadRecipe()
})
</script>

