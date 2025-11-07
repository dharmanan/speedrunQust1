export const metadata = {
  title: 'SpeedRun Quest',
  description: 'NFT Platform',
  icons: {
    icon: '/favicon.svg',
  },
}

import "./globals.css";
import NavBar from "../components/NavBar";

export default function RootLayout({
  children,
}: {
  children: any
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
