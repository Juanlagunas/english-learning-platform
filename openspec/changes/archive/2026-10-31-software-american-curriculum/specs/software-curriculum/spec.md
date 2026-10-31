# Currículo de ingeniería de software

## Purpose
Practicar conversaciones de ingeniería de software en inglés estadounidense con fundamentos conversacionales generales, sin garantizar un nivel CEFR.

## ADDED Requirements

### Requirement: SCUR-001 Proporción y progresión
El programa SHALL mantener los 60 IDs de lección, 12 semanas, IDs de ejercicios y siete evaluaciones. SHALL contextualizar 42 lecciones en tecnología y 18 en inglés general; las primeras seis semanas SHALL tener tres lecciones tecnológicas y dos generales por semana, y las siguientes seis cuatro tecnológicas y una general. SHALL conservar progresión gramatical A2–B1, listening, gramática, construcción, corrección, escritura, oralidad y repaso.

#### Scenario: Inventario 70/30
- **WHEN** se inspecciona el currículo completo
- **THEN** existen 42 contextos tecnológicos y 18 generales con las mismas identidades anteriores y seis ejercicios por lección.

### Requirement: SCUR-002 Lenguaje natural y coherencia
Diálogos, modelos y vocabulario SHALL ser inglés estadounidense natural y ficticio. SHALL incluir seguimiento, APIs, microservicios, integración, pruebas, despliegues, incidentes, estimaciones, liderazgo y negociación en oraciones completas. SHALL distinguir weekly update (avance conversacional), status report (informe estructurado), blocker (impedimento actual), issue (problema actual) y risk (posibilidad futura). Cada diálogo SHALL tener interpretación correcta, dos distractores falsos, traducción fiel y transferencia coherente. Los ejemplos de conectores SHALL respetar el contexto general o tecnológico de la lección.

#### Scenario: Comprensión y transferencia
- **WHEN** se abre una lección de cada contexto y su transferencia
- **THEN** se pueden escuchar y resolver con el modelo correcto, texto exacto y traducción independiente, sin intercambiar risk, issue o blocker como sinónimos.

### Requirement: SCUR-003 Actualización compatible
La actualización SHALL conservar claves, esquema 1, IDs, completadas, intentos, borradores, repasos y snapshots históricos. Un estado perteneciente al contenido anterior SHALL quedar pendiente de nueva comprobación, con explicación del cambio y sin conservar una racha o dominio falsos. Su historial SHALL permanecer exportable. Los intentos anteriores SHALL NOT puntuar una evaluación nueva; los intentos nuevos SHALL identificar la revisión editorial correspondiente. Recargar datos ya actualizados SHALL NOT reiniciar nuevamente la práctica.

#### Scenario: Historial anterior
- **WHEN** se carga o importa progreso anterior con completada, borrador, racha y evaluación
- **THEN** se conservan los registros históricos, el ejercicio cambiado queda pendiente y una segunda recarga mantiene su nuevo estado sin reinicio adicional.

#### Scenario: Medición nueva
- **WHEN** se responde una evaluación revisada tras importar historial anterior
- **THEN** la calificación usa únicamente intentos verificables del contenido actual y conserva snapshots históricos.
