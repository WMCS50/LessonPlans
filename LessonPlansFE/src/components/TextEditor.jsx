import { Editor } from '@tinymce/tinymce-react'
import './ResourceType.css'

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
/*         menubar: false,
        skin: "outside",
        placeholder: "Start Typing",
        content_style: 
          `.mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
            color: rgba(118, 118, 118, 1);
            opacity: 1;
            font-size: 12pt;
          }`,
        plugins: 
          `anchor autolink charmap codesample emoticons image link lists media 
          searchreplace table visualblocks wordcount linkchecker`,
        toolbar: 
          `undo redo | blocks fontfamily fontsize | bold italic underline 
          strikethrough | link table  | spellcheckdialog a11ycheck typography | align 
          lineheight | checklist numlist bullist indent outdent | emoticons 
          charmap | removeformat`, */
          placeholder: "Start Typing",
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