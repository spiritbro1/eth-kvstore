import * as React from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
export default function BasicSelect({ option }) {
  const [age, setAge] = React.useState('')

  const handleChange = (event) => {
    setAge(event.target.value)
  }

  return (
    <Box sx={{ minWidth: 120, marginTop: 1 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Public Key</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Public Key"
          onChange={handleChange}
        >
          {option.map((a) => {
            return (
              <MenuItem key={a.publicKey} value={a.publicKey}>
                {a.publicKey}
              </MenuItem>
            )
          })}
        </Select>
        <Button variant="contained">Add Public Key</Button>
      </FormControl>
    </Box>
  )
}
