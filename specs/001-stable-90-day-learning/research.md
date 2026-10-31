# Evidencia y decisiones

## Baseline
Medido: OpenSpec 1.13.2 y Specify CLI 1.0.12.dev0 instalados; repositorio limpio antes de inicializar. Inventario OpenSpec vacío y ausencia de `.specify/` verificados antes de crear ambos. No existen hooks de extensiones.

## Decisiones
- Mantener ambos métodos complementarios: contrato OpenSpec y plan/tareas Spec Kit. Alternativa rechazada: dos copias normativas editadas por separado.
- Mantener localStorage y esquema 1 con extensiones compatibles. Alternativa rechazada: IndexedDB o migración destructiva, innecesarias.
- Centralizar corrección y comprobación de realización. Alternativa rechazada: preservar dos validadores que divergen ante respuestas inciertas.
- Persistir interacción y puntos de salida con acumulación de práctica por minuto. Alternativa rechazada: escribir un registro nuevo por segundo o confiar solo en desmontaje de React.
- Probar en un origen localhost exclusivo, sin borrar almacenamiento del sitio público. Alternativa rechazada: cerrar el navegador principal del usuario.

## Hallazgos por inspección a reproducir
`Exercise.tsx` prioriza el intento sobre el borrador; `Practice.tsx` reinicia paso y reflexión oral; `learning.ts` mantiene racha ante incertidumbre; `engine.ts` puede duplicar un intento ignorado; `transfer.ts` sustituye subcadenas dentro de verbos. Los resultados de pruebas, no esta inspección, determinarán su cierre.
