import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { generarCertificado } from "../utils/generarCertificado";

/**
 * Galería de Obras Registradas (Práctica 5)
 *
 * Criterios de la norma ISO 9241 aplicados:
 * 1. ISO 9241-110 (Adecuación a la tarea, Control del usuario e Información):
 *    - Búsqueda en tiempo real combinada con filtro de categorías y ordenamiento cronológico.
 *    - Indicadores de estado inmediato: Spinner de carga durante petición y estado vacío explicativo
 *      con botón de restablecimiento ("Limpiar filtros") cuando no hay resultados coincidentes.
 *    - Diálogo modal con control de foco, cierre mediante botón accesible o tecla Escape, y retroalimentación
 *      durante la generación del certificado PDF.
 * 2. ISO 9241-171 / W3C (Ergonomía de accesibilidad física y táctil):
 *    - Tamaño mínimo de interacción de 44x44px en controles de formulario (input de búsqueda,
 *      selector de categoría, selector de orden) y botones táctiles interactivos de descarga y cierre.
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

  // Estado para la vista de detalle en modal
  const [obraSeleccionada, setObraSeleccionada] = useState(null);

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
        const q = busqueda.trim().toLowerCase();
        const coincideTexto =
          q === "" ||
          obra.titulo?.toLowerCase().includes(q) ||
          obra.autor?.toLowerCase().includes(q);

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
    <div className="space-y-8">
      {/* Encabezado de la página */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#600250] ring-1 ring-[#600250]/15">
            Catálogo Oficial
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Galería de Obras
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Explora los registros intelectuales protegidos, consulta metadatos y descarga certificados.
          </p>
        </div>

        <Link
          to="/registrar-obra"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#600250] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#520244] transition-all active:scale-[0.98] self-start sm:self-auto"
        >
          + Nueva Obra
        </Link>
      </div>

      {/* ISO 9241-171: Barra de controles con accesibilidad táctil (mínimo 44px) */}
      <section
        aria-label="Controles de búsqueda y filtros"
        className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs sm:p-5"
      >
        <div className="flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between">
          {/* Input de Búsqueda */}
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              🔍
            </span>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por título de obra o nombre del autor..."
              aria-label="Buscar obras por título o autor"
              className="w-full min-h-[44px] rounded-xl border border-slate-300 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#600250] focus:ring-2 focus:ring-[#600250]/20 focus:outline-none transition-colors"
            />
          </div>

          {/* Filtros de Categoría y Orden */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-auto">
              <label htmlFor="filtro-categoria" className="sr-only">
                Filtrar por categoría
              </label>
              <select
                id="filtro-categoria"
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                className="w-full sm:w-auto min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 focus:border-[#600250] focus:ring-2 focus:ring-[#600250]/20 focus:outline-none transition-colors"
              >
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "Todas" ? "Todas las categorías" : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <label htmlFor="filtro-orden" className="sr-only">
                Ordenar por fecha
              </label>
              <select
                id="filtro-orden"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                className="w-full sm:w-auto min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 focus:border-[#600250] focus:ring-2 focus:ring-[#600250]/20 focus:outline-none transition-colors"
              >
                <option value="recientes">Más recientes primero</option>
                <option value="antiguas">Más antiguas primero</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ISO 9241-110: Indicador de carga visual */}
      {cargando && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#600250] border-t-transparent" />
          <p className="mt-3 text-sm font-medium text-slate-600">Cargando catálogo oficial...</p>
        </div>
      )}

      {error && !cargando && (
        <div role="alert" className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Estado vacío informativo (ISO 9241-110) */}
      {!cargando && !error && obrasFiltradas.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white py-16 px-4 text-center shadow-xs">
          <span className="text-4xl mb-3">🔍</span>
          <h2 className="text-lg font-bold text-slate-900">No se encontraron resultados</h2>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            Ninguna obra coincide con los filtros aplicados. Puedes intentar con otro término o restablecer.
          </p>
          <button
            type="button"
            onClick={limpiarFiltros}
            className="mt-5 min-h-[44px] rounded-xl bg-[#600250] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#520244] focus:outline-none focus:ring-2 focus:ring-[#600250] focus:ring-offset-2 transition-all cursor-pointer"
          >
            Restablecer filtros
          </button>
        </div>
      )}

      {/* Grid responsivo con CSS Grid */}
      {!cargando && !error && obrasFiltradas.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 px-1">
            <span>
              Mostrando <strong className="text-slate-800">{obrasFiltradas.length}</strong> de{" "}
              <strong className="text-slate-800">{obras.length}</strong> obras
            </span>
            {(busqueda || categoriaSeleccionada !== "Todas") && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="text-[#600250] font-semibold hover:underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {obrasFiltradas.map((obra) => (
              <TarjetaObra
                key={obra.folio}
                obra={obra}
                onClick={() => setObraSeleccionada(obra)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal de Detalle de Obra */}
      {obraSeleccionada && (
        <ModalDetalleObra
          obra={obraSeleccionada}
          onCerrar={() => setObraSeleccionada(null)}
        />
      )}
    </div>
  );
}

