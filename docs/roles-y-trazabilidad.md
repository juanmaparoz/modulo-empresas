# Roles, permisos y trazabilidad

## Roles

### Administrador ANP (DAP)

- Registrar empresas prestadoras.
- Crear usuarios de empresa (inicialmente un usuario por empresa).
- Habilitar / deshabilitar empresas.
- Consultar **todas** las operaciones del módulo (vista de auditoría / supervisión).

### Usuario empresa (prestador)

- Realizar y gestionar reservas (multiturista).
- Comprar entradas (incl. anticipada y por volumen / lotes según reglas).
- Completar datos de turistas cuando corresponda.
- Gestionar cancelaciones y reprogramaciones (sujeto a políticas futuras).
- Registrar personal de la empresa (rol/puesto).

> Nota PRD: en versiones futuras se evalúa **múltiples usuarios por empresa**. El prototipo puede asumir 1 usuario por empresa salvo que se defina lo contrario.

## Trazabilidad (requisitos no funcionales)

Cada operación relevante debe poder reconstruirse con:

| Dato | Descripción |
|------|-------------|
| Usuario | Quién ejecutó la acción |
| Momento | Fecha y hora |
| Empresa | Prestador asociado a la reserva u operación |
| Historial | Cambios sobre entidades (versionado / log; nada se “borra” del sistema) |

Implicaciones para UI de prototipo:

- Mostrar **empresa** y **usuario** en cabeceras de detalle de reserva y en listados de auditoría simulados.
- Evitar flujos que sugieran “eliminar” registros sin dejar rastro; preferir estados o historial.

## Integración Turnero

- Las reservas empresariales **consumen cupos** del mismo universo de disponibilidad que el turnero general (comportamiento a reflejar en mocks: stock/cupo disminuye al confirmar).
