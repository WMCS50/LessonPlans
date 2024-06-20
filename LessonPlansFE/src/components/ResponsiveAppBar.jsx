/* eslint-disable react/prop-types */

import { Box, Toolbar, Button } from '@mui/material'

const pages = ['Add Text', 'Add Document', 'Add Website', 'Add Video', 'Add Section'];

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