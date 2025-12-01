<template>
  <transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      @keydown.esc="emit('close')"
    >
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-300">
          
          <div class="p-4 md:p-5">
            <div class="border-2 border-dotted border-gray-400 rounded-md p-3 sm:p-4">
              <div class="text-center mb-3">
                <h3 class="text-lg font-semibold">Comprobante Ticket</h3>
              </div>

              <div class="grid grid-cols-12 gap-2 items-start mb-3">
                <div class="col-span-3 flex items-start justify-start">
                  <img :src="logoSrc" alt="logo" class="h-12 w-16 sm:h-20 sm:w-20 object-contain" />
                </div>

                <div class="col-span-9 flex flex-col items-start justify-center text-center pt-1 pl-10">
                  <h1 class="text-xl font-bold leading-tight ">{{ companyName }}</h1>
                  <p class="text-xs text-gray-600">{{ companyLine }}</p>
                  <p class="text-xs text-gray-600">{{ companyRif }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-x-4 text-sm mt-3">
                <div class="flex flex-col">
                <div><strong>Cliente:</strong> {{ clientName }}</div>
                <div><strong>Cedula:</strong> {{ clientId }}</div>
                <div><strong>Telefono:</strong> {{ clientPhone }}</div>
              </div>
                <div class="flex flex-col text-right">
                  <div><span>Serial:</span> {{ serialNumber }}</div>
                  <div><span>Fecha:</span> {{ date }}</div>
                  <!-- CAMBIO: sellerName en lugar de userName -->
                  <div><span>Vendedor:</span> {{ sellerName }}</div>
                </div>
              </div>

              <div class="border-t border-dashed border-gray-400 my-3"></div>

              <div class="text-sm">
  <div class="grid grid-cols-12 gap-2 font-semibold border-b border-gray-300 pb-1">
    <div class="col-span-6">Descripción</div>
    <div class="col-span-2 text-center">Cant.</div> <div class="col-span-2 text-center">Precio</div>
    <div class="col-span-2 text-right">Total</div>
  </div>

  <div class="grid grid-cols-12 gap-2 pt-2">
    <div class="col-span-6 text-xs leading-5">
      
      <div class="font-bold text-gray-800 text-sm uppercase mb-1">
        {{ raffleName }}
      </div>

      <div class="text-xs text-gray-600">
        <span class="font-semibold text-black">Tickets:</span>
        <div class="font-mono mt-0.5 break-words leading-tight tracking-wide">
           {{ formattedSelectedNumbers }}
        </div>
      </div>

      <div class="text-xs mt-2 text-gray-500">
        <strong>Sorteo:</strong> {{ drawDate }}
      </div>
    </div>

    <div class="col-span-2 text-center flex items-start justify-center pt-1">{{ quantity }}</div>
    <div class="col-span-2 text-center flex items-start justify-center pt-1">${{ price.toFixed(2) }}</div>
    <div class="col-span-2 text-right flex items-start justify-end pt-1 font-bold">${{ total }}</div>
  </div>
</div>

              <div class="border-t border-dashed border-gray-400 my-3"></div>

              <div class="text-right">
                <div class="inline-block text-right">
                    <div class="text-sm font-semibold">Monto USD: 
                    <span class="text-lg font-bold">${{ amountUsd }}</span>
                    </div>

                    <div class="text-xs text-gray-600">Tasa: {{ exchangeRate }}</div>

                    <div class="text-sm font-semibold mt-1">
                    Monto {{ amountLocalCurrencyLabel }}: 
                    <span class="text-lg font-bold">{{ amountLocal }}</span>
                    </div>

                </div>
              </div>
              <div class="border-t border-dashed border-gray-400 my-3"></div>

              <div class="text-center mt-4 text-sm">
                <div>Rifaplay te asegura tu premio.</div>
                <div class="mt-1">Juega en <span class="text-blue-600 underline">{{ website }}</span></div>
              </div>

              <div class="flex justify-center mt-4">
                <img :src="qrUrl" alt="qr" class="h-32 w-32 sm:h-20 sm:w-40 object-contain" />
              </div>

              <div class="text-center mt-2 text-sm font-semibold">Gracias por tu compra</div>
            </div>
          </div>

          <div class="p-4 bg-white flex flex-col gap-3">
            <button
              @click="onDownload"
              class="w-full py-3 rounded-full shadow-lg text-white font-semibold text-lg"
              :class="btnPrimaryClasses"
            >
              Descarga tu Ticket
            </button>

            <button
              @click="onPrint"
              class="w-full py-3 rounded-full shadow-lg text-white font-semibold text-lg"
              :class="btnSecondaryClasses"
            >
              Imprime tu Ticket
            </button>

            <button
              @click="onSellAnother"
              class="w-full py-3 rounded-full shadow-lg text-white font-semibold text-lg"
              :class="btnTertiaryClasses"
            >
              Comprar otro Ticket
            </button>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  open: { type: Boolean, required: true },
  qrUrl: { type: String, required: true, default: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example' },

  logoSrc: { type: String, default: '/rifaLogo.png' },
  companyName: { type: String, default: 'Rifa Play' },
  companyLine: { type: String, default: 'Grupo Tech 11-11, C.A.' },
  companyRif: { type: String, default: 'Rif J-507080994' },

  clientName: { type: String, default: 'Pedro Perez' },
  clientId: { type: String, default: '12345678' },
  clientPhone: { type: String, default: '0412-1182016' },

  serialNumber: { type: [String, Number], default: 'TICKET-20251114-JBBJ8TWQKH' },
  date: { type: String, default: '28/10/2025-10:25:10' },
  // CAMBIO: sellerName en lugar de userName para el propietario de la rifa
  sellerName: { type: String, default: 'Propietario' },

  // NOMBRE ESPECÍFICO DE LA RIFA
  raffleName: { type: String, default: 'Rifa' },

  // NÚMEROS SELECCIONADOS
selectedNumbers: { 
  type: Array as () => string[],  // Cambiado de number[] a string[]
  default: () => ['0001', '0002', '0003'] 
},

  drawDate: { type: String, default: '22-10-2025 7:00pm' },

  quantity: { type: [String, Number], default: '10' },
  price: { type: Number, default: 9.00 },
  total: { type: String, default: '90,00' },

  amountUsd: { type: String, default: '90,00' },
  exchangeRate: { type: String, default: '3.872,50 COP/USD' },
  amountLocalCurrencyLabel: { type: String, default: 'COP' },
  amountLocal: { type: String, default: '348.525,00' },

  website: { type: String, default: 'www.rifaplay.la' }
})

