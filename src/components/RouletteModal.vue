<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
    <!-- El modal centrado -->
    <div class="bg-white rounded-xl shadow-xl p-6 text-center w-[95%] max-w-sm relative">
      <h2 class="text-xl font-bold mb-4">🎡 Ruleta de categorías</h2>

      <!-- Contenedor de la Ruleta (Tamaño fijo, centrado) -->
      <div 
        class="roulette-container relative mx-auto mb-6" 
        :style="{ width: ROULETTE_SIZE + 'px', height: ROULETTE_SIZE + 'px' }"
      >
        
        <!-- Flecha Indicadora (siempre apunta a la izquierda - 270 grados) -->
        <div class="markers">
          <div class="triangle-marker"></div> 
        </div>

        <!-- Rueda Giratoria -->
        <div 
          class="spinner-wheel absolute inset-0 rounded-full"
          :class="{ 'roulette-spinning': isSpinning }"
          :style="{ 
            transform: `rotate(${rotation}deg)`, 
            background: conicGradient 
          }"
          @transitionend="onSpinEnd"
        >
          <!-- Contenedores de Etiquetas (Solo para posicionar el texto, y giran con la rueda) -->
          <div 
            v-for="(cat, i) in categories" 
            :key="i" 
            class="label-segment absolute inset-0"
            :style="segmentStyle(i)"
          >
            <!-- Etiqueta de Texto -->
            <span class="label absolute text-white font-bold" :style="labelStyle(i)">
              <span class="text align-middle">{{ cat.name }}</span>
            </span>
          </div>
        </div>
        
        <!-- Sombra y Círculo Central -->
        <div class="shadow-inner-circle"></div> 
        
        <!-- Botón SPIN -->
        <button 
          class="button-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full text-gray-500 font-extrabold shadow-md z-10 hover:shadow-lg transition-transform"
          :class="{ 'busy': isSpinning }"
          @click="spin"
          :disabled="isSpinning || categories.length === 0"
        >
          <span>GIRAR</span>
        </button>
      </div>

      <!-- Categoría seleccionada -->
      <p v-if="selectedCategory" class="mt-4 text-lg font-semibold text-green-600">
        ✅ Categoría: **{{ selectedCategory }}**
      </p>

    <button @click="handleClose" class="mt-6 px-4 py-2 bg-gray-200 rounded-lg">Cerrar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue"
// Asegúrate de que la ruta a tu store sea correcta
import { useTicketStore } from '@/stores/useTicketStore' 

const props = defineProps({
  isOpen: Boolean
})
const emits = defineEmits(["close", "categoryPicked"])

const store = useTicketStore()

// Paleta de colores más amplia y atractiva
const COLOR_PALETTE = [
  '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', 
  '#E67E22', '#34495E', '#D35400', '#2980B9', '#27AE60', '#F1C40F',
  '#8E44AD', '#C0392B', '#16A085', '#2C3E50', '#7F8C8D', '#BDC3C7'
];

// Lógica mejorada para manejar si las categorías son strings o objetos, y asignar colores
const categories = computed(() => {
    const rawCategories = store.allCategories;
    
    // 1. Manejo de datos dummy/fallback
    if (!rawCategories || rawCategories.length < 2) { // Debe haber al menos dos categorías para girar
        console.warn("Se necesitan al menos 2 categorías. Usando categorías por defecto.");
        // Usar la paleta de colores para las categorías dummy
        return [
          { name: 'Viajes', color: COLOR_PALETTE[0] },
          { name: 'Música', color: COLOR_PALETTE[1] },
          { name: 'Deportes', color: COLOR_PALETTE[2] },
          { name: 'Películas', color: COLOR_PALETTE[3] },
          { name: 'Historia', color: COLOR_PALETTE[4] },
          { name: 'Ciencia', color: COLOR_PALETTE[5] },
        ];
    }
    
    // 2. Estandarizar las categorías del store al formato { name: string, color: string }
    return rawCategories.map((cat, i) => {
        // Asignar color rotando la paleta
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
const ROULETTE_SIZE = 300; 
const POINTER_ANGLE = 270; // La flecha está en 270 grados (izquierda, sentido anti-horario)

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
        
        // Formato: color [inicio]deg [fin]deg
        gradientString += `${cat.color} ${currentAngle}deg ${nextAngle}deg, `;
        currentAngle = nextAngle;
    });

    // Quitar la coma y espacio finales
    return gradientString.slice(0, -2) + ')';
});


