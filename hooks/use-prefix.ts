import { useCurrentStaffRole } from "./use-current-staff-role";

export const usePrefix = () => {
  const { isOnlyAdmin, isFarmer } = useCurrentStaffRole();
  const prefixAdmin = isOnlyAdmin ? "/admin" : null;
  const prefixFarmer = isFarmer ? "/farmer" : null;

  let prefix = undefined;
  if (isOnlyAdmin) {
    prefix = prefixAdmin;
  }
  if (isFarmer) {
    prefix = prefixFarmer;
  }
  return prefix;
};
