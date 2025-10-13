import { defineStore } from 'pinia';
import { RaffleService } from "@/services/RaffleService";

// Clave para la persistencia en localStorage
const PERSIST_KEY = 'rifa_ticket_store_v1';

localStorage.removeItem('rifa_ticket_store_v1')

// Intentar leer el estado persistido
let persisted: any = null;
try {
    const raw = localStorage.getItem(PERSIST_KEY);
    if (raw) persisted = JSON.parse(raw);
} catch (e) {
    console.error("Error leyendo estado persistido:", e);
    persisted = null;
}

// --- TIPOS DE DATOS ---

interface Product {
    uuid?: string;
    title: string;
    rifero: string;
    categories: string[];
    description: string;
    images: string[];
    ticketPrice: number;
    ticketsVendidos: number;
    ticketsMax: number;
    drawDate: string;
    winnerTicketNumber?: number | null;
}

interface TicketRecord {
    ticketNumber: number;
    productId: string;
    userId: number | string | null;
    createdAt: string;
    quantity?: number;
    isWinner?: boolean;
}

export interface TicketInfo {
  id: number
  number: number
  userId: number
  productTitle: string
}

export interface TicketStatus {
  number: number
  isSold: boolean
}

export interface TicketForm {
  nombre: string
  tipoId: string
  numeroId: string
  telefono: string
  correo: string
  tickets: number
  metodoPago: string
  referencia: string
  comprobante: File | null
  pagoMovilCedula?: string
  pagoMovilTelefono?: string
  pagoMovilBanco?: string
}

// --- DEFINICIÓN DEL STORE ---

