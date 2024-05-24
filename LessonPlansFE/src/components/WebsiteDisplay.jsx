/* eslint-disable react/prop-types */
import { useState } from 'react'
const WebsiteDisplay = ({ title, link }) => {
  const [embedError, setEmbedError] = useState(false)
  
  const handlePopOut = () => {
    console.log('button clicked')
    console.log('Opening link:', link)
    const newWindow = window.open(link, '_blank', 'noopener,noreferrer')
    if (newWindow) {
      newWindow.opener = null
    } else {
      console.error('Failed to open new window')
    }
  };

const handleIframeError = () => {
  setEmbedError(true)
}

  return (
    <div className='website-display'>
      <h3>{title}</h3>
      {embedError ? (
        <div>
          <p>Unable to display a preview of this website; open in new window</p>
        </div>
      ) : (
      <iframe
        src={link}
        width='100%'
        height='250px'
        title="Website Preview"
        referrerPolicy="strict-origin-when-cross-origin" 
        onError={handleIframeError}
      ></iframe>
      )}
      <button onClick={handlePopOut}>View in another window</button>
    </div>
  )
}

export default WebsiteDisplay
