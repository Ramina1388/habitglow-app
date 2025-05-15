import './theme.css';
import '@coinbase/onchainkit/styles.css';
import './globals.css';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="fc:frame"
          content='{
            "version": "next",
            "imageUrl": "https://habitglow-app.vercel.app/preview.png",
            "button": {
              "title": "Start your glow",
              "action": {
                "type": "launch_frame",
                "url": "https://habitglow-app.vercel.app",
                "name": "HabitGlow",
                "splashImageUrl": "https://habitglow-app.vercel.app/icon.png",
                "splashBackgroundColor": "#ECE4D9"
              }
            }
          }'
        />
        <meta property="og:title" content="HabitGlow" />
        <meta property="og:description" content="Gamified habit tracker with mood sharing." />
        <meta property="og:image" content="https://habitglow-app.vercel.app/preview.png" />
      </head>
      <body className="bg-background flex justify-center">
        <div className="w-full max-w-[420px]">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
