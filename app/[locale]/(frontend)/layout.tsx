import { Footer } from "./_components/footer";
import { SiteHeader } from "./_components/site-header";

interface FrontendLayoutProps {
  children: React.ReactNode;
}

const FrontendLayout = ({ children }: FrontendLayoutProps) => {
  return (
    <div
      className="w-full h-fit min-h-full"
      style={{
        backgroundImage: `url('/background.jpg')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <SiteHeader />
      <main className="w-full h-fit p-5 lg:px-20"> {children}</main>
      <Footer />
    </div>
  );
};

export default FrontendLayout;
