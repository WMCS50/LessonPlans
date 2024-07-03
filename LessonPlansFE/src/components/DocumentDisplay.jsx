/* eslint-disable react/prop-types */
import './ResourceType.css'

const DocumentDisplay = ({ title, link }) => {
  return (
    <div className='document-display'>
      <div className='header'>
        <h3>{title}</h3>
      </div>
      <iframe
        src={link}
        width='100%'
        height='200px'
        title="Document Preview"
        loading='lazy'
      ></iframe>
    </div>
  )
}

export default DocumentDisplay
