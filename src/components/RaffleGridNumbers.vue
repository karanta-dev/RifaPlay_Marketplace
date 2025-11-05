<script setup lang="ts">

// 1. Definir las propiedades y eventos del componente
const props = defineProps<{
  loading: boolean;
  grid: { number: string; status: string }[];
  pagination: any;
  selectedNumbers: string[];
}>();

const emit = defineEmits(['page-change', 'update:selectedNumbers']);

// 2. Lógica para seleccionar/deseleccionar un número
const toggleNumberSelection = (numberData: { number: string; status: string }) => {
  if (numberData.status !== 'available') return; // No se pueden seleccionar números no disponibles

  const selected = new Set(props.selectedNumbers);
  if (selected.has(numberData.number)) {
    selected.delete(numberData.number);
  } else {
    selected.add(numberData.number);
  }
  emit('update:selectedNumbers', Array.from(selected));
};

// 3. Lógica para cambiar de página
const goToPage = (page: number) => {
  if (page > 0 && page <= props.pagination.last_page) {
    emit('page-change', page);
  }
};
</script>

<template>
  <div class="bg-black/20 rounded-xl border border-white/10 p-4">
    <h3 class="font-semibold text-cyan-300 mb-3 block text-lg">
      Selecciona tus números
    </h3>
    
    <div v-if="loading" class="text-center text-white/70 py-10">
      Cargando números...
    </div>

    <div v-else>
      <!-- La rejilla de números -->
      <div class="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-60 overflow-y-auto pr-2">
        <button
          v-for="numberData in grid"
          :key="numberData.number"
          type="button"
          :disabled="numberData.status !== 'available'"
          :class="[
            'p-2 rounded-md text-center font-bold transition-all duration-200',
            {
              'bg-gray-700/50 text-white/40 cursor-not-allowed line-through': numberData.status !== 'available',
              'bg-blue-900/50 text-white hover:bg-cyan-700/50': numberData.status === 'available',
              'bg-gradient-to-r from-cyan-500 to-blue-500 text-white ring-2 ring-yellow-400 scale-110 shadow-lg': selectedNumbers.includes(numberData.number)
            }
          ]"
          @click="toggleNumberSelection(numberData)"
        >
          {{ numberData.number }}
        </button>
      </div>

      <!-- Controles de Paginación -->
      <div v-if="pagination && pagination.last_page > 1" class="flex items-center justify-between mt-4 text-sm text-white">
        <button 
          @click="goToPage(pagination.current_page - 1)" 
          :disabled="pagination.current_page === 1"
          class="px-3 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50"
        >
          &lt; Anterior
        </button>
        <span>
          Página <strong>{{ pagination.current_page }}</strong> de <strong>{{ pagination.last_page }}</strong>
        </span>
        <button 
          @click="goToPage(pagination.current_page + 1)" 
          :disabled="pagination.current_page === pagination.last_page"
          class="px-3 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50"
        >
          Siguiente &gt;
        </button>
      </div>
    </div>
  </div>
</template>