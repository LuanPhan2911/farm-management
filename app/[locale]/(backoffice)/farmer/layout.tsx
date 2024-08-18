import { checkRole } from "@/lib/role";
import { redirect } from "@/navigation";

import { PropsWithChildren } from "react";

const FarmerLayout = ({ children }: PropsWithChildren) => {
  if (!checkRole("admin") && !checkRole("superadmin") && !checkRole("farmer")) {
    return redirect("/");
  }
  return children;
};

export default FarmerLayout;
