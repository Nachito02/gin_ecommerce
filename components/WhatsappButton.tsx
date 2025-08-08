// components/WhatsappButton.tsx
"use client";

import Link from "next/link";
import { BsWhatsapp } from "react-icons/bs";

const WhatsappButton = () => {
  return (
    <Link
      href="https://wa.me/5491123456789" // <-- cambiá este número por el tuyo
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg transition-all z-50"
      title="Hablar por WhatsApp"
    >
      <BsWhatsapp className="w-5 h-5" />
    </Link>
  );
};

export default WhatsappButton;
