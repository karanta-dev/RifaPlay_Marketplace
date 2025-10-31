import { defineStore } from "pinia";
import { useTicketStore } from "./useTicketStore";
export interface UserComment {
  user: string;
  rating: number;
  text: string;
  date: string;
  avatar: string | null;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [
      {
        id: "2",
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
  id: "76e13f6b-5925-4d73-977b-a4fbdb6f8593",
  name: "Efren Rojas",
  avatar: null, // No tiene foto → generará inicial automáticamente
  rating: 5, // Puedes modificarlo luego si tienes data
  registeredDays: 1023, // ~ 3 años (simulado a tono con la descripción)
  lastSeen: "hace 8 min",
  comments: [
    {
      user: "Andrea",
      rating: 5,
      text: "Serio y responsable, entrega inmediata. Recomendado 🔥",
      date: "14-10-2025",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
      user: "Miguel",
      rating: 5,
      text: "Verificado y confiable, excelente atención.",
      date: "09-10-2025",
      avatar: null
    },
    {
      user: "Sofía",
      rating: 4,
      text: "Todo bien pero tardó un poco en responder.",
      date: "03-10-2025",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg"
    }
  ]
},
      {
        id: "3",
        name: "Tech Store",
        avatar: null,
        rating: 5,
        registeredDays: 2000,
        lastSeen: "ayer",
        comments: [
          // AÑADE 'date' y 'avatar' a todos los comentarios
          { user: "Pedro", rating: 5, text: "Excelente servicio.", date: "01-09-2025", avatar: null },
          { user: "Ana", rating: 5, text: "Productos de primera.", date: "05-09-2025", avatar: null },
          { user: "Laura", rating: 4, text: "Entrega rápida, todo bien.", date: "10-09-2025", avatar: null },
        ],
      },
      {
        id: "4",
        name: "TravelRaffle",
        avatar: "https://randomuser.me/api/portraits/men/28.jpg",
        rating: 3,
        registeredDays: 800,
        lastSeen: "hace 2 horas",
        comments: [
          { user: "Luis", rating: 3, text: "Cumplieron, pero tardaron un poco.", date: "12-09-2025", avatar: null },
          { user: "Elena", rating: 4, text: "Buena experiencia en general.", date: "18-09-2025", avatar: null },
        ],
      },
      {
        id: "5",
        name: "Game World",
        avatar: "https://randomuser.me/api/portraits/men/52.jpg",
        rating: 5,
        registeredDays: 1500,
        lastSeen: "hace 30 min",
        comments: [
          { user: "Raúl", rating: 5, text: "Los mejores en gaming 🎮.", date: "12-09-2025", avatar: null },
          { user: "Diana", rating: 5, text: "Me gané una PS5 y llegó impecable!", date: "12-09-2025", avatar: null },
        ],
      },
      {
        id: "6",
        name: "ElectroShop",
        avatar: null,
        rating: 4,
        registeredDays: 600,
        lastSeen: "hace 10 min",
        comments: [
          { user: "Andrés", rating: 4, text: "Buen servicio, repetiría.", date: "12-09-2025", avatar: null },
          { user: "Valeria", rating: 5, text: "Todo perfecto, gracias.", date: "12-09-2025", avatar: null },
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
    getUserProducts: () => {
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