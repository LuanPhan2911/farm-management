import { checkRole } from "@/lib/role";
import { redirect } from "@/navigation";

import { PropsWithChildren } from "react";
import { FarmerSidebar } from "../_components/farmer-sidebar";

const FarmerLayout = ({ children }: PropsWithChildren) => {
  if (!checkRole("admin") && !checkRole("superadmin") && !checkRole("farmer")) {
    return redirect("/");
  }
  return (
    <>
      <FarmerSidebar />
      <main className="min-h-full h-fit w-full py-16 sm:px-6 px-2 ">
        {children}
      </main>
    </>
  );
};

export default FarmerLayout;
