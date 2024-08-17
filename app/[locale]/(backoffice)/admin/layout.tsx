import { checkRole } from "@/lib/role";
import { redirect } from "@/navigation";

import { auth } from "@clerk/nextjs/server";
import { PropsWithChildren } from "react";

const AdminLayout = ({ children }: PropsWithChildren) => {
  console.log(auth().sessionClaims?.metadata);

  if (!checkRole("admin")) {
    return redirect("/");
  }

  return children;
};

export default AdminLayout;
