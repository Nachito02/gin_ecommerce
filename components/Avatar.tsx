"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

type AvatarMenuItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
};

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  showDashboard?: boolean; // muestra /dashboard
  onSignOut?: () => void;  // si preferís pasar tu signOut por prop
}

export default function Avatar({
  src,
  name = "Usuario",
  showDashboard = false,
  onSignOut,
}: AvatarProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // cerrar al click afuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  const initials = name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("") || "U";

  const defaultItems: AvatarMenuItem[] = [
    { label: "Mi cuenta", href: "/cuenta" },
    { label: "Mis compras", href: "/compras" },
    { label: "Favoritos", href: "/favoritos" },
    ...(showDashboard ? [{ label: "Dashboard", href: "/dashboard" }] : []),
    {
      label: "Cerrar sesión",
      danger: true,
      onClick: async () => {
        if (onSignOut) return onSignOut();
        try {
          // Descomenta según tu setup:
          // await signOut({ callbackUrl: "/" });
          // o:
          await signOut();
        } catch(error) {
          console.log(error);
        }
      },
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="group inline-flex items-center gap-2 rounded-full pl-1 pr-3 py-1 bg-white/80 ring-1 ring-black/10 hover:bg-white transition"
      >
        {/* Avatar */}
        {src ? (
          <Image
            src={src}
            alt={name || "Usuario"}
            width={32}
            height={32}
            className="rounded-full ring-1 ring-black/10 object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full grid place-items-center bg-[#840c4a]/10 text-[#840c4a] font-semibold ring-1 ring-black/10">
            {initials}
          </div>
        )}
        {/* caret */}
        <svg
          className={`h-4 w-4 text-neutral-600 transition-transform group-hover:text-neutral-800 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.106l3.71-3.875a.75.75 0 0 1 1.08 1.04l-4.24 4.43a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06z" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black/10 overflow-hidden z-50"
        >
          {/* header mini (ML vibe) */}
          <div className="flex items-center gap-3 px-3 py-3 bg-white">
            {src ? (
              <Image
                src={src}
                alt={name || "Usuario"}
                width={36}
                height={36}
                className="rounded-full ring-1 ring-black/10 object-cover"
              />
            ) : (
              <div className="h-9 w-9 rounded-full grid place-items-center bg-[#840c4a]/10 text-[#840c4a] font-semibold ring-1 ring-black/10">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-semibold text-neutral-900 truncate">
                {name}
              </div>
              <div className="text-xs text-neutral-500">Mi cuenta</div>
            </div>
          </div>

          <div className="h-px bg-neutral-100" />

          <ul className="py-1">
            {defaultItems.map((item) => {
              const cls =
                "w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 transition flex items-center";
              if (item.href) {
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`${cls} ${item.danger ? "text-red-600 hover:bg-red-50" : "text-neutral-800"}`}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    className={`${cls} ${item.danger ? "text-red-600 hover:bg-red-50" : "text-neutral-800"}`}
                    onClick={() => {
                      setOpen(false);
                      item.onClick?.();
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
