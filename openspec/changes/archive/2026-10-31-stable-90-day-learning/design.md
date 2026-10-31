# Design

## Context
Ver `proposal.md` para motivación y `specs/stable-learning/spec.md` para el contrato.

## Goals / Non-Goals
Reutilizar la aplicación estática y corregir continuidad y aprendizaje. Sin reconstrucción, servicios nuevos ni cambios destructivos de datos.

## Decisions
El plan técnico, modelo y backlog únicos se mantienen en `specs/001-stable-90-day-learning/plan.md`, `data-model.md` y `tasks.md` en la raíz del repositorio. Este documento enlaza esas decisiones para no duplicarlas.

## Risks / Trade-offs
El navegador puede borrar almacenamiento o denegar cuota: se conserva respaldo JSON y aviso. El audio sigue dependiendo del dispositivo y de la descarga inicial del modelo existente. No se afirma una prueba de 90 días transcurridos: se verifica el contrato para ese uso y se explican límites.

## Migration Plan
Se conserva esquema 1, IDs y claves. Solo se inicializan campos ausentes. La publicación y el rollback siguen el workflow actual.
