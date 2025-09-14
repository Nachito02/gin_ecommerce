"use client";

import { useState } from "react";

export default function ImageGalleryClient({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [image, setImage] = useState(images?.[0]);

  if (!images?.length) return null;

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/60 p-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-50">
        <img src={image} alt={`Imagen principal de ${title}`} className="h-full w-full object-contain" />
      </div>
      <div className="mt-3 flex gap-2 overflow-auto">
        {images.map((src) => {
          const selected = src === image;
          return (
            <button
              key={src}
              onClick={() => setImage(src)}
              className={[
                "h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-neutral-100 ring-1 transition",
                selected ? "ring-[#840c4a]" : "ring-transparent hover:ring-neutral-300",
              ].join(" ")}
              aria-label="Cambiar imagen"
            >
              <img src={src} alt={`Miniatura ${title}`} className="h-full w-full object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
