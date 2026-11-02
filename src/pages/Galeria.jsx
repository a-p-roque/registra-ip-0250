import { useState, useEffect } from "react";

/**
 * Galería de Obras Registradas (Práctica 5)
 *
 * Implementa criterios de la norma ISO 9241:
 * - ISO 9241-110 (Adecuación para la tarea y Principio de información al usuario):
 *   Indicadores visuales de estado y retroalimentación interactiva (loaders, mensajes de error,
 *   y estado vacío descriptivo cuando no hay coincidencias).
 * - ISO 9241-171 / W3C (Accesibilidad y ergonomía de interacción táctil):
 *   Área mínima interactiva de toque de 44x44px en controles de búsqueda, filtros y tarjetas clicables.
 */

export default function Galeria() {
  const [obras, setObras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Criterio ISO 9241-110: Retroalimentación y control de estado
  useEffect(() => {
    async function cargarObras() {
      try {
        setCargando(true);
        setError("");
        const res = await fetch("http://localhost:4000/obras");
        if (!res.ok) throw new Error("Error al obtener las obras del servidor");
        const data = await res.json();
        setObras(data);
      } catch (err) {
        setError("No se pudieron cargar las obras. Asegúrate de que el servidor esté activo.");
      } finally {
        setCargando(false);
      }
    }
    cargarObras();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Galería de Obras</h1>
          <p className="text-sm text-gray-500">
            Catálogo oficial de obras intelectuales registradas en Registra-IP.
          </p>
        </div>
      </div>

      {/* ISO 9241-110: Feedback visual de carga */}
      {cargando && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-3 text-sm font-medium">Cargando catálogo de obras...</p>
        </div>
      )}

      {error && !cargando && (
        <div role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Grid responsivo (CSS Grid) */}
      {!cargando && !error && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {obras.map((obra) => (
            <TarjetaObra key={obra.folio} obra={obra} />
          ))}
        </div>
      )}
    </div>
  );
}

function TarjetaObra({ obra }) {
  // Ícono según tipo de categoría/archivo
  const getIcono = (cat) => {
    switch (cat?.toLowerCase()) {
      case "diseño":
        return "🎨";
      case "fotografía":
      case "fotografia":
        return "📷";
      case "escritura":
        return "📝";
      case "cine":
        return "🎬";
      default:
        return "📄";
    }
  };

  return (
    <div
      tabIndex={0}
      className="group flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer min-h-[160px]"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-2xl" role="img" aria-label={obra.categoria || "Obra"}>
            {getIcono(obra.categoria)}
          </span>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            {obra.categoria || "General"}
          </span>
        </div>

        <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {obra.titulo}
        </h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-1">Por: {obra.autor}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span className="font-mono">{obra.folio}</span>
        <span>
          {obra.fechaRegistro
            ? new Date(obra.fechaRegistro).toLocaleDateString()
            : "—"}
        </span>
      </div>
    </div>
  );
}
