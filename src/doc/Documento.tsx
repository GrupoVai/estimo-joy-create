// Monta as páginas do orçamento a partir do contexto (regime, serviços ligados etc.).
import { useDoc } from "./context";
import { P1Capa } from "./pages/P1Capa";
import { P3Proposta } from "./pages/P3Proposta";
import { P4Limitado } from "./pages/P4Limitado";
import { P4OpenBar } from "./pages/P4OpenBar";
import { P5Cafeteria } from "./pages/P5Cafeteria";
import { P6Servicos } from "./pages/P6Servicos";
import { P7Pagamento } from "./pages/P7Pagamento";
import { PEstatica } from "./pages/PStatic";

export function Documento() {
  const { p, calc } = useDoc();
  return (
    <>
      <P1Capa />
      <PEstatica n={2} src="/doc/pages/p2.jpg" />
      <P3Proposta />
      {calc.regime === "limitado" ? <P4Limitado /> : <P4OpenBar />}
      {p.cafeteria.ativo ? <P5Cafeteria /> : null}
      <P6Servicos />
      <P7Pagamento />
      <PEstatica n={8} src="/doc/pages/p8.jpg" />
      <PEstatica n={9} src="/doc/pages/p9.jpg" />
    </>
  );
}
