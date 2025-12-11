import Header from '@/components/layout/Header';
import FIRGenerator from '@/components/police/FIRGenerator';

export default function GenerateFIRPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <FIRGenerator />
      </main>
    </div>
  );
}

