// Página 4 — "Coquetéis ilimitados / Open bar" com UM card: drinks sem álcool (XV anos).
// Não há tabela: o investimento do pacote é digitado (p.precos.pacoteSemAlcool).
// Medidas do PDF "GEORGIA GOMES 12.02.2026".
import { E, useDoc } from "../context";
import { Box, COR, Page, Txt } from "../layout";
import { brlBR, parseBR } from "../pricing";
import { Svg } from "../Svg";
import { CabecalhoOpenBar, RodapeOpenBar } from "./P4OpenBar";

const TERRA = COR.terra;
const TRACK = 0.1;
// card único centralizado: mesma largura/altura dos cards do open bar
const CARD_X = 211.3;
const CARD_Y = 254.7;
const CARD_W = 148.2;
const CARD_H = 289.1;

export function P4SemAlcool() {
  const { p, calc, setField } = useDoc();
  const valor = calc.pacoteSemAlcool;
  const sw = 1.5;
  return (
    <Page n={4} className="doc-p4b">
      <CabecalhoOpenBar />

      {/* moldura do card */}
      <Box
        x={CARD_X - sw / 2}
        y={CARD_Y - sw / 2}
        w={CARD_W + sw}
        h={CARD_H + sw}
        stroke={TERRA}
        strokeW={sw}
        r={27.7}
      />
      {/* aba "OPÇÃO" (sem número, a pedido da Coktelitas), centralizada na aba */}
      <Svg name="ob-tab" x={226.5} y={252} w={120} h={58} color={TERRA} />
      <Svg name="ob-txt-opcao" x={286.5 - 43.16 / 2} y={261.4} w={43.16} h={19} color="#fff" />
      {/* taça + copo com gelo */}
      <Svg name="sa-icon-drinks" x={228.8} y={336.5} w={109.6} h={93.3} />
      <Txt
        x={CARD_X}
        w={CARD_W}
        align="center"
        y={463.75}
        size={9.18}
        color={TERRA}
        tracking={9.18 * TRACK}
      >
        <E k="sa.rotulo" def="DRINKS SEM ÁLCOOL" />
      </Txt>
      {/* caixa "investimento do pacote" */}
      <Box x={CARD_X} y={503.9} w={146.9} h={58.6} fill={TERRA} r="5pt 5pt 12pt 12pt">
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
          <E k="sa.inv" def={"INVESTIMENTO DO\nPACOTE"} />
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
            k="sa.preco"
            def={valor === null ? "R$ ______" : brlBR(valor)}
            onCommit={(t) => {
              const n = parseBR(t);
              setField({
                precos: { ...p.precos, pacoteSemAlcool: n === null || n === 0 ? null : n },
              });
            }}
          />
        </Txt>
      </Box>

      <RodapeOpenBar />
    </Page>
  );
}
