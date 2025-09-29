/// <reference types="vite/client" />

// 👇 Hace que TS entienda los .vue como componentes válidos
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 👇 Tipos para imágenes y otros assets estáticos
declare module '*.png' {
  const value: string
  export default value
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.jpeg' {
  const value: string
  export default value
}

declare module '*.gif' {
  const value: string
  export default value
}

declare module '*.svg' {
  const value: string
  export default value
}

declare module '*.webp' {
  const value: string
  export default value
}

declare module '*.mp4' {
  const value: string
  export default value
}

declare module '*.webm' {
  const value: string
  export default value
}

// 👇 Opcional: tipado de variables de entorno de Vite
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME?: string
  // agrega aquí las variables que uses en .env
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
