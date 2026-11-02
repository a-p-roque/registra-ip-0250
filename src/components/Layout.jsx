import { Link, NavLink, Outlet } from "react-router-dom";

function Layout() {
  const getNavClass = ({ isActive }) =>
    `min-h-[44px] flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-white/20 text-white shadow-xs backdrop-blur-xs font-semibold"
        : "text-purple-100 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased selection:bg-purple-900 selection:text-white">
      {/* Barra superior con gradiente guinda institucional y elevación refinada */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#600250] via-[#520244] to-[#3e0133] shadow-md border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            to="/galeria"
            className="flex items-center gap-2.5 text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white shadow-inner font-bold text-lg ring-1 ring-white/20">
              IP
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-tight">
                REGISTRA-IP
              </span>
              <span className="text-[10px] text-purple-200 uppercase tracking-widest block font-medium">
                Propiedad Intelectual
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink to="/galeria" className={getNavClass}>
              Galería
            </NavLink>
            <NavLink to="/registrar-obra" className={getNavClass}>
              Nueva Obra
            </NavLink>
            <NavLink to="/dashboard" className={getNavClass}>
              Dashboard
            </NavLink>
            <NavLink to="/" className={getNavClass}>
              Registro
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Contenido principal centrado con animación suave */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>

      {/* Footer minimalista */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} REGISTRA-IP • Sistema Oficial de Registro de Autoría</p>
          <p className="text-[11px] text-slate-400">Diseño de Interfaces de Usuario • UPIICSA</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
