// Elementos repetidos entre páginas.
import { COR, Box, Img } from "../layout";
import { Svg } from "../Svg";

/** Moldura terracota (traço 1,5 pt centrado no caminho; cantos r = 27,7 pt). */
export function Frame({
  x,
  y,
  w,
  h,
  r = 27.7,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
}) {
  const sw = 1.5;
  return (
    <Box
      x={x - sw / 2}
      y={y - sw / 2}
      w={w + sw}
      h={h + sw}
      stroke={COR.terra}
      strokeW={sw}
      r={r}
    />
  );
}

/** Logo terracota do topo direito (páginas 3 e 5) — posição medida no PDF. */
export function Logo({ x = 418, y = 60 }: { x?: number; y?: number }) {
  return (
    <>
      <Svg name="logo-wordmark" x={x} y={y} w={122} h={62} color={COR.terra} />
      {/* o ® do original é branco sobre branco (invisível) — mantido igual */}
      <Img src="/doc/img/reg-mark.png" x={x + 107} y={y + 2.9} w={10.5} h={15} />
    </>
  );
}
