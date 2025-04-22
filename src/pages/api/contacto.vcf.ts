import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url }) => {
  const nombre = url.searchParams.get("nombre") || "Contacto";
  const apellido = url.searchParams.get("apellido") || "";
  const correo = url.searchParams.get("correo") || "";
  const celular = url.searchParams.get("celular") || "";
  const puesto = url.searchParams.get("puesto") || "";

  const vcard = `BEGIN:VCARD
VERSION:3.0
N:${apellido};${nombre}
FN:${nombre} ${apellido}
TITLE:${puesto}
TEL;TYPE=CELL:${celular}
EMAIL:${correo}
END:VCARD
`;

  return new Response(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": "inline; filename=contacto.vcf"
    }
  });
};
