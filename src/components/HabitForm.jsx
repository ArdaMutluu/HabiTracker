import React, { useState, useEffect } from 'react';

const HabitForm = ({ addHabit, editingHabit, updateHabit }) => {
  const [name, setName] = useState('');
  const [streak, setStreak] = useState(0);
  const [duration, setDuration] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isIndefinite, setIsIndefinite] = useState(false);
  const [useDuration, setUseDuration] = useState(true); 
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setStreak(editingHabit.streak);
      setDuration(editingHabit.duration || '');
      setEndDate(editingHabit.endDate || '');
      setIsIndefinite(editingHabit.isIndefinite);
      setUseDuration(!editingHabit.endDate); 
    } else {
      resetForm();
    }
  }, [editingHabit]);

  const calculateDurationFromEndDate = (endDate) => {
    const today = new Date();
    const selectedEndDate = new Date(endDate);

    const differenceInTime = selectedEndDate - today;
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24)); 

    return differenceInDays >= 0 ? differenceInDays : 0; 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Reset any previous errors

    // Validate endDate if using end date option
    if (!isIndefinite && !useDuration) {
      const today = new Date();
      const selectedEndDate = new Date(endDate);

      if (selectedEndDate < today) {
        setError('End date cannot be in the past.');
        return; // Prevent form submission
      }
    }

    if (isIndefinite) {
      addHabit({ name, streak, isIndefinite });
    } else {
      const habitData = { name, streak, isIndefinite };
      if (useDuration) {
        habitData.duration = duration;
      } else {
        habitData.endDate = endDate;
        habitData.duration = calculateDurationFromEndDate(endDate);
      }
      addHabit(habitData);
    }

    resetForm();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setError(''); // Reset any previous errors

    if (editingHabit) {
      if (!isIndefinite && !useDuration) {
        const today = new Date();
        const selectedEndDate = new Date(endDate);

        if (selectedEndDate < today) {
          setError('End date cannot be in the past.');
          return; // Prevent form submission
        }
      }

      const habitData = { ...editingHabit, name, streak, isIndefinite };
      if (useDuration) {
        habitData.duration = duration;
        habitData.endDate = ''; 
      } else {
        habitData.endDate = endDate;
        habitData.duration = calculateDurationFromEndDate(endDate);
      }
      updateHabit(habitData);
    }

    resetForm();
  };

  const resetForm = () => {
    setName('');
    setStreak(0);
    setDuration('');
    setEndDate('');
    setIsIndefinite(false);
    setUseDuration(true);
  };

  return (
    <form onSubmit={editingHabit ? handleUpdate : handleSubmit} className="bg-gray-800 p-6 rounded-lg space-y-4">
      <div>
        <label className="block text-white" htmlFor="habit-name">
          Habit Name:
        </label>
        <input
          id="habit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full bg-gray-700 text-white rounded-md p-2"
          required
        />
      </div>

      <div>
        <label className="block text-white">Choose Habit Type:</label>
        <div className="flex items-center">
          <input
            type="radio"
            id="indefinite"
            name="habit-type"
            checked={isIndefinite}
            onChange={() => {
              setIsIndefinite(true);
              setUseDuration(true); 
            }}
          />
          <label className="text-white ml-2" htmlFor="indefinite">Indefinite</label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="definite"
            name="habit-type"
            checked={!isIndefinite}
            onChange={() => {
              setIsIndefinite(false);
              setUseDuration(true); 
            }}
          />
          <label className="text-white ml-2" htmlFor="definite">Definite</label>
        </div>
      </div>

      {!isIndefinite && (
        <>
          <div className="mt-4">
            <label className="block text-white">Choose Between:</label>
            <div className="flex items-center">
              <button
                type="button"
                className={`px-4 py-2 mr-2 ${useDuration ? 'bg-blue-500' : 'bg-gray-500'} text-white rounded-md`}
                onClick={() => setUseDuration(true)}
              >
                Duration (in days)
              </button>
              <button
                type="button"
                className={`px-4 py-2 ${!useDuration ? 'bg-blue-500' : 'bg-gray-500'} text-white rounded-md`}
                onClick={() => setUseDuration(false)}
              >
                End Date
              </button>
            </div>
          </div>

          {useDuration ? (
            <div>
              <label className="block text-white" htmlFor="habit-duration">
                Duration (in days):
              </label>
              <input
                id="habit-duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-1 block w-full bg-gray-700 text-white rounded-md p-2"
                min="1"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-white" htmlFor="habit-end-date">
                End Date:
              </label>
              <input
                id="habit-end-date"
                type="date"
                value={endDate}
                onChange={(e) => {
                  const newEndDate = e.target.value;
                  setEndDate(newEndDate);
                  setDuration(calculateDurationFromEndDate(newEndDate)); 
                }}
                className="mt-1 block w-full bg-gray-700 text-white rounded-md p-2"
                required
              />
              {endDate && <p className="text-white mt-2">Calculated Duration: {duration} days</p>}
            </div>
          )}
        </>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
      >
        {editingHabit ? 'Update Habit' : 'Add Habit'}
      </button>
    </form>
  );
};

export default HabitForm;
