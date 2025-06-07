'use client';

import { useEffect, useState } from 'react';
import TabBar from '@/components/TabBar';
import { FaTrash } from 'react-icons/fa';
import { allHabits as habitOptions } from '@/lib/habitData';

function getRioDateString() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const rioOffset = -3;
  const rio = new Date(utc + 3600000 * rioOffset);
  return rio.toISOString().split('T')[0];
}

export default function Tracker() {
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [checkedHabits, setCheckedHabits] = useState<Record<string, boolean>>({});
  const [newHabit, setNewHabit] = useState('');
  const [monthlyGoal, setMonthlyGoal] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [points, setPoints] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const storedHabits = localStorage.getItem('selectedHabits');
    const storedChecked = localStorage.getItem('checkedHabits');
    const savedGoal = localStorage.getItem('monthlyGoal');
    const savedSteps = localStorage.getItem('goalSteps');
    const lastDate = localStorage.getItem('lastHabitDate') || '';
    const storedPoints = parseInt(localStorage.getItem('habitPoints') || '0', 10);
    const today = getRioDateString();

    setPoints(storedPoints);

    if (storedHabits) {
      try {
        const habits = JSON.parse(storedHabits);
        setSelectedHabits(habits);

        const checked = storedChecked ? JSON.parse(storedChecked) : {};

        if (today !== lastDate) {
          const progressValue = habits.length
            ? Math.round((Object.values(checked).filter(Boolean).length / habits.length) * 100)
            : 0;
          const storedProgress = localStorage.getItem('habitProgressByDate');
          const parsedProgress = storedProgress ? JSON.parse(storedProgress) : {};
          if (lastDate) parsedProgress[lastDate] = progressValue;
          localStorage.setItem('habitProgressByDate', JSON.stringify(parsedProgress));

          const resetChecked: Record<string, boolean> = {};
          habits.forEach((habit: string) => {
            resetChecked[habit] = false;
          });
          setCheckedHabits(resetChecked);
          localStorage.setItem('checkedHabits', JSON.stringify(resetChecked));
          localStorage.setItem('lastHabitDate', today);
        } else {
          const syncedChecked: Record<string, boolean> = {};
          habits.forEach((habit: string) => {
            syncedChecked[habit] = checked[habit] ?? false;
          });
          setCheckedHabits(syncedChecked);
        }
      } catch (error) {
        console.error('Error parsing habits from localStorage:', error);
      }
    }

    if (savedGoal) setMonthlyGoal(savedGoal);
    if (savedSteps) setSteps(JSON.parse(savedSteps));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('selectedHabits', JSON.stringify(selectedHabits));
    localStorage.setItem('checkedHabits', JSON.stringify(checkedHabits));
  }, [selectedHabits, checkedHabits, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('monthlyGoal', monthlyGoal);
  }, [monthlyGoal, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('goalSteps', JSON.stringify(steps));
  }, [steps, isLoaded]);

  const addPoints = (amount: number) => {
    const newTotal = points + amount;
    setPoints(newTotal);
    localStorage.setItem('habitPoints', newTotal.toString());
  };

  const handleAddHabit = () => {
    if (newHabit && !selectedHabits.includes(newHabit)) {
      const updatedHabits = [...selectedHabits, newHabit];
      setSelectedHabits(updatedHabits);
      setCheckedHabits({ ...checkedHabits, [newHabit]: false });
      setNewHabit('');
    }
  };

  const handleRemoveHabit = (habit: string) => {
    const updatedHabits = selectedHabits.filter(h => h !== habit);
    setSelectedHabits(updatedHabits);

    const updatedChecked = { ...checkedHabits };
    delete updatedChecked[habit];
    setCheckedHabits(updatedChecked);
  };

  const handleCheck = (habit: string) => {
    const updatedChecked = { ...checkedHabits, [habit]: !checkedHabits[habit] };
    setCheckedHabits(updatedChecked);

    const isNowChecked = !checkedHabits[habit];
    if (isNowChecked) addPoints(1);

    const allChecked = selectedHabits.every(h => h === habit ? true : checkedHabits[h]);
    if (isNowChecked && allChecked) addPoints(5);
  };

  const handleGenerateSteps = () => {
    setShowPopup(true);
    // steps generation is muted during reconstruction
  };

  const completedCount = Object.values(checkedHabits).filter(Boolean).length;
  const progress = selectedHabits.length
    ? Math.round((completedCount / selectedHabits.length) * 100)
    : 0;

  return (
    <>
      <main className="p-6 pb-24 max-w-md mx-auto space-y-6 bg-[#5B5A3B] min-h-screen">
        <div className="bg-[#F9F5ED] p-4 rounded shadow text-[#2C1B10]">
          <label className="block mb-2 font-medium">Choose a habit</label>
          <select
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            className="w-full p-2 border rounded text-black"
          >
            <option value="">-- Select a habit --</option>
            {habitOptions.map((habit, index) => (
              <option key={index} value={habit}>
                {habit}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddHabit}
            className="mt-2 px-4 py-1 bg-[#915C48] hover:bg-[#7a4d3d] text-white rounded"
          >
            Add
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto border rounded p-4 space-y-2 bg-[#B9A275] text-[#1F1F1F] border-[#D6C9B4]">
          {selectedHabits.map((habit, index) => (
            <div key={index} className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checkedHabits[habit] || false}
                  onChange={() => handleCheck(habit)}
                  className="accent-[#2F5D31]"
                />
                {habit}
              </label>
              <button
                onClick={() => handleRemoveHabit(habit)}
                className="text-red-500"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          {selectedHabits.length === 0 && (
            <p className="text-gray-700 text-sm">No habits selected</p>
          )}
        </div>

        <div className="text-center text-sm text-[#F5F5F5]">
          Daily progress: <strong>{progress}%</strong>
        </div>

        <div className="border-t pt-4 mt-4 bg-[#F9F5ED] p-4 rounded shadow text-[#2C1B10]">
          <label className="block mb-2 font-medium">Your goal for the month</label>
          <input
            type="text"
            value={monthlyGoal}
            onChange={(e) => setMonthlyGoal(e.target.value)}
            placeholder="e.g., make updates in the app"
            className="w-full p-2 border rounded mb-2 text-black"
          />
          <button
            onClick={handleGenerateSteps}
            className="px-4 py-1 bg-[#915C48] hover:bg-[#7a4d3d] text-white rounded"
          >
            Generate steps
          </button>

          <ul className="mt-3 list-disc pl-5 text-sm space-y-1">
            {steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow text-center w-80">
              <p className="text-black mb-4 text-sm">
                This section is under reconstruction. Stay tuned for updates!
              </p>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-1 bg-[#915C48] hover:bg-[#7a4d3d] text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
      <TabBar />
    </>
  );
}
