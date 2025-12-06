// stores/useColorStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Definición de interfaces para el esquema de colores
interface ColorScheme {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    navbarBg: string
    footerBg: string
    textPrimary: string
    textSecondary: string
    buttonBg: string
    buttonText: string
    progressStart: string
    progressEnd: string
    cardBg: string
  }
}

// Esquemas de colores predefinidos para riferos
const colorSchemes: ColorScheme[] = [
  {
    name: 'default',
    colors: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      accent: '#3b82f6',
      navbarBg: '#1e293b',
      footerBg: '#3b82f6',
      textPrimary: '#fff',
      textSecondary: '#000',
      buttonBg: '#2563eb',
      buttonText: '#fff',
      progressStart: '#93c5fd',
      progressEnd: '#2563eb',
      cardBg: '#ffffff'
    }
  },
  {
    name: 'red',
    colors: {
      primary: '#1e293b',
      secondary: '#ff6b9c',
      accent: '#ff3366',
      navbarBg: '#111',
      footerBg: '#ff3366',
      textPrimary: '#fff',
      textSecondary: '#000',
      buttonBg: '#ff4757',
      buttonText: '#000',
      progressStart: '#ff8fa3',
      progressEnd: '#ff4757',
      cardBg: '#ffffff'
    }
  },
  {
    name: 'green',
    colors: {
      primary: '#10b981',
      secondary: '#34d399',
      accent: '#10b981',
      navbarBg: '#064e3b',
      footerBg: '#10b981',
      textPrimary: '#fff',
      textSecondary: '#000',
      buttonBg: '#059669',
      buttonText: '#fff',
      progressStart: '#6ee7b7',
      progressEnd: '#059669',
      cardBg: '#ffffff'
    }
  },
  {
    name: 'purple',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#8b5cf6',
      navbarBg: '#4c1d95',
      footerBg: '#8b5cf6',
      textPrimary: '#fff',
      textSecondary: '#000',
      buttonBg: '#7c3aed',
      buttonText: '#fff',
      progressStart: '#c4b5fd',
      progressEnd: '#7c3aed',
      cardBg: '#ffffff'
    }
  },
  {
    name: 'dark',
    colors: {
      primary: '#1f2937',
      secondary: '#374151',
      accent: '#6b7280',
      navbarBg: '#111827',
      footerBg: '#1f2937',
      textPrimary: '#fff',
      textSecondary: '#fff',
      buttonBg: '#4b5563',
      buttonText: '#fff',
      progressStart: '#9ca3af',
      progressEnd: '#4b5563',
      cardBg: '#1f2937'
    }
  }
]

export const useColorStore = defineStore('colors', () => {
  // Estado para controlar si estamos en una página de rifero
  const isRiferoPage = ref(false)
  
  // Estado reactivo para el esquema de colores actual
  const currentScheme = ref<ColorScheme>(colorSchemes[0]!)
  
  // Getters computados para acceder fácilmente a los colores
  const colors = computed(() => currentScheme.value.colors)
  
  const primary = computed(() => colors.value.primary)
  const secondary = computed(() => colors.value.secondary)
  const accent = computed(() => colors.value.accent)
  const navbarBg = computed(() => colors.value.navbarBg)
  const footerBg = computed(() => colors.value.footerBg)
  const textPrimary = computed(() => colors.value.textPrimary)
  const textSecondary = computed(() => colors.value.textSecondary)
  const buttonBg = computed(() => colors.value.buttonBg)
  const buttonText = computed(() => colors.value.buttonText)
  const progressStart = computed(() => colors.value.progressStart)
  const progressEnd = computed(() => colors.value.progressEnd)
  const cardBg = computed(() => colors.value.cardBg)
  
  // Acciones
  const setColorScheme = (schemeName: string) => {
    const scheme = colorSchemes.find(s => s.name === schemeName)
    if (scheme) {
      currentScheme.value = scheme
      // Guardar en localStorage para persistencia
      localStorage.setItem('colorScheme', schemeName)
    }
  }
  
  const setCustomColors = (customColors: Partial<ColorScheme['colors']>) => {
    currentScheme.value = {
      name: 'custom',
      colors: {
        ...currentScheme.value.colors,
        ...customColors
      }
    }
  }
  
  // Acciones para controlar el estado de página de rifero
  const setRiferoPage = (value: boolean) => {
    isRiferoPage.value = value
  }
  
  // Inicializar desde localStorage
  const initialize = () => {
    const savedScheme = localStorage.getItem('colorScheme')
    if (savedScheme) {
      setColorScheme(savedScheme)
    }
  }
  
  // Obtener lista de esquemas disponibles
  const getAvailableSchemes = () => colorSchemes
  
  return {
    // State
    currentScheme,
    isRiferoPage,
    
    // Getters
    colors,
    primary,
    secondary,
    accent,
    navbarBg,
    footerBg,
    textPrimary,
    textSecondary,
    buttonBg,
    buttonText,
    progressStart,
    progressEnd,
    cardBg,
    
    // Actions
    setColorScheme,
    setCustomColors,
    setRiferoPage,
    initialize,
    getAvailableSchemes
  }
})