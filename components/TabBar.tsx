'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import clsx from 'clsx';

const tabs = [
  { href: '/', icon: '/icons/home.svg', alt: 'Home' },
  { href: '/tracker', icon: '/icons/tracker.svg', alt: 'Tracker' },
  { href: '/motivation', icon: '/icons/motivation.svg', alt: 'Motivation' },
  { href: '/friends', icon: '/icons/friends.svg', alt: 'Friends' },
  { href: '/profile', icon: '/icons/profile.svg', alt: 'Profile' },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
      <nav className="w-full max-w-[420px] bg-white border-t border-gray-200 flex justify-around items-center h-16 shadow-md">
        {tabs.map((tab) => (
          <Link key={tab.href} href={tab.href} className="flex flex-col items-center justify-center">
            <Image
              src={tab.icon}
              alt={tab.alt}
              width={24}
              height={24}
              className={clsx(
                'transition-opacity duration-200',
                pathname === tab.href ? 'opacity-100' : 'opacity-40'
              )}
            />
          </Link>
        ))}
      </nav>
    </div>
  );
}
