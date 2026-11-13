import { E, useDoc } from "../context";
import { COR, Img, Page, Txt } from "../layout";
import { Svg } from "../Svg";

export function tipoEvento(evento: string, eventoOutro: string): string {
  return (evento === "Outras festas" ? eventoOutro : evento).trim();
}

/** Foto da capa por tipo de evento. */
export function fotoCapa(evento: string): string {
  if (evento === "Casamento") return "/doc/img/capa-casal.jpg";
  if (evento === "XV anos") return "/doc/img/capa-xv-anos.jpg";
  return "/doc/img/capa-bartender.jpg";
}

export function P1Capa() {
  const { p } = useDoc();
  const evento = tipoEvento(p.evento, p.eventoOutro).toUpperCase();
  const xv = p.evento === "XV anos";
  // XV anos: bloco de texto deslocado para a direita/baixo e logo no canto inferior esquerdo
  // (medido no PDF "GEORGIA GOMES" em relação ao modelo padrão)
  const dx = xv ? 83.6 : 0;
  const dy = xv ? 198.3 : 0;
  const dyData = xv ? 181.8 : 0;
  // escala do logo em relação à extração (página 3): 179.8 / 103.2; no XV anos é 71,46 % disso
  const k = xv ? 0.7146 : 1;
  const s = 1.7422 * k;
  const lx = xv ? 14.7 : 196.4; // origem da barra gradiente
  const ly = xv ? 757.4 : 637.5;
  return (
    <Page n={1} className="doc-p1">
      <Img src={fotoCapa(p.evento)} x={0} y={0} w={595.5} h={842.25} fit="cover" />
      {/* Tipo de evento — Julius Sans One 40,47 pt, centralizado */}
      <Txt
        x={dx}
        w={595.5}
        align="center"
        y={394.07 + dy}
        size={40.47}
        font="julius"
        color={COR.branco}
        tracking={0.44}
      >
        <E k="capa.evento" def={evento} normalize={(t) => t.toUpperCase()} />
      </Txt>
      {/* Nome — Neue Montreal Regular 27,75 pt (substituta: Questrial) */}
      <Txt
        x={dx}
        w={595.5}
        align="center"
        y={431.88 + dy}
        size={27.75}
        font="questrial"
        color={COR.branco}
      >
        <E field="nome" def={p.nome.toUpperCase()} normalize={(t) => t.toUpperCase()} />
      </Txt>
      {/* Data — Questrial 16,53 pt, espaçada */}
      <Txt
        x={dx}
        w={595.5}
        align="center"
        y={479.5 + dyData}
        size={16.53}
        font="questrial"
        color={COR.branco}
        tracking={3.77}
      >
        <E field="data" def={p.data} />
      </Txt>
      {/* Logo: barra gradiente + wordmark + ® + tagline */}
      <Img src="/doc/img/bar-gradient.jpg" x={lx} y={ly} w={202.6 * k} h={4.5 * k} />
      <Svg
        name="logo-wordmark"
        x={lx + (5.1 - 4.5 * 1.7422) * k}
        y={ly + (10.3 - 5.5 * 1.7422) * k}
        w={122 * s}
        h={62 * s}
        color={COR.branco}
      />
      <Img
        src="/doc/img/reg-mark.png"
        x={lx + 183.7 * k}
        y={ly + 5.8 * k}
        w={18 * k}
        h={25.5 * k}
      />
      <Svg
        name="logo-tagline"
        x={lx + 18.6 * k}
        y={ly + 84.5 * k}
        w={155 * k}
        h={19 * k}
        color={COR.branco}
      />
    </Page>
  );
}
