import { useNavigate } from "react-router-dom";

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
    <section className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold">Hola, {usuario?.nombre}</h2>
        <p className="text-sm text-gray-600">
          Tipo de creador: {usuario?.tipo}
        </p>
      </div>

      <button
        type="button"
        onClick={cerrarSesion}
        className="border-primario text-primario hover:bg-primario min-h-11 self-start rounded border px-4 py-3 font-semibold hover:text-white"
      >
        Cerrar sesión
      </button>
    </section>
  );
}

export default Dashboard;
