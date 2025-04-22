import type { APIRoute } from "astro";
import { Buffer } from "buffer";

export const GET: APIRoute = async ({ url }) => {
  const nombre = url.searchParams.get("nombre") || "Contacto";
  const apellido = url.searchParams.get("apellido") || "";
  const correo = url.searchParams.get("correo") || "";
  const celular = url.searchParams.get("celular") || "";
  const puesto = url.searchParams.get("puesto") || "";
  const imagenUrl = url.searchParams.get("imagen") || "";

  let photoBase64 = "";

  if (imagenUrl) {
    try {
      const res = await fetch(imagenUrl);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      photoBase64 = buffer.toString("base64");
    } catch (err) {
      console.error("Error al convertir la imagen:", err);
    }
  }

  const vcard = `BEGIN:VCARD
VERSION:3.0
N:${apellido};${nombre}
FN:${nombre} ${apellido}
TITLE:${puesto}
TEL;TYPE=CELL:${celular}
EMAIL:${correo}
${photoBase64 ? `PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}` : ""}
END:VCARD
`;

  return new Response(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": "inline; filename=contacto.vcf"
    }
  });
};
