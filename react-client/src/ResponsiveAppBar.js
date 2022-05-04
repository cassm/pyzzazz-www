import * as React from 'react';
import {Link} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Logo from "./logo";
import {Grid} from "@mui/material";

const pages = ['status', 'configuration', 'visualiser'];

const ResponsiveAppBar = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Grid container={true} wrap='nowrap' direction='row' justifyContent='space-between' gap='2rem' alignItems='center'>
            <Grid container={true} wrap='nowrap' direction='row' justifyContent='center' flexShrink='0' width='33%' gap='2rem' alignItems='center'>
              <Logo size="55" minWidth='55' darkMode={true} gradient={false} key="navLogo"/>
              <Typography
                variant="h2"
                noWrap
              >
                Pyzzazz
              </Typography>
            </Grid>
            <Grid container={true} wrap='nowrap' direction='row' justifyContent='flex-end' gap='4rem' alignItems='center'>
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
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;