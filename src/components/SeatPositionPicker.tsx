import type { SeatPosition } from '../lib/computeMetrics';

interface SeatPositionPickerProps {
  value: SeatPosition;
  onChange: (value: SeatPosition) => void;
  legend?: string;
  note?: string | null;
}

const OPTIONS: Array<{ value: SeatPosition; label: string }> = [
  { value: 'front', label: 'Front' },
  { value: 'mid', label: 'Mid' },
  { value: 'back', label: 'Back' },
];

export function SeatPositionPicker({ value, onChange, legend = 'Seat position', note = 'Home displays ignore seat position.' }: SeatPositionPickerProps) {
  return (
    <fieldset className="seat-picker">
      <legend>{legend}</legend>
      <div className="segmented-control" role="group" aria-label="Seat position">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={option.value === value ? 'is-active' : ''}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {note ? <p>{note}</p> : null}
    </fieldset>
  );
}
