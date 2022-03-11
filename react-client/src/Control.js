import ControlPanel from './ControlPanel';
import Typography from "@mui/material/Typography";
import React from "react";
import Box from "@mui/material/Box";

const Control = props => {
  return (
    <Box width='75%' height='100%' sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Typography variant="h3" color="primary" sx={{my: 4}}>Control</Typography>
      <ControlPanel/>
    </Box>
  );
}

export default Control;