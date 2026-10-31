# Auditoría de cierre — Inglés Lagunas

Fecha de pruebas: 30–31 de octubre de 2026. Contexto: checkout local `001-stable-90-day-learning`, Chrome y build de producción en un origen localhost exclusivo. Los datos de prueba son ficticios; no se borró el progreso del sitio público. **Medido** significa ejecutado/observado; **citado** identifica documentación; no se extrapola una prueba local a todos los dispositivos ni a 90 días transcurridos.

## Requisitos y defectos

Medido con el contrato del currículo y lectura del contenido: 60 sesiones distintas, cinco por cada una de 12 semanas; seis tipos de tarea por sesión, lectura/respuesta oral, diagnóstico y seis checkpoints. Están disponibles 30/15 minutos y microsesiones 5/10. Se conservaron las lecciones actuales, conectores y escenarios genéricos de Project Orion.

Se reprodujeron cinco regresiones con pruebas fallidas antes de corregirlas: incertidumbre que conservaba la racha; heurísticas que rechazaban frases válidas con `bring` o `Did … include`; intento duplicado después de una respuesta ignorada; contracciones no reconocidas; sustituciones que corrompían verbos de transferencia. Ahora pasan. La revisión también corrigió el banco de palabras de transferencia, que no correspondía al modelo completo.

Se corrigieron borradores sustituidos por el último intento, pérdida del paso/reflexión/tiempo/evaluación parcial, guardado demorado, finalización basada en aciertos históricos y repetición que reemplazaba la fecha original. La realización se calcula con 60 registros de lección y se separa del dominio. Los pospuestos futuros son visibles. Se verifica el estado actual de transferencia, y las afirmaciones antiguas incompatibles con el modelo corregido se conservan en el historial pero quedan pendientes de revisión. No se borran las lecciones realizadas.

La evaluación usa el primer intento verificable antes de corregir, excluye alternativas inciertas y muestra `Not scored` cuando no hay medición. Escritura y conversación siguen siendo autoevaluaciones. El corrector es determinista y no se presenta como IA; una reescritura desconocida no se considera automáticamente incorrecta.

Por los últimos ajustes del usuario, el audio usa **únicamente Sarah, en inglés estadounidense**, sin selector ni sustitución por otra voz. Velocidad inicial 1.0, alternativa 0.85; muestra, repetición, parada, subtítulos exactos y español independiente. Se declaró `en-US`, se revisaron variantes británicas comunes en textos/modelos y se ajustó el prompt de consulta manual a inglés americano. **Citado:** [metadatos oficiales de Kokoro](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md), consultados el 31-oct-2026, clasifican `af_sarah` bajo American English. **Medido:** prueba contra los metadatos del sintetizador instalado devuelve `en-us`. Esto no constituye una medición acústica de cada fonema.

## Escenarios de navegador

| Caso | Resultado medido |
|---|---|
| QA-01 Nuevo usuario | Origen limpio: 0/60, 60 pendientes, 0.0%, semana 1, cuatro duraciones y Continue Learning. |
| QA-02 Primera lección | Finalizada tras resolver/posponer tareas y guardar escritura/reflexión oral; queda un pospuesto visible. |
| QA-03 Correcta inicial | Listening correcto lleva a transferencia, sin afirmar tres recuperaciones inexistentes. |
| QA-04 Tres errores | Tres respuestas incorrectas de cloze: pistas graduales y después modelo/explicación. |
| QA-05 Tres aciertos | Recuperación desde campos vacíos: 1/3, 2/3 y 3/3; abre transferencia. |
| QA-06 Reinicio | Error tras 2/3 reinicia a cero. Recarga posterior a 1/3 conserva racha y campo vacío. Incertidumbre/help también cubiertos en tests. |
| QA-07 Transferencia | Listening, cloze y banco de palabras aceptan la nueva respuesta contextual; se programa repaso. |
| QA-08 Pospuesto | Connector aparece en Deferred exercises con fecha futura, incluso tras completar la lección. |
| QA-09 Retomar | Se conserva el borrador más nuevo sin enviar, el paso y la reflexión oral; Continue Learning retoma el pendiente. |
| QA-10 Avance | Una completada muestra 1/60, 59 restantes y 1.7%; siguiente lección 2. |
| QA-11 Repetir | Reabrir y responder mal en la lección completada no retira su registro ni cambia 1/60. |
| QA-12 Audio | Sarah genera media reproducible (`readyState:4`), termina a 0.85 (6.15 s en la frase probada), permite repetir y parar. Cambio a cloze desmonta el audio y no inicia reproducción tardía. El cambio de voz se elimina por petición posterior: Sarah es la única. |
| QA-13 Subtítulos | Mostrar/ocultar; texto inglés completo coincide con la frase y cambia al texto de la muestra de Sarah al preescuchar (muestra finalizada, 7.475 s, readyState 4). |
| QA-14 Español | Se muestra independientemente y no altera el texto inglés. En nueva apertura vuelve oculto. |
| QA-15 Persistencia | Recargas y cierre/apertura de pestaña conservan avance y subtítulos; Sarah única y velocidad inicial 1.0. No se cerró el proceso completo del navegador del usuario. |
| QA-16 Respaldo | Descarga JSON real de 11,265 bytes. Se sustituyeron datos ficticios por vacío (0/60) y restauraron los mismos bytes mediante la alternativa de pegar JSON. Nueva exportación: completada s01, 19 intentos y equivalencia exacta de metadata de lección, intentos, repasos y borradores. JSON versión 99 rechazado, manteniendo 1/60. Selector nativo de archivos: no automatizado con éxito; véase límite abajo. |
| QA-17 Última lección | Semana 12/sesión 5: listening y paso oral abiertos sin error. |
| QA-18 Móvil | 390×844: ancho de documento 390, vista de inicio y lección final revisadas visualmente, controles legibles sin superposición observada. Override retirado. |

