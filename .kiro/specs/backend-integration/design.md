# Design Document - Backend Integration

## Overview

Este diseño describe la arquitectura y estrategia de implementación para migrar la aplicación de datos mockeados a una integración completa con el backend real. La solución se basa en usar `openapi-react-query` que combina `openapi-fetch` con `@tanstack/react-query` para realizar peticiones HTTP tipadas con caching automático, aprovechando los tipos generados automáticamente en `src/lib/api/api.ts`.

El diseño sigue el principio de "single source of truth" donde el archivo `api.ts` (generado desde la especificación OpenAPI del backend) define todos los tipos, endpoints y contratos de la API.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Components                      │
│              (Pages, Forms, Tables, etc.)                │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Use custom hooks
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Custom React Query Hooks                    │
│         (hooks/use-users.ts, use-staff.ts, etc.)        │
│  - useUsers()           - useCustomers()                 │
│  - useStaff()           - useLiquidations()              │
│  - useCreateUser()      - useUpdateLiquidation()         │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Uses backend.useQuery/useMutation
                     ▼
┌─────────────────────────────────────────────────────────┐
│         Backend Client (openapi-react-query)             │
│            (lib/backend.ts - UPDATED)                    │
│  - backend.useQuery()                                    │
│  - backend.useMutation()                                 │
│  - Automatic caching & invalidation                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Built on top of
                     ▼
┌─────────────────────────────────────────────────────────┐
│         openapi-fetch + React Query                      │
│  - Type-safe HTTP client                                 │
│  - Automatic retries & caching                           │
│  - Request deduplication                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP Requests
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend REST API                        │
│              (Spring Boot Server)                        │
└─────────────────────────────────────────────────────────┘
```

### Type System Flow

```
OpenAPI Spec (Backend)
        │
        │ openapi-typescript
        ▼
src/lib/api/api.ts (Generated Types)
        │
        │ Import
        ├──────────────┬──────────────┐
        ▼              ▼              ▼
   lib/backend.ts  lib/api-client.ts  Components
   (paths type)    (schemas types)    (data types)
```

## Components and Interfaces

### 1. Backend Client (lib/backend.ts)

**Purpose**: Configurar y exportar el cliente de openapi-react-query que se usará en toda la aplicación.

**Key Responsibilities**:
- Crear instancia de `openapi-fetch` con configuración base
- Crear instancia de `openapi-react-query` (backend) usando el fetch client
- Manejar errores HTTP de forma centralizada
- Configurar headers comunes (Content-Type, Authorization)
- Proporcionar función de fetch mejorada con retry logic opcional

**Interface**:

```typescript
import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';
import type { paths } from '../src/lib/api/api';

// Usar el tipo de error estándar del backend (desde api.ts)
export type { ErrorBody } from '../src/lib/api/api';

// Cliente de fetch tipado
const fetchClient = createFetchClient<paths>({
  baseUrl: BACKEND_URL,
  fetch: enhancedFetch,
});

// Cliente de React Query (exportado como 'backend')
export const backend = createClient(fetchClient);

