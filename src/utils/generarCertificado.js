import { jsPDF } from "jspdf";

/**
 * Genera el documento PDF tipo diploma con jsPDF.
 * Aplica principios de jerarquía tipográfica, márgenes y alineación.
 */
export async function generarCertificado(obra) {
  if (!obra || !obra.folio) {
    throw new Error("Datos de obra inválidos para generar certificado");
  }

  // Orientación horizontal (landscape), formato A4
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Marco exterior ornamental (apto para impresión en blanco y negro)
  doc.setLineWidth(1.5);
  doc.setDrawColor(30, 41, 59); // Slate oscuro / negro
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Marco interior delgado
  doc.setLineWidth(0.5);
  doc.setDrawColor(100, 116, 139);
  doc.rect(13, 13, pageWidth - 26, pageHeight - 26);

  // Encabezado institucional / Sistema
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text("SISTEMA DE REGISTRO DE PROPIEDAD INTELECTUAL — REGISTRA-IP", pageWidth / 2, 24, {
    align: "center",
  });

  // Título grande (Jerarquía Nivel 1)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42);
  doc.text("Certificado de Registro de Autoría", pageWidth / 2, 38, {
    align: "center",
  });

  // Línea divisoria sutil
  doc.setLineWidth(0.8);
  doc.setDrawColor(30, 41, 59);
  doc.line(pageWidth / 2 - 60, 43, pageWidth / 2 + 60, 43);

  // Subtítulo de certificación (Jerarquía Nivel 2)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.text("Por medio del presente documento oficial, se hace constar que la obra titulada:", pageWidth / 2, 55, {
    align: "center",
  });

  // Título de la Obra (Jerarquía Nivel 1 - destacada)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 138); // Azul institucional o tinta oscura
  const tituloObra = `"${obra.titulo || "Sin Título"}"`;
  doc.text(tituloObra, pageWidth / 2, 67, {
    align: "center",
  });

  // Categoría
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text(`Categoría: ${obra.categoria || "General"}`, pageWidth / 2, 75, {
    align: "center",
  });

  // Autor
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.text("Ha sido debidamente inscrita a nombre de:", pageWidth / 2, 88, {
    align: "center",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text(obra.autor || "Autor no especificado", pageWidth / 2, 98, {
    align: "center",
  });

  // Bloque inferior de Metadatos
  const yMeta = 118;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);

  const fechaFormateada = obra.fechaRegistro
    ? new Date(obra.fechaRegistro).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("es-MX");

  doc.text(`Fecha de registro: ${fechaFormateada}`, 30, yMeta);

  // Leyenda personalizada de registrado por
  const registradoPor = obra.autor ? obra.autor : "Usuario registrado";
  doc.setFont("helvetica", "bold");
  doc.text(`Registrado por: ${registradoPor}`, 30, yMeta + 8);

  // Folio destacado
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Folio de Registro Oficial:", 30, yMeta + 18);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(obra.folio, 30, yMeta + 26);

  // Firmas institucionales
  doc.setLineWidth(0.4);
  doc.setDrawColor(100, 116, 139);
  doc.line(pageWidth - 95, yMeta + 20, pageWidth - 30, yMeta + 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("Sello Digital y Firma de Validación", pageWidth - 62.5, yMeta + 25, {
    align: "center",
  });

  // Pie de página con aviso de validez
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Este certificado cuenta con validez digital dentro del sistema Registra-IP. La autenticidad puede verificarse mediante el folio y código QR.",
    pageWidth / 2,
    pageHeight - 16,
    { align: "center" }
  );

  return doc;
}
