import { useState } from 'react'

const AddWebsite = ({ onAddResource }) => { // eslint-disable-line react/prop-types
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')

  const handleAdd = () => {
    onAddResource({
      type: 'website',
      title,
      link
    })
    setTitle('')
    setLink('')
  }

  return (
    <div>
      <input 
        type='text'
        placeholder="Enter title for website"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type='text'
        placeholder="Enter website link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <button onClick={handleAdd}>+</button>
    </div>
  )
}

export default AddWebsite