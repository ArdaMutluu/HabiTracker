import React from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import { PencilIcon, TrashIcon } from '@heroicons/react/solid';

const HabitList = ({ habits, completeHabit, deleteHabit, editHabit }) => {
  return (
    <div className="space-y-4">
      {habits.length === 0 ? (
        <p className="text-center text-gray-500">No habits added yet. Start by adding a habit above.</p>
      ) : (
        habits.map((habit, index) => {
          const completionPercentage = (habit.completeCount / habit.duration) * 100 || 0;
          const isMissedStreak = habit.missedStreak;

          // Determines the color based on the completion percentage
          let pathColor;
          if (completionPercentage < 21) pathColor = '#ff0000';
          else if (completionPercentage < 60) pathColor = '#FFA500';
          else if (completionPercentage < 80) pathColor = '#FFFF00';
          else if (completionPercentage < 90) pathColor = '#90EE90';
          else pathColor = '#006400';

          return (
            <div
              key={habit.id || index}
              className={`flex items-center justify-between bg-gray-800 p-4 rounded shadow ${isMissedStreak ? 'border-2 border-orange-500' : ''}`}
            >
              <div className="flex items-center">
                {!habit.isIndefinite && (
                  <div className="w-16 h-16 mr-4">
                    <CircularProgressbar
                      value={completionPercentage}
                      text={`${completionPercentage.toFixed(0)}%`}
                      styles={{
                        path: { stroke: pathColor },
                        text: { fill: '#fff', fontSize: '16px' },
                      }}
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-lg text-white">{habit.name}</h3>
                  <p className="text-gray-400">Streak: {habit.streak} / Duration: {habit.duration}</p>
                  <p className="text-gray-400">Max Streak: {habit.maxStreak || habit.streak}</p>
                  <p className="text-gray-400">Last Completed: {habit.lastCompleted || 'Never'}</p>
                  {isMissedStreak && <p className="text-orange-500">Day Missed!</p>}
                  {habit.isExpired && <p className="text-red-500">Habit Expired</p>}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => editHabit(habit.id, habit)}
                  disabled={habit.endDate && new Date(habit.endDate) < new Date()}
                  className={`p-2 rounded transition ${habit.endDate && new Date(habit.endDate) < new Date() ? 'bg-red-600 text-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  <PencilIcon className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className={`p-2 rounded transition ${habit.endDate && new Date(habit.endDate) < new Date() ? 'bg-red-600 text-white cursor-not-allowed' : 'bg-blue-800 hover:bg-blue-900'}`}
                >
                  <TrashIcon className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={() => completeHabit(habit.id)}
                  disabled={habit.endDate && new Date(habit.endDate) < new Date()}
                  className={`p-2 rounded transition ${habit.endDate && new Date(habit.endDate) < new Date() ? 'bg-red-600 text-white cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {habit.endDate && new Date(habit.endDate) < new Date() ? 'Failed' : 'Complete'}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default HabitList;

