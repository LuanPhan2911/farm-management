interface HeadingProps {
  title: string;
}
export const Heading = ({ title }: HeadingProps) => {
  return <h2 className="text-2xl font-semibold py-4">{title}</h2>;
};
