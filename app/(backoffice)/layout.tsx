import { Sidebar } from "./_components/sidebar";

interface BackOfficeLayoutProps {
  children: React.ReactNode;
}

const BackOfficeLayout = ({ children }: BackOfficeLayoutProps) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      <div>
        {/* Header */}
        {/* Navbar */}
        <main> {children}</main>
      </div>
      {/* Main body */}
    </div>
  );
};

export default BackOfficeLayout;
