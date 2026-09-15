# Assets

`cover.jpg` is the photograph of Nicolas Boitout's own printed copy of the
dissertation, shown at the top of the page and linked from there at full size.

It is the supplied photograph, cropped only to remove the dark strip down the
left edge of the original frame and scaled so its long edge is 1600px. The paper,
the shadow and the angle it was shot at are untouched. The full-resolution
original is kept at `source/cover-original.jpeg` in the repository root, outside
the deployed directory.

To replace it, overwrite `cover.jpg` (or add `cover.png`, which the page tries if
the JPEG is missing). Nothing else needs to change.

## The photographs in the personal note

`note-1`, `note-2` and `note-3` are the three photographs shown in the carousel
beside “A personal note, 23 years later”. They are **not in the repository yet** —
drop them in here and they appear.

Each one is tried as `.jpg`, then `.jpeg`, then `.png`, so the extension does not
matter. A slide whose file is missing removes itself, and if none of the three
are present the carousel disappears from the page rather than showing broken
images. Nothing else needs to change.

Two things are still to be filled in, in `site/index.html`:

* `note-1` is captioned “With Thierry Delahaut · Porquerolles, 2001 · CNRS,
  Groupe Économie et Physique”.
* `note-2` and `note-3` carry an empty `data-caption` and a placeholder `alt`.
  Write the real caption into `data-caption` and the real description into `alt`.

Landscape frames suit the carousel best: the slide is 270px tall and the image
is cropped to fill it, so a portrait photograph loses its top and bottom.
