export type FacetedFilter<TValue> = {
    column: string;
    title: string;
    options: {
        label: string;
        value: TValue;
        icon?: React.ComponentType<{ className?: string }>;
    }[];
    onFilterChange?: (value: TValue | TValue[] | undefined | unknown) => void;
    filterStrategy?: 'checkbox-group' | 'radio-group';
};
