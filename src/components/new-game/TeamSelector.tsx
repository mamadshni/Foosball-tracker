import { Autocomplete, Box, Chip, TextField, Typography, Stack } from "@mui/material";
import type { Player } from "../../types/models";

interface Props {
  label: string;
  value: Player[];
  options: Player[];
  limit: number;
  onChange: (value: Player[]) => void;
}

export default function TeamSelector({ label, value, options, limit, onChange }: Props) {
  const handleChange = (_: unknown, newValue: Player[]) => {
    onChange(newValue.slice(0, limit));
  };

  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h6" gutterBottom>{label}</Typography>
      <Autocomplete
        multiple
        options={options}
        getOptionLabel={(o) => o.name}
        value={value}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField {...params} label={`${label} (${value.length}/${limit})`} />
        )}
      />
      {value.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
          {value.map((p) => (
            <Chip key={p.id} label={p.name} onDelete={() => onChange(value.filter((x) => x.id !== p.id))} />
          ))}
        </Stack>
      )}
    </Box>
  );
}

