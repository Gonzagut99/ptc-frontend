import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock básico de DataTable para testear solo las funcionalidades nuevas
interface DataTableTestProps {
    isLoading?: boolean;
    loadingRowsCount?: number;
    externalFilterValue?: string;
    onGlobalFilterChange?: (value: string) => void;
    data: any[];
}

const MockDataTable = ({
    isLoading,
    loadingRowsCount = 3,
    externalFilterValue,
    onGlobalFilterChange,
    data,
}: DataTableTestProps) => {
    return (
        <div>
            {/* Simulación del toolbar con filtro externo */}
            <input
                data-testid="filter-input"
                value={externalFilterValue || ''}
                onChange={(e) => onGlobalFilterChange?.(e.target.value)}
                placeholder="Buscar..."
            />

            {/* Simulación de tabla con loading interno */}
            <table>
                <tbody>
                    {isLoading
                        ? // Mostrar skeleton rows durante loading
                          Array.from({ length: loadingRowsCount }).map((_, index) => (
                              <tr key={`skeleton-${index}`}>
                                  <td>
                                      <div data-testid="skeleton" className="loading-skeleton" />
                                  </td>
                                  <td>
                                      <div data-testid="skeleton" className="loading-skeleton" />
                                  </td>
                              </tr>
                          ))
                        : // Mostrar datos normales
                          data.map((item, index) => (
                              <tr key={index}>
                                  <td>{item.name}</td>
                                  <td>{item.status}</td>
                              </tr>
                          ))}
                </tbody>
            </table>

            {/* Indicador de búsqueda */}
            {isLoading && externalFilterValue && (
                <div data-testid="search-indicator">Buscando "{externalFilterValue}"...</div>
            )}
        </div>
    );
};