// Inicia el giro cuando el modal se abre
watch(() => props.isOpen, (open) => {
  if (open) {
    // Cuando el modal se abre
    rotation.value = 0;
    isSpinning.value = false; // ✅ Resetear isSpinning al abrir
    selectedCategory.value = null; 
    
    // Esto es un error de lógica del código anterior. No deberías girar automáticamente al abrir,
    // a menos que el botón de girar desaparezca y el giro sea inmediato.
    // Lo comento para que el giro se haga solo al presionar el botón:
    /*
    if (itemCount.value > 0) {
        setTimeout(spin, 50); 
    }
    */
  } else {
    // ✅ Cuando el modal se cierra (por el botón 'Cerrar' o la prop externa)
    isSpinning.value = false; // ✅ Forzar el estado a false para la próxima vez
    if (closeTimeout) { // ✅ Cancelar el temporizador de cierre (si existe)
        clearTimeout(closeTimeout);
        closeTimeout = null;
    }
  }
});


// Función principal de giro, usa el valor de 'rotation' para la animación CSS
function spin() {
    if (isSpinning.value || itemCount.value === 0) return;

    isSpinning.value = true;
    
    // 1. Determinar el índice ganador
    finalIndex = Math.floor(Math.random() * itemCount.value);

    // 2. Determinar la rotación mínima base
    // Garantizamos que la ruleta siempre gire al menos 5 vueltas COMPLETAS desde la posición actual
    const baseRotation = Math.floor(rotation.value / 360) * 360 + (5 * 360); 

    // 3. Calcular el rango de ángulos del segmento ganador
    const targetStartAngle = finalIndex * degPerSlice.value;
    const targetEndAngle = targetStartAngle + degPerSlice.value;
    
    // ✅ CLAVE DE LA MEJORA: Elegir un ángulo de parada COMPLETAMENTE aleatorio dentro del segmento.
    // Esto asegura que la aguja no se detenga siempre en el mismo 'patrón' dentro de cada categoría.
    // El '- 5' y '+ 5' asegura que no aterrice justo en la línea divisoria.
    const randomAngleWithinSegment = 
        targetStartAngle + 
        (Math.random() * (degPerSlice.value - 10)) + 5; // Dejamos un margen de 5 grados a cada lado.


    // 4. Calcular el ángulo extra para alinear el ganador con el puntero (270 grados)
    // Queremos que el ángulo 'randomAngleWithinSegment' se alinee con el puntero (270°).
    // La ruleta gira en sentido de las agujas (positivo).
    let angleToAlign = 360 - randomAngleWithinSegment + POINTER_ANGLE; 
    
    // Si angleToAlign es > 360, significa que estamos dando una vuelta extra, lo cual es manejado
    // por la suma a 'baseRotation'.

    // 5. Aplicar la rotación final
    rotation.value = baseRotation + angleToAlign; 
    
}
// Lógica al finalizar la animación CSS
function onSpinEnd(event) {
    // Solo actuamos si la animación que terminó es la del giro de la ruleta
    if (event.propertyName !== 'transform') return;
    
    isSpinning.value = false;
    
    // 1. Normalizar la rotación final (opcional, pero ayuda a mantener el número manejable)
    rotation.value = rotation.value % 360; 
    if (rotation.value < 0) rotation.value += 360; 

    // 2. Determinar y mostrar el ganador
    const winner = categories.value[finalIndex];
    selectedCategory.value = winner.name;
    
    // 3. Cerrar el modal después de 2 segundos (UX)
    if (closeTimeout) clearTimeout(closeTimeout); // Cancelar si existe
    closeTimeout = setTimeout(() => { // ✅ Usar la variable closeTimeout
        emits("categoryPicked", winner.name);
        emits("close");
        closeTimeout = null; // Limpiar el temporizador
    }, 2000); 
}


// Estilo de cada segmento (solo para posicionar el texto)
function segmentStyle(i) {
  const delta = degPerSlice.value; 
  // La rotación inicial para el contenedor de la etiqueta
  const r = (i * delta) + (delta / 2); // Centrar el texto en la mitad del segmento
  
  return {
    // Gira el contenedor de la etiqueta
    transform: `rotate(${r}deg)`, 
    transformOrigin: '50% 50%',
    pointerEvents: 'none', 
  };
}
function handleClose() {
    // Si la ruleta estaba girando, forzamos la detención
    isSpinning.value = false;
    // Cancelamos el temporizador de cierre automático
    if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
    }
    // Cerramos el modal
    emits('close');
}

