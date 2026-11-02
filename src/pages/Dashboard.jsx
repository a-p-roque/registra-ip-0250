import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const usuario = JSON.parse(
    localStorage.getItem("registraIpUsuario") || "null",
  );

  const cerrarSesion = () => {
    localStorage.removeItem("registraIpUsuario");
    navigate("/", { replace: true });
  };

  return (
    <section className="mx-auto max-w-4xl space-y-8">
      {/* Banner de bienvenida con estilo institucional moderno */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#600250] via-[#520244] to-[#420137] p-8 text-white shadow-md sm:p-10">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-purple-200">
              Panel de Creador
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Hola, {usuario?.nombre || "Creador"}
            </h1>
            <p className="text-sm text-purple-100 max-w-md">
              Acreditado como <span className="font-semibold text-white">{usuario?.tipo || "General"}</span> en Registra-IP.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/registrar-obra"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#600250] shadow-sm hover:bg-purple-50 transition-all active:scale-[0.98]"
            >
              + Registrar Nueva Obra
            </Link>
            <button
              type="button"
              onClick={cerrarSesion}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-all"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Círculo decorativo en background */}
        <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* Tarjetas de accesos directos / estadísticas */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-xl text-[#600250]">
              🎨
            </div>
            <h2 className="mt-4 font-bold text-slate-900">Registrar Obra</h2>
            <p className="mt-1 text-xs text-slate-500">
              Inicia el asistente paso a paso para dar de alta un nuevo archivo.
            </p>
          </div>
          <Link
            to="/registrar-obra"
            className="mt-5 inline-flex text-xs font-semibold text-[#600250] hover:underline"
          >
            Ir al wizard →
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
              🖼️
            </div>
            <h2 className="mt-4 font-bold text-slate-900">Galería de Obras</h2>
            <p className="mt-1 text-xs text-slate-500">
              Consulta, filtra y descarga los certificados oficiales con QR.
            </p>
          </div>
          <Link
            to="/galeria"
            className="mt-5 inline-flex text-xs font-semibold text-blue-700 hover:underline"
          >
            Ver catálogo completo →
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-700">
              📜
            </div>
            <h2 className="mt-4 font-bold text-slate-900">Certificación Oficial</h2>
            <p className="mt-1 text-xs text-slate-500">
              Tus obras obtienen folios oficiales y diplomas descargables con sello digital.
            </p>
          </div>
          <span className="mt-5 inline-flex text-xs font-semibold text-emerald-700">
            Validez digital activa
          </span>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
