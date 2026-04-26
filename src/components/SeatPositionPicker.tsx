import type { SeatPosition } from '../lib/computeMetrics';

interface SeatPositionPickerProps {
  value: SeatPosition;
  onChange: (value: SeatPosition) => void;
}

const OPTIONS: Array<{ value: SeatPosition; label: string }> = [
  { value: 'front', label: 'Front' },
  { value: 'mid', label: 'Mid' },
  { value: 'back', label: 'Back' },
];

export function SeatPositionPicker({ value, onChange }: SeatPositionPickerProps) {
  return (
    <fieldset className="seat-picker">
      <legend>Seat position</legend>
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
      <p>Home displays ignore seat position.</p>
    </fieldset>
  );
}