function TarjetaObra({ obra, onClick }) {
  const getBadgeStyle = (cat) => {
    switch (cat?.toLowerCase()) {
      case "diseño":
        return { icon: "🎨", bg: "bg-purple-50 text-[#600250] border-purple-200" };
      case "fotografía":
      case "fotografia":
        return { icon: "📷", bg: "bg-blue-50 text-blue-700 border-blue-200" };
      case "escritura":
        return { icon: "📝", bg: "bg-amber-50 text-amber-800 border-amber-200" };
      case "cine":
        return { icon: "🎬", bg: "bg-rose-50 text-rose-700 border-rose-200" };
      default:
        return { icon: "📄", bg: "bg-slate-50 text-slate-700 border-slate-200" };
    }
  };

  const badge = getBadgeStyle(obra.categoria);

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#600250]/40 cursor-pointer min-h-[185px] focus:outline-none focus:ring-2 focus:ring-[#600250]"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${badge.bg}`}
          >
            <span>{badge.icon}</span>
            <span>{obra.categoria || "General"}</span>
          </span>

          <span className="font-mono text-[11px] font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
            {obra.folio}
          </span>
        </div>

        <h3 className="mt-3.5 font-bold text-slate-900 group-hover:text-[#600250] transition-colors line-clamp-1 text-base">
          {obra.titulo}
        </h3>
        <p className="mt-1 text-xs text-slate-500 line-clamp-1">
          Autor: <span className="font-medium text-slate-700">{obra.autor || "Anónimo"}</span>
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>
          {obra.fechaRegistro
            ? new Date(obra.fechaRegistro).toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—"}
        </span>
        <span className="font-semibold text-[#600250] opacity-0 group-hover:opacity-100 transition-opacity">
          Ver detalle →
        </span>
      </div>
    </div>
  );
}

function ModalDetalleObra({ obra, onCerrar }) {
  const [descargando, setDescargando] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCerrar]);

  const handleDescargar = async () => {
    try {
      setDescargando(true);
      await generarCertificado(obra);
    } catch (err) {
      console.error("Error al generar certificado:", err);
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-modal-obra"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs transition-opacity"
      onClick={onCerrar}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del modal */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="inline-block rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#600250] ring-1 ring-[#600250]/15">
              {obra.categoria || "General"}
            </span>
            <h2 id="titulo-modal-obra" className="mt-2 text-xl font-extrabold text-slate-900">
              {obra.titulo}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar modal"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Metadatos completos */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Folio Único</dt>
            <dd className="mt-1 font-mono font-black text-[#600250]">{obra.folio}</dd>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Autor Registrado</dt>
            <dd className="mt-1 font-bold text-slate-900">{obra.autor || "—"}</dd>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Fecha de Registro</dt>
            <dd className="mt-1 text-xs text-slate-700 font-medium">
              {obra.fechaRegistro
                ? new Date(obra.fechaRegistro).toLocaleString("es-MX", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "—"}
            </dd>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Archivo Original</dt>
            <dd className="mt-1 truncate font-mono text-xs text-slate-700 font-medium" title={obra.nombreOriginal || obra.archivo}>
              {obra.nombreOriginal || obra.archivo || "—"}
            </dd>
          </div>
          {obra.descripcion && (
            <div className="sm:col-span-2 rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Descripción</dt>
              <dd className="mt-1 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">{obra.descripcion}</dd>
            </div>
          )}
        </dl>

        {/* Acciones del Modal: ISO 9241-171 área mínima 44px */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onCerrar}
            className="w-full sm:w-auto min-h-[44px] rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleDescargar}
            disabled={descargando}
            className="w-full sm:w-auto inline-flex min-h-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-[#600250] to-[#7a0366] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-[#520244] hover:to-[#600250] focus:outline-none focus:ring-2 focus:ring-[#600250] focus:ring-offset-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {descargando ? "Generando documento..." : "📜 Descargar Certificado (PDF)"}
          </button>
        </div>
      </div>
    </div>
  );
}
