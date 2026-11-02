// Boceto y estructura base del generador de certificados
// Define los metadatos requeridos y la firma de la función según Práctica 4

/**
 * Parámetros que componen el certificado de registro:
 * - folio: string con formato OBRA-0250-###
 * - titulo: string
 * - autor: string (nombre del autor de la obra)
 * - categoria: string
 * - fechaRegistro: string ISO o legible
 * - registradoPor: string (usuario que realiza el registro)
 */

export async function generarCertificado(obra) {
  if (!obra || !obra.folio) {
    throw new Error("Datos de obra inválidos para generar certificado");
  }

  // Estructura preliminar que se completará con jsPDF y QRCode
  return {
    titulo: obra.titulo || "Sin título",
    autor: obra.autor || "Anónimo",
    folio: obra.folio,
    categoria: obra.categoria || "General",
    fecha: obra.fechaRegistro ? new Date(obra.fechaRegistro).toLocaleDateString() : new Date().toLocaleDateString(),
    registradoPor: obra.autor || "Autor registrado",
  };
}
