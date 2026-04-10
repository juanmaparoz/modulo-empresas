# PRD — Sistema Turnero · Módulo Prestadores

**Producto:** Sistema Turnero – Módulo Prestadores  
**Ámbito:** Áreas Naturales Protegidas  
**Versión:** 0.1  
**Estado:** Borrador inicial para iteración con stakeholders  

---

## 1. Contexto y problema

El sistema actual de venta de entradas (Turnero) del Parque Provincial Aconcagua está orientado principalmente a turistas individuales. Una parte relevante de las actividades dentro del parque la gestionan **empresas prestadoras de servicios turísticos**, con dinámicas distintas al visitante individual.

### Situación actual de las empresas

- Gestionan **contingentes** de turistas.
- Compran **múltiples entradas en simultáneo**.
- Necesitan **asegurar cupos con anticipación**.
- Frecuentemente **no disponen de todos los datos personales** al momento de reservar.

### Limitaciones del sistema actual

El sistema no contempla estas necesidades operativas, lo que obliga a procesos manuales o soluciones informales. Consecuencias:

- Sobrecarga administrativa para las empresas.
- Mayor riesgo de errores en reservas.
- Falta de trazabilidad clara de operaciones de prestadores.
- Pérdida de eficiencia en la gestión de cupos.

**Propuesta:** desarrollar un **Módulo de Empresas Prestadoras**.

---

## 2. Objetivo del producto

### Para empresas prestadoras

- Acceso mediante **login propio**.
- **Gestionar reservas** para múltiples turistas.
- **Comprar entradas anticipadamente**.
- Comprar **paquetes de entradas (lotes)**.
- **Pre-reservar cupos** sin completar datos personales.
- Acceder a **beneficios por volumen** de compra.
- Gestionar **cancelaciones y reprogramaciones**.
- **Administrar reservas de forma centralizada**.

### Para la Dirección de Áreas Protegidas (DAP)

- **Registrar** empresas prestadoras.
- **Administrar usuarios** de empresa.
- **Controlar** operaciones realizadas por empresas.
- Mantener **trazabilidad completa** de las reservas.

---

## 3. Alcance del proyecto

### 3.1 Incluido (IN)

#### A. Autenticación y acceso empresarial

- Registrar empresas prestadoras autorizadas.
- Registrar usuarios asociados a cada empresa.
- Login para empresas.
- Recuperación de contraseña.
- Habilitar o deshabilitar usuarios de empresa.
- **Cada empresa tendrá inicialmente un único usuario operativo** (múltiples usuarios en versiones futuras).
- Los usuarios serán creados inicialmente por la DAP.

#### B. Pre-reserva incompleta

- Reservas **sin completar** todos los datos personales del turista.

Datos completables posteriormente:

- Datos personales del visitante.
- Documentación.
- Datos de seguro.

Comportamiento requerido:

- **Bloquear el cupo de inmediato**.
- Permitir completar datos después.

Las condiciones de vencimiento se definirán en iteraciones posteriores.

#### C. Compra anticipada de entradas

- Adquirir entradas anticipadamente **sin** asignar de inmediato fecha específica ni datos completos de visitantes.
- Compra de **múltiples entradas** en una misma operación.
- Posibilidad de **volumen** y **descuentos por volumen** (reglas en iteraciones posteriores).

Posteriormente las entradas podrán:

- Asignarse a fecha y horario disponibles.
- Completarse con datos personales y seguro.

#### D. Beneficios por volumen

- Para ciertas actividades: beneficios por volumen (ej.: cada N entradas → 1 entrada adicional liberada).
- Reglas configurables por actividad (detalle en etapas posteriores).
- Las entradas liberadas deben registrar datos personales del visitante **antes del uso**.

#### E. Gestión de reservas

Las empresas podrán:

- Consultar, modificar, cancelar y reprogramar reservas.

Políticas de cancelación/reprogramación: etapas posteriores.

#### F. Manejo de diferencias de precio

- Entradas adquiridas con un precio distinto al vigente deben poder considerarse **pagadas en su totalidad** (compra anticipada, venta por lote).

#### G. Registro de personal de empresas

- Carga de personas que trabajan con la empresa y **puesto** que cumplen (guías, arrieros, porteadores).

### 3.2 Fuera de alcance (OUT — etapa actual)

- Control ingreso/egreso QR (ej. actividad Laguna).
- Registro de evacuaciones.
- Control de mulas.
- Registro de vuelos de helicóptero.
- Cobranzas integradas con RECNAT.
- Sistema de control de deuda.
- Registro de horas de vuelo.
- Declaraciones juradas de empresas.

---

## 4. Módulos del sistema (denominación)

- Módulo de Empresas Prestadoras  
- Gestión de Usuarios de Empresa  
- Gestión de Reservas Empresariales  
- Compra Anticipada de Entradas  
- Venta por Lotes  
- Gestión de Beneficios por Volumen  

---

## 5. Gestión de empresas

- Registrar empresas prestadoras autorizadas.
- Datos básicos para habilitación: **a definir en próximas iteraciones**.
- Un usuario de acceso por empresa en la versión inicial.
- Habilitar / deshabilitar empresas.

---

## 6. Gestión de usuarios de empresa

- Un usuario operativo por empresa (inicialmente), creado por la DAP al habilitar la empresa.
- Datos del usuario: **a definir en próximas iteraciones**.
- Login; el sistema debe registrar **qué usuario realizó cada operación**.

---

## 7. Gestión de reservas empresariales

- Reservas para múltiples turistas.
- Estados posibles: **a definir en próximas iteraciones**.

---

## 8. Gestión de beneficios por volumen

- Aplicación automática según reglas configurables por actividad (ejemplo: N entradas → 1 adicional liberada).

---

## 9. Usuarios y roles

### Administrador ANP

- Registrar empresas.
- Crear usuarios de empresa.
- Habilitar / deshabilitar empresas.
- Consultar todas las operaciones.

### Usuario empresa

- Reservas, compra de entradas, gestión de reservas, completar datos de turistas.

---

## 10. Trazabilidad

Registrar:

- Usuario que realizó cada operación.
- Fecha y hora.
- Empresa asociada a cada reserva.
- Histórico completo de modificaciones.

**Nada debe eliminarse del sistema** (eliminación lógica / histórico, no borrado físico según diseño de implementación).

---

## 11. Consideraciones técnicas

- Integración con el **Turnero existente**.
- Las reservas empresariales impactan la **disponibilidad de cupos**.
- Arquitectura **extensible** para etapas posteriores.

---

## 12. Evolución futura (referencia)

Resumido en [alcance-y-limites.md](./alcance-y-limites.md): operación del parque (QR, evacuaciones, mulas, helicóptero, credenciales, etc.) y cobranza digital / integraciones (RECNAT, SIDICO, ePagos, deudas).

---

## Modelo de datos

Ver [modelo-datos-v0.1.md](./modelo-datos-v0.1.md). El PRD original citaba “Modelo de datos V0.1”; el detalle de entidades y relaciones se incorporará cuando esté disponible.
