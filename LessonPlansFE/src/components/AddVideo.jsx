import { useState } from 'react';

const AddVideo = ({ onAddResource }) => { // eslint-disable-line react/prop-types
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [times, setTimes] = useState([{ start: '', end: '' }]);
  
    const handleTimeChange = (index, field, value) => {
        const newTimes = times.map((time, i) => {
            if (i === index) {
                return { ...time, [field]: value };
            }
            return time;
        });
        setTimes(newTimes);
    };

    const addTime = () => {
        setTimes([...times, { start: '', end: '' }]);
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

        <div>
          {times.map((time, index) => (
            <div key={index}>
              <input
                  type="text"
                  placeholder="Start time"
                  value={time.start}
                  onChange={e => handleTimeChange(index, 'start', e.target.value)}
              />
              <input
                  type="text"
                  placeholder="End time"
                  value={time.end}
                  onChange={e => handleTimeChange(index, 'end', e.target.value)}
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
