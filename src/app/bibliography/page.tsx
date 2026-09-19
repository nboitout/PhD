import type { Metadata } from 'next';
import BibliographyBrowser from '@/components/BibliographyBrowser';
import { references } from '@/lib/bibliography';

/**
 * The bibliography, as its own room.
 *
 * 353 entries do not belong in the middle of the hub — the hub is three running
 * models, and a reference list scrolled past is a reference list nobody reads.
 * Here it is the whole page, searchable, with every DOI that exists resolved.
 */

const total = references.length;
const withDoi = references.filter((ref) => ref.doi).length;
const years = references.map((ref) => Number(ref.y.slice(0, 4)));
const span = `${Math.min(...years)} → ${Math.max(...years)}`;

export const metadata: Metadata = {
  title: 'Bibliography — Nicolas Boitout, Exchange Rate Dynamics',
  description:
    `The ${total} references behind a 2004 doctoral dissertation on exchange rate dynamics and ` +
    'currency crises — the manuscript’s own bibliography, restandardized to APA 7th, with working ' +
    `papers traced to their final publications and ${withDoi} DOIs resolved.`,
  openGraph: {
    type: 'website',
    title: 'Bibliography — Exchange Rate Dynamics',
    description: `${total} references, searchable, with ${withDoi} DOIs resolved.`,
  },
};

export default function Bibliography() {
  return (
    <>
      <a className="skip" href="#library">Skip to the references</a>

      <header className="masthead">
        <a className="brand" href="/">
          <svg viewBox="0 0 32 32" aria-hidden="true" width="22" height="22">
            <path d="M3 23h3.5v-5h5v8h4.5V13h4v7h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          <b>Nicolas Boitout</b>
          <span className="brand-sep" />
          <span className="brand-tail">Doctoral dissertation</span>
        </a>
        <nav aria-label="Sections">
          <a href="/#labs">Laboratories</a>
          <a href="/#spine">Mechanism</a>
          <a href="/#note">Note</a>
          <a href="/#defence">Defence</a>
          <span className="era">Bibliography</span>
        </nav>
      </header>

      <main id="top">

        {/* ════════════════════ THE LIBRARY'S FRONT MATTER ════════════════════
            What the list is, where it came from, and what was changed — said
            once, plainly, before the list itself. A bibliography that has been
            edited must declare the edit.
            ──────────────────────────────────────────────────────────────── */}
        <section className="bib-head" aria-labelledby="bib-h">
          <p className="eyebrow">The dissertation&apos;s own reference list · modernized</p>
          <h1 id="bib-h">Bibliography</h1>
          <p className="bib-lede">
            Every work cited in <cite>Modélisation de la dynamique des taux de change avec
            application aux marchés émergents</cite> — the list as it was set in the printed copy
            of 2004, restandardized and repaired. Working papers that were later published carry
            their final journal and volume; where a DOI now exists, it resolves.
          </p>

          <dl className="bib-facts">
            <div>
              <dt>References</dt>
              <dd>{total}</dd>
            </div>
            <div>
              <dt>DOIs resolved</dt>
              <dd>{withDoi}</dd>
            </div>
            <div>
              <dt>Span</dt>
              <dd>{span}</dd>
            </div>
            <div>
              <dt>Standard</dt>
              <dd>APA 7th</dd>
            </div>
          </dl>

          <details className="bib-notes">
            <summary>What was changed, and why</summary>
            <ul>
              <li>
                <b>Standardization.</b> Article titles are set in sentence case and journal names
                in title case, as APA 7th sets them; books and conference papers follow the same
                rules for their own kind.
              </li>
              <li>
                <b>Working papers resolved.</b> Papers that circulated as working papers,
                discussion papers or preprints before 2003 and were subsequently published carry
                their final publication details and DOI. Where the original circulation date
                matters to the argument, it is noted in the entry.
              </li>
              <li>
                <b>Mutilated entries reconstructed.</b> The printed copy was damaged on its
                original pages 254–256 and 274–275. Corrupted journal titles and misspelt author
                names were corrected — <i>Organizational Behavior and Human Decision Processes</i>{' '}
                for Anderson &amp; Sunder, <i>Econometrica</i> for Andrews, and the spellings of
                Wooldridge, Shleifer, Kokoszka, Teräsvirta and Harsanyi — and the truncated works
                of Teyssière, Todorovic, Vitale, Vlaar &amp; Palm, F. A. Wang, J. Wang and
                Watanabe were restored in full.
              </li>
              <li>
                <b>Nothing was added.</b> No work absent from the 2004 manuscript has been
                introduced, and none has been dropped. The list is the dissertation&apos;s, not a
                reading list assembled afterwards.
              </li>
            </ul>
          </details>
        </section>

        {/* ════════════════════════ THE LIBRARY ════════════════════════
            Search first, alphabet second. The numbering is stable and each
            entry is its own anchor, so a reference can be linked to directly.
            ────────────────────────────────────────────────────────────── */}
        <section id="library" className="bib" aria-label="The references">
          <BibliographyBrowser />
        </section>

      </main>

      <footer>
        <div>
          <p>
            Numbering is alphabetical by first author and stable: <span className="mono">#41</span>{' '}
            is Boitout &amp; Ureche-Rangau (2004) here and will stay so. Every entry links to its
            DOI where one exists; the {total - withDoi} that do not are working papers, conference papers and
            unpublished manuscripts, cited as the manuscript cited them.
          </p>
          <p className="colophon">
            <span>© Nicolas Boitout</span>
            <a href="/">The dissertation</a>
            <a href="https://github.com/nboitout/PhD">Source of this page</a>
          </p>
        </div>
      </footer>
    </>
  );
}
