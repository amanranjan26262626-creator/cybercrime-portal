import Header from '@/components/layout/Header';
import ComplaintForm from '@/components/forms/ComplaintForm';

export default function NewComplaintPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Report Cybercrime</h1>
        <ComplaintForm />
      </main>
    </div>
  );
}

