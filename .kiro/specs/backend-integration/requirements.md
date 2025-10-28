# Requirements Document

## Introduction

Este documento define los requisitos para migrar la aplicación frontend de datos mockeados a la integración completa con el backend real. La aplicación actualmente utiliza funciones mock en `lib/api-client.ts` para simular datos de usuarios, staff, clientes y liquidaciones. El objetivo es reemplazar estas implementaciones mock con llamadas reales al backend utilizando el archivo `src/lib/api/api.ts` (generado por openapi-typescript) como única fuente de verdad para los tipos y endpoints de la API.

## Glossary

- **Frontend Application**: La aplicación Next.js que consume datos y presenta la interfaz de usuario
- **Backend API**: El servidor REST que proporciona los endpoints definidos en el archivo api.ts
- **Mock Data**: Datos simulados generados en el cliente para desarrollo sin backend
- **API Client**: El módulo que realiza peticiones HTTP al Backend API
- **OpenAPI Types**: Tipos TypeScript generados automáticamente desde la especificación OpenAPI del backend
- **Data Fetching Layer**: La capa de abstracción que maneja todas las peticiones de datos al backend

## Requirements

### Requirement 1

**User Story:** Como desarrollador, quiero configurar un cliente API tipado basado en openapi-fetch, para que todas las peticiones al backend estén correctamente tipadas y validadas.

#### Acceptance Criteria

1. WHEN THE Frontend Application inicializa, THE API Client SHALL crear una instancia de openapi-fetch configurada con la baseUrl del backend
2. THE API Client SHALL utilizar los tipos definidos en src/lib/api/api.ts para todas las peticiones y respuestas
3. THE API Client SHALL incluir manejo de errores centralizado para respuestas HTTP no exitosas
4. THE API Client SHALL soportar configuración de headers comunes como autenticación y content-type
5. WHERE la variable de entorno NEXT_PUBLIC_API_URL está definida, THE API Client SHALL utilizar esa URL como baseUrl

### Requirement 2

**User Story:** Como desarrollador, quiero reemplazar las funciones mock de usuarios con llamadas reales al backend, para que la aplicación muestre datos reales de usuarios.

#### Acceptance Criteria

1. THE Data Fetching Layer SHALL implementar una función fetchUsers que llame al endpoint GET /users/paginados
2. WHEN fetchUsers es invocada con parámetros de paginación, THE Data Fetching Layer SHALL enviar los parámetros page y size al backend
3. THE Data Fetching Layer SHALL retornar una respuesta tipada PagedModelDUser según la definición en api.ts
4. THE Data Fetching Layer SHALL manejar errores de red y respuestas de error del backend
5. THE Data Fetching Layer SHALL implementar una función getUserById que llame al endpoint GET /users/{id}

### Requirement 3

**User Story:** Como desarrollador, quiero reemplazar las funciones mock de staff con llamadas reales al backend, para que la aplicación muestre datos reales del personal.

#### Acceptance Criteria

1. THE Data Fetching Layer SHALL implementar una función fetchStaff que llame al endpoint GET /staff/paginados
2. WHEN fetchStaff es invocada con parámetros de paginación, THE Data Fetching Layer SHALL enviar los parámetros page y size al backend
3. THE Data Fetching Layer SHALL retornar una respuesta tipada PagedModelDStaff según la definición en api.ts
4. THE Data Fetching Layer SHALL implementar una función getStaffById que llame al endpoint GET /staff/{id}
5. THE Data Fetching Layer SHALL implementar una función getStaffByRole que llame al endpoint GET /staff/by-role/{role}

### Requirement 4

**User Story:** Como desarrollador, quiero reemplazar las funciones mock de clientes con llamadas reales al backend, para que la aplicación muestre datos reales de clientes.

#### Acceptance Criteria

1. THE Data Fetching Layer SHALL implementar una función fetchCustomers que llame al endpoint GET /clientes/paginados
2. WHEN fetchCustomers es invocada con parámetros de paginación, THE Data Fetching Layer SHALL enviar los parámetros page y size al backend
3. THE Data Fetching Layer SHALL retornar una respuesta tipada PagedModelDCustomer según la definición en api.ts
4. THE Data Fetching Layer SHALL manejar correctamente la estructura de respuesta paginada del backend

### Requirement 5

**User Story:** Como desarrollador, quiero reemplazar las funciones mock de liquidaciones con llamadas reales al backend, para que la aplicación muestre datos reales de liquidaciones.

#### Acceptance Criteria

1. THE Data Fetching Layer SHALL implementar una función fetchLiquidations que llame al endpoint GET /liquidations/paginated
2. WHEN fetchLiquidations es invocada con parámetros de paginación, THE Data Fetching Layer SHALL enviar los parámetros page y size al backend
3. THE Data Fetching Layer SHALL retornar una respuesta tipada PagedModelLiquidationWithDetailsDto según la definición en api.ts
4. THE Data Fetching Layer SHALL implementar una función getLiquidationById que llame al endpoint GET /liquidations/{liquidationId}
5. THE Data Fetching Layer SHALL implementar una función getLiquidationsByStatus que llame al endpoint GET /liquidations/status/{status}
6. THE Data Fetching Layer SHALL implementar una función getLiquidationsByCustomer que llame al endpoint GET /liquidations/customer/{customerId}

### Requirement 6

**User Story:** Como desarrollador, quiero actualizar los tipos de datos locales para que coincidan exactamente con los tipos del backend, para evitar inconsistencias y errores de tipo.

#### Acceptance Criteria

1. THE Frontend Application SHALL eliminar las definiciones de tipos duplicadas en lib/api-types.ts
2. THE Frontend Application SHALL importar todos los tipos desde src/lib/api/api.ts (components.schemas)
3. THE Frontend Application SHALL actualizar todas las importaciones de tipos en componentes y páginas para usar los tipos de api.ts
4. WHERE existen diferencias de nomenclatura entre tipos locales y del backend, THE Frontend Application SHALL crear type aliases para mantener compatibilidad temporal

### Requirement 7

**User Story:** Como desarrollador, quiero implementar manejo de errores consistente en todas las peticiones al backend, para proporcionar feedback claro al usuario cuando ocurran errores.

#### Acceptance Criteria

1. THE API Client SHALL capturar errores HTTP y transformarlos en objetos de error tipados
2. WHEN una petición falla con código 4xx o 5xx, THE API Client SHALL extraer el mensaje de error del cuerpo de respuesta ErrorBody
3. THE API Client SHALL propagar errores de red (sin respuesta del servidor) con mensajes descriptivos
4. THE Data Fetching Layer SHALL permitir a los componentes manejar errores específicos mediante try-catch o error boundaries
5. THE API Client SHALL incluir logging de errores para facilitar debugging en desarrollo

### Requirement 8

**User Story:** Como desarrollador, quiero eliminar todo el código mock una vez que la integración con el backend esté completa, para mantener el código limpio y evitar confusión.

#### Acceptance Criteria

1. WHEN todas las funciones de datos reales están implementadas y probadas, THE Frontend Application SHALL eliminar el archivo lib/api-client.ts
2. THE Frontend Application SHALL eliminar el archivo lib/mock-auth.ts si la autenticación real está implementada
3. THE Frontend Application SHALL actualizar todas las importaciones que referenciaban archivos mock
4. THE Frontend Application SHALL verificar que no queden referencias a funciones mock en ningún componente o página
