# fe_acrylic_board

React + TypeScript (Vite) frontend built with **Clean Architecture**, mirroring the layering used across the team's Flutter projects (domain / data / presentation).

## Structure

```
src/
  core/                     # cross-cutting concerns
    config/env.ts           # environment variables
    result/result.ts        # Result<Failure, T> (Either-like) used by usecases
    error/failure.ts        # Failure value object
    network/http_client.ts  # axios instance with interceptors
  features/
    auth/
      domain/
        entities/           # plain domain objects (AuthSession)
        repositories/       # abstract contracts (interfaces)
        usecases/           # single-purpose application logic (Login, ...)
      data/
        models/             # API-shaped models + mappers to entities
        datasources/        # HTTP/3rd-party access
        repositories/       # implementations of domain repositories
      presentation/
        hooks/              # state holders (equivalent to a Cubit/ViewModel)
        components/         # dumb UI components
        pages/               # route-level screens
      di.ts                  # wires datasource -> repository -> usecase
```

Each feature is self-contained. Add a new feature by copying the `auth` folder structure.

## Getting started

```powershell
npm install
copy .env.example .env
npm run dev
```

Configure `VITE_API_BASE_URL` in `.env` to point at the `be_acrylic_board` backend.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
