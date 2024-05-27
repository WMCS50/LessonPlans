/* eslint-disable react/prop-types */

const DocumentDisplay = ({ title, link }) => {
  const handlePopOut = () => {
    console.log('button clicked')
    console.log('Opening link:', link)
    const newWindow = window.open(link, '_blank', 'noopener,noreferrer')
    if (newWindow) {
      newWindow.opener = null
    } else {
      console.error('Failed to open new window');
    }
  }

  return (
    <div className='document-display'>
      <h3>{title}</h3>
      <iframe
        src={link}
        width='100%'
        height='200px'
        title="Document Preview"
        loading='lazy'
      ></iframe>
    <button onClick={handlePopOut}>View Full Document</button>
    </div>
  )
}

export default DocumentDisplay
