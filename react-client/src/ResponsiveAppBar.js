import * as React from 'react';
import {Link} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Logo from "./logo";

const pages = ['status', 'configuration', 'control', 'visualiser'];

const ResponsiveAppBar = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{alignItems: "center"}}>
          <Box sx={{ml: 3, my: 2}}>
            <Logo size="55" darkMode={true} gradient={false} key="navLogo"/>
          </Box>
          <Typography
            variant="h2"
            noWrap
            component="div"
            sx={{ ml: 3, display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}
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
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;