import { Img } from "@react-email/components";
import Image from "next/image";

export const Icons = {
  logo: ({ width, height }: { width: number; height: number }) => {
    return <Image src={"/logo.png"} alt="Logo" width={width} height={height} />;
  },
  emailLogo: () => {
    const logoUrl = `${process.env.BASE_URL}/logo.png`;
    return <Img src={logoUrl} width={50} height={50} alt="Logo" />;
  },
};
