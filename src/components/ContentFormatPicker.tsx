import type { ContentFormat } from '../math';

interface ContentFormatPickerProps {
  contentFormats: ContentFormat[];
  selectedId: string;
  onChange: (id: string) => void;
}

export function ContentFormatPicker({ contentFormats, selectedId, onChange }: ContentFormatPickerProps) {
  return (
    <label className="field-label control-field" htmlFor="content-format">
      <span>Content format</span>
      <select id="content-format" value={selectedId} onChange={(event) => onChange(event.target.value)}>
        {contentFormats.map((format) => (
          <option key={format.id} value={format.id}>
            {format.display_name}
          </option>
        ))}
      </select>
    </label>
  );
}
