# Implementation Plan

- [ ] 1. Configurar backend client con openapi-react-query
  - Descomentar y actualizar `lib/backend.ts` para usar openapi-fetch y openapi-react-query
  - Configurar fetchClient con baseUrl desde NEXT_PUBLIC_API_URL
  - Crear instancia de backend usando createClient(fetchClient)
  - Implementar función enhancedFetch con manejo de errores
  - Exportar backend client y tipos de error (ErrorBody)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Crear hook de paginación reutilizable




  - Crear archivo `hooks/use-pagination.ts`
  - Implementar hook usePagination con state para page y size
  - Exportar funciones setPagination y resetPagination
  - Valores por defecto: page=0, size=10
  - _Requirements: 2.2, 3.2, 4.2, 5.2_

- [ ] 3. Implementar hooks para Users
  - [ ] 3.1 Crear archivo hooks/use-users.ts
    - Implementar hook useUsers con paginación
    - Usar backend.useQuery('get', '/users/paginados')
    - Integrar usePagination para manejo de página y tamaño
    - _Requirements: 2.1, 2.2_
  
  - [ ] 3.2 Implementar hook useUserById
    - Usar backend.useQuery('get', '/users/{id}')
    - Recibir id como parámetro
    - _Requirements: 2.5_
  
  - [ ] 3.3 Implementar hook useCreateUser
    - Usar backend.useMutation('post', '/users')
    - Invalidar query de usuarios paginados en onSuccess
    - Mostrar toast de éxito/error
    - _Requirements: 2.1, 7.2, 7.4_

- [ ] 4. Implementar hooks para Staff
  - [ ] 4.1 Crear archivo hooks/use-staff.ts
    - Implementar hook useStaff con paginación
    - Usar backend.useQuery('get', '/staff/paginados')
    - Integrar usePagination
    - _Requirements: 3.1, 3.2_
  
  - [ ] 4.2 Implementar hook useStaffById
    - Usar backend.useQuery('get', '/staff/{id}')
    - _Requirements: 3.4_
  
  - [ ]* 4.3 Implementar hook useStaffByRole
    - Usar backend.useQuery('get', '/staff/by-role/{role}')
    - Recibir role como parámetro
    - _Requirements: 3.5_
  
  - [ ] 4.4 Implementar hooks de mutación para Staff
    - useCreateStaff: POST /staff
    - useCreateUserWithStaff: POST /staff/with-user
    - Invalidar queries relacionadas
    - Mostrar toast notifications
    - _Requirements: 3.1, 7.2, 7.4_

- [ ] 5. Implementar hooks para Customers
  - [ ] 5.1 Crear archivo hooks/use-customers.ts
    - Implementar hook useCustomers con paginación
    - Usar backend.useQuery('get', '/clientes/paginados')
    - Integrar usePagination
    - _Requirements: 4.1, 4.2_
  
  - [ ] 5.2 Implementar hook useCreateCustomer
    - Usar backend.useMutation('post', '/clientes')
    - Invalidar query de clientes paginados
    - Mostrar toast notifications
    - _Requirements: 4.1, 7.2, 7.4_

- [ ] 6. Implementar hooks para Liquidations
  - [ ] 6.1 Crear archivo hooks/use-liquidations.ts
    - Implementar hook useLiquidations con paginación
    - Usar backend.useQuery('get', '/liquidations/paginated')
    - Integrar usePagination
    - _Requirements: 5.1, 5.2_
  
  - [ ] 6.2 Implementar hook useLiquidationById
    - Usar backend.useQuery('get', '/liquidations/{liquidationId}')
    - _Requirements: 5.4_
  
  - [ ]* 6.3 Implementar hook useLiquidationsByStatus
    - Usar backend.useQuery('get', '/liquidations/status/{status}')
    - Recibir status como parámetro
    - Integrar paginación
    - _Requirements: 5.5_
  
  - [ ]* 6.4 Implementar hook useLiquidationsByCustomer
    - Usar backend.useQuery('get', '/liquidations/customer/{customerId}')
    - Recibir customerId como parámetro
    - Integrar paginación
    - _Requirements: 5.6_
  
  - [ ]* 6.5 Implementar hooks de mutación para Liquidations
    - useCreateLiquidation: POST /liquidations
    - useAddTourService: POST /liquidations/{liquidationId}/tour-services
    - useAddPayment: POST /liquidations/{liquidationId}/payments
    - useAddIncidency: POST /liquidations/{liquidationId}/incidencies
    - useAddHotelService: POST /liquidations/{liquidationId}/hotel-services
    - useAddFlightService: POST /liquidations/{liquidationId}/flight-services
    - useAddAdditionalService: POST /liquidations/{liquidationId}/additional-services
    - Invalidar queries relacionadas en cada mutación
    - Mostrar toast notifications
    - _Requirements: 5.1, 7.2, 7.4_

