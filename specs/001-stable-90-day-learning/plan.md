# Implementation Plan: Cierre estable de 90 días

**Branch**: `001-stable-90-day-learning` · 2026-10-30 · [Spec](spec.md)

## Summary
Corregir defectos reproducidos de continuidad, corrección y navegación, conservando componentes y contenido. La matriz de aceptación está en el contrato OpenSpec; el backlog único está en `tasks.md`.

## Technical Context
TypeScript 5.9, React 19, Vite 7, Vitest existente, localStorage e integración Kokoro existente; únicamente Sarah estadounidense por el ajuste del usuario. Sitio estático público en GitHub Pages. Sin nuevas dependencias. Datos limitados al programa actual de 60 sesiones, siete evaluaciones y práctica durante 90 días.

## Constitution Check
Pasan I–V: alcance autorizado, claves y esquema conservados, incertidumbre explícita, sin servicios nuevos, pruebas trazables. Se reevalúan al terminar implementación. No se requieren excepciones.

## Project Structure
- `src/grading.ts`: normalización y evaluación común para eliminar criterios divergentes.
- `src/engine.ts`, `src/types.ts`: extensiones compatibles, estados/porcentaje y operaciones de progreso verificadas.
- `src/useProgress.ts`: guardado inmediato con estado React, protección de errores y lectura de cambios locales entre pestañas.
- `src/Exercise.tsx`, `src/Practice.tsx`, `src/App.tsx`: borradores, pasos, reflexión oral, evaluación parcial y navegación sin rehacer el diseño.
- `src/transfer.ts`: sustituciones limitadas a palabras/frases verificadas.
- `tests/`: regresiones discriminantes y contratos de compatibilidad; navegador mediante herramientas ya disponibles.

## Phase 0: Research
Ver `research.md`. Se reutilizan arquitectura, dependencias y versiones locales; no hay investigación delegada ni elección de stack nueva.

## Phase 1: Design
Ver `data-model.md`, `contracts/ui.md` y `quickstart.md`. La persistencia centraliza escritura antes de actualizar la vista y conserva registros previos. Las lecciones derivan realización de los estados actuales, no de un acierto histórico aislado. Los campos nuevos son opcionales para datos antiguos.

## Migration and Rollback
Leer esquema 1, completar solo campos ausentes y conservar IDs y preferencias. Archivar especificación al terminar. Revertir código no borra campos nuevos ni claves existentes; el JSON exportado permite recuperar el estado. Nunca se prueban borrados sobre el progreso de producción del usuario.

## Complexity Tracking
Sin excepciones. No se incorporan motores de estado, almacenamiento externo o librerías de pruebas nuevos.
