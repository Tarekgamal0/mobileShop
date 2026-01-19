import { InputAdornment, Paper, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchField({ placeholder, searchTerm, onChange }) {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={searchTerm}
        onChange={onChange}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ direction: "ltr" }}
      />
    </Paper>
  );
}