// Función de fetch mejorada
export const enhancedFetch: (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response>;

// Helper para construir URLs
export const backendUrl: (
  baseUrl: string,
  version?: string,
  endpoint?: string
) => string;
```

**Implementation Details**:
- Usar `NEXT_PUBLIC_API_URL` de variables de entorno
- Implementar timeout de 30 segundos por defecto
- Agregar logging en modo desarrollo
- Manejar respuestas 401/403 para redirección a login
- El cliente `backend` expone `useQuery` y `useMutation` para usar en hooks

### 2. Custom React Query Hooks (hooks/use-*.ts)

**Purpose**: Proporcionar hooks personalizados de React Query para cada entidad, encapsulando la lógica de fetching, caching y mutaciones.

**Key Responsibilities**:
- Exponer hooks específicos por entidad (users, staff, customers, liquidations)
- Manejar paginación usando hook personalizado `usePagination`
- Transformar datos si es necesario (select)
- Manejar invalidación de cache en mutaciones
- Proporcionar feedback al usuario (toast notifications)

**Interface**:

```typescript
// hooks/use-users.ts
export const useUsers = () => {
  const { page, size, setPagination, resetPagination } = usePagination();
  
  const query = backend.useQuery('get', '/users/paginados', {
    params: {
      query: {
        requestDto: { page, size }
      }
    }
  });
  
  return { query, setPagination, resetPagination };
};

export const useUserById = (id: number) => {
  return backend.useQuery('get', '/users/{id}', {
    params: { path: { id } }
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return backend.useMutation('post', '/users', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/users/paginados'] });
      toast.success('Usuario creado correctamente');
    },
    onError: (error) => {
      const msg = error?.error?.message || 'Ocurrió un error inesperado';
      toast.error(msg);
    }
  });
};

// Similar para Staff, Customers, Liquidations
```

**Implementation Details**:
- Cada hook usa `backend.useQuery()` o `backend.useMutation()`
- Valores por defecto: page=0, size=10 (desde usePagination)
- Invalidación automática de queries relacionadas en mutaciones
- Toast notifications para feedback de éxito/error
- Transformación de datos con `select` si es necesario

### 3. Type Definitions (lib/api-types.ts)

**Purpose**: Re-exportar tipos del backend y proporcionar type aliases para compatibilidad.

**Key Responsibilities**:
- Re-exportar tipos principales desde api.ts
- Crear aliases para mantener compatibilidad con código existente
- Documentar diferencias entre tipos locales y del backend

**Interface**:

```typescript
// Re-export de tipos principales
export type {
  DUser,
  DStaff,
  DCustomer,
  DLiquidation,
  LiquidationWithDetailsDto,
  PagedModelDUser,
  PagedModelDStaff,
  PagedModelDCustomer,
  PagedModelLiquidationWithDetailsDto,
  PageMetadata,
} from '../src/lib/api/api';

// Alias para compatibilidad (si es necesario)
import type { PagedModelDUser } from '../src/lib/api/api';
export type PagedResponse<T> = PagedModelDUser; // Ejemplo genérico
```

## Data Models

### Request/Response Flow

#### Pagination Request
```typescript
// Frontend envía
{
  page: 0,
  size: 10
}

// Backend espera (según api.ts)
{
  requestDto: {
    page?: number;
    size?: number;
  }
}
```

#### Pagination Response
```typescript
// Backend retorna
{
  content: T[],
  page: {
    number: number,
    size: number,
    totalElements: number,
    totalPages: number
  }
}
```

### Entity Models

Todos los modelos de entidad se importan directamente desde `components['schemas']` en api.ts:

- **DUser**: Usuario del sistema
- **DStaff**: Personal/empleado con relación a User
- **DCustomer**: Cliente
- **DLiquidation**: Liquidación básica
- **LiquidationWithDetailsDto**: Liquidación con todos los detalles relacionados
- **DPayment**: Pago asociado a liquidación
- **DFlightService, DHotelService, DTourService, DAdditionalServices**: Servicios
- **DIncidency**: Incidencias

## Error Handling

### Error Flow

```
Backend Error Response (ErrorBody)
        │
        ▼
apiClient catches HTTP error
        │
        ▼
Extract ErrorBody from response.error
        │
        ▼
Create ApiError with ErrorBody
        │
        ▼
Throw ApiError
        │
        ▼
Data Fetching Layer catches
        │
        ▼
Add context (function name, params)
        │
        ▼
Re-throw or return error state
        │
        ▼
Component handles error
(toast, error boundary, etc.)
```

### Error Types

```typescript
// Error del backend (según api.ts) - usar directamente
import type { components } from '../src/lib/api/api';

type ErrorBody = components['schemas']['ErrorBody'];
// {
//   message?: string;
//   status?: "400 BAD_REQUEST" | "401 UNAUTHORIZED" | ... (enum completo);
//   detail?: string;
//   callstack?: string;
// }

// Wrapper para errores con contexto adicional
interface ApiError extends Error {
  errorBody?: ErrorBody;
  statusCode?: number;
  endpoint?: string;
}
```

### Error Handling Strategy

1. **Network Errors**: Capturar errores de red (sin respuesta) y mostrar mensaje genérico
2. **4xx Errors**: Extraer mensaje del backend y mostrarlo al usuario
3. **5xx Errors**: Mostrar mensaje genérico de error del servidor
4. **Timeout**: Configurar timeout de 30s y mostrar mensaje específico
5. **Validation Errors**: Extraer detalles de validación del ErrorBody.detail

## Testing Strategy

### Unit Tests

**Scope**: Custom hooks individuales

**Approach**:
- Usar `@testing-library/react-hooks` para testing de hooks
- Mock de `backend.useQuery` y `backend.useMutation`
- Verificar que se llaman los endpoints correctos
- Verificar transformación de parámetros
- Verificar manejo de errores y toast notifications

**Example**:
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from './use-users';

jest.mock('@/lib/backend', () => ({
  backend: {
    useQuery: jest.fn(),
  },
}));

describe('useUsers', () => {
  it('should call GET /users/paginados with correct params', async () => {
    const mockQuery = { data: { content: [], page: { number: 0, size: 10 } } };
    backend.useQuery.mockReturnValue(mockQuery);
    
    const { result } = renderHook(() => useUsers());
    
    expect(backend.useQuery).toHaveBeenCalledWith('get', '/users/paginados', {
      params: { query: { requestDto: { page: 0, size: 10 } } }
    });
  });
});
```

### Integration Tests

**Scope**: Flujo completo desde componente hasta API

**Approach**:
- Usar MSW (Mock Service Worker) para simular backend
- Definir handlers basados en endpoints de api.ts
- Verificar que componentes manejan respuestas correctamente
- Verificar que errores se muestran apropiadamente

### Manual Testing

**Checklist**:
- [ ] Verificar que todas las páginas cargan datos correctamente
- [ ] Verificar paginación en tablas
- [ ] Verificar manejo de errores (desconectar backend)
- [ ] Verificar loading states
- [ ] Verificar que no hay referencias a código mock
- [ ] Verificar tipos TypeScript (no errores de compilación)

## Migration Strategy

### Phase 1: Setup (No Breaking Changes)
1. Descomentar y actualizar `lib/backend.ts`
2. Configurar `apiClient` con tipos de api.ts
3. Verificar que la configuración funciona con una petición de prueba

### Phase 2: Create Custom Hooks
1. Crear hooks personalizados en `hooks/use-users.ts`, `hooks/use-staff.ts`, etc.
2. Implementar hooks de query (useUsers, useStaff, etc.)
3. Implementar hooks de mutation (useCreateUser, useUpdateStaff, etc.)
4. Mantener funciones mock en `lib/api-client.ts` funcionando

### Phase 3: Component Migration
1. Actualizar componentes uno por uno para usar custom hooks
2. Reemplazar llamadas a funciones mock por hooks de React Query
3. Actualizar manejo de loading/error states
4. Probar cada componente individualmente

### Phase 4: Cleanup
1. Eliminar funciones mock de `lib/api-client.ts`
2. Eliminar archivo `lib/mock-auth.ts` si no se usa
3. Actualizar imports en todos los archivos
4. Verificar que no quedan referencias a código mock

### Phase 5: Type Consolidation
1. Actualizar `lib/api-types.ts` para re-exportar desde api.ts
2. Actualizar imports en componentes
3. Eliminar definiciones de tipos duplicadas

## Design Decisions

### Decision 1: Use openapi-react-query instead of axios or native fetch

**Rationale**: 
- Tipos automáticos basados en OpenAPI spec
- Integración nativa con React Query (caching, invalidation, refetching)
- Mejor DX con autocompletado de endpoints y métodos HTTP
- Menos código boilerplate
- Validación de tipos en compile-time
- Manejo automático de loading/error states

**Trade-offs**:
- Dependencias adicionales (openapi-fetch + openapi-react-query + @tanstack/react-query)
- Curva de aprendizaje para el equipo
- Requiere regenerar tipos cuando cambia el backend

### Decision 2: Use custom hooks pattern for data fetching

**Rationale**:
- Encapsula lógica de fetching y state management
- Facilita reutilización en múltiples componentes
- Permite agregar lógica de negocio (transformaciones, validaciones)
- Centraliza manejo de errores y feedback al usuario
- Facilita testing (mock de hooks)

**Trade-offs**:
- Más archivos para mantener (un hook por entidad)
- Requiere conocimiento de React Query patterns

### Decision 3: Gradual migration with parallel implementation

**Rationale**:
- Reduce riesgo de romper funcionalidad existente
- Permite testing incremental
- Facilita rollback si hay problemas
- Equipo puede seguir trabajando en features

**Trade-offs**:
- Código duplicado temporalmente
- Migración más lenta
- Requiere disciplina para completar la migración

### Decision 4: Use api.ts as single source of truth for types

**Rationale**:
- Elimina inconsistencias entre frontend y backend
- Tipos siempre actualizados con el backend
- Reduce mantenimiento manual de tipos
- Detecta breaking changes en compile-time

**Trade-offs**:
- Requiere proceso de regeneración de tipos
- Nombres de tipos pueden no ser ideales para frontend
- Dependencia del formato de OpenAPI spec

## Performance Considerations

### Caching Strategy
- Implementar cache en memoria para peticiones frecuentes (ej: lista de roles)
- Usar SWR o React Query para cache automático en componentes
- Invalidar cache cuando se crean/actualizan entidades

### Request Optimization
- Implementar debouncing para búsquedas
- Usar pagination para limitar cantidad de datos
- Considerar implementar infinite scroll para tablas grandes

### Bundle Size
- openapi-fetch es ligero (~5KB)
- api.ts puede ser grande, considerar code splitting si es necesario
- Tree shaking automático de tipos no usados

## Security Considerations

### Authentication
- Incluir token JWT en header Authorization
- Manejar refresh de tokens automáticamente
- Redirigir a login en errores 401

### Data Validation
- Validar datos del backend antes de usar (aunque vengan tipados)
- Sanitizar inputs del usuario antes de enviar al backend
- No confiar ciegamente en tipos (runtime validation)

### Error Messages
- No exponer detalles técnicos al usuario final
- Loggear errores completos solo en desarrollo
- Sanitizar mensajes de error del backend antes de mostrar

## Deployment Considerations

### Environment Variables
- `NEXT_PUBLIC_API_URL`: URL base del backend
- Diferentes valores para dev, staging, production
- Validar que la variable existe al iniciar la app

### Build Process
- Regenerar api.ts antes de cada build
- Verificar que no hay errores de tipos
- Incluir health check del backend en CI/CD

### Monitoring
- Loggear errores de API a servicio de monitoring
- Trackear tiempos de respuesta
- Alertar si tasa de errores supera umbral
