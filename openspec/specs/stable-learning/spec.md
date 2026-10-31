# stable-learning Specification

## Purpose
Permitir estudiar diariamente con el programa existente, guardar y recuperar avance, aprender de errores y escuchar con ayudas opcionales durante una ruta flexible de 90 días.

## Requirements

### Requirement: FR-001 Programa existente completo
La plataforma SHALL conservar 12 semanas con cinco sesiones cada una, objetivos de 30 y 15 minutos y micro sesiones de 5 y 10 minutos. Cada sesión SHALL incluir listening, tareas escritas, práctica oral y repaso en escenarios ficticios; SHALL conservar diagnóstico y seis evaluaciones periódicas.

#### Scenario: QA-01 Usuario nuevo
- **WHEN** un usuario abre el sitio sin datos previos
- **THEN** observa cero lecciones realizadas, 60 pendientes, la semana inicial, las cuatro duraciones y la primera lección disponible.

#### Scenario: QA-17 Última sesión
- **WHEN** abre la sesión 60 desde la ruta
- **THEN** puede consultar sus ejercicios y práctica oral sin error de navegación.

### Requirement: FR-002 Corrección y reenseñanza
Para tareas verificables, el sistema SHALL dar pistas graduales sin solución inmediata, mostrar solución y explicación al tercer fallo, ocultarlas al iniciar recuperación y exigir tres respuestas correctas consecutivas. Un fallo o una respuesta incierta durante esa recuperación SHALL reiniciar la racha; incierto no equivale a incorrecto.

#### Scenario: QA-03 Correcta inicial
- **WHEN** responde correctamente al primer intento
- **THEN** pasa a transferencia sin afirmar una racha de dominio inexistente.

#### Scenario: QA-04 Tres errores
- **WHEN** falla tres veces
- **THEN** conserva los tres intentos y presenta explicación y solución.

#### Scenario: QA-05 Recuperación
- **WHEN** oculta la solución y responde bien tres veces consecutivas
- **THEN** observa 1/3, 2/3 y 3/3 y pasa a transferencia.

#### Scenario: QA-06 Reinicio
- **WHEN** falla, solicita ayuda o da una respuesta no verificable durante la racha
- **THEN** la racha vuelve a cero, sin contar incertidumbre como error confirmado.

### Requirement: FR-003 Equivalencias y límites del corrector
El corrector SHALL preservar diferencias gramaticales relevantes, aceptar contracciones y alternativas conocidas y declarar inciertas las reescrituras no verificables. Las respuestas abiertas SHALL utilizar modelo, rúbrica, autoevaluación y consulta manual a ChatGPT, sin calificación automática simulada.

#### Scenario: Alternativa válida desconocida
- **WHEN** una reescritura no coincide con una variante conocida ni con un error explícito conocido
- **THEN** se muestra como incierta, no incorrecta ni dominada.

### Requirement: FR-004 Transferencia correcta
La transferencia SHALL cambiar vocabulario o contexto conservando frases gramaticalmente válidas. Su resolución SHALL comprobar la estructura antes de programar un repaso exitoso.

#### Scenario: QA-07 Resolver transferencia
- **WHEN** responde la tarea equivalente
- **THEN** el sistema reconoce una respuesta verificada y registra el repaso sin aceptar aproximaciones visuales.

### Requirement: FR-005 Pospuestos y pendientes
El sistema SHALL permitir continuar tras posponer una tarea y SHALL mantenerla visible como pendiente, aunque su fecha de repaso sea futura. Posponer SHALL NOT declarar dominio.

#### Scenario: QA-08 Posponer
- **WHEN** pospone un ejercicio difícil
- **THEN** puede continuar y encontrarlo en los pendientes con su fecha programada.

### Requirement: FR-006 Estados y finalización de lección
Cada lección SHALL mostrar Not started, In progress o Completed. La finalización SHALL exigir todas las tareas resueltas o explícitamente pospuestas, autoevaluación escrita y reflexión oral guardadas. El porcentaje SHALL calcularse con lecciones completadas, separado del dominio de ejercicios.

#### Scenario: QA-02 Finalizar primera sesión
- **WHEN** satisface las condiciones de finalización de la primera lección
- **THEN** queda Completed y se conservan sus pendientes de repaso.

#### Scenario: QA-10 Porcentaje
- **WHEN** ha completado una de las 60 lecciones
- **THEN** el avance corresponde a 1/60, no al número de intentos.

