import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { resetActiveForm } from '../features/lessons/activeFormSlice'
import VideoDisplay from './VideoDisplay'

const AddVideo = ({ onAddResource }) => { // eslint-disable-line react/prop-types
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const dispatch = useDispatch()

  const handleAdd = () => {
    onAddResource({
      type: 'video',
      title,
      link,
      startTime,
      endTime
    })
    setTitle('')
    setLink('')
    setStartTime('')
    setEndTime('')

    dispatch(resetActiveForm())
    }

    return (
      <div>
        <div>
          <input
            type='text'
            placeholder='Enter video title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type='text'
            placeholder='Enter Youtube link'
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <input
            type="text"
            placeholder="Start time"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
          />
          <input
            type="text"
            placeholder="End time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
          />
        </div>
        {link && <VideoDisplay title={title} link={link} startTime={startTime} endTime={endTime}/>}
        <div>
          <button onClick={handleAdd}>+</button>
        </div>
      </div>
    )
}

export default AddVideo