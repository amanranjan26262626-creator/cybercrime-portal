import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Decentralized Cybercrime Reporting Portal
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Report cybercrimes securely with blockchain-backed immutable storage.
              Get AI-powered assistance in Hindi, Santhali, and Nagpuri.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/complaint/new"
                className="px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Report Crime
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold mb-2">Blockchain Security</h3>
                <p className="text-gray-600">
                  All complaints are stored on Polygon blockchain for immutable record keeping.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold mb-2">AI Chatbot</h3>
                <p className="text-gray-600">
                  Get assistance in Hindi, Santhali, and Nagpuri languages with our AI-powered chatbot.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
                <p className="text-gray-600">
                  Track your complaint status in real-time with instant notifications.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Report a Cybercrime?</h2>
            <p className="text-xl mb-8">Help us make cyberspace safer for everyone</p>
            <Link
              href="/complaint/new"
              className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
            >
              Report Now
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
