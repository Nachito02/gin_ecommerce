import { FC } from "react";
import { FeatureItem } from "@/models/FeatureItem";

const FeatureCard: FC<FeatureItem> = ({ icon, desc, title }) => (
  <div className="flex text-white  gap-2 bg-[#1f1f1f] px-4 py-6 font-karla justify-center">
    {icon}
    <div>
      <h2 className="font-medium text-xl ">{title}</h2>
      <p className="text-gray-600 ">{desc}</p>
    </div>
  </div>
);

export default FeatureCard;
