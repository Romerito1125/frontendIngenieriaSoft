"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Send, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";


export default function CrearAlertaForm() {
  const [formData, setFormData] = useState({
    tipo: "",
    mensaje: "",
    idruta: "",
    idestacion: "",
    prioridad: "media",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rutas, setRutas] = useState([]);
  const [estaciones, setEstaciones] = useState([]);

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const response = await fetch(
          "https://www.api.devcorebits.com/tiemporealGateway/rutas"
        );
        const data = await response.json();
        setRutas(data);
      } catch (error) {
        console.error("Error al obtener las rutas:", error);
      }
    };
    fetchRutas();
  }, []);

  useEffect(() => {
    const fetchEstaciones = async () => {
      try {
        const response = await fetch(
          "https://www.api.devcorebits.com/tiemporealGateway/estaciones"
        );
        const data = await response.json();
        setEstaciones(data);
      } catch (error) {
        console.error("Error al obtener las estaciones:", error);
      }
    };
    fetchEstaciones();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const filteredData = {
      tipo: formData.tipo,
      mensaje: formData.mensaje,
      idruta: formData.idruta || null,
      idestacion: formData.idestacion || null,
      prioridad: formData.prioridad,
    };

    try {
      const response = await fetch(
        "https://www.api.devcorebits.com/alertasGateway/alertas/crearAlerta",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filteredData),
        }
      );

      if (response.ok) {
        toast.success("¡Alerta creada exitosamente! 🚨");
        setFormData({
          tipo: "",
          mensaje: "",
          idruta: "",
          idestacion: "",
          prioridad: "media",
        });
      } else {
        toast.error("Error al crear la alerta. Intenta de nuevo.");
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-red-50 to-orange-50 min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-[1.01] transition-transform duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl shadow-lg">
            <AlertTriangle className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Crear Alerta</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Alerta
            </label>
            <input
              type="text"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white"
              placeholder="Demora, cierre, accidente."
            />
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mensaje
            </label>
            <textarea
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white resize-none"
              placeholder="Describe la alerta en detalle..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ID Ruta
              </label>
              <select
                name="idruta"
                value={formData.idruta}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white"
              >
                <option value="">Selecciona una ruta</option>
                {rutas.map((ruta: { idruta: string }) => (
                  <option key={ruta.idruta} value={ruta.idruta}>
                    {ruta.idruta}
                  </option>
                ))}
              </select>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estación
              </label>
              <select
                name="idestacion"
                value={formData.idestacion}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white"
              >
                <option value="">Selecciona una estación</option>
                {estaciones.map(
                  (estacion: { idestacion: string; nombre: string }) => (
                    <option
                      key={estacion.idestacion}
                      value={estacion.idestacion}
                    >
                      {estacion.nombre}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Prioridad
            </label>
            <select
              name="prioridad"
              value={formData.prioridad}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
            <div className="relative flex items-center justify-center gap-3">
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              )}
              <span className="text-lg">
                {isSubmitting ? "Creando Alerta..." : "Crear Alerta"}
              </span>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
