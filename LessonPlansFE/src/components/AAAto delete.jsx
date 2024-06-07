<AppBar position="static">
  <Container maxWidth="xl">
    <Toolbar disableGutters className='toolbar-no-gutters'>
      <Box className='app-bar-display-flex' sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' } }}>
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
          sx={{ display: { xs: 'block', sm: 'none' } }}
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
        className='typography-settings'
        sx={{ mr: 2, display: { xs: 'flex', sm: 'none' }, flexGrow: 1 }}
      >
        Create
      </Typography>
      <Box className='app-bar-display-flex' sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
        {pages.map((page) => (
          <Button
            key={page}
            onClick={() => handleCloseNavMenu(page)}
            className='button-spacing'
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