import { useState } from 'react'

const AddDocument = ({ onAddResource }) => { // eslint-disable-line react/prop-types
  const [link, setLink] = useState('')

  const handleAdd = async () => {
    onAddResource({
      type: 'document',
      link,
      title: 'TestTitletillmadedynamic', //to be dynamic
      start_page: 1, //to be dynamic
      end_page: 2 //to be dynamic
    })
    setLink('')
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