'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { haystack, references, renderSegments, type Reference } from '@/lib/bibliography';

/**
 * The 353 references, as a list you can search rather than a list you scroll.
 *
 * Everything is rendered on the server too: the filter narrows markup that is
 * already in the page, so the whole library is readable — and indexable — with
 * JavaScript off. The alphabet rail is plain anchors for the same reason.
 */

/** Fold accents away, so "Orlean" finds Orléan and "Terasvirta" finds Teräsvirta. */
function fold(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/** One index row per entry, built once: the folded text the search box reads. */
const index: { ref: Reference; find: string }[] = references.map((ref) => ({
  ref,
  find: fold(haystack(ref)),
}));

const letters: string[] = [...new Set(references.map((ref) => ref.s[0].toUpperCase()))].sort();

function Entry({ ref }: { ref: Reference }) {
  return (
    <li className="ref" id={`ref-${ref.n}`}>
      <a className="ref-n" href={`#ref-${ref.n}`} aria-label={`Reference ${ref.n}`}>
        {String(ref.n).padStart(3, '0')}
      </a>
      <p className="ref-body">
        <span className="ref-a">{ref.a}</span> <span className="ref-y">({ref.y}).</span>{' '}
        {renderSegments(ref.r).map((seg, i) => (seg.em ? <em key={i}>{seg.t}</em> : <span key={i}>{seg.t}</span>))}
        {ref.doi && (
          <>
            {' '}
            <a className="ref-doi" href={ref.doi} rel="noopener noreferrer" target="_blank">
              {ref.doi.replace('https://doi.org/', 'doi:').replace(/^https?:\/\//, '')}
            </a>
          </>
        )}
      </p>
    </li>
  );
}

export default function BibliographyBrowser() {
  const [query, setQuery] = useState('');
  /* The list is long enough that typing would stutter if every keystroke blocked
     on re-rendering it; the input stays live and the list catches up. */
  const deferred = useDeferredValue(query);

  const groups = useMemo(() => {
    const needles = fold(deferred).split(/\s+/).filter(Boolean);
    const matches = needles.length
      ? index.filter(({ find }) => needles.every((n) => find.includes(n)))
      : index;
    const byLetter = new Map<string, Reference[]>();
    for (const { ref } of matches) {
      const letter = ref.s[0].toUpperCase();
      const bucket = byLetter.get(letter);
      if (bucket) bucket.push(ref);
      else byLetter.set(letter, [ref]);
    }
    return { byLetter, total: matches.length };
  }, [deferred]);

  const searching = deferred.trim().length > 0;

  return (
    <>
      <div className="bib-tools">
        <div className="bib-search">
          <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M16.5 16.5 21 21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search author, title, journal or year"
            aria-label="Search the bibliography"
            autoComplete="off"
          />
          {query && (
            <button type="button" className="bib-clear" onClick={() => setQuery('')}>
              Clear
            </button>
          )}
        </div>
        <p className="bib-count" role="status">
          <b>{groups.total}</b> {groups.total === 1 ? 'reference' : 'references'}
          {searching && <> matching &ldquo;{deferred.trim()}&rdquo;</>}
        </p>
      </div>

      <nav className="bib-rail" aria-label="Jump to a letter">
        {letters.map((letter) => {
          const count = groups.byLetter.get(letter)?.length ?? 0;
          return count ? (
            <a key={letter} href={`#letter-${letter}`}>{letter}</a>
          ) : (
            <span key={letter} aria-hidden="true">{letter}</span>
          );
        })}
      </nav>

      {groups.total === 0 ? (
        <p className="bib-empty">
          Nothing matches that. The library is alphabetical by first author, so a surname is the
          surest way in — try <button type="button" onClick={() => setQuery('multifractal')}>multifractal</button>,{' '}
          <button type="button" onClick={() => setQuery('Mandelbrot')}>Mandelbrot</button> or{' '}
          <button type="button" onClick={() => setQuery('Econometrica')}>Econometrica</button>.
        </p>
      ) : (
        letters.map((letter) => {
          const entries = groups.byLetter.get(letter);
          if (!entries) return null;
          return (
            <section className="bib-letter" key={letter} id={`letter-${letter}`} aria-label={`Authors beginning with ${letter}`}>
              <h2 aria-hidden="true">{letter}</h2>
              <ol className="bib-list">
                {entries.map((ref) => (
                  <Entry key={ref.n} ref={ref} />
                ))}
              </ol>
            </section>
          );
        })
      )}
    </>
  );
}
