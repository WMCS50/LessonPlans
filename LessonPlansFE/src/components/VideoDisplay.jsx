/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'

const VideoDisplay = ({ title, link, startTime, endTime }) => {
  const [embedLink, setEmbedLink] = useState('')
  const [isValidUrl, setIsValidUrl] = useState(true)
  const [videoStart, setVideoStart] = useState(null)
  const [videoEnd, setVideoEnd] = useState(null)
  
  useEffect(() => {
    //function to extract video id and create an embedded video url if necessary
    const createEmbedLink = (link) => {
      try {
        const url = new URL(link)
        const href = url.href
        console.log('url url', url)
        let videoId

        if (href.includes('www.youtube.com') && url.searchParams.has('v')) {
          videoId = url.searchParams.get('v')
          return `https://www.youtube.com/embed/${videoId}`
        } else if (href.includes('youtu.be')) {
          videoId = url.pathname.slice(1)
          return `https://www.youtube.com/embed/${videoId}`
        } else if (href.includes('embed')) {
          console.log('embedLink', url.toString())
          return url.toString()
        } else {
          throw new Error('Invalid Youtube URL')
        }  
      } catch (error) {
        console.error('Invalid URL', error)
        setIsValidUrl(false)
        return null
      }
    }
    console.log('video times1', {startTime, endTime})

    startTime && setVideoStart(startTime)
    endTime && setVideoEnd(endTime)
    console.log('video times2', {videoStart, videoEnd})
    const embedLink = createEmbedLink(link, videoStart, videoEnd);

    console.log('embedLink', embedLink)
    if (embedLink) {
      setEmbedLink(embedLink)
      setIsValidUrl(true)
    }
  }, [link, videoStart, videoEnd])
  

  const handlePopOut = () => {
    console.log('button clicked')
    console.log('Opening link:', link)
    
    const newWindow = window.open(link, '_blank')
    if (newWindow) {
      newWindow.opener = null
    } else {
      console.error('Failed to open new window')
    }
  };

  return (
    <div className='video-display'>
      <h3>{title}</h3>
      <p>Time Interval: {startTime} - {endTime}</p>
      {isValidUrl ? (
        <iframe
          src={embedLink}
          width='560'
          height='315' 
          title='Video Preview'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' 
          referrerPolicy='strict-origin-when-cross-origin'
          allowFullScreen
        ></iframe>
        ) : (
          <p>Please enter a valid Youtube URL</p>
        )}

      <button onClick={handlePopOut}>View in another window</button>
    </div>


  )
}

export default VideoDisplay