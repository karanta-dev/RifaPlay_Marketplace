

<template>
  <div class="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4">
    <ProductCard
      v-for="(item, i) in products"
      :key="i"
      :image="item.image"
      :title="item.title"
      :description="item.description"
      :progress="item.progress"
    />
  </div>
</template>

<script setup lang="ts">
import ProductCard from './ProductCard.vue'

const products = [
  { title: 'Toyota Corolla 2025', description: 'Nuevo', image: 'https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=400&q=80', progress: 72 },
  { title: 'iPhone Desbloqueado', description: 'Último modelo', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80', progress: 80 },
  { title: '$30,000 en efectivo', description: 'Dinero en mano', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', progress: 65 },
  { title: 'Tu casa nueva', description: 'Ideal para ti', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', progress: 45 },
  { title: 'Viaje Cancún', description: '2 personas', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80', progress: 60 },
  { title: 'Consola PS5', description: 'Nueva generación', image: 'https://images.unsplash.com/photo-1606813902912-0e2a4b9c3c9c?auto=format&fit=crop&w=400&q=80', progress: 65 },
  { title: 'Moto', description: 'Lista para rodar', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80', progress: 51 },
  { title: 'Viaje a Dubái', description: '2 personas', image: 'https://images.unsplash.com/photo-1504609813443-554e64a8f005?auto=format&fit=crop&w=400&q=80', progress: 21 }
]
</script>
