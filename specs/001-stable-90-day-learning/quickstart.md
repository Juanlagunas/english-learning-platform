# Validación de cierre

Desde el repositorio, ejecutar `npm run typecheck`, `npm run lint`, `npm test` y `npm run build`. El workflow ya ejecuta auditoría de dependencias y despliega Pages.

Abrir un servidor estático con el build bajo `/english-learning-platform/` en un puerto de prueba nuevo. Usar los escenarios QA-01–QA-18 del contrato OpenSpec y registrar observación/resultado en `audit-report.md`. Para QA-16 exportar datos ficticios, importar un archivo vacío válido y luego el respaldo; verificar que un JSON inválido no cambie los datos. No usar almacenamiento del sitio público para esos borrados.

Después de publicar, comprobar contenido real, nombre, continuación y una reproducción de Sarah en la URL pública. Registrar las limitaciones de reinicio completo del navegador y cualquier herramienta no disponible, en lugar de marcar pruebas ausentes como aprobadas.
