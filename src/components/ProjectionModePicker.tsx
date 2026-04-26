import type { ResolvedProjection } from '../math';

interface ProjectionOption {
  id: string;
  label: string;
  sublabel?: string;
  projection: ResolvedProjection;
}

interface ProjectionModePickerProps {
  options: ProjectionOption[];
  value: string | null;
  onChange: (id: string) => void;
}

export function ProjectionModePicker({ options, value, onChange }: ProjectionModePickerProps) {
  if (options.length <= 1) return null;

  return (
    <fieldset className="projection-picker">
      <legend>Projection</legend>
      <div className="projection-options" role="group" aria-label="Projection mode">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={option.id === value ? 'is-active' : ''}
            onClick={() => onChange(option.id)}
            title={option.sublabel}
          >
            <span>{option.label}</span>
            {option.sublabel ? <small>{option.sublabel}</small> : null}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
