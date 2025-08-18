import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router';

function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AuthLayout;
