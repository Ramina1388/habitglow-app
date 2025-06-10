'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import Link from 'next/link';
import TabBar from '@/components/TabBar';
import { sdk } from '@farcaster/frame-sdk';

const fallbackAvatar = 'https://i.pravatar.cc/200';

const moodLabels: Record<string, string> = {
  '#FFD700': 'Joy',
  '#1E90FF': 'Sadness',
  '#DC143C': 'Anger',
  '#32CD32': 'Balance',
  '#8A2BE2': 'Inspiration',
  '#FFA500': 'Motivation',
  '#808080': 'Indifference',
};

export default function Profile() {
  const { address } = useAccount();
  const [pfp, setPfp] = useState(fallbackAvatar);
  const [fcUsername, setFcUsername] = useState<string | undefined>(undefined);
  const [moodColor, setMoodColor] = useState('#00BFFF');
  const [showPopup, setShowPopup] = useState(false);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [activeHabits, setActiveHabits] = useState(0);
  const [calendarData, setCalendarData] = useState<{ [key: string]: number }>({});
  const referralLink = 'https://yourapp.com/?ref=marina';

  useEffect(() => {
    const storedMood = localStorage.getItem('moodColor');
    if (storedMood) setMoodColor(storedMood);

    const storedStreak = parseInt(localStorage.getItem('streakCount') || '0', 10);
    const storedPoints = parseInt(localStorage.getItem('habitPoints') || '0', 10);
    setStreak(storedStreak);
    setPoints(storedPoints);

    const storedHabits = localStorage.getItem('selectedHabits');
    if (storedHabits) {
      try {
        const habits = JSON.parse(storedHabits);
        setActiveHabits(habits.length);
      } catch {
        setActiveHabits(0);
      }
    }

    const storedCalendar = localStorage.getItem('habitProgressByDate');
    if (storedCalendar) {
      setCalendarData(JSON.parse(storedCalendar));
    }

    const init = async () => {
      try {
        const context = await sdk.context;
        const user = context.user;
        if (user) {
          if (user.pfpUrl) {
            setPfp(user.pfpUrl);
            localStorage.setItem('farcasterPfp', user.pfpUrl);
          }
          if (user.username) setFcUsername(user.username);
        }
      } catch (err) {
        console.error('Error fetching Farcaster user:', err);
      }
    };

    init();
  }, []);

  const postText = `My mood today: ${moodLabels[moodColor] || 'Calm'} 💙%0AJoin me and track your habits: ${referralLink}`;

  const renderCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const padding = firstDay === 0 ? 6 : firstDay - 1;

    const rows = [];
    let cells = [];

    for (let i = 0; i < padding; i++) {
      cells.push(<td key={`pad-${i}`} className="py-2" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${(month + 1).toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;
      const progress = calendarData[dateKey] || 0;
      let color = 'bg-gray-300';
      if (progress >= 100) color = 'bg-[#2F5D31]';
      else if (progress >= 30) color = 'bg-orange-400';
      else if (progress > 0) color = 'bg-red-400';

      cells.push(
        <td key={dateKey} className="p-1">
          <div
            className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded-full text-white ${color}`}
          >
            {day}
          </div>
        </td>
      );

      if ((cells.length % 7 === 0 && cells.length > 0) || day === daysInMonth) {
        rows.push(<tr key={`week-${day}`}>{cells}</tr>);
        cells = [];
      }
    }

    return (
      <table className="w-full mt-6 text-sm text-white">
        <thead>
          <tr>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <th key={d} className="pb-2 font-medium">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  const getBadgeStyle = (earned: boolean) => ({
    filter: earned ? 'none' : 'grayscale(100%)',
    opacity: earned ? 1 : 0.4,
    cursor: earned ? 'default' : 'help',
  });

  return (
    <>
      <main className="p-6 pb-24 max-w-md mx-auto text-center space-y-6 bg-[#2F3A30] text-white min-h-screen">
        <div className="relative w-36 h-36 mx-auto rounded-full" onClick={() => setShowPopup(true)}>
          <div
            className="absolute inset-0 rounded-full blur-2xl"
            style={{ backgroundColor: moodColor }}
          />
          <Image
            src={pfp}
            alt="profile picture"
            width={144}
            height={144}
            className="rounded-full relative z-10 border-4 border-white shadow-md cursor-pointer"
          />
        </div>

        {fcUsername && (
          <p className="text-lg font-bold">@{fcUsername}</p>
        )}

        <p className="text-sm font-semibold" style={{ color: moodColor }}>
          Your mood: {moodLabels[moodColor] || 'Calm'}
        </p>

        <div className="flex justify-around text-sm font-semibold text-white">
          <div>
            <p className="text-xl">{streak}</p>
            <p>🔥 Streak</p>
          </div>
          <div>
            <p className="text-xl">{activeHabits}</p>
            <p>📋 Habits</p>
          </div>
          <div>
            <p className="text-xl">{points}</p>
            <p>⭐ Points</p>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-md font-bold mb-2 text-[#915C48]">Achievements</h2>
          <div className="flex justify-center gap-4">
            <div title="Complete 7-day streak to unlock">
              <Image src="/profile/badge-7.png" alt="7 day streak" width={50} height={50} style={getBadgeStyle(streak >= 7)} />
            </div>
            <div title="Complete 14-day streak to unlock">
              <Image src="/profile/badge-14.png" alt="14 day streak" width={50} height={50} style={getBadgeStyle(streak >= 14)} />
            </div>
            <div title="Complete 21-day streak to unlock">
              <Image src="/profile/badge-21.png" alt="21 day streak" width={50} height={50} style={getBadgeStyle(streak >= 21)} />
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowPopup(true)}
          className="bg-[#2F5D31] text-white px-5 py-2 rounded-md hover:opacity-90 text-sm mt-2"
        >
          Share your profile
        </button>

        <div className="pt-6 border-t border-gray-500">
          <h3 className="text-md font-semibold mb-2 text-[#915C48]">📅 Habit Progress Calendar</h3>
          {renderCalendar()}
        </div>
      </main>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 space-y-4 w-80 text-center shadow-lg relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black"
            >
              ×
            </button>
            <h2 className="text-md font-semibold text-[#2F5D31]">Share your mood</h2>
            <div
              className="w-24 h-24 mx-auto rounded-full"
              style={{ backgroundColor: moodColor }}
            />
            <p className="text-sm text-gray-600">Post your current mood and invite others.</p>
            <div className="flex justify-around mt-2">
              <Link
                href={`https://warpcast.com/~/compose?text=${postText}`}
                target="_blank"
                className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700"
              >
                🌀 Farcaster
              </Link>
              <Link
                href={`https://twitter.com/intent/tweet?text=${postText}`}
                target="_blank"
                className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
              >
                🐦 X
              </Link>
            </div>
            <Link
              href="/friends"
              className="block mt-3 text-[#2F5D31] underline text-sm hover:text-[#1e4722]"
            >
              Find others with same mood →
            </Link>
          </div>
        </div>
      )}

      <TabBar />
    </>
  );
}
