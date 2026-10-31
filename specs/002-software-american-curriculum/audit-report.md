# Ajuste curricular — evidencia de cierre

Fecha: 2026-10-31. Contexto: rama `002-software-american-curriculum`; pruebas locales con datos ficticios en origen localhost exclusivo. Cuenta de publicación autorizada: Juanlagunas, repositorio público english-learning-platform.

## Contenido revisado

**Medido** en `src/lesson-data.json` y `tests/curriculum.test.ts`: 60 lecciones, 12 semanas, mismos IDs de sesión, seis ejercicios por sesión y siete formularios de evaluación. El metadato editorial identifica 42 contextos tecnológicos y 18 generales. Las primeras seis semanas tienen tres tecnológicos/dos generales; las siguientes, cuatro/uno. Se mantiene gramática progresiva A2–B1, cuatro duraciones, listening, escritura, construcción, corrección, conversación y repaso existentes.

Los contextos tecnológicos cubren actualizaciones y reportes, roles de liderazgo técnico, APIs y contratos, microservicios, integraciones, revisión de código, pruebas, despliegue/reversión, incidentes, dependencias, estimación, alcance, prioridades y negociación respetuosa. Los generales cubren vecinos, comida, compras, actividades, planes, transporte, historias personales y preguntas de seguimiento. No hay nombres de empresas reales ni datos internos.

**Revisión editorial:** se leyeron las 60 unidades emparejadas (diálogo, interpretación, dos distractores, cloze, error/modelo, explicación y español), los modelos generados de cloze/rewrite y las 60 transferencias auditivas con interpretación y español. Las sustituciones se limitan a detalles/contextos compatibles. Se preservan los matices de weekly update/status report y risk/issue/blocker; no se sustituyen entre sí. Ejemplos generales y tecnológicos de conectores comparten sus reglas. Las consignas orales de entrevistas ya no incluyen la respuesta dentro de la pregunta.

Se corrigieron defectos encontrados durante esta comprobación: un ejercicio que solo cambiaba puntuación aceptada por normalización; un ejemplo causal ambiguo sustituido por un error verificable de modal; concordancia española al cambiar API/servicio y gráfica/icono; claves/acento en reemplazos españoles. Las pruebas de la salida completa y detalles concretos impiden volver a publicar `undefined` o esas discordancias.

## Compatibilidad

La clave `compass-progress-v1`, esquema 1 e IDs permanecen. `contentRevision` es un campo opcional en estados e intentos de corrección: archivos anteriores siguen siendo válidos. Se preservan completadas, intentos globales, borradores, segundos, repasos y snapshots históricos. Los ejercicios anteriores quedan pendientes de nueva comprobación, con aviso explicando el cambio; no conservan rachas ni dominio falsos. Los borradores se mantienen para editar conforme al nuevo enunciado. Los intentos anteriores no puntúan una evaluación nueva ni se cuentan como aciertos nuevos al completar trabajo revisado pospuesto; snapshots anteriores no se recalculan. La reconciliación se guarda al cargar y es idempotente. Fallos de almacenamiento mantienen el aviso/exportación existentes.

**Medido:** prueba con el respaldo real de QA ficticia exportado antes del ajuste (fixture `tests/fixtures/pre-software-progress.json`), verificando conservación de historia/borradores/completadas, reinicio honesto, exclusión de intentos anteriores y segunda lectura sin reinicio adicional. Un borrador nuevo de la revisión actual no se considera antiguo. Las claves y preferencias de Sarah/subtítulos siguen intactas.

## Navegador

- Origen local con avance de la versión anterior: conserva 1/60, 59 pendientes y 1.7%; nueva lección técnica y pendientes de contenido revisado visibles.
- Listening técnico: aviso de actualización, respuesta nueva y transferencia aceptadas; después de recargar sigue resuelta. Sarah terminó la frase nueva de resultados de pruebas, 4.85 s, media readyState 4. Español independiente y texto inglés correspondiente.
- Listening general: nuevo diálogo de compras/cena, Sarah finalizada en 4.075 s, readyState 4; interpretación correcta abre transferencia. Versión final de transferencia muestra pasta/almuerzo y traducción correspondiente, no arroz/cena.

La transferencia general definitiva pasta/almuerzo también terminó con Sarah (7.475 s, readyState 4), su traducción se mostró coherente y su respuesta fue aceptada. Se abrió la lección avanzada de riesgo frente a problema actual y su reescritura con might; móvil 390×844: ancho del documento 390, contenido revisado visualmente sin superposición observada. No hubo errores de consola capturados. El viewport temporal fue retirado. La publicación se registra después del despliegue. No se afirma haber escuchado manualmente los 60 audios ni realizado 90 días transcurridos: se verifica el componente común, integridad editorial y los modelos de todas las tareas. Sarah sigue siendo una voz sintética estadounidense; primera descarga y rendimiento dependen del dispositivo, sin servicios ni dependencias nuevos.

## Checks

Medido en la última ejecución conjunta: `npm run typecheck` correcto; `npm run lint` correcto; `npm test` **68/68** en ocho archivos; `npm run build` correcto (bundle principal `index-CzbZgZVu.js`). `git diff --check` correcto. OpenSpec validó cambio y contrato previo estrictamente; prerrequisitos Spec Kit presentes. No se añadieron dependencias ni cambios al workflow, backend, APIs, servicios o pantallas.

## Publicación

Primera publicación medida: commit `8c8cce82367010dbff8b757b8268db41513d0643`, [workflow 41229301208](https://github.com/Juanlagunas/english-learning-platform/actions/runs/41229301208), build/checks/deploy correctos. La URL pública cargó el currículo nuevo y conservó 1/60, 59 pendientes y 1.7%. El diálogo técnico nuevo terminó con Sarah, 4.85 s y readyState 4.

Esa lectura encontró una respuesta múltiple antigua que ya no era una opción visible pero dejaba activo Check answer. Se corrigió la inicialización del control: el borrador histórico se conserva en los datos, mientras la vista exige elegir una opción actual. La prueba de regresión confirma el botón deshabilitado sin opción visible seleccionada. Se vuelven a ejecutar los gates y se verifica el despliegue de esta corrección antes de cerrar.
