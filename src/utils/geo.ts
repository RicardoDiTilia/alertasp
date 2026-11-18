type Coord = { lat: number; lng: number };

const RAIO_TERRA_M = 6_371_000;

function paraMetros(p: Coord, ref: Coord) {
  const rad = Math.PI / 180;
  return {
    x: (p.lng - ref.lng) * rad * RAIO_TERRA_M * Math.cos(ref.lat * rad),
    y: (p.lat - ref.lat) * rad * RAIO_TERRA_M,
  };
}

export function projetarNoSegmento(ponto: Coord, origem: Coord, destino: Coord) {
  const p = paraMetros(ponto, origem);
  const b = paraMetros(destino, origem);
  const comprimento2 = b.x * b.x + b.y * b.y;
  const posicao =
    comprimento2 === 0 ? 0 : Math.max(0, Math.min(1, (p.x * b.x + p.y * b.y) / comprimento2));
  return { posicao, distanciaM: Math.hypot(p.x - posicao * b.x, p.y - posicao * b.y) };
}

export function distanciaAteSegmento(ponto: Coord, origem: Coord, destino: Coord): number {
  return projetarNoSegmento(ponto, origem, destino).distanciaM;
}
