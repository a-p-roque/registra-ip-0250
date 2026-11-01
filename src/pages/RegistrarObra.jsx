import { useState } from "react";

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

  const actualizar = (campos) => setDatos((prev) => ({ ...prev, ...campos }));
  const siguiente = () => setPaso((p) => Math.min(p + 1, PASOS.length - 1));
  const atras = () => setPaso((p) => Math.max(p - 1, 0));
  const puedeAvanzar = pasoEsValido(paso, datos);

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Registrar obra</h1>

      <BarraProgreso pasoActual={paso} />

      <div className="my-6 rounded-lg bg-white p-6 shadow">
        {paso === 0 && <PasoArchivo datos={datos} actualizar={actualizar} />}
        {paso === 1 && <PasoMetadatos datos={datos} actualizar={actualizar} />}
        {paso === 2 && <PasoVistaPrevia datos={datos} />}
        {paso === 3 && <PasoConfirmacion />}
      </div>

      <div className="flex justify-between">
        <button
          onClick={atras}
          disabled={paso === 0}
          className="rounded bg-gray-200 px-4 py-2 disabled:opacity-40"
        >
          Atrás
        </button>
        {paso < PASOS.length - 1 && (
          <button
            onClick={siguiente}
            disabled={!puedeAvanzar}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
}

function BarraProgreso({ pasoActual }) {
  return (
    <div className="flex items-center justify-between">
      {PASOS.map((nombre, i) => (
        <div key={nombre} className="flex flex-1 flex-col items-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
              i <= pasoActual
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {i + 1}
          </div>
          <span className="mt-1 text-xs text-gray-600">{nombre}</span>
        </div>
      ))}
    </div>
  );
}

function PasoArchivo({ datos, actualizar }) {
  return (
    <div>
      <label className="block text-sm font-medium">Archivo de la obra</label>
      <input
        type="file"
        onChange={(e) => actualizar({ archivo: e.target.files[0] ?? null })}
        className="mt-2"
      />
      {datos.archivo && (
        <p className="mt-2 text-sm text-gray-600">
          Seleccionado: {datos.archivo.name}
        </p>
      )}
    </div>
  );
}

function PasoMetadatos({ datos, actualizar }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Título</label>
        <input
          value={datos.titulo}
          onChange={(e) => actualizar({ titulo: e.target.value })}
          className="mt-1 w-full rounded border p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Categoría</label>
        <select
          value={datos.categoria}
          onChange={(e) => actualizar({ categoria: e.target.value })}
          className="mt-1 w-full rounded border p-2"
        >
          <option value="">Selecciona una</option>
          <option>Diseño</option>
          <option>Fotografía</option>
          <option>Escritura</option>
          <option>Cine</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          value={datos.descripcion}
          onChange={(e) => actualizar({ descripcion: e.target.value })}
          className="mt-1 w-full rounded border p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Autor</label>
        <input
          value={datos.autor}
          onChange={(e) => actualizar({ autor: e.target.value })}
          className="mt-1 w-full rounded border p-2"
        />
      </div>
      {datos.titulo.trim().length > 0 && datos.titulo.trim().length < 5 && (
        <p role="alert" className="text-sm text-red-600">
          El título debe tener al menos 5 caracteres.
        </p>
      )}
    </div>
  );
}

function PasoVistaPrevia({ datos }) {
  return (
    <dl className="space-y-2 text-sm">
      <div>
        <dt className="font-semibold">Archivo</dt>
        <dd>{datos.archivo?.name ?? "—"}</dd>
      </div>
      <div>
        <dt className="font-semibold">Título</dt>
        <dd>{datos.titulo || "—"}</dd>
      </div>
      <div>
        <dt className="font-semibold">Categoría</dt>
        <dd>{datos.categoria || "—"}</dd>
      </div>
      <div>
        <dt className="font-semibold">Descripción</dt>
        <dd>{datos.descripcion || "—"}</dd>
      </div>
      <div>
        <dt className="font-semibold">Autor</dt>
        <dd>{datos.autor || "—"}</dd>
      </div>
    </dl>
  );
}

function PasoConfirmacion() {
  return (
    <p>Pendiente: aquí mostraremos el folio al conectar con el backend.</p>
  );
}
