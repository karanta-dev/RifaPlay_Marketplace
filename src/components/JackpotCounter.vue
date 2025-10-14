<!-- JackpotCounter.vue -->
<template>
  <div class="jackpot-container">
    <!-- Encabezado -->
    <div class="jackpot-header">ACUMULADO</div>
    <div class="cant_container">
      <div ref="wrapperRef" class="jackpot-wrapper" role="img" aria-label="jackpot counter">
        <!-- Símbolo de dólar fijo -->
        <div class="symbol">$</div>

        <!-- Columnas con dígitos -->
        <div
          v-for="(d, i) in digitsArray"
          :key="`col-${i}-${d}`"
          class="digit-column"
        >
          <div
            class="digit-stack"
            :style="{
              transform: `translateY(-${(currentOffsets?.[i] ?? 0) * digitHeight}px)`,
              transition: `transform ${durations?.[i] ?? 0}ms cubic-bezier(.22,.98,.38,1)`
            }"
          >
            <div
              v-for="n in TOTAL_ITEMS"
              :key="`item-${i}-${n}`"
              class="digit"
            >
              {{ stackItems[n - 1] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{ value: number }>();

/* --- CONFIG --- */
const STACK_REPS = 10;              // repeticiones 0..9 en el stack (más -> más vueltas)
const TOTAL_ITEMS = STACK_REPS * 10;
const TARGET_DIGIT_LENGTH = 8; // Aseguramos una longitud de 8 dígitos para la escala de millones

// stack con repetición 0..9
const stackItems = Array.from({ length: TOTAL_ITEMS }, (_, idx) => idx % 10);

const formattedDisplay = computed(() => {
  const num = Math.max(0, Math.floor(Number(props.value)));

  // 1. Pad con ceros a la izquierda (ej. 121 -> "00000121")
  let s = num.toString().padStart(TARGET_DIGIT_LENGTH, '0');

  // 2. Insertar separadores de miles (puntos) desde la derecha
  let parts = [];
  while (s.length > 3) {
    parts.unshift(s.slice(-3));
    s = s.slice(0, s.length - 3);
  }
  parts.unshift(s);
  return parts.join('.'); // Ej. "91.134.283"
});

/* --- DIGITS (limpios y SOLO numéricos para la animación) --- */
const digitsArray = computed(() => {
  // Solo extraemos los dígitos numéricos de la cadena formateada
  return formattedDisplay.value.replace(/\D/g, "").split("").map(ch => parseInt(ch, 10));
});

/* --- reactive state --- */
const currentOffsets = ref<number[]>([]);
const durations = ref<number[]>([]);
const hasAnimatedOnMount = ref(false); // Nueva bandera para controlar animación inicial

/* referencia al wrapper para leer variable CSS */
const wrapperRef = ref<HTMLElement | null>(null);

/* altura dinámica en px (leída desde CSS var --digit-h) */
const digitHeight = ref<number>(34);

/* helper: posición "ancla" en el stack (mejor en la mitad para evitar extremos) */
function anchorIndexForDigit(d: number) {
  const anchorRepetition = Math.max(2, Math.floor(STACK_REPS / 2)); // repetición central
  return anchorRepetition * 10 + d;
}

/* asegurarnos arrays a la longitud correcta */
function ensureArraysMatch(len: number) {
  while (currentOffsets.value.length < len) {
    currentOffsets.value.push(anchorIndexForDigit(0));
    durations.value.push(0);
  }
  while (currentOffsets.value.length > len) {
    currentOffsets.value.pop();
    durations.value.pop();
  }
}

/* lectura segura de --digit-h desde CSS */
function updateDigitHeightFromCss() {
  const el = wrapperRef.value;
  if (!el) return;
  const cssVal = getComputedStyle(el).getPropertyValue('--digit-h')?.trim();
  if (cssVal) {
    const px = parseFloat(cssVal);
    if (!isNaN(px) && px > 0) {
      digitHeight.value = px;
    }
  }
}

/* Función de animación reutilizable */
async function animateToDigits(targetDigits: number[], isInitialAnimation = false) {
  const len = targetDigits.length;
  ensureArraysMatch(len);

  // parámetros timing - más dramático para la animación inicial
  const baseMs = isInitialAnimation ? 1200 : 900;
  const stagger = isInitialAnimation ? 200 : 160;

  // targets: spins aleatorios pero dentro del stack
  const targets = targetDigits.map((digit) => {
    const maxSpins = Math.max(2, STACK_REPS - 3);
    const spins = Math.floor(Math.random() * (maxSpins - 1)) + 2; // 2..maxSpins-1
    const target = spins * 10 + digit;
    return Math.min(target, TOTAL_ITEMS - 1);
  });

  // duraciones escalonadas por columna - más variación en animación inicial
  durations.value = targetDigits.map((_, i) => 
    Math.round(baseMs + i * stagger + Math.random() * (isInitialAnimation ? 400 : 300))
  );

  // lectura de altura actual por si cambió la variable (garantiza precisión)
  await nextTick();
  updateDigitHeightFromCss();

  // aplicar targets (esto dispara las transiciones CSS)
  currentOffsets.value = targets;

  // Normalizar después de la animación para evitar índices grandes
  const maxDur = Math.max(...durations.value, 0);
  setTimeout(() => {
    const normalized = targetDigits.map(d => anchorIndexForDigit(d));
    // quitar transición para reubicar sin efecto
    durations.value = targetDigits.map(() => 0);
    currentOffsets.value = normalized;
    
    if (isInitialAnimation) {
      hasAnimatedOnMount.value = true;
    }
  }, maxDur + 60);
}

/* Animación estilo jackpot cuando cambia el número */
watch(digitsArray, async (newDigits) => {
  // Si es la primera vez, no hacer nada porque ya se hizo en onMounted
  if (!hasAnimatedOnMount.value) return;
  
  await animateToDigits(newDigits, false);
}, { immediate: false });

/* Animación inicial al montar el componente */
onMounted(async () => {
  updateDigitHeightFromCss();
  window.addEventListener('resize', onResize);
  
  // Pequeño delay para asegurar que el DOM esté listo
  await nextTick();
  
  // Inicializar con valores actuales sin animación
  ensureArraysMatch(digitsArray.value.length);
  currentOffsets.value = digitsArray.value.map(d => anchorIndexForDigit(d));
  durations.value = digitsArray.value.map(() => 0);
  
  // Pequeño delay antes de la animación inicial para mejor efecto
  setTimeout(async () => {
    await animateToDigits(digitsArray.value, true);
  }, 300);
});

/* Función para reiniciar la animación manualmente si es necesario */
// const resetAnimation = async () => {
//   hasAnimatedOnMount.value = false;
//   await animateToDigits(digitsArray.value, true);
// };

/* actualizar digitHeight al montar y en resize (responsive) */
function onResize() {
  // dar un pequeño delay para que la CSS variable se aplique
  requestAnimationFrame(() => updateDigitHeightFromCss());
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});
</script>

<style scoped>
.jackpot-container {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: #003399; /* azul principal */
  border-radius: 18px;
  padding: 0px 13px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  max-width: 100%;
}

.cant_container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000000; /* azul oscuro */
  border: 1px solid #ffd700; /* borde amarillo */
  border-radius: 4px;
  box-shadow: 0 0 16px 4px rgba(255,215,0,0.35), inset 0 0 8px rgba(255,255,255,0.1);
  min-width: 120px;
  height: 2;
  animation: containerGlow 2s ease-in-out;
}

