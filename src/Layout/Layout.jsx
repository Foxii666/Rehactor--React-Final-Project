import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import Searchbar from '../components/Searchbar';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar fissa a sinistra */}
        <aside className="w-60 bg-white border-r border-gray-200 sticky top-0 h-screen overflow-y-auto p-4">
          <Sidebar />
        </aside>

        <div className="style-searchbar-filter">
          <Searchbar />
        </div>

        {/* Area principale contenuti */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Layout;
