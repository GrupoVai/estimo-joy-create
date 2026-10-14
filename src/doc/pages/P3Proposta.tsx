import { E, useDoc } from "../context";
import { COR, Img, Page, Txt } from "../layout";
import { tipoEvento } from "./P1Capa";
import { Frame, Logo } from "./comuns";
import { MenuBox } from "./MenuBox";

const TERRA = COR.terra;
/** espaçamento entre letras da coluna esquerda (Canva): ~0,1 em */
const TRACK = 0.1;

/** Rótulo + valor da coluna esquerda (posições medidas no PDF). */
function Campo({
  label,
  yLabel,
  yValor,
  sizeValor = 14.86,
  children,
}: {
  label: string;
  yLabel: number;
  yValor: number;
  sizeValor?: number;
  children: React.ReactNode;
}) {
  return (
    <>
      <Txt x={59.5} y={yLabel} size={14.86} weight={700} color={TERRA} tracking={14.86 * TRACK}>
        {label}
      </Txt>
      <Txt
        x={59.5}
        y={yValor}
        size={sizeValor}
        color={TERRA}
        w={150}
        lh={16.5}
        tracking={sizeValor * TRACK}
      >
        {children}
      </Txt>
    </>
  );
}

export function P3Proposta() {
  const { p, setField } = useDoc();
  const evento = tipoEvento(p.evento, p.eventoOutro).toUpperCase();
  const deslocamento = p.deslocamento.trim() ? `R$ ${p.deslocamento.trim()}` : "R$ ISENTO";
  const convidados = p.convidados !== null ? String(p.convidados) : "";
  const duracao = p.duracao !== null ? `${p.duracao} HORAS` : "";
  return (
    <Page n={3} className="doc-p3">
      <Logo />
      <Frame x={-52} y={48.5} w={395.2} h={745.2} />
      <Txt x={59.5} y={171.3} size={33.27} weight={700} color={TERRA} tracking={33.27 * TRACK}>
        PROPOSTA
      </Txt>
      {/* CLIENTE — rótulo 21,26 bold; valor 21,26 (até 2 linhas) */}
      <Txt x={59.5} y={214.3} size={21.26} weight={700} color={TERRA} tracking={21.26 * TRACK}>
        CLIENTE:
      </Txt>
      <Txt x={59.5} y={237.6} size={21.26} color={TERRA} w={150} lh={23.2} tracking={21.26 * TRACK}>
        <E field="nome" def={p.nome.toUpperCase()} normalize={(t) => t.toUpperCase()} />
      </Txt>
      <Campo label="EVENTO:" yLabel={295.9} yValor={310.9} sizeValor={13.85}>
        <E k="p3.evento" def={evento} normalize={(t) => t.toUpperCase()} />
      </Campo>
      <Campo label="LOCAL:" yLabel={342.4} yValor={358.9}>
        <E field="local" def={p.local.toUpperCase()} normalize={(t) => t.toUpperCase()} />
      </Campo>
      <Campo label="DESLOCAMENTO:" yLabel={408.4} yValor={424.9}>
        <E k="p3.deslocamento" def={deslocamento} normalize={(t) => t.toUpperCase()} />
      </Campo>
      <Campo label="DATA:" yLabel={457.9} yValor={472.2} sizeValor={12.85}>
        <E field="data" def={p.data} />
      </Campo>
      <Campo label="CONVIDADOS:" yLabel={502.9} yValor={519.5}>
        <E k="p3.convidados" def={convidados} />
      </Campo>
      <Campo label="DURAÇÃO:" yLabel={552.5} yValor={566.7} sizeValor={12.85}>
        <E k="p3.duracao" def={duracao} normalize={(t) => t.toUpperCase()} />
      </Campo>
      <Campo label="CONTATO:" yLabel={599.7} yValor={616.2}>
        <E field="contato" def={p.contato.toUpperCase()} normalize={(t) => t.toUpperCase()} />
      </Campo>
      <Campo label="CERIMONIAL:" yLabel={644.8} yValor={661.3}>
        <E field="cerimonial" def={p.cerimonial.toUpperCase()} normalize={(t) => t.toUpperCase()} />
      </Campo>

      <MenuBox
        y={214.3}
        h={534.6}
        items={p.menu}
        prefix="menu"
        subtitulo={p.menuSubtitulo}
        subtituloField="menuSubtitulo"
        onEditItem={(i, patch) =>
          setField({ menu: p.menu.map((x, j) => (j === i ? { ...x, ...patch } : x)) })
        }
      />
      <Img src="/doc/img/aquarela-drink.png" x={9.6} y={665.2} w={108.4} h={166.3} />
      <Img src="/doc/img/aquarela-drink-detail.png" x={40.4} y={651.1} w={45.8} h={28.9} />
      <Txt x={352.3} y={786.4} size={11} weight={700} color={COR.cinza}>
        <E k="p3.validade" def="*Proposta válida por 30 dias." />
      </Txt>
    </Page>
  );
}
