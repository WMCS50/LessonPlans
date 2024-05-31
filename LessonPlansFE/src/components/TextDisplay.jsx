/* eslint-disable react/prop-types */
import DOMPurify from 'dompurify'
import parse from 'html-react-parser'

const TextDisplay = ({ title, content }) => {

  const sanitizedContent = DOMPurify.sanitize(content)
  const parsedContent = parse(sanitizedContent)

  return (
    <div className='text-display' >
      <h3>{title}</h3>
      <div className='content-display' style={{ textAlign: 'left'}} >{parsedContent}</div>
    </div>
  )
}

export default TextDisplay
