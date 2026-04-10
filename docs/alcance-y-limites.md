# Alcance, límites y evolución

Resumen operativo derivado del PRD v0.1 para alinear prototipo y backend futuro.

## Dentro de alcance (etapa actual)

| Área | Qué cubre |
|------|-----------|
| Auth empresarial | Login, recuperación de contraseña, usuarios creados por ANP, habilitar/deshabilitar usuarios |
| Empresas | Alta de prestadoras autorizadas, habilitar/deshabilitar empresa, 1 usuario operativo inicial |
| Reservas | Multiturista, estados (TBD), consulta/edición/cancelación/reprogramación (políticas TBD) |
| Pre-reserva incompleta | Cupo bloqueado ya; datos personales, documentación y seguro después |
| Compra anticipada | Sin fecha ni datos completos al momento; luego asignación y completado |
| Lotes / volumen | Compra en volumen; descuentos y reglas TBD |
| Beneficios por volumen | Reglas por actividad (ej. N→1 libre); entrada libre con datos antes de uso |
| Precio histórico | Entradas pagadas consideradas saldadas aunque cambie el precio vigente |
| Personal empresa | Registro de roles (guía, arriero, porteador, etc.) |
| Trazabilidad | Usuario, timestamp, empresa, historial de cambios; sin borrado destructivo |

## Fuera de alcance (explicitamente)

- QR ingreso/egreso (ej. Laguna)
- Evacuaciones
- Mulas (control)
- Helicóptero (vuelos)
- Cobranza RECNAT integrada
- Control de deuda
- Horas de vuelo
- Declaraciones juradas empresas

## Pendiente de definición (iteraciones PRD)

- Datos mínimos de empresa y de usuario
- Estados de reserva
- Vencimiento de pre-reservas incompletas
- Reglas exactas de descuentos y promociones por volumen
- Políticas de cancelación y reprogramación

## Etapas futuras (visión documentada)

### Operación del parque

Digitalización de procesos hoy en papel/planilla; guardaparques; parte diario; check-in/out QR; evacuaciones; personal de empresas con credenciales QR; mulas (chip, sanitario, cuarentena, descansos); horas de vuelo helicóptero.

### Cobranza e integraciones

Deudas; cobro digital (canon empresas, mulas, vuelos privados, multas, etc.); ePagos; RECNAT y SIDICO (pagos automáticos, consulta de deudas, bloqueos).
