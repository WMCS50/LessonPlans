/* eslint-disable react/prop-types */
import { useState } from 'react'

import { Box, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
//placeholder logo
import SchoolIcon from '@mui/icons-material/School'
import { green } from '@mui/material/colors'

//const items = ['Save', 'Save As New', 'Create New', 'Open', 'Share'];

const FileMenu = ({ items, onItemClick }) => {
  const [anchorElUser, setAnchorElUser] = useState(null)

  const handleCloseMenu = () => {
    setAnchorElUser(null)
  }

  const handleItemClick = (item) => {
    handleCloseMenu()
    //logic of what to do on click here
    console.log('item clicked', item)
    onItemClick(item)
  }

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open file menu">
        <SchoolIcon 
          sx={{ width: 50, height: 50, color: green[900], marginRight: 5 }}
          onClick={(e) => setAnchorElUser(e.currentTarget)} >
        </SchoolIcon>
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
  )
}
export default FileMenu
