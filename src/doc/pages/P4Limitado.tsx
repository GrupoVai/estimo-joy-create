import { E, useDoc } from "../context";
import { Box, COR, Dot, FONTES, Page, pt, Txt, topFromBaseline } from "../layout";
import { Svg } from "../Svg";
import { Frame } from "./comuns";
import { brlBR, numBR } from "../pricing";

const TERRA = COR.terra;
const CLARA = COR.terraClara;
const SOMBRA = "0 0 3pt rgba(0,0,0,0.35)";

/** Nomes das faixas de bebida (ordem do PDF: do mais barato ao mais caro). */
export const FAIXAS_LIMITADO = [
  "BEBIDA DO CLIENTE",
  "VODKA SMIRNOFF + GIN NACIONAL",
  "VODKA WYBOROWA + GIN GORDONS",
  "VODKA ABSOLUT + GIN BEEFEATER OU TANQUERAY OU BOMBAY",
];

const RESPONSABILIDADE = [
  "Cardápio personalizado e no porta retrato de acordo com sua decoração;",
  "Possuímos uma carta com vasta variedade de drinks autorais e clássicos  que pode ser escolhido ou desenvolvido junto com o cliente.",
  "Equipe de bartenders treinados e devidamente uniformizados para o seu evento;",
  "Decoração do bar com fruteiras de vidro, peças de prata, cobre ou dourada, caixas para especiarias.",
  "Destilados importados e nacionais, licores, syrup, frutas, gelo de primeira qualidade;",
  "Equipamentos e utensílios de bar;",
  "Copos e taças de vidro ou semi-acrílico; canecas de alumínio ou cobre. (Seguro de copos R$350,00 ou valor unitário R$ 35,00 – SEGURO DAS CANECAS VER COM O COMERCIAL)",
  "Balcão e pia não incluso!",
];

function Coluna({ op, x, xTitulo }: { op: 0 | 1; x: number; xTitulo: number }) {
  const { calc } = useDoc();
  const lim = calc.limitado;
  const size = 10;
  const lh = 13.5;
  const top = topFromBaseline(131.77, size, "mont", lh);
  return (
    <>
      <Txt x={xTitulo} y={99.3} size={15} weight={700} color="#fff" shadow={SOMBRA}>
        <E k={`lim.op.${op}.titulo`} def={`OPÇÃO ${op + 1}: ${lim.unidades[op]} UNIDADES`} />
      </Txt>
      <div
        style={{
          position: "absolute",
          left: pt(x),
          top: pt(top),
          width: pt(215),
          fontFamily: '"Montserrat"',
          fontSize: pt(size),
          lineHeight: pt(lh),
          color: "#fff",
          textShadow: SOMBRA,
        }}
      >
        {FAIXAS_LIMITADO.map((nome, f) => (
          <div key={f} style={{ marginBottom: pt(lh) }}>
            <div style={{ fontWeight: 700 }}>
              <E k={`lim.faixa.${f}.nome`} def={nome} />
            </div>
            <div>
              Valor/Unidade: <E k={`lim.unit.${f}`} def={`R$${numBR(lim.unitarios[f] ?? 0)}`} />
            </div>
            <div>
              Valor total: <E k={`lim.total.${op}.${f}`} def={brlBR(lim.totais[op][f] ?? 0)} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function P4Limitado() {
  const m = FONTES.mont;
  // bullets da lista de responsabilidade: centro 3 pt acima da linha de base; itens com recuo na 1ª linha
  const lh = 13.5;
  const size = 10;
  const listTop = topFromBaseline(623.6, size, "mont", lh);
  const dotY = (lh - (m.asc + m.desc) * size) / 2 + m.asc * size - 3.0 - 1.5;
  return (
    <Page n={4} className="doc-p4a">
      {/* colunas terracota (cantos r=12; topo além da página) */}
      <Box x={26.8} y={-67.2} w={260.6} h={441.8} fill={TERRA} r={12} />
      <Box x={308.1} y={-67.2} w={260.6} h={441.8} fill={TERRA} r={12} />
      <Txt x={37.2} y={56.93} size={19} color="#fff" shadow={SOMBRA}>
        <span style={{ fontStyle: "italic" }}>COQUETÉIS</span>
        <span style={{ fontWeight: 700 }}> LIMITADOS</span>
      </Txt>
      <Coluna op={0} x={42.6} xTitulo={39.8} />
      <Coluna op={1} x={326.4} xTitulo={321.2} />

      {/* OBSERVAÇÕES — duas cópias no original (efeito de relevo) */}
      <Txt
        x={43.6}
        y={415.74}
        size={19}
        weight={700}
        italic
        color={CLARA}
        shadow={"-0.9pt -0.8pt 0 " + TERRA}
      >
        OBSERVAÇÕES:
      </Txt>
      <Dot x={44.0} y={439.4} d={3.8} color={CLARA} />
      <Txt
        x={56.4}
        y={445.15}
        size={11}
        weight={300}
        color={CLARA}
        lh={15}
        shadow={"-0.5pt -0.5pt 0 " + CLARA}
        w={470}
      >
        <E k="lim.obs.1a" def="VALOR DO SEGURO DE " />
        <span style={{ fontWeight: 700 }}>
          <E k="lim.obs.1b" def="TAÇAS E COPOS DE VIDRO : R$ 350,00" />
        </span>
        {"\n"}
        <span style={{ fontWeight: 700 }}>
          <E k="lim.obs.1c" def="EM QUALQUER UMA DAS OPÇÕES." />
        </span>
      </Txt>
      <Dot x={44.0} y={481.5} d={3.8} color={CLARA} />
      <Txt
        x={56.4}
        y={487.21}
        size={11}
        weight={300}
        color={CLARA}
        shadow={"-0.5pt -0.5pt 0 " + CLARA}
        w={470}
      >
        <E k="lim.obs.2a" def="VALOR DE " />
        <span style={{ fontWeight: 700 }}>
          <E k="lim.obs.2b" def="CADA " />
        </span>
        <E k="lim.obs.2c" def="QUEBRA OU EXTRAVIO " />
        <span style={{ fontWeight: 700 }}>
          <E k="lim.obs.2d" def="FORA DO SEGURO: R$ 35,00" />
        </span>
        .
      </Txt>

      {/* RESPONSABILIDADE DA CONTRATADA */}
      <Frame x={27} y={527.5} w={541.5} h={407.1} />
      <Txt x={63.8} y={565.9} size={15} weight={700} color={TERRA}>
        <E k="lim.resp.titulo" def="RESPONSABILIDADE DA CONTRATADA" />
      </Txt>
      <Txt x={63.8} y={596.6} size={10} color={TERRA} w={475} lh={13.5}>
        <E
          k="lim.resp.intro"
          def="A COKTELITAS se compromete em levar todo o material necessário à realização do seu evento conforme descrição abaixo:"
        />
      </Txt>
      <div
        style={{
          position: "absolute",
          left: pt(63.8),
          top: pt(listTop),
          width: pt(471),
          fontFamily: '"Montserrat"',
          fontSize: pt(size),
          lineHeight: pt(lh),
          color: TERRA,
        }}
      >
        {RESPONSABILIDADE.map((t, i) => (
          <div key={i} style={{ position: "relative", textIndent: pt(17) }}>
            <Dot x={6} y={dotY} d={3} color={TERRA} />
            <E k={`lim.resp.${i}`} def={t} />
          </div>
        ))}
      </div>
      <Svg name="logo-wordmark" x={246.1 - 4.5} y={776.6 - 5.5} w={122} h={62} color={TERRA} />
    </Page>
  );
}
