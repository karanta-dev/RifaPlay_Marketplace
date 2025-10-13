// // src/services/fakeWebSocket.ts
// import { useTicketStore } from '@/stores/useTicketStore'

// let interval: ReturnType<typeof setInterval> | null = null

// export function startFakeWebSocket(productTitle: string) {
//   const ticketStore = useTicketStore()

//   // Si ya estaba corriendo, no iniciar otro
//   if (interval) return

//   interval = setInterval(() => {
//     const available = ticketStore.availableTicketsForProduct(productTitle)

//     if (available.length === 0) {
//       console.log(`[WS] Todos los tickets agotados para ${productTitle}`)
//       return
//     }

//     // Simulamos que un usuario externo compra un ticket random
//     const randomTicket = available[Math.floor(Math.random() * available.length)]!
    
//     console.log(`[WS] Ticket #${randomTicket} vendido en ${productTitle}`)

//     // Aquí "disparamos" la actualización en el store
//     ticketStore.markTicketAsSold(productTitle, randomTicket)
//   }, 5000) // cada 5 segundos
// }

// export function stopFakeWebSocket() {
//   if (interval) {
//     clearInterval(interval)
//     interval = null
//   }
// }
