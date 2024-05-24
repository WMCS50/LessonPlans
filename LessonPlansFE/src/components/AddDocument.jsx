import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { resetActiveForm } from '../features/lessons/activeFormSlice'

const AddDocument = ({ onAddResource }) => { // eslint-disable-line react/prop-types
  const [link, setLink] = useState('')
  const [title, setTitle] = useState('')
  const dispatch = useDispatch()

  const handleAdd = async () => {
    onAddResource({
      type: 'document',
      link,
      title,
      start_page: 1, //to be dynamic
      end_page: 2 //to be dynamic
    })
    setLink('')
    setTitle('')
    dispatch(resetActiveForm())
  }
    
  return (
    <div>
      <input 
        type='text'
        placeholder="Enter document title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
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