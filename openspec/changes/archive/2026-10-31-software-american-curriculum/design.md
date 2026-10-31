# Design

## Context
Ajuste editorial autorizado sobre el programa estático existente.
## Goals / Non-Goals
42 contextos tecnológicos, 18 generales. Sin funciones, servicios, pantallas ni dependencias nuevas.
## Decisions
Plan y tareas únicos en `specs/002-software-american-curriculum/`. Una revisión editorial explícita acompaña los estados e intentos nuevos; la reconciliación conserva historial y completadas, reinicia únicamente la verificación vigente y deja pendientes visibles.
## Risks / Trade-offs
Los borradores antiguos se conservan para editar con el nuevo enunciado; un mensaje explica su origen. Se mantienen separadas las mediciones históricas y nuevas. La transferencia cambia contexto/detalles seguros sin convertir issue, blocker y risk en equivalentes.
## Migration Plan
Leer versión 1, reconocer estados sin revisión como anteriores y reconciliar una sola vez. Pruebas con respaldo real previo, recarga idempotente y evaluaciones.
