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

Three photographs from the thesis years, shown as a carousel beside the note.
`note-1.jpg` and `note-2.jpg` are Nicolas Boitout alone at work on the research.
They are the supplied prints, scaled so the long edge is 1600px and re-encoded at
quality 82; nothing is cropped. The full-resolution originals are kept under
`source/photos/`, outside the deployed directory, exactly as the cover is.

The frame is a fixed 4:3 and each photograph is fitted inside it whole, on the
warm paper ground, rather than cropped to fill — `note-1` is a portrait print and
cropping cost it both the head and the feet.

### Still to do: the third photograph

The photograph with Thierry Delahaut has not arrived. The file uploaded as
“Photo 3-3” is a byte-for-byte duplicate of “Photo 2-3”, and “Photo 2-3” itself is
one of the two solo photographs despite the name it was uploaded under — so
neither of the files under `source/photos/` is the Delahaut one.

Its slide is already in `site/index.html`, captioned “With Thierry Delahaut ·
Porquerolles, 2001 · CNRS, Groupe Économie et Physique”. **Dropping the file in
here as `note-3.jpg` is the whole of what remains** — no markup to edit. Until
then the slide removes itself and the carousel shows two photographs.

A slide whose file is missing removes itself, and if none are present the carousel
disappears from the page rather than showing broken images. Each `src` is tried as
`.jpg`, then `.jpeg`, then `.png`.
