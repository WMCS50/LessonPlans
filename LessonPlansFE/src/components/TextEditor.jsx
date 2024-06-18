import { Editor } from '@tinymce/tinymce-react'

const TextEditor = ({ initialValue, onContentChange }) => { // eslint-disable-line react/prop-types
  
  return (
    <Editor
      apiKey={import.meta.env.VITE_TINY_MCE_API_KEY}
      initialValue={initialValue}
      init={{
        height: 300,
        width: 500,           
        plugins: 
          `anchor autolink charmap codesample emoticons image link lists media 
          searchreplace table visualblocks wordcount linkchecker`,
        toolbar: 
          `undo redo | blocks fontfamily fontsize | bold italic underline 
          strikethrough | link image media table mergetags | addcomment 
          showcomments | spellcheckdialog a11ycheck typography | align 
          lineheight | checklist numlist bullist indent outdent | emoticons 
          charmap | removeformat`,
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
          { value: 'First.Name', title: 'First Name' },
          { value: 'Email', title: 'Email' },
        ],
        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
      }}   
      onChange={onContentChange}
    />
  )
}

export default TextEditor