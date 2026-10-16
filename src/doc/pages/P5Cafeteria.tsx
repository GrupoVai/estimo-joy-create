import { E, useDoc } from "../context";
import { Box, COR, Img, Page, Txt } from "../layout";
import { brlBR, numBR } from "../pricing";
import { Frame, Logo } from "./comuns";
import { MenuBox } from "./MenuBox";

const TERRA = COR.terra;
const TRACK = 0.1;

function Campo({
  label,
  yLabel,
  yValor,
  children,
}: {
  label: string;
  yLabel: number;
  yValor: number;
  children: React.ReactNode;
}) {
  return (
    <>
      <Txt x={57.2} y={yLabel} size={14.86} weight={700} color={TERRA} tracking={14.86 * TRACK}>
        {label}
      </Txt>
      <Txt
        x={57.2}
        y={yValor}
        size={14.86}
        color={TERRA}
        w={190}
        lh={16.5}
        tracking={14.86 * TRACK}
      >
        {children}
      </Txt>
    </>
  );
}

/** Título "OUTROS SERVIÇOS" em caixa terracota (páginas 5 e 6). */
export function TituloOutrosServicos() {
  return (
    <>
      <Box x={46.7} y={-44.5} w={310.4} h={160.5} fill={TERRA} r={12} />
      <Txt x={94} y={65.5} size={19} color="#fff">
        <span style={{ fontStyle: "italic" }}>OUTROS</span>
        <span style={{ fontWeight: 700 }}> SERVIÇOS</span>
      </Txt>
    </>
  );
}

export function P5Cafeteria() {
  const { p, cfg, calc, setField } = useDoc();
  const caf = p.cafeteria;
  return (
    <Page n={5} className="doc-p5">
      <Logo />
      <Frame x={-52} y={48.5} w={395.2} h={745.2} />
      <TituloOutrosServicos />
      <Txt x={59.5} y={174} size={33.27} weight={700} color={TERRA} tracking={33.27 * TRACK}>
        <E k="caf.titulo" def="CAFETERIA" />
      </Txt>
      <Campo label="PACOTE MÍNIMO:" yLabel={274.9} yValor={291.4}>
        <E
          k="caf.pacote"
          def={`${caf.pacote} UNIDADES`}
          onCommit={(t) => {
            const n = parseInt(t.replace(/\D/g, ""), 10);
            if (Number.isFinite(n)) setField({ cafeteria: { ...caf, pacote: n } });
          }}
        />
      </Campo>
      <Campo label="VALOR UNIDADE:" yLabel={324.4} yValor={340.9}>
        <E k="caf.unitario" def={numBR(caf.unitario)} />
      </Campo>
      <Campo label="VALOR TOTAL:" yLabel={373.9} yValor={390.4}>
        <E k="caf.total" def={brlBR(calc.cafeteriaTotal).replace("R$ ", "R$")} />
      </Campo>
      <Campo label="NECESSÁRIO:" yLabel={522.5} yValor={539}>
        <E k="caf.necessario" def={"Ponto de energia pra maquinário + 1 modulo de bar."} />
      </Campo>
      <MenuBox y={205.3} h={518.3} items={cfg.cafes} prefix="cafe" />
      <Img src="/doc/img/aquarela-cafe.png" x={19.1} y={659.9} w={97.5} h={166.6} />
      <Txt x={352.3} y={786.4} size={11} weight={700} color={COR.cinza}>
        <E k="caf.validade" def="*Proposta válida por 30 dias." />
      </Txt>
    </Page>
  );
}
