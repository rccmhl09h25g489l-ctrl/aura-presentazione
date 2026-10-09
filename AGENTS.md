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

- Keep presentation content in a central slide registry and render it through one 1920×1080 ScaledSlide in all preview contexts, so typography and proportions remain consistent.
- Keep unverified implementation details visibly separate from confirmed source material, so the school presentation never misrepresents the student's work.
- Use the index route search parameter for the active slide and a print flag for page-per-slide output, so sharing and PDF printing preserve the deck.
- Pre-optimize the presentation's shared UI dependencies with the template's React entries, so lazy dependency discovery does not replace the React module graph in an active preview.
