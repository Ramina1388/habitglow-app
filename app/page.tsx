'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/frame-sdk';
import TabBar from '@/components/TabBar';
import { quotes } from '@/lib/quotes';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const moodColors = [
  { color: '#F9E79F', label: 'Joy' },
  { color: '#A2C4EC', label: 'Sadness' },
  { color: '#F4A6A6', label: 'Anger' },
  { color: '#B8E2B3', label: 'Balance' },
  { color: '#CAB4E9', label: 'Inspiration' },
  { color: '#FFD6A5', label: 'Motivation' },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [checkedToday, setCheckedToday] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [topHabits, setTopHabits] = useState<{ habit: string; count: number }[]>([]);

  const today = new Date().getDate();
  const quote = quotes[today % quotes.length];

  const fetchTopHabits = async () => {
    try {
      const res = await fetch('/api/top-habits');
      const data = await res.json();
      setTopHabits(data);
    } catch (e) {
      console.error('Failed to fetch top habits:', e);
    }
  };

  const logHabit = async (habit: string) => {
    try {
      const frameContext = (window as any)?.frame?.context;
      const fid = frameContext?.user?.fid;
      if (!fid) return;
      await fetch('/api/logHabit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fid, habit }),
      });
    } catch (e) {
      console.error('Failed to log habit:', e);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    const storedStreak = parseInt(localStorage.getItem('streakCount') || '0', 10);
    const storedPoints = parseInt(localStorage.getItem('habitPoints') || '0', 10);
    const lastDate = localStorage.getItem('lastCheckinDate');
    const storedMood = localStorage.getItem('moodColor') || '';
    const moodTimestamp = parseInt(localStorage.getItem('moodTimestamp') || '0', 10);
    const today = new Date().toISOString().slice(0, 10);

    if (lastDate === today) setCheckedToday(true);
    setStreak(storedStreak);
    setPoints(storedPoints);
    setSelectedColor(storedMood);

    const now = Date.now();
    if (moodTimestamp && now - moodTimestamp < 2 * 60 * 60 * 1000) {
      setTimeLeft(2 * 60 * 60 - Math.floor((now - moodTimestamp) / 1000));
    }

    try {
      const frameContext = (window as any)?.frame?.context;
      const fid = frameContext?.user?.fid;
      if (fid) {
        fetch(`/api/pfp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fid }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.pfp_url) {
              setAvatarUrl(data.pfp_url);
            }
          });
      }
    } catch (e) {
      console.error('Failed to load pfp', e);
    }

    fetchTopHabits();
    sdk.actions.ready();

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem('moodColor');
          localStorage.removeItem('moodTimestamp');
          setSelectedColor('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleCheckin = () => {
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem('lastCheckinDate');
    if (lastDate === today) {
      alert('You already checked in today!');
      return;
    }
    const newStreak = streak + 1;
    const newPoints = points + 10;
    setStreak(newStreak);
    setPoints(newPoints);
    setCheckedToday(true);
    localStorage.setItem('lastCheckinDate', today);
    localStorage.setItem('streakCount', newStreak.toString());
    localStorage.setItem('habitPoints', newPoints.toString());
    logHabit('Check-in');
    alert('Day started! +10 points earned!');
  };

  const handleColorClick = (color: string) => {
    if (timeLeft > 0) return;
    localStorage.setItem('moodColor', color);
    localStorage.setItem('moodTimestamp', Date.now().toString());
    setSelectedColor(color);
    setTimeLeft(2 * 60 * 60);
    logHabit(`Mood: ${color}`);
    alert('Mood color saved!');
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-blue-500 animate-progress-bar"></div>
        </div>
        <p className="text-sm tracking-wide">Your upgrade in progress...</p>
      </div>
    );
  }

  return (
    <>
      <main className="p-4 pb-32 max-w-md mx-auto bg-[#ECE4D9] min-h-screen">
        <section className="bg-white rounded-xl shadow-md p-4 mb-4">
          <p className="text-base font-semibold text-[#553414] text-center italic leading-relaxed">
            “{quote.quote}”
          </p>
          <p className="text-xs text-right text-gray-600 mt-2 italic">— {quote.author}</p>
        </section>

        <div className="flex justify-between items-center text-sm mb-4 font-semibold text-gray-600">
          <p>🔥 Streak: {streak}</p>
          <p>⭐ Points: {points}</p>
          <img src={avatarUrl || '/icons/default-avatar.png'} alt="avatar" className="w-8 h-8 rounded-full" />
        </div>

        <div
          className={
            'border text-center py-3 rounded shadow mb-6 cursor-pointer ' +
            (checkedToday
              ? 'bg-green-100 border-green-300 text-green-800'
              : 'bg-[#2F5D31] text-white hover:opacity-90')
          }
          onClick={handleCheckin}
        >
          {checkedToday ? '✔ Day started' : 'Start new day'}
        </div>

        <div className="text-center mb-2 flex items-center justify-center gap-2">
          <p className="font-semibold text-gray-700">Choose your mood color</p>
          <span
            onClick={() => setShowInfo(true)}
            title="Mood color meanings"
            className="text-gray-400 cursor-pointer"
          >
            ℹ️
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 justify-items-center mb-2">
          {moodColors.map(({ color }) => (
            <div
              key={color}
              onClick={() => handleColorClick(color)}
              className="w-16 h-16 rounded-full shadow-md cursor-pointer border-2"
              style={{
                backgroundColor: color,
                opacity: selectedColor === '' || selectedColor === color ? 1 : 0.3,
                borderColor: selectedColor === color ? '#59564f' : 'transparent',
              }}
            />
          ))}
        </div>

        {timeLeft > 0 && (
          <p className="text-center text-xs text-gray-500 mb-6">
            You can change mood again in: {formatTime(timeLeft)}
          </p>
        )}

        <div className="mt-6 bg-gray-100 rounded-lg shadow-inner p-4">
          <h2 className="text-md font-semibold text-white bg-gray-600 p-2 rounded-t-lg text-center">
            🌟 Most Popular Habits This Week
          </h2>
          <ul className="text-sm text-gray-700 bg-gray-200 p-3 rounded-b-lg space-y-2">
            {topHabits.length > 0 ? (
              topHabits.map(({ habit, count }) => (
                <li key={habit} className="flex justify-between">
                  <span>{habit}</span>
                  <span>{count} users</span>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500">No data yet</li>
            )}
          </ul>
        </div>

        <div className="hidden">
          <ConnectButton
            showBalance={false}
            accountStatus="address"
            chainStatus="icon"
          />
        </div>
      </main>

      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 space-y-4 w-80 text-center shadow-lg relative">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black"
            >
              ×
            </button>
            <h2 className="text-md font-semibold text-gray-700">Mood Color Meanings</h2>
            <ul className="text-sm text-gray-600 space-y-1">
              {moodColors.map(({ color, label }) => (
                <li key={label} className="flex items-center justify-between">
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <TabBar />
    </>
  );
}
