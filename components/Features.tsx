import { FC } from "react";
import FeatureCard from "./FeatureCard";
import { CirclePercent, Handshake, Truck } from "lucide-react";

const data = [
  {
    icon: <Truck className="mt-1" />,
    title: "Envio Gratis",
    desc: "Para todo el pais",
  },
  {
    icon: <CirclePercent className="mt-1" />,
    title: "Promociones",
    desc: "Descuentos exclusivos",
  },
  {
    icon: <Handshake className="mt-1" />,
    title: "Atencion al cliente",
    desc: "Nosotros te ayudamos",
  },
];

const Features: FC = () => (
  <div className="px-4 bg-[#1f1f1f] md:rounded-md md:mt-8 container  grid sm:grid-cols-2 lg:grid-cols-3  mx-auto ">
    {data.map((item) => (
      <FeatureCard
        key={item.title}
        icon={item.icon}
        title={item.title}
        desc={item.desc}
      />
    ))}
  </div>
);

export default Features;
