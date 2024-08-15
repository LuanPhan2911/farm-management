import { SiteHeader } from "./_components/site-header";

interface FrontendLayoutProps {
  children: React.ReactNode;
}
const FrontendLayout = ({ children }: FrontendLayoutProps) => {
  return (
    <div className="w-full h-full">
      <SiteHeader />
      <main className="w-full h-fit p-5 lg:px-20"> {children}</main>
    </div>
  );
};

export default FrontendLayout;
