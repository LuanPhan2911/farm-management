import { Button } from "@/components/ui/button";
import { Navbar } from "./_components/navbar";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="flex flex-col gap-y-4 col-span-2">
          <h2 className="text-6xl font-extrabold mb-6 mt-20">
            Make beautiful websites regardless of your design experience.
          </h2>
          <div className="text-xl font-light ">
            Beautiful, fast and modern React UI library.
          </div>
          <div className="flex gap-x-4">
            <Button size={"lg"}>
              Get started <ArrowRight className="h-6 w-6 ml-2" />
            </Button>
          </div>
        </div>
        <div className="flex justify-center col-span-1">
          <div className="relative w-[400px] aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
            <Image src={"/home.jpg"} alt="Home" fill />
          </div>
        </div>
      </div>
    </div>
  );
}
