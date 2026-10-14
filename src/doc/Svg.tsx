// Vetores extraídos dos PDFs (logo, títulos em fontes pagas, ícones). `fill="currentColor"`
// nos que são recoloríveis — a cor vem do CSS `color` do contêiner.
import type { CSSProperties } from "react";

import btnGreen from "./assets/svg/btn-green.svg?raw";
import logoTagline from "./assets/svg/logo-tagline.svg?raw";
import logoWordmark from "./assets/svg/logo-wordmark.svg?raw";
import obIconBox from "./assets/svg/ob-icon-box.svg?raw";
import obIconCheck from "./assets/svg/ob-icon-check.svg?raw";
import obIconGlass from "./assets/svg/ob-icon-glass.svg?raw";
import obIconShield from "./assets/svg/ob-icon-shield.svg?raw";
import obTab from "./assets/svg/ob-tab.svg?raw";
import obTxtObservacoes from "./assets/svg/ob-txt-observacoes.svg?raw";
import obTxtOpcao1 from "./assets/svg/ob-txt-opcao-1.svg?raw";
import obTxtOpcao2 from "./assets/svg/ob-txt-opcao-2.svg?raw";
import obTxtOpcao3 from "./assets/svg/ob-txt-opcao-3.svg?raw";
import obTxtOpcao4 from "./assets/svg/ob-txt-opcao-4.svg?raw";
import obTxtResponsabilidade from "./assets/svg/ob-txt-responsabilidade.svg?raw";
import { pt } from "./layout";

export const SVGS = {
  "btn-green": btnGreen,
  "logo-tagline": logoTagline,
  "logo-wordmark": logoWordmark,
  "ob-icon-box": obIconBox,
  "ob-icon-check": obIconCheck,
  "ob-icon-glass": obIconGlass,
  "ob-icon-shield": obIconShield,
  "ob-tab": obTab,
  "ob-txt-observacoes": obTxtObservacoes,
  "ob-txt-opcao-1": obTxtOpcao1,
  "ob-txt-opcao-2": obTxtOpcao2,
  "ob-txt-opcao-3": obTxtOpcao3,
  "ob-txt-opcao-4": obTxtOpcao4,
  "ob-txt-responsabilidade": obTxtResponsabilidade,
} as const;
export type SvgName = keyof typeof SVGS;

const cache = new Map<SvgName, string>();
function markup(name: SvgName): string {
  let m = cache.get(name);
  if (!m) {
    // o SVG preenche o contêiner; o viewBox mantém a proporção
    m = SVGS[name].replace(
      "<svg ",
      '<svg style="display:block;width:100%;height:100%" preserveAspectRatio="none" ',
    );
    cache.set(name, m);
  }
  return m;
}

export function Svg({
  name,
  x,
  y,
  w,
  h,
  color,
  style,
}: {
  name: SvgName;
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: pt(x),
        top: pt(y),
        width: pt(w),
        height: pt(h),
        color,
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: markup(name) }}
    />
  );
}
