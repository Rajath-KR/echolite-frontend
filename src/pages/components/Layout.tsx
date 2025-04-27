import { Sidebar } from '@/pages/components/Sidebar';
import { TopNavigation } from '@/pages/components/TopNavigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />

      <div className="grid grid-cols-[2fr_5fr] gap-4">
        <Sidebar />

        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
