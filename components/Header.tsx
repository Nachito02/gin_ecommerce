"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, User, ShoppingCart } from "lucide-react";
import useLoginModal from "@/hooks/useLoginModal";
import useCarritoStore from "@/hooks/useCarritoStore"; // Asegúrate de importar la tienda de carrito

import Avatar from "./Avatar";

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

  // Obtener productos desde el carrito
  const productos = useCarritoStore((state) => state.productos);

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
    <header className="flex text-white justify-between items-center gap-5 px-9 py-4 bg-[#1f1f1f] shadow-md relative">
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
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
        >
          <ShoppingCart
            size={50}
            className="cursor-pointer text-white"
            onClick={() => setIsOpen(!isOpen)} // Al hacer click alternamos el estado isOpen
          />

          {/* Mostrar pop-up solo si isOpen es true */}
          {(visible || isOpen) && (
            <div
              ref={carritoRef} // Asociamos la referencia al div del carrito
              className="absolute top-full right-0 mt-2 w-64 bg-[#1f1f1f] text-white shadow-lg border rounded z-10 p-4"
            >
              <h3 className="font-bold mb-2">Carrito:</h3>
              <ul className="space-y-2">
                {productos.length > 0 ? (
                  productos.map((item) => (
                   <li key={item.id} className="flex justify-between items-center text-sm">
                     <img src={item.thumbnail} alt={item.title} className="w-10 h-10 mr-2" />
                      <span>{item.title}</span>
                      <div className="flex items-center gap-3">
                        <span>{item.price}</span>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded "
                          onClick={() => useCarritoStore.getState().quitarProducto(item.id)}
                        >
                          Quitar
                        </button>
                      </div>
                    </li>

                   
                  ))
                ) : (
                  <li className="text-red-500 text-sm">El carrito está vacío</li>
                )}
              </ul>
            </div>
          )}
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
