<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Encabezado -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
          Términos y Condiciones
        </h1>
        <p class="text-gray-300 text-lg">Última actualización: {{ new Date().toLocaleDateString() }}</p>
      </div>

      <!-- Contenido principal -->
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
        <div class="p-8 space-y-10">
          <!-- Sección 1 -->
          <section class="group hover:bg-white/5 transition-all duration-300 p-6 rounded-xl border-l-4 border-cyan-400">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                1
              </div>
              <div>
                <h2 class="text-2xl font-bold text-cyan-300 mb-4">Aceptación de los Términos</h2>
                <div class="space-y-3 text-gray-200 leading-relaxed">
                  <p>Al acceder y utilizar los servicios de <span class="text-cyan-300 font-semibold">www.rifaplay.la GLOBAL TECH 11-11, C.A</span>, usted acepta estar sujeto a estos términos de servicio.</p>
                  <p>Estos términos rigen su uso de nuestra plataforma para la compra de boletos de lotería y participación en rifas.</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Sección 2 -->
          <section class="group hover:bg-white/5 transition-all duration-300 p-6 rounded-xl border-l-4 border-blue-400">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                2
              </div>
              <div>
                <h2 class="text-2xl font-bold text-blue-300 mb-4">Elegibilidad y Requisitos</h2>
                <div class="space-y-4 text-gray-200 leading-relaxed">
                  <p>Para utilizar nuestros servicios, usted debe:</p>
                  <ul class="space-y-2 ml-4">
                    <li class="flex items-start gap-2">
                      <span class="text-blue-400 mt-1">•</span>
                      <span>Ser mayor de 18 años</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-blue-400 mt-1">•</span>
                      <span>Tener capacidad legal para celebrar contratos vinculantes</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-blue-400 mt-1">•</span>
                      <span>Proporcionar información precisa y actualizada durante el registro</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-blue-400 mt-1">•</span>
                      <span>Cumplir con todas las leyes y regulaciones locales aplicables sobre juegos de azar</span>
                    </li>
                  </ul>
                  
                  <div class="bg-amber-500/20 border border-amber-500/30 rounded-lg p-4 mt-4">
                    <p class="text-amber-200 font-semibold">⚠️ Importante:</p>
                    <p class="text-amber-100 mt-2">No vendemos bajo ningún concepto tickets, ni entregamos premios a <span class="font-bold">MENORES DE EDAD</span>. No pueden participar niños (as) y/o adolescentes en ninguno de nuestros sorteos.</p>
                    <p class="text-amber-100 mt-2">No utilizar a niños (as) y/o adolescentes como intermediarios para realizar compras en el sistema, o quedará anulada la misma.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Sección 3 -->
          <section class="group hover:bg-white/5 transition-all duration-300 p-6 rounded-xl border-l-4 border-purple-400">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                3
              </div>
              <div>
                <h2 class="text-2xl font-bold text-purple-300 mb-4">Servicios de Lotería y Rifas</h2>
                <div class="space-y-4 text-gray-200 leading-relaxed">
                  <p><span class="text-purple-300 font-semibold">www.rifaplay.la GLOBAL TECH 11-11, C.A</span> ofrece servicios de venta de boletos de lotería y rifas autorizadas.</p>
                  
                  <p class="font-semibold text-purple-200">Nos reservamos el derecho de:</p>
                  <ul class="space-y-2 ml-4">
                    <li class="flex items-start gap-2">
                      <span class="text-purple-400 mt-1">•</span>
                      <span>Verificar su identidad antes de procesar cualquier transacción</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-purple-400 mt-1">•</span>
                      <span>Limitar la cantidad de boletos por persona</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-purple-400 mt-1">•</span>
                      <span>Cancelar transacciones sospechosas de fraude</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-purple-400 mt-1">•</span>
                      <span>Modificar o suspender cualquier servicio según sea necesario</span>
                    </li>
                  </ul>
                  
                  <div class="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mt-4">
                    <p class="text-blue-200 font-semibold">🌍 Participación Internacional:</p>
                    <p class="text-blue-100 mt-2">Pueden participar desde cualquier lugar del mundo siempre y cuando puedan retirar su premio correspondiente en Venezuela, o en su defecto autorizar a un familiar mediante documento firmado de manera digital.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Sección 4 -->
          <section class="group hover:bg-white/5 transition-all duration-300 p-6 rounded-xl border-l-4 border-green-400">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                4
              </div>
              <div>
                <h2 class="text-2xl font-bold text-green-300 mb-4">Pagos y Reembolsos</h2>
                <div class="space-y-4 text-gray-200 leading-relaxed">
                  <p>Los pagos deben realizarse en su totalidad antes de la emisión de boletos. Los precios incluyen todos los impuestos aplicables.</p>
                  
                  <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                    <p class="text-red-200 font-semibold">❌ Política de Reembolsos:</p>
                    <p class="text-red-100 mt-2">No se aceptan reembolsos una vez emitidos los boletos, excepto en casos específicos determinados por la ley.</p>
                    <p class="text-red-100 mt-2">No se realizan devoluciones de pagos bajo ningún concepto.</p>
                  </div>
                  
                  <div class="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                    <p class="text-yellow-200 font-semibold">⏰ Plazos de Reclamo:</p>
                    <p class="text-yellow-100">De tener algún reclamo con respeto a sus pedidos deben hacerlo dentro de las <span class="font-bold">48 horas</span> posteriores a la realización del mismo.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Sección 5 -->
          <section class="group hover:bg-white/5 transition-all duration-300 p-6 rounded-xl border-l-4 border-orange-400">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                5
              </div>
              <div>
                <h2 class="text-2xl font-bold text-orange-300 mb-4">Premios y Reclamos</h2>
                <div class="space-y-4 text-gray-200 leading-relaxed">
                  <p>Los ganadores serán notificados según los procedimientos establecidos para cada sorteo o rifa. Los premios deben ser reclamados dentro del período especificado y con la documentación requerida.</p>
                  
                  <div class="space-y-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-4">
                    <div class="flex items-start gap-2">
                      <span class="text-orange-400 mt-1">⏰</span>
                      <p><span class="font-semibold text-orange-300">72 horas:</span> Cada ganador tiene un lapso de 72 horas para atender a nuestro llamado.</p>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="text-orange-400 mt-1">📅</span>
                      <p><span class="font-semibold text-orange-300">21 días:</span> Cada ganador tiene un máximo de 21 días continuos para recibir su premio.</p>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="text-orange-400 mt-1">⚖️</span>
                      <p>El proceso de documentos notariados para vehículos, motos o inmuebles puede tardar por circunstancias ajenas a nuestra voluntad.</p>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="text-orange-400 mt-1">🔒</span>
                      <p>Si el equipo de verificación detecta irregularidades en el pago, automáticamente se pierde el premio.</p>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="text-orange-400 mt-1">💳</span>
                      <p>Los premios se pagan a través del mismo método de pago con el que el jugador compra su ticket.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Sección 6 -->
          <section class="group hover:bg-white/5 transition-all duration-300 p-6 rounded-xl border-l-4 border-pink-400">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                6
              </div>
              <div>
                <h2 class="text-2xl font-bold text-pink-300 mb-4">Publicidad y Uso de Imagen</h2>
                <div class="space-y-4 text-gray-200 leading-relaxed">
                  <div class="bg-pink-500/20 border border-pink-500/30 rounded-lg p-4">
                    <p class="text-pink-200 font-semibold">📸 Uso de Imagen:</p>
                    <p class="text-pink-100 mt-2">Todos al participar, automáticamente aceptan ser publicados (en caso de resultar ganador/a) en redes sociales y/o cualquier otro medio que la empresa considere prudente.</p>
                  </div>
                  
                  <div class="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                    <p class="text-purple-200 font-semibold">📝 Autorización:</p>
                    <p class="text-purple-100">Los ganadores (as) de premios considerados de gran valor, deberán firmar una autorización de cesión de imagen con la empresa.</p>
                  </div>
                  
                  <div class="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                    <p class="text-blue-200 font-semibold">📧 Comunicaciones:</p>
                    <p class="text-blue-100">Todos al participar aceptan que la empresa pueda enviar publicidad y/o recomendaciones a los datos registrados en nuestro sistema.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Sección 7 -->
          <section class="group hover:bg-white/5 transition-all duration-300 p-6 rounded-xl border-l-4 border-red-400">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                7
              </div>
              <div>
                <h2 class="text-2xl font-bold text-red-300 mb-4">Responsabilidad Legal</h2>
                <div class="space-y-4 text-gray-200 leading-relaxed">
                  <p><span class="text-red-300 font-semibold">www.rifaplay.la GLOBAL TECH 11-11, C.A</span> actúa como intermediario autorizado para la venta de boletos.</p>
                  
                  <p class="font-semibold text-red-200">No nos hacemos responsables por:</p>
                  <ul class="space-y-2 ml-4">
                    <li class="flex items-start gap-2">
                      <span class="text-red-400 mt-1">•</span>
                      <span>Resultados de sorteos</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-red-400 mt-1">•</span>
                      <span>Pérdidas o daños derivados del uso de nuestros servicios</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-red-400 mt-1">•</span>
                      <span>Problemas técnicos fuera de nuestro control</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-red-400 mt-1">•</span>
                      <span>Uso indebido de la plataforma por parte del usuario</span>
                    </li>
                  </ul>
                  
                  <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mt-4">
                    <p class="text-red-200 font-semibold">⚠️ Conducta:</p>
                    <p class="text-red-100">Si algún ganador tiene una conducta irregular hacia cualquier persona del equipo, la empresa tiene el derecho de prohibirle la participación en futuros sorteos y/o juegos.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Sección 8 -->
          <section class="group hover:bg-white/5 transition-all duration-300 p-6 rounded-xl border-l-4 border-indigo-400">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                8
              </div>
              <div>
                <h2 class="text-2xl font-bold text-indigo-300 mb-4">Modificaciones</h2>
                <div class="space-y-3 text-gray-200 leading-relaxed">
                  <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en nuestra plataforma.</p>
                  <div class="bg-indigo-500/20 border border-indigo-500/30 rounded-lg p-4 mt-4">
                    <p class="text-indigo-200 font-semibold">📢 Aviso Importante:</p>
                    <p class="text-indigo-100">El uso continuado de nuestros servicios implica la aceptación de dichas modificaciones.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- Pie de página -->
      <div class="text-center mt-8 text-gray-400">
        <p>Si tienes alguna pregunta sobre estos términos, contáctanos en <span class="text-cyan-400">soporte@rifaplay.la</span></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No se necesita lógica adicional aquí
</script>

<style scoped>
/* Efectos de scroll suave para mejor experiencia de usuario */
html {
  scroll-behavior: smooth;
}

/* Mejoras de animación para los elementos interactivos */
.group:hover {
  transform: translateX(4px);
}
</style>