// Estilo de la etiqueta de texto dentro del segmento
function labelStyle(i) {
  const R_half = ROULETTE_SIZE * 0.5;
  const TEXT_DISTANCE_FROM_CENTER = ROULETTE_SIZE * 0.35; // Distancia desde el centro (casi el borde)

  // Posiciona el texto a lo largo del radio
  return {
    // Coloca el punto de origen del texto en el borde superior (0%) y al centro (50%)
    top: '50%',
    left: '50%',
    // Aplica la transformación:
    // 1. TranslateY negativo mueve el texto desde el centro hacia el borde superior.
    // 2. Rotate(-90deg) hace que el texto esté horizontal cuando el segmento está en el tope.
    // 3. Translate(-50%, -50%) centra la caja de texto en el punto calculado.
    transform: `translate(-50%, -50%) translateY(-${TEXT_DISTANCE_FROM_CENTER}px) rotate(90deg)`,
    
    // Limita el ancho para que no se superponga (longitud a lo largo del radio)
    width: `${R_half * 0.6}px`, 
    whiteSpace: 'normal',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${Math.min(1.2, 5 / itemCount.value) * 1}em` // Ajusta el tamaño de fuente según el número de categorías
  };
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Material+Icons|Work+Sans:400,700,900');

/* Variables CSS */
.spinner-wheel {
    /* TRANSICIÓN: Ahora es la clave para la animación */
    transition: transform 5000ms cubic-bezier(0.2, 0.4, 0.4, 1.025); 
}

/* El contenedor principal de la ruleta */
.roulette-container {
  border-radius: 50%;
  overflow: hidden; 
  font-family: 'Work Sans', sans-serif;
  box-shadow: 0 .3em 0 rgba(0,0,0,.25) inset; 
}

/* Rueda Giratoria */
.spinner-wheel {
    backface-visibility: hidden;
    z-index: 1; 
    /* QUITAMOS OVERFLOW: HIDDEN y el fondo ya viene de conicGradient */
}

/* Sombra interior para la ruleta */
.shadow-inner-circle {
  display: block;
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 50%;
  box-shadow: 0 .3em 0 rgba(0,0,0,.25) inset;
  z-index: 10;
  pointer-events: none;
}

/* Contenedor de marcadores (flecha) */
.markers {
  display: block;
  position: absolute;
  top: -1px; left: -1px; right: -1px; bottom: -1px;
  overflow: hidden;
  border-radius: 100%;
  z-index: 20; 
  pointer-events: none;
}

/* La flecha marcadora */
.triangle-marker {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 1em 0 1em 1em;
  border-color: transparent transparent transparent #FFF; /* Flecha blanca */
  position: absolute;
  top: 50%;
  left: -1px;
  margin-top: -1em;
  filter: drop-shadow(0 0.25em 0 rgba(0, 0, 0, 0.25));
  z-index: 21; 
}



.label {
  /* Posicionamiento y transformación manejado en labelStyle() */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* Sombra para mejor contraste */
  word-break: break-word; /* Permite saltos de línea en textos largos */
  /* Rotación ajustada en labelStyle para que el texto esté horizontal y sea legible */
}

.label .text {
  font-size: 1em;
}


/* Estilo del botón de giro */
.button-spin {
  /* REDUCCIÓN DE TAMAÑO SOLICITADA POR EL USUARIO */
  width: 6em; 
  height: 6em;
  line-height: 6em; 
  font-size: 1.2em; 
  /* FIN DE REDUCCIÓN */
  border: none;
  color: #555;
  outline: none;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 .4em 0 rgba(0,0,0,.25);
  text-align: center;
  transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 15;
}

.button-spin:hover {
  color: #333;
}

.button-spin span {
  font-size: 1.2em; /* Ajustado */
  letter-spacing: -0.05em;
}

/* Clase .busy para el estado de giro del botón */
.button-spin.busy {
    transform: scale(0.9) translate(-50%, -50%); 
    box-shadow: 0 .15em 0 rgba(0,0,0,.25);
    color: #999;
    cursor: default;
}

/* Asegura que el translate original se mantenga cuando el botón no está girando */
.button-spin:not(.busy) {
  transform: translate(-50%, -50%);
}
</style>
