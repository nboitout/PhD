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

`note-1.jpg`, `note-2.jpg` and `note-3.jpg` are the three prints shown in the
carousel beside the note, in that order: at work on the thesis, then with Thierry
Delahaut at Porquerolles in 2001, then at work again among the printouts. The
Porquerolles print is second rather than last because it is the one a visitor
comes to the carousel for.

The numbering is the slide order — `note-N` is slide N — so changing the order
means renaming the files, not reordering the markup.

All three are scaled so the long edge is 1600px and re-encoded at quality 82.
`note-1` and `note-3` are otherwise untouched. `note-2` is cropped to the print
itself — the hand holding it and the table behind it were in the original frame,
which the other two did not have.

The full-resolution originals are under `source/photos/`, outside the deployed
directory, named `note-N-original.jpeg` for the slide each one feeds. They were
uploaded under names that did not match their contents, which cost three rounds
of upload to discover; naming them for their slides is what stops that
recurring.

The frame is a fixed 4:3 and each photograph is fitted inside it whole, on the
warm paper ground, rather than cropped to fill — `note-1` is a portrait print and
cropping cost it both the head and the feet.

To change one, overwrite the file here and put the original alongside the others.
A slide whose file is missing removes itself, and if none are present the
carousel disappears from the page rather than showing broken images. Each `src`
is tried as `.jpg`, then `.jpeg`, then `.png`.
