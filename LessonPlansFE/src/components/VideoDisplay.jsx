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
      startTime && setVideoStart(startTime)
      endTime && setVideoEnd(endTime)
     
      try {
        const url = new URL(link)
        const href = url.href
        let videoId

        if (href.includes('www.youtube.com') && url.searchParams.has('v')) {
          videoId = url.searchParams.get('v')
          return `https://www.youtube.com/embed/${videoId}`
        } else if (href.includes('youtu.be')) {
          videoId = url.pathname.slice(1)
          return `https://www.youtube.com/embed/${videoId}`
        } else if (href.includes('embed')) {
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

    const embedLinkExTimes = createEmbedLink(link)
 
    if (embedLinkExTimes) {
      setEmbedLink(`${embedLinkExTimes}?start=${videoStart}&end=${videoEnd}`)
      console.log('video times', {videoStart, videoEnd})
      console.log('embedLinkFinal', embedLink)
      setIsValidUrl(true)
    }
    
  }, [link, startTime, endTime, videoStart, videoEnd, embedLink])
  

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
          loading='lazy'
        ></iframe>
        ) : (
          <p>Please enter a valid Youtube URL</p>
        )}

      <button onClick={handlePopOut}>View in another window</button>
    </div>


  )
}

export default VideoDisplay