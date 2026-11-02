import { useState, useEffect, useMemo } from "react";

/**
 * Galería de Obras Registradas (Práctica 5)
 *
 * Criterios de la norma ISO 9241 aplicados:
 * 1. ISO 9241-110 (Adecuación a la tarea, Control del usuario e Información):
 *    - Búsqueda en tiempo real combinada con filtro de categorías y ordenamiento cronológico.
 *    - Indicadores de estado inmediato: Spinner de carga durante petición y estado vacío explicativo
 *      con botón de restablecimiento ("Limpiar filtros") cuando no hay resultados coincidentes.
 * 2. ISO 9241-171 / W3C (Ergonomía de accesibilidad física y táctil):
 *    - Tamaño mínimo de interacción de 44x44px en controles de formulario (input de búsqueda,
 *      selector de categoría, selector de orden) y botones táctiles interactivos.
 */

const CATEGORIAS = ["Todas", "Diseño", "Fotografía", "Escritura", "Cine"];

export default function Galeria() {
  const [obras, setObras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Estados de control para filtros, búsqueda y ordenamiento
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [orden, setOrden] = useState("recientes"); // 'recientes' | 'antiguas'

  // ISO 9241-110: Retroalimentación y control de estado
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

  // Filtrado y ordenamiento combinado
  const obrasFiltradas = useMemo(() => {
    return obras
      .filter((obra) => {
        // Filtro por búsqueda (título o autor)
        const q = busqueda.trim().toLowerCase();
        const coincideTexto =
          q === "" ||
          obra.titulo?.toLowerCase().includes(q) ||
          obra.autor?.toLowerCase().includes(q);

        // Filtro por categoría
        const coincideCategoria =
          categoriaSeleccionada === "Todas" ||
          obra.categoria?.toLowerCase() === categoriaSeleccionada.toLowerCase();

        return coincideTexto && coincideCategoria;
      })
      .sort((a, b) => {
        const fechaA = new Date(a.fechaRegistro || 0).getTime();
        const fechaB = new Date(b.fechaRegistro || 0).getTime();
        return orden === "recientes" ? fechaB - fechaA : fechaA - fechaB;
      });
  }, [obras, busqueda, categoriaSeleccionada, orden]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoriaSeleccionada("Todas");
    setOrden("recientes");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Galería de Obras</h1>
        <p className="text-sm text-gray-500">
          Catálogo oficial de obras intelectuales registradas en Registra-IP.
        </p>
      </div>

      {/* ISO 9241-171: Barra de controles con altura accesible de toque (mínimo 44px) */}
      <section
        aria-label="Controles de búsqueda y filtros"
        className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-200 md:flex-row md:items-center md:justify-between"
      >
        {/* Barra de búsqueda por título o autor */}
        <div className="relative flex-1">
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por título o autor..."
            aria-label="Buscar obras por título o autor"
            className="w-full min-h-[44px] rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filtro por categoría */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-auto">
            <label htmlFor="filtro-categoria" className="sr-only">
              Filtrar por categoría
            </label>
            <select
              id="filtro-categoria"
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="w-full sm:w-auto min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "Todas" ? "Todas las categorías" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenar por fecha */}
          <div className="w-full sm:w-auto">
            <label htmlFor="filtro-orden" className="sr-only">
              Ordenar por fecha
            </label>
            <select
              id="filtro-orden"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="w-full sm:w-auto min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="recientes">Más recientes primero</option>
              <option value="antiguas">Más antiguas primero</option>
            </select>
          </div>
        </div>
      </section>

      {/* ISO 9241-110: Indicador de carga visual */}
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

      {/* Estado vacío informativo (ISO 9241-110) */}
      {!cargando && !error && obrasFiltradas.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 px-4 text-center">
          <span className="text-4xl mb-2">🔍</span>
          <p className="text-base font-semibold text-gray-900">No se encontraron obras</p>
          <p className="mt-1 text-sm text-gray-500 max-w-sm">
            No hay registros que coincidan con los filtros aplicados. Intenta con otros términos o limpia los filtros.
          </p>
          <button
            type="button"
            onClick={limpiarFiltros}
            className="mt-4 min-h-[44px] rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Grid responsivo con CSS Grid */}
      {!cargando && !error && obrasFiltradas.length > 0 && (
        <div>
          <div className="mb-3 text-xs text-gray-500">
            Mostrando {obrasFiltradas.length} {obrasFiltradas.length === 1 ? "obra" : "obras"}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {obrasFiltradas.map((obra) => (
              <TarjetaObra key={obra.folio} obra={obra} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TarjetaObra({ obra }) {
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
