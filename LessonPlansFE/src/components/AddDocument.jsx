import { useState } from 'react'

const AddDocument = () => {
  const [link, setLink] = useState('')

  const handleAdd = () => {
    console.log('Add document with link, link')
    //need logic here for saving to database / db.json
  }

  return (
    <div>
      <input 
        type='text'
        placeholder="Enter document link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <button onClick={handleAdd}>+</button>
    </div>
  )
}

export default AddDocument