# Sistema de Gestión de Entradas - ANP (Áreas Naturales Protegidas)

## Descripción General

Sistema web para la gestión de entradas a Áreas Naturales Protegidas, permitiendo a empresas prestadoras comprar entradas, asignarlas a visitantes y gestionar su personal operativo.

---

## Roles del Sistema

### 1. Super Admin
Administrador principal del sistema con acceso total.

**Funcionalidades:**
- Crear administradores ANP
- Ver listado de administradores
- Habilitar/deshabilitar administradores

### 2. Admin ANP (Administración de Áreas Naturales Protegidas)
Gestiona empresas prestadoras y configuración de lotes.

**Funcionalidades:**
- **Empresas habilitadas:**
  - Registrar nuevas empresas prestadoras
  - Ver listado de empresas
  - Gestionar usuarios de cada empresa (crear, habilitar/deshabilitar)
  - Ver y confirmar staff de empresas
- **Lotes de entradas:**
  - Crear lotes predefinidos por actividad con descuentos
  - Ver listado de lotes disponibles

### 3. Usuario de Empresa (Empresa Prestadora)
Usuarios de empresas habilitadas para operar en las ANP.

**Funcionalidades:**
- **Compra de entradas:**
  - Comprar por lote (con descuento predefinido)
  - Comprar de forma personalizada (cantidad libre)
  - Opcionalmente definir fecha de visita
- **Gestión de entradas:**
  - Ver compras realizadas ("Compras y asignar")
  - Asignar entradas a visitantes con sus datos personales
  - Ver entradas asignadas agrupadas por actividad
- **Gestión de staff:**
  - Registrar personal (guías, arrieros, etc.)
  - Ver listado de staff con filtros y búsqueda
  - Habilitar/deshabilitar personal
- **Perfil:**
  - Editar datos personales (nombre, apellido, DNI, teléfono)
  - Cambiar contraseña

---

## Módulos Principales

### Compra de Entradas

#### Por Lote
- Lotes predefinidos por el Admin ANP
- Descuento automático según configuración del lote
- Cantidad fija de entradas por lote
- Opción de definir fecha de visita

#### Personalizada
- Selección libre de actividad
- Cantidad de entradas a elección
- Sin descuento automático
- Opción de definir fecha de visita

#### Fechas y Vencimientos
- **Fecha de visita (opcional):** Fecha programada para la visita
- **Fecha de vencimiento:** Plazo para cargar datos de visitantes (configurable por variable de entorno, por defecto 2 días antes de la visita)
- Las compras sin fecha de visita no tienen vencimiento para cargar datos

### Asignación de Entradas

- Asignar datos del visitante a cada entrada comprada
- Datos requeridos: nombre, apellido, DNI, correo, teléfono
- Datos opcionales de salud (condiciones preexistentes, alergias, etc.)
- Las entradas vencidas no pueden ser asignadas
- Vista de entradas asignadas agrupadas por actividad (colapsables)

### Gestión de Staff

- Registro de personal con rol específico (Guía de montaña, Arriero)
- Asignación a área natural y actividad
- Proceso de confirmación por Admin ANP
- Estados: Habilitado/Deshabilitado, Confirmado/Pendiente ANP
- Búsqueda por nombre, documento o correo
- Filtros por rol, área, actividad y estado

---

## Áreas Naturales Disponibles (Prototipo)

- Parque Provincial Aconcagua
- Reserva Natural Villavicencio
- Reserva Laguna del Diamante

## Actividades Disponibles (Prototipo)

- Trekking y circuitos base
- Ascenso a cumbre
- Cabalgatas guiadas

---

## Características Técnicas

### Autenticación
- Login con correo y contraseña
- Recuperación de contraseña
- Cambio de contraseña desde perfil
- Sesión persistente en localStorage

### Navegación
- Sidebar responsive con secciones colapsables
- Menú de usuario con acceso a perfil y logout
- Header dinámico según rol y empresa

### Interfaz
- Diseño responsive (móvil y desktop)
- Formularios centrados con ancho unificado
- Tablas con búsqueda y filtros
- Feedback visual para acciones (mensajes de éxito/error)
- Botones de acción alineados a la derecha

---

## Flujos Principales

### Flujo de Compra (Empresa)
1. Ingresar a "Comprar entradas"
2. Elegir entre "Por lote" o "Personalizada"
3. Seleccionar actividad y cantidad (si es personalizada)
4. Opcionalmente definir fecha de visita
5. Confirmar compra
6. Ver compra en "Compras y asignar"

### Flujo de Asignación (Empresa)
1. Ir a "Compras y asignar"
2. Seleccionar una compra con entradas disponibles
3. Completar datos del visitante
4. Confirmar asignación
5. Ver en "Entradas asignadas"

### Flujo de Staff (Empresa)
1. Ir a "Registrar personal"
2. Completar datos del empleado
3. Seleccionar rol, área y actividad
4. Enviar registro
5. Esperar confirmación del Admin ANP

### Flujo de Confirmación Staff (Admin ANP)
1. Ir a detalle de empresa
2. Ver pestaña "Staff"
3. Revisar personal pendiente de confirmación
4. Confirmar o rechazar

---

## Configuración

### Variables de Entorno
```
NEXT_PUBLIC_DIAS_ANTES_VENCIMIENTO=2
```
Define cuántos días antes de la fecha de visita vence el plazo para cargar datos de visitantes.

---

## Accesos de Desarrollo

Para pruebas, el sistema incluye accesos rápidos predefinidos:

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Super Admin | super@sistema.local | super123 |
| Admin ANP | admin@anp.gob.ar | admin123 |
| Empresa | empresa.prestadora@sistema.local | empresa123 |

---

*Documento generado para el prototipo del Sistema de Gestión de Entradas ANP*
