<!-- JackpotCounter.vue -->
<template>
  <div ref="wrapperRef" class="jackpot-wrapper" role="img" aria-label="jackpot counter">
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
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{ value: number }>();

/* --- CONFIG --- */
const STACK_REPS = 10;              // repeticiones 0..9 en el stack (más -> más vueltas)
const TOTAL_ITEMS = STACK_REPS * 10;

// stack con repetición 0..9
const stackItems = Array.from({ length: TOTAL_ITEMS }, (_, idx) => idx % 10);

/* --- DIGITS (limpios sin separadores) --- */
const digitsArray = computed(() => {
  const s = Math.max(0, Math.floor(Number(props.value))).toString().replace(/\D/g, "");
  return (s === "" ? "0" : s).split("").map(ch => parseInt(ch, 10));
});

/* --- reactive state --- */
const currentOffsets = ref<number[]>([]);
const durations = ref<number[]>([]);

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

/* Inicial: anclado sin animación */
ensureArraysMatch(digitsArray.value.length);
currentOffsets.value = digitsArray.value.map(d => anchorIndexForDigit(d));
durations.value = digitsArray.value.map(() => 0);

/* Animación estilo jackpot cuando cambia el número */
watch(digitsArray, async (newDigits) => {
  const len = newDigits.length;
  ensureArraysMatch(len);

  // parámetros timing
  const baseMs = 900;
  const stagger = 160;

  // targets: spins aleatorios pero dentro del stack
  const targets = newDigits.map((digit) => {
    const maxSpins = Math.max(2, STACK_REPS - 3);
    const spins = Math.floor(Math.random() * (maxSpins - 1)) + 2; // 2..maxSpins-1
    const target = spins * 10 + digit;
    return Math.min(target, TOTAL_ITEMS - 1);
  });

  // duraciones escalonadas por columna
  durations.value = newDigits.map((_, i) => Math.round(baseMs + i * stagger + Math.random() * 300));

  // lectura de altura actual por si cambió la variable (garantiza precisión)
  await nextTick();
  updateDigitHeightFromCss();

  // aplicar targets (esto dispara las transiciones CSS)
  currentOffsets.value = targets;

  // Normalizar después de la animación para evitar índices grandes
  const maxDur = Math.max(...durations.value, 0);
  setTimeout(() => {
    const normalized = newDigits.map(d => anchorIndexForDigit(d));
    // quitar transición para reubicar sin efecto
    durations.value = newDigits.map(() => 0);
    currentOffsets.value = normalized;
  }, maxDur + 60);
}, { immediate: false });

/* actualizar digitHeight al montar y en resize (responsive) */
function onResize() {
  // dar un pequeño delay para que la CSS variable se aplique
  requestAnimationFrame(() => updateDigitHeightFromCss());
}

onMounted(() => {
  updateDigitHeightFromCss();
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});
</script>

<style scoped>
/* usa variable CSS --digit-h para sincronizar CSS <-> JS */
.jackpot-wrapper {
  --digit-h: 34px; /* valor por defecto (desktop) */
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  /* la imagen de fondo si la quieres, descomenta la línea siguiente y pon la ruta correcta */
  /* background: url("/e53ab285-2a00-49dc-bfa6-de97cadd8d3e.png") no-repeat center/cover; */
  max-width: 100%;
  box-sizing: border-box;
}

/* cada columna (la "ventana" visible) */
.digit-column {
  width: calc(var(--digit-h) * 0.82); /* ancho proporcional a la altura */
  height: var(--digit-h);             /* coincide con JS */
  overflow: hidden;
  display: inline-block;
  border-radius: 6px;
  background: rgba(0,0,0,0.35);
  box-shadow: inset 0 -2px 6px rgba(0,0,0,0.4);
  box-sizing: content-box;
}

/* el stack que se mueve verticalmente */
.digit-stack {
  will-change: transform;
}

/* cada dígito ocupa exactamente --digit-h */
.digit {
  height: var(--digit-h);
  line-height: var(--digit-h); /* centra verticalmente */
  font-size: calc(var(--digit-h) * 0.65); /* escala con el tamaño */
  font-weight: 800;
  color: #ffd700;
  text-shadow: 0 2px 6px rgba(0,0,0,0.9);
  text-align: center;
  user-select: none;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

/* --- Responsivo: ajusta sólo la variable, no las matemáticas --- */
@media (max-width: 420px) {
  .jackpot-wrapper { --digit-h: 26px; gap: 4px; padding: 6px 8px; }
}
@media (min-width: 1400px) {
  .jackpot-wrapper { --digit-h: 40px; gap: 8px; padding: 10px 16px; }
}
</style>
