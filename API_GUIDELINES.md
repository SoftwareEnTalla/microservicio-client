# Guía de Desarrollo para la API del Proyecto

## Introducción

Este documento proporciona una descripción detallada para el desarrollo de la API del proyecto, con el objetivo de garantizar claridad, evitar confusiones y minimizar retrasos. Define lineamientos, estructura de trabajo, tecnologías a utilizar y requisitos funcionales para cada módulo.

---

## Estructura de Ramas del Proyecto

El control de versiones seguirá el siguiente esquema:

1. **Rama principal:** `main` (Producción).
2. **Rama de desarrollo:** `dev` (Preproducción).
3. **Ramas individuales de desarrollo:** `dev-nombre-del-dev` (Trabajo específico de cada desarrollador).

---

## Convenciones para Commits

- Los commits deben llevar un prefijo para identificar su tipo:
  - `feat:` Nuevas funcionalidades.
  - `fix:` Corrección de errores.
  - `refactor:` Refactorizaciones del código.
  - `test:` Cambios relacionados con pruebas.
  - `docs:` Documentación.
  - `style:` Cambios en estilo o formato del código.
  - `chore:` Cambios menores o tareas de mantenimiento.

---

## Versionado Semántico

- Utilizar versionado semántico siguiendo el formato `MAJOR.MINOR.PATCH`.
- Crear tags en los siguientes eventos:
  - **Preproducción:** Cuando se fusiona la rama `dev` a `main`.
  - **Producción:** En cada despliegue estable desde `main`.

---

## Tecnologías a Utilizar

- **Framework:** NestJS.
- **Base de Datos:** MongoDB (Mongoose como ORM).
- **Operaciones:**
  - **GraphQL:** Para operaciones ordinarias.
  - **REST:** Para autenticación.
  - **WebSocket:** Para notificaciones servidor-cliente.

---

## Estructura de Directorios

La estructura de los directorios seguirá el siguiente modelo:

``` markdown
📁src
   └── 📁apis
       └── 📁auth
       └── 📁crm
       └── 📁media
       └── 📁order
           └── 📁cart
           └── 📁order-status
           └── 📁orders
           └── 📁shippings
           └── order.module.ts
       └── 📁product
           └── 📁attributes
           └── 📁categories
           └── 📁products
           └── 📁wishlist
           └── product.module.ts
       └── 📁setting
           └── 📁cities
           └── 📁countries
           └── 📁currencies
           └── 📁payment-methods
           └── 📁permission
           └── 📁role
           └── 📁states
           └── setting.module.ts
       └── 📁stats
           └── stats.controller.ts
           └── stats.module.ts
           └── stats.service.ts
           └── stats.types.ts
       └── 📁merchant
           └── 📁merchants
           └── merchant.module.ts
       └── 📁user
           └── 📁addresses
           └── 📁notifications
           └── 📁transactions
           └── 📁users
           └── 📁wallets
           └── user.module.ts
       └── 📁warehouse
           └── 📁depots
           └── 📁movements
           └── 📁stocks
           └── warehouse.module.ts
```

---

## Lineamientos de Desarrollo

### Relación entre Módulos

- La comunicación entre módulos se realizará mediante eventos para garantizar su independencia.

### Documentación

- Utilizar los campos de descripción y mensajes de los decoradores:
  - `@Field` de GraphQL.
  - `@ApiProperty` de Swagger.
  - Validadores de `class-validator`.

Esto permitirá generar una documentación automática y facilitar el trabajo de los desarrolladores de frontend.

### Manejo de Errores

- Implementar bloques `try-catch` en los servicios para gestionar errores y mantener consistencia.

### Separación de Responsabilidades

- **Controladores y Resolvers:** No deben contener lógica de negocio. Esta debe delegarse exclusivamente a los servicios.

---

## Requisitos Funcionales de la API

A continuación, se presenta un listado de los requisitos funcionales que deben cumplir los módulos, junto con los respectivos CRUDs:

### Módulo Auth

- Autenticación mediante REST.
- Registro, inicio de sesión y recuperación de contraseña.

### Módulo CRM

- Gestionar relaciones con clientes.
- CRUD de clientes y notas.

### Módulo Media

- Subida y gestión de archivos multimedia.

### Módulo Order

- Carrito de compras.
- Estado de órdenes.
- Gestión de órdenes y envíos.

### Módulo Product

- Atributos y categorías de productos.
- Gestión de productos y lista de deseos.

### Módulo Setting

- Configuración de ciudades, países, monedas, métodos de pago, permisos y roles.

### Módulo Stats

- Generación de estadísticas del sistema.

### Módulo Merchant

- Gestión de comerciantes y sus catálogos.

### Módulo User

- Direcciones, notificaciones, transacciones, usuarios y wallets.

### Módulo Warehouse

- Depósitos, movimientos de inventario y gestión de stocks.

---

Este documento será revisado y actualizado periódicamente para reflejar las necesidades y cambios en el desarrollo del proyecto.
