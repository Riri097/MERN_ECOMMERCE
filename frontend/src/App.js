import { Outlet } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-4">
        <Outlet /> {/* This is where pages like Login/Home will appear */}
      </main>
      <Footer />
    </div>
  );
};

export default App;