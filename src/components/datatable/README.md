# 📊 DataTable Component - Guía de Uso

Un componente de tabla altamente configurable construido con **TanStack Table** que soporta paginación del servidor, filtros, ordenamiento y selección de filas.

## 🚀 Características

- ✅ **Paginación del servidor** - Manejo eficiente de grandes datasets
- ✅ **Filtrado avanzado** - Filtros globales y por columna
- ✅ **Ordenamiento** - Ordenamiento por columnas
- ✅ **Selección de filas** - Selección múltiple
- ✅ **Filtros facetados** - Filtros predefinidos con chips
- ✅ **Acciones de toolbar** - Botones personalizados
- ✅ **Responsive** - Adaptable a diferentes tamaños de pantalla

## 📋 Tipos de Datos

### CustomPaginationTableParams

```typescript
type CustomPaginationTableParams = {
    page: number; // Página actual (1-indexed)
    pageSize: number; // Elementos por página
    total: number; // Total de elementos
    totalPages: number; // Total de páginas
};
```

### ServerPaginationTanstackTableConfig

```typescript
type ServerPaginationTanstackTableConfig = {
    pageIndex: number; // Índice de página (0-indexed para TanStack)
    pageSize: number; // Elementos por página
    pageCount: number; // Total de páginas
    total: number; // Total de elementos
    onPaginationChange: (pageIndex: number, pageSize: number) => void;
};
```

## 🔧 Implementación Completa

### 1. Hook Personalizado (usePaginatedReservation)

```typescript
export const usePaginatedReservation = () => {
    const [params, setParams] = useState<PaginatedReservationParams | null>(defaultParamConfig);

    const queryResponse = useGetPaginatedReservationsQuery(params ?? defaultParamConfig, {
        skip: !params,
        refetchOnMountOrArgChange: true,
    });

    const updateFilters = (newParams: PaginatedReservationParams) => {
        setParams(newParams);
    };

    return {
        queryResponse,
        updateFilters,
    };
};
```

### 2. Componente Padre (Parent Component)

```typescript
export function ReservationListPage() {
  const { queryResponse, updateFilters } = usePaginatedReservation();
  const { data: response, isLoading, isError, error, refetch, isSuccess } = queryResponse;

  const [currentFilterConfig, setCurrentFilterConfig] = useState<PaginatedReservationParams>(defaultParamConfig);

  const onSubmitFilter = useCallback(
    (filter?: PaginatedReservationParams) => {
      const localFilter = filter ?? defaultParamConfig;
      setCurrentFilterConfig(localFilter);
      updateFilters(localFilter);

      if (isError) {
        toast.error("Error al filtrar reservaciones");
      }
      if (response && isSuccess) {
        toast.success("Reservaciones filtradas correctamente");
      }
    },
    [updateFilters, isError, response, isSuccess]
  );

  // 🔄 Manejar cambios de paginación
  const handlePaginationChange = useCallback(
    (page: number, pageSize: number) => {
      const newFilter: PaginatedReservationParams = {
        ...currentFilterConfig,
        pagination: {
          ...currentFilterConfig.pagination,
          page,
          pageSize,
        },
      };
      setCurrentFilterConfig(newFilter);
      updateFilters(newFilter);
    },
    [currentFilterConfig, updateFilters]
  );

  if (isLoading) return <DataTableSkeleton />;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div className="space-y-4">
      <h1>Lista de Reservaciones</h1>
      <ReservationTable
        data={response?.data || []}
        pagination={response?.pagination || defaultPagination}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}
```

### 3. Componente Wrapper (Table Wrapper)

```typescript
interface ReservationTableProps {
  data: DetailedReservation[];
  pagination: CustomPaginationTableParams;
  onPaginationChange: ServerPaginationChangeEventCallback;
}

export function ReservationTable({
  data,
  pagination,
  onPaginationChange
}: ReservationTableProps) {
  const { user } = useProfile();
  const columns = useMemo(() => reservationColumns(user?.isSuperAdmin || false), [user]);

  return (
    <DataTable
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<DetailedReservation>) => (
        <ReservationTableToolbarActions table={table} />
      )}
      filterPlaceholder="Buscar clientes..."
      facetedFilters={facetedFilters}
      serverPagination={{
        pageIndex: pagination.page - 1, // ⚠️ Convertir de 1-indexed a 0-indexed
        pageSize: pagination.pageSize,
        pageCount: pagination.totalPages,
        total: pagination.total,
        onPaginationChange: (pageIndex, pageSize) => {
          // ⚠️ Convertir de 0-indexed a 1-indexed para el API
          onPaginationChange(pageIndex + 1, pageSize);
        },
      }}
    />
  );
}
```

