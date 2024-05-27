/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react'

const WebsiteDisplay = ({ title, link }) => {
  const [embedError, setEmbedError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const timeoutRef = useRef(null)

  const handleLoad = () => {
    clearTimeout(timeoutRef.current)
    setIsLoading(false)
    setEmbedError(false)
  }

  const handleTimeout = () => {
    setIsLoading(false)
    setEmbedError(true)
  }

  useEffect(() => {
    setIsLoading(true)
    setEmbedError(true)
    timeoutRef.current = setTimeout(handleTimeout, 3000)
    return () => clearTimeout(timeoutRef.current)
  }, [link])

  const handlePopOut = () => {
    console.log('Opening link:', link)
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className='website-display'>
      <h3>{title}</h3>
      {isLoading && <p>Loading ...</p>}
      {embedError && !isLoading ? (
        <p>Unable to display preview; open in new windor</p>
      ) : (
      <iframe
        src={link}
        width='100%'
        height='250px'
        title="Website Preview"
        referrerPolicy="strict-origin-when-cross-origin"
        loading='lazy'
        onLoad={handleLoad}
      ></iframe>
      )}
      <button onClick={handlePopOut}>View in another window</button>
    </div>
  )
}

export default WebsiteDisplay
