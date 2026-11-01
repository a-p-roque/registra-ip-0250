import { Navigate } from "react-router-dom";

// Protege una ruta: si no hay sesión guardada, redirige al registro
function RutaProtegida({ children }) {
  const sesion = localStorage.getItem("registraIpUsuario");

  if (!sesion) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RutaProtegida;
