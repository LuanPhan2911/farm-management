import { checkRole } from "@/lib/role";
import { redirect } from "@/navigation";

import { PropsWithChildren } from "react";
import { AdminSidebar } from "../_components/admin-sidebar";

const AdminLayout = ({ children }: PropsWithChildren) => {
  if (!checkRole("admin") && !checkRole("superadmin")) {
    return redirect("/");
  }

  return (
    <>
      <AdminSidebar />
      <main className="min-h-full w-full pt-16 sm:px-6 px-2">{children}</main>
    </>
  );
};

export default AdminLayout;
