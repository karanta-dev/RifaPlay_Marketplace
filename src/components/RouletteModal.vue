<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4 transition-all duration-300">
    <!-- Modal con diseño premium -->
    <div class="bg-gradient-to-br from-purple-900 to-indigo-800 rounded-2xl shadow-2xl p-8 text-center w-full max-w-md relative border border-purple-400/30 overflow-hidden">
      <!-- Efectos de brillo -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-yellow-400/10 rounded-full blur-xl"></div>
      <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/10 rounded-full blur-xl"></div>
      
      <!-- Botón cerrar -->
      <button 
        @click="handleClose" 
        class="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 text-white/80 hover:text-white p-2 rounded-full transition-all duration-300 border border-white/20 backdrop-blur-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Encabezado -->
      <div class="relative z-10 mb-8">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
          <span class="text-2xl">🎡</span>
        </div>
        <h2 class="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
          Ruleta de Categorías
        </h2>
        <p class="text-cyan-200 text-sm mt-2">Gira y descubre tu categoría ganadora</p>
      </div>

      <!-- Contenedor de la Ruleta -->
<div 
  class="roulette-container relative flex items-center justify-center mx-auto mb-8"
  :style="{ 
    width: '100%',
    maxWidth: ROULETTE_SIZE + 'px',
    aspectRatio: '1 / 1'
  }"
>
        
        <!-- Flecha Indicadora Mejorada -->
        <div class="markers">
          <div class="triangle-marker"></div>
          <div class="glow-effect"></div>
        </div>

        <!-- Rueda Giratoria -->
        <div 
          class="spinner-wheel absolute inset-0 rounded-full border-4 border-white/20 shadow-2xl"
          :class="{ 'roulette-spinning': isSpinning }"
          :style="{ 
            transform: `rotate(${rotation}deg)`, 
            background: conicGradient 
          }"
          @transitionend="onSpinEnd"
        >
          <!-- Segmentos con etiquetas -->
          <div 
            v-for="(cat, i) in categories" 
            :key="i" 
            class="label-segment absolute inset-0"
            :style="segmentStyle(i)"
          >
            <span class="label absolute text-white font-bold" :style="labelStyle(i)">
              <span class="text align-middle drop-shadow-lg text-black">{{ cat.name }}</span>
            </span>
          </div>
        </div>
        
        <!-- Efectos de profundidad -->
        <div class="shadow-inner-circle"></div>
        <div class="outer-glow"></div>
        
        <!-- Botón SPIN Mejorado -->
        <button 
          class="button-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-white to-gray-100 rounded-full text-gray-700 font-extrabold shadow-2xl z-10 hover:shadow-3xl transition-all duration-300 border-2 border-yellow-400/50"
          :class="{ 
            'busy': isSpinning,
            'hover:scale-110 hover:from-yellow-100 hover:to-orange-100': !isSpinning
          }"
          @click="spin"
          :disabled="isSpinning || categories.length === 0"
        >
          <div class="relative">
            <span class="relative z-10">GIRAR</span>
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 rounded-full"></div>
          </div>
        </button>
      </div>

      <!-- Categoría seleccionada -->
      <div v-if="selectedCategory" class="relative z-10">
        <div class="bg-gradient-to-r from-green-500/20 to-emerald-600/20 border-2 border-green-400/50 rounded-xl p-4 mb-6 backdrop-blur-sm">
          <p class="text-lg font-bold text-white flex items-center justify-center gap-3">
            <span class="text-2xl">🎉</span>
            Categoría: 
            <span class="text-yellow-300 text-xl">{{ selectedCategory }}</span>
            <span class="text-2xl">⭐</span>
          </p>
        </div>
      </div>

      <!-- Botón Cerrar Mejorado -->

    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue"
import { useTicketStore } from '@/stores/useTicketStore' 

const props = defineProps({
  isOpen: Boolean
})
const emits = defineEmits(["close", "categoryPicked"])

const store = useTicketStore()

// Paleta de colores mejorada con tonos más vibrantes
const COLOR_PALETTE = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
  '#F1948A', '#85C1E9', '#D7BDE2', '#F9E79F', '#A9DFBF', '#FAD7A0'
];