- [ ] 7. Actualizar tipos para usar api.ts como fuente única
  - Actualizar lib/api-types.ts para re-exportar tipos desde src/lib/api/api.ts
  - Importar tipos desde components['schemas']
  - Crear type aliases para compatibilidad si es necesario
  - Eliminar definiciones de tipos duplicadas
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 8. Migrar página de Users al nuevo sistema
  - Actualizar app/dashboard/users/page.tsx para usar useUsers hook
  - Reemplazar llamadas a fetchUsers por useUsers
  - Actualizar manejo de loading/error states usando query.isLoading y query.error
  - Actualizar paginación usando setPagination del hook
  - Probar funcionalidad completa de la página
  - _Requirements: 2.1, 2.2, 7.4_

- [ ] 9. Migrar página de Staff al nuevo sistema
  - Actualizar app/dashboard/staff/page.tsx para usar useStaff hook
  - Reemplazar llamadas a fetchStaff por useStaff
  - Actualizar manejo de loading/error states
  - Actualizar paginación
  - Probar funcionalidad completa
  - _Requirements: 3.1, 3.2, 7.4_

- [ ] 10. Migrar página de Customers al nuevo sistema
  - Actualizar app/dashboard/customers/page.tsx para usar useCustomers hook
  - Reemplazar llamadas a fetchCustomers por useCustomers
  - Actualizar manejo de loading/error states
  - Actualizar paginación
  - Probar funcionalidad completa
  - _Requirements: 4.1, 4.2, 7.4_

- [ ] 11. Migrar página de Liquidations al nuevo sistema
  - Actualizar app/dashboard/liquidations/page.tsx para usar useLiquidations hook
  - Reemplazar llamadas a fetchLiquidations por useLiquidations
  - Actualizar manejo de loading/error states
  - Actualizar paginación
  - Probar funcionalidad completa
  - _Requirements: 5.1, 5.2, 7.4_

- [ ]* 12. Actualizar formularios para usar hooks de mutación
  - [ ]* 12.1 Actualizar formulario de creación de usuarios
    - Usar useCreateUser hook en components/forms/user-form.tsx
    - Manejar loading state durante mutación
    - Mostrar feedback con toast
    - _Requirements: 2.1, 7.2, 7.4_
  
  - [ ]* 12.2 Actualizar formulario de creación de staff
    - Usar useCreateStaff o useCreateUserWithStaff según corresponda
    - Manejar loading state
    - Mostrar feedback con toast
    - _Requirements: 3.1, 7.2, 7.4_
  
  - [ ]* 12.3 Actualizar formulario de creación de clientes
    - Usar useCreateCustomer hook
    - Manejar loading state
    - Mostrar feedback con toast
    - _Requirements: 4.1, 7.2, 7.4_
  
  - [ ]* 12.4 Actualizar formularios de liquidaciones
    - Usar useCreateLiquidation y hooks de servicios
    - Manejar loading states
    - Mostrar feedback con toast
    - _Requirements: 5.1, 7.2, 7.4_

- [ ] 13. Configurar React Query Provider
  - Crear o actualizar app/layout.tsx para incluir QueryClientProvider
  - Configurar QueryClient con opciones por defecto (staleTime, cacheTime, retry)
  - Envolver la aplicación con el provider
  - _Requirements: 1.1, 7.4_

- [ ]* 14. Implementar manejo de errores global
  - Crear componente ErrorBoundary para capturar errores de React
  - Implementar función helper para extraer mensajes de ErrorBody
  - Crear componente de toast para mostrar errores consistentemente
  - Actualizar enhancedFetch para loggear errores en desarrollo
  - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [ ] 15. Limpiar código mock
  - Eliminar funciones mock de lib/api-client.ts
  - Eliminar archivo lib/mock-auth.ts si no se usa
  - Buscar y actualizar todas las importaciones que referencian código mock
  - Verificar que no quedan referencias a funciones mock en componentes
  - Eliminar archivos mock completamente
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 16. Verificación final y testing
  - Ejecutar build de producción para verificar tipos
  - Probar todas las páginas del dashboard manualmente
  - Verificar que paginación funciona correctamente
  - Verificar que creación/edición de entidades funciona
  - Verificar que manejo de errores funciona (desconectar backend)
  - Verificar que loading states se muestran correctamente
  - Verificar que no hay errores de TypeScript
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 7.4_
