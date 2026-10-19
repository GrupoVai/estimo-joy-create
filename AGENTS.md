<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Printing from the Chrome extension popup goes through `src/doc/extensao.ts` (postMessage to the extension, which opens its own `imprimir.html` tab embedding `/imprimir`); the action popup can't show the print dialog and its iframe storage is partitioned from normal tabs. Normal-tab printing keeps using localStorage + `window.open`.
