import { useDoc } from "../context";
import { lineBox, marginBetween, Page, pt } from "../layout";
import { Frame } from "./comuns";
import { TituloOutrosServicos } from "./P5Cafeteria";
import { B, Bloco, Linha, T } from "./Servicos";

// estilos medidos no PDF
const H15 = { size: 15, lh: 17.3 } as const; // título de bloco (fonte de cachaça, torre, tequileiro)
const H14 = { size: 14.52, lh: 17.25 } as const; // shots e pedra floral
const I11 = { size: 11, lh: 15 } as const; // itens light 11
const I11b = { size: 11, lh: 16.5 } as const; // itens do tequileiro
const V10 = { size: 10.65, lh: 14.3 } as const; // linha de valor dos shots
const I10 = { size: 10.64, lh: 14.5 } as const; // itens da pedra floral
const m = (
  prevBase: number,
  prev: { size: number; lh: number },
  nextBase: number,
  next: { size: number; lh: number },
) => marginBetween({ baseline: prevBase, ...prev }, { baseline: nextBase, ...next });

export function P6Servicos() {
  const { p } = useDoc();
  const s = p.servicos;
  const algum =
    s.fonteCachaca ||
    s.torreEspumante ||
    s.tequileiro ||
    s.shotBalaCoco ||
    s.shotBananinha ||
    s.pedraFloral;
  if (!algum) return null;
  const top = lineBox(166.1, 15, "mont", 17.3).top;
  return (
    <Page n={6} className="doc-p6">
      <Frame x={31} y={89.8} w={533.6} h={726.5} />
      <TituloOutrosServicos />
      <div style={{ position: "absolute", left: pt(56.7), top: pt(top), width: pt(445) }}>
        <Bloco id="fonteCachaca">
          <Linha {...H15}>
            <B>
              <T k="sv.cachaca.t" def="FONTE DE CACHAÇA:" />
            </B>
            <T
              k="sv.cachaca.d"
              def=" O SERVIÇO INCLUI 10 LITROS DE CACHAÇA, 1 PROFISSIONAL, COPINHOS E 1 FONTE."
            />
          </Linha>
          <Linha {...I11} weight={300} x={18.7} bullet={10.1} mt={m(183.4, H15, 210.2, I11)}>
            <T k="sv.cachaca.1" def="Com cachaça Ypióca Prata: R$ 1.300,00" />
          </Linha>
          <Linha {...I11} weight={300} x={18.7} bullet={10.1}>
            <T k="sv.cachaca.2" def="Com cachaça Mel e limão: R$ 1.500,00" />
          </Linha>
          <Linha {...I11} weight={300} x={18.7} bullet={10.1}>
            <T k="sv.cachaca.3" def="Cachaça fornecida pelo cliente: R$ 1.000,00" />
          </Linha>
        </Bloco>
        <Bloco id="torreEspumante">
          <Linha {...H15} mt={m(240.2, I11, 273.4, H15)}>
            <B>
              <T k="sv.torre.t" def="TORRE DE ESPUMANTE:" />
            </B>
            <T k="sv.torre.d" def=" O ALUGUEL DE TAÇAS + 2 PROFISSIONAIS PARA A TORRE." />
          </Linha>
          <Linha {...I11} weight={300} x={18.7} bullet={10.1} mt={m(290.6, H15, 317.4, I11)}>
            <T k="sv.torre.1" def="Espumante do cliente: R$ 1.500,00" />
          </Linha>
          <Linha {...I11} weight={300} x={18.7} bullet={10.1}>
            <T k="sv.torre.2" def="Espumante Salton Brut fornecido pela coktelitas: R$ 2.000,00" />
          </Linha>
          <Linha {...I11} weight={300} x={18.7} bullet={10.1}>
            <T k="sv.torre.3" def="Espumante Chandon Brut fornecido pela coktelitas: R$ 2.500,00" />
          </Linha>
        </Bloco>
        <Bloco id="tequileiro">
          <Linha {...H15} mt={m(347.4, I11, 384.3, H15)}>
            <B>
              <T k="sv.teq.t" def="TEQUILEIRO/CANGACEIRO:" />
            </B>
          </Linha>
          <Linha {...I11b} weight={300} x={18.7} bullet={10.1} mt={m(384.3, H15, 411.3, I11b)}>
            <T k="sv.teq.1" def="Somente profissional: R$ 800,00 - " />
            <B>
              <T k="sv.teq.1b" def="Bebida do cliente." />
            </B>
          </Linha>
          <Linha {...I11b} weight={300} x={18.7} bullet={10.1}>
            <T k="sv.teq.2" def="Com as bebidas: R$ 1.400,00 (2 unidades de " />
            <B>
              <T k="sv.teq.2b" def="tequila" />
            </B>
            )
          </Linha>
          <Linha {...I11b} weight={300} x={18.7} bullet={10.1}>
            <T k="sv.teq.3" def="Com as bebidas: R$ 1.000,00 (2 unidades de " />
            <B>
              <T k="sv.teq.3b" def="cachaça" />
            </B>
            )
          </Linha>
          <Linha {...I11} w={445} mt={m(444.3, I11b, 469.3, I11)}>
            <B>
              <T k="sv.teq.obs.t" def="Observações:" />
            </B>
            <T
              k="sv.teq.obs"
              def=" Tempo de duração - enquanto durarem as garrafas não podendo ultrapassar 4 horas; o profissional poderá trabalhar com o limite de 4 garrafas."
            />
          </Linha>
        </Bloco>
        <Bloco id="shotBalaCoco">
          <Linha {...H14} mt={m(484.3, I11, 512.6, H14)}>
            <B>
              <T k="sv.coco.t" def="SHOT BALA DE COCO:" />
            </B>
            <T
              k="sv.coco.d"
              def=" DOSE DE ABSOLUT VANILA COM BALA DE COCO - COM PROFISSIONAL + BANDEJA LUMINOSA (PACOTE MINIMO 50 UNIDADES)"
            />
          </Linha>
          <Linha {...V10} weight={300} x={18.1} bullet={10.25} mt={m(547.1, H14, 572.5, V10)}>
            <T k="sv.coco.v" def="Valor/Unidade: R$ 26,00 VODKA ABSOLUT VANILA: " />
            <B>
              <T k="sv.coco.vb" def="R$ 1.300,00" />
            </B>
          </Linha>
        </Bloco>
        <Bloco id="shotBananinha">
          <Linha {...H14} mt={m(572.5, V10, 600.8, H14)}>
            <B>
              <T k="sv.bana.t" def="SHOT BANANINHA:" />
            </B>
            <T
              k="sv.bana.d"
              def=" DOSE DE BANANINHA COM TRUFA DE CHOCOLATE AMARGO - COM PROFISSIONAL + BANDEJA LUMINOSA (PACOTE MINIMO 50 UNIDADES)"
            />
          </Linha>
          <Linha {...V10} weight={300} x={18.1} bullet={10.25} mt={m(635.3, H14, 660.6, V10)}>
            <T k="sv.bana.v" def="Valor/Unidade: R$ 22,00 CACHAÇA BANANINHA: " />
            <B>
              <T k="sv.bana.vb" def="R$ 1.100,00" />
            </B>
          </Linha>
        </Bloco>
        <Bloco id="pedraFloral">
          <Linha {...H14} mt={m(660.6, V10, 689, H14)}>
            <B>
              <T k="sv.pedra.t" def="PEDRA FLORAL:" />
            </B>
            <T
              k="sv.pedra.d"
              def="  SERVIÇO RECEPTIVO COM PEDRA DE GELO FLORAL - BEBIDA DO CLIENTE (LILLET OU ESPUMANTE) - "
            />
            <B>
              <T k="sv.pedra.v" def="R$ 3.000,00" />
            </B>
          </Linha>
          <Linha
            {...I10}
            weight={300}
            x={20.9}
            bullet={9.7}
            bulletD={3.6}
            mt={m(723.5, H14, 745.3, I10)}
          >
            <T
              k="sv.pedra.1"
              def="Taças de espumante coupe para cascata e pedra de gelo com flor."
            />
          </Linha>
          <Linha {...I10} weight={300} x={20.9} bullet={9.7} bulletD={3.6}>
            <T k="sv.pedra.2" def="2 Profissionais" />
          </Linha>
          <Linha {...I10} weight={300} x={20.9} bullet={9.7} bulletD={3.6}>
            <T k="sv.pedra.3" def="Flores comestíveis" />
          </Linha>
          <Linha {...I10} weight={300} x={20.9} bullet={9.7} bulletD={3.6}>
            <T k="sv.pedra.4" def="Clericot" />
          </Linha>
        </Bloco>
      </div>
    </Page>
  );
}
