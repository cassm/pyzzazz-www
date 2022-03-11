import * as React from 'react';
import {Link} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Logo from "./logo";
import ControlDrawer from "./ControlDrawer";
import {Grid} from "@mui/material";

const pages = ['status', 'configuration', 'control', 'visualiser'];

const ResponsiveAppBar = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Grid container={true} wrap='nowrap' direction='row' justifyContent='space-around' gap='2rem' alignItems='center'>
            <Logo size="55" darkMode={true} gradient={false} key="navLogo"/>
            <Typography
              variant="h2"
              noWrap
            >
              Pyzzazz
            </Typography>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: "space-around" }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  component={Link}
                  to={`/${page}`}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  <Typography
                    variant="h5"
                    noWrap
                  >
                  {page}
                  </Typography>
                </Button>
              ))}
            </Box>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;