export const useTicketStore = defineStore('ticket', {
    state: () => ({
        // Datos generales de la simulación
        ticketsVendidos: 1134283, // Total vendido en todas las rifas (simulación)
            loading: false,
        pagination: null as any,
        // Estado temporal para el proceso de compra
        formData: {
        nombre: '',
        tipoId: '',
        numeroId: '',
        telefono: '',
        correo: '',
        tickets: 1,
        metodoPago: '',
        referencia: '',
        comprobante: null,
        } as TicketForm,
        ticketNumber: null as number | null,
        lastAssignedTickets: [] as number[],

        // Tickets individuales asociados a usuario/producto (Simulación de DB)
        tickets: (persisted?.tickets ?? []) as TicketRecord[],
        ws: null as WebSocket | null, // 🔴 Guardamos la conexión WS aquí
        // topProducts: [] as Product[],

        // Lista de rifas (productos) con datos simulados (Simulación de DB)
        topProducts: (persisted?.topProducts ?? [
            {
                title: 'Toyota Corolla 2025',
                rifero: 'Juan Pérez',
                categories: ['Autos'],
                description: 'Un carro nuevo, directo de agencia. Incluye audio premium.',
                images: [
                    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80'
                ],
                ticketPrice: 10,
                ticketsVendidos: 723, // Vendidos simulados
                ticketsMax: 1000, // Máximo de tickets
                drawDate: '2025-11-25T10:00:00'
            },
            {
                title: 'Meru 2025',
                rifero: 'Juan Pérez',
                categories: ['Autos'],
                description: 'Un carro usado pero que se ve como nuevo, directo de agencia. Incluye audio premium.',
                images: [
                    'https://th.bing.com/th/id/R.5c7b5fea0c9a271bcb34bed0baa006aa?rik=c5nFsW2lrYoDng&riu=http%3a%2f%2ftopcarspecs.com%2fmanufacturers%2ftoyota%2ftoyota-meru%2ftoyota-meru-3.jpg&ehk=dtsNxgJbGz%2fh2D7vu9kkZF8nA%2b5GrkFN7pYcxOmL85U%3d&risl=&pid=ImgRaw&r=0',
                    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80'
                ],
                ticketPrice: 10,
                ticketsVendidos: 723,
                ticketsMax: 1000,
                drawDate: '2025-09-25T10:00:00'
            },
            
              {
                title: 'Moto Honda 2025',
                rifero: 'Juan Pérez',
                categories: ['Motos'],
                description: 'Una moto usada pero que se ve como nuevo, directo de agencia. Incluye audio premium.',
                images: [
                    'https://www.motoamerica.com/wp-content/uploads/2024/10/1-3.jpg',
                    'https://www.motoamerica.com/wp-content/uploads/2024/10/1-3.jpg'
                ],
                ticketPrice: 10,
                ticketsVendidos: 723,
                ticketsMax: 1000,
                drawDate: '2025-10-25T10:00:00'
            },
            {
                title: 'iPhone + AirPods',
                rifero: 'Tech Store',
                categories: ['Electrodomésticos', 'Moviles'],
                description: 'Paquete con iPhone desbloqueado + AirPods Pro.',
                images: [
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
                ],
                ticketPrice: 5,
                ticketsVendidos: 1450,
                ticketsMax: 2000,
                drawDate: '2025-11-28T12:30:00'
            },
            {
                title: 'Viaje a París',
                rifero: 'TravelRaffle',
                categories: ['Viajes', 'Experiencias'],
                description: 'Vuelo ida y vuelta + 5 noches en hotel 4 estrellas para 2 personas.',
                images: [
                    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'
                ],
                ticketPrice: 15,
                ticketsVendidos: 320,
                ticketsMax: 500,
                drawDate: '2025-12-05T09:00:00'
            },
            {
                title: 'PlayStation 5 + Juegos',
                rifero: 'Game World',
                categories: ['Electrodomésticos', 'Gaming'],
                description: 'Consola PS5 edición estándar + 3 juegos a elegir.',
                images: [
                    'https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2021/10/consola-ps5-playstation-5-2497497.jpg?tf=3840x',
                    'https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2021/10/consola-ps5-playstation-5-2497497.jpg?tf=3840x'
                ],
                ticketPrice: 8,
                ticketsVendidos: 900,
                ticketsMax: 1200,
                drawDate: '2025-11-30T18:00:00'
            },
            {
                title: 'Smart TV Samsung 65"',
                rifero: 'ElectroShop',
                categories: ['Electrodomésticos'],
                description: 'Pantalla 4K UHD Smart TV, ideal para cine en casa.',
                images: [
                    'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80'
                ],
                ticketPrice: 6,
                ticketsVendidos: 250,
                ticketsMax: 400,
                drawDate: '2025-12-02T14:00:00'
            },
            {
                title: 'MacBook Air M2',
                rifero: 'Apple Lovers',
                categories: ['Electrodomésticos', 'Computadoras'],
                description: 'Laptop ultraligera con chip M2 y 512GB SSD.',
                images: [
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
                ],
                ticketPrice: 12,
                ticketsVendidos: 1000,
                ticketsMax: 1000,
                drawDate: '2025-09-26T11:00:00'
            },
            {
                title: 'Carro Honda CBR500R',
                rifero: 'Carros Club',
                categories: ['Autos'],
                description: 'Carro deportivo, modelo 2025, lista para carretera.',
                images: [
                    'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80'
                ],
                ticketPrice: 20,
                ticketsVendidos: 180,
                ticketsMax: 300,
                drawDate: '2025-09-25T15:00:00'
            }
        ]) as Product[],
    }),
    getters: {

        userTicketsCount: (state) => {
        return (userId: number | string | null) => {
        if (!userId) return 0
        return state.tickets.filter(t => t.userId === userId).length
        }
    },
        // Calcula el progreso de venta de un producto
        productProgress: () => {
            return (product: { ticketsVendidos: number; ticketsMax: number }) =>
                Math.min(100, Math.round((product.ticketsVendidos / product.ticketsMax) * 100));
        },

        // Verifica si un producto está cerca de agotarse (70% o más)
        productAlmostSoldOut: () => {
            return (product: { ticketsVendidos: number; ticketsMax: number }) =>
                (product.ticketsVendidos / product.ticketsMax) >= 0.7;
        },

        // Filtra productos por categoría
        productsByCategory: (state) => {
            return (category: string) =>
                state.topProducts.filter((p: Product) => p.categories.includes(category));
        },

        // Extrae todas las categorías únicas disponibles
        allCategories: (state) => {
            return [...new Set(state.topProducts.flatMap((p: Product) => p.categories))];
        },
        
        // Obtiene la lista de números de tickets DISPONIBLES para un producto (solo números)
        availableTicketsForProduct: (state) => {
            return (productId: string): number[] => {
                const p = state.topProducts.find((t: any) => t.title === productId);
                if (!p) return [];
                const ticketsMax = Number(p?.ticketsMax ?? 0);
                // Crea un Set de los números de ticket que ya fueron vendidos
                const usedSet = new Set<number>(state.tickets
                    .filter(t => t.productId === productId)
                    .map(t => Number(t.ticketNumber))
                );

                // Generar todos los números de ticket disponibles
                const available: number[] = [];
                for (let i = 1; i <= ticketsMax; i++) {
                    if (!usedSet.has(i)) {
                        available.push(i);
                    }
                }
                return available;
            }
        },

        // Obtiene la lista de TODOS los tickets para un producto con su estado (vendido o no)
        allTicketsForProduct: (state) => {
            return (productId: string): TicketStatus[] => {
                const p = state.topProducts.find((t: any) => t.title === productId);
                if (!p) return [];
                const ticketsMax = Number(p?.ticketsMax ?? 0);

                const soldSet = new Set<number>(state.tickets
                .filter(t => t.productId === productId)
                .map(t => Number(t.ticketNumber))
                );

                const all: TicketStatus[] = [];
                for (let i = 1; i <= ticketsMax; i++) {
                all.push({
                    number: i,
                    isSold: soldSet.has(i)
                });
                }
                return all;
            }
            }

    },
    actions: {
            // 🔴 Nuevo: conectar al WebSocket
            
//     connectToTicketWS() {
//     const ws = new WebSocket("ws://localhost:3000");

//     ws.onopen = () => {
//       console.log("✅ Conectado al WebSocket de tickets");
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);

//         if (data.type === "ticket_sold" || data.type === "ticket_reserved") {
//           const { productId, ticketNumbers, userId } = data;

//           ticketNumbers.forEach((n: number) => {
//             if (!this.tickets.find(t => t.ticketNumber === n && t.productId === productId)) {
//               this.tickets.push({
//                 ticketNumber: n,
//                 productId,
//                 userId,
//                 createdAt: new Date().toISOString(),
//                 isWinner: false,
//               });
//             }
//           });

//           const p = this.topProducts.find(p => p.title === productId);
//           if (p) p.ticketsVendidos += ticketNumbers.length;

//           this._savePersist();
//         }

//         if (data.type === "ticket_released") {
//           const { productId, ticketNumbers } = data;
//           this.tickets = this.tickets.filter(
//             t => !(ticketNumbers.includes(t.ticketNumber) && t.productId === productId)
//           );
//           this._savePersist();
//         }
//       } catch (err) {
//         console.error("❌ Error parsing WS message:", err);
//       }
//     };
//   },
  setComprobante(file: File | null) {
  if (file) {
    this.formData.comprobante = file
    console.log("📄 Comprobante cargado:", file.name)
  } else {
    this.formData.comprobante = null
  }
},
clearForm() {
  this.formData = {
    nombre: '',
    tipoId: '',
    numeroId: '',
    telefono: '',
    correo: '',
    tickets: 1,
    metodoPago: '',
    referencia: '',
    comprobante: null,
    // Limpiar nuevos campos
    pagoMovilCedula: '',
    pagoMovilTelefono: '',
    pagoMovilBanco: ''
  }
},
    async loadRaffles(page = 1, perPage = 16) {
      this.loading = true;

      try {
        const { data, meta } = await RaffleService.getAll(page, perPage);

        // 🔹 Guardamos los productos (mapeo a tu estructura actual)
        this.topProducts = data.map((r) => ({
          uuid: r.uuid,
          title: r.name,
          rifero: r.created_by?.name ?? "Desconocido",
          categories: r.categories?.map((c) => c.name) ?? [],
          description: r.description,
          images: r.images?.map((i) => i.url) ?? [],
          ticketPrice: r.ticket_price,
          status: r.status,
          ticketsVendidos: r.tickets_sold,
          ticketsMax: r.end_range,
          drawDate: r.raffle_date,
        }));

        // 🔹 Guardamos la metadata (paginación)
        this.pagination = meta || null;
      } catch (error) {
        console.error("❌ No se pudieron cargar las rifas:", error);
      } finally {
        this.loading = false;
      }
    },
      // 🔵 Métodos para enviar mensajes al WS
    reserveTicket(productId: string, ticketNumbers: number[], userId: number | string) {
      this.ws?.send(JSON.stringify({
        type: "ticket_reserved",
        productId,
        ticketNumbers,
        userId,
      }));
    },

     releaseTicket(productId: string, ticketNumbers: number[]) {
      this.ws?.send(JSON.stringify({
        type: "ticket_released",
        productId,
        ticketNumbers,
      }));
    },

    markTicketAsSold(productTitle: string, ticket: number) {
    if (!this.tickets.find(t => t.productId === productTitle && t.ticketNumber === ticket)) {
        this.tickets.push({
        ticketNumber: ticket,
        productId: productTitle,
        userId: null,
        createdAt: new Date().toISOString(),
        isWinner: false,
        });
        const p = this.topProducts.find(p => p.title === productTitle);
        if (p) p.ticketsVendidos++;
        this._savePersist();
    }
    },

        confirmTicket(productId: string, ticketNumbers: number[], userId: number | string) {
      this.ws?.send(JSON.stringify({
        type: "ticket_sold",
        productId,
        ticketNumbers,
        userId,
      }));
    },
        // Helper: genera un número de ticket único no usado
        _generateUnique6Digit(usedSet: Set<number>, ticketsMax: number): number {
            const MAX_ATTEMPTS = 2000;
            let attempts = 0;
            
            // Intenta encontrar un número aleatorio no usado
            while (attempts < MAX_ATTEMPTS) {
                const rand6 = Math.floor(1 + Math.random() * ticketsMax); // Genera un número entre 1 y ticketsMax
                if (!usedSet.has(rand6)) return rand6;
                attempts++;
            }
            
            // Fallback: búsqueda lineal del primer número disponible
            for (let i = 1; i <= ticketsMax; i++) {
                if (!usedSet.has(i)) return i;
            }
            
            throw new Error('No ticket numbers available');
        },

        // Persiste el estado mínimo a localStorage
        _savePersist() {
            try {
                const data = {
                    tickets: this.tickets,
                    topProducts: this.topProducts
                };
                localStorage.setItem(PERSIST_KEY, JSON.stringify(data));
            } catch (e) {
                console.warn('Could not save to localStorage', e);
            }
        },

        // Genera y registra la compra de tickets
        generateTicket(form: any, product: any, userId: number | string | null = null, selectedNumbers?: number[]) {
            this.formData = { ...form };
            
            const p = this.topProducts.find((t: any) => t.title === (product?.title ?? product));
            if (!p) return; // Salir si el producto no existe

            const ticketsMax = Number(p.ticketsMax ?? Infinity);
            const sold = Number(p.ticketsVendidos ?? 0);
            const available = Math.max(0, ticketsMax - sold);
            
            const cantidadRequested = selectedNumbers?.length ?? Math.max(1, Number(form.tickets ?? 1));
            const cantidad = selectedNumbers?.length ?? Math.min(cantidadRequested, available);
            
            if (cantidad <= 0) {
                this.ticketNumber = null;
                return;
            }

            const productId = p.title;
            const used = new Set<number>(this.tickets
                .filter(t => t.productId === productId)
                .map(t => Number(t.ticketNumber))
            );

            const assigned: number[] = [];

            // 1. Intentar usar los números seleccionados manualmente
            if (Array.isArray(selectedNumbers) && selectedNumbers.length > 0) {
                for (const num of selectedNumbers) {
                    if (assigned.length >= cantidad) break;
                    const n = Number(num);
                    if (n >= 1 && n <= ticketsMax && !used.has(n)) {
                        this.tickets.push({
                            ticketNumber: n,
                            productId,
                            userId: userId ?? null,
                            createdAt: new Date().toISOString(),
                            quantity: 1,
                            isWinner: false,
                        });
                        assigned.push(n);
                        used.add(n);
                    }
                }
            }

            // 2. Si todavía faltan tickets (solo en modo automático), auto-generar el resto
            if (!selectedNumbers) { // Solo si no se proporcionaron números seleccionados (modo auto)
                for (let i = assigned.length; i < cantidad; i++) {
                    try {
                        const newNum = this._generateUnique6Digit(used, ticketsMax);
                        this.tickets.push({
                            ticketNumber: newNum,
                            productId,
                            userId: userId ?? null,
                            createdAt: new Date().toISOString(),
                            quantity: 1,
                            isWinner: false,
                        });
                        this.ticketNumber = newNum;
                        assigned.push(newNum);
                        used.add(newNum);
                    } catch (error) {
                        console.error('No se pudo generar un ticket único:', error);
                        break; // Salir si falla la generación
                    }
                }
            }

            this.lastAssignedTickets = assigned;
            this.venderTickets(product, assigned.length);
            this._savePersist();
        },
        
        // Actualiza el contador de tickets vendidos
        venderTickets(product: any, cantidad: number) {
            this.ticketsVendidos += Number(cantidad || 0);
            const p = this.topProducts.find((t: any) => t.title === (product?.title ?? product));
            if (p) p.ticketsVendidos = (p.ticketsVendidos || 0) + Number(cantidad || 0);
        },

        // Resetear datos temporales
        reset() {
        this.formData = {
            nombre: '',
            tipoId: '',
            numeroId: '',
            telefono: '',
            correo: '',
            tickets: 1,
            metodoPago: '',
            referencia: '',
            comprobante: null,
        }
            this.ticketNumber = null;
        }
    }
    
});
