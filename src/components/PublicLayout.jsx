import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f1720]">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
