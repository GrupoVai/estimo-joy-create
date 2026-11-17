// Página 4 — "Coquetéis ilimitados / Open bar" com DOIS cards de drinks sem álcool (XV anos):
// Opção 1 (150 unidades) e Opção 2 (200 unidades). Não há tabela: o investimento de cada card
// é digitado (p.precos.pacoteSemAlcool / pacoteSemAlcool2); as unidades seguem a tabela do
// limitado (150/200) e também podem ser alteradas. Card medido no PDF "GEORGIA GOMES 12.02.2026".
import { E, useDoc } from "../context";
import { Box, COR, Page, Txt } from "../layout";
import { brlBR, parseBR } from "../pricing";
import { Svg } from "../Svg";
import { CabecalhoOpenBar, RodapeOpenBar } from "./P4OpenBar";

const TERRA = COR.terra;
const TRACK = 0.1;
const CARD_Y = 254.7;
const CARD_W = 148.2;
const CARD_H = 289.1;
const GAP = 20;
// dois cards centralizados na página
const CARD_X: [number, number] = [
  (595.5 - (2 * CARD_W + GAP)) / 2,
  (595.5 - (2 * CARD_W + GAP)) / 2 + CARD_W + GAP,
];
const TAB_NOME = ["ob-txt-opcao-1", "ob-txt-opcao-2"] as const;

function Card({ i }: { i: 0 | 1 }) {
  const { p, calc, setField } = useDoc();
  const x = CARD_X[i];
  const dx = x - 211.3; // deslocamento em relação ao card medido no PDF (x = 211,3)
  const valor = i === 0 ? calc.pacoteSemAlcool : calc.pacoteSemAlcool2;
  const unidades = calc.limitado.unidades[i];
  const sw = 1.5;
  return (
    <>
      <Box
        x={x - sw / 2}
        y={CARD_Y - sw / 2}
        w={CARD_W + sw}
        h={CARD_H + sw}
        stroke={TERRA}
        strokeW={sw}
        r={27.7}
      />
      {/* aba "OPÇÃO n" */}
      <Svg name="ob-tab" x={226.5 + dx} y={252} w={120} h={58} color={TERRA} />
      <Svg name={TAB_NOME[i]} x={260.8 + dx} y={261.4} w={58} h={19} color="#fff" />
      {/* taça + copo com gelo */}
      <Svg name="sa-icon-drinks" x={228.8 + dx} y={336.5} w={109.6} h={93.3} />
      <Txt
        x={x}
        w={CARD_W}
        align="center"
        y={457.5}
        size={9.18}
        color={TERRA}
        tracking={9.18 * TRACK}
        lh={9.76}
      >
        <E k={`sa.rotulo.${i}`} def={"DRINKS SEM ÁLCOOL\n"} />
        <E k={`sa.unid.${i}`} def={`${unidades} UNIDADES`} />
      </Txt>
      {/* caixa "investimento do pacote" */}
      <Box x={x} y={503.9} w={146.9} h={58.6} fill={TERRA} r="5pt 5pt 12pt 12pt">
        <Txt
          x={0}
          w={146.9}
          align="center"
          y={516.5 - 503.9}
          size={9.18}
          color="#fff"
          tracking={9.18 * TRACK}
          lh={9.76}
        >
          <E k={`sa.inv.${i}`} def={"INVESTIMENTO DO\nPACOTE"} />
        </Txt>
        <Txt
          x={0}
          w={146.9}
          align="center"
          y={549.0 - 503.9}
          size={19}
          weight={700}
          font="serif"
          color="#fff"
          tracking={1.9}
          style={{ fontVariantNumeric: "lining-nums" }}
        >
          <E
            k={`sa.preco.${i}`}
            def={valor === null ? "R$ ______" : brlBR(valor)}
            onCommit={(t) => {
              const n = parseBR(t);
              const v = n === null || n === 0 ? null : n;
              setField({
                precos: {
                  ...p.precos,
                  ...(i === 0 ? { pacoteSemAlcool: v } : { pacoteSemAlcool2: v }),
                },
              });
            }}
          />
        </Txt>
      </Box>
    </>
  );
}

export function P4SemAlcool() {
  return (
    <Page n={4} className="doc-p4b">
      <CabecalhoOpenBar />
      <Card i={0} />
      <Card i={1} />
      <RodapeOpenBar />
    </Page>
  );
}
