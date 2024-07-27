import { Editor } from '@tinymce/tinymce-react'
import './ResourceType.css'

const TextEditor = ({ initialValue, onEditorChange, className }) => {
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
          placeholder: 'Start Typing',
          menubar: false,
          inline: true,
          toolbar_sticky: true,
          toolbar_sticky_offset: 110,
          plugins: ['link', 'lists', 'autolink'],
          toolbar: [
            'undo redo | bold italic underline | fontfamily fontsize',
            'forecolor backcolor | alignleft aligncenter alignright alignfull | numlist bullist outdent indent'
          ],
          valid_elements: 'p[style],strong,em,span[style],a[href],ul,ol,li',
          valid_styles: {
            '*': 'font-size,font-family,color,text-decoration,text-align'
          },
        }}
        onEditorChange={handleEditorChange}
      />
    </div>
  )
}

export default TextEditor