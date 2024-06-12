/* eslint-disable react/prop-types */

import { Box, Toolbar, Button } from '@mui/material'

const pages = ['Add Text', 'Add Document', 'Add Website', 'Add Video'];

const ResponsiveAppBar = ({ setActiveForm, resourcesLength }) => {

  //closes the navigation menu and sets the active form
  const handleCloseNavMenu = (page) => {
    if (page) {
      setActiveForm({ type: page, index: resourcesLength })
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Toolbar disableGutters>
        <Box sx={{ 
          backgroundColor: '#f5f5f5', borderRadius: '8px', height: '32px',
          flexGrow: 1, display: 'flex', justifyContent: 'center', 
          alignItems: 'center'}}>
          {pages.map((page) => (
            <Button
              key={page}
              onClick={() => handleCloseNavMenu(page)}
              sx={{ 
                color: 'black', display: 'block', fontSize: '0.75rem', 
                padding: '0px 12px', lineHeight: '32px' }}
            >
              {page}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </Box>
)

}
export default ResponsiveAppBar

/*older version that included Menu when small screen and AppBar
import { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import UserMenu from './UserMenu'
import {
  AppBar, Box, Toolbar, IconButton, Typography, Menu,
  Container, Button, MenuItem
} from '@mui/material'

const pages = ['Add Text', 'Add Document', 'Add Website', 'Add Video'];

const ResponsiveAppBar = ({ setActiveForm, resourcesLength }) => {
  console.log('length2', resourcesLength)
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  //closes the navigation menu and sets the active form
  const handleCloseNavMenu = (page) => {
    setAnchorElNav(null);
    if (page) {
      setActiveForm({ type: page, index: resourcesLength })
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={() => handleCloseNavMenu(null)}
              sx={{
                display: { xs: 'block', sm: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', sm: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Create
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleCloseNavMenu(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <UserMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar
*/