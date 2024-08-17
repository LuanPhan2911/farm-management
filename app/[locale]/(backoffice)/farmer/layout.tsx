import { checkRole } from "@/lib/role";
import { redirect } from "@/navigation";
import { auth } from "@clerk/nextjs/server";
import { PropsWithChildren } from "react";

const FarmerLayout = ({ children }: PropsWithChildren) => {
  if (!checkRole("admin") && !checkRole("farmer")) {
    return redirect("/");
  }
  return children;
};

export default FarmerLayout;
