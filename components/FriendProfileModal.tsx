'use client';

import React from 'react';
import Image from 'next/image';

interface FriendProfileModalProps {
  friend: {
    name: string;
    pfp: string;
    moodColor: string;
    streak: number;
    habits: number;
    points: number;
  };
  onClose: () => void;
}

export default function FriendProfileModal({ friend, onClose }: FriendProfileModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="flex flex-col items-center space-y-4">
          <div
            className="rounded-full p-1"
            style={{ boxShadow: `0 0 15px ${friend.moodColor}` }}
          >
            <Image
              src={friend.pfp}
              alt={friend.name}
              width={96}
              height={96}
              className="rounded-full"
            />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold">{friend.name}</h2>
            <p className="text-sm text-gray-600">
              🔥 Streak: {friend.streak} | 📌 Habits: {friend.habits} | 💎 Points: {friend.points}
            </p>
          </div>
          <div className="flex justify-between w-full space-x-4 pt-4">
            <button className="w-1/2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              Challenge
            </button>
            <button className="w-1/2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
              Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
