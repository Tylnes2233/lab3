import { ref, onMounted } from 'vue'

const THEME_KEY = 'eduboard_theme'

export function useTheme() {
  const themes = ['light', 'dark', 'corporate', 'emerald']
  const activeTheme = ref<string>(localStorage.getItem(THEME_KEY) || 'light')

  const switchTheme = (theme: string) => {
    activeTheme.value = theme
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }

  onMounted(() => {
    switchTheme(activeTheme.value)
  })

  return {
    themes,
    activeTheme,
    switchTheme
  }
}