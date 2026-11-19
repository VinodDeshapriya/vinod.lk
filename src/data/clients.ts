/**
 * Only logos with a `src` are shown. The rest are clipped off-canvas in the
 * Figma frame, so they could not be exported yet.
 *
 * Client logos for the "Trusted by" marquee (hero). `src` is filled in once the logo files are exported from Figma into /public/images/clients. */
export interface ClientLogo {
  name: string;
  nodeId: string;
  width: number;
  height?: number;
  src?: string;
}

export const clientLogos: ClientLogo[] = [
  { name: "Absoliq", nodeId: "19252:43161", width: 152, height: 30, src: "/images/clients/absoliq.png" },
  { name: "Enjoy Sri Lanka", nodeId: "19252:43163", width: 155, height: 40, src: "/images/clients/enjoy-sri-lanka.png" },
  { name: "Matara Bodhiya", nodeId: "19252:43227", width: 173, height: 40, src: "/images/clients/matara-bodhiya.png" },
  { name: "Janangana", nodeId: "19252:43229", width: 211, height: 40, src: "/images/clients/janangana.png" },
  { name: "Sun2Earth", nodeId: "19252:43231", width: 152, height: 40, src: "/images/clients/sun2earth.png" },
  { name: "Ceylon Track", nodeId: "19252:43249", width: 36, height: 48, src: "/images/clients/ceylon-track.png" },
  { name: "Somerset Blue", nodeId: "19252:43267", width: 100, height: 38, src: "/images/clients/somerset-blue.png" },
  { name: "Maitri Bodhi", nodeId: "19252:43288", width: 166 },
  { name: "Saltera", nodeId: "19252:43292", width: 92 },
  { name: "Somerset Beach", nodeId: "19252:43301", width: 107 },
  { name: "Devendra", nodeId: "19252:43322", width: 124 },
  { name: "Style Avenue", nodeId: "19252:43368", width: 115 },
  { name: "Gatsby", nodeId: "19252:43370", width: 48 },
  { name: "Somerset Eco", nodeId: "19252:43602", width: 107 },
  { name: "Ceylon Track Tours", nodeId: "19252:43623", width: 179 },
  { name: "Blue Lotus", nodeId: "19252:43682", width: 155 },
];
