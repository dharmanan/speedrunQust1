import Link from "next/link";

export default function Home() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Link href="/myNFTs">
        <button style={{
          padding: '16px 32px',
          fontSize: 18,
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer'
        }}>
          My NFTs Sayfasına Git
        </button>
      </Link>
    </main>
  );
}
