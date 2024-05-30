/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Box, IconButton, Avatar, Menu, MenuItem, Tooltip, Typography } from '@mui/material'

const items = ['Profile', 'Dashboard', 'Logout'];

const UserMenu = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const username = useSelector((state) => state.auth.user?.user.username || 'b')
  const navigate = useNavigate()

  const handleCloseMenu = () => {
    setAnchorElUser(null)
  }

  const handleItemClick = (item) => {
    handleCloseMenu()
    if (item === 'Dashboard') {
      navigate('/lessons')
    }
  }

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0 }}>
          <Avatar>{username.charAt(0).toUpperCase()} </Avatar> 
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseMenu}
      >
        {items.map((item) => (
          <MenuItem key={item} onClick={() => handleItemClick(item)}>
            <Typography textAlign="center">{item}</Typography>
          </MenuItem>))}
      </Menu>
    </Box>

  );
}
export default UserMenu;
