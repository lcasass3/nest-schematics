# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-06-19

### Fixed

- 🐛 Fixed template processing to generate proper `.ts` files instead of `.ts.template` files
- 🔧 Resolved circular import issue in module registration by improving module finder logic
- 🧪 Updated test expectations to match correct file extensions after switching from `template()` to
  `applyTemplates()`
- 🎯 Enhanced `ModuleFinder.findNearestModule` to skip self-referencing modules and properly locate
  parent modules

### Technical Improvements

- **Module Registration**: Fixed logic that was incorrectly trying to register modules with
  themselves
- **Template Processing**: Switched to `applyTemplates()` for proper file generation without
  `.template` extensions
- **Test Coverage**: All tests now pass with correct file path expectations
- **Code Quality**: Removed debug logging and cleaned up implementation

## [1.0.1] - 2025-06-18

### Fixed

- 🐛 Fixed schematic collection path to point to dist folder instead of src folder
- 🔧 Resolved "Path does not exist" error when using the schematic after npm installation

## [1.0.0] - 2025-06-17

### Added

- 🎉 Initial release of NestJS CQRS Hexagonal Architecture Schematic
- 🏗️ Complete CQRS structure generation with commands, queries, and handlers
- 🔷 Hexagonal architecture layers (domain, application, infrastructure)
- 🗄️ TypeORM integration with entities and repositories
- 📝 Zod validation schemas for DTOs
- 🔧 Automatic module registration in parent modules
- ✅ Comprehensive input validation and error handling
- 🔍 Smart module detection and path resolution
- 🚫 Duplicate prevention for imports and registrations
- 📋 Barrel exports for clean imports
- 🎯 REST controller with full CRUD operations

### Features

- **Utility Classes**: Modular design with separate utility classes for better maintainability
  - `OptionsTransformer`: Handles option validation and transformation
  - `DependencyValidator`: Validates required dependencies
  - `ModuleFinder`: Smart module file detection
  - `PathResolver`: Relative path calculation
  - `ModuleContentManipulator`: Safe module content modification
- **Template System**: Comprehensive template files for all CQRS components
- **Validation Scripts**: Built-in validation and example scripts
- **Documentation**: Complete README with usage examples and architecture overview

### Technical Details

- TypeScript support with proper type definitions
- Angular CLI schematics framework
- NestJS best practices
- Clean architecture principles
- SOLID design principles

### Development Tools

- Build scripts for TypeScript compilation
- Validation script for schematic structure
- Example usage script
- Comprehensive documentation
