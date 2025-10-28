# Sistema de Tachado de Filas Completas

Este sistema permite tachar filas completas en el DataTable basándose en campos de la data.

## Características

- ✅ **Tachado de filas completas**: Tacha toda la fila basándose en datos
- ✅ **Configuración simple**: Solo especifica campo y valor o condición
- ✅ **No modifica la estructura**: Solo controla la visualización
- ✅ **Tipado completo**: Soporte completo de TypeScript
- ✅ **Fácil de usar**: Configuración directa y clara

## Uso Básico

### 1. Tachado por Campo Específico

```tsx
import { DataTable } from '@/components/datatable/data-table';

<DataTable columns={columns} data={data} strikethroughField="isDeleted" strikethroughValue={true} />;
```

### 2. Tachado por Estado

```tsx
<DataTable columns={columns} data={data} strikethroughField="status" strikethroughValue="CANCELLED" />
```

### 3. Tachado con Condición Personalizada

```tsx
<DataTable
    columns={columns}
    data={data}
    strikethroughCondition={(row) => row.status === 'CANCELLED' || row.status === 'COMPLETED'}
/>
```

## API Reference

### Props del DataTable

#### `strikethroughField?: keyof TData`

Campo específico para comparar con `strikethroughValue`.

#### `strikethroughValue?: any`

Valor que activa el tachado cuando coincide con el campo.

#### `strikethroughCondition?: (row: TData) => boolean`

Función personalizada para determinar si tachar la fila.

## Ejemplos de Uso

### Transferencias Canceladas/Rechazadas

```tsx
<DataTable
    columns={requestTransferenceColumns()}
    data={transferencias}
    strikethroughCondition={(row) =>
        row.status === 'CANCELED' || row.status === 'REJECTED' || row.arrivalStatus === 'CANCELED'
    }
/>
```

### Productos Eliminados

```tsx
<DataTable columns={productColumns()} data={productos} strikethroughField="isDeleted" strikethroughValue={true} />
```

### Múltiples Condiciones

```tsx
<DataTable
    columns={columns}
    data={data}
    strikethroughCondition={(row) =>
        row.status === 'DELETED' || row.status === 'COMPLETED' || !row.isActive || row.price > 250
    }
/>
```

## Casos de Uso Comunes

### 1. Elementos Desactivados

```tsx
<DataTable columns={columns} data={data} strikethroughField="isActive" strikethroughValue={false} />
```

### 2. Elementos Cancelados

```tsx
<DataTable columns={columns} data={data} strikethroughField="status" strikethroughValue="CANCELLED" />
```

### 3. Elementos Completados

```tsx
<DataTable columns={columns} data={data} strikethroughCondition={(row) => row.status === 'COMPLETED'} />
```

## Estilos Aplicados

Las filas tachadas tienen:

- `line-through`: Texto tachado
- `opacity-60`: Opacidad reducida para indicar estado inactivo

## Ventajas del Sistema

1. **Simple**: Configuración directa y clara
2. **Flexible**: Soporta tanto campos específicos como condiciones complejas
3. **No invasivo**: Solo controla visualización, no modifica datos
4. **Performance**: Evaluación eficiente de condiciones
5. **Mantenible**: Fácil de entender y modificar

## Consideraciones

1. **Un solo método**: Usa `strikethroughField` + `strikethroughValue` O `strikethroughCondition`
2. **Prioridad**: Si usas ambos, `strikethroughCondition` tiene prioridad
3. **Performance**: Las condiciones se evalúan en cada render
4. **Accesibilidad**: Considera agregar indicadores para lectores de pantalla
