import type { ReactNode } from "react";

import { E, useDoc } from "../context";
import { Box, COR, Img, Page, pt, Txt } from "../layout";
import { brlBR } from "../pricing";
import { Svg } from "../Svg";
import { Frame } from "./comuns";

const TERRA = COR.terra;
const CLARA = COR.terraClara;
/** toda a página usa espaçamento entre letras ~0,1 em (Canva) */
const TRACK = 0.1;
const CARD_X = [-5.5, 146.9, 300.0, 452.5];
const CARD_Y = [254.7, 259.3, 259.3, 259.3];
const CARD_W = 148.2;
const CARD_H = 289.1;
const B = (children: ReactNode) => <span style={{ fontWeight: 700 }}>{children}</span>;

function Card({ i }: { i: number }) {
  const x = CARD_X[i] ?? 0;
  const y = CARD_Y[i] ?? 0;
  const sw = 1.5;
  return (
    <Box
      x={x - sw / 2}
      y={y - sw / 2}
      w={CARD_W + sw}
      h={CARD_H + sw}
      stroke={TERRA}
      strokeW={sw}
      r={27.7}
    />
  );
}

export function P4OpenBar() {
  const { p, calc } = useDoc();
  const ob = calc.openBar;
  const horas = p.duracao ?? 4;
  const s = 0.6308; // escala do logo do topo (65,1 / 103,2)

  return (
    <Page n={4} className="doc-p4b">
      {/* logo topo (terracota clara) */}
      <Svg
        name="logo-wordmark"
        x={262.8 - 4.5 * s}
        y={26.4 - 5.5 * s}
        w={122 * s}
        h={62 * s}
        color={CLARA}
      />
      <Img src="/doc/img/reg-mark.png" x={327.44} y={24.75} w={6.63} h={9.47} />

      <Txt
        x={59.5}
        y={90.1}
        size={33.27}
        weight={700}
        italic
        color={TERRA}
        tracking={33.27 * 0.094}
      >
        <E k="ob.titulo" def="COQUETÉIS ILIMITADOS" />
      </Txt>
      <Txt
        x={0}
        w={595.5}
        align="center"
        y={124.9}
        size={28.27}
        italic
        color={TERRA}
        tracking={28.27 * 0.09}
      >
        <E k="ob.subtitulo" def={`OPEN BAR - ${horas} HORAS`} />
      </Txt>

      {/* COMO FUNCIONA? */}
      <Frame x={9.9} y={139.3} w={575.7} h={98.1} />
      <Img src="/doc/img/ob-icon-cocktail.png" x={42} y={159} w={65} h={65} />
      <Txt x={124.7} y={164.92} size={16.18} weight={700} color={TERRA} tracking={16.18 * TRACK}>
        <E k="ob.como.titulo" def="COMO FUNCIONA?" />
      </Txt>
      <Txt
        x={124.7}
        y={181.72}
        size={10.18}
        color={TERRA}
        w={458}
        lh={11.25}
        tracking={10.18 * TRACK}
      >
        <E k="ob.como.1" def="TODAS AS OPÇÕES INCLUEM ATÉ " />
        {B(<E k="ob.como.2" def="O HORÁRIO SOLICITADO," />)}
        <E k="ob.como.3" def=" COQUETÉIS E DRINKS ILIMITADOS, NO FORMATO OPEN BAR, ALÉM DA " />
        {B(<E k="ob.como.4" def="PERSONALIZAÇÃO DO MOSCOW MULE DE BRINDE." />)}
        {"\n"}
        <E k="ob.como.5" def="A DIFERENÇA ENTRE AS OPÇÕES ESTÁ NAS " />
        {B(<E k="ob.como.6" def="MARCAS DE DESTILADOS" />)}
        <E k="ob.como.7" def=" UTILIZADAS NO EVENTO." />
      </Txt>

      {/* cards: moldura, linha divisória, caixa "investimento" (sobrepõe a base da moldura) */}
      {[0, 1, 2, 3].map((i) => (
        <Card key={i} i={i} />
      ))}
      {[0, 1, 2].map((i) => (
        <Box key={i} x={(CARD_X[i] ?? 0) + 3.3} y={404.9} w={141.6} h={1.8} fill={CLARA} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Box
          key={i}
          x={(CARD_X[i] ?? 0) + 0.7}
          y={508.5}
          w={146.9}
          h={58.5}
          fill={TERRA}
          r="5pt 5pt 12pt 12pt"
        >
          <Txt
            x={0}
            w={146.9}
            align="center"
            y={521.1 - 508.5}
            size={9.18}
            color="#fff"
            tracking={9.18 * TRACK}
            lh={9.76}
          >
            <E k={`ob.inv.${i}`} def={"INVESTIMENTO DO\nPACOTE"} />
          </Txt>
          <Txt
            x={0}
            w={146.9}
            align="center"
            y={553.63 - 508.5}
            size={19}
            weight={700}
            font="serif"
            color="#fff"
            tracking={1.9}
            style={{ fontVariantNumeric: "lining-nums" }}
          >
            <E k={`ob.preco.${i}`} def={brlBR(ob.valores[i] ?? 0)} />
          </Txt>
        </Box>
      ))}
      {/* abas "OPÇÃO n" */}
      <Svg name="ob-tab" x={10} y={254} w={120} h={58} color={TERRA} />
      <Svg name="ob-tab" x={161.3} y={256.6} w={120} h={58} color={TERRA} />
      <Svg name="ob-tab" x={314.4} y={256.6} w={120} h={58} color={TERRA} />
      <Svg name="ob-tab" x={467.7} y={256.6} w={120} h={58} color={TERRA} />
      <Svg name="ob-txt-opcao-1" x={40} y={266} w={56} h={19} color="#fff" />
      <Svg name="ob-txt-opcao-2" x={192} y={266} w={58} h={19} color="#fff" />
      <Svg name="ob-txt-opcao-3" x={346} y={266} w={58} h={19} color="#fff" />
      <Svg name="ob-txt-opcao-4" x={502} y={266} w={58} h={19} color="#fff" />
      {/* garrafas */}
      {[0, 153.1, 307.1].map((dx, i) => (
        <span key={i}>
          <Img src="/doc/img/ob-icon-vodka.png" x={8 + dx} y={310} w={32} h={90} />
          <Img src="/doc/img/ob-icon-gin.png" x={8 + dx} y={418} w={40} h={76} />
        </span>
      ))}
      <Svg name="ob-icon-box" x={486} y={326} w={80} h={80} />
      {/* textos dos cards (posições do PDF) */}
      <Txt x={50.4} y={332.73} size={10.18} weight={700} color={TERRA} tracking={10.18 * TRACK}>
        <E k="ob.c0.vodka" def="VODKA" />
      </Txt>
      <Txt x={53.6} y={351.56} size={10.18} color={TERRA} tracking={10.18 * TRACK}>
        <E k="ob.c0.vodkaMarca" def="ABSOLUT" />
      </Txt>
      <Txt x={51.7} y={434.34} size={10.18} weight={700} color={TERRA} tracking={10.18 * TRACK}>
        <E k="ob.c0.gin" def="GIN" />
      </Txt>
      <Txt
        x={50.9}
        w={73.2}
        align="center"
        y={453.16}
        size={10.18}
        color={TERRA}
        tracking={10.18 * TRACK}
        lh={11.25}
      >
        <E k="ob.c0.ginMarca" def={"BEEFEATER,\nTANQUERAY\nOU\nBOMBAY"} />
      </Txt>
      <Txt x={203.2} y={333.0} size={10.18} weight={700} color={TERRA} tracking={10.18 * TRACK}>
        <E k="ob.c1.vodka" def="VODKA" />
      </Txt>
      <Txt x={204.2} y={351.56} size={10.18} color={TERRA} tracking={10.18 * TRACK}>
        <E k="ob.c1.vodkaMarca" def="WYBOROWA" />
      </Txt>
      <Txt x={205.3} y={434.34} size={10.18} weight={700} color={TERRA} tracking={10.18 * TRACK}>
        <E k="ob.c1.gin" def="GIN" />
      </Txt>
      <Txt
        x={204.3}
        y={453.16}
        size={10.18}
        color={TERRA}
        tracking={10.18 * TRACK}
        lh={11.25}
        w={80}
      >
        <E k="ob.c1.ginMarca" def="GORDONS" />
      </Txt>
      <Txt x={354.4} y={333.0} size={10.18} weight={700} color={TERRA} tracking={10.18 * TRACK}>
        <E k="ob.c2.vodka" def="VODKA" />
      </Txt>
      <Txt x={354.8} y={351.56} size={10.18} color={TERRA} tracking={10.18 * TRACK}>
        <E k="ob.c2.vodkaMarca" def="SMIRNOFF" />
      </Txt>
      <Txt x={357.9} y={434.34} size={10.18} weight={700} color={TERRA} tracking={10.18 * TRACK}>
        <E k="ob.c2.gin" def="GIN" />
      </Txt>
      <Txt
        x={356.3}
        y={453.16}
        size={10.18}
        color={TERRA}
        tracking={10.18 * TRACK}
        lh={11.25}
        w={80}
      >
        <E k="ob.c2.ginMarca" def={"GIN\nNACIONAL"} />
      </Txt>
      <Txt x={466.3} y={427.95} size={9.18} color={TERRA} tracking={9.18 * TRACK} lh={9.75} w={125}>
        <E k="ob.c3.a" def={"BEBIDAS DESTILADAS\nPELO CONTRATANTE."} />
      </Txt>
      <Txt
        x={466.7}
        y={452.37}
        size={9.18}
        weight={700}
        color={TERRA}
        tracking={9.18 * TRACK}
        lh={9.75}
        w={125}
      >
        <E k="ob.c3.b" def={"CONSULTAR O\nNUMERO DE\nGARRAFAS."} />
      </Txt>

      {/* OBSERVAÇÕES */}
      <Frame x={9.9} y={591.3} w={575.7} h={81.4} />
      <Svg
        name="ob-txt-observacoes"
        x={216}
        y={588}
        w={122}
        h={21}
        color={TERRA}
        style={{
          background: "#fff",
          padding: "0 3pt",
          boxSizing: "content-box",
          marginLeft: "-3pt",
        }}
      />
      <Svg name="ob-icon-shield" x={23} y={616} w={46} h={46} />
      <Svg name="ob-icon-glass" x={304} y={616} w={46} h={46} />
      <Txt
        x={70.5}
        w={200}
        align="center"
        y={624.89}
        size={9.18}
        color={TERRA}
        tracking={9.18 * TRACK}
        lh={9.75}
      >
        <E k="ob.obs.1" def={"VALOR DO SEGURO DE COPOS E\nTAÇAS DE VIDRO:"} />
      </Txt>
      <Txt
        x={70.5}
        w={200}
        align="center"
        y={654.15}
        size={9.18}
        color={TERRA}
        tracking={9.18 * TRACK}
        lh={9.75}
      >
        {B(<E k="ob.obs.2a" def="R$ 350,00" />)}
        <E k="ob.obs.2b" def={" EM QUALQUER UMA DAS\nOPÇÕES."} />
      </Txt>
      <Txt
        x={334}
        w={200}
        align="center"
        y={624.89}
        size={9.18}
        color={TERRA}
        tracking={9.18 * TRACK}
        lh={9.75}
      >
        <E k="ob.obs.3" def={"VALOR DE CADA QUEBRA OU\nEXTRAVIO FORA DO SEGURO:"} />
        {"\n"}
        {B(<E k="ob.obs.4" def="R$ 35,00" />)}
      </Txt>

      {/* RESPONSABILIDADE DA CONTRATADA */}
      <Frame x={11.2} y={681} w={575.8} h={178.8} />
      <Svg
        name="ob-txt-responsabilidade"
        x={134}
        y={678}
        w={304}
        h={21}
        color={TERRA}
        style={{
          background: "#fff",
          padding: "0 3pt",
          boxSizing: "content-box",
          marginLeft: "-3pt",
        }}
      />
      <Txt
        x={27.75}
        w={540}
        align="center"
        y={708.36}
        size={10.18}
        color={TERRA}
        tracking={10.18 * TRACK}
        lh={11.25}
      >
        <E
          k="ob.resp.intro"
          def={
            "A COKTELITAS SE COMPROMETE EM LEVAR TODO MATERIAL NECESSÁRIO PARA A\nREALIZAÇÃO DO SEU EVENTO, CONFORME ABAIXO:"
          }
        />
      </Txt>
      {[764.4, 786.9, 809.5].map((cy, i) => (
        <span key={i}>
          <Box x={24.3 - 8.9} y={cy - 8.9} w={17.8} h={17.8} stroke={TERRA} strokeW={1.2} r="50%" />
          <Svg name="ob-icon-check" x={18} y={cy - 5.4} w={12} h={10} />
        </span>
      ))}
      <Txt x={40.4} y={769.15} size={10.18} color={TERRA} tracking={10.18 * TRACK}>
        <E k="ob.resp.1" def="BARTENDERS E COPEIROS PROFISSIONAIS COM O NUMERO DE: " />
        <E field="bartenders" def={p.bartenders} />
      </Txt>
      <Txt x={38.3} y={790.27} size={10.18} color={TERRA} tracking={10.18 * TRACK}>
        <E
          k="ob.resp.2"
          def="CARDÁPIO PERSONALIZADO DE ACORDO COM A ESCOLHA DOS DRINKS DO CLIENTE."
        />
      </Txt>
      <Txt x={39.0} y={814.2} size={10.18} color={TERRA} tracking={10.18 * TRACK}>
        <E k="ob.resp.3" def="DECORAÇÃO E UNIFORME DE ACORDO COM DECORAÇÃO DA FESTA." />
      </Txt>
    </Page>
  );
}
