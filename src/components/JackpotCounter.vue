<template>
  <div class="jackpot-wrapper" role="img" aria-label="jackpot counter">
    <div
      v-for="(d, i) in digitsArray"
      :key="`col-${i}-${d}`"
      class="digit-column"
    >
      <div
        class="digit-stack"
        :style="{
          transform: `translateY(-${currentOffsets[i] * DIGIT_H}px)`,
          transition: `transform ${durations[i]}ms cubic-bezier(.22,.98,.38,1)`
        }"
      >
        <div v-for="n in TOTAL_ITEMS" :key="`item-${i}-${n}`" class="digit">
          {{ stackItems[n - 1] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";

const props = defineProps<{ value: number }>();

/* --- CONFIG --- */
const DIGIT_H = 34;                 // altura exacta de cada dígito en px (ajustar con CSS)
const STACK_REPS = 10;              // cuántas repeticiones de 0..9 (mayor -> más vueltas máximas)
const TOTAL_ITEMS = STACK_REPS * 10; // longitud del stack por columna

// Pila de dígitos repetida (0..9 repeated)
const stackItems = Array.from({ length: TOTAL_ITEMS }, (_, idx) => idx % 10);

/* --- DIGITS (limpios sin separators) --- */
const digitsArray = computed(() => {
  // convertimos a entero para evitar decimales, y eliminamos signos y separadores
  const s = Math.max(0, Math.floor(Number(props.value))).toString().replace(/\D/g, "");
  // si está vacío, mostrar 0
  return (s === "" ? "0" : s).split("").map(ch => parseInt(ch, 10));
});

/* --- Estado reactivo de animación --- */
const currentOffsets = ref<number[]>([]); // índice de item mostrado para cada columna
const durations = ref<number[]>([]);

/* Helper para crear índices "ancla" (posición corta que tiene el dígito final) */
function anchorIndexForDigit(d: number) {
  // ponemos el ancla en la segunda repetición: (1 * 10) + d -> evita estar en el extremo
  const anchorRepetition = 2; // repetir mínimo (puedes cambiar)
  return anchorRepetition * 10 + d;
}

/* Inicialización: si cambia la cantidad de columnas, ajusta arrays */
function ensureArraysMatch(len: number) {
  while (currentOffsets.value.length < len) {
    currentOffsets.value.push( anchorIndexForDigit(0) ); // temporal
    durations.value.push(0);
  }
  while (currentOffsets.value.length > len) {
    currentOffsets.value.pop();
    durations.value.pop();
  }
}

/* Inicial: mostrar el valor sin animación (anclado) */
ensureArraysMatch(digitsArray.value.length);
currentOffsets.value = digitsArray.value.map(d => anchorIndexForDigit(d));
durations.value = digitsArray.value.map(() => 0);

/* Watcher: cuando cambia el valor, animamos estilo "jackpot" */
watch(digitsArray, async (newDigits, oldDigits) => {
  const len = newDigits.length;
  ensureArraysMatch(len);

  // Duración base y desfase por columna
  const baseMs = 900;
  const stagger = 180;

  // Construir target offsets seguros dentro de TOTAL_ITEMS
  const targets = newDigits.map((digit, i) => {
    // elegir número de spins aleatorio dentro de lo permitido sin salirse del stack
    // spins entre 2 y (STACK_REPS - 3) para dejar espacio
    const maxSpins = Math.max(2, STACK_REPS - 3);
    const spins = Math.floor(Math.random() * (maxSpins - 1)) + 2; // 2..maxSpins-1
    const target = spins * 10 + digit; // ej: 30 + 5 = posición donde hay '5'
    // asegúrate que target < TOTAL_ITEMS
    return Math.min(target, TOTAL_ITEMS - 1);
  });

  // Calcular duraciones escalonadas
  durations.value = newDigits.map((_, i) => {
    return Math.round(baseMs + i * stagger + Math.random() * 300);
  });

  // Forzar un tick para aplicar transiciones: actualizamos offsets a targets
  await nextTick();
  currentOffsets.value = targets;

  // Normalizar (reducir indices) una vez finalizan las animaciones
  // calculamos el tiempo máximo de animación y programamos normalización
  const maxDur = Math.max(...durations.value, 0);
  setTimeout(() => {
    // después de animación, reemplazamos por índices "anclados" cortos para evitar crecimiento
    const normalized = newDigits.map(d => anchorIndexForDigit(d));
    // quitamos transición mientras reubicamos para evitar flicker (ponemos duration 0)
    durations.value = newDigits.map(() => 0);
    currentOffsets.value = normalized;
  }, maxDur + 60); // + small buffer
}, { immediate: false });
</script>

<style scoped>
.jackpot-wrapper {
  display: flex;
  gap: 6px;
  align-items: center;
  /* Usa la imagen que compartiste; ajusta tamaño/posición si quieres */
  background: url("/e53ab285-2a00-49dc-bfa6-de97cadd8d3e.png") no-repeat center/cover;
  padding: 8px 12px;
  border-radius: 999px;
}

/* Ventana visible por columna */
.digit-column {
  width: 28px;
  height: 34px;             /* <-- debe coincidir con DIGIT_H */
  overflow: hidden;
  display: inline-block;
  border-radius: 6px;
  background: rgba(0,0,0,0.35);
  box-shadow: inset 0 -2px 6px rgba(0,0,0,0.4);
}

/* Stack (mueve verticalmente) */
.digit-stack {
  will-change: transform;
}

/* Cada dígito ocupa exactamente DIGIT_H px */
.digit {
  height: 34px;             /* <-- debe coincidir con DIGIT_H */
  line-height: 34px;
  font-size: 22px;
  font-weight: 800;
  color: #ffd700;
  text-shadow: 0 2px 6px rgba(0,0,0,0.9);
  text-align: center;
  user-select: none;
}
</style>
