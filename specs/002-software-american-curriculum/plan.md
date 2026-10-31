# Plan

Reutilizar React, TypeScript, Vite, JSON editorial, tareas generadas, Sarah estadounidense y localStorage versión 1. Sin nuevas dependencias.

1. Reescribir `src/lesson-data.json` como unidades coherentes: ocho campos existentes, traducción y dos distractores; metadato de contexto para verificar 42/18. Mantener orden y gramática progresiva.
2. Reutilizar reglas de conectores y dar ejemplos generales o tecnológicos con el mismo significado; adaptar `src/content.ts` para instrucciones ficticias apropiadas al contexto.
3. Limitar transferencia a cambios seguros de contexto, tiempos y detalles. Evitar sustituciones que alteren matices técnicos o traducciones.
4. Añadir revisión editorial opcional en estados e intentos de corrección. `reconcileProgress` conserva historial/borradores/completadas, deja contenido anterior pendiente y evita reinicios posteriores. Evaluaciones nuevas excluyen intentos de revisión antigua. Campos nuevos opcionales y validados.
5. Probar IDs/70-30, contenido emparejado, transferencia, importación antigua, rachas, medición nueva e idempotencia. Ejecutar checks, navegador y workflow Pages.

Riesgos: un borrador anterior puede necesitar edición; se conserva y se avisa. Los snapshots históricos se conservan como historia, sin recalcularlos retroactivamente. Sin borrados de producción durante pruebas.
