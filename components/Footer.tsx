// components/Footer.jsx
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-[#1f1f1f] text-white py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Logo e info */}
        <div>
          <h2 className="text-2xl font-bold text-[#b5835a]">GIN Muelbles</h2>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <MdPhone /> +54 9 11 3150 4319
            </p>
            <p className="flex items-center gap-2">
              <MdEmail /> ginmuebles@gmail.com
            </p>
            <div className="flex gap-3 text-xl mt-2">
              <FaWhatsapp className="cursor-pointer hover:text-[#b5835a]" />
              <FaInstagram className="cursor-pointer hover:text-[#b5835a]" />
            </div>
          </div>
        </div>

        {/* Quienes somos */}
        <div>
          <h3 className="font-bold mb-3">QUIENES SOMOS</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#">Tienda</a></li>
            <li><a href="#">Nosotros</a></li>
            <li><a href="#">Novedades</a></li>
            <li><a href="#">Contáctanos</a></li>
          </ul>
        </div>

        {/* Categorías */}
        <div>
          <h3 className="font-bold mb-3">CATEGORÍAS</h3>
          <ul className="space-y-2 text-sm">
            <li>Rack para TV de madera</li>
            <li>Sillones exterior</li>
            <li>Mesas ratonas de madera</li>
            <li>Barras & banquetas</li>
            <li>Mesas de luz</li>
            <li>Cómodas</li>
            <li>Recibidores & Ateliers</li>
            <li>Cotizamos tu mueble a medida</li>
          </ul>
        </div>

        {/* Links útiles */}
        <div>
          <h3 className="font-bold mb-3">LINKS ÚTILES</h3>
          <ul className="space-y-2 text-sm">
            <li>Políticas de Privacidad</li>
            <li>Términos y Condiciones</li>
            <li>Devoluciones</li>
            <li>Contáctenos</li>
          </ul>
        </div>

        {/* Zonas */}
        <div>
          <h3 className="font-bold mb-3">ZONAS</h3>
          <ul className="space-y-2 text-sm">
            <li>Berazategui</li>
            <li>Capital Federal</li>
            <li>Hudson</li>
            <li>La Plata</li>
            <li>Quilmes</li>
          </ul>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="border-t border-gray-600 mt-10 pt-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Nombre. Todos los derechos reservados.
      </div>
    </footer>
  );
}
