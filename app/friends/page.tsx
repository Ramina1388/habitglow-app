'use client';

import { useEffect, useState } from 'react';
import TabBar from '@/components/TabBar';
import Image from 'next/image';
import Link from 'next/link';

const dummyRankingFriends = [
  { username: 'marina', avatar: 'https://i.pravatar.cc/100?img=11', points: 320 },
  { username: 'alan', avatar: 'https://i.pravatar.cc/100?img=32', points: 250 },
  { username: 'wavepunk', avatar: 'https://i.pravatar.cc/100?img=58', points: 190 },
];

const dummyRankingGlobal = [
  { username: 'luna', avatar: 'https://i.pravatar.cc/100?img=47', points: 430 },
  { username: 'wavepunk', avatar: 'https://i.pravatar.cc/100?img=58', points: 390 },
  { username: 'marina', avatar: 'https://i.pravatar.cc/100?img=11', points: 320 },
];

export default function Friends() {
  const referralLink = 'https://yourapp.com/?ref=marina';
  const [copied, setCopied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'global'>('friends');
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [supportCoins, setSupportCoins] = useState(3);
  const [supportUsed, setSupportUsed] = useState(0);
  const [hasSupported, setHasSupported] = useState(false);

  useEffect(() => {
    const streak = parseInt(localStorage.getItem('streakCount') || '0', 10);
    const today = new Date().toISOString().slice(0, 10);
    const lastGiven = localStorage.getItem('lastSupportCoinGiven');

    if (lastGiven !== today) {
      let coins = 3;
      if (streak >= 21) coins = 11;
      else if (streak >= 14) coins = 8;
      else if (streak >= 7) coins = 5;
      setSupportCoins(coins);
      setSupportUsed(0);
      localStorage.setItem('supportCoins', coins.toString());
      localStorage.setItem('supportUsed', '0');
      localStorage.setItem('lastSupportCoinGiven', today);
    } else {
      const stored = parseInt(localStorage.getItem('supportCoins') || '3', 10);
      const used = parseInt(localStorage.getItem('supportUsed') || '0', 10);
      setSupportCoins(stored);
      setSupportUsed(used);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref && ref !== 'marina') {
      const invited = JSON.parse(localStorage.getItem('invitedRefs') || '[]');
      if (!invited.includes(ref)) {
        invited.push(ref);
        localStorage.setItem('invitedRefs', JSON.stringify(invited));

        let currentPoints = parseInt(localStorage.getItem('habitPoints') || '0', 10);
        currentPoints += 15;
        if (invited.length === 5) currentPoints += 50;
        localStorage.setItem('habitPoints', currentPoints.toString());
      }
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSupport = () => {
    if (supportCoins > 0) {
      const remaining = supportCoins - 1;
      const used = supportUsed + 1;
      setSupportCoins(remaining);
      setSupportUsed(used);
      localStorage.setItem('supportCoins', remaining.toString());
      localStorage.setItem('supportUsed', used.toString());
      setHasSupported(true);

      if (remaining === 0) {
        let xp = parseInt(localStorage.getItem('habitPoints') || '0', 10);
        xp += 3;
        localStorage.setItem('habitPoints', xp.toString());
        alert('You supported 3 friends today! +3 bonus points');
      } else {
        alert('1 support coin sent!');
      }
    } else {
      alert('No support coins left today.');
    }
  };

  const rankings = activeTab === 'friends' ? dummyRankingFriends : dummyRankingGlobal;

  return (
    <>
      <main className="p-4 pb-24 max-w-md mx-auto space-y-6 bg-[#ECE4D9] min-h-screen">
        <div className="flex justify-between items-center text-sm font-medium bg-[#F9F5ED] text-yellow-700 p-2 rounded shadow">
          <span>💛 Support Coins: {supportCoins} left today</span>
        </div>

        <button
          onClick={() => setShowPopup(true)}
          className="bg-[#2F5D31] text-white py-3 px-6 rounded w-full text-center shadow-md hover:opacity-90 transition"
        >
          Share your referral link
        </button>

        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg border border-[#8FB3B5] p-6 w-80 space-y-4 shadow-lg relative">
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
              <p className="text-sm text-gray-700">Share this link:</p>
              <div
                onClick={handleCopy}
                className="bg-gray-100 px-3 py-2 rounded cursor-pointer text-sm text-center hover:bg-gray-200 text-gray-800"
              >
                {copied ? 'Copied!' : referralLink}
              </div>
              <div className="flex justify-around mt-4">
                <Link
                  href={`https://warpcast.com/~/compose?text=Join%20me%20on%20this%20habit%20app!%20${encodeURIComponent(referralLink)}`}
                  target="_blank"
                  className="text-[#8FB3B5] hover:underline text-sm"
                >
                  🌀 Farcaster
                </Link>
                <Link
                  href={`https://twitter.com/intent/tweet?text=Join%20me%20on%20this%20habit%20app!%20${encodeURIComponent(referralLink)}`}
                  target="_blank"
                  className="text-[#8FB3B5] hover:underline text-sm"
                >
                  🐦 X (Twitter)
                </Link>
              </div>
            </div>
          </div>
        )}

        <input
          type="text"
          placeholder="Search friends"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
        />

        <div className="flex justify-center space-x-4 mt-2">
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === 'friends' ? 'bg-[#553414] text-white' : 'bg-gray-100 text-[#553414]'
            }`}
          >
            👥 Friends
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === 'global' ? 'bg-[#553414] text-white' : 'bg-gray-100 text-[#553414]'
            }`}
          >
            🌍 Global
          </button>
        </div>

        <ul className="space-y-3">
          {rankings.map((user, index) => (
            <li
              key={user.username}
              onClick={() => setSelectedFriend(user)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                user.username === 'marina' ? 'bg-yellow-100 font-semibold' : 'bg-white'
              } shadow`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 w-6">#{index + 1}</span>
                <Image
                  src={user.avatar}
                  alt={user.username}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <span className="text-[#2F5D31] font-medium">@{user.username}</span>
              </div>
              <span className="text-sm text-gray-700">💎 {user.points}</span>
            </li>
          ))}
        </ul>
      </main>

      {selectedFriend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl border border-[#8FB3B5] p-6 w-full max-w-sm shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedFriend(null)}
            >
              ✕
            </button>
            <div className="flex flex-col items-center space-y-4">
              <div
                className="rounded-full p-1"
                style={{ boxShadow: `0 0 15px ${selectedFriend.moodColor || '#999'}` }}
              >
                <Image
                  src={selectedFriend.avatar}
                  alt={selectedFriend.username}
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-[#2F5D31]">@{selectedFriend.username}</h2>
                <p className="text-sm text-gray-600">
                  🔥 Streak: {selectedFriend.streak || 0} | 📌 Habits: {selectedFriend.activeHabits || 0} | 💎 Points: {selectedFriend.points}
                </p>
              </div>
              <div className="flex justify-between w-full space-x-4 pt-4">
                <button
                  disabled={hasSupported}
                  onClick={() => alert('Feature coming soon!')}
                  className={`w-1/2 py-2 rounded-lg text-white transition ${
                    hasSupported ? 'bg-gray-400 opacity-50 cursor-not-allowed' : 'bg-[#4A4A4A] hover:bg-[#2F2F2F]'
                  }`}
                >
                  Challenge
                </button>
                <button
                  disabled={hasSupported}
                  onClick={handleSupport}
                  className={`w-1/2 py-2 rounded-lg text-white transition ${
                    hasSupported ? 'bg-gray-400 opacity-50 cursor-not-allowed' : 'bg-[#4A4A4A] hover:bg-[#2F2F2F]'
                  }`}
                >
                  Support
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <TabBar />
    </>
  );
}
