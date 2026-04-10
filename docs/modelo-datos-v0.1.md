# Modelo de datos — V0.1

Modelo relacional para el sistema: personas base (`PERSONS`) con especialización en usuarios de aplicación, personal de empresa y visitantes; empresas prestadoras con ámbitos por área protegida; actividades y lotes en cada ANP; compras que generan tickets y reservas asignables a viajeros.

## Diagrama entidad–relación

```mermaid
erDiagram

    PERSONS ||--o| USERS : "is a"
    PERSONS ||--o| STAFF : "is a"
    PERSONS ||--o| TRAVELERS : "is a"

    COMPANIES ||--o{ USERS : "has"
    COMPANIES ||--o{ STAFF : "employs"
    COMPANIES ||--o{ PURCHASES : "makes"

    PROTECTED_AREAS ||--o{ ACTIVITIES : "contains"
    PROTECTED_AREAS ||--o{ COMPANY_AREAS : "enables"
    PROTECTED_AREAS ||--o{ STAFF_AREAS : "allows"

    COMPANIES ||--o{ COMPANY_AREAS : "operates in"
    STAFF ||--o{ STAFF_AREAS : "works in"

    ACTIVITIES ||--o{ LOTS : "defines"
    ACTIVITIES ||--o{ PURCHASES : "applies to"

    PURCHASES ||--o{ TICKETS : "generates"

    TICKETS ||--o| RESERVATIONS : "assigned to"
    TRAVELERS ||--o{ RESERVATIONS : "has"

    %% =====================

    PERSONS {
        uuid id PK
        string first_name
        string last_name
        string personal_identifier
        string email
        string phone
        datetime created_at
    }

    USERS {
        uuid id PK
        uuid person_id FK
        string email
        string password
        string role "anp_admin/company_user/informador"
        boolean is_active
    }

    COMPANIES {
        uuid id PK
        string business_name
        string cuit
        string email
        boolean is_authorized
        datetime operation_start_date
        datetime operation_end_date
    }

    COMPANY_AREAS {
        uuid id PK
        uuid company_id FK
        uuid protected_area_id FK
    }

    STAFF {
        uuid id PK
        uuid person_id FK
        uuid company_id FK
        string staff_type
        string email
        boolean is_active
        boolean annual_fee_paid
    }

    STAFF_AREAS {
        uuid id PK
        uuid staff_id FK
        uuid protected_area_id FK
    }

    TRAVELERS {
        uuid id PK
        uuid person_id FK
        string insurance_policy
        string emergency_contact
        string health_notes
        string category
    }

    PROTECTED_AREAS {
        uuid id PK
        string name
    }

    ACTIVITIES {
        uuid id PK
        uuid protected_area_id FK
        string name
        decimal base_price
        datetime season_start
        datetime season_end
    }

    LOTS {
        uuid id PK
        uuid activity_id FK
        integer quantity
        decimal discount_percentage
        boolean requires_immediate_payment
    }

    PURCHASES {
        uuid id PK
        uuid company_id FK
        uuid activity_id FK
        string purchase_type "individual/lot"
        integer quantity
        string payment_status
        datetime expires_at
        datetime created_at
    }

    TICKETS {
        uuid id PK
        uuid purchase_id FK
        uuid activity_id FK
        datetime scheduled_date
        string category
        string status "available/assigned/expired"
    }

    RESERVATIONS {
        uuid id PK
        uuid ticket_id FK
        uuid traveler_id FK
        datetime assigned_at
        string status

        string trash_bag_number
        datetime check_in
        datetime check_out
        string exit_status "normal/evacuated/deceased"
        text incident_report
    }
```

## Resumen de relaciones

| Relación | Semántica |
|----------|-------------|
| `PERSONS` → `USERS` / `STAFF` / `TRAVELERS` | Una persona puede ser a lo sumo una de cada rol especializado (0..1 por subtipo). |
| `COMPANIES` → `USERS`, `STAFF`, `PURCHASES` | La empresa tiene usuarios de sistema, emplea personal y realiza compras. |
| `PROTECTED_AREAS` → `ACTIVITIES`, `COMPANY_AREAS`, `STAFF_AREAS` | El ANP define actividades y autoriza qué empresas operan y qué personal puede actuar en él. |
| `COMPANY_AREAS` / `STAFF_AREAS` | Tablas puente empresa–ANP y personal–ANP. |
| `ACTIVITIES` → `LOTS`, `PURCHASES` | La actividad define lotes opcionales y es el objeto de cada compra. |
| `PURCHASES` → `TICKETS` → `RESERVATIONS` | La compra desglosa en tickets; cada reserva enlaza un ticket con un viajero. |

## Dominios y enumeraciones (en modelo)

- **Rol de usuario:** `anp_admin`, `company_user`, `informador`.
- **Tipo de compra:** `individual`, `lot`.
- **Estado de ticket:** `available`, `assigned`, `expired`.
- **Estado de salida en reserva:** `normal`, `evacuated`, `deceased`.

## Notas de diseño

- **Identidad:** `PERSONS` centraliza datos personales; `USERS`, `STAFF` y `TRAVELERS` referencian `person_id` y pueden tener email propio donde aplique (p. ej. credenciales o contacto laboral).
- **Comercial:** `PURCHASES` agrega por actividad; `TICKETS` materializa unidades (con `scheduled_date` y categoría); la reserva conecta ticket y viajero y concentra operación en campo (bolsas, check-in/out, incidentes).
- **Temporalidad empresa:** `COMPANIES` incluye ventana `operation_start_date` / `operation_end_date` y flag `is_authorized`.

## Próximos refinamientos (fuera del diagrama)

- Índices únicos (p. ej. `personal_identifier`, `cuit`, emails según reglas de negocio).
- Política de borrado lógico vs. histórico obligatorio por entidad.
- Validaciones y catálogos cerrados para `staff_type`, `category`, `payment_status`, `status` en reservas, etc.
