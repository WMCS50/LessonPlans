/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import axios from 'axios'
import './ResourceType.css'


const WebsiteDisplay = ({ title, link }) => {
  const [metadata, setMetadata] = useState(null)
  const [isValidUrl, setIsValidUrl] = useState(true)
  
  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/og-metadata?url=${encodeURIComponent(link)}`)
        console.log('response data', response.data)
        setMetadata(response.data)
        setIsValidUrl(true)
      } catch (error) {
        console.error('Failed to fetch metadata', error)
        setIsValidUrl(false)
      }
    }
    fetchMetaData()
  }, [link])

   const getImageUrl = (ogImage) => {
    if (Array.isArray(ogImage)) {
      return ogImage[0]?.url
    } else if (ogImage && ogImage.url) {
      return ogImage.url
    } else 
      console.log('no pic')
      return null
  }

  return (
    <div className='website-display'>
      <h3>
        <a className='website-display-link' 
          href={link} target='blank' rel='noopener noreferrer'>
          {metadata?.ogTitle || title}
        </a>
      </h3>

      {isValidUrl && metadata ? (
        <div className='website-display-metadata'>
          <p>{metadata.ogUrl}</p>
          <img 
            src={getImageUrl(metadata.ogImage)} 
            alt={metadata.ogTitle}
          />
          {metadata.ogDescription && <p>{metadata.ogDescription}</p>}
        </div>
      ) : (
        <p>Website preview is not available. Click on link to open.</p>
      )}
    </div>
  )
}

export default WebsiteDisplay
