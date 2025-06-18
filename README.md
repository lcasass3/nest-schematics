# NestJS CQRS Hexagonal Architecture Schematic

A powerful Angular CLI schematic for generating CQRS (Command Query Responsibility Segregation)
modules following hexagonal architecture principles in NestJS applications.

## Features

- 🏗️ **Complete CQRS Structure**: Generates commands, queries, handlers, and controllers
- 🔷 **Hexagonal Architecture**: Follows clean architecture principles with clear separation of
  concerns
- 🗄️ **TypeORM Integration**: Includes repository pattern with TypeORM entities
- 📝 **TypeScript Support**: Fully typed with proper interfaces and DTOs
- 🔧 **Module Registration**: Automatically registers the generated module in the parent module
- ✅ **Validation**: Input validation using Zod schemas
- 🎯 **Best Practices**: Follows NestJS and clean architecture best practices

## Installation

```bash
npm install -g nest-cqrs-hex-schematic
```

## Usage

### Basic Usage

```bash
# Generate a CQRS module for a "user" entity
schematics nest-cqrs-hex-schematic:cqrs-module user

# Generate in a specific path
schematics nest-cqrs-hex-schematic:cqrs-module user --path=src/modules

# Specify parent module for registration
schematics nest-cqrs-hex-schematic:cqrs-module user --module=src/app.module.ts
```

### Options

| Option   | Type   | Default       | Description                             |
| -------- | ------ | ------------- | --------------------------------------- |
| `name`   | string | -             | Name of the module (required)           |
| `path`   | string | `src`         | Path where the module will be generated |
| `module` | string | auto-detected | Path to the parent module file          |

## Generated Structure

When you run the schematic with `schematics nest-cqrs-hex-schematic:cqrs-module user`, it generates:

```
src/user/
├── user.module.ts                              # Main module file
├── application/
│   ├── commands/
│   │   ├── handlers/
│   │   │   ├── create-user.handler.ts          # Create command handler
│   │   │   ├── update-user.handler.ts          # Update command handler
│   │   │   ├── delete-user.handler.ts          # Delete command handler
│   │   │   └── index.ts                        # Barrel export
│   │   └── impl/
│   │       ├── create-user.command.ts          # Create command
│   │       ├── update-user.command.ts          # Update command
│   │       ├── delete-user.command.ts          # Delete command
│   │       └── index.ts                        # Barrel export
│   └── queries/
│       ├── handlers/
│       │   ├── all-users.handler.ts            # Get all query handler
│       │   ├── find-user-by-id.handler.ts      # Find by ID query handler
│       │   └── index.ts                        # Barrel export
│       └── impl/
│           ├── all-users.query.ts              # Get all query
│           ├── find-user-by-id.query.ts        # Find by ID query
│           └── index.ts                        # Barrel export
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts                      # Domain entity
│   │   └── index.ts                            # Barrel export
│   ├── repositories/
│   │   ├── users.repository.ts                 # Repository interface
│   │   └── index.ts                            # Barrel export
│   └── dtos/
│       ├── create-user.dto.ts                  # Create DTO with validation
│       ├── update-user.dto.ts                  # Update DTO with validation
│       └── index.ts                            # Barrel export
└── infrastructure/
    ├── users.controller.ts                     # REST controller
    └── persistance/
        ├── entities/
        │   ├── user.typeorm-entity.ts          # TypeORM entity
        │   └── index.ts                        # Barrel export
        ├── repositories/
        │   ├── users.typeorm-repository.ts     # TypeORM repository
        │   └── index.ts                        # Barrel export
        └── modules/
            ├── typeorm-user.module.ts          # TypeORM module
            └── index.ts                        # Barrel export
```

## Architecture Overview

### Hexagonal Architecture Layers

1. **Domain Layer** (`domain/`): Contains business logic, entities, and repository interfaces
2. **Application Layer** (`application/`): Contains use cases (commands, queries, and handlers)
3. **Infrastructure Layer** (`infrastructure/`): Contains external concerns (controllers, database,
   etc.)

### CQRS Pattern

- **Commands**: Handle write operations (create, update, delete)
- **Queries**: Handle read operations (find, get all)
- **Handlers**: Process commands and queries
- **DTOs**: Data transfer objects with validation

## Dependencies

The schematic will check for and warn about missing dependencies:

- `@nestjs/common`
- `@nestjs/core`
- `@nestjs/cqrs`
- `@nestjs/typeorm`
- `typeorm`

## Development

### Building the Schematic

```bash
# Install dependencies
npm install

# Build
npm run build

# Build in watch mode
npm run build:watch
```

### Testing Locally

```bash
# Link the schematic globally
npm link

# Test in a NestJS project
cd /path/to/your/nestjs/project
schematics nest-cqrs-hex-schematic:cqrs-module user
```

## Code Quality Features

- **✅ Validation**: Comprehensive input validation and error handling
- **🔍 Smart Module Detection**: Automatically finds the appropriate parent module
- **🚫 Duplicate Prevention**: Prevents duplicate imports and module registrations
- **📝 Clear Logging**: Informative console output for debugging
- **🏗️ Modular Design**: Well-organized utility classes for maintainability

## License

MIT

## Support

For issues and questions, please open an issue on the GitHub repository.