También se ejecutó un diagnóstico con cinco tareas pospuestas: el borrador escrito se recuperó al salir y volver; se guardó la autoevaluación y el snapshot mostró Listening `Not scored 0/2`, Grammar `Not scored 0/3`. No se convirtió falta de datos en cero. Los siete formularios se validan automáticamente; no se completaron manualmente los siete.

Consola del origen de prueba: ningún error de la aplicación capturado en los flujos observados. Aparecieron mensajes de una extensión Grammarly, identificados por su URL `chrome-extension://`; no son fallos de la plataforma.

## Verificaciones reproducibles

- `npm run typecheck`: correcto.
- `npm run lint`: correcto.
- `npm test`: **55/55** pruebas, siete archivos.
- `npm run build`: correcto, rutas de assets bajo `/english-learning-platform/`.
- `npm audit --omit=dev --audit-level=high`: **0 vulnerabilidades** en la medición de cierre.
- `openspec validate stable-90-day-learning --strict`: correcto antes de archivar.
- Prerrequisitos Spec Kit: spec, plan y tasks presentes; sin hooks de extensión.

La validación automatizada cubre también datos antiguos versión 1 sin campos nuevos, importaciones inválidas, almacenamiento denegado/corrupto, rachas, equivalencias, horarios de repaso, cancelación/supersesión de audio, fin de las 60 lecciones y protección de registros al repetir.

## Datos y límites reales

Se conserva `compass-progress-v1`, versión 1, claves de preferencias e IDs anteriores. Los campos añadidos se inicializan al leer archivos antiguos; exportaciones incluyen borradores, metadata, evaluaciones, estados, historial y preferencias disponibles. Importar valida antes de reemplazar. Fallos de localStorage son visibles y los datos corruptos no se sobrescriben silenciosamente. No se añaden backend, servicios de voz ni dependencias de ejecución.

El puente de automatización del selector de archivos no pudo acceder al archivo por permisos de la extensión; no se cambiaron permisos. El ciclo real se ejecutó con la alternativa visible de pegar el mismo JSON, que comparte parser y operación de restauración con Import Progress. No se declara aprobado el selector nativo. No se reinició el navegador completo ni se esperaron 90 días: se verificó la persistencia mediante recarga, pestaña nueva y tests de almacenamiento/fechas.

Sarah depende del modelo gratuito y del rendimiento/conectividad del dispositivo: primera descarga aproximada de 90–330 MB más runtime, potencial demora y posibles artefactos de voz sintética. Si no está disponible, se muestra el fallo y se ofrece texto; no se usa otra voz. La síntesis ocurre localmente. Un nuevo inicio sin conexión no está garantizado. Borrar datos del navegador sin respaldo elimina el avance; un apagado abrupto puede perder los últimos segundos de tiempo aún no guardados. Ninguna calificación local certifica nivel CEFR ni garantiza resultados en 90 días.

## Publicación

Pendiente de registrar el commit, workflow y lectura de la versión pública. No se considera publicado por el solo hecho de generar el build.
