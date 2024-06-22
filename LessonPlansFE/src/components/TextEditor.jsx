import { Editor } from '@tinymce/tinymce-react'
import './ComponentDisplay.css'

const TextEditor = ({ initialValue, onEditorChange, className }) => { // eslint-disable-line react/prop-types
  const handleEditorChange = (content, editor) => {
    const htmlContent = editor.getContent()
    onEditorChange(htmlContent)
  }

  return (
    <div className={className}>
    <Editor
      apiKey={import.meta.env.VITE_TINY_MCE_API_KEY}
      initialValue={initialValue}
      inline={true}
      init={{
        menubar: false,
        plugins: 
          `anchor autolink charmap codesample emoticons image link lists media 
          searchreplace table visualblocks wordcount linkchecker`,
        toolbar: 
          `undo redo | blocks fontfamily fontsize | bold italic underline 
          strikethrough | link table  | spellcheckdialog a11ycheck typography | align 
          lineheight | checklist numlist bullist indent outdent | emoticons 
          charmap | removeformat`,
      }}   
      onEditorChange={handleEditorChange}
    />
    </div>
  )
}

export default TextEditor