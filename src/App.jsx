import React, { useState, useEffect } from 'react';
import HabitForm from './components/HabitForm';
import HabitList from './components/HabitList';
import { v4 as uuidv4 } from 'uuid';
import WelcomeScreen from './components/WelcomeScreen';
import Confetti from 'react-confetti';
"use client";
import { ShootingStars } from "./components/ui/shooting-stars";
import { StarsBackground } from "./components/ui/stars-background";
import Footer from './components/Footer';

const App = () => {
  const [habits, setHabits] = useState(() => {
    const storedHabits = localStorage.getItem('habits');
    return storedHabits ? JSON.parse(storedHabits) : [
    ];
  });

  const [confettiActive, setConfettiActive] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    checkHabitStatus();
  }, [habits]);

  const checkHabitStatus = () => {
    const today = new Date();
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        const endDate = habit.endDate ? new Date(habit.endDate) : null;
        const isExpired = endDate && endDate < today;
        const isDurationPassed = habit.duration && habit.completeCount >= habit.duration;
        
        return {
          ...habit,
          isExpired: isExpired || isDurationPassed, 
        };
      })
    );
  };

  const addHabit = (habit) => {
    const newHabit = { ...habit, id: uuidv4(), completeCount: 0,isExpired: false  };
    setHabits([...habits, newHabit]);
  };

  const deleteHabit = (id) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
  };

  const editHabit = (id, habit) => {
    setEditingHabit(habit);
  };

  const updateHabit = (updatedHabit) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === updatedHabit.id ? { ...updatedHabit, completeCount: habit.completeCount || 0 } : habit
      )
    );
    setEditingHabit(null);
  };

  const completeHabit = (id) => {
    console.log("Completing habit with id:", id);
  
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        console.log("Current habit:", habit);
  
        if (habit.id === id && !habit.isExpired)  {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set time to midnight
  
          // Check if the habit is already completed today
          if (habit.lastCompleted === today.toLocaleDateString()) {
            alert('You already completed this habit today!');
            return habit; // Return the habit unchanged
          }
  
          const updatedCompleteCount = habit.completeCount + 1;
          const completionPercentage = (updatedCompleteCount / habit.duration) * 100;
  
          if (completionPercentage >= 100) {
            setConfettiActive(true); // Activate confetti
            setTimeout(() => setConfettiActive(false), 5000); // Disable confetti after 5 seconds
          }
  
          // Determine yesterday's date
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          yesterday.setHours(0, 0, 0, 0); // Set time to midnight for comparison
  
          // Get last completed date as Date object
          const lastCompletedDate = new Date(habit.lastCompleted);
          
          // Check if the habit was missed
          const isMissedStreak = lastCompletedDate < yesterday;
  
          const newStreak = isMissedStreak ? 1 : habit.streak + 1;
          const maxStreak = habit.maxStreak ? Math.max(habit.maxStreak, newStreak) : newStreak;
  
          // Create the updated habit object
          return {
            ...habit,
            completeCount: updatedCompleteCount, 
            lastCompleted: today.toLocaleDateString(), 
            streak: newStreak, 
            maxStreak: maxStreak, 
            missedStreak: isMissedStreak 
          };
        }
  
        return habit; 
      })
    );
  };
  
  

  const calculateRemainingDays = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const remainingTime = end - today;
    return Math.ceil(remainingTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  };

  const calculateProgress = (habit) => {
    const today = new Date();
    const startDate = new Date(habit.startDate);
    const endDate = habit.endDate ? new Date(habit.endDate) : null;
    if (endDate) {
      const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
      const daysPassed = (today - startDate) / (1000 * 60 * 60 * 24);
      return Math.min((daysPassed / totalDays) * 100, 100);
    }
    const totalDays = habit.duration || 1;
    const remainingDays = calculateRemainingDays(habit.endDate);
    return remainingDays > 0 ? ((totalDays - remainingDays) / totalDays) * 100 : 100;
  };

  const clearLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-0 px-0 relative">
      {confettiActive && (
        <Confetti
          className="w-full h-full"
          numberOfPieces={500}
          recycle={false}
        />
      )}
      <div className="w-full mb-4 z-10">
        <WelcomeScreen />
      </div>
      <div className="max-w-md w-full space-y-8 mt-8 z-10">
        <h1 className="text-4xl font-bold text-center text-white">Habit Tracker</h1>
  
        <HabitForm addHabit={addHabit} editingHabit={editingHabit} updateHabit={updateHabit} />
        {habits.length > 0 ? (
          <HabitList
            habits={habits}
            completeHabit={completeHabit}
            deleteHabit={deleteHabit}
            editHabit={editHabit}
            calculateProgress={calculateProgress}
          />
        ) : (
          <p className="text-center text-white">No habits added yet. Start by adding a habit above.</p>
        )}
      </div>
      <Footer />
      <ShootingStars className="z-0" />
      <StarsBackground className="z-0" />
    </div>
  );
};

export default App;
