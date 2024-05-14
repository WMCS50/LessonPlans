import { useState } from 'react';

const AddVideo = () => {
  
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
        console.log("Add video with times:", times);
        // Logic to save to the database or db.json
    };

    return (
      <div>
        <div>
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
