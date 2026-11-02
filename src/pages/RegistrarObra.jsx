import { useState } from "react";
import { Link } from "react-router-dom";
import { generarCertificado } from "../utils/generarCertificado";

const PASOS = ["Subir archivo", "Metadatos", "Vista previa", "Confirmación"];

const estadoInicial = {
  archivo: null,
  titulo: "",
  categoria: "",
  descripcion: "",
  autor: "",
};

const pasoEsValido = (paso, datos) => {
  if (paso === 0) return datos.archivo !== null;
  if (paso === 1)
    return datos.titulo.trim().length >= 5 && datos.categoria !== "";
  return true;
};

export default function RegistrarObra() {
  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState(estadoInicial);
  const [folio, setFolio] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const actualizar = (campos) => setDatos((prev) => ({ ...prev, ...campos }));
  const siguiente = () => setPaso((p) => Math.min(p + 1, PASOS.length - 1));
  const atras = () => setPaso((p) => Math.max(p - 1, 0));

  const enviar = async () => {
    setEnviando(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("archivo", datos.archivo);
      formData.append("titulo", datos.titulo);
      formData.append("categoria", datos.categoria);
      formData.append("descripcion", datos.descripcion);
      formData.append("autor", datos.autor);

      const res = await fetch("http://localhost:4000/obras", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Error del servidor");

      const obra = await res.json();
      setFolio(obra.folio);
      setPaso(3);
    } catch {
      setError(
        "No se pudo registrar la obra. Revisa que el servidor esté corriendo en el puerto 4000.",
      );
    } finally {
      setEnviando(false);
    }
  };

  const puedeAvanzar = pasoEsValido(paso, datos);

  return (
    <div className="mx-auto max-w-2xl py-4 pb-12">
      <div className="mb-8 text-center sm:text-left">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#600250] ring-1 ring-[#600250]/15">
          Asistente de Inscripción
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Registrar Nueva Obra
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Completa los 4 pasos para formalizar el registro y emitir tu certificado digital.
        </p>
      </div>

      {/* Stepper / Barra de progreso estilizada */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <BarraProgreso pasoActual={paso} />
      </div>

      {/* Tarjeta del paso activo */}
      <div className="my-6 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs min-h-[320px] flex flex-col justify-between">
        <div>
          {paso === 0 && <PasoArchivo datos={datos} actualizar={actualizar} />}
          {paso === 1 && <PasoMetadatos datos={datos} actualizar={actualizar} />}
          {paso === 2 && <PasoVistaPrevia datos={datos} />}
          {paso === 3 && <PasoConfirmacion folio={folio} datos={datos} />}
        </div>

        {error && (
          <div role="alert" className="mt-6 rounded-xl bg-red-50 p-3.5 text-xs font-medium text-red-700 border border-red-200">
            {error}
          </div>
        )}
      </div>

      {/* Botones de navegación inferiores */}
      <div className="flex items-center justify-between gap-4">
        {paso < 3 ? (
          <button
            type="button"
            onClick={atras}
            disabled={paso === 0}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            ← Anterior
          </button>
        ) : (
          <Link
            to="/galeria"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          >
            ← Volver a la Galería
          </Link>
        )}

        {paso < 2 && (
          <button
            type="button"
            onClick={siguiente}
            disabled={!puedeAvanzar}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#600250] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#520244] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            Siguiente →
          </button>
        )}

        {paso === 2 && (
          <button
            type="button"
            onClick={enviar}
            disabled={enviando}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {enviando ? "Registrando obra..." : "✓ Confirmar y Finalizar"}
          </button>
        )}
      </div>
    </div>
  );
}

function BarraProgreso({ pasoActual }) {
  return (
    <div className="flex items-center justify-between relative">
      {PASOS.map((nombre, i) => {
        const estaCompletado = i < pasoActual;
        const estaActivo = i === pasoActual;

        return (
          <div key={nombre} className="flex flex-1 flex-col items-center relative z-10">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all duration-300 shadow-xs ${
                estaActivo
                  ? "bg-[#600250] text-white ring-4 ring-purple-100 scale-105"
                  : estaCompletado
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {estaCompletado ? "✓" : i + 1}
            </div>
            <span
              className={`mt-2 text-xs text-center transition-colors font-medium ${
                estaActivo ? "text-[#600250] font-bold" : "text-slate-500"
              }`}
            >
              {nombre}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function PasoArchivo({ datos, actualizar }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-900">1. Selecciona el archivo de la obra</h2>
      <p className="text-xs text-slate-500">
        Formatos permitidos: imágenes (JPG, PNG), documentos (PDF, DOCX) o material audiovisual.
      </p>

      <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-8 text-center hover:bg-slate-50 hover:border-[#600250]/40 transition-colors">
        <span className="text-4xl mb-2">📁</span>
        <label className="cursor-pointer font-semibold text-[#600250] hover:underline">
          <span>Haz clic para examinar tus archivos</span>
          <input
            type="file"
            onChange={(e) => actualizar({ archivo: e.target.files[0] ?? null })}
            className="sr-only"
          />
        </label>
        <p className="text-xs text-slate-400 mt-1">Cualquier tamaño soportado</p>

        {datos.archivo && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-medium text-slate-800 shadow-xs border border-slate-200">
            <span className="text-emerald-600 font-bold">✓ Archivo cargado:</span>
            <span className="font-mono">{datos.archivo.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function PasoMetadatos({ datos, actualizar }) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-slate-900">2. Información y Metadatos</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Título de la Obra *
          </label>
          <input
            type="text"
            placeholder="Mínimo 5 caracteres"
            value={datos.titulo}
            onChange={(e) => actualizar({ titulo: e.target.value })}
            className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#600250] focus:ring-2 focus:ring-[#600250]/20 focus:outline-none"
          />
          {datos.titulo.trim().length > 0 && datos.titulo.trim().length < 5 && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              El título debe contener al menos 5 caracteres.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Categoría *
            </label>
            <select
              value={datos.categoria}
              onChange={(e) => actualizar({ categoria: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-[#600250] focus:ring-2 focus:ring-[#600250]/20 focus:outline-none"
            >
              <option value="">Selecciona disciplina</option>
              <option>Diseño</option>
              <option>Fotografía</option>
              <option>Escritura</option>
              <option>Cine</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Nombre del Autor
            </label>
            <input
              type="text"
              placeholder="Nombre del creador"
              value={datos.autor}
              onChange={(e) => actualizar({ autor: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#600250] focus:ring-2 focus:ring-[#600250]/20 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Descripción o Justificación de la Obra
          </label>
          <textarea
            rows={3}
            placeholder="Breve sinopsis, técnica o contexto..."
            value={datos.descripcion}
            onChange={(e) => actualizar({ descripcion: e.target.value })}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#600250] focus:ring-2 focus:ring-[#600250]/20 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function PasoVistaPrevia({ datos }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-900">3. Confirma los datos de inscripción</h2>
      <p className="text-xs text-slate-500">
        Verifica que los datos sean correctos antes de emitir el folio digital inmutable.
      </p>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
          <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Archivo</dt>
          <dd className="mt-1 font-mono text-sm font-semibold text-slate-800 truncate">
            {datos.archivo?.name ?? "—"}
          </dd>
        </div>
        <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
          <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Categoría</dt>
          <dd className="mt-1 text-sm font-semibold text-[#600250]">
            {datos.categoria || "—"}
          </dd>
        </div>
        <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
          <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Título</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">
            {datos.titulo || "—"}
          </dd>
        </div>
        <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
          <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Autor</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">
            {datos.autor || "—"}
          </dd>
        </div>
        {datos.descripcion && (
          <div className="sm:col-span-2 rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Descripción</dt>
            <dd className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{datos.descripcion}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}

function PasoConfirmacion({ folio, datos }) {
  const [descargando, setDescargando] = useState(false);

  const handleDescargar = async () => {
    try {
      setDescargando(true);
      await generarCertificado({
        folio,
        titulo: datos.titulo,
        autor: datos.autor,
        categoria: datos.categoria,
        fechaRegistro: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error al descargar certificado:", err);
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="space-y-6 text-center py-4">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl text-emerald-600 ring-8 ring-emerald-50">
        ✓
      </div>

      <div>
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
          Inscripción Exitosa
        </span>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
          Obra Registrada en el Sistema
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Se ha asignado el siguiente folio inmutable con validez de propiedad intelectual:
        </p>
        <p className="mt-4 font-mono text-3xl font-black tracking-wider text-[#600250]">
          {folio}
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleDescargar}
          disabled={descargando}
          className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center rounded-xl bg-gradient-to-r from-[#600250] to-[#7a0366] px-6 py-3 font-semibold text-white shadow-md hover:from-[#520244] hover:to-[#600250] focus:outline-none focus:ring-2 focus:ring-[#600250] focus:ring-offset-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer text-sm"
        >
          {descargando ? "Generando documento..." : "📜 Descargar Certificado Oficial (PDF)"}
        </button>
      </div>
    </div>
  );
}
