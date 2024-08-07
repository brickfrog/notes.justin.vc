---
title: "About (Notes)"
author: ["Justin"]
date: 2024-07-19T19:23:00-04:00
lastmod: 2024-08-07T06:39:53-04:00
draft: false
creator: "Emacs 29.4 (Org mode 9.8 + ox-hugo)"
---

<div class="outline-1 jvc">

## Index {#index}

<div class="outline-2 jvc">

### About {#about}

Ideally this will be a compilation of various design choices I've made (or
explanations on utility of certain things.)

<div class="outline-3 jvc">

#### The How/Why {#the-how-why}

<div class="outline-4 jvc">

##### Process {#process}

I think my main idea is to primarily use org-roam daily notes - fill out what
I'm doing (at least in regard to learning/reading, etc.) - then use that as a
link to bigger notes. Like, say, if I want a long essay on a thing, mention it
in the daily note -&gt; create separate note for it with more details

</div>

</div>

<div class="outline-3 jvc">

#### Design {#design}

More the aesthetics of things.

<div class="outline-4 jvc">

##### Initial Design {#initial-design}

So, the initial design really was meant to mirror my (doom) emacs config. Same
colors, same headers, etc. - in some component design I'm inspired by both
<https:gwern.net> and uh... there's another person, I forget. I thought I followed
them on github, maybe not. Karli something. Not the model who spammed Wix
websites.

Also I've moved away from using it, but a big inspiration was [TiddlyWiki — a
non-linear personal web notebook](https://tiddlywiki.com) and [sobjornstad (Soren Bjornstad)](https://github.com/sobjornstad)

</div>

<div class="outline-4 jvc">

##### Footnote/Reference Design {#footnote-reference-design}

<div class="outline-5 jvc">

###### <span class="org-priority priority-B">[#B]</span>Citar and Zotero {#citar-and-zotero}

-   (Mostly) out-of-the-box via: [Org Cite Citations — ox-hugo - Org to Hugo exporter](https://ox-hugo.scripter.co/doc/org-cite-citations/)
-   `citar-insert-citation` to insert citations using the bibkey associated with

Zotero.

```org
#+end_#+cite_export: csl ieee.csl
```

Using the above in the front-matter, where (if I recall) it's one of the default Zotero CSL
files. I have no reason for specifically choosing the style other than it
looked good and some of the other ones did not seem to work out-of-the-box with bibtex.

</div>

</div>

<div class="outline-4 jvc">

##### Frontmatter {#frontmatter}

Similar to initial design, I just kind of wanted it to look like the header in a
org-mode file combined with some of Gwern's topics. I don't know of the utility
of it, but I'd like to somehow combine it with LLM output just for funsies.

Something like llm_importance: `how important do you think this topic is` or
something dumb like that.

</div>

<div class="outline-4 jvc">

##### Usage of org-priority {#usage-of-org-priority}

I couldn't get ox-hugo to export org-priority properly, I noticed something was
missing in the elisp but I'm still unsure if it was due to my end or not. I
filed an issue and edited the code to get it to work for now.

So, for now, I have each time a priority is assigned, it gets attached as a
`<span>` to the associated header and its meaning will be in context. If
associated with a `TODO` then it means priority of said task and if it's used in
isolation in context of a resource then it's level of importance (to me). An
example would be like thus:

<div class="outline-5 jvc">

###### <span class="org-priority priority-B">[#B]</span><span class="org-todo todo TODO">TODO</span> Do a thing! {#do-a-thing}


</div>

<div class="outline-5 jvc">

###### <span class="org-priority priority-A">[#A]</span>Crime and Punishment {#crime-and-punishment}


</div>

</div>

<div class="outline-4 jvc">

##### Sidenotes {#sidenotes}

Not necessarily inspired by anyone, maybe the whole original marginalia idea? I
see it quite a bit in sites and I don't know if it's just me, but whenever
there's a humorous aside I like to read it in context vs. scrolling all the way
down.[^fn:1]

Right now I have them both visible but I'd like to maybe refine the aesthetics
of it more. It's a little bit cumbersome now.

</div>

<div class="outline-4 jvc">

##### License {#license}

Everything original found herein is available under free/libre and copyleft terms, unless an exception is made explicit in context.

All original text is available under the [Legal Code - Attribution-ShareAlike 4.0
International - Creative Commons](https://creativecommons.org/licenses/by-sa/4.0/legalcode). All original inline code (i.e. scripts, etc.),
as well as any documentation, is available under the terms of the [The GNU
General Public License v3.0 - GNU Project - Free Software Foundation](https://www.gnu.org/licenses/gpl-3.0.html) or later.

</div>

</div>

</div>

<div class="outline-2 jvc">

### TODOs {#todos}

<div class="outline-3 jvc">

#### Components {#components}

<div class="outline-4 jvc">

##### <span class="org-todo todo TODO">TODO</span> Body {#body}

-   [X] Anchors seem to affix TODO's, etc. to the #
    -   Had to modify the rehype slugger for gfm
        -   I might've caused it to do it to non-TODOs, unsure if this happened before.
            -   [ ] Maybe a regression?
-   [X] priority doesn't seem to export

</div>

<div class="outline-4 jvc">

##### <span class="org-todo todo TODO">TODO</span> Explorer {#explorer}

-   [ ] Get really fancy with the map, maybe different folders based on
    categories or something

</div>

<div class="outline-4 jvc">

##### <span class="org-todo todo TODO">TODO</span> 'Frontmatter' {#frontmatter}

-   [ ] Conditionally remove the search stuff when on an index/tag page

</div>

<div class="outline-4 jvc">

##### <span class="org-priority priority-C">[#C]</span><span class="org-todo todo TODO">TODO</span> Graph {#graph}

-   [ ] Low priority, but add categories into the graph

</div>

<div class="outline-4 jvc">

##### <span class="org-todo todo TODO">TODO</span> Linklist {#linklist}

-   [ ] Maybe remove Dailies from the random button?

</div>

<div class="outline-4 jvc">

##### <span class="org-todo todo TODO">TODO</span> Popover {#popover}

-   [ ] Crib some design from Gwern - a la persistence + popovers for
    non-internal content
-   [ ] The CSS gets weird and headers become janky, but only sometimes

</div>

<div class="outline-4 jvc">

##### <span class="org-todo todo TODO">TODO</span> Sidenote / Footnote {#sidenote-footnote}

-   [ ] If in same viewport, change visibility of sidenotes as to not duplicate
-   [ ] Figure more elegant way of having ToC un-minimized + sidenotes?
-   [ ] Figure out how to swap references and footnotes? Maybe emacs side
    -   low priority, couldn't figure it out since they export differently
-   [ ] Figure out what I want to do in situations where I have really long
    footnotes and they overlap placement.

</div>

</div>

<div class="outline-3 jvc">

#### <span class="org-todo todo TODO">TODO</span> CSS Fixes {#css-fixes}

-   [ ] Codeblock indentation

</div>

<div class="outline-3 jvc">

#### <span class="org-todo todo IDEA">IDEA</span> New Features {#new-features}

-   [ ] Comments? Giscus was added on mainline, not sure if too useful - maybe
    for specific notes only?
-   [ ] Menu sidebar for mobile (hamburger menu, etc.)
-   [ ] LLM integration with Frontmatter - this is more of an emacs side thing
    but I'll make a note of it here
-   [ ] Button in LinkList that increases/decreases fonts - lets you change it?

</div>

</div>

</div>

[^fn:1]: Howdy
