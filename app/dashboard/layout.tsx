import Sidebar from '@/app/ui/dashboard/sidebar';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-svh flex-col-reverse md:flex-row md:overflow-hidden">
      <div className="flex w-full flex-none md:w-64">
        <Sidebar />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-8 md:pt-12 overflow-auto">{children}</div>
    </div>
  );
}