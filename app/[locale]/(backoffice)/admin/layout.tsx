import { checkRole } from "@/lib/role";
import { redirect } from "@/navigation";

import { PropsWithChildren } from "react";

const AdminLayout = ({ children }: PropsWithChildren) => {
  if (!checkRole("admin") && !checkRole("superadmin")) {
    return redirect("/");
  }

  return children;
};

export default AdminLayout;
