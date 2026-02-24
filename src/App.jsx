import { DashboardProvider } from './context/DashboardContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardGrid from './components/DashboardGrid';

export default function App() {
  return (
    <DashboardProvider>
      <div className="flex h-screen overflow-hidden bg-[#f6f6f6] p-[10px] gap-[10px]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-y-auto rounded-[4px]">
          <Header />
          <main className="flex-1" role="main" aria-label="Dashboard widgets">
            <DashboardGrid />
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}
