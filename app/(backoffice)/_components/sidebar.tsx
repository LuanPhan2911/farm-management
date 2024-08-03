import Link from "next/link";

export const Sidebar = () => {
  return (
    <div className="bg-yellow-400 space-y-6 w-52">
      <Link href={"#"}>Logo</Link>
      <div className="space-y-3">
        <Link href={"/dashboard"}>Dashboard</Link>
        <Link href={"/dashboard"}>Dashboard</Link>
        <Link href={"/dashboard"}>Dashboard</Link>
        <Link href={"/dashboard"}>Dashboard</Link>
        <Link href={"/dashboard"}>Dashboard</Link>
      </div>
    </div>
  );
};