.jackpot-header {
  background: #ffd700; /* amarillo */
  color: #000;
  font-weight: 500;
  font-size: 3rem;
  padding: 0px 4px;
  border-radius: 1px;
  height: 22px;
  animation: headerPulse 2s ease-in-out;
}

.jackpot-wrapper {
  --digit-h: 34px;
  display: flex;
  gap: 6px;
  align-items: center;
}

.symbol {
  font-size: calc(var(--digit-h) * 0.75);
  font-weight: 800;
  color: #ffd700;
  margin-left: 5px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.7);
  animation: symbolShine 2s ease-in-out;
}

/* Columnas */
.digit-column {
  width: calc(var(--digit-h) * 0.8);
  height: var(--digit-h);
  overflow: hidden;
  border-radius: 2px;
  background: #1c1c1c;
  margin-left: -6px;
  box-shadow: inset 0 -2px 4px rgb(15, 2, 157), inset 0 2px 4px rgba(0,0,0,0.6);
}

.digit-stack {
  will-change: transform;
}

.digit {
  height: var(--digit-h);
  line-height: var(--digit-h);
  font-size: calc(var(--digit-h) * 0.85);
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 6px rgba(0,0,0,0.9);
  text-align: center;
  user-select: none;
}

/* Animaciones para el efecto inicial */
@keyframes containerGlow {
  0% {
    box-shadow: 0 0 8px 2px rgba(255,215,0,0.2), inset 0 0 4px rgba(255,255,255,0.05);
  }
  50% {
    box-shadow: 0 0 20px 6px rgba(255,215,0,0.6), inset 0 0 12px rgba(255,255,255,0.15);
  }
  100% {
    box-shadow: 0 0 16px 4px rgba(255,215,0,0.35), inset 0 0 8px rgba(255,255,255,0.1);
  }
}

@keyframes headerPulse {
  0%, 100% {
    transform: scale(1);
    background: #ffd700;
  }
  50% {
    transform: scale(1.05);
    background: #ffed4a;
  }
}

@keyframes symbolShine {
  0%, 100% {
    text-shadow: 0 2px 4px rgba(0,0,0,0.7);
    transform: scale(1);
  }
  50% {
    text-shadow: 0 0 12px rgba(255,215,0,0.8), 0 2px 4px rgba(0,0,0,0.7);
    transform: scale(1.1);
  }
}

/* Responsivo */
@media (max-width: 420px) {
  .jackpot-wrapper { --digit-h: 24px; gap: 3px; }
  .symbol { margin-right: 4px; }
  .jackpot-header { font-size: 0.75rem; padding: 2px 6px; }
}
@media (min-width: 1400px) {
  .jackpot-wrapper { --digit-h: 42px; gap: 8px; }
  .jackpot-header { font-size: 1.1rem; }
}
</style>