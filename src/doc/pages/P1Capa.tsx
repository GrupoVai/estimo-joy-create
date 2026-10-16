import { E, useDoc } from "../context";
import { COR, Img, Page, Txt } from "../layout";
import { Svg } from "../Svg";

export function tipoEvento(evento: string, eventoOutro: string): string {
  return (evento === "Outras festas" ? eventoOutro : evento).trim();
}

export function P1Capa() {
  const { p } = useDoc();
  const casamento = p.evento === "Casamento";
  const evento = tipoEvento(p.evento, p.eventoOutro).toUpperCase();
  // escala do logo em relação à extração (página 3): 179.8 / 103.2
  const s = 1.7422;
  return (
    <Page n={1} className="doc-p1">
      <Img
        src={casamento ? "/doc/img/capa-casal.jpg" : "/doc/img/capa-bartender.jpg"}
        x={0}
        y={0}
        w={595.5}
        h={842.25}
        fit="cover"
      />
      {/* Tipo de evento — Julius Sans One 40,47 pt, centralizado */}
      <Txt
        x={0}
        w={595.5}
        align="center"
        y={394.07}
        size={40.47}
        font="julius"
        color={COR.branco}
        tracking={0.44}
      >
        <E k="capa.evento" def={evento} normalize={(t) => t.toUpperCase()} />
      </Txt>
      {/* Nome — Neue Montreal Regular 27,75 pt (substituta: Questrial) */}
      <Txt
        x={0}
        w={595.5}
        align="center"
        y={431.88}
        size={27.75}
        font="questrial"
        color={COR.branco}
      >
        <E field="nome" def={p.nome.toUpperCase()} normalize={(t) => t.toUpperCase()} />
      </Txt>
      {/* Data — Questrial 16,53 pt, espaçada */}
      <Txt
        x={0}
        w={595.5}
        align="center"
        y={479.5}
        size={16.53}
        font="questrial"
        color={COR.branco}
        tracking={3.77}
      >
        <E field="data" def={p.data} />
      </Txt>
      {/* Logo: barra gradiente + wordmark + ® + tagline */}
      <Img src="/doc/img/bar-gradient.jpg" x={196.4} y={637.5} w={202.6} h={4.5} />
      <Svg
        name="logo-wordmark"
        x={201.5 - 4.5 * s}
        y={647.8 - 5.5 * s}
        w={122 * s}
        h={62 * s}
        color={COR.branco}
      />
      <Img src="/doc/img/reg-mark.png" x={380.1} y={643.3} w={18} h={25.5} />
      <Svg name="logo-tagline" x={215} y={722} w={155} h={19} color={COR.branco} />
    </Page>
  );
}
