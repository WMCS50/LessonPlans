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
            placeholder='Enter website link'
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
        {link && <VideoDisplay title={title} link={link} />}
        <div>
          <button onClick={handleAdd}>+</button>
        </div>
      </div>
    );
};

export default AddVideo;

/*multiple times
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'
import { useDispatch } from 'react-redux'
import { resetActiveForm } from '../features/lessons/activeFormSlice'
import VideoDisplay from './VideoDisplay'

const AddVideo = ({ onAddResource }) => { // eslint-disable-line react/prop-types
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [times, setTimes] = useState([{ id: uuidv4(), start: '', end: '' }]);
  const dispatch = useDispatch()

  const handleTimeChange = (id, field, value) => {
      const newTimes = times.map((time) => {
          if (time.id === id) {
              return { ...time, [field]: value };
          }
          return time;
      });
      setTimes(newTimes);
    };

    const addTime = () => {
        setTimes([...times, { id: uuidv4(), start: '', end: '' }]);
    };

    const handleAdd = () => {
      onAddResource({
        type: 'video',
        title,
        link,
        times
      })
    setTitle('')
    setLink('')
    setTimes([{ start: '', end: ''}])
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
            placeholder='Enter website link'
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        {link && <VideoDisplay title={title} link={link} />}

        <div>
          {times.map((time, index) => (
            <div key={index}>
              <input
                  type="text"
                  placeholder="Start time"
                  value={time.start}
                  onChange={e => handleTimeChange(time.id, 'start', e.target.value)}
              />
              <input
                  type="text"
                  placeholder="End time"
                  value={time.end}
                  onChange={e => handleTimeChange(time.id, 'end', e.target.value)}
              />
            </div>
          ))}
          <button onClick={addTime}>Add More Times</button>
          <button onClick={handleAdd}>+</button>
        </div>
      </div>
    );
};

export default AddVideo;
*/