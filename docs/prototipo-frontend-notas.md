# Notas para el prototipo frontend

## Stack del repo

El proyecto usa **Next.js** (App Router). El prototipo puede usar estado local, `localStorage` o mocks según [ui-prototyping](../.cursor/rules/ui-prototyping.md).

## Principios de UI (resumen)

- Pantallas con **objetivo y acción principal** claros; evitar “dashboards” genéricos sin tarea.
- Componentes nombrados por **dominio** (ej. `ReservationSummary`, `TravelerAssignmentPanel`), no widgets genéricos repetidos.
- Datos de ejemplo **realistas** (no lorem ni stats falsas sin significado).

## Flujos a cubrir en prototipo (prioridad sugerida)

1. **Login** empresa (y opcionalmente vista admin DAP si se separa por rol).
2. **Lista de reservas** con filtros básicos y estados.
3. **Detalle de reserva** + completar datos de turistas pendientes.
4. **Nueva reserva / pre-reserva incompleta** (cupo bloqueado, datos parciales).
5. **Compra anticipada** (cantidad, sin fecha obligatoria al inicio).
6. **Asignación posterior** de entradas anticipadas a fecha/turno.
7. **Personal de empresa** (alta simple con rol).
8. **Vista de trazabilidad** (solo lectura): quién hizo qué y cuándo (mock).

## Integración

- Simular impacto en **cupos** al confirmar reservas.
- No implementar integraciones reales (RECNAT, pagos) en esta etapa.

## Documentación relacionada

- [PRD-v0.1-modulo-prestadores.md](./PRD-v0.1-modulo-prestadores.md)
- [roles-y-trazabilidad.md](./roles-y-trazabilidad.md)
- [alcance-y-limites.md](./alcance-y-limites.md)
