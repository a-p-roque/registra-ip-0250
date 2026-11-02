import { jsPDF } from "jspdf";
import QRCode from "qrcode";

/**
 * Genera el documento PDF tipo diploma con jsPDF y código QR.
 * Aplica principios de jerarquía tipográfica, márgenes y alineación.
 * Descarga automáticamente con nombre doc.save("certificado-<folio>.pdf").
 *
 * @param {Object} obra - Metadatos de la obra registrada
 * @param {boolean} [descargar=true] - Si se debe invocar doc.save automáticamente
 * @returns {Promise<jsPDF>}
 */
export async function generarCertificado(obra, descargar = true) {
  if (!obra || !obra.folio) {
    throw new Error("Datos de obra inválidos para generar certificado");
  }

  // 1. Generar código QR a partir del folio de la obra
  let qrDataUrl = "";
  try {
    qrDataUrl = await QRCode.toDataURL(obra.folio, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 256,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.error("Error generando código QR:", err);
  }

  // 2. Crear documento PDF apaisado (A4 horizontal: 297mm x 210mm)
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Fondo sutil / textura de pergamino limpio (apto B/N)
  doc.setFillColor(254, 254, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Marco exterior ornamental
  doc.setLineWidth(1.6);
  doc.setDrawColor(30, 41, 59); // Slate 800
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Marco interior delgado
  doc.setLineWidth(0.4);
  doc.setDrawColor(100, 116, 139); // Slate 500
  doc.rect(13, 13, pageWidth - 26, pageHeight - 26);

  // Esquinas ornamentales en el marco interior
  const cornerSize = 4;
  // Superior Izquierda
  doc.line(13, 13 + cornerSize, 13 + cornerSize, 13);
  // Superior Derecha
  doc.line(pageWidth - 13, 13 + cornerSize, pageWidth - 13 - cornerSize, 13);
  // Inferior Izquierda
  doc.line(13, pageHeight - 13 - cornerSize, 13 + cornerSize, pageHeight - 13);
  // Inferior Derecha
  doc.line(pageWidth - 13, pageHeight - 13 - cornerSize, pageWidth - 13 - cornerSize, pageHeight - 13);

  // Encabezado institucional / Sistema
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text("SISTEMA DE REGISTRO DE PROPIEDAD INTELECTUAL — REGISTRA-IP", pageWidth / 2, 24, {
    align: "center",
  });

  // Título principal (Jerarquía Nivel 1)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42); // Gris carbón / negro
  doc.text("Certificado de Registro de Autoría", pageWidth / 2, 38, {
    align: "center",
  });

  // Línea divisoria decorativa central
  doc.setLineWidth(0.8);
  doc.setDrawColor(30, 41, 59);
  doc.line(pageWidth / 2 - 55, 43, pageWidth / 2 + 55, 43);

  // Subtítulo de certificación (Jerarquía Nivel 2)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.text("Por medio del presente documento oficial, se hace constar que la obra titulada:", pageWidth / 2, 54, {
    align: "center",
  });

  // Título de la obra (Jerarquía Nivel 1 - destacada)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 138); // Tono institucional que contrasta claramente en B/N
  const tituloObra = `"${obra.titulo || "Sin Título"}"`;
  doc.text(tituloObra, pageWidth / 2, 66, {
    align: "center",
  });

  // Categoría
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text(`Categoría: ${obra.categoria || "General"}`, pageWidth / 2, 74, {
    align: "center",
  });

  // Texto de autoría
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.text("Ha sido debidamente registrada ante el catálogo a nombre de:", pageWidth / 2, 87, {
    align: "center",
  });

  // Nombre del autor (Jerarquía Nivel 1)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text(obra.autor || "Autor no especificado", pageWidth / 2, 97, {
    align: "center",
  });

  // -------------------------------------------------------------
  // Sección Inferior: Metadatos (Izquierda), QR (Centro) y Firma (Derecha)
  // -------------------------------------------------------------
  const yMeta = 120;

  // Izquierda: Fechas, Folio y Personalización
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);

  const fechaFormateada = obra.fechaRegistro
    ? new Date(obra.fechaRegistro).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("es-MX");

  doc.text(`Fecha de emisión: ${fechaFormateada}`, 26, yMeta);

  // Personalización obligatoria: "Registrado por: [autor]"
  const registradoPor = obra.autor ? obra.autor : "Usuario registrado";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Registrado por: ${registradoPor}`, 26, yMeta + 8);

  // Folio de la obra
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("FOLIO OFICIAL ÚNICO:", 26, yMeta + 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(obra.folio, 26, yMeta + 25);

  // Centro: Código QR escaneable generado a partir del folio
  if (qrDataUrl) {
    const qrSize = 35;
    const qrX = pageWidth / 2 - qrSize / 2;
    const qrY = yMeta - 5;

    // Caja de contorno para el QR
    doc.setLineWidth(0.3);
    doc.setDrawColor(203, 213, 225);
    doc.rect(qrX - 1.5, qrY - 1.5, qrSize + 3, qrSize + 3);

    doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Escanea para validar folio", pageWidth / 2, qrY + qrSize + 4, {
      align: "center",
    });
  }

  // Derecha: Firma y Sello Digital
  const firmaX = pageWidth - 70;
  doc.setLineWidth(0.4);
  doc.setDrawColor(71, 85, 105);
  doc.line(firmaX - 25, yMeta + 20, firmaX + 25, yMeta + 20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text("Dirección de Registro", firmaX, yMeta + 25, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Sello Digital de Validación", firmaX, yMeta + 29, {
    align: "center",
  });

  // Pie de página de validez
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Este certificado cuenta con validez digital dentro del sistema Registra-IP. Su autenticidad puede verificarse mediante el folio y código QR.",
    pageWidth / 2,
    pageHeight - 16,
    { align: "center" }
  );

  // Descarga del documento si está activada
  if (descargar) {
    doc.save(`certificado-${obra.folio}.pdf`);
  }

  return doc;
}
