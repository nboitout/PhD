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

`note-1.jpg` and `note-2.jpg` are the two photographs shown in the carousel beside
“A personal note, 23 years later”. They are the supplied prints, scaled so the
long edge is 1600px and re-encoded at quality 82; nothing is cropped. The
full-resolution originals are kept under `source/photos/`, outside the deployed
directory, exactly as the cover is.

The frame is a fixed 4:3 and each photograph is fitted inside it whole, on the
warm paper ground, rather than cropped to fill — `note-1` is a portrait print and
cropping cost it both the head and the feet.

### Still to do

* **`note-1` has no caption.** Its `data-caption` in `site/index.html` is empty,
  because nothing was supplied about where or when it was taken. Write the caption
  there and it appears under the photograph.
* **There is no third photograph.** The file uploaded as “Photo 3-3” is a
  byte-for-byte duplicate of “Photo 2-3”. The third slide is left commented out in
  `site/index.html`: drop the real photograph in as `note-3.jpg`, uncomment the
  slide and fill in its `data-caption` and `alt`.
* **Check the caption on `note-2`.** It reads “With Thierry Delahaut ·
  Porquerolles, 2001 · CNRS, Groupe Économie et Physique”, which is the
  description supplied for it. Only one person is in frame, so the caption does
  not say which of the two it is, and neither does the `alt` text.

A slide whose file is missing removes itself, and if none are present the carousel
disappears from the page rather than showing broken images. Each `src` is tried as
`.jpg`, then `.jpeg`, then `.png`.