// Computed property para formatear los números seleccionados
const formattedSelectedNumbers = computed(() => {
  if (!props.selectedNumbers || props.selectedNumbers.length === 0) {
    console.log('⚠️ No hay números seleccionados en Bill.vue');
    return 'No hay números seleccionados';
  }
  
  console.log('🔢 Números recibidos en Bill.vue:', props.selectedNumbers);
  
  return props.selectedNumbers
    .map(num => String(num))
    .join(' - ');
});

const emit = defineEmits(['close', 'download', 'print', 'sell-another'])

const btnPrimaryClasses = 'bg-gradient-to-r from-blue-500 to-blue-600 active:from-blue-600'
const btnSecondaryClasses = 'bg-gradient-to-r from-cyan-400 to-cyan-500 active:from-cyan-500'
const btnTertiaryClasses = 'bg-gradient-to-r from-green-500 to-green-600 active:from-green-600'

const onDownload = () => {
  emit('download')
}

const onPrint = () => {
  emit('print')
}

const onSellAnother = () => {
  emit('sell-another')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

button.rounded-full {
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  border-radius: 9999px;
  transition: all 0.15s ease-out;
}
button.rounded-full:active {
  transform: scale(0.98);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
}

.border-dotted {
  border-style: dotted;
  border-width: 2px;
}

.wrap-break-words {
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>