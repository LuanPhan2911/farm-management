import { siteConfig } from "@/configs/siteConfig";
import { Link } from "@/navigation";

export const Footer = () => {
  return (
    <footer className="rounded-lg shadow py-4 px-2">
      <p className="text-muted-foreground text-center text-xs lg:text-sm">
        © 2024{" "}
        <Link
          href={"/"}
          className="hover:underline font-semibold text-green-500"
        >
          {siteConfig.name}
        </Link>
        . All Rights Reserved.
      </p>
      <p className="text-muted-foreground text-center text-xs lg:text-sm">
        {siteConfig.address}
      </p>
    </footer>
  );
};
