# Proposal

## Why
La auditoría final exige continuidad real durante el programa existente. La inspección encuentra borradores y pasos parciales no recuperados, rachas inciertas y sustituciones de transferencia que requieren pruebas y correcciones antes del cierre.

## What Changes
- Corregir guardado, recuperación parcial y estados visibles de lección sin perder datos previos.
- Unificar validación y verificar repetición, transferencia y repasos pendientes.
- Probar exportación/importación real, audio existente, navegación y móvil.
- Mantener plan y evidencia con Spec Kit, sin dependencias de ejecución nuevas.

## Capabilities

### New Capabilities
- `stable-learning`: formalizar y verificar el contrato existente de aprendizaje estable y continuidad para 90 días.

### Modified Capabilities
Ninguna especificación previa: `openspec list --specs` devuelve inventario vacío antes de esta adopción.

## Impact
Aplicación React/Vite existente, validación, estado local, componentes de práctica, pruebas y documentación. La publicación sigue usando el workflow actual y la cuenta autorizada Juanlagunas.
