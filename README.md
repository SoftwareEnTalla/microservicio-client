# CLIENT Microservice

**Fecha de creación**: 2025-03-01

**Autor**: Ing. Persy Morell Guerra e Ing. Dailyn García Dominguez (SoftwarEnTalla CEO)

## Estructura del microservicio

```
src/
├── modules/
│   └── client/
│       ├── commands/
│       ├── events/
│       ├── queries/
│       ├── aggregates/
│       ├── repositories/
│       ├── dtos/
│       ├── controllers/
│       ├── services/
│       └── client.module.ts
├── shared/
│   ├── event-store/
│   └── messaging/
├── Dockerfile
├── docker-compose.yml
└── package.json
```
