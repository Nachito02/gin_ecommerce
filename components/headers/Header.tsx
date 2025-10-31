"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, User } from "lucide-react";
import useLoginModal from "@/hooks/useLoginModal";
import useCarritoStore from "@/hooks/useCarritoStore";
import Avatar from "../Avatar";
import CartButton from "../cart/CartButton";
import CartDropdown from "../cart/CartDropdown";

interface HeaderProps {
  currentUser: any;
}

export default function Header({ currentUser }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const loginModal = useLoginModal();
  const [cartOpen, setCartOpen] = useState(false);
  const carritoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        carritoRef.current &&
        !carritoRef.current.contains(event.target as Node)
      ) {
        setCartOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50  bg-black shadow-sm px-4 py-3 text-white font-light md:relative flex items-center justify-between">
        {/* Menú hamburguesa */}
        <div className="flex  justify-start w-[40px]">
          <button
            className="cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={22} className="md:size-7" />
            ) : (
              <Menu size={22} className="md:size-7" />
            )}
          </button>
        </div>

        {/* Título centrado en desktop */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
          <Link
            href="/"
            className="text-xl md:text-2xl text-white font-bold tracking-wide"
          >
            GIN Muebles
          </Link>
        </div>

        {/* Título en mobile (fluido) */}
        <div className="md:hidden">
          <Link
            href="/"
            className="text-xl text-white font-bold tracking-wide"
          >
            GIN Muebles
          </Link>
        </div>

        {/* Íconos a la derecha */}
        <div className="flex gap-3 md:gap-4 items-center text-white text-sm ">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="hover:text-gray-600 transition"
          >
            <Search size={18} className="md:size-7" />
          </button>
          {!currentUser?.id ? (
            <User
              
              onClick={() => loginModal.onOpen()}
              className="size-5 md:size-7 hover:text-gray-600 transition"
            />
          ) : (
            <Avatar src={currentUser.image} />
          )}
          <div className="relative mt-2 md:mt-1">
            <CartButton
              onClick={() => setCartOpen((o) => !o)}
              className="size-5 md:size-7"
            />
            <CartDropdown open={cartOpen} onClose={() => setCartOpen(!cartOpen)} />
          </div>
        </div>
      </header>

      {/* Input de búsqueda en mobile */}
      {searchOpen && (
        <div className="fixed top-[64px] left-0 w-full px-4 py-3 bg-white shadow-md z-40 md:hidden">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-300 text-black text-sm"
            autoFocus
          />
        </div>
      )}

      {/* Menú lateral tipo Dior */}
      {
        <>
          <div
            className={menuOpen ? "fixed inset-0 bg-black/50 z-40" : ""}
            onClick={() => setMenuOpen(false)}
          />
          <nav
            className={`fixed top-0 w-1/2  h-screen left-0 bottom-6 h-100vh max-w-xs bg-[#1f1f1f] shadow-lg z-50 flex flex-col items-start gap-6 p-6 transform transition-all duration-500 [transition-timing-function:cubic-bezier(0.77,0,0.175,1)] opacity-0 scale-95 ${
              menuOpen
                ? "translate-x-0 opacity-100 scale-100"
                : "-translate-x-200 opacity-0 scale-95"
            }`}
          >
            <button
              className="absolute top-4 left-4 text-white hover:text-gray-300"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              <X size={28} />
            </button>
            <div className="mt-12 flex flex-col gap-6">
              <Link
                href="/categorias/sillas"
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-gray-300"
              >
                Sillas
              </Link>
              <Link
                href="/categorias/mesas"
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-gray-300"
              >
                Mesas
              </Link>
              <Link
                href="/categorias/camas"
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-gray-300"
              >
                Camas
              </Link>
              <Link
                href="/carrito"
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-gray-300"
              >
                Carrito
              </Link>
            </div>
          </nav>
        </>
      }
    </>
  );
}