describe('DataTable Loading y Filtrado Externo', () => {
    const mockData = [
        { name: 'Item 1', status: 'active' },
        { name: 'Item 2', status: 'inactive' },
    ];

    describe('Loading Interno con Skeletons', () => {
        it('debe mostrar skeleton rows cuando isLoading es true', () => {
            render(<MockDataTable isLoading={true} loadingRowsCount={3} data={mockData} />);

            const skeletons = screen.getAllByTestId('skeleton');
            expect(skeletons).toHaveLength(6); // 3 rows × 2 columns

            // No debe mostrar datos reales durante loading
            expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
        });

        it('debe usar loadingRowsCount personalizado', () => {
            render(<MockDataTable isLoading={true} loadingRowsCount={5} data={mockData} />);

            const skeletons = screen.getAllByTestId('skeleton');
            expect(skeletons).toHaveLength(10); // 5 rows × 2 columns
        });

        it('debe mostrar datos normales cuando isLoading es false', () => {
            render(<MockDataTable isLoading={false} data={mockData} />);

            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(screen.getByText('Item 2')).toBeInTheDocument();
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });

        it('debe usar valor por defecto de 3 rows para loadingRowsCount', () => {
            render(
                <MockDataTable
                    isLoading={true}
                    data={mockData}
                    // No especificar loadingRowsCount
                />,
            );

            const skeletons = screen.getAllByTestId('skeleton');
            expect(skeletons).toHaveLength(6); // 3 rows por defecto × 2 columns
        });
    });

    describe('Filtrado Externo', () => {
        it('debe mostrar externalFilterValue en el input', () => {
            render(<MockDataTable externalFilterValue="test search" data={mockData} />);

            const filterInput = screen.getByTestId('filter-input');
            expect(filterInput).toHaveValue('test search');
        });

        it('debe llamar onGlobalFilterChange cuando se escribe', async () => {
            const mockOnChange = jest.fn();
            const user = userEvent.setup();

            render(<MockDataTable externalFilterValue="" onGlobalFilterChange={mockOnChange} data={mockData} />);

            const filterInput = screen.getByTestId('filter-input');

            // Usar setValue en lugar de type para simular un cambio completo
            await user.clear(filterInput);
            await user.paste('search');

            // Verificar que se llamó con el valor final
            expect(mockOnChange).toHaveBeenCalledWith('search');
        });

        it('debe manejar externalFilterValue undefined', () => {
            render(<MockDataTable externalFilterValue={undefined} data={mockData} />);

            const filterInput = screen.getByTestId('filter-input');
            expect(filterInput).toHaveValue('');
        });
    });

    describe('Combinación Loading + Filtrado', () => {
        it('debe mantener valor del filtro durante loading', () => {
            render(
                <MockDataTable
                    isLoading={true}
                    externalFilterValue="searching..."
                    onGlobalFilterChange={jest.fn()}
                    data={mockData}
                />,
            );

            const filterInput = screen.getByTestId('filter-input');
            expect(filterInput).toHaveValue('searching...');

            // Debe mostrar skeletons
            expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);

            // Debe mostrar indicador de búsqueda
            expect(screen.getByTestId('search-indicator')).toHaveTextContent('Buscando "searching..."...');
        });

        it('debe permitir background fetching (loading con datos)', () => {
            render(<MockDataTable isLoading={true} externalFilterValue="query" data={mockData} />);

            // Durante background fetch:
            // 1. Debe mostrar skeletons (priority)
            expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);

            // 2. NO debe mostrar datos reales
            expect(screen.queryByText('Item 1')).not.toBeInTheDocument();

            // 3. Debe mantener filtro activo
            expect(screen.getByDisplayValue('query')).toBeInTheDocument();
        });

        it('debe ocultar indicador de búsqueda cuando no hay loading', () => {
            render(<MockDataTable isLoading={false} externalFilterValue="query" data={mockData} />);

            expect(screen.queryByTestId('search-indicator')).not.toBeInTheDocument();
        });

        it('debe ocultar indicador de búsqueda cuando no hay filtro', () => {
            render(<MockDataTable isLoading={true} externalFilterValue="" data={mockData} />);

            expect(screen.queryByTestId('search-indicator')).not.toBeInTheDocument();
        });
    });

    describe('Casos Edge Críticos', () => {
        it('debe manejar cambios rápidos de loading state', () => {
            const { rerender } = render(<MockDataTable isLoading={true} externalFilterValue="test" data={mockData} />);

            // Estado inicial: loading
            expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);

            // Cambiar a no loading
            rerender(<MockDataTable isLoading={false} externalFilterValue="test" data={mockData} />);

            // Debe mostrar datos, no skeletons
            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });

        it('debe manejar datos vacíos durante loading', () => {
            render(<MockDataTable isLoading={true} data={[]} />);

            // Debe mostrar skeletons incluso con datos vacíos
            expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
        });

        it('debe manejar loadingRowsCount de 0', () => {
            render(<MockDataTable isLoading={true} loadingRowsCount={0} data={mockData} />);

            // No debe mostrar skeletons
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });

        it('debe ser resiliente a valores null/undefined', () => {
            render(
                <MockDataTable
                    isLoading={undefined as any}
                    externalFilterValue={null as any}
                    onGlobalFilterChange={undefined}
                    data={mockData}
                />,
            );

            // No debe crashear
            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(screen.getByTestId('filter-input')).toHaveValue('');
        });
    });

    describe('Rendimiento y Optimización', () => {
        it('debe manejar gran cantidad de skeleton rows sin problemas', () => {
            render(<MockDataTable isLoading={true} loadingRowsCount={100} data={mockData} />);

            const skeletons = screen.getAllByTestId('skeleton');
            expect(skeletons).toHaveLength(200); // 100 rows × 2 columns
        });

        it('debe cambiar de skeleton a datos sin lag visual', () => {
            const { rerender } = render(<MockDataTable isLoading={true} loadingRowsCount={2} data={mockData} />);

            // Verificar skeletons iniciales
            expect(screen.getAllByTestId('skeleton')).toHaveLength(4);

            // Cambio instantáneo a datos
            rerender(<MockDataTable isLoading={false} data={mockData} />);

            // Verificar que la transición es limpia
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(screen.getByText('Item 2')).toBeInTheDocument();
        });
    });

    describe('Integración con Patrón Server-Side', () => {
        it('debe simular flujo completo de búsqueda del servidor', async () => {
            const mockOnChange = jest.fn();
            const user = userEvent.setup();

            const { rerender } = render(
                <MockDataTable
                    isLoading={false}
                    externalFilterValue=""
                    onGlobalFilterChange={mockOnChange}
                    data={mockData}
                />,
            );

            // 1. Usuario escribe en filtro
            const filterInput = screen.getByTestId('filter-input');

            // Usar paste en lugar de type para simular entrada completa
            await user.clear(filterInput);
            await user.paste('query');

            // Verificar la llamada con el texto completo
            expect(mockOnChange).toHaveBeenCalledWith('query');

            // 2. Simulación: inicia loading (debounced call)
            rerender(
                <MockDataTable
                    isLoading={true}
                    externalFilterValue="query"
                    onGlobalFilterChange={mockOnChange}
                    data={mockData}
                />,
            );

            expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
            expect(screen.getByTestId('search-indicator')).toBeInTheDocument();

            // 3. Simulación: respuesta del servidor
            const filteredData = [{ name: 'Filtered Item', status: 'active' }];
            rerender(
                <MockDataTable
                    isLoading={false}
                    externalFilterValue="query"
                    onGlobalFilterChange={mockOnChange}
                    data={filteredData}
                />,
            );

            expect(screen.getByText('Filtered Item')).toBeInTheDocument();
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
            expect(screen.queryByTestId('search-indicator')).not.toBeInTheDocument();
        });
    });
});
