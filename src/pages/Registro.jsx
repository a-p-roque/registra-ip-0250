import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    // Limpia el error del campo al corregirlo
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
        "Escribe un correo con formato válido, por ejemplo nombre@dominio.com.";
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
    <section className="mx-auto max-w-md">
      <h2 className="mb-6 text-2xl font-semibold">Registro de creador</h2>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label htmlFor="nombre" className="font-medium">
            Nombre completo
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={datos.nombre}
            onChange={handleChange}
            aria-invalid={Boolean(errores.nombre)}
            aria-describedby={errores.nombre ? "error-nombre" : undefined}
            className="focus:outline-primario min-h-11 rounded border border-gray-400 px-3 py-2 focus:outline-2"
          />
          {errores.nombre && (
            <p id="error-nombre" className="text-error text-sm">
              {errores.nombre}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="correo" className="font-medium">
            Correo electrónico
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            value={datos.correo}
            onChange={handleChange}
            aria-invalid={Boolean(errores.correo)}
            aria-describedby={errores.correo ? "error-correo" : undefined}
            className="focus:outline-primario min-h-11 rounded border border-gray-400 px-3 py-2 focus:outline-2"
          />
          {errores.correo && (
            <p id="error-correo" className="text-error text-sm">
              {errores.correo}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="tipo" className="font-medium">
            Tipo de creador
          </label>
          <select
            id="tipo"
            name="tipo"
            value={datos.tipo}
            onChange={handleChange}
            aria-invalid={Boolean(errores.tipo)}
            aria-describedby={errores.tipo ? "error-tipo" : undefined}
            className="focus:outline-primario min-h-11 rounded border border-gray-400 bg-white px-3 py-2 focus:outline-2"
          >
            <option value="">Selecciona una opción</option>
            {TIPOS_CREADOR.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {errores.tipo && (
            <p id="error-tipo" className="text-error text-sm">
              {errores.tipo}
            </p>
          )}
        </div>

        {/* Contenedor de errores accesible: los lectores de pantalla anuncian los cambios */}
        <div aria-live="polite" className="min-h-6">
          {hayErrores && (
            <p className="text-error text-sm font-medium">
              Revisa los campos marcados antes de continuar.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-primario min-h-11 rounded px-4 py-3 font-semibold text-white hover:opacity-90"
        >
          Registrarme
        </button>
      </form>
    </section>
  );
}

export default Registro;
