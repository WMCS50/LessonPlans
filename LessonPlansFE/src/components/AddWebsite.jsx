import { useState } from 'react'

const AddWebsite = () => {
  const [link, setLink] = useState('')

  const handleAdd = () => {
    console.log('Add document with link, link')
    //need logic here for saving to database / db.json
  }

  return (
    <div>
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