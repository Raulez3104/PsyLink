import Header from './pages/Header_Web';
import Footer from './pages/Footer_Web';
import ChatBot from './components/Chatbot';

const App2: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-column min-h-screen w-full" style={{ overflowX: 'hidden' }}>
      <Header />
      <main className="flex-1 w-full">
        {children}
      </main>
      <ChatBot/>
      <Footer />
    </div>
  );
};

export default App2;