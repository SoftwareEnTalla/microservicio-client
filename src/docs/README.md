# Client Microservice — Documentación Completa

> **Versión**: 0.0.1
> **Puerto**: 3000
> **Base URL**: `http://localhost:3000/api`
> **Swagger UI**: `http://localhost:3000/api-docs` (user: `admin`, pass: `admin123`)

---

## Tabla de Contenidos

1. [Historia de Usuario](#1-historia-de-usuario)
2. [Modelo DSL](#2-modelo-dsl)
3. [Arquitectura](#3-arquitectura)
4. [Módulos del Microservicio](#4-módulos-del-microservicio)
5. [Eventos Publicados](#5-eventos-publicados)
6. [Eventos Consumidos](#6-eventos-consumidos)
7. [API REST — Guía Completa Swagger](#7-api-rest--guía-completa-swagger)
8. [Guía para Desarrolladores](#8-guía-para-desarrolladores)
9. [Test E2E con curl](#9-test-e2e-con-curl)
10. [Análisis de Sagas y Eventos (E2E)](#10-análisis-de-sagas-y-eventos-e2e)

---

## 1. Historia de Usuario

### Bounded Context: Client

El microservicio **client** es dueño del bounded context "Cliente" del ecosistema (rol B2C/B2B
del ecosistema comercial): su segmentación, su tipo (regular, corporativo, premium), su tier de
lealtad y sus referencias a catálogo. Es el **downstream mirror** de la persona (security-service
vía `hrms`) y aplica el patrón **Upstream-Mirror / Person-Role** (DSL v2.1) sobre el aggregate
principal `Client`.

### Historias de Usuario Implementadas

| ID | Título | Módulo(s) |
|----|--------|-----------|
| UH-1 | Alta/gestión de clientes con `personId` opcional | client |
| UH-2 | Tipificación por `ClientType` (regular/corporate/premium) | client-type |
| UH-3 | Segmentación comercial (`ClientSegment`) | client-segment |
| UH-4 | Programa de lealtad con tiers (`ClientLoyaltyTier`) | client-loyalty-tier |
| UH-5 | Proyección de nomencladores compartidos (`CatalogClient`) | catalog-client |
| UH-6 | Upstream-Mirror contra `security.person` (patrón Person-Role v2.1) | client |

### UH-6: Upstream-Mirror / Person-Role

**Como** operador de back-office, **quiero** poder dar de alta un `Client` sin que exista todavía
la persona en el upstream (LOCAL_ONLY), **para** no bloquear la toma de datos cuando la fuente
de verdad (`hrms.person` / `security.user`) esté indisponible.

**Criterios de aceptación**:
- Estados `upstreamSyncStatus`: `LOCAL_ONLY`, `PENDING_UPSTREAM`, `SYNCED`, `DIVERGED`.
- Endpoint `GET /api/clients/search-upstream-candidates` para anti-duplicación.
- Reconciler job periódico empuja `LOCAL_ONLY` al upstream y refresca `SYNCED` stale.

---

## 2. Modelo DSL

| Modelo XML | Versión | Descripción |
|------------|---------|-------------|
| `models/client/client.xml` | 1.1.0 | Aggregate root con `<upstream-mirror>` |
| `models/client/client-type.xml` | 1.0.0 | Nomenclador de tipos de cliente |
| `models/client/client-segment.xml` | 1.0.0 | Segmento comercial |
| `models/client/client-loyalty-tier.xml` | 1.0.0 | Tier de lealtad |

### Ejemplo de `<upstream-mirror>` en `client.xml`

```xml
<upstream-mirror upstreamBoundedContext="hrms"
                 upstreamAggregate="person"
                 foreignKeyField="personId"
                 reconcileDirection="bidirectional"
                 reconcileStrategy="upstream-wins"
                 reconcileIntervalEnvVar="UPSTREAM_RECONCILE_INTERVAL_MINUTES"
                 reconcileIntervalDefaultMinutes="60">
  <mirror-field local="firstName" upstream="firstName" />
  <mirror-field local="lastName"  upstream="lastName" />
  <mirror-field local="email"     upstream="email" />
  <mirror-field local="phone"     upstream="phone" />
  <similarity-search fields="firstName,lastName,email,phone,document"
                     algorithm="pg_trgm+tsvector" maxResults="20" />
</upstream-mirror>
```

---

## 3. Arquitectura

Patrones estándar del ecosistema: **CQRS + Event Sourcing + Kafka + Hexagonal + DDD + Saga Pattern**.
Ver [security-service/src/docs/README.md](../../../security-service/src/docs/README.md) secciones 3.1–3.3
para el diagrama completo de capas y estructura de carpetas.

Artefactos auto-generados específicos del patrón Upstream-Mirror:

- `src/modules/client/services/client-upstream-client.service.ts` — HTTP client + circuit breaker.
- `src/modules/client/sagas/client-upstream-mirror.saga.ts` — `@Saga()` que consume eventos
  `hrms.person.*` y aplica patch al espejo local.
- `src/modules/client/services/client-upstream-reconciler.service.ts` — job `setInterval`
  parametrizado por `UPSTREAM_RECONCILE_INTERVAL_MINUTES` (default 60 min).
- `src/modules/client/controllers/client-upstream-search.controller.ts` — endpoint
  `GET /api/clients/search-upstream-candidates`.

---

## 4. Módulos del Microservicio

### 4.1. Client (aggregate root)
- **Entidad**: `Client` — firstName, lastName, email, phone, document, personId (FK soft),
  clientTypeId, clientSegmentId, clientLoyaltyTierId, upstreamSyncStatus, upstreamSyncedAt,
  upstreamHash, upstreamLastErrorAt, upstreamLastAttemptAt.
- **Rol**: espejo local (Person-Role) + atributos específicos del dominio cliente.

### 4.2. ClientType
- Nomenclador con `typeCode`, `typeName`, `isActive`.

### 4.3. ClientSegment
- Segmentación comercial: `segmentCode`, `segmentName`, criterios.

### 4.4. ClientLoyaltyTier
- `tierCode`, `tierName`, `minPoints`, `benefits`.

### 4.5. CatalogClient
- Proyección local de `catalog-service` para nomencladores horizontales consumidos por client.

---

## 5. Eventos Publicados

| Módulo | Evento | Tópico Kafka | Versión |
|--------|--------|--------------|---------|
| client | `ClientCreatedEvent` | `client-created` | 1.0.0 |
| client | `ClientUpdatedEvent` | `client-updated` | 1.0.0 |
| client | `ClientDeletedEvent` | `client-deleted` | 1.0.0 |
| client-type | `ClientTypeCreatedEvent` | `client-type-created` | 1.0.0 |
| client-type | `ClientTypeUpdatedEvent` | `client-type-updated` | 1.0.0 |
| client-type | `ClientTypeDeletedEvent` | `client-type-deleted` | 1.0.0 |
| client-segment | `ClientSegmentCreatedEvent` | `client-segment-created` | 1.0.0 |
| client-segment | `ClientSegmentUpdatedEvent` | `client-segment-updated` | 1.0.0 |
| client-segment | `ClientSegmentDeletedEvent` | `client-segment-deleted` | 1.0.0 |
| client-loyalty-tier | `ClientLoyaltyTierCreatedEvent` | `client-loyalty-tier-created` | 1.0.0 |
| client-loyalty-tier | `ClientLoyaltyTierUpdatedEvent` | `client-loyalty-tier-updated` | 1.0.0 |
| client-loyalty-tier | `ClientLoyaltyTierDeletedEvent` | `client-loyalty-tier-deleted` | 1.0.0 |
| catalog-client | `CatalogClientCreatedEvent` | `catalog-client-created` | 1.0.0 |
| catalog-client | `CatalogClientUpdatedEvent` | `catalog-client-updated` | 1.0.0 |
| catalog-client | `CatalogClientDeletedEvent` | `catalog-client-deleted` | 1.0.0 |

Comando Kafka de upstream-mirror publicado por el reconciler:

| Topic | Propósito |
|-------|-----------|
| `register-person-from-client-command` | Solicita al upstream (hrms) crear/ligar la persona correspondiente a un `Client` LOCAL_ONLY |

---

## 6. Eventos Consumidos

| Módulo | Evento Consumido | Origen | Acción |
|--------|-----------------|--------|--------|
| client (saga upstream-mirror) | `hrms.person.*` | hrms-service | Aplicar patch mirror local |
| catalog-client | Eventos de catalog | catalog-service | Sincronizar nomencladores |

---

## 7. API REST — Guía Completa Swagger

Patrones Command/Query CRUD estándar. Ver
[security-service/src/docs/README.md](../../../security-service/src/docs/README.md) secciones 7.1–7.2.

### Prefijos de rutas

| Módulo | Command | Query |
|--------|---------|-------|
| client | `/api/clients/command` | `/api/clients/query` |
| client-type | `/api/clienttypes/command` | `/api/clienttypes/query` |
| client-segment | `/api/clientsegments/command` | `/api/clientsegments/query` |
| client-loyalty-tier | `/api/clientloyaltytiers/command` | `/api/clientloyaltytiers/query` |
| catalog-client | `/api/catalogclients/command` | `/api/catalogclients/query` |

### 7.3. Endpoint especial Upstream-Mirror

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/api/clients/search-upstream-candidates?q=&types=&limit=` | Bearer | Búsqueda por similitud contra `hrms.person` (anti-duplicación) |

Responde 503 + payload `{ status: 'UPSTREAM_DOWN', candidates: [] }` cuando el upstream no
está healthy (circuit-breaker OPEN).

### 7.5. Autenticación

- Stub `Authorization: Bearer valid-token`
- Swagger: `admin:admin123`

---

## 8. Guía para Desarrolladores

Ver [security-service/src/docs/README.md](../../../security-service/src/docs/README.md) sección 8
para creación de eventos y sagas.

Específico del patrón Upstream-Mirror (v2.1):

1. Declarar `<upstream-mirror>` en el DSL del aggregate.
2. El codegen auto-inyecta los 5 campos estándar (`upstreamSyncStatus`, `upstreamSyncedAt`,
   `upstreamHash`, `upstreamLastErrorAt`, `upstreamLastAttemptAt`) si no están explícitos.
3. Se generan 4 artefactos: upstream-client.service, upstream-mirror.saga,
   upstream-reconciler.service, upstream-search.controller.
4. Reglas en `/memories/codegen-rules.md` (R11, R12) y `/memories/repo/upstream-mirror-pattern.md`.

---

## 9. Test E2E con curl

```bash
cd client-service && env LOG_API_AUTH_TOKEN=valid-token node dist/main.js
bash client-service/src/docs/e2e-test.sh
```

### Requisitos previos

1. Client-service corriendo en `http://localhost:3000`
2. PostgreSQL accesible (`client-service` DB)
3. Opcional: hrms-service en `http://localhost:3017` (para probar upstream-mirror end-to-end)
4. `curl` y `jq` instalados

---

## 10. Análisis de Sagas y Eventos (E2E)

### Sagas CRUD

| Módulo | Saga Class | Handlers |
|--------|-----------|----------|
| client | `ClientCrudSaga` | 3 |
| client-type | `ClientTypeCrudSaga` | 3 |
| client-segment | `ClientSegmentCrudSaga` | 3 |
| client-loyalty-tier | `ClientLoyaltyTierCrudSaga` | 3 |
| catalog-client | `CatalogClientCrudSaga` | 3 |

### Sagas Upstream-Mirror (v2.1)

| Saga | Evento fuente | Acción |
|------|--------------|--------|
| `ClientUpstreamMirrorSaga.onUpstreamEvent` | `hrms.person.*` | Aplicar mirror fields + hash SHA-256 + marcar `SYNCED` |

### Job de reconciliación

`ClientUpstreamReconcilerService` ejecuta cada `UPSTREAM_RECONCILE_INTERVAL_MINUTES` minutos:
- **Flujo 1**: `LOCAL_ONLY` con `personId=null` → `PENDING_UPSTREAM` + publica
  `register-person-from-client-command` en Kafka.
- **Flujo 2**: `SYNCED` con `upstreamSyncedAt` < TTL → consulta `GET /persons/query/batch-by-ids`
  en hrms-service y refresca snapshot.
