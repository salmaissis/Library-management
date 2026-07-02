import { InputAdornment, TextField } from '@mui/material';
import { FiSearch } from 'react-icons/fi';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  sx,
}) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      size="small"
      sx={{ minWidth: 260, ...sx }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FiSearch size={16} />
          </InputAdornment>
        ),
      }}
    />
  );
}
