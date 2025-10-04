<template>
<div
  v-if="isOpen && product"
  class="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
  @click.self="closeModal"
>
  <div class="bg-white rounded-xl shadow-xl p-6 text-center w-[90%] max-w-md relative">
    <h2 class="text-xl font-bold mb-4">🎉 ¡Producto seleccionado!</h2>
    <img :src="product.images?.[0]" alt="" class="w-40 h-40 object-cover mx-auto rounded-lg shadow-md" />
    <h3 class="text-lg font-bold mt-3">{{ product.title }}</h3>
    <p class="text-gray-600 text-sm mt-2">{{ product.description }}</p>
    <p class="text-yellow-600 font-bold mt-2">Precio ticket: ${{ product.ticketPrice }}</p>

    <button
      @click="participar"
      class="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow"
    >
      Participar
    </button>
  </div>

  <!-- Confetti -->
  <canvas ref="confettiCanvas" class="absolute inset-0 pointer-events-none"></canvas>
</div>

</template>

<script setup>
import { ref, watch } from "vue"
import { useTicketStore } from "@/stores/useTicketStore"
import confetti from "canvas-confetti"

const props = defineProps({
  isOpen: Boolean,
  category: String
})
const emits = defineEmits(["close", "participar"])

const store = useTicketStore()
const product = ref(null)

watch(() => props.isOpen, (open) => {
  if (open && props.category) {
    const products = store.productsByCategory(props.category)
    product.value = products[Math.floor(Math.random() * products.length)]
    launchConfetti()
  }
})

function participar() {
  // 👉 Esto abre el ParticiparModal
  emits("participar", product.value)
}

function closeModal() {
  emits("close")
}

function launchConfetti() {
  const end = Date.now() + 1000
  const frame = () => {
    confetti({
      particleCount: 4,
      spread: 70,
      origin: { y: 0.6 }
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}
</script>
