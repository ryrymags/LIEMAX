import type { ComparableCategory, ComparableItem } from '../data/comparables';

interface ItemSelectorProps {
  id: string;
  label: string;
  items: ComparableItem[];
  value: string | null;
  onChange: (id: string) => void;
}

const GROUPS: Array<{ category: ComparableCategory; label: string }> = [
  { category: 'cinema_preset', label: 'Cinema Formats' },
  { category: 'venue', label: 'Specific Venues' },
  { category: 'home_display', label: 'Home Displays' },
];

export function ItemSelector({ id, label, items, value, onChange }: ItemSelectorProps) {
  return (
    <label className="field-label" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value ?? ''} onChange={(event) => onChange(event.target.value)}>
        <option value="" disabled>
          Select an item
        </option>
        {GROUPS.map((group) => {
          const groupItems = items.filter((item) => item.category === group.category);
          if (groupItems.length === 0) return null;

          return (
            <optgroup key={group.category} label={group.label}>
              {groupItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}{item.sublabel ? ` - ${item.sublabel}` : ''}
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
    </label>
  );
}
