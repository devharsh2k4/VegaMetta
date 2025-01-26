import dynamic from 'next/dynamic';

const MeTTaEditor = dynamic(() => import('@/components/metta-editor'), {
  ssr: false
});

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Welcome to VegameTTA</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <MeTTaEditor />
      </main>
    </div>
  );
}