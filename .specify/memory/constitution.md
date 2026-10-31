# Constitución de Inglés Lagunas

Versión 1.0.0 · adoptada 2026-10-30.

## I. Alcance y sencillez
El proyecto MUST aplicar KISS, YAGNI y DRY. Esta entrega corrige la auditoría de cierre autorizada; no reconstruye la aplicación ni incorpora servicios, cuentas o dependencias de ejecución nuevas.

## II. Continuidad y compatibilidad
La aplicación MUST conservar `compass-progress-v1`, esquema 1, IDs de contenido y claves de preferencias existentes. Las extensiones se incorporan con valores por defecto compatibles. Importaciones inválidas MUST dejar intactos los datos anteriores. Guardado fallido MUST ser visible, no presentarse como éxito.

## III. Corrección honesta
El corrector MUST aceptar solo equivalencias verificadas, distinguir incierto de incorrecto y exigir tres aciertos consecutivos cuando se entra a repetición. Realizar una lección MUST distinguirse de dominar todos sus ejercicios. Los pospuestos permanecen pendientes.

## IV. Privacidad y gratuidad
El sitio MUST seguir público y estático en GitHub Pages; sin backend, autenticación, pagos o envío de respuestas a servicios externos. Los escenarios son ficticios. Por los ajustes del usuario del 31-oct, se utiliza exclusivamente Sarah/Kokoro con inglés estadounidense en voz, ortografía y vocabulario; sin voces alternativas ni nuevos proveedores.

## V. Evidencia de cierre
Cada defecto importante MUST tener reproducción, corrección y verificación trazable. Los escenarios de navegador no ejecutados MUST declararse como tales. La especificación de comportamiento pertenece a OpenSpec; Spec Kit mantiene plan y tareas enlazados, sin duplicar el contrato. El cierre requiere typecheck, lint, tests, build y lectura del despliegue publicado.

## Gobernanza
Las instrucciones del usuario prevalecen. La fuente vigente de aceptación es el contrato OpenSpec enlazado desde `specs/001-stable-90-day-learning/spec.md`. Cambios de alcance requieren una necesidad real dentro de la auditoría. No se reinterpretan pruebas ausentes como aprobadas.
