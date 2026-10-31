# Datos y compatibilidad

La raíz conserva `version: 1` y la clave `compass-progress-v1`.

- `lessonProgress[id]`: inicio, último paso, reflexión oral y segundos acumulados. Ausente en datos anteriores equivale a ningún metadato nuevo; un registro antiguo de finalización conserva Completed.
- `assessmentProgress[id]`: paso, respuestas realizadas, reflexión oral y autoevaluaciones de una evaluación parcial.
- `drafts[taskId]`: texto actual, incluso vacío. Prevalece sobre el intento anterior al recuperar un campo.
- `exerciseStates`: conserva las fases actuales. REVIEW con respuesta de transferencia correcta permite realización; una fecha histórica de dominio no reemplaza el estado actual. `deferred` permite realizar la lección pero mantiene pendiente.
- `completed[id]`: registro original de realización; repetir no lo elimina ni lo reemplaza por una sesión incompleta.
- `practice`: segundos reales agrupados por minuto y lección para evitar crecimiento por cada tic de guardado.
- `preferences` opcional en exportaciones: instantánea de las claves de voz, motor y subtítulos existentes. Archivos anteriores sin este campo mantienen preferencias actuales.

Validación: tipos y límites de campos nuevos; el archivo completo se valida antes de aplicarse. Valores sin puntuación verificable se representan como `null`, no como cero. Las extensiones ausentes se inicializan al leer. Las claves de voz y subtítulos no se renombran.
