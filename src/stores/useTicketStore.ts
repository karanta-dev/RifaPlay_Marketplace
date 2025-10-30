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
  address: string
  tickets: number
  selectionMode: 'auto' | 'manual'
  selectedManualTickets: number[]
  metodoPago: string
  referencia: string
  comprobante: File | null
  pagoMovilMode: 'manual' | 'automatico'
  pagoMovilCedula?: string
  pagoMovilTelefono?: string
  pagoMovilBanco?: string
  totalPrice: number
  totalPriceBs: number
  bcvRate: number
}

// --- DEFINICIÓN DEL STORE ---

export const useTicketStore = defineStore('ticket', {
    state: () => ({
        ticketsVendidos: 1134283,
        loading: false,
        pagination: null as any,
        formData: {
            nombre: '',
            tipoId: 'V',
            numeroId: '',
            telefono: '',
            correo: '',
            address: '',
            tickets: 1,
            selectionMode: 'auto',
            selectedManualTickets: [] as number[],
            metodoPago: '',
            referencia: '',
            comprobante: null as File | null,
            pagoMovilMode: 'manual',
            pagoMovilCedula: '',
            pagoMovilTelefono: '',
            pagoMovilBanco: '',
            totalPrice: 0,
            totalPriceBs: 0,
            bcvRate: 0,
        } as TicketForm,
        ticketNumber: null as number | null,
        lastAssignedTickets: [] as number[],
        tickets: (persisted?.tickets ?? []) as TicketRecord[],
        ws: null as WebSocket | null,
        topProducts: [] as any[],
    }),
    getters: {
        userTicketsCount: (state) => {
            return (userId: number | string | null) => {
                if (!userId) return 0
                return state.tickets.filter(t => t.userId === userId).length
            }
        },
        productProgress: () => {
            return (product: { ticketsVendidos: number; ticketsMax: number }) => {
                if (product.ticketsVendidos === null || !product.ticketsMax || product.ticketsMax === 0) return 0;
                return Math.min(100, Math.round((product.ticketsVendidos / product.ticketsMax) * 100));
            }
        },
        productAlmostSoldOut: () => {
            return (product: { ticketsVendidos: number; ticketsMax: number }) =>
                (product.ticketsVendidos / product.ticketsMax) >= 0.7;
        },
        productsByCategory: (state) => {
            return (category: string) =>
                state.topProducts.filter((p: Product) => p.categories.includes(category));
        },
        allCategories: (state) => {
            return [...new Set(state.topProducts.flatMap((p: Product) => p.categories))];
        },
        availableTicketsForProduct: (state) => {
            return (productId: string): number[] => {
                const p = state.topProducts.find((t: any) => t.title === productId);
                if (!p) return [];
                const ticketsMax = Number(p?.ticketsMax ?? 0);
                const usedSet = new Set<number>(state.tickets
                    .filter(t => t.productId === productId)
                    .map(t => Number(t.ticketNumber))
                );
                const available: number[] = [];
                for (let i = 1; i <= ticketsMax; i++) {
                    if (!usedSet.has(i)) {
                        available.push(i);
                    }
                }
                return available;
            }
        },
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
        // ✅ 1. 'loadRaffles' VUELVE A SER SÚPER RÁPIDA
        async loadRaffles(page = 1, perPage = 16) {
          this.loading = true;
          try {
            const { data, meta } = await RaffleService.getAll(page, perPage);
            this.topProducts = data.map((r: any) => ({
              uuid: r.uuid,
              title: r.name,
              description: r.description,
              ticketsMax: r.end_range,
              drawDate: r.raffle_date,
              ticketPrice: parseFloat(r.ticket_price),
              rifero: r.seller ? `${r.seller.name} ${r.seller.last_name}`.trim() : "Anónimo",
              images: r.images?.map((img: any) => img.url) ?? [],
              categories: r.prizes?.[0]?.category ? [r.prizes[0].category.name] : [],
              status: r.status,
              ticketsVendidos: null, // 'null' significa que no se ha pedido
              isProgressLoading: false, 
            }));
            this.pagination = meta || null;
          } catch (error) {
            console.error("❌ ERROR CARGANDO LISTA:", error);
          } finally {
            this.loading = false;
          }
        },
        
        // ✅ 2. NUEVA ACCIÓN SECUENCIAL, SIN PROMESAS DE MIERDA
        async fetchAllProductsProgress() {
            // Usamos un bucle for...of con await. Esto garantiza que va UNA POR UNA.
            for (const product of this.topProducts) {
                // Si el producto ya tiene progreso, se lo salta.
                if (product.ticketsVendidos === null) {
                    const productIndex = this.topProducts.findIndex(p => p.uuid === product.uuid);
                    if (productIndex !== -1) {
                        try {
                            this.topProducts[productIndex].isProgressLoading = true;
                            // Espera a que esta llamada termine antes de continuar con la siguiente.
                            const realTicketsSold = await RaffleService.getSoldTicketsCount(product.uuid);
                            this.topProducts[productIndex].ticketsVendidos = realTicketsSold;
                        } catch (error) {
                            console.error(`❌ ERROR OBTENIENDO PROGRESO PARA ${product.uuid}:`, error);
                            this.topProducts[productIndex].ticketsVendidos = 0; // Si falla, le pone 0
                        } finally {
                            if (this.topProducts[productIndex]) {
                               this.topProducts[productIndex].isProgressLoading = false;
                            }
                        }
                    }
                }
            }
        },

        // --- TU CÓDIGO ORIGINAL EMPIEZA AQUÍ, INTACTO ---
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
                tipoId: 'V',
                numeroId: '',
                telefono: '',
                correo: '',
                address: '',
                tickets: 1,
                selectionMode: 'auto',
                selectedManualTickets: [],
                metodoPago: '',
                referencia: '',
                comprobante: null,
                pagoMovilMode: 'manual',
                pagoMovilCedula: '',
                pagoMovilTelefono: '',
                pagoMovilBanco: '',
                totalPrice: 0,
                totalPriceBs: 0,
                bcvRate: 0,
            }
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
                if (p) {
                  if (typeof p.ticketsVendidos === 'number') {
                    p.ticketsVendidos++;
                  }
                }
                this._savePersist();
            }
        },
        async updateRaffleTicketsCount(raffleUuid: string) {
            try {
                const realTicketsSold = await RaffleService.getSoldTicketsCount(raffleUuid);
                const productIndex = this.topProducts.findIndex(p => p.uuid === raffleUuid);
                if (productIndex !== -1 && this.topProducts[productIndex]) {
                    this.topProducts[productIndex].ticketsVendidos = realTicketsSold;
                    this._savePersist();
                }
                return realTicketsSold;
            } catch (error) {
                console.error(`❌ Error al actualizar tickets vendidos para ${raffleUuid}:`, error);
                throw error;
            }
        },
        async getSoldTicketNumbers(raffleUuid: string): Promise<number[]> {
            try {
                const soldTickets = await RaffleService.getSoldTickets(raffleUuid);
                return soldTickets;
            } catch (error) {
                console.error(`❌ [TicketStore] Error al obtener números de tickets vendidos para ${raffleUuid}:`, error);
                return [];
            }
        },
        async getAvailableTicketNumbers(raffleUuid: string): Promise<number[]> {
            try {
                const product = this.topProducts.find(p => p.uuid === raffleUuid);
                if (!product) {
                    console.warn(`⚠️ [TicketStore] Producto con UUID ${raffleUuid} no encontrado`);
                    return [];
                }
                const ticketsMax = product.ticketsMax;
                const soldTickets = await this.getSoldTicketNumbers(raffleUuid);
                const soldSet = new Set(soldTickets);
                const availableTickets: number[] = [];
                for (let i = 1; i <= ticketsMax; i++) {
                    if (!soldSet.has(i)) {
                        availableTickets.push(i);
                    }
                }
                return availableTickets;
            } catch (error) {
                console.error(`❌ [TicketStore] Error al obtener tickets disponibles para ${raffleUuid}:`, error);
                return [];
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
        reserveTicket(productId: string, ticketNumbers: number[], userId: number | string | null = 'reserved') {
            if (!Array.isArray(ticketNumbers) || ticketNumbers.length === 0) return;
            for (const num of ticketNumbers) {
                const existing = this.tickets.find(t => t.productId === productId && t.ticketNumber === num);
                if (!existing) {
                    this.tickets.push({
                        ticketNumber: Number(num),
                        productId,
                        userId: userId ?? 'reserved',
                        createdAt: new Date().toISOString(),
                        isWinner: false,
                    });
                }
            }
            this._savePersist();
        },
        _generateUnique6Digit(usedSet: Set<number>, ticketsMax: number): number {
            const MAX_ATTEMPTS = 2000;
            let attempts = 0;
            while (attempts < MAX_ATTEMPTS) {
                const rand6 = Math.floor(1 + Math.random() * ticketsMax);
                if (!usedSet.has(rand6)) return rand6;
                attempts++;
            }
            for (let i = 1; i <= ticketsMax; i++) {
                if (!usedSet.has(i)) return i;
            }
            throw new Error('No ticket numbers available');
        },
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
        generateTicket(form: any, product: any, userId: number | string | null = null, selectedNumbers?: number[]) {
            this.formData = { ...form };
            const p = this.topProducts.find((t: any) => t.title === (product?.title ?? product));
            if (!p) return;
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
            if (!selectedNumbers) {
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
                        break;
                    }
                }
            }
            this.lastAssignedTickets = assigned;
            this.venderTickets(product, assigned.length);
            this._savePersist();
        },
        getAvailableNumbers(productTitle: string, quantity: number): number[] {
            const available = this.availableTicketsForProduct(productTitle);
            if (!Array.isArray(available)) return [];
            if (available.length < quantity) {
                throw new Error(`Solo quedan ${available.length} tickets disponibles`);
            }
            return available.slice(0, quantity);
        },
        venderTickets(product: any, cantidad: number) {
            this.ticketsVendidos += Number(cantidad || 0);
            const p = this.topProducts.find((t: any) => t.title === (product?.title ?? product));
            if (p && typeof p.ticketsVendidos === 'number') {
              p.ticketsVendidos = (p.ticketsVendidos || 0) + Number(cantidad || 0);
            }
        },
        reset() {
            this.formData = {
                nombre: '',
                tipoId: 'V',
                numeroId: '',
                telefono: '',
                correo: '',
                address: '',
                tickets: 1,
                selectionMode: 'auto',
                selectedManualTickets: [],
                metodoPago: '',
                referencia: '',
                comprobante: null,
                pagoMovilMode: 'manual',
                pagoMovilCedula: '',
                pagoMovilTelefono: '',
                pagoMovilBanco: '',
                totalPrice: 0,
                totalPriceBs: 0,
                bcvRate: 0,
            }
            this.ticketNumber = null;
        }
    }
});