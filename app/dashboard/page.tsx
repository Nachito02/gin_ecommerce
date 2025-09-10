"use client";
import React, { useState } from "react";
import Button from "@/components/Button";

export default function ProductForm() {
  const [form, setForm] = useState({
    title: "",
    image: "",
    description: "",
    price: "",
    categoryId: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del producto:", form);
    // Aquí iría la lógica para enviar a tu API con fetch o axios
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-[#e7dccd]  rounded-lg shadow-lg space-y-6"
    >
      <h2 className="text-3xl font-bold text-black mb-4">Crear nuevo producto</h2>

      <input
        name="title"
        placeholder="Nombre del producto"
        onChange={handleChange}
        className="w-full p-4 text-lg border border-black rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />

      <input
        name="image"
        placeholder="URL de imagen"
        onChange={handleChange}
        className="w-full p-4 text-lg border border-black rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />

      <textarea
        name="description"
        placeholder="Descripción"
        onChange={handleChange}
        className="w-full p-4 text-lg border border-black  rounded resize-none h-32 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />

      <input
        name="price"
        type="number"
        placeholder="Precio"
        onChange={handleChange}
        className="w-full p-4 text-lg border border-black  rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />

      <select
        name="categoryId"
        onChange={handleChange}
        className="w-full p-4 text-lg border text-white rounded bg-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
      >
        <option value="">Selecciona una categoría</option>
        {/* Aquí podrías mapear dinámicamente las categorías desde tu base */}
        <option value="sillas">Sillas</option>
        <option value="mesas">Mesas</option>
        <option value="sofás">Sofás</option>
      </select>

      <div className="pt-4">
        <Button
          label="Crear producto"
          type="submit"
          outline={false}
          small={false}
        />
      </div>
    </form>
  );
}

//imput
//fomulario para crear produtos
//campos del prima
//para crear categorias