## 🎯 Props del DataTable

| Prop                | Tipo                                            | Descripción                              | Requerido |
| ------------------- | ----------------------------------------------- | ---------------------------------------- | --------- |
| `columns`           | `ColumnDef<TData, TValue>[]`                    | Definición de columnas de TanStack Table | ✅        |
| `data`              | `TData[]`                                       | Array de datos a mostrar                 | ✅        |
| `toolbarActions`    | `React.ReactNode \| (table) => React.ReactNode` | Acciones personalizadas del toolbar      | ❌        |
| `filterPlaceholder` | `string`                                        | Placeholder del input de búsqueda        | ❌        |
| `facetedFilters`    | `FacetedFilter<TValue>[]`                       | Filtros predefinidos                     | ❌        |
| `serverPagination`  | `ServerPaginationTanstackTableConfig`           | Configuración de paginación del servidor | ❌        |

## 💡 Ejemplos de Uso

### Uso Básico (Sin paginación del servidor)

```typescript
export function BasicTable() {
  const data = [
    { id: 1, name: "Juan", email: "juan@example.com" },
    { id: 2, name: "María", email: "maria@example.com" },
  ];

  const columns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Nombre" },
    { accessorKey: "email", header: "Email" },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      filterPlaceholder="Buscar usuarios..."
    />
  );
}
```

### Con Filtros Facetados

```typescript
const facetedFilters: FacetedFilter<string>[] = [
  {
    column: "status",
    title: "Estado",
    options: [
      { label: "Activo", value: "active" },
      { label: "Inactivo", value: "inactive" },
    ],
  },
];

return (
  <DataTable
    data={data}
    columns={columns}
    facetedFilters={facetedFilters}
  />
);
```

### Con Acciones de Toolbar

```typescript
const toolbarActions = (table: TableInstance<User>) => (
  <div className="flex gap-2">
    <Button onClick={() => exportData(table.getSelectedRowModel().rows)}>
      Exportar Seleccionados
    </Button>
    <Button variant="destructive" onClick={() => deleteSelected(table.getSelectedRowModel().rows)}>
      Eliminar Seleccionados
    </Button>
  </div>
);

return (
  <DataTable
    data={data}
    columns={columns}
    toolbarActions={toolbarActions}
  />
);
```

## ⚠️ Notas Importantes

### Conversión de Índices

- **API Backend**: Generalmente usa paginación 1-indexed (`page: 1, 2, 3...`)
- **TanStack Table**: Usa paginación 0-indexed (`pageIndex: 0, 1, 2...`)

```typescript
// ✅ Conversión correcta
serverPagination={{
  pageIndex: pagination.page - 1,     // API (1-indexed) → TanStack (0-indexed)
  pageSize: pagination.pageSize,
  pageCount: pagination.totalPages,
  total: pagination.total,
  onPaginationChange: (pageIndex, pageSize) => {
    onPaginationChange(pageIndex + 1, pageSize); // TanStack (0-indexed) → API (1-indexed)
  },
}}
```

### Performance Tips

1. **Memoiza las columnas**:

```typescript
const columns = useMemo(() => createColumns(), [dependencies]);
```

2. **Usa callbacks estables**:

```typescript
const handlePaginationChange = useCallback(
    (page, pageSize) => {
        // lógica aquí
    },
    [dependencies],
);
```

3. **Evita recrear objetos en render**:

```typescript
// ❌ Malo - se recrea en cada render
<DataTable serverPagination={{ pageIndex: page - 1, ... }} />

// ✅ Bueno - memoizado
const serverPagination = useMemo(() => ({
  pageIndex: page - 1,
  // ...
}), [page, pageSize, total]);
```

## 🔍 Debugging

Para debuggear problemas de paginación, puedes inspeccionar el estado de la tabla:

```typescript
const table = useReactTable({...});

// En desarrollo
console.log({
  pageIndex: table.getState().pagination.pageIndex,
  pageSize: table.getState().pagination.pageSize,
  pageCount: table.getPageCount(),
  canPreviousPage: table.getCanPreviousPage(),
  canNextPage: table.getCanNextPage(),
});
```

## 📚 Recursos Adicionales

- [TanStack Table Documentation](https://tanstack.com/table/v8)
- [React Hook Form + TanStack Table](https://tanstack.com/table/v8/docs/examples/react/filters)
- [Server-Side Pagination Examples](https://tanstack.com/table/v8/docs/examples/react/pagination)\*\*\*\*
