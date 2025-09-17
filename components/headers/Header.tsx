"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, User, ShoppingCart } from "lucide-react";
import useLoginModal from "@/hooks/useLoginModal";
import useCarritoStore from "@/hooks/useCarritoStore"; // Asegúrate de importar la tienda de carrito
import Avatar from "../Avatar";
import CartButton from "../cart/CartButton";
import CartDropdown from "../cart/CartDropdown";


interface HeaderProps {
  currentUser : any;
}

export default function Header({currentUser} : HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loginModal = useLoginModal();
  const [visible, setVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar si el pop-up está abierto
  const [cartOpen, setCartOpen] = useState(false);

  // Obtener productos desde el carrito
  const productos = useCarritoStore((state) => state.items);

  // Referencia para el pop-up del carrito
  const carritoRef = useRef<HTMLDivElement | null>(null); // Aquí especificamos el tipo

  // Cerrar el pop-up si el usuario hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (carritoRef.current && !carritoRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex text-white justify-between items-center gap-5 px-9 py-4 bg-[#1f1f1f] shadow-md fixed top-0 left-0 w-full z-50 md:relative">
      <Link href="/" className="text-2xl font-bold">
        GIN Muebles
      </Link>

      {/* Botón hamburguesa visible solo en móviles */}
      <button
        className="md:hidden z-20"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Navegación en escritorio */}
      <nav className="hidden md:flex gap-6">
        <Link href="/categorias/sillas">Sillas</Link>
        <Link href="/categorias/mesas">Mesas</Link>
        <Link href="/categorias/camas">Camas</Link>
        <Link href="/carrito">Carrito</Link>
      </nav>

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
        <button onClick={() => setSearchOpen(!searchOpen)}>
          <Search size={28} />
        </button>
        {!currentUser?.id ? ( <User size={28} onClick={() => loginModal.onOpen()} />) : (<Avatar src={currentUser.image} />)}

        {/* Carrito flotante */}
        <div
          className="relative"
        >
          <CartButton onClick={() => setCartOpen((o) => !o)} />
          <CartDropdown open={cartOpen}  onClose={() => setCartOpen(!cartOpen)} />
        </div>
      </div>

      {/* Menú móvil desplegable */}
      <nav
        className={`absolute top-16 left-0 w-full bg-[#1f1f1f] shadow-md flex flex-col items-center gap-4 p-4 transition-all duration-300 md:hidden z-10 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <Link href="/categorias/sillas" onClick={() => setMenuOpen(false)}>
          Sillas
        </Link>
        <Link href="/categorias/mesas" onClick={() => setMenuOpen(false)}>
          Mesas
        </Link>
        <Link href="/categorias/camas" onClick={() => setMenuOpen(false)}>
          Camas
        </Link>
        <Link href="/carrito" onClick={() => setMenuOpen(false)}>
          Carrito
        </Link>
      </nav>
    </header>
  );
}
