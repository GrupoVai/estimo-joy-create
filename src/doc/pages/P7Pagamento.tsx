import { E, useDoc } from "../context";
import { Box, COR, Img, lineBox, marginBetween, Page, pt, Txt } from "../layout";
import { Svg } from "../Svg";
import { Frame } from "./comuns";
import { B, Bloco, Linha, T } from "./Servicos";

const TERRA = COR.terra;
const SOMBRA = "0 0 3pt rgba(0,0,0,0.35)";
const H14 = { size: 14.52, lh: 17.25 } as const;
const I10 = { size: 10.65, lh: 14.25 } as const;
const STRIP_Y0 = 259.5;
const STRIP_Y1 = 345.6;

/** Foto da faixa: imagem no bbox original, recortada pela faixa com cantos arredondados. */
function Foto({
  src,
  bx,
  by,
  bw,
  bh,
}: {
  src: string;
  bx: number;
  by: number;
  bw: number;
  bh: number;
}) {
  return (
    <Box x={bx} y={STRIP_Y0} w={bw} h={STRIP_Y1 - STRIP_Y0} r={10} style={{ overflow: "hidden" }}>
      <Img src={src} x={0} y={by - STRIP_Y0} w={bw} h={bh} />
    </Box>
  );
}

const m = (
  prevBase: number,
  prev: { size: number; lh: number },
  nextBase: number,
  next: { size: number; lh: number },
) => marginBetween({ baseline: prevBase, ...prev }, { baseline: nextBase, ...next });

export function P7Pagamento() {
  const { p } = useDoc();
  const top = lineBox(54.2, 14.52, "mont", 17.25).top;
  const temServicos = p.servicos.receptivo || p.servicos.maquinaTaca;
  return (
    <Page n={7} className="doc-p7">
      {temServicos ? (
        <div style={{ position: "absolute", left: pt(50.1), top: pt(top), width: pt(495) }}>
          <Bloco id="receptivo">
            <Linha {...H14}>
              <B>
                <T k="sv.rec.t" def="RECEPTIVO: " />
              </B>
              <T k="sv.rec.d" def=" SERVIÇO RECEPTIVO - BEBIDA DO CLIENTE" />
            </Linha>
            <Linha {...I10} weight={300} x={21} bullet={10.2} mt={m(54.2, H14, 75.6, I10)}>
              <T
                k="sv.rec.1"
                def="Clericot R$ 2.500,00 –  Espumante Salton Brut – 100 Taças de 250ml"
              />
            </Linha>
            <Linha {...I10} weight={300} x={21} bullet={10.2}>
              <T
                k="sv.rec.2"
                def="Clericot R$ 3.800,00 –  Espumante Chandon  Brut – 100  Taças de 250ml"
              />
            </Linha>
            <Linha {...I10} weight={300} x={21} bullet={10.2}>
              <T k="sv.rec.3" def="Aperol Spritz R$ 2.500,00 – 100 Taças de 350ml" />
            </Linha>
            <Linha {...I10} weight={300} x={21} bullet={10.2}>
              <T k="sv.rec.4" def="Limoncello Spritz R$ 3.000,00 – 100 Taças de 350ml" />
            </Linha>
          </Bloco>
          <Bloco id="maquinaTaca">
            <Linha
              size={14.51}
              lh={17.25}
              x={1.5}
              mt={m(118.4, I10, 174.2, { size: 14.51, lh: 17.25 })}
            >
              <B>
                <T k="sv.maq.t" def="MÁQUINA PARA GELAR TAÇA:" />
              </B>
            </Linha>
            <Linha
              {...I10}
              x={14.7}
              bullet={10.2}
              mt={m(174.2, { size: 14.51, lh: 17.25 }, 201.1, I10)}
            >
              <T k="sv.maq.1" def="Aluguel: R$ 1.500,00" />
            </Linha>
          </Bloco>
        </div>
      ) : null}

      {/* faixa de fotos: cada foto recortada em (x0, 259.5)-(x1, 345.6) com cantos r=10 */}
      <Foto src="/doc/img/foto-1.jpg" bx={-106.6} by={192.3} bw={175.4} bh={219.1} />
      <Foto src="/doc/img/foto-2.jpg" bx={76.9} by={211.3} bw={178.7} bh={268.1} />
      <Foto src="/doc/img/foto-3.jpg" bx={263.5} by={250.3} bw={177.9} bh={118.6} />
      <Foto src="/doc/img/foto-4.jpg" bx={449.8} by={183.3} bw={158.8} bh={238.2} />

      {/* FORMA DE PAGAMENTO */}
      <Frame x={31} y={446.5} w={533.5} h={292} />
      <Box x={50.1} y={382.4} w={310.3} h={89.4} fill={TERRA} r={12} />
      <Txt x={89.1} y={433.1} size={19} color="#fff" shadow={SOMBRA}>
        <span style={{ fontStyle: "italic" }}>FORMA DE</span>
        <span style={{ fontWeight: 700 }}> PAGAMENTO</span>
      </Txt>
      <Txt x={64.2} y={520.9} size={17.45} weight={700} color={TERRA}>
        <E k="pag.t" def="Forma de Pagamento:" />
      </Txt>
      <div
        style={{
          position: "absolute",
          left: pt(93.8),
          top: pt(lineBox(541.1, 17.45, "mont", 20.3).top),
          width: pt(390),
        }}
      >
        <Linha size={17.45} lh={20.3} bullet={13.1} bulletD={6}>
          <T k="pag.1" def="À vista." />
        </Linha>
        <Linha size={17.45} lh={20.3} bullet={13.1} bulletD={6}>
          <T
            k="pag.2"
            def="3x no boleto (parcelamento é variável conforme valor total do contrato e data do evento)."
          />
        </Linha>
      </div>
      <Txt x={64.2} y={642.4} size={17.45} color={TERRA} w={470} lh={20.3}>
        <B>
          <T k="pag.obs.t" def="OBS:" />
        </B>
        <T k="pag.obs" def=" o contrato deve estar quitado antes da festa." />
      </Txt>
      <Txt x={155.7} y={677} size={14.89} weight={700} color={TERRA}>
        <E k="pag.validade" def="PROPOSTA VÁLIDA POR 30 DIAS." />
      </Txt>
      <Svg name="btn-green" x={183} y={710} w={239} h={57} />
    </Page>
  );
}
