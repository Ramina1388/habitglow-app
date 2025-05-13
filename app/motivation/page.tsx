'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { films } from '@/lib/films';
import { books } from '@/lib/books';
import TabBar from '@/components/TabBar';

function getCurrentWeekNumber() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}

export default function Motivation() {
  const currentWeek = getCurrentWeekNumber();
  const film = films[currentWeek % films.length];
  const book = books[currentWeek % books.length];

  const [scrollY, setScrollY] = useState(0);
  const [showFilmPopup, setShowFilmPopup] = useState(false);
  const [showBookPopup, setShowBookPopup] = useState(false);
  const [filmAnswer, setFilmAnswer] = useState('');
  const [bookAnswer, setBookAnswer] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnswer = (type: 'film' | 'book') => {
    if (type === 'film') {
      if (filmAnswer.trim() === '') {
        alert('Please write your answer before submitting.');
        return;
      }
      alert('Correct! +10 points');
      setShowFilmPopup(false);
      setFilmAnswer('');
    }
    if (type === 'book') {
      if (bookAnswer.trim() === '') {
        alert('Please write your answer before submitting.');
        return;
      }
      alert('Correct! +10 points');
      setShowBookPopup(false);
      setBookAnswer('');
    }
  };

  const filmScale = Math.max(1 - scrollY / 500, 0.8);
  const filmOpacity = Math.max(1 - scrollY / 300, 0.5);
  const bookScale = Math.min(1 + scrollY / 800, 1.1);
  const bookTranslateY = Math.min(scrollY / 5, 40);

  return (
    <>
      <main className="p-6 pb-24 max-w-md mx-auto space-y-10 bg-[#ECE4D9] min-h-screen">
        {/* Film of the Week */}
        <section
          className="text-center transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${filmScale})`,
            opacity: filmOpacity,
          }}
        >
          <h2 className="text-xl font-bold text-[#915C48] mb-4">🎬 Film of the Week</h2>
          <div className="bg-white shadow-md rounded p-1 inline-block">
            <Image
              src={film.image}
              alt={film.title}
              width={300}
              height={450}
              className="rounded"
            />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[#915C48]">{film.title}</h3>
          <button
            onClick={() => setShowFilmPopup(true)}
            className="mt-2 px-4 py-1 text-sm bg-[#6A7A52] hover:bg-[#4F5F3A] text-white rounded"
          >
            Mark as watched
          </button>
        </section>

        {/* Book of the Week */}
        <section
          className="text-center transition-all duration-300 ease-out"
          style={{
            transform: `translateY(-${bookTranslateY}px) scale(${bookScale})`,
            zIndex: 10,
          }}
        >
          <h2 className="text-xl font-bold text-[#915C48] mb-4">📖 Book of the Week</h2>
          <div className="bg-white shadow-md rounded p-1 inline-block">
            <Image
              src={book.image}
              alt={book.title}
              width={250}
              height={350}
              className="rounded"
            />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[#915C48]">{book.title}</h3>
          <button
            onClick={() => setShowBookPopup(true)}
            className="mt-2 px-4 py-1 text-sm bg-[#6A7A52] hover:bg-[#4F5F3A] text-white rounded"
          >
            Mark as read
          </button>
        </section>
      </main>

      {/* Film Question Popup */}
      {showFilmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-[#FCFAF6] border border-[#D6C9B4] rounded-lg p-6 space-y-4 w-80 text-center shadow-lg relative">
            <button
              onClick={() => setShowFilmPopup(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black"
            >
              ×
            </button>
            <h2 className="text-md font-semibold text-[#915C48]">🎬 Quiz: {film.title}</h2>
            <p className="text-sm text-gray-700 mb-2">What message did the film convey?</p>
            <textarea
              value={filmAnswer}
              onChange={(e) => setFilmAnswer(e.target.value)}
              className="w-full border rounded p-2 text-sm text-black"
              rows={3}
              placeholder="Your answer..."
            />
            <button
              onClick={() => handleAnswer('film')}
              className="px-4 py-2 bg-[#915C48] text-white rounded hover:bg-[#7a4d3d]"
            >
              Submit Answer
            </button>
          </div>
        </div>
      )}

      {/* Book Question Popup */}
      {showBookPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-[#FCFAF6] border border-[#D6C9B4] rounded-lg p-6 space-y-4 w-80 text-center shadow-lg relative">
            <button
              onClick={() => setShowBookPopup(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black"
            >
              ×
            </button>
            <h2 className="text-md font-semibold text-[#915C48]">📖 Quiz: {book.title}</h2>
            <p className="text-sm text-gray-700 mb-2">What did you learn from this book?</p>
            <textarea
              value={bookAnswer}
              onChange={(e) => setBookAnswer(e.target.value)}
              className="w-full border rounded p-2 text-sm text-black"
              rows={3}
              placeholder="Your answer..."
            />
            <button
              onClick={() => handleAnswer('book')}
              className="px-4 py-2 bg-[#915C48] text-white rounded hover:bg-[#7a4d3d]"
            >
              Submit Answer
            </button>
          </div>
        </div>
      )}

      <TabBar />
    </>
  );
}
