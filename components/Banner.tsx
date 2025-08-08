import Link from "next/link";
import { FC } from "react";

const Banner: FC = () => (
  <div className="bg-[#e7dccd] p-4 ">
    <div className="container mt-2 mx-auto px-4 md:flex justify-center font-lora ">
    <img src="./images/banner.webp" alt="banner" className="md:w-1/2" />
    <div className="bg-[#e3edf6]  md:w-1/2 flex flex-col items-center text-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-1">No te lo pierdas</h1>
      <h2 className="text-3xl font-semibold mb-4"> comprá ahora </h2>
      <Link
        href="/product/4"
        className="inline-block bg-[#1f1f1f]  rounded-md px-6 py-3 hover:bg-blue-500 text-white"
        data-test="banner-btn"
      >
        Shop Now
      </Link>
    </div>
  </div>
  </div>
);

export default Banner;