# Feature Specification: Cierre estable de Inglés Lagunas

**Feature Branch**: `001-stable-90-day-learning`  
**Created**: 2026-10-30  
**Status**: Approved scope from user  
**Input**: Auditoría final y aplicación de OpenSpec y Spec Kit.

## User Scenarios & Testing

### User Story 1 - Recuperar el estudio (Priority: P1)
Como alumno retomo respuestas, rachas y práctica parcial sin perder lo anterior.
**Independent Test**: QA-09, QA-15 y QA-16 del contrato normativo.
**Acceptance Scenarios**: recuperar un borrador más nuevo que el último intento; exportar, vaciar datos de prueba e importar; rechazar archivo inválido sin modificar datos.

### User Story 2 - Corregir y repasar honestamente (Priority: P1)
Como alumno distingo error, incertidumbre, lección realizada y dominio.
**Independent Test**: QA-03 a QA-08, QA-10 y QA-11.
**Acceptance Scenarios**: tres errores, tres aciertos seguidos, reinicio de racha y transferencia correcta; pendientes visibles después de completar o posponer.

### User Story 3 - Escuchar y continuar el programa (Priority: P2)
Como alumno uso las lecciones existentes, únicamente Sarah en inglés estadounidense, subtítulos opcionales y pantalla móvil.
**Independent Test**: QA-01, QA-02 y QA-12 a QA-18.
**Acceptance Scenarios**: primera y última sesión, cuatro duraciones, reproducción sin duplicados, ayudas independientes y ausencia de desbordamiento móvil.

### Edge Cases
Almacenamiento denegado o corrupto; archivo antiguo; respuesta incierta en una racha; lección repetida; todos los cursos completados; modelo de voz no disponible; cambio de pestaña durante práctica; evaluación parcial.

## Requirements

### Functional Requirements
El contrato normativo único FR-001–FR-012 y sus escenarios se mantiene en [OpenSpec stable-learning](../../openspec/specs/stable-learning/spec.md). El cambio se archivó el 31-oct-2026; el contrato enlazado es la versión vigente. Spec Kit no duplica ese texto.

### Key Entities
Lección, borrador, estado de corrección, finalización, práctica oral, repaso, evaluación, preferencias y respaldo. Los campos técnicos se definen en `data-model.md`.

## Success Criteria
- **SC-001**: Se pueden realizar las 60 sesiones existentes sin crear contenido adicional innecesario.
- **SC-002**: El avance de una lección entre 60 es 1/60 y sus pospuestos siguen identificados.
- **SC-003**: El respaldo restituye los datos de prueba completos, y el archivo inválido no los altera.
- **SC-004**: Los 18 escenarios tienen evidencia o una limitación explícita; ningún pendiente crítico se presenta como cerrado.

## Assumptions
Se conserva la arquitectura actual y la voz Sarah elegida por el usuario. No se promete continuidad de datos si el usuario borra manualmente el almacenamiento sin respaldo. El navegador principal del usuario no se cerrará para una prueba destructiva; se comprobarán recargas y cierre/apertura de pestañas de prueba, indicando ese límite.