// Lógica mejorada para manejar si las categorías son strings o objetos, y asignar colores
const categories = computed(() => {
    const rawCategories = store.allCategories;
    
    // 1. Manejo de datos dummy/fallback
    if (!rawCategories || rawCategories.length < 2) {
        console.warn("Se necesitan al menos 2 categorías. Usando categorías por defecto.");
        return [
          { name: 'Viajes', color: COLOR_PALETTE[0] },
          { name: 'Música', color: COLOR_PALETTE[1] },
          { name: 'Deportes', color: COLOR_PALETTE[2] },
          { name: 'Tecnología', color: COLOR_PALETTE[3] },
          { name: 'Moda', color: COLOR_PALETTE[4] },
          { name: 'Gastronomía', color: COLOR_PALETTE[5] },
        ];
    }
    
    // 2. Estandarizar las categorías del store
    return rawCategories.map((cat, i) => {
        const defaultColor = COLOR_PALETTE[i % COLOR_PALETTE.length];
        
        if (typeof cat === 'string') {
            return { name: cat, color: defaultColor };
        }
        
        return {
            name: cat.name || cat.id || `Categoría ${i + 1}`,
            color: cat.color || defaultColor
        };
    });
});

// **CONSTANTES y ESTADO**
const ROULETTE_SIZE = 320; // Ligeramente más grande para mejor visibilidad
const POINTER_ANGLE = 270;

const itemCount = computed(() => categories.value.length);
const degPerSlice = computed(() => 360 / itemCount.value);

const isSpinning = ref(false);
const rotation = ref(0);
const selectedCategory = ref(null);
let finalIndex = null; 
let closeTimeout = null;

// Propiedad computada que genera el fondo de la ruleta usando Conic Gradients
const conicGradient = computed(() => {
    if (itemCount.value === 0) return 'none';

    let gradientString = 'conic-gradient(';
    let currentAngle = 0;

    categories.value.forEach((cat) => {
        const sliceAngle = degPerSlice.value;
        const nextAngle = currentAngle + sliceAngle;
        
        gradientString += `${cat.color} ${currentAngle}deg ${nextAngle}deg, `;
        currentAngle = nextAngle;
    });

    return gradientString.slice(0, -2) + ')';
});

// Watch para cuando el modal se abre/cierra
watch(() => props.isOpen, (open) => {
  if (open) {
    rotation.value = 0;
    isSpinning.value = false;
    selectedCategory.value = null;
  } else {
    isSpinning.value = false;
    if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
    }
  }
});

// Función principal de giro
function spin() {
    if (isSpinning.value || itemCount.value === 0) return;

    isSpinning.value = true;
    
    // 1. Determinar el índice ganador
    finalIndex = Math.floor(Math.random() * itemCount.value);

    // 2. Determinar la rotación mínima base
    const baseRotation = Math.floor(rotation.value / 360) * 360 + (5 * 360);

    // 3. Calcular el rango de ángulos del segmento ganador
    const targetStartAngle = finalIndex * degPerSlice.value;
    const targetEndAngle = targetStartAngle + degPerSlice.value;
    
    // Ángulo aleatorio dentro del segmento
    const randomAngleWithinSegment = 
        targetStartAngle + 
        (Math.random() * (degPerSlice.value - 10)) + 5;

    // 4. Calcular el ángulo extra para alinear el ganador con el puntero
    let angleToAlign = 360 - randomAngleWithinSegment + POINTER_ANGLE;

    // 5. Aplicar la rotación final
    rotation.value = baseRotation + angleToAlign;
}

// Lógica al finalizar la animación CSS
function onSpinEnd(event) {
    if (event.propertyName !== 'transform') return;
    
    isSpinning.value = false;
    
    // 1. Normalizar la rotación final
    rotation.value = rotation.value % 360;
    if (rotation.value < 0) rotation.value += 360;

    // 2. Determinar y mostrar el ganador
    const winner = categories.value[finalIndex];
    selectedCategory.value = winner.name;
    
    // 3. Cerrar el modal después de 2 segundos
    if (closeTimeout) clearTimeout(closeTimeout);
    closeTimeout = setTimeout(() => {
        emits("categoryPicked", winner.name);
        emits("close");
        closeTimeout = null;
    }, 2000);
}

// Estilo de cada segmento
function segmentStyle(i) {
  const delta = degPerSlice.value;
  const r = (i * delta) + (delta / 2);
  
  return {
    transform: `rotate(${r}deg)`,
    transformOrigin: '50% 50%',
    pointerEvents: 'none',
  };
}

