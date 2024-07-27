import { useState, useEffect } from 'react'
import DOMPurify from 'dompurify'
import TextEditor from './TextEditor'
import { useDispatch } from 'react-redux'
import { updateResource } from '../features/lessons/resourcesSlice'

const TextDisplay = ({ resource, readOnly = false }) => {
  const [initialText, setInitialText] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    setTimeout(() => setInitialText(resource.content), 500)
  // had to follow TinyMCE documentation here precisely
  // in setting initial value as it doesn't work otherwise
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpdateTextContent = (content) => {
    const sanitizedContent = DOMPurify.sanitize(content)
    dispatch(updateResource({ resourceId: resource.id, content: sanitizedContent }))
  }

  if (readOnly) {
    return (
      <div className="text-display-container" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(resource.content) }} />
    )
  }

  return (
    <TextEditor className='text-editor-container'
      initialValue={initialText}
      onEditorChange={handleUpdateTextContent}
    />
  )
}

export default TextDisplay