#### Scenario: QA-11 Repetir completada
- **WHEN** vuelve a practicar una lección completada
- **THEN** el registro de finalización original permanece y se añaden prácticas nuevas.

### Requirement: FR-007 Continuidad parcial
El sistema SHALL conservar borradores actuales, estados de corrección, reflexión oral, tiempo acumulado y último paso. Continue Learning SHALL abrir la primera lección no completada, retomando un paso pendiente cuando exista.

#### Scenario: QA-09 Salir y retomar
- **WHEN** abandona a mitad, recarga o abre una pestaña nueva
- **THEN** recupera el borrador más reciente, la racha y el paso pendiente sin repetir obligatoriamente tareas ya realizadas.

### Requirement: FR-008 Guardado durable compatible
La actualización SHALL mantener claves, versión e IDs anteriores y extender los datos de forma compatible. El guardado SHALL realizarse durante la interacción y al ocultar o salir; los fallos de almacenamiento SHALL ser visibles y los datos corruptos SHALL NOT sobrescribirse automáticamente.

#### Scenario: Datos anteriores
- **WHEN** carga un archivo o almacenamiento de esquema 1 anterior a la auditoría
- **THEN** conserva completadas, intentos, repasos y preferencias; inicializa únicamente los campos nuevos ausentes.

### Requirement: FR-009 Portabilidad e importación segura
Export Progress SHALL producir un JSON válido y permitir respaldo aun si se bloquea una descarga. Import Progress SHALL validar todo antes de reemplazar datos y SHALL restaurar avance y preferencias incluidas; un archivo inválido SHALL NOT alterar el estado actual.

#### Scenario: QA-16 Ciclo real
- **WHEN** exporta datos de prueba, los sustituye por un progreso vacío e importa el respaldo
- **THEN** recupera el avance, respuestas, pendientes y estados exportados; una segunda importación inválida deja los datos intactos.

### Requirement: FR-010 Audio y preferencias
Por el ajuste posterior del usuario, el audio SHALL utilizar únicamente Sarah en inglés estadounidense (`af_sarah`), sin selector ni voces alternativas. El material, modelos y ayudas al tutor SHALL usar ortografía, vocabulario y expresiones de inglés estadounidense; el documento SHALL declarar `en-US`. SHALL permitir reproducir, repetir, detener y preescuchar Sarah, con 1.0 inicial y 0.85 opcional. Las claves anteriores SHALL conservar compatibilidad aunque las preferencias antiguas se normalicen a Sarah. Cambiar de ejercicio o detener SHALL impedir reproducciones tardías o superpuestas. No se incorporan servicios de generación nuevos.

#### Scenario: QA-12 Audio
- **WHEN** reproduce, repite, cambia velocidad y detiene Sarah
- **THEN** los controles responden, se identifica la voz y no aparecen reproducciones duplicadas; un fallo ofrece texto sin cambiar a otra voz.

### Requirement: FR-011 Subtítulos y traducción
Los subtítulos SHALL estar ocultos sin preferencia previa y SHALL mostrar el texto exacto del audio, incluso las muestras, mediante Show Subtitles / Hide Subtitles. La traducción SHALL ser independiente y ocultarse inicialmente.

#### Scenario: QA-13 Mostrar y ocultar
- **WHEN** alterna subtítulos y vuelve a escuchar
- **THEN** puede escuchar con o sin el texto exacto.

#### Scenario: QA-14 Traducción independiente
- **WHEN** activa o desactiva español
- **THEN** no cambia el estado de los subtítulos.

#### Scenario: QA-15 Preferencias tras recarga
- **WHEN** recarga después de usar Sarah y elegir subtítulos
- **THEN** se recuperan esas preferencias y la velocidad inicial sigue siendo 1.0.

### Requirement: FR-012 Interfaz y entrega verificadas
La marca SHALL mostrar únicamente Inglés Lagunas, con título y favicon correctos, navegación accesible y presentación móvil sin desbordamiento. La entrega SHALL conservar GitHub Pages gratuito y reportar pruebas medidas y limitaciones sin afirmar ensayos no realizados.

#### Scenario: QA-18 Móvil
- **WHEN** se usa una pantalla de 390 px
- **THEN** no hay desplazamiento horizontal del documento, botones superpuestos ni texto esencial cortado.

#### Scenario: Publicación
- **WHEN** finaliza el workflow autorizado
- **THEN** se comprueba el contenido de la URL pública, no solo un estado HTTP o una solicitud de despliegue aceptada.
