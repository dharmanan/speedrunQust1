import Link from "next/link";

export default function Home() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1>Scaffold-ETH 2 Next.js Frontend Başarılı!</h1>
      <Link href="/myNFTs" style={{ marginTop: 32, fontSize: 20, color: '#0070f3', textDecoration: 'underline' }}>
        My NFTs sayfasına git
      </Link>
    </main>
  );
}
