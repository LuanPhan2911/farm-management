import { useMediaQuery } from "react-responsive";

export const useMedia = () => {
  const isDesktop = useMediaQuery({
    minWidth: 768,
  });
  const isMobile = useMediaQuery({
    maxWidth: 576,
  });
  return { isDesktop, isMobile };
};
