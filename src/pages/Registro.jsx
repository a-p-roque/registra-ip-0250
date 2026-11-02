import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const TIPOS_CREADOR = ["Diseñador", "Fotógrafo", "Escritor", "Cineasta"];

// Formato básico de correo: texto@texto.dominio (sin espacios)
const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const estadoInicial = { nombre: "", correo: "", tipo: "" };

function Registro() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState(estadoInicial);
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: undefined }));
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!datos.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    if (!datos.correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio.";
    } else if (!REGEX_CORREO.test(datos.correo.trim())) {
      nuevosErrores.correo =
        "Escribe un correo válido, por ejemplo nombre@dominio.com.";
    }

    if (!datos.tipo) {
      nuevosErrores.tipo = "Selecciona un tipo de creador.";
    }

    return nuevosErrores;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    const usuario = {
      nombre: datos.nombre.trim(),
      correo: datos.correo.trim(),
      tipo: datos.tipo,
    };
    localStorage.setItem("registraIpUsuario", JSON.stringify(usuario));
    navigate("/dashboard");
  };

  const hayErrores = Object.values(errores).some(Boolean);

  return (
    <section className="mx-auto max-w-lg pt-4 pb-12">
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm transition-all sm:p-10">
        <div className="mb-8 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#600250] ring-1 ring-[#600250]/15">
            Paso 1 de acreditación
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Registro de Creador
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Ingresa tus datos para gestionar y certificar tus obras en el sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nombre" className="text-sm font-semibold text-slate-700">
              Nombre completo
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Ej. Antonio Roque"
              value={datos.nombre}
              onChange={handleChange}
              aria-invalid={Boolean(errores.nombre)}
              aria-describedby={errores.nombre ? "error-nombre" : undefined}
              className={`min-h-[44px] w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                errores.nombre
                  ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-200"
                  : "border-slate-300 hover:border-slate-400 focus:border-[#600250] focus:ring-[#600250]/20"
              }`}
            />
            {errores.nombre && (
              <p id="error-nombre" className="text-xs font-medium text-red-600">
                {errores.nombre}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="correo" className="text-sm font-semibold text-slate-700">
              Correo electrónico
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              placeholder="nombre@ejemplo.com"
              value={datos.correo}
              onChange={handleChange}
              aria-invalid={Boolean(errores.correo)}
              aria-describedby={errores.correo ? "error-correo" : undefined}
              className={`min-h-[44px] w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                errores.correo
                  ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-200"
                  : "border-slate-300 hover:border-slate-400 focus:border-[#600250] focus:ring-[#600250]/20"
              }`}
            />
            {errores.correo && (
              <p id="error-correo" className="text-xs font-medium text-red-600">
                {errores.correo}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="tipo" className="text-sm font-semibold text-slate-700">
              Tipo de creador
            </label>
            <select
              id="tipo"
              name="tipo"
              value={datos.tipo}
              onChange={handleChange}
              aria-invalid={Boolean(errores.tipo)}
              aria-describedby={errores.tipo ? "error-tipo" : undefined}
              className={`min-h-[44px] w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 ${
                errores.tipo
                  ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-200"
                  : "border-slate-300 hover:border-slate-400 focus:border-[#600250] focus:ring-[#600250]/20"
              }`}
            >
              <option value="">Selecciona tu disciplina artística</option>
              {TIPOS_CREADOR.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            {errores.tipo && (
              <p id="error-tipo" className="text-xs font-medium text-red-600">
                {errores.tipo}
              </p>
            )}
          </div>

          {/* Feedback accesible */}
          <div aria-live="polite" className="min-h-5">
            {hayErrores && (
              <p className="rounded-lg bg-red-50 p-2.5 text-xs font-medium text-red-700 border border-red-200/80">
                Por favor corrige los campos marcados antes de continuar.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#600250] to-[#7a0366] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:from-[#520244] hover:to-[#600250] focus:outline-none focus:ring-2 focus:ring-[#600250] focus:ring-offset-2 transition-all active:scale-[0.99] cursor-pointer"
          >
            Registrarme y acceder
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            ¿Ya tienes obras registradas?{" "}
            <Link to="/galeria" className="font-semibold text-[#600250] hover:underline">
              Explora la Galería Pública
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Registro;
