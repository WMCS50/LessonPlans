import { useState } from 'react'

const PictureDisplay = ({ title, link, content }) => {
  const [imgError, setImgError] = useState(false)

  return (
    <div className='picture-display'>
      {title && <p>{title}</p>}
      {!imgError ? (
        <img
          src={link}
          alt={title}
          style={{ width: '300px', height: 'auto' }}
          onError={() => setImgError(true)}
        />
      ) : (
        <p>Image not available</p>
      )}
      <p>{content}</p>

    </div>
  )
}

export default PictureDisplay