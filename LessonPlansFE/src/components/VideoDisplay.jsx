import { useState, useEffect } from 'react'
import './ResourceType.css'

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
      console.log('video times', { videoStart, videoEnd })
      console.log('embedLinkFinal', embedLink)
      setIsValidUrl(true)
    }

  }, [link, startTime, endTime, videoStart, videoEnd, embedLink])

  return (
    <div className='video-display'>
      <div className='header'>
        <h3>{title}</h3>
        <p>(Time Interval: {startTime} - {endTime})</p>
      </div>
      {isValidUrl ? (
        <div className='video-wrapper'>
          <iframe
            src={embedLink}
            title='Video Preview'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            referrerPolicy='strict-origin-when-cross-origin'
            allowFullScreen
            loading='lazy'
          ></iframe>
        </div>
      ) : (
        <p>Please enter a valid Youtube URL</p>
      )}
    </div>
  )
}

export default VideoDisplay