function handleClose() {
    isSpinning.value = false;
    if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
    }
    emits('close');
}

// Estilo de la etiqueta de texto
function labelStyle(i) {
  const R_half = ROULETTE_SIZE * 0.5;
  const TEXT_DISTANCE_FROM_CENTER = ROULETTE_SIZE * 0.35;

  return {
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) translateY(-${TEXT_DISTANCE_FROM_CENTER}px) rotate(90deg)`,
    width: `${R_half * 0.6}px`,
    whiteSpace: 'normal',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${Math.min(1.2, 5 / itemCount.value) * 1}em`
  };
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Material+Icons|Work+Sans:400,700,900');

/* Animación de entrada para el modal */
.fixed {
  animation: modalEnter 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Contenedor principal de la ruleta */
.roulette-container {
  border-radius: 50%;
  overflow: hidden;
  box-shadow:
    0 0 40px rgba(0, 0, 0, 0.6),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
border: 4px solid #B8860B; /* Dorado oscuro más elegante */
  background: 
    radial-gradient(circle at center, #111 10%, #000 90%),
    linear-gradient(45deg, #FFD700, #FFA500, #FFD700);
  background-clip: padding-box, border-box;
  background-origin: border-box;}

/* Rueda Giratoria */
.spinner-wheel {
  transition: transform 5000ms cubic-bezier(0.2, 0.4, 0.4, 1.025);
  backface-visibility: hidden;
  z-index: 1;
}

/* Efecto de giro activo */
.roulette-spinning {
  filter: brightness(1.1) contrast(1.1);
}



/* Glow exterior */
.outer-glow {
  position: absolute;
  top: -10px; left: -10px; right: -10px; bottom: -10px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(168, 85, 247, 0.2) 0%, transparent 70%);
  z-index: -1;
  pointer-events: none;
}

/* Contenedor de marcadores mejorado */
.markers {
  display: block;
  position: absolute;
  top: -1px; left: -1px; right: -1px; bottom: -1px;
  overflow: hidden;
  border-radius: 100%;
  z-index: 20;
  pointer-events: none;
}

/* Flecha marcadora mejorada */
.triangle-marker {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 1.2em 0 1.2em 1.5em;
  border-color: transparent transparent transparent #FFF;
  position: absolute;
  top: 50%;
  left: -2px;
  margin-top: -1.2em;
  filter: 
    drop-shadow(0 0.25em 0.5em rgba(0, 0, 0, 0.3))
    drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  z-index: 21;
}

/* Efecto de brillo para la flecha */
.glow-effect {
  position: absolute;
  top: 50%;
  left: 0;
  width: 4px;
  height: 80px;
  background: linear-gradient(to right, 
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent);
  transform: translateY(-50%);
  filter: blur(1px);
  z-index: 19;
}

/* Etiquetas de texto mejoradas */

/* Botón de giro premium */
.button-spin {
  width: 6.5em;
  height: 6.5em;
  line-height: 6.5em;
  font-size: 1.1em;
  border: none;
  color: #4b5563;
  outline: none;
  cursor: pointer;
  user-select: none;
  box-shadow: 
    0 0.6em 0 rgba(0, 0, 0, 0.25),
    0 0 30px rgba(255, 255, 255, 0.2);
  text-align: center;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 15;
}

.button-spin:hover:not(.busy) {
  color: #374151;
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow: 
    0 0.8em 0 rgba(0, 0, 0, 0.25),
    0 0 40px rgba(255, 255, 255, 0.3);
}

.button-spin span {
  font-size: 1.1em;
  letter-spacing: -0.03em;
  font-weight: 900;
}

/* Estado de giro activo */
.button-spin.busy {
  transform: scale(0.9) translate(-50%, -50%);
  box-shadow: 0 0.2em 0 rgba(0, 0, 0, 0.25);
  color: #9ca3af;
  cursor: default;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
}

/* Asegurar posición cuando no está girando */
.button-spin:not(.busy) {
  transform: translate(-50%, -50%);
}

/* Efectos de brillo en hover para el botón principal */
.group:hover .group-hover\:translate-x-\[100\%\] {
  transform: translateX(100%);
}
</style>