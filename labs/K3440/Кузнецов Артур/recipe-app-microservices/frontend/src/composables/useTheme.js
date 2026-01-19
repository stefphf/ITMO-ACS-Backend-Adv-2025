import { onMounted, ref, watch } from 'vue';

export function useTheme() {
    const theme = ref(localStorage.getItem('theme') || 'light');

    function applyTheme(newTheme) {
        theme.value = newTheme;
        localStorage.setItem('theme', newTheme);

        const body = document.body;
        const header = document.querySelector('header');
        const nav = document.querySelector('.navbar');

        if (newTheme === 'dark') {
            body.classList.add('dark-theme');
            body.setAttribute('data-bs-theme', 'dark');
            if (header) header.setAttribute('data-bs-theme', 'dark');
            if (nav) nav.setAttribute('data-bs-theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            body.removeAttribute('data-bs-theme');
            if (header) header.removeAttribute('data-bs-theme');
            if (nav) nav.removeAttribute('data-bs-theme');
        }
    }

    function toggleTheme() {
        const newTheme = theme.value === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    }

    watch(theme, (newTheme) => {
        applyTheme(newTheme);
    });

    onMounted(() => {
        applyTheme(theme.value);
    });

    return {
        theme,
        toggleTheme,
    };
}

