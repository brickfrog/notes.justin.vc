---
title: "About (Notes)"
author: ["Justin"]
date: 2024-07-19T19:23:00-04:00
lastmod: 2024-08-01T03:31:27-04:00
draft: false
creator: "Emacs 29.4 (Org mode 9.8 + ox-hugo)"
---

<div class="outline-1 jvc">

## About {#about}

Currently a placeholder. Want to put site design notes here.

<div class="outline-2 jvc">

### Footnote/Reference Design {#footnote-reference-design}

<div class="outline-3 jvc">

#### <span class="org-priority priority-B">[#B]</span>Citar and Zotero {#citar-and-zotero}

-   (Mostly) out-of-the-box via: [Org Cite Citations — ox-hugo - Org to Hugo exporter](https://ox-hugo.scripter.co/doc/org-cite-citations/)
-   `citar-insert-citation` to insert citations using the bibkey associated with

Zotero.

```org
#+end_#+cite_export: csl chicago-author-date.csl
```

Using the above in the front-matter, where (if I recall) it's one of the default Zotero CSL
files. I have no reason for specifically choosing Chicago style other than it
looked good and some of the other ones did not seem to work out-of-the-box with bibtex.

</div>

</div>

</div>

<div class="outline-1 jvc">

## Design {#design}

<div class="outline-2 jvc">

### Components {#components}

<div class="outline-3 jvc">

#### <span class="org-todo todo TODO">TODO</span> Body {#body}

-   [X] Anchors seem to affix TODO's, etc. to the #
    -   Had to modify the rehype slugger for gfm
-   [X] priority doesn't seem to export

</div>

<div class="outline-3 jvc">

#### <span class="org-todo todo TODO">TODO</span> Explorer <code>[0/1]</code> {#explorer}

-   [ ] Get really fancy with the map, maybe different folders based on
    categories or something

</div>

<div class="outline-3 jvc">

#### <span class="org-todo todo TODO">TODO</span> 'Frontmatter' {#frontmatter}

-   [ ] Conditionally remove the search stuff when on an index/tag page

</div>

<div class="outline-3 jvc">

#### <span class="org-todo todo TODO">TODO</span> Linklist <code>[0/1]</code> {#linklist}

-   [ ] Maybe remove Dailies from the random button?

</div>

<div class="outline-3 jvc">

#### <span class="org-todo todo TODO">TODO</span> Popover <code>[0/1]</code> {#popover}

-   [ ] Crib some design from Gwern - a la persistence + popovers for
    non-internal content

</div>

<div class="outline-3 jvc">

#### <span class="org-todo todo TODO">TODO</span> Sidenote / Footnote <code>[0/3]</code> {#sidenote-footnote}

-   [ ] If in same viewport, change visibility of sidenotes as to not duplicate
-   [ ] Figure more elegant way of having ToC un-minimized + sidenotes?
-   [ ] Figure out how to swap references and footnotes? Maybe emacs side

</div>

</div>

<div class="outline-2 jvc">

### <span class="org-todo todo TODO">TODO</span> CSS Fixes <code>[0/1]</code> {#css-fixes}

-   [ ] Codeblock indentation

</div>

<div class="outline-2 jvc">

### <span class="org-todo todo IDEA">IDEA</span> New Features <code>[0/4]</code> {#new-features}

-   [ ] Comments? Giscus was added on mainline, not sure if too useful - maybe
    for specific notes only?
-   [ ] Menu sidebar for mobile (hamburger menu, etc.)
-   [ ] LLM integration with Frontmatter - this is more of an emacs side thing
    but I'll make a note of it here
-   [ ] Button in LinkList that increases/decreases fonts - lets you change it?

</div>

</div>
