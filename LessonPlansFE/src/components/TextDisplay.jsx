/* eslint-disable react/prop-types */
import './ComponentDisplay.css'

import DOMPurify from 'dompurify'
import parse from 'html-react-parser'

const TextDisplay = ({ title, content }) => {

  const sanitizedContent = DOMPurify.sanitize(content)
  const parsedContent = parse(sanitizedContent)

  return (
    <div className='text-display' >
      <div className='header'>
        <h3>{title}</h3>
      </div>
      <div className='content-display' >{parsedContent}</div>
    </div>
  )
}

export default TextDisplay
