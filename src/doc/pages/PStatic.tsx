// Páginas 100% fixas (2, 8 e 9): render do PDF original a 300 dpi.
import { Img, Page } from "../layout";

export function PEstatica({ n, src }: { n: number; src: string }) {
  return (
    <Page n={n} className={`doc-p${n}`}>
      <Img src={src} x={0} y={0} w={595.5} h={842.25} />
    </Page>
  );
}
