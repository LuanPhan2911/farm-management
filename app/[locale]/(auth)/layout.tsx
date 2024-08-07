interface AuthLayoutProps {
  children: React.ReactNode;
}
const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex h-full items-center justify-center">{children}</div>
  );
};

export default AuthLayout;
