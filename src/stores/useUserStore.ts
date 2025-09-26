import { defineStore } from "pinia";
import { useTicketStore } from "./useTicketStore";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [
      {
        id: "1",
        name: "Juan Pérez",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg", // ✅ avatar
        rating: 4,
        registeredDays: 1200,
        lastSeen: "hace 5 min",
        comments: [
          { user: "Carlos", rating: 5, text: "Muy confiable y rápido.", date: "15-09-2025", avatar: null },
          { user: "María", rating: 4, text: "Todo bien, volvería a participar.", date: "20-09-2025", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
          { user: "Jorge", rating: 5, text: "Entregó el carro a tiempo 👌.", date: "23-09-2025", avatar: null },
        ],
      },
      {
        id: "2",
        name: "Tech Store",
        avatar: null, // ❌ No puso avatar → se mostrará fallback
        rating: 5,
        registeredDays: 2000,
        lastSeen: "ayer",
        comments: [
          { user: "Pedro", rating: 5, text: "Excelente servicio." },
          { user: "Ana", rating: 5, text: "Productos de primera." },
          { user: "Laura", rating: 4, text: "Entrega rápida, todo bien." },
        ],
      },
      {
        id: "3",
        name: "TravelRaffle",
        avatar: "https://randomuser.me/api/portraits/men/28.jpg",
        rating: 3,
        registeredDays: 800,
        lastSeen: "hace 2 horas",
        comments: [
          { user: "Luis", rating: 3, text: "Cumplieron, pero tardaron un poco." },
          { user: "Elena", rating: 4, text: "Buena experiencia en general." },
        ],
      },
      {
        id: "4",
        name: "Game World",
        avatar: "https://randomuser.me/api/portraits/men/52.jpg",
        rating: 5,
        registeredDays: 1500,
        lastSeen: "hace 30 min",
        comments: [
          { user: "Raúl", rating: 5, text: "Los mejores en gaming 🎮." },
          { user: "Diana", rating: 5, text: "Me gané una PS5 y llegó impecable!" },
        ],
      },
      {
        id: "5",
        name: "ElectroShop",
        avatar: null,
        rating: 4,
        registeredDays: 600,
        lastSeen: "hace 10 min",
        comments: [
          { user: "Andrés", rating: 4, text: "Buen servicio, repetiría." },
          { user: "Valeria", rating: 5, text: "Todo perfecto, gracias." },
        ],
      },
    ],
  }),


  getters: {
    // 🔎 Buscar usuario por ID
    getUserById: (state) => {
      return (id: string) => state.users.find((u) => u.id === id);
    },

    // 🔎 Buscar usuario por nombre (ej. rifero)
    getUserByName: (state) => {
      return (name: string) =>
        state.users.find(
          (u) => u.name.toLowerCase().trim() === name.toLowerCase().trim()
        );
    },

    // 📦 Obtener rifas/productos de un usuario específico
    getUserProducts: (state) => {
      return (userName: string) => {
        const ticketStore = useTicketStore();
        return ticketStore.topProducts.filter(
          (p) =>
            p.rifero.toLowerCase().trim() === userName.toLowerCase().trim()
        );
      };
    },
  },
});