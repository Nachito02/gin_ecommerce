"use client";

import { useState, } from "react";
import Link from "next/link";
import { Menu, X, Search, User, ShoppingCart } from "lucide-react";
import useLoginModal from "@/hooks/useLoginModal";
import Avatar from "../Avatar";

interface HeaderProps {
  currentUser: any;
}

export default function DashboardHeader({ currentUser }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const loginModal = useLoginModal();


  return (
    
    <header className=" bg-white shadow-sm px-4 py-3 text-black font-light md:relative flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold">
        GIN Muebles | Dashboard
      </Link>

      {/* Botón hamburguesa visible solo en móviles */}
      <button
        className="md:hidden z-20"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div className="hidden md:flex gap-4 items-center">
        {/* Campo de búsqueda que aparece al lado de la lupa */}
        {searchOpen && (
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-white px-2 py-1 rounded transition-all duration-300 w-48"
            autoFocus
          />
        )}
      <Link
  href="/dashboard/cargar-producto"
  className="text-base md:text-lg font-medium text-gray-700 hover:text-black px-4 py-2 rounded-md transition-colors duration-200 border border-transparent hover:border-gray-300"
>
  Nuevo producto
</Link>

        {!currentUser?.id ? (
          <User size={28} onClick={() => loginModal.onOpen()} />
        ) : (
          <Avatar src={currentUser.image} />
        )}
      </div>

      {/* Menú móvil desplegable */}
      <nav
        className={`absolute top-16 left-0 w-full  bg-white shadow-md flex flex-col items-center gap-4 p-4 transition-all duration-300 md:hidden z-10 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <Link href="/dashboard/cargar-producto" onClick={() => setMenuOpen(false)}>
         Nuevo Producto
        </Link>
       
      </nav>
    </header>
  );
}
