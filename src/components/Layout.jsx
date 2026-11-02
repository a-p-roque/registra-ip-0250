import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="bg-fondo text-texto flex min-h-screen flex-col">
      <header className="bg-primario px-4 py-4 text-white sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="text-xl font-bold tracking-wide">
            REGISTRA-IP
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/" className="hover:underline">
              Registro
            </Link>
            <Link to="/galeria" className="hover:underline">
              Galería
            </Link>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
