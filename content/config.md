---
title: "Doom Emacs Configuration"
author: ["Justin"]
date: 2023-10-01T00:00:00-04:00
lastmod: 2024-08-15T10:30:25-04:00
draft: false
creator: "Emacs 29.4 (Org mode 9.8 + ox-hugo)"
---

> A Modest Proposal: That the Labours of Nine Thousand Lines of Emacs Configuration Shall Render All Other Text Editors Obsolete and Provide a Most Nutritious Meal for Gentlemen Programmers

<div class="outline-1 jvc">

## Intro {#intro}

Howdy. This is my personal doom emacs config - I lifted quite a bit from
tecosaur's [Doom Emacs Configuration](https://tecosaur.github.io/emacs-config/config.html) - but there's a lot of additions that I use
for publishing / org-roam / elfeed, etc. and I culled some of the more generic
explanatory things / LaTex stuff since i don't really do much publishing.

</div>

<div class="outline-1 jvc">

## Rudimentary configuration {#rudimentary-configuration}

Make this file run (slightly) faster with lexical binding (see [this blog post](https://nullprogram.com/blog/2016/12/22/)
for more info).

```emacs-lisp
;;; config.el -*- lexical-binding: t; -*-
```

```shell
#!/usr/bin/env bash
```

<div class="outline-2 jvc">

### Personal Information {#personal-information}

It's useful to have some basic personal information.[^fn:1]

```emacs-lisp
(setq user-full-name "Justin"
      user-mail-address "justin@justin.vc"
      calendar-location-name "Villa Hills, KY"
      calendar-time-zone-rule "EST"
      calendar-standard-time-zone-name "EST"
      calendar-daylight-time-zone-name "EDT")
```

Apparently this is used by `GPG`, and all sorts of other things.

Speaking of `GPG`, I want to use `~/.authinfo.gpg` instead of the default in
`~/.emacs.d`. Why? Because my home directory is already cluttered, so this won't
make a difference, and I don't want to accidentally purge this file (I have done
<span class="inline-src language-shell" data-lang="shell">`rm -rf~/.emac.d~ before`</span>. I also want to cache as much as possible, as
my home machine is pretty safe, and my laptop is shutdown a lot.

```emacs-lisp
(setq auth-sources '("~/.authinfo.gpg")
      auth-source-cache-expiry nil) ; default is 7200 (2h)
```

<div class="outline-3 jvc">

#### Diary functions {#diary-functions}

Some useful things for the diary. This allows sunrise and sunset to be put into
separate times for agenda viewing.

```emacs-lisp
(setq diary-file "~/.org/diary")
```

```emacs-lisp
(defun bv-calendar-dst-starts (year) "Daylight Savings Start"
  (calendar-nth-named-day -1 0 3 year))


(defun bv-calendar-dst-ends (year) "Daylight Savings End"
  (calendar-nth-named-day -1 0 10 year))

(setq calendar-daylight-savings-starts '(bv-calendar-dst-starts year))
(setq calendar-daylight-savings-ends '(bv-calendar-dst-ends year))
```

</div>

</div>

<div class="outline-2 jvc">

### Better defaults {#better-defaults}

<div class="outline-3 jvc">

#### Simple settings {#simple-settings}

Browsing the web and seeing [angrybacon/dotemacs](https://github.com/angrybacon/dotemacs/blob/master/dotemacs.org#use-better-defaults) and comparing with the values
shown by `SPC h v` and selecting what I thought looks good, I've ended up adding
the following:

```emacs-lisp

(setq exec-path (append exec-path '("~/.local/bin/")))

(setq-default
 delete-by-moving-to-trash t                      ; Delete files to trash
 window-combination-resize t                      ; take new window space from all other windows (not just current)
 x-stretch-cursor t)                              ; Stretch cursor to the glyph width

(setq undo-limit 80000000                         ; Raise undo-limit to 80Mb
      evil-want-fine-undo t                       ; By default while in insert all changes are one big blob. Be more granular
      auto-save-default t                         ; Nobody likes to lose work, I certainly don't
      show-paren-mode t                           ; Show the matching parenthesis - something is disabling to being explicit
      truncate-string-ellipsis "…"                ; Unicode ellispis are nicer than "...", and also save /precious/ space
      password-cache-expiry nil                   ; I can trust my computers ... can't I?
      ;; scroll-preserve-screen-position 'always     ; Don't have `point' jump around
      scroll-margin 2)                            ; It's nice to maintain a little margin

(display-time-mode 1)                             ; Enable time in the mode-line

(global-subword-mode 1)                           ; Iterate through CamelCase words

(global-set-key
        [remap dabbrev-expand] 'hippie-expand)    ; Replace dabbrev with hippie-expand
```

</div>

<div class="outline-3 jvc">

#### Frame sizing {#frame-sizing}

It's nice to control the size of new frames, when launching Emacs that can be
done with <span class="inline-src language-shell" data-lang="shell">`emacs -geometry 160x48`</span>. After the font size adjustment
during initialization this works out to be `102x31`.

Thanks to hotkeys, it's easy for me to expand a frame to half/full-screen, so it
makes sense to be conservative with the sizing of new frames.

Then, for creating new frames within the same Emacs instance, we'll just set the
default to be something roughly 80% of that size.

```emacs-lisp
(add-to-list 'default-frame-alist '(height . 24))
(add-to-list 'default-frame-alist '(width . 80))
```

</div>

<div class="outline-3 jvc">

#### Auto-customization's {#auto-customization-s}

By default changes made via a customization interface are added to `init.el`.
I prefer the idea of using a separate file for this. We just need to change a
setting, and load it if it exists.

```emacs-lisp
(setq-default custom-file (expand-file-name ".custom.el" doom-private-dir))
(when (file-exists-p custom-file)
  (load custom-file))
```

</div>

<div class="outline-3 jvc">

#### Windows {#windows}

I find it rather handy to be asked which buffer I want to see after splitting
the window. Let's make that happen.

First, we'll enter the new window

```emacs-lisp
(setq evil-vsplit-window-right t
      evil-split-window-below t)
```

Then, we'll pull up a buffer prompt.

```emacs-lisp
(defadvice! prompt-for-buffer (&rest _)
  :after '(evil-window-split evil-window-vsplit)
  (consult-buffer))
```

Window rotation is nice, and can be found under `SPC w r` and `SPC w R`.
_Layout_ rotation is also nice though. Let's stash this under `SPC w SPC`, inspired
by Tmux's use of `C-b SPC` to rotate windows.

We could also do with adding the missing arrow-key variants of the window
navigation/swapping commands.

```emacs-lisp
(map! :map evil-window-map
      "SPC" #'rotate-layout
      ;; Navigation
      "<left>"     #'evil-window-left
      "<down>"     #'evil-window-down
      "<up>"       #'evil-window-up
      "<right>"    #'evil-window-right
      ;; Swapping windows
      "C-<left>"       #'+evil/window-move-left
      "C-<down>"       #'+evil/window-move-down
      "C-<up>"         #'+evil/window-move-up
      "C-<right>"      #'+evil/window-move-right)
```

</div>

<div class="outline-3 jvc">

#### Buffer defaults {#buffer-defaults}

I'd much rather have my new buffers in org-mode~ than `fundamental-mode`, hence

```emacs-lisp
;; (setq-default major-mode 'org-mode)
```

For some reason this + the mixed pitch hook causes issues with hydra and so I'll
just need to resort to `SPC b o` for now.

</div>

</div>

<div class="outline-2 jvc">

### Doom configuration {#doom-configuration}

<div class="outline-3 jvc">

#### Modules {#modules}

Doom has this lovely _modular configuration base_ that takes a lot of work out of
configuring Emacs. Each module (when enabled) can provide a list of packages to
install (on `doom sync`) and configuration to be applied. The modules can also
have flags applied to tweak their behavior.

<a id="code-snippet--init.el"></a>
```emacs-lisp { collapsed="t" }
;;; init.el -*- lexical-binding: t; -*-

;; This file controls what Doom modules are enabled and what order they load in.
;; Press 'K' on a module to view its documentation, and 'gd' to browse its directory.

(doom! :completion
       <<doom-completion>>

       :ui
       <<doom-ui>>

       :editor
       <<doom-editor>>

       :emacs
       <<doom-emacs>>

       :term
       <<doom-term>>

       :checkers
       <<doom-checkers>>

       :tools
       <<doom-tools>>

       :os
       <<doom-os>>

       :lang
       <<doom-lang>>

       :email
       <<doom-email>>

       :app
       <<doom-app>>

       :config
       <<doom-config>>
       )
```

<div class="outline-4 jvc">

##### Structure {#structure}

As you may have noticed by this point, this is a [literate](https://en.wikipedia.org/wiki/Literate_programming) configuration. Doom
has good support for this which we access though the `literate` module.

While we're in the <span class="inline-src language-elisp" data-lang="elisp">`:config`</span> section, we'll use Dooms nicer defaults,
along with the bindings and smart-parens behavior (the flags aren't documented,
but they exist).

<a id="code-snippet--doom-config"></a>
```emacs-lisp
literate
(default +bindings +smartparens)
```

</div>

<div class="outline-4 jvc">

##### Interface {#interface}

There's a lot that can be done to enhance Emacs' capabilities.
I reckon enabling half the modules Doom provides should do it.

<a id="code-snippet--doom-completion"></a>
```emacs-lisp
(company                     ; the ultimate code completion backend
 +childframe)                ; ... when your children are better than you
;;helm                       ; the *other* search engine for love and life
;;ido                        ; the other *other* search engine...
;; (ivy                      ; a search engine for love and life
;;  +icons                   ; ... icons are nice
;;  +prescient)              ; ... I know what I want(ed)
(vertico +icons)             ; the search engine of the future
```

<a id="code-snippet--doom-ui"></a>
```emacs-lisp
deft                         ; notational velocity for Emacs
doom                         ; what makes DOOM look the way it does
doom-dashboard               ; a nifty splash screen for Emacs
doom-quit                    ; DOOM quit-message prompts when you quit Emacs
(emoji +unicode)             ; 🙂
hl-todo                      ; highlight TODO/FIXME/NOTE/DEPRECATED/HACK/REVIEW
;;hydra                      ; quick documentation for related commands
;;indent-guides              ; highlighted indent columns, notoriously slow
(ligatures +extra)           ; ligatures and symbols to make your code pretty again
;;minimap                    ; show a map of the code on the side
modeline                     ; snazzy, Atom-inspired modeline, plus API
nav-flash                    ; blink the current line after jumping
;;neotree                    ; a project drawer, like NERDTree for vim
ophints                      ; highlight the region an operation acts on
(popup                       ; tame sudden yet inevitable temporary windows
 +all                        ; catch all popups that start with an asterix
 +defaults)                  ; default popup rules
;;(tabs                      ; an tab bar for Emacs
;;  +centaur-tabs)           ; ... with prettier tabs
treemacs                     ; a project drawer, like neotree but cooler
;;unicode                    ; extended unicode support for various languages
vc-gutter                    ; vcs diff in the fringe
vi-tilde-fringe              ; fringe tildes to mark beyond EOB
(window-select +numbers)     ; visually switch windows
workspaces                   ; tab emulation, persistence & separate workspaces
zen                          ; distraction-free coding or writing
```

<a id="code-snippet--doom-editor"></a>
```emacs-lisp
(evil +everywhere)           ; come to the dark side, we have cookies
file-templates               ; auto-snippets for empty files
fold                         ; (nigh) universal code folding
(format)                     ; automated prettiness
;;god                        ; run Emacs commands without modifier keys
;;lispy                      ; vim for lisp, for people who don't like vim
multiple-cursors             ; editing in many places at once
;;objed                      ; text object editing for the innocent
(parinfer +rust)             ; turn lisp into python, sort of
rotate-text                  ; cycle region at point between text candidates
snippets                     ; my elves. They type so I don't have to
word-wrap                  ; soft wrapping with language-aware indent
```

<a id="code-snippet--doom-emacs"></a>
```emacs-lisp
(dired +icons)               ; making dired pretty [functional]
electric                     ; smarter, keyword-based electric-indent
(ibuffer +icons)             ; interactive buffer management
undo                         ; persistent, smarter undo for your inevitable mistakes
vc                           ; version-control and Emacs, sitting in a tree
```

<a id="code-snippet--doom-term"></a>
```emacs-lisp
;;eshell                     ; the elisp shell that works everywhere
;;shell                      ; simple shell REPL for Emacs
;;term                       ; basic terminal emulator for Emacs
vterm                        ; the best terminal emulation in Emacs
```

<a id="code-snippet--doom-checkers"></a>
```emacs-lisp
syntax                       ; tasing you for every semicolon you forget
spell                        ; tasing you for misspelling mispelling
grammar                      ; tasing grammar mistake every you make
```

<a id="code-snippet--doom-tools"></a>
```emacs-lisp
ansible                      ; a crucible for infrastructure as code
biblio
;;debugger                   ; FIXME stepping through code, to help you add bugs
;;direnv                     ; be direct about your environment
docker                       ; port everything to containers
;;editorconfig               ; let someone else argue about tabs vs spaces
;;ein                        ; tame Jupyter notebooks with emacs
(eval +overlay)              ; run code, run (also, repls)
;;gist                       ; interacting with github gists
(lookup                      ; helps you navigate your code and documentation
 +dictionary                 ; dictionary/thesaurus is nice
 +docsets)                   ; ...or in Dash docsets locally
(lsp                          ; Language Server Protocol
 +peek)
;;macos                      ; MacOS-specific commands
(magit                       ; a git porcelain for Emacs
 +forge)                     ; interface with git forges
make                         ; run make tasks from Emacs
;;pass                       ; password manager for nerds
pdf                          ; pdf enhancements
;;prodigy                    ; FIXME managing external services & code builders
;;rgb                        ; creating color strings
;;taskrunner                 ; taskrunner for all your projects
;;terraform                  ; infrastructure as code
;;tmux                       ; an API for interacting with tmux
tree-sitter                  ; syntax and parsing, sitting in a tree...
upload                       ; map local to remote projects via ssh/ftp
```

<a id="code-snippet--doom-os"></a>
```emacs-lisp
tty                          ; improve the terminal Emacs experience
```

</div>

<div class="outline-4 jvc">

##### Language support {#language-support}

We can be rather liberal with enabling support for languages as the associated
packages/configuration are (usually) only loaded when first opening an
associated file.

<a id="code-snippet--doom-lang"></a>
```emacs-lisp
;;agda                       ; types of types of types of types...
;;beancount                  ; mind the GAAP
;;cc                         ; C/C++/Obj-C madness
;;clojure                    ; java with a lisp
;;common-lisp                ; if you've seen one lisp, you've seen them all
;;coq                        ; proofs-as-programs
;;crystal                    ; ruby at the speed of c
;;csharp                     ; unity, .NET, and mono shenanigans
data                         ; config/data formats
;;(dart +flutter)            ; paint ui and not much else
dhall                        ; JSON with FP sprinkles
;;elixir                     ; erlang done right
;;elm                        ; care for a cup of TEA?
emacs-lisp                   ; drown in parentheses
;;erlang                     ; an elegant language for a more civilized age
ess                          ; emacs speaks statistics
;;faust                      ; dsp, but you get to keep your soul
;;fsharp                     ; ML stands for Microsoft's Language
;;fstar                      ; (dependent) types and (monadic) effects and Z3
;;gdscript                   ; the language you waited for
;;(go +lsp)                  ; the hipster dialect
;;(haskell +lsp)             ; a language that's lazier than I am
hy                           ; readability of scheme w/ speed of python
;;idris                      ;
json                         ; At least it ain't XML
;;(java +meghanada)          ; the poster child for carpal tunnel syndrome
(javascript +lsp)            ; all(hope(abandon(ye(who(enter(here))))))
(julia +lsp)                 ; Python, R, and MATLAB in a blender
;;kotlin                     ; a better, slicker Java(Script)
(latex                       ; writing papers in Emacs has never been so fun
 +latexmk                    ; what else would you use?
 +cdlatex                    ; quick maths symbols
 +fold)                      ; fold the clutter away nicities
;;lean                       ; proof that mathematicians need help
;;factor                     ; for when scripts are stacked against you
;;ledger                     ; an accounting system in Emacs
lua                          ; one-based indices? one-based indices
markdown                     ; writing docs for people to ignore
;;nim                        ; python + lisp at the speed of c
;;nix                        ; I hereby declare "nix geht mehr!"
;;ocaml                      ; an objective camel
(org                         ; organize your plain life in plain text
 +dragndrop                  ; drag & drop files/images into org buffers
 +hugo                       ; use Emacs for hugo blogging
 +noter                      ; enhanced PDF notetaking
 +journal                    ; unleash your thoughts and dreams
 +jupyter                    ; ipython/jupyter support for babel
 +pandoc                     ; export-with-pandoc support
 +gnuplot                    ; who doesn't like pretty pictures
 ;;+pomodoro                 ; be fruitful with the tomato technique
 +present                    ; using org-mode for presentations
 +roam2)                     ; wander around notes
;;php                        ; perl's insecure younger brother
;;plantuml                   ; diagrams for confusing people more
;;purescript                 ; javascript, but functional
(python                      ; beautiful is better than ugly
 +lsp
 +pyright)
;;qt                         ; the 'cutest' gui framework ever
;;racket                     ; a DSL for DSLs
;;raku                       ; the artist formerly known as perl6
rest                         ; Emacs as a REST client
;;rst                        ; ReST in peace
;;(ruby +rails)              ; 1.step {|i| p "Ruby is #{i.even? ? 'love' : 'life'}"}
(rust +lsp)                  ; Fe2O3.unwrap().unwrap().unwrap().unwrap()
;;scala                      ; java, but good
scheme                       ; a fully conniving family of lisps
sh                           ; she sells {ba,z,fi}sh shells on the C xor
;;sml                        ; no, the /other/ ML
;;solidity                   ; do you need a blockchain? No.
;;swift                      ; who asked for emoji variables?
;;terra                      ; Earth and Moon in alignment for performance.
web                          ; the tubes
yaml                         ; JSON, but readable
zig                          ; C, but simpler
```

</div>

<div class="outline-4 jvc">

##### Everything in Emacs {#everything-in-emacs}

It's just too convenient being able to have everything in Emacs.
I couldn't resist the Email and Feed modules.

<a id="code-snippet--doom-email"></a>
```emacs-lisp
(:if (executable-find "mu") (mu4e +org +gmail))
;;notmuch
;;(wanderlust +gmail)
```

<a id="code-snippet--doom-app"></a>
```emacs-lisp
calendar                     ; A dated approach to timetabling
emms                         ; Multimedia in Emacs is music to my ears
everywhere                   ; *leave* Emacs!? You must be joking.
;; irc                       ; how neckbeards socialize
(rss +org)                   ; emacs as an RSS reader
;;twitter                    ; twitter client https://twitter.com/vnought
```

</div>

</div>

<div class="outline-3 jvc">

#### Visual Settings {#visual-settings}

<div class="outline-4 jvc">

##### Font Face {#font-face}

'Fira Code' is nice, and 'Overpass' makes for a nice sans companion. We just need to
fiddle with the font sizes a tad so that they visually match.  🕵🏽

```emacs-lisp
(setq doom-font (font-spec :family "FiraCode Nerd Font Mono" :size 16)
      doom-big-font (font-spec :family "FiraCode Nerd Font Mono" :size 20)
      doom-variable-pitch-font (font-spec :family "Overpass" :size 16)
      doom-unicode-font (font-spec :family "JuliaMono")
      doom-serif-font (font-spec :family "IBM Plex Mono" :weight 'light))
```

In addition to these fonts, Merriweather is used with `nov.el`, and Alegreya as a
serif-ed proportional font used by `mixed-pitch-mode` for `writeroom-mode` with Org
files.

Because we care about how things look let's add a check to make sure we're told
if the system doesn't have any of those fonts.

<a id="code-snippet--detect-missing-fonts"></a>
```emacs-lisp
(defvar required-fonts '("FiraCode Nerd Font" "Overpass" "JuliaMono" "IBM Plex Mono" "Merriweather" "Alegreya"))

(defvar available-fonts
  (delete-dups (or (font-family-list)
                   (split-string (shell-command-to-string "fc-list : family")
                                 "[,\n]"))))

(defvar missing-fonts
  (delq nil (mapcar
             (lambda (font)
               (unless (delq nil (mapcar (lambda (f)
                                           (string-match-p (format "^%s$" font) f))
                                         available-fonts))
                 font))
             required-fonts)))

(if missing-fonts
    (pp-to-string
     `(unless noninteractive
        (add-hook! 'doom-init-ui-hook
          (run-at-time nil nil
                       (lambda ()
                         (message "%s missing the following fonts: %s"
                                  (propertize "Warning!" 'face '(bold warning))
                                  (mapconcat (lambda (font)
                                               (propertize font 'face 'font-lock-variable-name-face))
                                             ',missing-fonts
                                             ", "))
                         (sleep-for 0.5))))))
  ";; No missing fonts detected")
```

```emacs-lisp
<<detect-missing-fonts()>>
```

This way whenever fonts are missing, after Doom's UI has initialized, a warning
listing the missing fonts should appear for at least half a second.

</div>

<div class="outline-4 jvc">

##### Theme and modeline {#theme-and-modeline}

```emacs-lisp
(setq doom-theme 'catppuccin)
```

However, by default `red` text is used in the `modeline`, so let's make that orange
so I don't feel like something's gone _wrong_ when editing files.

```emacs-lisp
(custom-set-faces!
  '(doom-modeline-buffer-modified :foreground "orange"))
```

While we're modifying the modeline, `LF UTF-8` is the default file encoding, and
thus not worth noting in the modeline. So, let's conditionally hide it.

```emacs-lisp
(defun doom-modeline-conditional-buffer-encoding ()
  "We expect the encoding to be LF UTF-8, so only show the modeline when this is not the case"
  (setq-local doom-modeline-buffer-encoding
              (unless (and (memq (plist-get (coding-system-plist buffer-file-coding-system) :category)
                                 '(coding-category-undecided coding-category-utf-8))
                           (not (memq (coding-system-eol-type buffer-file-coding-system) '(1 2))))
                t)))

(add-hook 'after-change-major-mode-hook #'doom-modeline-conditional-buffer-encoding)
```

</div>

<div class="outline-4 jvc">

##### Miscellaneous {#miscellaneous}

Relative line numbers are fantastic for knowing how far away line numbers are,
then `ESC 12 <UP>` gets you exactly where you think.

```emacs-lisp
(setq display-line-numbers-type 'relative)
```

I'd like some slightly nicer default buffer names

```emacs-lisp
(setq doom-fallback-buffer-name "Doom Emacs"
      +doom-dashboard-name "Doom Emacs Dashboard")
```

</div>

</div>

<div class="outline-3 jvc">

#### Some helper macros {#some-helper-macros}

There are a few handy macros added by doom, namely

-   `load!` for loading external `.el` files relative to this one
-   `use-package!` for configuring packages
-   `add-load-path!` for adding directories to the `load-path` where `Emacs` looks when
    you load packages with `require` or `use-package`
-   `map!` for binding new keys

</div>

<div class="outline-3 jvc">

#### Allow babel execution in CLI actions {#allow-babel-execution-in-cli-actions}

In this config I sometimes generate code to include in my config.
This works nicely, but for it to work with `doom sync` et. al. I need to make sure
that Org doesn't try to confirm that I want to allow evaluation (I do!).

Thankfully Doom supports `$DOOMDIR/cli.el` file which is sourced every time a CLI
command is run, so we can just enable evaluation by setting
`org-confirm-babel-evaluate` to `nil` there.
While we're at it, we should silence `org-babel-execute-src-block` to
avoid polluting the output.

```emacs-lisp
;;; cli.el -*- lexical-binding: t; -*-
(setq org-confirm-babel-evaluate nil)

(defun doom-shut-up-a (orig-fn &rest args)
  (quiet! (apply orig-fn args)))

(advice-add 'org-babel-execute-src-block :around #'doom-shut-up-a)
```

</div>

<div class="outline-3 jvc">

#### Elisp REPL {#elisp-repl}

I think an elisp REPL sounds like a fun idea, even if not a particularly useful
one 😛. We can do this by adding a new command in `cli.el`.

```emacs-lisp
(defcli! repl ((in-rlwrap-p ["--rl"] "For internal use only."))
  "Start an elisp REPL."
  (when (and (executable-find "rlwrap") (not in-rlwrap-p))
    ;; For autocomplete
    (setq autocomplete-file "/tmp/doom_elisp_repl_symbols")
    (unless (file-exists-p autocomplete-file)
      (princ "\e[0;33mInitialising autocomplete list...\e[0m\n")
      (with-temp-buffer
        (cl-do-all-symbols (s)
          (let ((sym (symbol-name s)))
            (when (string-match-p "\\`[[:ascii:]][[:ascii:]]+\\'" sym)
              (insert sym "\n"))))
        (write-region nil nil autocomplete-file)))
    (princ "\e[F")
    (throw 'exit (list "rlwrap" "-f" autocomplete-file
                       (concat doom-emacs-dir "bin/doom") "repl" "--rl")))

  (doom-initialize-packages)
  (require 'engrave-faces-ansi)
  (setq engrave-faces-ansi-color-mode '3-bit)

  ;; For some reason (require 'parent-mode) doesn't work :(
  (defun parent-mode-list (mode)
    "Return a list of MODE and all its parent modes.

The returned list starts with the parent-most mode and ends with MODE."
    (let ((result ()))
      (parent-mode--worker mode (lambda (mode)
                                  (push mode result)))
      result))
  (defun parent-mode--worker (mode func)
    "For MODE and all its parent modes, call FUNC.

FUNC is first called for MODE, then for its parent, then for the parent's
parent, and so on.

MODE shall be a symbol referring to a function.
FUNC shall be a function taking one argument."
    (funcall func mode)
    (when (not (fboundp mode))
      (signal 'void-function (list mode)))
    (let ((modefunc (symbol-function mode)))
      (if (symbolp modefunc)
          ;; Hande all the modes that use (defalias 'foo-parent-mode (stuff)) as
          ;; their parent
          (parent-mode--worker modefunc func)
        (let ((parentmode (get mode 'derived-mode-parent)))
          (when parentmode
            (parent-mode--worker parentmode func))))))
  (provide 'parent-mode)
  ;; Some extra highlighting (needs parent-mode)
  (require 'rainbow-delimiters)
  (require 'highlight-quoted)
  (require 'highlight-numbers)
  (setq emacs-lisp-mode-hook '(rainbow-delimiters-mode
                               highlight-quoted-mode
                               highlight-numbers-mode))
  ;; Pretty print
  (defun pp-sexp (sexp)
    (with-temp-buffer
      (cl-prettyprint sexp)
      (emacs-lisp-mode)
      (font-lock-ensure)
      (with-current-buffer (engrave-faces-ansi-buffer)
        (princ (string-trim (buffer-string)))
        (kill-buffer (current-buffer)))))
  ;; Now do the REPL
  (defvar accumulated-input nil)
  (while t
    (condition-case nil
        (let ((input (if accumulated-input
                         (read-string "\e[31m .\e[0m  ")
                       (read-string "\e[31mλ:\e[0m "))))
          (setq input (concat accumulated-input
                              (when accumulated-input "\n")
                              input))
          (cond
           ((string-match-p "\\`[[:space:]]*\\'" input)
            nil)
           ((string= input "exit")
            (princ "\n") (kill-emacs 0))
           (t
            (condition-case err
                (let ((input-sexp (car (read-from-string input))))
                  (setq accumulated-input nil)
                  (pp-sexp (eval input-sexp))
                  (princ "\n"))
              ;; Caused when sexp in unbalanced
              (end-of-file (setq accumulated-input input))
              (error
               (cl-destructuring-bind (backtrace &optional type data . _)
                   (cons (doom-cli--backtrace) err)
                 (princ (concat "\e[1;31mERROR:\e[0m " (get type 'error-message)))
                 (princ "\n       ")
                 (pp-sexp (cons type data))
                 (when backtrace
                   (print! (bold "Backtrace:"))
                   (print-group!
                    (dolist (frame (seq-take backtrace 10))
                      (print!
                       "%0.74s" (replace-regexp-in-string
                                 "[\n\r]" "\\\\n"
                                 (format "%S" frame))))))
                 (princ "\n")))))))
      ;; C-d causes an end-of-file error
      (end-of-file (princ "exit\n") (kill-emacs 0)))
    (unless accumulated-input (princ "\n"))))
```

</div>

<div class="outline-3 jvc">

#### Asynchronous config tangling {#asynchronous-config-tangling}

Doom adds an `org-mode` hook `+literate-enable-recompile-h`. This is a nice idea,
but it's too blocking for my taste. Since I trust my tangling to be fairly
straightforward, I'll just redefine it to a simpler, async, function.

```emacs-lisp
(defvar +literate-tangle--proc nil)
(defvar +literate-tangle--proc-start-time nil)

(defadvice! +literate-tangle-async-h ()
  "A very simplified version of `+literate-tangle-h', but async."
  :override #'+literate-tangle-h
  (unless (getenv "__NOTANGLE")
    (let ((default-directory doom-private-dir))
      (when +literate-tangle--proc
        (message "Killing outdated tangle process...")
        (set-process-sentinel +literate-tangle--proc #'ignore)
        (kill-process +literate-tangle--proc)
        (sit-for 0.3)) ; ensure the message is seen for a bit
      (setq +literate-tangle--proc-start-time (float-time)
            +literate-tangle--proc
            (start-process "tangle-config"
                           (get-buffer-create " *tangle config*")
                           "emacs" "--batch" "--eval"
                           (format "(progn \
(require 'ox) \
(require 'ob-tangle) \
(setq org-confirm-babel-evaluate nil \
      org-inhibit-startup t \
      org-mode-hook nil \
      write-file-functions nil \
      before-save-hook nil \
      after-save-hook nil \
      vc-handled-backends nil \
      org-startup-folded nil \
      org-startup-indented nil) \
(org-babel-tangle-file \"%s\" \"%s\"))"
                                   +literate-config-file
                                   (expand-file-name (concat doom-module-config-file ".el")))))
      (set-process-sentinel +literate-tangle--proc #'+literate-tangle--sentinel)
      (run-at-time nil nil (lambda () (message "Tangling config.org"))) ; ensure shown after a save message
      "Tangling config.org...")))

(defun +literate-tangle--sentinel (process signal)
  (cond
   ((and (eq 'exit (process-status process))
         (= 0 (process-exit-status process)))
    (message "Tangled config.org sucessfully (took %.1fs)"
             (- (float-time) +literate-tangle--proc-start-time))
    (setq +literate-tangle--proc nil))
   ((memq (process-status process) (list 'exit 'signal))
    (pop-to-buffer (get-buffer " *tangle config*"))
    (message "Failed to tangle config.org (after %.1fs)"
             (- (float-time) +literate-tangle--proc-start-time))
    (setq +literate-tangle--proc nil))))

(defun +literate-tangle-check-finished ()
  (when (and (process-live-p +literate-tangle--proc)
             (yes-or-no-p "Config is currently retangling, would you please wait a few seconds?"))
    (switch-to-buffer " *tangle config*")
    (signal 'quit nil)))
(add-hook! 'kill-emacs-hook #'+literate-tangle-check-finished)
```

</div>

<div class="outline-3 jvc">

#### Htmlize command {#htmlize-command}

Why not have a command to htmlize files? This is basically a little test of my
engrave-faces package because it somehow seems to work without a GUI, while the
htmlize package doesn't.

```emacs-lisp
(defcli! htmlize (file)
  "Export a FILE buffer to HTML."

  (print! "Htmlizing %s" file)

  (doom-initialize)
  (require 'highlight-numbers)
  (require 'highlight-quoted)
  (require 'rainbow-delimiters)
  (require 'engrave-faces-html)

  ;; Lighten org-mode
  (when (string= "org" (file-name-extension file))
    (setcdr (assoc 'org after-load-alist) nil)
    (setq org-load-hook nil)
    (require 'org)
    (setq org-mode-hook nil)
    (add-hook 'engrave-faces-before-hook
              (lambda () (if (eq major-mode 'org-mode)
                        (org-show-all)))))

  (engrave-faces-html-file file))
```

</div>

<div class="outline-3 jvc">

#### Dashboard quick actions {#dashboard-quick-actions}

When using the dashboard, there are often a small number of actions I will take.
As the dashboard is it's own major mode, there is no need to suffer the tyranny
of unnecessary keystrokes --- we can simply bind common actions to a single key!

```emacs-lisp
(defun +doom-dashboard-setup-modified-keymap ()
  (setq +doom-dashboard-mode-map (make-sparse-keymap))
  (map! :map +doom-dashboard-mode-map
        :desc "Find file" :ne "f" #'find-file
        :desc "Recent files" :ne "r" #'consult-recent-file
        :desc "Config dir" :ne "C" #'doom/open-private-config
        :desc "Open config.org" :ne "c" (cmd! (find-file (expand-file-name "config.org" doom-private-dir)))
        :desc "Open elfeed summary" :ne "E" #'elfeed-summary
        :desc "Open elfeed" :ne "e" #'elfeed
        :desc "Open dotfile" :ne "." (cmd! (doom-project-find-file "~/.config/"))
        :desc "Notes (roam)" :ne "n" #'org-roam-node-find
        :desc "Search (roam)" :ne "N" #'justin/org-roam-rg-search
        :desc "Switch buffer" :ne "b" #'+vertico/switch-workspace-buffer
        :desc "Switch buffers (all)" :ne "B" #'consult-buffer
        :desc "IBuffer" :ne "i" #'ibuffer
        :desc "Agenda"  :ne "o" #'org-agenda
        :desc "Previous buffer" :ne "p" #'previous-buffer
        :desc "Set theme" :ne "t" #'consult-theme
        :desc "Quit" :ne "Q" #'save-buffers-kill-terminal
        :desc "Show keybindings" :ne "h" (cmd! (which-key-show-keymap '+doom-dashboard-mode-map))))

(add-transient-hook! #'+doom-dashboard-mode (+doom-dashboard-setup-modified-keymap))
(add-transient-hook! #'+doom-dashboard-mode :append (+doom-dashboard-setup-modified-keymap))
(add-hook! 'doom-init-ui-hook :append (+doom-dashboard-setup-modified-keymap))
```

Unfortunately the show keybindings help doesn't currently work as intended, but
this is still quite nice overall.

Now that the dashboard is so convenient, I'll want to make it easier to get to.

```emacs-lisp
(map! :leader :desc "Dashboard" "d" #'+doom-dashboard/open)
```

</div>

</div>

<div class="outline-2 jvc">

### Other things {#other-things}

<div class="outline-3 jvc">

#### Editor interaction {#editor-interaction}

<div class="outline-4 jvc">

##### Mouse buttons {#mouse-buttons}

```emacs-lisp
(map! :n [mouse-8] #'better-jumper-jump-backward
      :n [mouse-9] #'better-jumper-jump-forward)
```

</div>

</div>

<div class="outline-3 jvc">

#### Window title {#window-title}

I'd like to have just the buffer name, then if applicable the project folder

```emacs-lisp
(setq frame-title-format
      '(""
        (:eval
         (if (s-contains-p org-roam-directory (or buffer-file-name ""))
             (replace-regexp-in-string
              ".*/[0-9]*-?" "☰ "
              (subst-char-in-string ?_ ?  buffer-file-name))
           "%b"))
        (:eval
         (let ((project-name (projectile-project-name)))
           (unless (string= "-" project-name)
             (format (if (buffer-modified-p)  " ◉ %s" " - %s") project-name))))))
```

For example when I open my config file it the window will be titled `config.org ●
doom` then as soon as I make a change it will become `config.org ◉ doom`.

</div>

<div class="outline-3 jvc">

#### Splash Images {#splash-images}

I could probably just replicate the code here in entirety, but, effort - this is
basically meant to pick a different splash image on the dashboard.

```emacs-lisp
(package! random-splash-image
          :recipe (:host github :repo "kakakaya/random-splash-image"))
```

```emacs-lisp
(use-package random-splash-image
  :ensure t
  :config
  (setq random-splash-image-dir (concat (getenv "HOME") "/.doom.d/misc/splash-images"))
  (unless (file-directory-p random-splash-image-dir)
  (make-directory random-splash-image-dir t))
  (random-splash-image-set))
```

Lastly, the doom dashboard "useful commands" are no longer useful to me.
So, we'll disable them and then for a particularly _clean_ look disable
the modeline and `hl-line-mode`, then also hide the cursor.

```emacs-lisp
(remove-hook '+doom-dashboard-functions #'doom-dashboard-widget-shortmenu)
(add-hook! '+doom-dashboard-mode-hook (hide-mode-line-mode 1) (hl-line-mode -1))
(setq-hook! '+doom-dashboard-mode-hook evil-normal-state-cursor (list nil))
```

At the end, we have a minimal but rather nice splash screen.

</div>

<div class="outline-3 jvc">

#### Systemd daemon {#systemd-daemon}

For running a systemd service for a Emacs server I have the following

<a id="code-snippet--emacsclient service"></a>
```systemd
[Unit]
Description=Emacs server daemon
Documentation=info:emacs man:emacs(1) https://gnu.org/software/emacs/

[Service]
Type=forking
ExecStart=sh -c 'emacs --daemon && emacsclient -c --eval "(delete-frame)"'
ExecStop=/usr/bin/emacsclient --no-wait --eval "(progn (setq kill-emacs-hook nil) (kill emacs))"
Restart=on-failure

[Install]
WantedBy=default.target
```

which is then enabled by

```shell
systemctl --user enable emacs.service
```

For some reason if a frame isn't opened early in the initialization process, the
daemon doesn't seem to like opening frames later --- hence the `&& emacsclient`
part of the `ExecStart` value.

It can now be nice to use this as a 'default app' for opening files. If we add
an appropriate desktop entry, and enable it in the desktop environment.

```cfg
[Desktop Entry]
Name=Emacs client
GenericName=Text Editor
Comment=A flexible platform for end-user applications
MimeType=text/english;text/plain;text/x-makefile;text/x-c++hdr;text/x-c++src;text/x-chdr;text/x-csrc;text/x-java;text/x-moc;text/x-pascal;text/x-tcl;text/x-tex;application/x-shellscript;text/x-c;text/x-c++;
Exec=emacsclient -create-frame --alternate-editor="" --no-wait %F
Icon=emacs
Type=Application
Terminal=false
Categories=TextEditor;Utility;
StartupWMClass=Emacs
Keywords=Text;Editor;
X-KDE-StartupNotify=false
```

When the daemon is running, I almost always want to do a few particular things
with it, so I may as well eat the load time at startup. We also want to keep
`mu4e` running.

It would be good to start the IRC client (`circe`) too, but that seems to have
issues when started in a non-graphical session.

Lastly, while I'm not sure quite why it happens, but after a bit it seems that
new Emacsclient frames start on the `*scratch*` buffer instead of the dashboard.
I prefer the dashboard, so let's ensure that's always switched to in new frames.

<a id="code-snippet--daemon initialization"></a>
```emacs-lisp
(defun greedily-do-daemon-setup ()
  (require 'org)
  (when (require 'mu4e nil t)
    (setq mu4e-confirm-quit t)
    (setq +mu4e-lock-greedy t)
    (setq +mu4e-lock-relaxed t)
    (+mu4e-lock-add-watcher)
    (when (+mu4e-lock-available t)
      (mu4e~start)))
  (when (require 'elfeed nil t)
    (run-at-time nil (* 8 60 60) #'elfeed-update)))

(when (daemonp)
  (add-hook 'emacs-startup-hook #'greedily-do-daemon-setup)
  (add-hook! 'server-after-make-frame-hook
    (unless (string-match-p "\\*draft\\|\\*stdin\\|emacs-everywhere" (buffer-name))
      (switch-to-buffer +doom-dashboard-name))))
```

</div>

<div class="outline-3 jvc">

#### Emacs client wrapper {#emacs-client-wrapper}

I frequently want to make use of Emacs while in a terminal emulator. To make
this easier, I can construct a few handy aliases.

However, a little convenience script in `~/.local/bin` can have the same effect,
be available beyond the specific shell I plop the alias in, then also allow me
to add a few bells and whistles --- namely:

-   Accepting stdin by putting it in a temporary file and immediately opening it.
-   Guessing that the `tty` is a good idea when `$DISPLAY` is unset (relevant with SSH
    sessions, among other things).
-   With a whiff of 24-bit color support, sets `TERM` variable to a `terminfo` that
    (probably) announces 24-bit color support.
-   Changes GUI `emacsclient` instances to be non-blocking by default (`--no-wait`),
    and instead take a flag to suppress this behavior (`-w`).

I would use `sh`, but using arrays for argument manipulation is just too
convenient, so I'll raise the requirement to `bash`. Since arrays are the only
'extra' compared to `sh`, other shells like `ksh` etc. should work too.

<a id="code-snippet--e"></a>
```shell
#!/usr/bin/env bash
force_tty=false
force_wait=false
stdin_mode=""

args=()

while :; do
    case "$1" in
        -t | -nw | --tty)
            force_tty=true
            shift ;;
        -w | --wait)
            force_wait=true
            shift ;;
        -m | --mode)
            stdin_mode=" ($2-mode)"
            shift 2 ;;
        -h | --help)
            echo -e "\033[1mUsage: e [-t] [-m MODE] [OPTIONS] FILE [-]\033[0m

Emacs client convenience wrapper.


\033[1mOptions:\033[0m
\033[0;34m-h, --help\033[0m            Show this message
\033[0;34m-t, -nw, --tty\033[0m        Force terminal mode
\033[0;34m-w, --wait\033[0m            Don't supply \033[0;34m--no-wait\033[0m to graphical emacsclient
\033[0;34m-\033[0m                     Take \033[0;33mstdin\033[0m (when last argument)
\033[0;34m-m MODE, --mode MODE\033[0m  Mode to open \033[0;33mstdin\033[0m with

Run \033[0;32memacsclient --help\033[0m to see help for the emacsclient."
            exit 0 ;;
        --*=*)
            set -- "$@" "${1%%=*}" "${1#*=}"
            shift ;;
        *)
            if [ "$#" = 0 ]; then
                break; fi
            args+=("$1")
            shift ;;
    esac
done

if [ ! "${#args[*]}" = 0 ] && [ "${args[-1]}" = "-" ]; then
    unset 'args[-1]'
    TMP="$(mktemp /tmp/emacsstdin-XXX)"
    cat > "$TMP"
    args+=(--eval "(let ((b (generate-new-buffer \"*stdin*\"))) (switch-to-buffer b) (insert-file-contents \"$TMP\") (delete-file \"$TMP\")${stdin_mode})")
fi

if [ -z "$DISPLAY" ] || $force_tty; then
    # detect terminals with sneaky 24-bit support
    if { [ "$COLORTERM" = truecolor ] || [ "$COLORTERM" = 24bit ]; } \
        && [ "$(tput colors 2>/dev/null)" -lt 257 ]; then
        if echo "$TERM" | grep -q "^\w\+-[0-9]"; then
            termstub="${TERM%%-*}"; else
            termstub="${TERM#*-}"; fi
        if infocmp "$termstub-direct" >/dev/null 2>&1; then
            TERM="$termstub-direct"; else
            TERM="xterm-direct"; fi # should be fairly safe
    fi
    emacsclient --tty -create-frame --alternate-editor="$ALTERNATE_EDITOR" "${args[@]}"
else
    if ! $force_wait; then
        args+=(--no-wait); fi
    emacsclient -create-frame --alternate-editor="$ALTERNATE_EDITOR" "${args[@]}"
fi
```

Now, to set an alias to use `e` with magit, and then for maximum laziness we can
set aliases for the terminal-forced variants.

```shell
alias m='e --eval "(progn (magit-status) (delete-other-windows))"'
alias mt="m -t"
alias et="e -t"
```

</div>

</div>

</div>

<div class="outline-1 jvc">

## Packages {#packages}

<div class="outline-2 jvc">

### Loading Instructions {#loading-instructions}

This is where you install packages, by declaring them with the `package!` macro in
`packages.el`, then running `doom refresh` on the command line.
This file shouldn't be byte compiled.

```emacs-lisp
;; -*- no-byte-compile: t; -*-
```

You'll then need to restart Emacs for your changes to take effect! Or at least,
run `M-x doom/reload`.

**Warning**: Don't disable core packages listed in `~/.emacs.d/core/packages.el`.
Doom requires these, and disabling them may have terrible side effects.

<div class="outline-3 jvc">

#### Packages in MELPA/ELPA/emacsmirror {#packages-in-melpa-elpa-emacsmirror}

To install `some-package` from MELPA, ELPA or emacsmirror:

```emacs-lisp
(package! some-package)
```

</div>

<div class="outline-3 jvc">

#### Packages from git repositories {#packages-from-git-repositories}

To install a package directly from a particular repo, you'll need to specify
a `:recipe`. You'll find documentation on what `:recipe` accepts [here](https://github.com/raxod502/straight.el#the-recipe-format):

```emacs-lisp
(package! another-package
  :recipe (:host github :repo "username/repo"))
```

If the package you are trying to install does not contain a `PACKAGENAME.el`
file, or is located in a subdirectory of the repo, you'll need to specify
`:files` in the `:recipe`:

```emacs-lisp
(package! this-package
  :recipe (:host github :repo "username/repo"
           :files ("some-file.el" "src/lisp/*.el")))
```

</div>

<div class="outline-3 jvc">

#### Disabling built-in packages {#disabling-built-in-packages}

If you'd like to disable a package included with Doom, for whatever reason,
you can do so here with the `:disable` property:

```emacs-lisp
(package! builtin-package :disable t)
```

You can override the recipe of a built in package without having to specify
all the properties for `:recipe`. These will inherit the rest of its recipe
from Doom or MELPA/ELPA/Emacsmirror:

```emacs-lisp
(package! builtin-package :recipe (:nonrecursive t))
(package! builtin-package-2 :recipe (:repo "myfork/package"))
```

Specify a `:branch` to install a package from a particular branch or tag.

```emacs-lisp
(package! builtin-package :recipe (:branch "develop"))
```

</div>

</div>

<div class="outline-2 jvc">

### Convenience {#convenience}

<div class="outline-3 jvc">

#### Avy {#avy}

> From the `:config default` module.

What a wonderful way to jump to buffer positions, and it uses the QWERTY
home-row for jumping.

</div>

<div class="outline-3 jvc">

#### Casual {#casual}

The `casual` series of packages are transient based porcelains for several popular
Emacs functionalities that might be difficult to use.

<div class="outline-4 jvc">

##### Casual Dired {#casual-dired}

```emacs-lisp
(package! casual-dired)
```

```emacs-lisp
(use-package casual-dired
  :ensure t
  :config
  (map! :after dired
        :map dired-mode-map
        :leader
        :desc "Casual Dired Tmenu" "m T" #'casual-dired-tmenu
        :desc "Casual Dired Sort By Tmenu" "m s" #'casual-dired-sort-by-tmenu))
```

</div>

<div class="outline-4 jvc">

##### Casual Avy {#casual-avy}

```emacs-lisp
(package! casual-avy)
```

```emacs-lisp
(use-package casual-avy
  :ensure t
  :bind ("M-g" . casual-avy-tmenu))
```

</div>

</div>

<div class="outline-3 jvc">

#### Rotate (window management) {#rotate--window-management}

The `rotate` package just adds the ability to rotate window layouts, but that
sounds nice to me.

```emacs-lisp
(package! rotate :pin "4e9ac3ff800880bd9b705794ef0f7c99d72900a6")
```

</div>

<div class="outline-3 jvc">

#### Which-key {#which-key}

> From the `:core packages` module.

Let's make this popup a bit faster

```emacs-lisp
(setq which-key-idle-delay 0.5) ;; I need the help, I really do
```

I also think that having `evil-` appear in so many popups is a bit too verbose,
let's change that, and do a few other similar tweaks while we're at it.

```emacs-lisp
(setq which-key-allow-multiple-replacements t)
(after! which-key
  (pushnew!
   which-key-replacement-alist
   '(("" . "\\`+?evil[-:]?\\(?:a-\\)?\\(.*\\)") . (nil . "◂\\1"))
   '(("\\`g s" . "\\`evilem--?motion-\\(.*\\)") . (nil . "◃\\1"))
   ))
```

</div>

</div>

<div class="outline-2 jvc">

### Tools {#tools}

<div class="outline-3 jvc">

#### Abbrev {#abbrev}

Thanks to [use a single abbrev-table for multiple modes? - Emacs Stack Exchange](https://emacs.stackexchange.com/questions/45462/use-a-single-abbrev-table-for-multiple-modes/45476#45476) I
have the following.

```emacs-lisp
(add-hook 'doom-first-buffer-hook
          (defun +abbrev-file-name ()
            (setq-default abbrev-mode t)
            (setq abbrev-file-name (expand-file-name "abbrev.el" doom-private-dir))))
```

</div>

<div class="outline-3 jvc">

#### Python Package Management {#python-package-management}

This lets me switch conda environments within python files. Since I primarily
use them as a data scientist, I figure, can't hurt.

```emacs-lisp
(package! conda)
(package! pet)
```

```emacs-lisp
(use-package! conda
  :init
  (setq conda-anaconda-home "/opt/mambaforge")
  (setq conda-env-home-directory "/opt/mambaforge/")
  (setq conda-env-executable-path "/opt/mambaforge/condabin/") ;; point directly to the condabin directory
  :config
  (conda-env-initialize-interactive-shells)
  (conda-env-initialize-eshell)
  (conda-env-autoactivate-mode t))

(add-to-list 'exec-path "/opt/mambaforge/condabin/")
(setenv "PATH" (concat "/opt/mambaforge/condabin/:" (getenv "PATH")))
```

```emacs-lisp
(use-package! pet
  :config
  (add-hook 'python-base-mode-hook 'pet-mode -10))
```

</div>

<div class="outline-3 jvc">

#### Deft {#deft}

This might require some config, but I'm not entirely sure how useful this is
considering node-find for roam works. Overlapping / maybe use for org in general.

```emacs-lisp
(use-package deft
:commands (deft)
:config
  (setq deft-directory "~/.org/")
  (setq deft-recursive t)
  (setq deft-strip-summary-regexp
  (concat "\\("
	  "^:.+:.*" ; any line with a :SOMETHING:
	  "\\|^#\\+.*\n" ; anyline starting with a #+
	  "\\|^\\*.+.*\n" ; anyline where an asterisk starts the line
	  "\\)"))
     )

(advice-add 'deft-parse-title :override
    (lambda (file contents)
      (if deft-use-filename-as-title
	  (deft-base-filename file)
	(let* ((case-fold-search 't)
	       (begin (string-match "title: " contents))
	       (end-of-begin (match-end 0))
	       (end (string-match "\n" contents begin)))
	  (if begin
	      (substring contents end-of-begin end)
	    (format "%s" file))))))

```

</div>

<div class="outline-3 jvc">

#### Eros {#eros}

> From the `:tools eval` module.

This package enables the very nice inline evaluation with `gr` and `gR`. The prefix
could be slightly nicer though.

```emacs-lisp
(setq eros-eval-result-prefix "⟹ ") ; default =>
```

</div>

<div class="outline-3 jvc">

#### EVIL {#evil}

> From the `:editor evil` module.

When I want to make a substitution, I want it to be global more often than not
--- so let's make that the default.

Now, EVIL cares a fair bit about keeping compatibility with Vim's default
behavior. I don't. There are some particular settings that I'd rather be
something else, so let's change them.

```emacs-lisp
(after! evil
  (setq evil-ex-substitute-global t     ; I like my s/../.. to by global by default
        evil-move-cursor-back nil       ; Don't move the block cursor when toggling insert mode
        evil-kill-on-visual-paste nil)) ; Don't put overwritten text in the kill ring
```

Sets the key-sequence "jk" for escape, allowing a quick hit of these to allow
escaping insert mode. I might revisit this option, since technically anytime I
want to say "lol jk" to someone, it would escape, but then I realized: "When the
heck am I going to use that in emacs text", so it seems fine.

```emacs-lisp
; (package! evil-escape :disable t/) ; Disabling the package if needed
(setq-default evil-escape-key-sequence "jk")
```

</div>

<div class="outline-3 jvc">

#### Consult {#consult}

> From the `:completion vertico` module.

Since we're using [Marginalia](#marginalia) too, the separation between buffers and files is
already clear, and there's no need for a different face.

```emacs-lisp
(after! consult
  (set-face-attribute 'consult-file nil :inherit 'consult-buffer)
  (setf (plist-get (alist-get 'perl consult-async-split-styles-alist) :initial) ";"))
```

</div>

<div class="outline-3 jvc">

#### Large Language Models (LLM) {#large-language-models--llm}

Large language model thingys! Can't decide which I prefer.

<div class="outline-4 jvc">

##### GPTel {#gptel}

[GitHub - karthink/gptel: A simple LLM client for Emacs](https://github.com/karthink/gptel) - This is made by the
same person who did the youtube-elfeed package, which is pretty neat. A lot of
the power is in using gptel-request.

```emacs-lisp
(package! gptel)
(package! gptel-quick :recipe (:host github :repo  "karthink/gptel-quick"))
```

```emacs-lisp
(use-package! gptel
  :config
  (setq gptel-model "llama3:latest"
        gptel-org-branching-context t)

  (setq gptel-backend
        (gptel-make-ollama "Ollama"
                           :host "192.168.1.9:11434"
                           :stream t
                           :models '("llama3:latest"))))

(use-package! gptel-quick
  :after gptel
  :config
  ;; Add any gptel-quick specific configuration here
  )

;; Key bindings
(map! :leader
      (:prefix ("l" . "LLM")
       :desc "Quick GPTel" "q" #'gptel-quick
       :desc "Start GPTel" "s" #'gptel
       :desc "Send to GPTel" "S" #'gptel-send))
```

</div>

<div class="outline-4 jvc">

##### Ellama {#ellama}

Another LLM package using llm under the hood. Alows for switching LLMs more
easily, I think. I'm keeping it around just to compare and contrast.

```emacs-lisp
(package! ellama)
```

```emacs-lisp
(setq my-api-key (getenv "OPENAI_API_KEY"))

(use-package ellama
  :init
  ;; setup key bindings
  (setopt ellama-keymap-prefix "C-c e")
  ;; language you want ellama to translate to
  (setopt ellama-language "Chinese")
  ;; could be llm-openai for example
  (require 'llm-ollama)
  (setopt ellama-provider
	  (make-llm-ollama
	   :chat-model "llama3:latest"
           :host "192.168.1.9"
           :port 11434
	   :embedding-model "nomic-embed-text"
	   :default-chat-non-standard-params '(("num_ctx" . 8192))))
  (setopt ellama-providers
	  '(("openai" . (make-llm-openai
                         :key my-api-key
	                 :chat-model "gpt-4o-mini"
	                 :embedding-model "nomic-embed-text")))))
```

</div>

</div>

<div class="outline-3 jvc">

#### Magit {#magit}

> From the `:tools magit` module.

Magit is great as-is, thanks for making such a lovely package [Jonas](https://github.com/tarsius)!

<div class="outline-4 jvc">

##### Commit message templates {#commit-message-templates}

One little thing I want to add is some per-project commit message templates.

```emacs-lisp
(defvar +magit-project-commit-templates-alist nil
  "Alist of toplevel dirs and template strings/functions.")
(after! magit
  (defun +magit-fill-in-commit-template ()
    "Insert template from `+magit-fill-in-commit-template' if applicable."
    (when-let ((template (and (save-excursion (goto-char (point-min)) (string-match-p "\\`\\s-*$" (thing-at-point 'line)))
                              (cdr (assoc (file-name-base (directory-file-name (magit-toplevel)))
                                          +magit-project-commit-templates-alist)))))
      (goto-char (point-min))
      (insert (if (stringp template) template (funcall template)))
      (goto-char (point-min))
      (end-of-line)))
  (add-hook 'git-commit-setup-hook #'+magit-fill-in-commit-template 90))
```

This is particularly useful when creating commits for Org, as they need to
follow [a certain format](https://orgmode.org/worg/org-contribute.html#commit-messages) and sometimes I forget elements (oops!).

```emacs-lisp
(after! magit
  (defun +org-commit-message-template ()
    "Create a skeleton for an Org commit message based on the staged diff."
    (let (change-data last-file file-changes temp-point)
      (with-temp-buffer
        (apply #'call-process magit-git-executable
               nil t nil
               (append
                magit-git-global-arguments
                (list "diff" "--cached")))
        (goto-char (point-min))
        (while (re-search-forward "^@@\\|^\\+\\+\\+ b/" nil t)
          (if (looking-back "^\\+\\+\\+ b/" (line-beginning-position))
              (progn
                (push (list last-file file-changes) change-data)
                (setq last-file (buffer-substring-no-properties (point) (line-end-position))
                      file-changes nil))
            (setq temp-point (line-beginning-position))
            (re-search-forward "^\\+\\|^-" nil t)
            (end-of-line)
            (cond
             ((string-match-p "\\.el$" last-file)
              (when (re-search-backward "^\\(?:[+-]? *\\|@@[ +-\\d,]+@@ \\)(\\(?:cl-\\)?\\(?:defun\\|defvar\\|defmacro\\|defcustom\\)" temp-point t)
                (re-search-forward "\\(?:cl-\\)?\\(?:defun\\|defvar\\|defmacro\\|defcustom\\) " nil t)
                (add-to-list 'file-changes (buffer-substring-no-properties (point) (forward-symbol 1)))))
             ((string-match-p "\\.org$" last-file)
              (when (re-search-backward "^[+-]\\*+ \\|^@@[ +-\\d,]+@@ \\*+ " temp-point t)
                (re-search-forward "@@ \\*+ " nil t)
                (add-to-list 'file-changes (buffer-substring-no-properties (point) (line-end-position)))))))))
      (push (list last-file file-changes) change-data)
      (setq change-data (delete '(nil nil) change-data))
      (concat
       (if (= 1 (length change-data))
           (replace-regexp-in-string "^.*/\\|.[a-z]+$" "" (caar change-data))
         "?")
       ": \n\n"
       (mapconcat
        (lambda (file-changes)
          (if (cadr file-changes)
              (format "* %s (%s): "
                      (car file-changes)
                      (mapconcat #'identity (cadr file-changes) ", "))
            (format "* %s: " (car file-changes))))
        change-data
        "\n\n"))))

  (add-to-list '+magit-project-commit-templates-alist (cons "org-mode" #'+org-commit-message-template)))
```

This relies on two small entries in the git config files which improves the hunk
heading line selection for elisp and Org files.

```gitconfig
[diff "lisp"]
  xfuncname = "^(((;;;+ )|\\(|([ \t]+\\(((cl-|el-patch-)?def(un|var|macro|method|custom)|gb/))).*)$"

[diff "org"]
  xfuncname = "^(\\*+ +.*)$"
```

</div>

</div>

<div class="outline-3 jvc">

#### Magit delta {#magit-delta}

[Delta](https://github.com/dandavison/delta/) is a git diff syntax highlighter written in rust. The author also wrote a
package to hook this into the magit diff view (which don't get any syntax
highlighting by default). This requires the `delta` binary. It's packaged on some
distributions, but most reliably installed through Rust's package manager cargo.

```shell
cargo install git-delta
```

Now we can make use of the package for this.

```emacs-lisp
;; (package! magit-delta :recipe (:host github :repo "dandavison/magit-delta") :pin "56cdffd377279589aa0cb1df99455c098f1848cf")
```

All that's left is to hook it into magit

```emacs-lisp
;; (after! magit
;;   (magit-delta-mode +1))
```

Unfortunately this currently seems to mess things up, which is something I'll
want to look into later.

</div>

<div class="outline-3 jvc">

#### Smerge {#smerge}

For repeated operations, a hydra would be helpful. But I prefer transient.

```emacs-lisp
(defun smerge-repeatedly ()
  "Perform smerge actions again and again"
  (interactive)
  (smerge-mode 1)
  (smerge-transient))
(after! transient
  (transient-define-prefix smerge-transient ()
    [["Move"
      ("n" "next" (lambda () (interactive) (ignore-errors (smerge-next)) (smerge-repeatedly)))
      ("p" "previous" (lambda () (interactive) (ignore-errors (smerge-prev)) (smerge-repeatedly)))]
     ["Keep"
      ("b" "base" (lambda () (interactive) (ignore-errors (smerge-keep-base)) (smerge-repeatedly)))
      ("u" "upper" (lambda () (interactive) (ignore-errors (smerge-keep-upper)) (smerge-repeatedly)))
      ("l" "lower" (lambda () (interactive) (ignore-errors (smerge-keep-lower)) (smerge-repeatedly)))
      ("a" "all" (lambda () (interactive) (ignore-errors (smerge-keep-all)) (smerge-repeatedly)))
      ("RET" "current" (lambda () (interactive) (ignore-errors (smerge-keep-current)) (smerge-repeatedly)))]
     ["Diff"
      ("<" "upper/base" (lambda () (interactive) (ignore-errors (smerge-diff-base-upper)) (smerge-repeatedly)))
      ("=" "upper/lower" (lambda () (interactive) (ignore-errors (smerge-diff-upper-lower)) (smerge-repeatedly)))
      (">" "base/lower" (lambda () (interactive) (ignore-errors (smerge-diff-base-lower)) (smerge-repeatedly)))
      ("R" "refine" (lambda () (interactive) (ignore-errors (smerge-refine)) (smerge-repeatedly)))
      ("E" "ediff" (lambda () (interactive) (ignore-errors (smerge-ediff)) (smerge-repeatedly)))]
     ["Other"
      ("c" "combine" (lambda () (interactive) (ignore-errors (smerge-combine-with-next)) (smerge-repeatedly)))
      ("r" "resolve" (lambda () (interactive) (ignore-errors (smerge-resolve)) (smerge-repeatedly)))
      ("k" "kill current" (lambda () (interactive) (ignore-errors (smerge-kill-current)) (smerge-repeatedly)))
      ("q" "quit" (lambda () (interactive) (smerge-auto-leave)))]]))
```

</div>

<div class="outline-3 jvc">

#### Company {#company}

> From the `:completion company` module.

It's nice to have completions almost all the time, in my opinion. Key strokes
are just waiting to be saved!

```emacs-lisp
(after! company
  (setq company-idle-delay 1.0
        company-minimum-prefix-length 2
        company-box-doc-delay 1.5
        company-tooltip-maximum-width 50)
  (setq company-show-numbers t)
  (add-hook 'evil-normal-state-entry-hook #'company-abort)) ;; make aborting less annoying.
```

Now, the improvements from `precedent` are mostly from remembering history, so
let's improve that memory.

```emacs-lisp
(setq-default history-length 1000)
(setq-default prescient-history-length 1000)
```

Patch for fixing company-box's window floating off the side.

```emacs-lisp
(defun company-box-doc--make-buffer-fixed (object)
     (let* ((buffer-list-update-hook nil)
            (inhibit-modification-hooks t)
            (string (cond ((stringp object) object)
                          ((bufferp object) (with-current-buffer object (buffer-string))))))
       (when (and string (> (length (string-trim string)) 0))
         (with-current-buffer (company-box--get-buffer "doc")
           (erase-buffer)
           (insert string)
           (setq mode-line-format nil
                 display-line-numbers nil
                 header-line-format nil
                 show-trailing-whitespace nil
                 cursor-in-non-selected-windows nil)

           (toggle-truncate-lines -1) ;; PATCHED HERE

           (current-buffer)))))

(advice-add 'company-box-doc--make-buffer :override #'company-box-doc--make-buffer-fixed)
```

<div class="outline-4 jvc">

##### ESS {#ess}

`company-dabbrev-code` is nice. Let's have it.

```emacs-lisp
(set-company-backend! 'ess-r-mode '(company-R-args company-R-objects company-dabbrev-code :separate))
```

</div>

</div>

<div class="outline-3 jvc">

#### Projectile {#projectile}

> From the `:core packages` module.

Looking at documentation via `SPC h f` and `SPC h v` and looking at the source can
add package src directories to projectile. This isn't desirable in my opinion.

```emacs-lisp
(setq projectile-project-search-path '("~/code/"))
(setq projectile-ignored-projects '("~/" "/tmp" "~/.emacs.d/.local/straight/repos/"))
(defun projectile-ignored-project-function (filepath)
  "Return t if FILEPATH is within any of `projectile-ignored-projects'"
  (or (mapcar (lambda (p) (s-starts-with-p p filepath)) projectile-ignored-projects)))
```

</div>

<div class="outline-3 jvc">

#### TRAMP {#tramp}

Another lovely Emacs feature, TRAMP stands for _Transparent Remote Access,
Multiple Protocol_. In brief, it's a lovely way to wander around outside your
local filesystem.

<div class="outline-4 jvc">

##### Prompt recognition {#prompt-recognition}

Unfortunately, when connecting to remote machines Tramp can be a wee pit picky
with the prompt format. Let's try to get Bash, and be a bit more permissive with
prompt recognition.

```emacs-lisp
(after! tramp
  (setenv "SHELL" "/bin/bash")
  (setq tramp-shell-prompt-pattern "\\(?:^\\|\\)[^]#$%>\n]*#?[]#$%>] *\\(\\[[0-9;]*[a-zA-Z] *\\)*")) ;; default + 
```

</div>

<div class="outline-4 jvc">

##### Troubleshooting {#troubleshooting}

In case the remote shell is misbehaving, here are some things to try

<div class="outline-5 jvc">

###### Zsh {#zsh}

There are some escape code you don't want, let's make it behave more considerately.

```shell
if [[ "$TERM" == "dumb" ]]; then
    unset zle_bracketed_paste
    unset zle
    PS1='$ '
    return
fi
```

</div>

</div>

<div class="outline-4 jvc">

##### Guix {#guix}

[Guix](https://guix.gnu.org/) puts some binaries that TRAMP looks for in unexpected locations.
That's no problem though, we just need to help TRAMP find them.

```emacs-lisp
(after! tramp
  (appendq! tramp-remote-path
            '("~/.guix-profile/bin" "~/.guix-profile/sbin"
              "/run/current-system/profile/bin"
              "/run/current-system/profile/sbin")))
```

</div>

</div>

<div class="outline-3 jvc">

#### Auto activating snippets {#auto-activating-snippets}

Sometimes pressing `TAB` is just too much.

```emacs-lisp
(package! aas :recipe (:host github :repo "ymarco/auto-activating-snippets")
  :pin "566944e3b336c29d3ac11cd739a954c9d112f3fb")
```

```emacs-lisp
(use-package! aas
  :commands aas-mode)
```

</div>

<div class="outline-3 jvc">

#### Screenshot {#screenshot}

This makes it a breeze to take lovely screenshots.

```emacs-lisp
(package! screenshot :recipe (:local-repo "lisp/screenshot"))
```

Some light configuring is all we need, so we can make use of the [0x0](https://github.com/Calinou/0x0) wrapper
file uploading script (which I've renamed to `upload`).

```emacs-lisp
(use-package! screenshot
  :defer t
  :config (setq screenshot-upload-fn "upload %s 2>/dev/null"))
```

</div>

<div class="outline-3 jvc">

#### YASnippet {#yasnippet}

> From the `:editor snippets` module.

Nested snippets are good, so let's enable that.

```emacs-lisp
(setq yas-triggers-in-field t)
```

</div>

<div class="outline-3 jvc">

#### String inflection {#string-inflection}

For when you want to change the case pattern for a symbol.

```emacs-lisp
(package! string-inflection :pin "fd7926ac17293e9124b31f706a4e8f38f6a9b855")
```

```emacs-lisp
(use-package! string-inflection
  :commands (string-inflection-all-cycle
             string-inflection-toggle
             string-inflection-camelcase
             string-inflection-lower-camelcase
             string-inflection-kebab-case
             string-inflection-underscore
             string-inflection-capital-underscore
             string-inflection-upcase)
  :init
  (map! :leader :prefix ("c~" . "naming convention")
        :desc "cycle" "~" #'string-inflection-all-cycle
        :desc "toggle" "t" #'string-inflection-toggle
        :desc "CamelCase" "c" #'string-inflection-camelcase
        :desc "downCase" "d" #'string-inflection-lower-camelcase
        :desc "kebab-case" "k" #'string-inflection-kebab-case
        :desc "under_score" "_" #'string-inflection-underscore
        :desc "Upper_Score" "u" #'string-inflection-capital-underscore
        :desc "UP_CASE" "U" #'string-inflection-upcase)
  (after! evil
    (evil-define-operator evil-operator-string-inflection (beg end _type)
      "Define a new evil operator that cycles symbol casing."
      :move-point nil
      (interactive "<R>")
      (string-inflection-all-cycle)
      (setq evil-repeat-info '([?g ?~])))
    (define-key evil-normal-state-map (kbd "g~") 'evil-operator-string-inflection)))
```

</div>

<div class="outline-3 jvc">

#### Smart parentheses {#smart-parentheses}

> From the `:core packages` module.

```emacs-lisp
(sp-local-pair
 '(org-mode)
 "<<" ">>"
 :actions '(insert))
```

</div>

</div>

<div class="outline-2 jvc">

### Visuals {#visuals}

<div class="outline-3 jvc">

#### Themes {#themes}

Proteolas did a lovely job with the Modus themes, so much so that they were
welcomed into Emacs 28. However, he is also rather attentive with updates, and
so I'd like to make sure we have a recent version.

```emmacs-lisp
(package! catppuccin-theme)
```

</div>

<div class="outline-3 jvc">

#### Theme magic {#theme-magic}

With all our fancy Emacs themes, my terminal is missing out!

```emacs-lisp
(package! theme-magic :pin "844c4311bd26ebafd4b6a1d72ddcc65d87f074e3")
```

This operates using `pywal`, which is present in some repositories, but most
reliably installed with `pip`.

```shell
sudo python3 -m pip install pywal
```

Theme magic takes a look at a number of faces, the saturation levels, and colour
differences to try to cleverly pick eight colours to use. However, it uses the
same colours for the light variants, and doesn't always make the best picks.
Since we're using `doom-themes`, our life is a little easier and we can use the
colour utilities from Doom themes to easily grab sensible colours and generate
lightened versions --- let's do that.

```emacs-lisp
(use-package! theme-magic
  :commands theme-magic-from-emacs
  :config
  (defadvice! theme-magic--auto-extract-16-doom-colors ()
    :override #'theme-magic--auto-extract-16-colors
    (list
     (face-attribute 'default :background)
     (doom-color 'error)
     (doom-color 'success)
     (doom-color 'type)
     (doom-color 'keywords)
     (doom-color 'constants)
     (doom-color 'functions)
     (face-attribute 'default :foreground)
     (face-attribute 'shadow :foreground)
     (doom-blend 'base8 'error 0.1)
     (doom-blend 'base8 'success 0.1)
     (doom-blend 'base8 'type 0.1)
     (doom-blend 'base8 'keywords 0.1)
     (doom-blend 'base8 'constants 0.1)
     (doom-blend 'base8 'functions 0.1)
     (face-attribute 'default :foreground))))
```

</div>

<div class="outline-3 jvc">

#### Emojify {#emojify}

> From the `:ui emoji` module.

For starters, twitter's emojis look nicer than emoji-one.
Other than that, this is pretty great OOTB 😀.

```emacs-lisp
(setq emojify-emoji-set "twemoji-v2")
```

One minor annoyance is the use of emojis over the default character
when the default is actually preferred. This occurs with overlay symbols I use
in Org mode, such as checkbox state, and a few other miscellaneous cases.

We can accommodate our preferences by deleting those entries from the emoji hash
table

```emacs-lisp
(defvar emojify-disabled-emojis
  '(;; Org
    "◼" "☑" "☸" "⚙" "⏩" "⏪" "⬆" "⬇" "❓"
    ;; Terminal powerline
    "✔"
    ;; Box drawing
    "▶" "◀"
    ;; I just want to see this as text
    "©" "™")
  "Characters that should never be affected by `emojify-mode'.")

(defadvice! emojify-delete-from-data ()
  "Ensure `emojify-disabled-emojis' don't appear in `emojify-emojis'."
  :after #'emojify-set-emoji-data
  (dolist (emoji emojify-disabled-emojis)
    (remhash emoji emojify-emojis)))
```

Now, it would be good to have a minor mode which allowed you to type ascii/gh
emojis and get them converted to unicode. Let's make one.

```emacs-lisp
(defun emojify--replace-text-with-emoji (orig-fn emoji text buffer start end &optional target)
  "Modify `emojify--propertize-text-for-emoji' to replace ascii/github emoticons with unicode emojis, on the fly."
  (if (or (not emoticon-to-emoji) (= 1 (length text)))
      (funcall orig-fn emoji text buffer start end target)
    (delete-region start end)
    (insert (ht-get emoji "unicode"))))

(define-minor-mode emoticon-to-emoji
  "Write ascii/gh emojis, and have them converted to unicode live."
  :global nil
  :init-value nil
  (if emoticon-to-emoji
      (progn
        (setq-local emojify-emoji-styles '(ascii github unicode))
        (advice-add 'emojify--propertize-text-for-emoji :around #'emojify--replace-text-with-emoji)
        (unless emojify-mode
          (emojify-turn-on-emojify-mode)))
    (setq-local emojify-emoji-styles (default-value 'emojify-emoji-styles))
    (advice-remove 'emojify--propertize-text-for-emoji #'emojify--replace-text-with-emoji)))
```

This new minor mode of ours will be nice for messages, so let's hook it in for
Email and IRC.

```emacs-lisp
(add-hook! '(mu4e-compose-mode org-msg-edit-mode circe-channel-mode) (emoticon-to-emoji 1))
```

</div>

<div class="outline-3 jvc">

#### Keycast {#keycast}

For some reason, I find myself demoing Emacs every now and then. Showing what
keyboard stuff I'm doing on-screen seems helpful. While [screenkey](https://gitlab.com/screenkey/screenkey) does exist,
having something that doesn't cover up screen content is nice.

```emacs-lisp
(package! keycast :pin "72d9add8ba16e0cae8cfcff7fc050fa75e493b4e")
```

Let's just make sure this is lazy-loaded appropriately.

```emacs-lisp
(use-package! keycast
  :commands keycast-mode
  :config
  (define-minor-mode keycast-mode
    "Show current command and its key binding in the mode line."
    :global t
    (if keycast-mode
        (progn
          (add-hook 'pre-command-hook 'keycast--update t)
          (add-to-list 'global-mode-string '("" mode-line-keycast " ")))
      (remove-hook 'pre-command-hook 'keycast--update)
      (setq global-mode-string (remove '("" mode-line-keycast " ") global-mode-string))))
  (custom-set-faces!
    '(keycast-command :inherit doom-modeline-debug
                      :height 0.9)
    '(keycast-key :inherit custom-modified
                  :height 1.1
                  :weight bold)))
```

</div>

<div class="outline-3 jvc">

#### Screencast {#screencast}

In a similar manner to [Keycast](#keycast), [gif-screencast](https://gitlab.com/ambrevar/emacs-gif-screencast) may come in handy.

```emacs-lisp
(package! gif-screencast :pin "5517a557a17d8016c9e26b0acb74197550f829b9")
```

We can lazy load this using the start/stop commands.

I initially installed `scrot` for this, since it was the default capture program.
However it raised `glib error: Saving to file ... failed` each time it was run.
Google didn't reveal any easy fixed, so I switched to [maim](https://github.com/naelstrof/maim). We now need to pass
it the window ID. This doesn't change throughout the lifetime of an emacs
instance, so as long as a single window is used `xdotool getactivewindow` will
give a satisfactory result.

It seems that when new colours appear, that tends to make `gifsicle` introduce
artefacts. To avoid this we pre-populate the colour map using the current doom
theme.

```emacs-lisp
(use-package! gif-screencast
  :commands gif-screencast-mode
  :config
  (map! :map gif-screencast-mode-map
        :g "<f8>" #'gif-screencast-toggle-pause
        :g "<f9>" #'gif-screencast-stop)
  (setq gif-screencast-program "maim"
        gif-screencast-args `("--quality" "3" "-i" ,(string-trim-right
                                                     (shell-command-to-string
                                                      "xdotool getactivewindow")))
        gif-screencast-optimize-args '("--batch" "--optimize=3" "--usecolormap=/tmp/doom-color-theme"))
  (defun gif-screencast-write-colormap ()
    (f-write-text
     (replace-regexp-in-string
      "\n+" "\n"
      (mapconcat (lambda (c) (if (listp (cdr c))
                                 (cadr c))) doom-themes--colors "\n"))
     'utf-8
     "/tmp/doom-color-theme" ))
  (gif-screencast-write-colormap)
  (add-hook 'doom-load-theme-hook #'gif-screencast-write-colormap))
```

</div>

<div class="outline-3 jvc">

#### Mixed pitch {#mixed-pitch}

> From the `:ui zen` module.

We'd like to use mixed pitch in certain modes. If we simply add a hook, when
directly opening a file with (a new) Emacs `mixed-pitch-mode` runs before UI
initialization, which is problematic. To resolve this, we create a hook that
runs after UI initialization and both

-   conditionally enables `mixed-pitch-mode`
-   sets up the mixed pitch hooks

<!--listend-->

```emacs-lisp
(defvar mixed-pitch-modes '(org-mode LaTeX-mode markdown-mode gfm-mode Info-mode)
  "Modes that `mixed-pitch-mode' should be enabled in, but only after UI initialisation.")
(defun init-mixed-pitch-h ()
  "Hook `mixed-pitch-mode' into each mode in `mixed-pitch-modes'.
Also immediately enables `mixed-pitch-modes' if currently in one of the modes."
  (when (memq major-mode mixed-pitch-modes)
    (mixed-pitch-mode 1))
  (dolist (hook mixed-pitch-modes)
    (add-hook (intern (concat (symbol-name hook) "-hook")) #'mixed-pitch-mode)))
(add-hook 'doom-init-ui-hook #'init-mixed-pitch-h)
```

As mixed pitch uses the variable `mixed-pitch-face`, we can create a new function
to apply mixed pitch with a serif face instead of the default. This was created
for writeroom mode.

```emacs-lisp
(autoload #'mixed-pitch-serif-mode "mixed-pitch"
  "Change the default face of the current buffer to a serifed variable pitch, while keeping some faces fixed pitch." t)

(after! mixed-pitch
  (defface variable-pitch-serif
    '((t (:family "serif")))
    "A variable-pitch face with serifs."
    :group 'basic-faces)
  (setq mixed-pitch-set-height t)
  (setq variable-pitch-serif-font (font-spec :family "Alegreya" :size 27))
  (set-face-attribute 'variable-pitch-serif nil :font variable-pitch-serif-font)
  (defun mixed-pitch-serif-mode (&optional arg)
    "Change the default face of the current buffer to a serifed variable pitch, while keeping some faces fixed pitch."
    (interactive)
    (let ((mixed-pitch-face 'variable-pitch-serif))
      (mixed-pitch-mode (or arg 'toggle)))))
```

Now, as Harfbuzz is currently used in Emacs, we'll be missing out on the
following Alegreya ligatures:

<style>.org-center { margin-left: auto; margin-right: auto; text-align: center; }</style>

<div class="org-center">

ff _ff_ ffi _ffi_ ffj _ffj_ ffl _ffl_
fft _fft_ fi _fi_ fj _fj_ ft _ft_
Th _Th_

</div>

Thankfully, it isn't to hard to add these to the `composition-function-table`.

```emacs-lisp
(set-char-table-range composition-function-table ?f '(["\\(?:ff?[fijlt]\\)" 0 font-shape-gstring]))
(set-char-table-range composition-function-table ?T '(["\\(?:Th\\)" 0 font-shape-gstring]))
```

</div>

<div class="outline-3 jvc">

#### Marginalia {#marginalia}

> Part of the `:completion vertico` module.

Marginalia is nice, but the file metadata annotations are a little too plain.
Specifically, I have these gripes

-   File attributes would be nicer if colored
-   I don't care about the user/group information if the user/group is me
-   When a file time is recent, a relative age (e.g. `2h ago`) is more useful than
    the date
-   An indication of file fatness would be nice

Thanks to the `marginalia-annotator-registry`, we don't have to advise, we can
just add a new `file` annotator.

Another small thing is the face used for docstrings. At the moment it's `(italic
shadow)`, but I don't like that.

```emacs-lisp
(after! marginalia
  (setq marginalia-censor-variables nil)

  (defadvice! +marginalia--anotate-local-file-colorful (cand)
    "Just a more colourful version of `marginalia--anotate-local-file'."
    :override #'marginalia--annotate-local-file
    (when-let (attrs (file-attributes (substitute-in-file-name
                                       (marginalia--full-candidate cand))
                                      'integer))
      (marginalia--fields
       ((marginalia--file-owner attrs)
        :width 12 :face 'marginalia-file-owner)
       ((marginalia--file-modes attrs))
       ((+marginalia-file-size-colorful (file-attribute-size attrs))
        :width 7)
       ((+marginalia--time-colorful (file-attribute-modification-time attrs))
        :width 12))))

  (defun +marginalia--time-colorful (time)
    (let* ((seconds (float-time (time-subtract (current-time) time)))
           (color (doom-blend
                   (face-attribute 'marginalia-date :foreground nil t)
                   (face-attribute 'marginalia-documentation :foreground nil t)
                   (/ 1.0 (log (+ 3 (/ (+ 1 seconds) 345600.0)))))))
      ;; 1 - log(3 + 1/(days + 1)) % grey
      (propertize (marginalia--time time) 'face (list :foreground color))))

  (defun +marginalia-file-size-colorful (size)
    (let* ((size-index (/ (log10 (+ 1 size)) 7.0))
           (color (if (< size-index 10000000) ; 10m
                      (doom-blend 'orange 'green size-index)
                    (doom-blend 'red 'orange (- size-index 1)))))
      (propertize (file-size-human-readable size) 'face (list :foreground color)))))
```

</div>

<div class="outline-3 jvc">

#### All the icons {#all-the-icons}

> From the `:core packages` module.

`all-the-icons` does a generally great job giving file names icons. One minor
niggle I have is that when _I_ open a `.m` file, it's much more likely to be Matlab
than Objective-C. As such, it'll be switching the icon associated with `.m`.

```emacs-lisp
(after! all-the-icons
  (setcdr (assoc "m" all-the-icons-extension-icon-alist)
          (cdr (assoc "matlab" all-the-icons-extension-icon-alist))))
```

</div>

<div class="outline-3 jvc">

#### Prettier page breaks {#prettier-page-breaks}

In some files, `^L` appears as a page break character. This isn't that visually
appealing, and Steve Purcell has been nice enough to make a package to display
these as horizontal rules.

```emacs-lisp
(package! page-break-lines :recipe (:host github :repo "purcell/page-break-lines")
  :pin "cc283621c64e4f1133a63e0945658a4abecf42ef")
```

```emacs-lisp
(use-package! page-break-lines
  :commands page-break-lines-mode
  :init
  (autoload 'turn-on-page-break-lines-mode "page-break-lines")
  :config
  (setq page-break-lines-max-width fill-column)
  (map! :prefix "g"
        :desc "Prev page break" :nv "[" #'backward-page
        :desc "Next page break" :nv "]" #'forward-page))
```

</div>

<div class="outline-3 jvc">

#### Writeroom {#writeroom}

> From the `:ui zen` module.

For starters, I think Doom is a bit over-zealous when zooming in

```emacs-lisp
(setq +zen-text-scale 0.8)
```

Then, when using Org it would be nice to make a number of other aesthetic
tweaks. Namely:

-   Use a serifed variable-pitch font
-   Hiding headline leading stars
-   Using fleurons as headline bullets
-   Hiding line numbers
-   Removing outline indentation
-   Centring the text

<!--listend-->

```emacs-lisp
(defvar +zen-serif-p t
  "Whether to use a serifed font with `mixed-pitch-mode'.")
(defvar +zen-org-starhide t
  "The value `org-modern-hide-stars' is set to.")

(after! writeroom-mode
  (defvar-local +zen--original-org-indent-mode-p nil)
  (defvar-local +zen--original-mixed-pitch-mode-p nil)
  (defun +zen-enable-mixed-pitch-mode-h ()
    "Enable `mixed-pitch-mode' when in `+zen-mixed-pitch-modes'."
    (when (apply #'derived-mode-p +zen-mixed-pitch-modes)
      (if writeroom-mode
          (progn
            (setq +zen--original-mixed-pitch-mode-p mixed-pitch-mode)
            (funcall (if +zen-serif-p #'mixed-pitch-serif-mode #'mixed-pitch-mode) 1))
        (funcall #'mixed-pitch-mode (if +zen--original-mixed-pitch-mode-p 1 -1)))))
  (pushnew! writeroom--local-variables
            'display-line-numbers
            'visual-fill-column-width
            'org-adapt-indentation
            'org-modern-mode
            'org-modern-star
            'org-modern-hide-stars)
  (add-hook 'writeroom-mode-enable-hook
            (defun +zen-prose-org-h ()
              "Reformat the current Org buffer appearance for prose."
              (when (eq major-mode 'org-mode)
                (setq display-line-numbers nil
                      visual-fill-column-width 60
                      org-adapt-indentation nil)
                (when (modulep 'org-modern)
                  (setq-local org-modern-star '("🙘" "🙙" "🙚" "🙛")
                              ;; org-modern-star '("🙐" "🙑" "🙒" "🙓" "🙔" "🙕" "🙖" "🙗")
                              org-modern-hide-stars +zen-org-starhide)
                  (org-modern-mode -1)
                  (org-modern-mode 1))
                (setq
                 +zen--original-org-indent-mode-p org-indent-mode
                 (org-indent-mode -1))))
            (add-hook 'writeroom-mode-disable-hook
                      (defun +zen-nonprose-org-h ()
                        "Reverse the effect of `+zen-prose-org'."
                        (when (eq major-mode 'org-mode)
                          (when (bound-and-true-p org-modern-mode)
                            (org-modern-mode -1)
                            (org-modern-mode 1))
                          (when +zen--original-org-indent-mode-p (org-indent-mode 1)))))))
```

</div>

<div class="outline-3 jvc">

#### Treemacs {#treemacs}

> From the `:ui treemacs` module.

Quite often there are superfluous files I'm not that interested in. There's no
good reason for them to take up space. Let's add a mechanism to ignore them.

```emacs-lisp
(after! treemacs
  (defvar treemacs-file-ignore-extensions '()
    "File extension which `treemacs-ignore-filter' will ensure are ignored")
  (defvar treemacs-file-ignore-globs '()
    "Globs which will are transformed to `treemacs-file-ignore-regexps' which `treemacs-ignore-filter' will ensure are ignored")
  (defvar treemacs-file-ignore-regexps '()
    "RegExps to be tested to ignore files, generated from `treeemacs-file-ignore-globs'")
  (defun treemacs-file-ignore-generate-regexps ()
    "Generate `treemacs-file-ignore-regexps' from `treemacs-file-ignore-globs'"
    (setq treemacs-file-ignore-regexps (mapcar 'dired-glob-regexp treemacs-file-ignore-globs)))
  (if (equal treemacs-file-ignore-globs '()) nil (treemacs-file-ignore-generate-regexps))
  (defun treemacs-ignore-filter (file full-path)
    "Ignore files specified by `treemacs-file-ignore-extensions', and `treemacs-file-ignore-regexps'"
    (or (member (file-name-extension file) treemacs-file-ignore-extensions)
        (let ((ignore-file nil))
          (dolist (regexp treemacs-file-ignore-regexps ignore-file)
            (setq ignore-file (or ignore-file (if (string-match-p regexp full-path) t nil)))))))
  (add-to-list 'treemacs-ignored-file-predicates #'treemacs-ignore-filter))
```

Now, we just identify the files in question.

```emacs-lisp
(setq treemacs-file-ignore-extensions
      '(;; LaTeX
        "aux"
        "ptc"
        "fdb_latexmk"
        "fls"
        "synctex.gz"
        "toc"
        ;; LaTeX - glossary
        "glg"
        "glo"
        "gls"
        "glsdefs"
        "ist"
        "acn"
        "acr"
        "alg"
        ;; LaTeX - pgfplots
        "mw"
        ;; LaTeX - pdfx
        "pdfa.xmpi"
        ))
(setq treemacs-file-ignore-globs
      '(;; LaTeX
        "*/_minted-*"
        ;; AucTeX
        "*/.auctex-auto"
        "*/_region_.log"
        "*/_region_.tex"))
```

</div>

</div>

<div class="outline-2 jvc">

### Frivolities {#frivolities}

<div class="outline-3 jvc">

#### Wttrin {#wttrin}

Hey, let's get the weather in here while we're at it.
Unfortunately this seems slightly unmaintained ([few open bugfix PRs](https://github.com/bcbcarl/emacs-wttrin/pulls)) so let's
roll our [own version](lisp/wttrin/wttrin.el).

```emacs-lisp
(package! wttrin :recipe (:local-repo "lisp/wttrin"))
```

```emacs-lisp
(use-package! wttrin
  :commands wttrin)
```

</div>

<div class="outline-3 jvc">

#### Elcord {#elcord}

What's even the point of using Emacs unless you're constantly telling everyone
about it?

```emacs-lisp
(package! elcord :pin "70fd716e673b724b30b921f4cfa0033f9c02d0f2")
```

```emacs-lisp
(use-package! elcord
  :commands elcord-mode
  :config
  (setq elcord-use-major-mode-as-main-icon t))
```

</div>

<div class="outline-3 jvc">

#### Smudge {#smudge}

Spotify! Need to set this up in such a way later that I don't expose my keys. Commented out for now.

</div>

</div>

</div>

<div class="outline-1 jvc">

## File types {#file-types}

<div class="outline-3 jvc">

#### Authinfo {#authinfo}

My patch giving my patch giving `authinfo-mode` syntax highlighting is only
available in Emacs28+. For older versions, I've got a package I can use.

```emacs-lisp
(package! authinfo-color-mode
  :recipe (:local-repo "lisp/authinfo-color-mode"))
```

Now we just need to load it appropriately.

```emacs-lisp
(use-package! authinfo-color-mode
  :mode ("authinfo.gpg\\'" . authinfo-color-mode)
  :init (advice-add 'authinfo-mode :override #'authinfo-color-mode))
```

</div>

<div class="outline-3 jvc">

#### Systemd {#systemd}

For editing systemd unit files

```emacs-lisp
(package! systemd :pin "b6ae63a236605b1c5e1069f7d3afe06ae32a7bae")
```

```emacs-lisp
(use-package! systemd
  :defer t)
```

</div>

</div>

<div class="outline-1 jvc">

## Applications {#applications}

<div class="outline-2 jvc">

### Bookmarking {#bookmarking}

There are bookmarking services that are still popular. There's a myriad of options like Pocket,
but I'm a fan of OSS solutions. Ideally, I'd just log everything in org-mode but
I've had trouble with org-capture (as of writing, maybe I'll fix it and forget
to change this) - also it'd be nice to have it easily go to the phone.

<div class="outline-3 jvc">

#### Pocket {#pocket}

The software, Pocket is Mozilla's link sharing thingy-ma-jig. It's not FOSS, but easy online
access + a good emacs package make it a decent choice for someone who doesn't
want to deal with the rigamarole around self-hosting internet exposed apps.
(if you add a link at home, then want to read it at work, etc.)

```emacs-lisp
(package! pocket-reader)
```

```emacs-lisp
(use-package! pocket-reader
  :after elfeed
  :demand t
  :config
  (message "pocket-reader loaded"))
```

```emacs-lisp
(map! :map pocket-reader-mode-map
      :after pocket-reader
      :nm "d" #'pocket-reader-delete
      :nm "a" #'pocket-reader-toggle-archived
      :nm "TAB" #'pocket-reader-open-url
      :nm "b" #'pocket-reader-open-in-external-browser
      :nm "tr" #'pocket-reader-remove-tags
      :nm "ta" #'pocket-reader-add-tags
      :nm "gr" #'pocket-reader-refresh
      :nm "p" #'pocket-reader-search
      :nm "y" #'pocket-reader-copy-url)
```

</div>

</div>

<div class="outline-2 jvc">

### Calculator {#calculator}

Emacs includes the venerable `calc`, which is a pretty impressive RPN (Reverse
Polish Notation) calculator. However, we can do a bit to improve the experience.

<div class="outline-3 jvc">

#### Defaults {#defaults}

Any sane person prefers radians and exact values.

```emacs-lisp
(setq calc-angle-mode 'rad  ; radians are rad
      calc-symbolic-mode t) ; keeps expressions like \sqrt{2} irrational for as long as possible
```

</div>

<div class="outline-3 jvc">

#### CalcTeX {#calctex}

Everybody knows that mathematical expressions look best with LaTeX, so `calc`'s
ability to create LaTeX representations of its expressions provides a lovely
opportunity which takes advantage of in the CalcTeX package.

```emacs-lisp
(package! calctex :recipe (:host github :repo "johnbcoughlin/calctex"
                           :files ("*.el" "calctex/*.el" "calctex-contrib/*.el" "org-calctex/*.el" "vendor"))
  :pin "67a2e76847a9ea9eff1f8e4eb37607f84b380ebb")
```

We'd like to use CalcTeX too, so let's set that up, and fix some glaring
inadequacies --- why on earth would you commit a hard-coded path to an executable
that _only works on your local machine_, consequently breaking the package for
everyone else!?

```emacs-lisp
(use-package! calctex
  :commands calctex-mode
  :init
  (add-hook 'calc-mode-hook #'calctex-mode)
  :config
  (setq calctex-additional-latex-packages "
\\usepackage[usenames]{xcolor}
\\usepackage{soul}
\\usepackage{adjustbox}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{siunitx}
\\usepackage{cancel}
\\usepackage{mathtools}
\\usepackage{mathalpha}
\\usepackage{xparse}
\\usepackage{arevmath}"
        calctex-additional-latex-macros
        (concat calctex-additional-latex-macros
                "\n\\let\\evalto\\Rightarrow"))
  (defadvice! no-messaging-a (orig-fn &rest args)
    :around #'calctex-default-dispatching-render-process
    (let ((inhibit-message t) message-log-max)
      (apply orig-fn args)))
  ;; Fix hardcoded dvichop path (whyyyyyyy)
  (let ((vendor-folder (concat (file-truename doom-local-dir)
                               "straight/"
                               (format "build-%s" emacs-version)
                               "/calctex/vendor/")))
    (setq calctex-dvichop-sty (concat vendor-folder "texd/dvichop")
          calctex-dvichop-bin (concat vendor-folder "texd/dvichop")))
  (unless (file-exists-p calctex-dvichop-bin)
    (message "CalcTeX: Building dvichop binary")
    (let ((default-directory (file-name-directory calctex-dvichop-bin)))
      (call-process "make" nil nil nil))))
```

</div>

<div class="outline-3 jvc">

#### Embedded calc {#embedded-calc}

Embedded calc is a lovely feature which let's us use calc to operate on LaTeX
math expressions. The standard keybinding is a bit janky however (`C-x * e`), so
we'll add a localleader-based alternative.

```emacs-lisp
(map! :map calc-mode-map
      :after calc
      :localleader
      :desc "Embedded calc (toggle)" "e" #'calc-embedded)
(map! :map org-mode-map
      :after org
      :localleader
      :desc "Embedded calc (toggle)" "E" #'calc-embedded)
(map! :map latex-mode-map
      :after latex
      :localleader
      :desc "Embedded calc (toggle)" "e" #'calc-embedded)
```

Unfortunately this operates without the (rather informative) calculator and
trail buffers, but we can advice it that we would rather like those in a side
panel.

```emacs-lisp
(defvar calc-embedded-trail-window nil)
(defvar calc-embedded-calculator-window nil)

(defadvice! calc-embedded-with-side-pannel (&rest _)
  :after #'calc-do-embedded
  (when calc-embedded-trail-window
    (ignore-errors
      (delete-window calc-embedded-trail-window))
    (setq calc-embedded-trail-window nil))
  (when calc-embedded-calculator-window
    (ignore-errors
      (delete-window calc-embedded-calculator-window))
    (setq calc-embedded-calculator-window nil))
  (when (and calc-embedded-info
             (> (* (window-width) (window-height)) 1200))
    (let ((main-window (selected-window))
          (vertical-p (> (window-width) 80)))
      (select-window
       (setq calc-embedded-trail-window
             (if vertical-p
                 (split-window-horizontally (- (max 30 (/ (window-width) 3))))
               (split-window-vertically (- (max 8 (/ (window-height) 4)))))))
      (switch-to-buffer "*Calc Trail*")
      (select-window
       (setq calc-embedded-calculator-window
             (if vertical-p
                 (split-window-vertically -6)
               (split-window-horizontally (- (/ (window-width) 2))))))
      (switch-to-buffer "*Calculator*")
      (select-window main-window))))
```

</div>

</div>

<div class="outline-2 jvc">

### Ebooks {#ebooks}

For managing my ebooks, I'll hook into the well-established ebook library
manager [calibre](https://calibre-ebook.com/). A number of Emacs clients for this exist, but this seems like a
good option.

```emacs-lisp
(package! calibredb :pin "2f2cfc38f2d1c705134b692127c3008ac1382482")
```

Then for reading them, the only currently viable options seems to be [nov.el](https://depp.brause.cc/nov.el/).

```emacs-lisp
(package! nov :pin "8f5b42e9d9f304b422c1a7918b43ee323a7d3532")
```

Together these should give me a rather good experience reading ebooks.

`calibredb` lets us use calibre through Emacs, because who wouldn't want to use
something through Emacs?

```emacs-lisp
(use-package! calibredb
  :commands calibredb
  :config
  (setq calibredb-root-dir "~/Documents/Library"
        calibredb-db-dir (expand-file-name "metadata.db" calibredb-root-dir))
  (map! :map calibredb-show-mode-map
        :ne "?" #'calibredb-entry-dispatch
        :ne "o" #'calibredb-find-file
        :ne "O" #'calibredb-find-file-other-frame
        :ne "V" #'calibredb-open-file-with-default-tool
        :ne "s" #'calibredb-set-metadata-dispatch
        :ne "e" #'calibredb-export-dispatch
        :ne "q" #'calibredb-entry-quit
        :ne "." #'calibredb-open-dired
        :ne [tab] #'calibredb-toggle-view-at-point
        :ne "M-t" #'calibredb-set-metadata--tags
        :ne "M-a" #'calibredb-set-metadata--author_sort
        :ne "M-A" #'calibredb-set-metadata--authors
        :ne "M-T" #'calibredb-set-metadata--title
        :ne "M-c" #'calibredb-set-metadata--comments)
  (map! :map calibredb-search-mode-map
        :ne [mouse-3] #'calibredb-search-mouse
        :ne "RET" #'calibredb-find-file
        :ne "?" #'calibredb-dispatch
        :ne "a" #'calibredb-add
        :ne "A" #'calibredb-add-dir
        :ne "c" #'calibredb-clone
        :ne "d" #'calibredb-remove
        :ne "D" #'calibredb-remove-marked-items
        :ne "j" #'calibredb-next-entry
        :ne "k" #'calibredb-previous-entry
        :ne "l" #'calibredb-virtual-library-list
        :ne "L" #'calibredb-library-list
        :ne "n" #'calibredb-virtual-library-next
        :ne "N" #'calibredb-library-next
        :ne "p" #'calibredb-virtual-library-previous
        :ne "P" #'calibredb-library-previous
        :ne "s" #'calibredb-set-metadata-dispatch
        :ne "S" #'calibredb-switch-library
        :ne "o" #'calibredb-find-file
        :ne "O" #'calibredb-find-file-other-frame
        :ne "v" #'calibredb-view
        :ne "V" #'calibredb-open-file-with-default-tool
        :ne "." #'calibredb-open-dired
        :ne "b" #'calibredb-catalog-bib-dispatch
        :ne "e" #'calibredb-export-dispatch
        :ne "r" #'calibredb-search-refresh-and-clear-filter
        :ne "R" #'calibredb-search-clear-filter
        :ne "q" #'calibredb-search-quit
        :ne "m" #'calibredb-mark-and-forward
        :ne "f" #'calibredb-toggle-favorite-at-point
        :ne "x" #'calibredb-toggle-archive-at-point
        :ne "h" #'calibredb-toggle-highlight-at-point
        :ne "u" #'calibredb-unmark-and-forward
        :ne "i" #'calibredb-edit-annotation
        :ne "DEL" #'calibredb-unmark-and-backward
        :ne [backtab] #'calibredb-toggle-view
        :ne [tab] #'calibredb-toggle-view-at-point
        :ne "M-n" #'calibredb-show-next-entry
        :ne "M-p" #'calibredb-show-previous-entry
        :ne "/" #'calibredb-search-live-filter
        :ne "M-t" #'calibredb-set-metadata--tags
        :ne "M-a" #'calibredb-set-metadata--author_sort
        :ne "M-A" #'calibredb-set-metadata--authors
        :ne "M-T" #'calibredb-set-metadata--title
        :ne "M-c" #'calibredb-set-metadata--comments))
```

Then, to actually read the ebooks we use `nov`.

```emacs-lisp
(use-package! nov
  :mode ("\\.epub\\'" . nov-mode)
  :config
  (map! :map nov-mode-map
        :n "RET" #'nov-scroll-up)

  (defun doom-modeline-segment--nov-info ()
    (concat
     " "
     (propertize
      (cdr (assoc 'creator nov-metadata))
      'face 'doom-modeline-project-parent-dir)
     " "
     (cdr (assoc 'title nov-metadata))
     " "
     (propertize
      (format "%d/%d"
              (1+ nov-documents-index)
              (length nov-documents))
      'face 'doom-modeline-info)))

  (advice-add 'nov-render-title :override #'ignore)

  (defun +nov-mode-setup ()
    (face-remap-add-relative 'variable-pitch
                             :family "Merriweather"
                             :height 1.4
                             :width 'semi-expanded)
    (face-remap-add-relative 'default :height 1.3)
    (setq-local line-spacing 0.2
                next-screen-context-lines 4
                shr-use-colors nil)
    (require 'visual-fill-column nil t)
    (setq-local visual-fill-column-center-text t
                visual-fill-column-width 81
                nov-text-width 80)
    (visual-fill-column-mode 1)
    (hl-line-mode -1)

    (add-to-list '+lookup-definition-functions #'+lookup/dictionary-definition)

    (setq-local mode-line-format
                `((:eval
                   (doom-modeline-segment--workspace-name))
                  (:eval
                   (doom-modeline-segment--window-number))
                  (:eval
                   (doom-modeline-segment--nov-info))
                  ,(propertize
                    " %P "
                    'face 'doom-modeline-buffer-minor-mode)
                  ,(propertize
                    " "
                    'face (if (doom-modeline--active) 'mode-line 'mode-line-inactive)
                    'display `((space
                                :align-to
                                (- (+ right right-fringe right-margin)
                                   ,(* (let ((width (doom-modeline--font-width)))
                                         (or (and (= width 1) 1)
                                             (/ width (frame-char-width) 1.0)))
                                       (string-width
                                        (format-mode-line (cons "" '(:eval (doom-modeline-segment--major-mode))))))))))
                  (:eval (doom-modeline-segment--major-mode)))))

  (add-hook 'nov-mode-hook #'+nov-mode-setup))
```

</div>

<div class="outline-2 jvc">

### Newsfeed {#newsfeed}

RSS feeds are still a thing. Why not make use of them with `elfeed`.
I really like what [fuxialexander](https://github.com/fuxialexander/doom-emacs-private-xfu/tree/master/modules/app/rss) has going on, but I don't think I need a custom
module. Let's just try to patch on the main things I like the look of.

<div class="outline-3 jvc">

#### Setup {#setup}

By default it uses the .emacs.d folder, I prefer keeping the configs in the doom
folder with my literate config.

```emacs-lisp
(setq rmh-elfeed-org-files (list "~/.doom.d/elfeed.org"))
```

New package for integrating youtube into elfeed, pretty neat.

```emacs-lisp
(package! elfeed-tube :recipe (:host github :repo  "karthink/elfeed-tube"))
(package! aio)
```

```emacs-lisp
(use-package! elfeed-tube
  :after elfeed
  :demand t
  :config
  ;; (setq elfeed-tube-auto-save-p nil) ;; t is auto-save (not default)
   (setq elfeed-tube-auto-fetch-p t) ;;  t is auto-fetch (default)
  (elfeed-tube-setup)

  :bind (:map elfeed-show-mode-map
         ("F" . elfeed-tube-fetch)
         ([remap save-buffer] . elfeed-tube-save)
         :map elfeed-search-mode-map
         ("F" . elfeed-tube-fetch)
         ([remap save-buffer] . elfeed-tube-save)))
```

</div>

<div class="outline-3 jvc">

#### Scoring {#scoring}

Using elfeed-score to sort my newsfeed by a point value that I determine.

```emacs-lisp
(package! elfeed-score)
```

Another case of moving the config file to the doom folder for ease of tracking.
It's simply a plain text with a elisp s-expression as noted here:
<https://www.unwoundstack.com/doc/elfeed-score/curr#The-Score-File>

```emacs-lisp
(after! elfeed
(require 'elfeed-score)
(elfeed-score-enable)
(setq elfeed-score-serde-score-file "~/.doom.d/elfeed.score"))
```

</div>

<div class="outline-3 jvc">

#### Summary {#summary}

Adding a dashboard style [summary](https://github.com/SqrtMinusOne/elfeed-summary) into the newsfeed.

```emacs-lisp
(package! elfeed-summary)
```

TODO: need to clean this up, using the template config from the git repo.

```emacs-lisp
(setq elfeed-summary-settings
      '(
        (group (:title . "Blogs [People]")
               (:elements
                (query . (and blogs people (not emacs)))
                (group (:title . "Emacs")
                       (:elements
                        (query . (and blogs people emacs))))))
        (group (:title . "Link Aggregators")
               (:elements
                (query . agg)))
        (group (:title . "Blogs")
               (:elements
                (group
                 (:title . "Religion")
                 (:elements
                  (query . religion)))
                (group
                 (:title . "Substack")
                 (:elements
                  (query . substack)))
                (group
                 (:title . "Other")
                 (:elements
                  (query . (and blog (not substack religion)))))))
                ;; ...

        (group (:title . "Videos")
               (:elements
                (query . youtube)))

        (group (:title . "Podcasts")
               (:elements
                (query . podcast)))

        (group (:title . "News")
               (:elements
                (query . news)))
        (group (:title . "Webcomics")
               (:elements
                (query . comics)))
        (group (:title . "Literary")
               (:elements
                (query . literary)))
        ;; ...
        (group (:title . "Miscellaneous")
               (:elements
                (group
                 (:title . "Searches")
                 (:elements
                  (search
                   (:filter . "@6-months-ago sqrtminusone")
                   (:title . "About me"))
                  (search
                   (:filter . "+later")
                   (:title . "Check later"))))
                (group
                 (:title . "Ungrouped")
                 (:elements :misc))))))
```

</div>

<div class="outline-3 jvc">

#### Keybindings {#keybindings}

Elfeed keybindings. Easier to push in one place.

```emacs-lisp
(map! :map elfeed-search-mode-map
      :after elfeed-search
      [remap kill-this-buffer] "q"
      [remap kill-buffer] "q"
      :n doom-leader-key nil
      :n "a" #'pocket-reader-elfeed-search-add-link
      :n "q" #'+rss/quit
      :n "e" #'elfeed-update
      :n "r" #'elfeed-search-untag-all-unread
      :n "u" #'elfeed-search-tag-all-unread
      :n "s" #'elfeed-search-live-filter
      :n "RET" #'elfeed-search-show-entry
      :n "p" #'elfeed-show-pdf
      :n "+" #'elfeed-search-tag-all
      :n "-" #'elfeed-search-untag-all
      :n "S" #'elfeed-search-set-filter
      :n "b" #'elfeed-search-browse-url
      :n "y" #'elfeed-search-yank)
(map! :map elfeed-show-mode-map
      :after elfeed-show
      [remap kill-this-buffer] "q"
      [remap kill-buffer] "q"
      :n doom-leader-key nil
      :nm "q" #'+rss/delete-pane
      :nm "o" #'ace-link-elfeed
      :nm "RET" #'org-ref-elfeed-add
      :nm "n" #'elfeed-show-next
      :nm "N" #'elfeed-show-prev
      :nm "p" #'elfeed-show-pdf
      :nm "+" #'elfeed-show-tag
      :nm "-" #'elfeed-show-untag
      :nm "s" #'elfeed-show-new-live-search
      :nm "y" #'elfeed-show-yank)
```

</div>

<div class="outline-3 jvc">

#### Usability enhancements {#usability-enhancements}

```emacs-lisp
(after! elfeed-search
  (set-evil-initial-state! 'elfeed-search-mode 'normal))
(after! elfeed-show-mode
  (set-evil-initial-state! 'elfeed-show-mode   'normal))

(after! evil-snipe
  (push 'elfeed-show-mode   evil-snipe-disabled-modes)
  (push 'elfeed-search-mode evil-snipe-disabled-modes))
```

</div>

<div class="outline-3 jvc">

#### Visual enhancements {#visual-enhancements}

```emacs-lisp
(after! elfeed

  (elfeed-org)
  (use-package! elfeed-link)

  (setq elfeed-search-filter "@3-days-ago +unread -agg -freq -notes"
        elfeed-search-print-entry-function '+rss/elfeed-search-print-entry
        ;elfeed-search-title-min-width 60
        elfeed-show-entry-switch #'pop-to-buffer
        elfeed-show-entry-delete #'+rss/delete-pane
        elfeed-show-refresh-function #'+rss/elfeed-show-refresh--better-style
        shr-max-image-proportion 0.6)

  (add-hook! 'elfeed-show-mode-hook (hide-mode-line-mode 1))
  (add-hook! 'elfeed-search-update-hook #'hide-mode-line-mode)

  (defface elfeed-show-title-face '((t (:weight ultrabold :slant italic :height 1.5)))
    "title face in elfeed show buffer"
    :group 'elfeed)
  (defface elfeed-show-author-face `((t (:weight light)))
    "title face in elfeed show buffer"
    :group 'elfeed)
  (set-face-attribute 'elfeed-search-title-face nil
                      :foreground 'nil
                      :weight 'light)

  (defadvice! +rss-elfeed-wrap-h-nicer ()
    "Enhances an elfeed entry's readability by wrapping it to a width of
`fill-column' and centering it with `visual-fill-column-mode'."
    :override #'+rss-elfeed-wrap-h
    (setq-local truncate-lines nil
                shr-width 120
                visual-fill-column-center-text t
                default-text-properties '(line-height 1.1))
    (let ((inhibit-read-only t)
          (inhibit-modification-hooks t))
      (visual-fill-column-mode)
      ;; (setq-local shr-current-font '(:family "Merriweather" :height 1.2))
      (set-buffer-modified-p nil)))

  (defvar elfeed-goodies/date-column-width 12)
  (defun +rss/elfeed-search-print-entry (entry)
   "Print ENTRY to the buffer."
   (let* ((elfeed-goodies/tag-column-width 15)
          (elfeed-goodies/feed-source-column-width 20)
          (date (format-time-string "%Y-%m-%d"
                  (seconds-to-time (elfeed-entry-date entry))))
          (date-column (elfeed-format-column
                        date (elfeed-clamp elfeed-goodies/date-column-width
                                            elfeed-goodies/date-column-width
                                            elfeed-goodies/date-column-width)
                        :left))
          (title (or (elfeed-meta entry :title) (elfeed-entry-title entry) ""))
          (title-faces (elfeed-search--faces (elfeed-entry-tags entry)))
          (feed (elfeed-entry-feed entry))
          (feed-title
           (when feed
               (or (elfeed-meta feed :title) (elfeed-feed-title feed))))
          (tags (mapcar #'symbol-name (elfeed-entry-tags entry)))
          (tags-str (concat (mapconcat 'identity tags ",")))
          (title-width (- (window-width)
                          elfeed-goodies/feed-source-column-width
                          elfeed-goodies/tag-column-width
                          elfeed-goodies/date-column-width
                          6))  ; Adjust the 6 if you're adding more/less space

          (tag-column (elfeed-format-column
                       tags-str (elfeed-clamp (length tags-str)
                                              elfeed-goodies/tag-column-width
                                              elfeed-goodies/tag-column-width)
                       :left))
          (feed-column (elfeed-format-column
                        feed-title (elfeed-clamp elfeed-goodies/feed-source-column-width
                                                    elfeed-goodies/feed-source-column-width
                                                    elfeed-goodies/feed-source-column-width)
                        :left)))

       (insert (propertize date-column 'face 'elfeed-search-date-face) " ")
       (insert (propertize feed-column 'face 'elfeed-search-feed-face) " ")
       (insert (propertize title       'face title-faces 'kbd-help title) " ")
       (insert (propertize tag-column  'face 'elfeed-search-tag-face) " ")
       (setq-local line-spacing 0.2)))

  (defun +rss/elfeed-show-refresh--better-style ()
    "Update the buffer to match the selected entry, using a mail-style."
    (interactive)
    (let* ((inhibit-read-only t)
           (title (elfeed-entry-title elfeed-show-entry))
           (date (seconds-to-time (elfeed-entry-date elfeed-show-entry)))
           (author (elfeed-meta elfeed-show-entry :author))
           (link (elfeed-entry-link elfeed-show-entry))
           (tags (elfeed-entry-tags elfeed-show-entry))
           (tagsstr (mapconcat #'symbol-name tags ", "))
           (nicedate (format-time-string "%a, %e %b %Y %T %Z" date))
           (content (elfeed-deref (elfeed-entry-content elfeed-show-entry)))
           (type (elfeed-entry-content-type elfeed-show-entry))
           (feed (elfeed-entry-feed elfeed-show-entry))
           (feed-title (elfeed-feed-title feed))
           (base (and feed (elfeed-compute-base (elfeed-feed-url feed)))))
      (erase-buffer)
      (insert "\n")
      (insert (format "%s\n\n" (propertize title 'face 'elfeed-show-title-face)))
      (insert (format "%s\t" (propertize feed-title 'face 'elfeed-search-feed-face)))
      (when (and author elfeed-show-entry-author)
        (insert (format "%s\n" (propertize author 'face 'elfeed-show-author-face))))
      (insert (format "%s\n\n" (propertize nicedate 'face 'elfeed-log-date-face)))
      (when tags
        (insert (format "%s\n"
                        (propertize tagsstr 'face 'elfeed-search-tag-face))))
      ;; (insert (propertize "Link: " 'face 'message-header-name))
      ;; (elfeed-insert-link link link)
      ;; (insert "\n")
      (cl-loop for enclosure in (elfeed-entry-enclosures elfeed-show-entry)
               do (insert (propertize "Enclosure: " 'face 'message-header-name))
               do (elfeed-insert-link (car enclosure))
               do (insert "\n"))
      (insert "\n")
      (if content
          (if (eq type 'html)
              (elfeed-insert-html content base)
            (insert content))
        (insert (propertize "(empty)\n" 'face 'italic)))
      (goto-char (point-min)))))


```

</div>

<div class="outline-3 jvc">

#### Functionality enhancements {#functionality-enhancements}

```emacs-lisp
(after! elfeed-show
  (require 'url)

  (defvar elfeed-pdf-dir
    (expand-file-name "pdfs/"
                      (file-name-directory (directory-file-name elfeed-enclosure-default-dir))))

  (defvar elfeed-link-pdfs
    '(("https://www.jstatsoft.org/index.php/jss/article/view/v0\\([^/]+\\)" . "https://www.jstatsoft.org/index.php/jss/article/view/v0\\1/v\\1.pdf")
      ("http://arxiv.org/abs/\\([^/]+\\)" . "https://arxiv.org/pdf/\\1.pdf"))
    "List of alists of the form (REGEX-FOR-LINK . FORM-FOR-PDF)")

  (defun elfeed-show-pdf (entry)
    (interactive
     (list (or elfeed-show-entry (elfeed-search-selected :ignore-region))))
    (let ((link (elfeed-entry-link entry))
          (feed-name (plist-get (elfeed-feed-meta (elfeed-entry-feed entry)) :title))
          (title (elfeed-entry-title entry))
          (file-view-function
           (lambda (f)
             (when elfeed-show-entry
               (elfeed-kill-buffer))
             (pop-to-buffer (find-file-noselect f))))
          pdf)

      (let ((file (expand-file-name
                   (concat (subst-char-in-string ?/ ?, title) ".pdf")
                   (expand-file-name (subst-char-in-string ?/ ?, feed-name)
                                     elfeed-pdf-dir))))
        (if (file-exists-p file)
            (funcall file-view-function file)
          (dolist (link-pdf elfeed-link-pdfs)
            (when (and (string-match-p (car link-pdf) link)
                       (not pdf))
              (setq pdf (replace-regexp-in-string (car link-pdf) (cdr link-pdf) link))))
          (if (not pdf)
              (message "No associated PDF for entry")
            (message "Fetching %s" pdf)
            (unless (file-exists-p (file-name-directory file))
              (make-directory (file-name-directory file) t))
            (url-copy-file pdf file)
            (funcall file-view-function file))))))

  )
```

</div>

</div>

</div>

<div class="outline-1 jvc">

## Language configuration {#language-configuration}

<div class="outline-2 jvc">

### General {#general}

<div class="outline-3 jvc">

#### File Templates {#file-templates}

For some file types, we overwrite defaults in the [snippets](./snippets) directory, others
need to have a template assigned.

```emacs-lisp
(set-file-template! "\\.tex$" :trigger "__" :mode 'latex-mode)
(set-file-template! "\\.org$" :trigger "__" :mode 'org-mode)
(set-file-template! "/LICEN[CS]E$" :trigger '+file-templates/insert-license)
```

</div>

</div>

<div class="outline-2 jvc">

### Org {#org}

Finally, because this section is expensive to initialize, we'll wrap it
in an <span class="inline-src language-elisp" data-lang="elisp">`(after! ...)`</span> block.

```emacs-lisp
(after! org
  <<org-conf>>
)
```

<div class="outline-3 jvc">

#### System config {#system-config}

<div class="outline-4 jvc">

##### Misc Config {#misc-config}

Miscellaneous things I've noticed I've had to change (for some reason this
defaulted to org - unknown why)

```emacs-lisp
(setq org-id-locations-file "~/.org/.orgids")
```

</div>

<div class="outline-4 jvc">

##### Mime types {#mime-types}

Org mode isn't recognized as it's own mime type by default, but that can easily
be changed with the following file. For system-wide changes try
`/usr/share/mime/packages/org.xml`.

```xml
<mime-info xmlns='http://www.freedesktop.org/standards/shared-mime-info'>
  <mime-type type="text/org">
    <comment>Emacs Org-mode File</comment>
    <glob pattern="*.org"/>
    <alias type="text/org"/>
  </mime-type>
</mime-info>
```

What's nice is that Papirus [now](https://github.com/PapirusDevelopmentTeam/papirus-icon-theme/commit/a10fb7f2423d5e30b9c4477416ccdc93c4f3849d) has an icon for `text/org`.
One simply needs to refresh their mime database

```shell
update-mime-database ~/.local/share/mime
```

Then set Emacs as the default editor

```shell
xdg-mime default emacs.desktop text/org
```

</div>

<div class="outline-4 jvc">

##### Git diffs {#git-diffs}

Protesilaos wrote a [very helpful article](https://protesilaos.com/codelog/2021-01-26-git-diff-hunk-elisp-org/) in which he explains how to change the
git diff chunk heading to something more useful than just the immediate line
above the hunk --- like the parent heading.

This can be achieved by first adding a new diff mode to git in `~/.config/git/attributes`

```fundamental
*.org   diff=org
```

Then adding a regex for it to `~/.config/git/config`

```gitconfig
[diff "org"]
  xfuncname = "^(\\*+ +.*)$"
```

</div>

</div>

<div class="outline-3 jvc">

#### Packages {#packages}

<div class="outline-4 jvc">

##### Visuals {#visuals}

<div class="outline-5 jvc">

###### Org Modern {#org-modern}

Fontifying `org-mode` buffers to be as pretty as possible is of paramount importance,
and Minad's lovely `org-modern` goes a long way in this regard.

```emacs-lisp
(package! org-modern)
```

...with a touch of configuration...

```emacs-lisp
(use-package! org-modern
  :hook (org-mode . org-modern-mode)
  :config
  (setq org-modern-star ["◉" "○" "✸" "✿" "✤" "✜" "◆" "▶"]
        org-modern-table-vertical 1
        org-modern-table-horizontal 0.2
        org-modern-list '((43 . "➤")
                          (45 . "–")
                          (42 . "•"))
        org-modern-todo-faces
        '(("TODO" :inverse-video t :inherit org-todo)
          ("PROJ" :inverse-video t :inherit +org-todo-project)
          ("STRT" :inverse-video t :inherit +org-todo-active)
          ("[-]"  :inverse-video t :inherit +org-todo-active)
          ("HOLD" :inverse-video t :inherit +org-todo-onhold)
          ("WAIT" :inverse-video t :inherit +org-todo-onhold)
          ("[?]"  :inverse-video t :inherit +org-todo-onhold)
          ("KILL" :inverse-video t :inherit +org-todo-cancel)
          ("NO"   :inverse-video t :inherit +org-todo-cancel))
        org-modern-footnote
        (cons nil (cadr org-script-display))
  )
  (custom-set-faces! '(org-modern-statistics :inherit org-checkbox-statistics-todo)))

(setq org-modern-priority t)
```

Since `org-modern`'s tag face supplants Org's tag face, we need to adjust the
spell-check face ignore list

```emacs-lisp
(after! spell-fu
  (cl-pushnew 'org-modern-tag (alist-get 'org-mode +spell-excluded-faces-alist)))
```

</div>

<div class="outline-5 jvc">

###### Emphasis markers {#emphasis-markers}

While `org-hide-emphasis-markers` is nice, it can sometimes make edits which
occur at the border a bit more fiddly. We can improve this situation without
sacrificing visual amenities with the `org-appear` package.

```emacs-lisp
(package! org-appear :recipe (:host github :repo "awth13/org-appear")
  :pin "60ba267c5da336e75e603f8c7ab3f44e6f4e4dac")
```

```emacs-lisp
(use-package! org-appear
  :hook (org-mode . org-appear-mode)
  :config
  (setq org-appear-autoemphasis t
        org-appear-autosubmarkers t
        org-appear-autolinks nil)
  ;; for proper first-time setup, `org-appear--set-elements'
  ;; needs to be run after other hooks have acted.
  (run-at-time nil nil #'org-appear--set-elements))
```

</div>

<div class="outline-5 jvc">

###### Heading structure {#heading-structure}

Speaking of headlines, a nice package for viewing and managing the heading
structure has come to my attention.

```emacs-lisp
(package! org-ol-tree :recipe (:host github :repo "Townk/org-ol-tree")
  :pin "207c748aa5fea8626be619e8c55bdb1c16118c25")
```

We'll bind this to `O` on the org-mode localleader, and manually apply a [PR
recognizing the pgtk window system](https://github.com/Townk/org-ol-tree/pull/13).

```emacs-lisp
(use-package! org-ol-tree
  :commands org-ol-tree
  :config
(setq org-ol-tree-ui-icon-set
        (if (and (display-graphic-p)
                 (fboundp 'all-the-icons-material))
            'all-the-icons
          'unicode))
  (org-ol-tree-ui--update-icon-set))
(map! :map org-mode-map
      :after org
      :localleader
      :desc "Outline" "O" #'org-ol-tree)
```

</div>

</div>

<div class="outline-4 jvc">

##### Extra functionality {#extra-functionality}

<div class="outline-5 jvc">

###### Julia support {#julia-support}

`ob-julia` is currently a bit borked, but there's an effort to improve this.
Additionally, `ox-pluto` allows working with org files within Julia.

```emacs-lisp
(package! ob-julia :recipe (:local-repo "lisp/ob-julia" :files ("*.el")))
(package! ox-pluto :recipe (:host github :repo "tecosaur/ox-pluto"))
```

```emacs-lisp
(use-package! ob-julia
  :commands org-babel-execute:julia)
```

</div>

<div class="outline-5 jvc">

###### HTTP requests {#http-requests}

I like the idea of being able to make HTTP requests with Babel.

```emacs-lisp
(package! ob-http :pin "b1428ea2a63bcb510e7382a1bf5fe82b19c104a7")
```

```emacs-lisp
(use-package! ob-http
  :commands org-babel-execute:http)
```

</div>

<div class="outline-5 jvc">

###### Transclusion {#transclusion}

There's a really cool package in development to _transclude_ Org document content.

```emacs-lisp
(package! org-transclusion :recipe (:host github :repo "nobiot/org-transclusion"))
```

```emacs-lisp
(use-package! org-transclusion
  :after org
  :commands org-transclusion-mode
  :init
  (map! :map org-mode-map
        "<f12>" #'org-transclusion-mode))

(after! org-transclusion
  (set-face-attribute 'org-transclusion-fringe nil
                      :background "orange"
                      :foreground "black")
  (set-face-attribute 'org-transclusion-source-fringe nil
                      :background "purple"
                      :foreground "green"))
```

```emacs-lisp
(fringe-mode '(15 . 15))  ; This sets both left and right fringes to 8 pixels
```

</div>

<div class="outline-5 jvc">

###### Restore pdf views {#restore-pdf-views}

```emacs-lisp
(package! pdf-view-restore)
```

```emacs-lisp
(use-package! pdf-view-restore
  :after pdf-tools
  :config
  (add-hook 'pdf-view-mode-hook 'pdf-view-restore-mode))
```

</div>

<div class="outline-5 jvc">

###### Heading graph {#heading-graph}

Came across this and ... it's cool

```emacs-lisp
(package! org-graph-view :recipe (:host github :repo "alphapapa/org-graph-view") :pin "233c6708c1f37fc60604de49ca192497aef39757")
```

</div>

<div class="outline-5 jvc">

###### Cooking recipes {#cooking-recipes}

I **need** this in my life. It take a URL to a recipe from a common site, and
inserts an org-ified version at point. Isn't that just great.

```emacs-lisp
(package! org-chef :pin "6a786e77e67a715b3cd4f5128b59d501614928af")
```

Loading after org seems a bit premature. Let's just load it when we try to use
it, either by command or in a capture template.

```emacs-lisp
(use-package! org-chef
  :commands (org-chef-insert-recipe org-chef-get-recipe-from-url))
```

</div>

<div class="outline-5 jvc">

###### Org-anki {#org-anki}

I like anki. Especially for learning languages.

```emacs-lisp
(package! org-anki)
```

```emacs-lisp
(use-package! org-anki
  :after org
  :config
  (setq org-anki-default-deck "Default")
)
```

</div>

<div class="outline-5 jvc">

###### Org query language {#org-query-language}

Query org files like SQL! Useful for a big TODO list.

```emacs-lisp
(package! org-ql)
```

</div>

</div>

</div>

<div class="outline-3 jvc">

#### Behavior {#behavior}

<div class="outline-4 jvc">

##### Tweaking defaults {#tweaking-defaults}

```emacs-lisp
(setq org-directory "~/.org"                      ; let's put files here
      org-log-into-drawer t                       ; changes of state into a LOGBOOK
      org-use-property-inheritance t              ; it's convenient to have properties inherited
      org-log-done 'time                          ; having the time a item is done sounds convenient
      org-list-allow-alphabetical t               ; have a. A. a) A) list bullets
      org-catch-invisible-edits 'smart            ; try not to accidently do weird stuff in invisible regions
      org-export-use-babel nil                    ; I don't want things to run automatically as I export
      org-export-with-sub-superscripts '{}        ; don't treat lone _ / ^ as sub/superscripts, require _{} / ^{}
      org-export-headline-levels 6
      org-export-with-todo-keywords t
      org-export-with-planning t
      org-export-with-priority t
      org-export-with-creator t
      org-export-with-properties nil
      org-export-with-tags t)
```

I also like the <span class="inline-src language-elisp" data-lang="elisp">`:comments`</span> header-argument, so let's make that a
default.

```emacs-lisp
(setq org-babel-default-header-args
      '((:session . "none")
        (:results . "replace")
        (:exports . "code")
        (:cache . "no")
        (:noweb . "no")
        (:hlines . "no")
        (:tangle . "no")
        (:comments . "link")))
```

By default, `visual-line-mode` is turned `on`, and `auto-fill-mode` `off` by a hook.
However this messes with tables in Org-mode, and other plaintext files (e.g.
markdown, \LaTeX) so I'll turn it off for this, and manually enable it for more
specific modes as desired.

```emacs-lisp
(remove-hook 'text-mode-hook #'visual-line-mode)
(add-hook 'text-mode-hook #'auto-fill-mode)
(add-hook 'auto-save-hook 'org-save-all-org-buffers)
```

There also seem to be a few keybindings which use `hjkl`, but miss arrow key equivalents.

```emacs-lisp
(map! :map evil-org-mode-map
      :after evil-org
      :n "g <up>" #'org-backward-heading-same-level
      :n "g <down>" #'org-forward-heading-same-level
      :n "g <left>" #'org-up-element
      :n "g <right>" #'org-down-element)
```

</div>

<div class="outline-4 jvc">

##### Extra functionality {#extra-functionality}

<div class="outline-5 jvc">

###### Org buffer creation {#org-buffer-creation}

Let's also make creating an org buffer just that little bit easier.

```emacs-lisp
(evil-define-command evil-buffer-org-new (count file)
  "Creates a new ORG buffer replacing the current window, optionally
   editing a certain FILE"
  :repeat nil
  (interactive "P<f>")
  (if file
      (evil-edit file)
    (let ((buffer (generate-new-buffer "*new org*")))
      (set-window-buffer nil buffer)
      (with-current-buffer buffer
        (org-mode)))))
(map! :leader
      (:prefix "b"
       :desc "New empty ORG buffer" "o" #'evil-buffer-org-new))
```

</div>

<div class="outline-5 jvc">

###### The utility of zero-width spaces {#the-utility-of-zero-width-spaces}

Occasionally in Org you run into annoyances where you want to have two separate
blocks right together without a space. For example, to **emphasize** part of a word,
or put a currency symbol immediately before an inline source block.
There is a solution to this, it just sounds slightly hacky --- zero width spaces.
Because this is Emacs, we can make this feel much less hacky by making a minor
addition to the Org key map 🙂.

```emacs-lisp
(map! :map org-mode-map
      :nie "M-SPC M-SPC" (cmd! (insert "\u200B")))
```

We then want to stop the space from being included in exports, which can be done
with a little filter.

```emacs-lisp
(defun +org-export-remove-zero-width-space (text _backend _info)
  "Remove zero width spaces from TEXT."
  (unless (org-export-derived-backend-p 'org)
    (replace-regexp-in-string "\u200B" "" text)))

(after! ox
  (add-to-list 'org-export-filter-final-output-functions #'+org-export-remove-zero-width-space t))
```

</div>

<div class="outline-5 jvc">

###### List bullet sequence {#list-bullet-sequence}

I think it makes sense to have list bullets change with depth

```emacs-lisp
(setq org-list-demote-modify-bullet '(("+" . "-") ("-" . "+") ("*" . "+") ("1." . "a.")))
```

</div>

<div class="outline-5 jvc">

###### Citation {#citation}

Occasionally I want to cite something, and `org-ref` is _the_ package for that.

Unfortunately, it ignores the `file = {...}` `.bib` keys though. Let's fix that.
I separate files on `;`, which may just be a Zotero/BetterBibLaTeX thing, but it's
a good idea in my case at least.

```emacs-lisp
(use-package! org-ref
  ;; :after org
  :defer t
  :config
  (defadvice! org-ref-open-bibtex-pdf-a ()
    :override #'org-ref-open-bibtex-pdf
    (save-excursion
      (bibtex-beginning-of-entry)
      (let* ((bibtex-expand-strings t)
             (entry (bibtex-parse-entry t))
             (key (reftex-get-bib-field "=key=" entry))
             (pdf (or
                   (car (-filter (lambda (f) (string-match-p "\\.pdf$" f))
                                 (split-string (reftex-get-bib-field "file" entry) ";")))
                   (funcall org-ref-get-pdf-filename-function key))))
        (if (file-exists-p pdf)
            (org-open-file pdf)
          (ding)))))
  (defadvice! org-ref-open-pdf-at-point-a ()
    "Open the pdf for bibtex key under point if it exists."
    :override #'org-ref-open-pdf-at-point
    (interactive)
    (let* ((results (org-ref-get-bibtex-key-and-file))
           (key (car results))
           (pdf-file (funcall org-ref-get-pdf-filename-function key)))
      (with-current-buffer (find-file-noselect (cdr results))
        (save-excursion
          (bibtex-search-entry (car results))
          (org-ref-open-bibtex-pdf))))))
```

There's also the new `org-cite` though. It would be nice to try that out.

To improve `org-cite`.

```emacs-lisp
(package! citar)
(package! citeproc)
(package! org-cite-csl-activate :recipe (:host github :repo "andras-simonyi/org-cite-csl-activate"))
```

```emacs-lisp
(use-package! citar
  :when (modulep! :completion vertico)
  :custom
  (org-cite-insert-processor 'citar)
  (org-cite-follow-processor 'citar)
  (org-cite-activate-processor 'citar)
  :config
  (setq citar-bibliography
        (let ((libfile-search-names '("biblio.json" "Biblio.json" "biblio.bib" "Biblio.bib"))
              (libfile-dir "~/.org/brain/")
              paths)
          (dolist (libfile libfile-search-names)
            (when (and (not paths)
                       (file-exists-p (expand-file-name libfile libfile-dir)))
              (setq paths (list (expand-file-name libfile libfile-dir)))))
          paths))
  :custom
  (citar-notes-paths '("~/.org/brain/references")) ; List of directories for reference nodes
  (citar-open-note-function 'orb-citar-edit-note)  ; Open notes in `org-roam'
  (citar-at-point-function 'embark-act))           ; Use `embark'

(use-package! citeproc
  :defer t)

;;; Org-Cite configuration

(map! :after org
      :map org-mode-map
      :localleader
      :desc "Insert citation" "@" #'org-cite-insert)

(use-package! oc
  :after org citar
  :config
  (require 'ox)
  (setq org-cite-global-bibliography
        (let ((paths (or citar-bibliography
                         (bound-and-true-p bibtex-completion-bibliography))))
          ;; Always return bibliography paths as list for org-cite.
          (if (stringp paths) (list paths) paths)))
  ;; setup export processor; default csl/citeproc-el, with biblatex for latex
  (setq org-cite-export-processors
        '((t csl))))

  ;;; Org-cite processors
(use-package! oc-biblatex
  :after oc)

(use-package! oc-csl
  :after oc
  :config
  (setq org-cite-csl-styles-dir "~/Zotero/styles"))

(use-package! oc-natbib
  :after oc)

(use-package! oc-csl-activate
  :after oc
  :config
  (setq org-cite-csl-activate-use-document-style t)
  (defun +org-cite-csl-activate/enable ()
    (interactive)
    (setq org-cite-activate-processor 'csl-activate)
    (add-hook! 'org-mode-hook '((lambda () (cursor-sensor-mode 1)) org-cite-csl-activate-render-all))
    (defadvice! +org-cite-csl-activate-render-all-silent (orig-fn)
      :around #'org-cite-csl-activate-render-all
      (with-silent-modifications (funcall orig-fn)))
    (when (eq major-mode 'org-mode)
      (with-silent-modifications
        (save-excursion
          (goto-char (point-min))
          (org-cite-activate (point-max)))
        (org-cite-csl-activate-render-all)))
    (fmakunbound #'+org-cite-csl-activate/enable)))
```

```elisp
(setq citar-citeproc-csl-styles-dir "~/Zotero/styles")
```

</div>

<div class="outline-5 jvc">

###### cdlatex {#cdlatex}

It's also nice to be able to use `cdlatex`.

```emacs-lisp
(add-hook 'org-mode-hook 'turn-on-org-cdlatex)
```

It's handy to be able to quickly insert environments with `C-c }`. I almost always
want to edit them afterwards though, so let's make that happen by default.

```emacs-lisp
(defadvice! org-edit-latex-emv-after-insert ()
  :after #'org-cdlatex-environment-indent
  (org-edit-latex-environment))
```

At some point in the future it could be good to investigate [splitting org blocks](https://scripter.co/splitting-an-org-block-into-two/).
Likewise [this](https://archive.casouri.cat/note/2020/insert-math-symbol-in-emacs/) looks good for symbols.

</div>

<div class="outline-5 jvc">

###### LSP support in `src` blocks {#lsp-support-in-src-blocks}

Now, by default, LSPs don't really function at all in `src` blocks.

```emacs-lisp
(cl-defmacro lsp-org-babel-enable (lang)
  "Support LANG in org source code block."
  (setq centaur-lsp 'lsp-mode)
  (cl-check-type lang stringp)
  (let* ((edit-pre (intern (format "org-babel-edit-prep:%s" lang)))
         (intern-pre (intern (format "lsp--%s" (symbol-name edit-pre)))))
    `(progn
       (defun ,intern-pre (info)
         (let ((file-name (->> info caddr (alist-get :file))))
           (unless file-name
             (setq file-name (make-temp-file "babel-lsp-")))
           (setq buffer-file-name file-name)
           (lsp-deferred)))
       (put ',intern-pre 'function-documentation
            (format "Enable lsp-mode in the buffer of org source block (%s)."
                    (upcase ,lang)))
       (if (fboundp ',edit-pre)
           (advice-add ',edit-pre :after ',intern-pre)
         (progn
           (defun ,edit-pre (info)
             (,intern-pre info))
           (put ',edit-pre 'function-documentation
                (format "Prepare local buffer environment for org source block (%s)."
                        (upcase ,lang))))))))
(defvar org-babel-lang-list
  '("go" "python" "ipython" "bash" "sh"))
(dolist (lang org-babel-lang-list)
  (eval `(lsp-org-babel-enable ,lang)))
```

</div>

<div class="outline-5 jvc">

###### View exported file {#view-exported-file}

`'localeader v` has no pre-existing binding, so I may as well use it with the same
functionality as in LaTeX. Let's try viewing possible output files with this.

```emacs-lisp
(map! :map org-mode-map
      :localleader
      :desc "View exported file" "v" #'org-view-output-file)

(defun org-view-output-file (&optional org-file-path)
  "Visit buffer open on the first output file (if any) found, using `org-view-output-file-extensions'"
  (interactive)
  (let* ((org-file-path (or org-file-path (buffer-file-name) ""))
         (dir (file-name-directory org-file-path))
         (basename (file-name-base org-file-path))
         (output-file nil))
    (dolist (ext org-view-output-file-extensions)
      (unless output-file
        (when (file-exists-p
               (concat dir basename "." ext))
          (setq output-file (concat dir basename "." ext)))))
    (if output-file
        (if (member (file-name-extension output-file) org-view-external-file-extensions)
            (browse-url-xdg-open output-file)
          (pop-to-buffer (or (find-buffer-visiting output-file)
                             (find-file-noselect output-file))))
      (message "No exported file found"))))

(defvar org-view-output-file-extensions '("pdf" "md" "rst" "txt" "tex" "html")
  "Search for output files with these extensions, in order, viewing the first that matches")
(defvar org-view-external-file-extensions '("html")
  "File formats that should be opened externally.")
```

</div>

</div>

<div class="outline-4 jvc">

##### Journal {#journal}

Just setting the directory for the journal. Didn't want to mix and mesh with the
roam dailies.

```emacs-lisp
(setq org-journal-dir "~/.org/journal/")
```

</div>

<div class="outline-4 jvc">

##### Clock {#clock}

Some settings for org-clock

```emacs-lisp
;; Resume clocking task when emacs restarts.
(org-clock-persistence-insinuate)
;; Show lot of clocking history so it's easy to pick items off the C-F11 list
(setq org-clock-history-length 23)
;; Resume clocking task on clock-in if the clock is open
(setq org-clock-in-resume t)
;; Sometimes I change tasks I'm clocking quickly - this removes clocked tasks with 0:00 duration
(setq org-clock-out-remove-zero-time-clocks t)
;; Clock out when moving task to a done state
(setq org-clock-out-when-done t)
;; Save the running clock and all clock history when exiting Emacs, load it on startup
(setq org-clock-persist t)
;; Include current clocking task in clock reports
(setq org-clock-report-include-clocking-task t)
```

</div>

<div class="outline-4 jvc">

##### Habit {#habit}

org-habit, I use this for repeating tasks (such as exercise) in my org-agenda
view. This allows for collecting certain datapoints in variables / notes.

```emacs-lisp
(require 'org-habit)
```

```emacs-lisp
(defun get-habits-from-file ()
  (org-map-entries
   (lambda ()
     (when (string= (org-entry-get nil "STYLE") "habit")
       (cons (org-get-heading t t t t)
             (org-entry-get nil "LAST_REPEAT"))))
   "STYLE=\"habit\"" 'file))

(defun count-habit-completions (last-repeat)
  (let* ((now (current-time))
         (week-start (time-subtract now (days-to-time (nth 6 (decode-time now)))))
         (last-done (org-time-string-to-time last-repeat)))
    (if (time-less-p week-start last-done)
        1
      0)))

(defun parse-habit-data (habit-name last-repeat)
  (let ((data '())
        (max-streak 0)
        (current-streak 0))
    (org-map-entries
     (lambda ()
       (let ((state-changes (org-entry-get nil "LOGGING" t)))
         (when state-changes
           (dolist (change (split-string state-changes "\n"))
             (when (string-match "\\[\\([0-9]+-[0-9]+-[0-9]+\\).*\\] State \"DONE\"" change)
               (push (match-string 1 change) data))))))
     (concat "+STYLE=\"habit\"+" (regexp-quote habit-name))
     'file)
    (setq data (nreverse data))
    (let* ((now (current-time))
           (streak-end now)
           (day-sec 86400))
      (when last-repeat
        (push last-repeat data))
      (dolist (date data)
        (let ((date-time (org-time-string-to-time date)))
          (if (time-less-p
               (time-subtract streak-end (seconds-to-time day-sec))
               date-time)
              (setq current-streak (1+ current-streak))
            (setq max-streak (max max-streak current-streak))
            (setq current-streak 1))
          (setq streak-end date-time)))
      (setq max-streak (max max-streak current-streak)))
    (list current-streak max-streak)))

(defun calculate-trend (habit-name)
  (let* ((last-repeat (cdr (assoc habit-name (get-habits-from-file))))
         (this-week (count-habit-completions last-repeat))
         (last-week-time (time-subtract (current-time) (days-to-time 7)))
         (last-week (if (time-less-p (org-time-string-to-time last-repeat) last-week-time) 0 1)))
    (cond ((> this-week last-week) "↑")
          ((< this-week last-week) "↓")
          (t "→"))))

(defun insert-ultra-fancy-habit-summary ()
  (interactive)
  (let ((habits (get-habits-from-file)))
    (insert "| Habit | This Week | Streak | Max Streak | Trend |\n|---|---|---|---|---|\n")
    (dolist (habit habits)
      (let* ((name (car habit))
             (last-repeat (cdr habit))
             (this-week (count-habit-completions last-repeat))
             (streak-data (parse-habit-data name last-repeat))
             (streak (car streak-data))
             (max-streak (cadr streak-data))
             (trend (calculate-trend name)))
        (insert (format "| %s | %d/7 | %d | %d | %s |\n"
                        name this-week streak max-streak trend))))
    (org-table-align)))

(global-set-key (kbd "C-c m") 'insert-ultra-fancy-habit-summary)
```

</div>

<div class="outline-4 jvc">

##### Hugo {#hugo}

I use hugo for my site, so these are some of the default settings.

```emacs-lisp
(setq-default org-hugo-base-dir "~/Documents/Code/justin.vc"
              org-hugo-section "main"
              org-hugo-front-matter-format "yaml"
              org-hugo-auto-set-lastmod t)
```

</div>

<div class="outline-4 jvc">

##### Agenda {#agenda}

Adding the proper files to pull agenda from. This adds in the project-based
files in addition, since each could/can have their own todo.org file.

```emacs-lisp
(setq org-agenda-files (apply 'append
      (mapcar
       (lambda (directory)
         (directory-files-recursively
           directory org-agenda-file-regexp))
           '("~/.org/"))))
```

The agenda is nice, but a souped up version is nicer.

```emacs-lisp
(package! org-super-agenda)
```

```emacs-lisp
(eval-after-load 'org
  '(progn
     (setq org-agenda-start-day "-0d")
     (setq org-agenda-start-on-weekday nil)))

(use-package! org-super-agenda
  :after org-agenda
  :init
  (setq
        org-agenda-time-grid
        (quote
         ((daily today require-timed)
          (0700 0800 0900 1000 1100 1200 1300 1400 1500 1600 1700 1800 1900 2000 2100 2200)
          "......" "-----------------------------------------------------"))
        org-agenda-skip-scheduled-if-done t
        org-agenda-skip-deadline-if-done t
        org-agenda-include-deadlines t
        org-agenda-include-diary t
        org-agenda-block-separator nil
        org-agenda-compact-blocks t
        org-agenda-span 1
        org-agenda-start-with-log-mode t
        org-agenda-custom-commands
        '(("o" "Overview"
                    ((agenda "" ((org-agenda-span 'day)
                                 (org-super-agenda-groups
                                  '((:name "\nToday"
                                           :time-grid t
                                           :date today
                                           :todo "TODAY"
                                           :scheduled today
                                           :order 1)))))
                     (alltodo "" ((org-agenda-overriding-header "\nCategories")
                                  (org-super-agenda-groups
                                   '((:name "Next"
                                      :todo "NEXT"
                                      :order 2)
                                     (:name "Important"
                                      :tag "Important"
                                      :priority "A"
                                      :order 6)
                                     (:name "Due Today"
                                      :deadline today
                                      :order 3)
                                     (:name "Due Soon"
                                      :deadline future
                                      :order 8)
                                     (:name "Overdue"
                                      :deadline past
                                      :face error
                                      :order 7)
                                     (:name "To read"
                                      :tag "Read"
                                      :order 30)
                                     (:name "Waiting"
                                      :todo "WAITING"
                                      :order 20)
                                     (:name "Trivial"
                                            :priority<= "C"
                                            :tag ("Trivial" "Unimportant")
                                            :todo ("SOMEDAY")
                                            :order 90)
                                     (:discard (:anything t))))))))))
  :config
  (org-super-agenda-mode))
```

</div>

<div class="outline-4 jvc">

##### Capture {#capture}

Let's setup some org-capture templates, and make them visually nice to access.

`doct` (Declarative Org Capture Templates) seems to be a nicer way to
set up org-capture.

```emacs-lisp
(package! doct
  :recipe (:host github :repo "progfolio/doct")
  :pin "506c22f365b75f5423810c4933856802554df464")
```

```emacs-lisp
(use-package! doct
  :commands doct)
```

```emacs-lisp
(after! org-capture
  <<prettify-capture>>
  (defun +doct-icon-declaration-to-icon (declaration)
    "Convert :icon declaration to icon"
    (let ((name (pop declaration))
          (set  (intern (concat "all-the-icons-" (plist-get declaration :set))))
          (face (intern (concat "all-the-icons-" (plist-get declaration :color))))
          (v-adjust (or (plist-get declaration :v-adjust) 0.01)))
      (apply set `(,name :face ,face :v-adjust ,v-adjust))))

  (defun +doct-iconify-capture-templates (groups)
    "Add declaration's :icon to each template group in GROUPS."
    (let ((templates (doct-flatten-lists-in groups)))
      (setq doct-templates (mapcar (lambda (template)
                                    (when-let* ((props (nthcdr (if (= (length template) 4) 2 5) template))
                                                (spec (plist-get (plist-get props :doct) :icon)))
                                       (setf (nth 1 template) (concat (+doct-icon-declaration-to-icon spec)
                                                                      "\t"
                                                                      (nth 1 template))))
                                    template)
                                   templates))))

  (setq doct-after-conversion-functions '(+doct-iconify-capture-templates))

  (defvar +org-capture-recipes  "~/.org/recipes.org")
  (defvar +org-capture-slipbox  "~/.org/brain/slip-box.org")

  (defun jethro/org-capture-slipbox ()
     (interactive)
     (org-capture nil "s"))

  (defun set-org-capture-templates ()
    (setq org-capture-templates
          (doct `(("Inbox" :keys "t"
                   :file +org-capture-todo-file
                   :prepend t
                   :headline "Inbox"
                   :type entry
                   :template ("* TODO %?"
                              "%i %a"))
                  ("Slip-box" :keys "s"
                   :file +org-capture-slipbox
                   :prepend t
                   :headline "Inbox"
                   :type entry
                   :template ("* %?"))
                  ("Link" :keys "L"
                   :file +org-capture-slipbox
                   :prepend t
                   :headline "Inbox"
                   :type entry
                   :immediate-finish t
                   :template ("* IDEA [#C] %:description\n:PROPERTIES:\n:CREATED: %U\n:END:\n%:link\n%:initial\n"))
                  ("Interesting" :keys "i"
                   :file +org-capture-todo-file
                   :prepend t
                   :headline "Interesting"
                   :type entry
                   :template ("* [ ] %{desc}%? :%{i-type}:"
                              "%i %a")
                   :children (("Webpage" :keys "w"
                               :desc "%(org-cliplink-capture) "
                               :i-type "read:web")
                              ("Article" :keys "a"
                               :desc ""
                               :i-type "read:reaserch")
                              ("\tRecipe" :keys "r"
                               :file +org-capture-recipes
                               :headline "Unsorted"
                               :template "%(org-chef-get-recipe-from-url)")))
                  ("Tasks" :keys "k"
                   :file +org-capture-todo-file
                   :prepend t
                   :headline "Tasks"
                   :type entry
                   :template ("* TODO %? %^G%{extra}"
                              "%i %a")
                   :children (("General Task" :keys "k"
                               :extra "")
                              ("Task with deadline" :keys "d"
                               :extra "\nDEADLINE: %^{Deadline:}t")
                              ("Scheduled Task" :keys "s"
                               :extra "\nSCHEDULED: %^{Start time:}t")))
                  ("Project" :keys "p"
                   :prepend t
                   :type entry
                   :headline "Inbox"
                   :template ("* %{time-or-todo} %?"
                              "%i"
                              "%a")
                   :file ""
                   :custom (:time-or-todo "")
                   :children (("Project-local todo" :keys "t"
                               :time-or-todo "TODO"
                               :file +org-capture-project-todo-file)
                              ("Project-local note" :keys "n"
                               :time-or-todo "%U"
                               :file +org-capture-project-notes-file)
                              ("Project-local changelog" :keys "c"
                               :time-or-todo "%U"
                               :heading "Unreleased"
                               :file +org-capture-project-changelog-file)))
                  ("\tCentralised project templates"
                   :keys "o"
                   :type entry
                   :prepend t
                   :template ("* %{time-or-todo} %?"
                              "%i"
                              "%a")
                   :children (("Project todo"
                               :keys "t"
                               :prepend nil
                               :time-or-todo "TODO"
                               :heading "Tasks"
                               :file +org-capture-central-project-todo-file)
                              ("Project note"
                               :keys "n"
                               :time-or-todo "%U"
                               :heading "Notes"
                               :file +org-capture-central-project-notes-file)
                              ("Project changelog"
                               :keys "c"
                               :time-or-todo "%U"
                               :heading "Unreleased"
                               :file +org-capture-central-project-changelog-file)))))))

  (set-org-capture-templates)
  (unless (display-graphic-p)
    (add-hook 'server-after-make-frame-hook
              (defun org-capture-reinitialise-hook ()
                (when (display-graphic-p)
                  (set-org-capture-templates)
                  (remove-hook 'server-after-make-frame-hook
                               #'org-capture-reinitialise-hook))))))
```

The [org-capture bin](~/.emacs.d/bin/org-capture) is rather nice, but I'd be nicer with a smaller frame, and
no modeline.

```emacs-lisp
(setf (alist-get 'height +org-capture-frame-parameters) 15)
;; (alist-get 'name +org-capture-frame-parameters) "❖ Capture") ;; ATM hardcoded in other places, so changing breaks stuff
(setq +org-capture-fn
      (lambda ()
        (interactive)
        (set-window-parameter nil 'mode-line-format 'none)
        (org-capture)))
```

Some functions from Jethro Kuan used to process the captured inbox

```emacs-lisp
(defun jethro/org-process-inbox ()
  "Called in org-agenda-mode, processes all inbox items."
  (interactive)
  (org-agenda-bulk-mark-regexp "inbox:")
  (jethro/bulk-process-entries))

(defvar jethro/org-current-effort "1:00"
  "Current effort for agenda items.")

(defun jethro/my-org-agenda-set-effort (effort)
  "Set the effort property for the current headline."
  (interactive
   (list (read-string (format "Effort [%s]: " jethro/org-current-effort) nil nil jethro/org-current-effort)))
  (setq jethro/org-current-effort effort)
  (org-agenda-check-no-diary)
  (let* ((hdmarker (or (org-get-at-bol 'org-hd-marker)
                       (org-agenda-error)))
         (buffer (marker-buffer hdmarker))
         (pos (marker-position hdmarker))
         (inhibit-read-only t)
         newhead)
    (org-with-remote-undo buffer
      (with-current-buffer buffer
        (widen)
        (goto-char pos)
        (org-show-context 'agenda)
        (funcall-interactively 'org-set-effort nil jethro/org-current-effort)
        (end-of-line 1)
        (setq newhead (org-get-heading)))
      (org-agenda-change-all-lines newhead hdmarker))))

(defun jethro/org-agenda-process-inbox-item ()
  "Process a single item in the org-agenda."
  (org-with-wide-buffer
   (org-agenda-set-tags)
   (org-agenda-priority)
   (call-interactively 'jethro/my-org-agenda-set-effort)
   (org-agenda-refile nil nil t)))

(defun jethro/bulk-process-entries ()
  (let ())
  (if (not (null org-agenda-bulk-marked-entries))
      (let ((entries (reverse org-agenda-bulk-marked-entries))
            (processed 0)
            (skipped 0))
        (dolist (e entries)
          (let ((pos (text-property-any (point-min) (point-max) 'org-hd-marker e)))
            (if (not pos)
                (progn (message "Skipping removed entry at %s" e)
                       (cl-incf skipped))
              (goto-char pos)
              (let (org-loop-over-headlines-in-active-region) (funcall 'jethro/org-agenda-process-inbox-item))
              ;; `post-command-hook' is not run yet.  We make sure any
              ;; pending log note is processed.
              (when (or (memq 'org-add-log-note (default-value 'post-command-hook))
                        (memq 'org-add-log-note post-command-hook))
                (org-add-log-note))
              (cl-incf processed))))
        (org-agenda-redo)
        (unless org-agenda-persistent-marks (org-agenda-bulk-unmark-all))
        (message "Acted on %d entries%s%s"
                 processed
                 (if (= skipped 0)
                     ""
                   (format ", skipped %d (disappeared before their turn)"
                           skipped))
                 (if (not org-agenda-persistent-marks) "" " (kept marked)")))))

(defun jethro/org-inbox-capture ()
  (interactive)
  "Capture a task in agenda mode."
  (org-capture nil "t"))

(after! org-agenda (map! :map org-agenda-mode-map
      "i" #'org-agenda-clock-in
      "I" #'jethro/clock-in-and-advance
      "r" #'jethro/org-process-inbox
      "R" #'org-agenda-refile
      "C" #'jethro/org-inbox-capture))

(defun jethro/advance-todo ()
  (org-todo 'right)
  (remove-hook 'org-clock-in-hook #'jethro/advance-todo))

(defun jethro/clock-in-and-advance ()
  (interactive)
  (add-hook 'org-clock-in-hook 'jethro/advance-todo)
  (org-agenda-clock-in))
```

</div>

<div class="outline-4 jvc">

##### Protocol {#protocol}

```emacs-lisp
(require 'org-protocol)
```

</div>

<div class="outline-4 jvc">

##### ox-hugo {#ox-hugo}

For putting quotebacks in my org files - which then I export to my site

```emacs-lisp
(defun justin/org-insert-indented-inline-html ()
  "Insert an indented inline HTML export block under the current org header.
   Uses clipboard content if it contains 'quotebacks', otherwise prompts for input.
   Cleans up the HTML by removing %20 from title and removing the script tag."
  (interactive)
  (let* ((element (org-element-at-point))
         (type (org-element-type element))
         (clipboard-content (with-temp-buffer
                              (clipboard-yank)
                              (buffer-string)))
         (html-content (if (s-contains? "quotebacks" clipboard-content)
                           clipboard-content
                         (read-string "Enter HTML content: ")))
         (content-no-script (replace-regexp-in-string "<script[^>]*>.*?</script>" "" html-content t t))
         (cleaned-content (replace-regexp-in-string
                           "data-title=\"\\([^\"]*\\)\""
                           (lambda (match)
                             (let ((title (match-string 1 match)))
                               (format "data-title=\"%s\""
                                       (replace-regexp-in-string "%20" " " title))))
                           content-no-script t))
         (indented-content (format "<div class=\"org-indent\">\n%s\n</div>" cleaned-content)))
    (if (eq type 'headline)
        (progn
          (org-end-of-meta-data)
          (insert (format "\n#+BEGIN_EXPORT html\n%s\n#+END_EXPORT\n" indented-content)))
      (message "Not at a headline."))))

;; Bind this function to a key in org-mode-map
(define-key org-mode-map (kbd "C-c h") #'justin/org-insert-indented-inline-html)
```

</div>

<div class="outline-4 jvc">

##### Roam {#roam}

<div class="outline-5 jvc">

###### Basic settings {#basic-settings}

```emacs-lisp
(use-package org-roam
  :after org
  :init
  (setq org-roam-directory "~/.org/brain/"
        org-roam-db-location "~/.org/brain/org-roam.db")
   :custom
   (org-roam-database-connector 'sqlite-builtin))
```

That said, if the directory doesn't exist we likely don't want to be using roam.
Since we don't want to trigger errors (which will happen as soon as roam tries
to initialize), let's not load roam.

```emacs-lisp
(package! org-roam :disable t)
```

</div>

<div class="outline-5 jvc">

###### Export, saving, and hook settings {#export-saving-and-hook-settings}

Just some functions for exporting and hooks

```emacs-lisp
(defun justin/my-org-hugo-export-function ()
  "Strips out the feed portion of a link for my website."
  (interactive)
  (let ((file (buffer-file-name)))
    (with-temp-buffer
      (insert-file-contents file)
      (org-mode)  ;; Set the mode to org-mode
      (goto-char (point-min))
           (while (re-search-forward
             (rx "/"
                 (and (or "feed" "rss" "rss " "atom.xml" "rss.xml" "blog-feed.xml" "feed.xml" "index.xml")
                      (zero-or-more "/") (or eos eol string-end))) nil t)
       (replace-match ""))
     (org-hugo-export-to-md))))
```

This will add a "stub" tag to org-roam (those that have IDs) org files when
they're &lt; a certain buffer size. Could use a refactor, but it works.

```emacs-lisp
(defun justin/org-roam-tag-stubs-on-save ()
  (when (and (eq major-mode 'org-mode)
             (org-entry-get (point) "ID")
             (not (string-prefix-p (expand-file-name "~/.org/brain/daily/")
                                   (buffer-file-name))))
    (if (< (buffer-size) 250)
        (unless (member "stub" (org-roam-node-tags (org-roam-node-at-point)))
          (org-roam-tag-add '("stub")))
      (when (and (> (buffer-size) 251)
                 (member "stub" (org-roam-node-tags (org-roam-node-at-point))))
        (org-roam-tag-remove '("stub"))))))

(add-hook 'after-save-hook #'justin/org-roam-tag-stubs-on-save)
```

This is for creating my 'references' page by transcluding tags.

```emacs-lisp

```

testing out exporting to hugo

```emacs-lisp
(defun export-org-roam-to-hugo ()
  "Export all Org-roam files to Hugo-compatible markdown, excluding those tagged with 'stub'."
  (interactive)
  (dolist (file (org-roam-list-files))
    (with-current-buffer (find-file-noselect file)
      (unless (member "stub" (org-get-tags))
        (let ((org-hugo-base-dir "~/Documents/Code/justin.vc")
              (org-hugo-section "main"))  ;
          (org-hugo-export-wim-to-md))))))
```

</div>

<div class="outline-5 jvc">

###### Searching {#searching}

Just for searching my org-roam notes - for -SOME- reason the globs aren't
respected. Need to figure this out later.

```emacs-lisp
(defun justin/org-roam-rg-search ()
  "Search org-roam directory using consult-ripgrep. With live-preview."
  (interactive)
    (let ((consult-ripgrep-command "rg --null --ignore-case --type org --line-buffered --color=always\
--max-columns=500 --no-heading --line-number . --glob=!biblio.bib --glob=!quoteback.json -e ARG OPTS"))
    (consult-ripgrep org-roam-directory)))
```

</div>

<div class="outline-5 jvc">

###### Roam Capture settings {#roam-capture-settings}

These are settings related to the way I do work, initially inspired
by [Jethro Kuan's org-roam guide](https:jethrokuan.github.io/org-roam-guide/) and [this post on issuecloser.com](https:issuecloser.com/blog/org-roam-emacs-and-ever-refining-the-note-taking-process)

```emacs-lisp
(setq time-stamp-active t
      time-stamp-start "#\\+last_modified:[ \t]*"
      time-stamp-end "$"
      time-stamp-format "\[%Y-%02m-%02d %3a %02H:%02M\]")
(add-hook 'before-save-hook 'time-stamp nil)

(setq org-roam-capture-templates
      '(("m" "main" plain
         "%?"
         :if-new
         (file+head "main/${slug}.org"
          "#+title: ${title}
          #+hugo_tags: noexport
          #+HTML_CONTAINER: div
          #+HTML_CONTAINER_CLASS: jvc
          #+date: %U\n\n")
         :immediate-finish t
         :unnarrowed t)
        ("p" "person" plain
         "%?"
         :if-new
         (file+head "main/${slug}.org"
          "#+title: ${title}
           #+filetags: :person:
          #+date: %U\n\n")
         :immediate-finish t
         :unnarrowed t)
        ("w" "work" plain
         "%?"
         :if-new
         (file+head "work/${slug}.org"
          "#+title: ${title}
           #+filetags: :private:
          #+date: %U\n\n")
         :immediate-finish t
         :unnarrowed t)
        ("r" "reference" plain
         "%?"
         :if-new
         (file+head "reference/${title}.org"
          "#+title: ${title}
          #+date: %U\n\n")
         :immediate-finish t
         :unnarrowed t)
        ("a" "article" plain
         "%?"
         :if-new
         (file+head "articles/${title}.org"
                   "#+HUGO_BASE_DIR: ~/Documents/Code/justin.vc
                   #+HUGO_SECTION: ./posts
                   #+TITLE: ${title}
                   #+DATE: %U
                   #+HUGO_TAGS: draft
                   #+macro: sidenote @@html:{{%/* sidenote \"$1\" $2 */%}} $3 {{%/* /sidenote */%}}@@
                   #+HUGO_DRAFT: true\n")
         :immediate-finish t
         :unnarrowed t)))

```

Capture Templates for Daily

```emacs-lisp
(setq org-roam-dailies-capture-templates
      '(("d" "daily" plain
         "* Agenda\n** Tasks\n- [ ] %?\n\n* Notes\n** Reading\n- \n\n* Journal\n"
         :target (file+head "%<%Y/%m/%Y-%m-%d>.org"
                            "#+title: %<%Y-%m-%d>
                            #+HTML_CONTAINER: div
                            #+HTML_CONTAINER_CLASS: jvc
                            #+date: %U
                            #+hugo_tags: noexport\n\n")
         :unnarrowed t
         :empty-lines 1
                )))
```

```emacs-lisp
(after! org-roam
(cl-defmethod org-roam-node-type ((node org-roam-node))
  "Return the TYPE of NODE."
  (condition-case nil
      (file-name-nondirectory
       (directory-file-name
        (file-name-directory
         (file-relative-name
          (org-roam-node-file node)
          org-roam-directory))))
    (error ""))))
```

</div>

<div class="outline-5 jvc">

###### Modeline file name {#modeline-file-name}

All those numbers! It's messy. Let's adjust this in a similar way that I have in
the [Window title](#window-title).

```emacs-lisp
(defadvice! doom-modeline--buffer-file-name-roam-aware-a (orig-fun)
  :around #'doom-modeline-buffer-file-name ; takes no args
  (if (s-contains-p org-roam-directory (or buffer-file-name ""))
      (replace-regexp-in-string
       "\\(?:^\\|.*/\\)\\([0-9]\\{4\\}\\)\\([0-9]\\{2\\}\\)\\([0-9]\\{2\\}\\)[0-9]*-"
       "🢔(\\1-\\2-\\3) "
       (subst-char-in-string ?_ ?  buffer-file-name))
    (funcall orig-fun)))
```

</div>

<div class="outline-5 jvc">

###### Graph view {#graph-view}

Org-roam is nice by itself, but there are so _extra_ nice packages which integrate
with it.

```emacs-lisp
(package! org-roam-ui :recipe (:host github :repo "org-roam/org-roam-ui" :files ("*.el" "out")))
(package! websocket :pin "82b370602fa0158670b1c6c769f223159affce9b") ; dependency of `org-roam-ui'
```

```emacs-lisp
(use-package! websocket
  :after org-roam)

(use-package! org-roam-ui
  :after org-roam
  :commands org-roam-ui-open
  :hook (org-roam . org-roam-ui-mode)
  :config
  (require 'org-roam) ; in case autoloaded
  (defun org-roam-ui-open ()
    "Ensure the server is active, then open the roam graph."
    (interactive)
    (unless org-roam-ui-mode (org-roam-ui-mode 1))
    (browse-url-xdg-open (format "http://localhost:%d" org-roam-ui-port))))
```

</div>

</div>

<div class="outline-4 jvc">

##### Macros {#macros}

This is for adding new global macros for exporting from org-mode, primarily as a
mechanism to add new shortcodes to ox-hugo.

```emacs-lisp
(setq org-export-global-macros '(
  ("sidenote" . "@@html:{{%/* sidenote $1 $2 */%}} $3 {{%/* /sidenote */%}}@@")
        ))
```

</div>

<div class="outline-4 jvc">

##### Noter {#noter}

Config for `org-noter`, I use a similar structure to Jethro Kuan's notes, and like
to set up my org notes for org-noter to match the folders.

```emacs-lisp
(setq
        org-noter-notes-search-path '("~/.org/brain/references")
        org-noter-separate-notes-from-heading t
        org-noter-always-create-frame nil) ; keeps it in the same buffer
```

</div>

<div class="outline-4 jvc">

##### Reference {#reference}

Jethro Kuan's function for parsing references (+ adding stuff to make it easier
for my notes).

```emacs-lisp

(setq citar-bibliography '("~/.org/brain/biblio.bib"))
(setq  bibtex-completion-bibliograph "~/.org/brain/biblio.bib")

(defun justin/org-roam-node-from-cite (keys)
    (interactive (list (citar-select-ref)))
    (let
        ((title (citar-format--entry "${author editor} :: ${title}" (citar-get-entry keys))))
     (org-roam-capture- :templates
                        '(("r" "references" plain "%?" :if-new
                           (file+head "references/${citekey}.org"
                            ":PROPERTIES:\n:ROAM_REFS: [cite:@${citekey}]\n:END:
                             #+title: ${title}
                             #+hugo_tags: noexport
                             #+HTML_CONTAINER: div
                             #+HTML_CONTAINER_CLASS: jvc
                             #+HUGO_SECTION: ./references
                             #+date: %U\n\n")
                           :immediate-finish t
                           :unnarrowed t))
                        :info (list :citekey keys)
                        :node (org-roam-node-create :title title)
                        :props '(:finalize find-file))))

;; rebind citar-open-notes for convenience so I don't accidentally create notes in wrong spot
(fset 'citar-open-notes #'justin/org-roam-node-from-cite)
```

</div>

<div class="outline-4 jvc">

##### Nicer generated heading IDs {#nicer-generated-heading-ids}

Thanks to alphapapa's [unpackaged.el](https://github.com/alphapapa/unpackaged.el#export-to-html-with-useful-anchors).

By default, Org generated heading IDs like `#org80fc2a5` which ... works, but has
two issues

-   It's uninformative, I have no idea what's referenced
-   If I export the same file, everything will change.
    Now, while without hardcoded values it's impossible to set references in
    stone, it would be nice for there to be a decent chance of staying the same.

Both of these issues can be addressed by generating IDs like
`#language-configuration`, which is what I'll do here.

It's worth noting that alphapapa's use of `url-hexify-string` seemed to cause me
some issues. Replacing that in `a53899` resolved this for me. To go one step
further, I create a function for producing nice short links, like an inferior
version of `reftex-label`.

```emacs-lisp
(defvar org-reference-contraction-max-words 3
  "Maximum number of words in a reference reference.")
(defvar org-reference-contraction-max-length 35
  "Maximum length of resulting reference reference, including joining characters.")
(defvar org-reference-contraction-stripped-words
  '("the" "on" "in" "off" "a" "for" "by" "of" "and" "is" "to")
  "Superfluous words to be removed from a reference.")
(defvar org-reference-contraction-joining-char "-"
  "Character used to join words in the reference reference.")

(defun org-reference-contraction-truncate-words (words)
  "Using `org-reference-contraction-max-length' as the total character 'budget' for the WORDS
and truncate individual words to conform to this budget.

To arrive at a budget that accounts for words undershooting their requisite average length,
the number of characters in the budget freed by short words is distributed among the words
exceeding the average length.  This adjusts the per-word budget to be the maximum feasable for
this particular situation, rather than the universal maximum average.

This budget-adjusted per-word maximum length is given by the mathematical expression below:

max length = \\floor{ \\frac{total length - chars for seperators - \\sum_{word \\leq average length} length(word) }{num(words) > average length} }"
  ;; trucate each word to a max word length determined by
  ;;
  (let* ((total-length-budget (- org-reference-contraction-max-length  ; how many non-separator chars we can use
                                 (1- (length words))))
         (word-length-budget (/ total-length-budget                      ; max length of each word to keep within budget
                                org-reference-contraction-max-words))
         (num-overlong (-count (lambda (word)                            ; how many words exceed that budget
                                 (> (length word) word-length-budget))
                               words))
         (total-short-length (-sum (mapcar (lambda (word)                ; total length of words under that budget
                                             (if (<= (length word) word-length-budget)
                                                 (length word) 0))
                                           words)))
         (max-length (/ (- total-length-budget total-short-length)       ; max(max-length) that we can have to fit within the budget
                        num-overlong)))
    (mapcar (lambda (word)
              (if (<= (length word) max-length)
                  word
                (substring word 0 max-length)))
            words)))

(defun org-reference-contraction (reference-string)
  "Give a contracted form of REFERENCE-STRING that is only contains alphanumeric characters.
Strips 'joining' words present in `org-reference-contraction-stripped-words',
and then limits the result to the first `org-reference-contraction-max-words' words.
If the total length is > `org-reference-contraction-max-length' then individual words are
truncated to fit within the limit using `org-reference-contraction-truncate-words'."
  (let ((reference-words
         (-filter (lambda (word)
                    (not (member word org-reference-contraction-stripped-words)))
                  (split-string
                   (->> reference-string
                        downcase
                        (replace-regexp-in-string "\\[\\[[^]]+\\]\\[\\([^]]+\\)\\]\\]" "\\1") ; get description from org-link
                        (replace-regexp-in-string "[-/ ]+" " ") ; replace seperator-type chars with space
                        puny-encode-string
                        (replace-regexp-in-string "^xn--\\(.*?\\) ?-?\\([a-z0-9]+\\)$" "\\2 \\1") ; rearrange punycode
                        (replace-regexp-in-string "[^A-Za-z0-9 ]" "") ; strip chars which need %-encoding in a uri
                        ) " +"))))
    (when (> (length reference-words)
             org-reference-contraction-max-words)
      (setq reference-words
            (cl-subseq reference-words 0 org-reference-contraction-max-words)))

    (when (> (apply #'+ (1- (length reference-words))
                    (mapcar #'length reference-words))
             org-reference-contraction-max-length)
      (setq reference-words (org-reference-contraction-truncate-words reference-words)))

    (string-join reference-words org-reference-contraction-joining-char)))
```

Now here's alphapapa's subtly tweaked mode.

```emacs-lisp
(define-minor-mode unpackaged/org-export-html-with-useful-ids-mode
  "Attempt to export Org as HTML with useful link IDs.
Instead of random IDs like \"#orga1b2c3\", use heading titles,
made unique when necessary."
  :global t
  (if unpackaged/org-export-html-with-useful-ids-mode
      (advice-add #'org-export-get-reference :override #'unpackaged/org-export-get-reference)
    (advice-remove #'org-export-get-reference #'unpackaged/org-export-get-reference)))
(unpackaged/org-export-html-with-useful-ids-mode 1) ; ensure enabled, and advice run

(defun unpackaged/org-export-get-reference (datum info)
  "Like `org-export-get-reference', except uses heading titles instead of random numbers."
  (let ((cache (plist-get info :internal-references)))
    (or (car (rassq datum cache))
        (let* ((crossrefs (plist-get info :crossrefs))
               (cells (org-export-search-cells datum))
               ;; Preserve any pre-existing association between
               ;; a search cell and a reference, i.e., when some
               ;; previously published document referenced a location
               ;; within current file (see
               ;; `org-publish-resolve-external-link').
               ;;
               ;; However, there is no guarantee that search cells are
               ;; unique, e.g., there might be duplicate custom ID or
               ;; two headings with the same title in the file.
               ;;
               ;; As a consequence, before re-using any reference to
               ;; an element or object, we check that it doesn't refer
               ;; to a previous element or object.
               (new (or (cl-some
                         (lambda (cell)
                           (let ((stored (cdr (assoc cell crossrefs))))
                             (when stored
                               (let ((old (org-export-format-reference stored)))
                                 (and (not (assoc old cache)) stored)))))
                         cells)
                        (when (org-element-property :raw-value datum)
                          ;; Heading with a title
                          (unpackaged/org-export-new-named-reference datum cache))
                        (when (member (car datum) '(src-block table example fixed-width property-drawer))
                          ;; Nameable elements
                          (unpackaged/org-export-new-named-reference datum cache))
                        ;; NOTE: This probably breaks some Org Export
                        ;; feature, but if it does what I need, fine.
                        (org-export-format-reference
                         (org-export-new-reference cache))))
               (reference-string new))
          ;; Cache contains both data already associated to
          ;; a reference and in-use internal references, so as to make
          ;; unique references.
          (dolist (cell cells) (push (cons cell new) cache))
          ;; Retain a direct association between reference string and
          ;; DATUM since (1) not every object or element can be given
          ;; a search cell (2) it permits quick lookup.
          (push (cons reference-string datum) cache)
          (plist-put info :internal-references cache)
          reference-string))))

(defun unpackaged/org-export-new-named-reference (datum cache)
  "Return new reference for DATUM that is unique in CACHE."
  (cl-macrolet ((inc-suffixf (place)
                             `(progn
                                (string-match (rx bos
                                                  (minimal-match (group (1+ anything)))
                                                  (optional "--" (group (1+ digit)))
                                                  eos)
                                              ,place)
                                ;; HACK: `s1' instead of a gensym.
                                (-let* (((s1 suffix) (list (match-string 1 ,place)
                                                           (match-string 2 ,place)))
                                        (suffix (if suffix
                                                    (string-to-number suffix)
                                                  0)))
                                  (setf ,place (format "%s--%s" s1 (cl-incf suffix)))))))
    (let* ((headline-p (eq (car datum) 'headline))
           (title (if headline-p
                      (org-element-property :raw-value datum)
                    (or (org-element-property :name datum)
                        (concat (org-element-property :raw-value
                                                      (org-element-property :parent
                                                                            (org-element-property :parent datum)))))))
           ;; get ascii-only form of title without needing percent-encoding
           (ref (concat (org-reference-contraction (substring-no-properties title))
                        (unless (or headline-p (org-element-property :name datum))
                          (concat ","
                                  (pcase (car datum)
                                    ('src-block "code")
                                    ('example "example")
                                    ('fixed-width "mono")
                                    ('property-drawer "properties")
                                    (_ (symbol-name (car datum))))
                                  "--1"))))
           (parent (when headline-p (org-element-property :parent datum))))
      (while (--any (equal ref (car it))
                    cache)
        ;; Title not unique: make it so.
        (if parent
            ;; Append ancestor title.
            (setf title (concat (org-element-property :raw-value parent)
                                "--" title)
                  ;; get ascii-only form of title without needing percent-encoding
                  ref (org-reference-contraction (substring-no-properties title))
                  parent (when headline-p (org-element-property :parent parent)))
          ;; No more ancestors: add and increment a number.
          (inc-suffixf ref)))
      ref)))

(add-hook 'org-load-hook #'unpackaged/org-export-html-with-useful-ids-mode)
```

We also need to redefine <span class="inline-src language-elisp" data-lang="elisp">`(org-export-format-reference)`</span> as it now may
be passed a string as well as a number.

```emacs-lisp
(defadvice! org-export-format-reference-a (reference)
  "Format REFERENCE into a string.

REFERENCE is a either a number or a string representing a reference,
as returned by `org-export-new-reference'."
  :override #'org-export-format-reference
  (if (stringp reference) reference (format "org%07x" reference)))
```

</div>

<div class="outline-4 jvc">

##### Nicer `org-return` {#nicer-org-return}

Once again, from [unpackaged.el](https://github.com/alphapapa/unpackaged.el#org-return-dwim)

```emacs-lisp
(defun unpackaged/org-element-descendant-of (type element)
  "Return non-nil if ELEMENT is a descendant of TYPE.
TYPE should be an element type, like `item' or `paragraph'.
ELEMENT should be a list like that returned by `org-element-context'."
  ;; MAYBE: Use `org-element-lineage'.
  (when-let* ((parent (org-element-property :parent element)))
    (or (eq type (car parent))
        (unpackaged/org-element-descendant-of type parent))))

;;;###autoload
(defun unpackaged/org-return-dwim (&optional default)
  "A helpful replacement for `org-return-indent'.  With prefix, call `org-return-indent'.

On headings, move point to position after entry content.  In
lists, insert a new item or end the list, with checkbox if
appropriate.  In tables, insert a new row or end the table."
  ;; Inspired by John Kitchin: http://kitchingroup.cheme.cmu.edu/blog/2017/04/09/A-better-return-in-org-mode/
  (interactive "P")
  (if default
      (org-return t)
    (cond
     ;; Act depending on context around point.

     ;; NOTE: I prefer RET to not follow links, but by uncommenting this block, links will be
     ;; followed.

     ;; ((eq 'link (car (org-element-context)))
     ;;  ;; Link: Open it.
     ;;  (org-open-at-point-global))

     ((org-at-heading-p)
      ;; Heading: Move to position after entry content.
      ;; NOTE: This is probably the most interesting feature of this function.
      (let ((heading-start (org-entry-beginning-position)))
        (goto-char (org-entry-end-position))
        (cond ((and (org-at-heading-p)
                    (= heading-start (org-entry-beginning-position)))
               ;; Entry ends on its heading; add newline after
               (end-of-line)
               (insert "\n\n"))
              (t
               ;; Entry ends after its heading; back up
               (forward-line -1 )
               (end-of-line)
               (when (org-at-heading-p)
                 ;; At the same heading
                 (forward-line)
                 (insert "\n")
                 (forward-line -1))
               (while (not (looking-back "\\(?:[[:blank:]]?\n\\)\\{3\\}" nil))
                 (insert "\n"))
               (forward-line -1)))))

     ((org-at-item-checkbox-p)
      ;; Checkbox: Insert new item with checkbox.
      (org-insert-todo-heading nil))

     ((org-in-item-p)
      ;; Plain list.  Yes, this gets a little complicated...
      (let ((context (org-element-context)))
        (if (or (eq 'plain-list (car context))  ; First item in list
                (and (eq 'item (car context))
                     (not (eq (org-element-property :contents-begin context)
                              (org-element-property :contents-end context))))
                (unpackaged/org-element-descendant-of 'item context))  ; Element in list item, e.g. a link
            ;; Non-empty item: Add new item.
            (org-insert-item)
          ;; Empty item: Close the list.
          ;; TODO: Do this with org functions rather than operating on the text. Can't seem to find the right function.
          (delete-region (line-beginning-position) (line-end-position))
          (insert "\n"))))

     ((when (fboundp 'org-inlinetask-in-task-p)
        (org-inlinetask-in-task-p))
      ;; Inline task: Don't insert a new heading.
      (org-return t))

     ((org-at-table-p)
      (cond ((save-excursion
               (beginning-of-line)
               ;; See `org-table-next-field'.
               (cl-loop with end = (line-end-position)
                        for cell = (org-element-table-cell-parser)
                        always (equal (org-element-property :contents-begin cell)
                                      (org-element-property :contents-end cell))
                        while (re-search-forward "|" end t)))
             ;; Empty row: end the table.
             (delete-region (line-beginning-position) (line-end-position))
             (org-return t))
            (t
             ;; Non-empty row: call `org-return-indent'.
             (org-return t))))
     (t
      ;; All other cases: call `org-return-indent'.
      (org-return t)))))

(map!
 :after evil-org
 :map evil-org-mode-map
 :i [return] #'unpackaged/org-return-dwim)
```

</div>

<div class="outline-4 jvc">

##### Snippet Helpers {#snippet-helpers}

I often want to set `src-block` headers, and it's a pain to

-   type them out
-   remember what the accepted values are
-   oh, and specifying the same language again and again

We can solve this in three steps

-   having one-letter snippets, conditioned on `(point)` being within a src header
-   creating a nice prompt showing accepted values and the current default
-   pre-filling the `src-block` language with the last language used

For header args, the keys I'll use are

-   `r` for `:results`
-   `e` for `:exports`
-   `v` for `:eval`
-   `s` for `:session`
-   `d` for `:dir`

<!--listend-->

```emacs-lisp
(defun +yas/org-src-header-p ()
  "Determine whether `point' is within a src-block header or header-args."
  (pcase (org-element-type (org-element-context))
    ('src-block (< (point) ; before code part of the src-block
                   (save-excursion (goto-char (org-element-property :begin (org-element-context)))
                                   (forward-line 1)
                                   (point))))
    ('inline-src-block (< (point) ; before code part of the inline-src-block
                          (save-excursion (goto-char (org-element-property :begin (org-element-context)))
                                          (search-forward "]{")
                                          (point))))
    ('keyword (string-match-p "^header-args" (org-element-property :value (org-element-context))))))
```

Now let's write a function we can reference in yasnippets to produce a nice
interactive way to specify header args.

```emacs-lisp
(defun +yas/org-prompt-header-arg (arg question values)
  "Prompt the user to set ARG header property to one of VALUES with QUESTION.
The default value is identified and indicated. If either default is selected,
or no selection is made: nil is returned."
  (let* ((src-block-p (not (looking-back "^#\\+property:[ \t]+header-args:.*" (line-beginning-position))))
         (default
           (or
            (cdr (assoc arg
                        (if src-block-p
                            (nth 2 (org-babel-get-src-block-info t))
                          (org-babel-merge-params
                           org-babel-default-header-args
                           (let ((lang-headers
                                  (intern (concat "org-babel-default-header-args:"
                                                  (+yas/org-src-lang)))))
                             (when (boundp lang-headers) (eval lang-headers t)))))))
            ""))
         default-value)
    (setq values (mapcar
                  (lambda (value)
                    (if (string-match-p (regexp-quote value) default)
                        (setq default-value
                              (concat value " "
                                      (propertize "(default)" 'face 'font-lock-doc-face)))
                      value))
                  values))
    (let ((selection (consult--read values :prompt question :default default-value)))
      (unless (or (string-match-p "(default)$" selection)
                  (string= "" selection))
        selection))))
```

Finally, we fetch the language information for new source blocks.

Since we're getting this info, we might as well go a step further and also
provide the ability to determine the most popular language in the buffer that
doesn't have any `header-args` set for it (with `#+properties`).

```emacs-lisp
(defun +yas/org-src-lang ()
  "Try to find the current language of the src/header at `point'.
Return nil otherwise."
  (let ((context (org-element-context)))
    (pcase (org-element-type context)
      ('src-block (org-element-property :language context))
      ('inline-src-block (org-element-property :language context))
      ('keyword (when (string-match "^header-args:\\([^ ]+\\)" (org-element-property :value context))
                  (match-string 1 (org-element-property :value context)))))))

(defun +yas/org-last-src-lang ()
  "Return the language of the last src-block, if it exists."
  (save-excursion
    (beginning-of-line)
    (when (re-search-backward "^[ \t]*#\\+begin_src" nil t)
      (org-element-property :language (org-element-context)))))

(defun +yas/org-most-common-no-property-lang ()
  "Find the lang with the most source blocks that has no global header-args, else nil."
  (let (src-langs header-langs)
    (save-excursion
      (goto-char (point-min))
      (while (re-search-forward "^[ \t]*#\\+begin_src" nil t)
        (push (+yas/org-src-lang) src-langs))
      (goto-char (point-min))
      (while (re-search-forward "^[ \t]*#\\+property: +header-args" nil t)
        (push (+yas/org-src-lang) header-langs)))

    (setq src-langs
          (mapcar #'car
                  ;; sort alist by frequency (desc.)
                  (sort
                   ;; generate alist with form (value . frequency)
                   (cl-loop for (n . m) in (seq-group-by #'identity src-langs)
                            collect (cons n (length m)))
                   (lambda (a b) (> (cdr a) (cdr b))))))

    (car (cl-set-difference src-langs header-langs :test #'string=))))
```

</div>

<div class="outline-4 jvc">

##### Translate capital keywords (old) to lower case (new) {#translate-capital-keywords--old--to-lower-case--new}

Everyone used to use `#+CAPITAL` keywords. Then people realized that `#+lowercase`
is actually both marginally easier and visually nicer, so now the capital
version is just used in the manual.

> Org is standardized on lower case. Uppercase is used in the manual as a poor
> man's bold, and supported for historical reasons. --- [Nicolas Goaziou on the Org ML](https://orgmode.org/list/87tuuw3n15.fsf@nicolasgoaziou.fr)

To avoid sometimes having to choose between the hassle out of updating old
documents and using mixed syntax, I'll whip up a basic transcode-y function.
It likely misses some edge cases, but should mostly work.

```emacs-lisp
(defun org-syntax-convert-keyword-case-to-lower ()
  "Convert all #+KEYWORDS to #+keywords."
  (interactive)
  (save-excursion
    (goto-char (point-min))
    (let ((count 0)
          (case-fold-search nil))
      (while (re-search-forward "^[ \t]*#\\+[A-Z_]+" nil t)
        (unless (s-matches-p "RESULTS" (match-string 0))
          (replace-match (downcase (match-string 0)) t)
          (setq count (1+ count))))
      (message "Replaced %d occurances" count))))
```

</div>

<div class="outline-4 jvc">

##### Extra links {#extra-links}

<div class="outline-5 jvc">

###### YouTube {#youtube}

The `[[yt:...]]` links preview nicely, but don't export nicely. Thankfully, we can
fix that.

```emacs-lisp
(org-link-set-parameters "yt" :export #'+org-export-yt)
(defun +org-export-yt (path desc backend _com)
  (cond ((org-export-derived-backend-p backend 'html)
         (format "<iframe width='440' \
height='335' \
src='https://www.youtube.com/embed/%s' \
frameborder='0' \
allowfullscreen>%s</iframe>" path (or "" desc)))
        ((org-export-derived-backend-p backend 'latex)
         (format "\\href{https://youtu.be/%s}{%s}" path (or desc "youtube")))
        (t (format "https://youtu.be/%s" path))))
```

Trying out a thing to play youtube links in mpv.

```emacs-lisp
(defun mpv-play-url (url &rest args)
  "Play the given URL in MPV."
  (interactive)
  (start-process "my-process" nil "mpv"
                        "--speed=2.0"
                        "--pause"
                        "--cache=yes"
                        "demuxer-max-bytes=5000M"
                        "demuxer-max-back-bytes=3000M" url))

(setq browse-url-handlers
      '(("youtu\\.?be.*\\.xml" . browse-url-default-browser)  ; Open YouTube RSS feeds in the browser
        ("youtu\\.?be" . mpv-play-url)))                      ; Use mpv-play-url for other YouTube URLs
```

</div>

</div>

<div class="outline-4 jvc">

##### Fix problematic hooks {#fix-problematic-hooks}

When one of the <span class="inline-src language-elisp" data-lang="elisp">`org-mode-hook`</span> functions errors, it halts the hook
execution. This is problematic, and there are two hooks in particular which
cause issues. Let's make their failure less eventful.

```emacs-lisp
(defadvice! shut-up-org-problematic-hooks (orig-fn &rest args)
  :around #'org-fancy-priorities-mode
  (ignore-errors (apply orig-fn args)))
```

</div>

</div>

<div class="outline-3 jvc">

#### Visuals {#visuals}

Here I try to do two things: improve the styling of the various documents, via
font changes etc, and also propagate colours from the current theme.

<div class="outline-4 jvc">

##### Font Display {#font-display}

Mixed pitch is great. As is `+org-pretty-mode`, let's use them.

```emacs-lisp
(add-hook 'org-mode-hook #'+org-pretty-mode)
```

Let's make headings a bit bigger

```emacs-lisp
(custom-set-faces!
  '(outline-1 :weight extra-bold :height 1.25)
  '(outline-2 :weight bold :height 1.15)
  '(outline-3 :weight bold :height 1.12)
  '(outline-4 :weight semi-bold :height 1.09)
  '(outline-5 :weight semi-bold :height 1.06)
  '(outline-6 :weight semi-bold :height 1.03)
  '(outline-8 :weight semi-bold)
  '(outline-9 :weight semi-bold))
```

And the same with the title.

```emacs-lisp
(custom-set-faces!
  '(org-document-title :height 1.2))
```

It seems reasonable to have deadlines in the error face when they're passed.

```emacs-lisp
(setq org-agenda-deadline-faces
      '((1.001 . error)
        (1.0 . org-warning)
        (0.5 . org-upcoming-deadline)
        (0.0 . org-upcoming-distant-deadline)))
```

We can then have quote blocks stand out a bit more by making them _italic_.

```emacs-lisp
(setq org-fontify-quote-and-verse-blocks t)
```

Org files can be rather nice to look at, particularly with some of the
customization's here. This comes at a cost however, expensive font-lock.
Feeling like you're typing through molasses in large files is no fun, but there
is a way I can defer font-locking when typing to make the experience more
responsive.

```emacs-lisp
(defun locally-defer-font-lock ()
  "Set jit-lock defer and stealth, when buffer is over a certain size."
  (when (> (buffer-size) 50000)
    (setq-local jit-lock-defer-time 0.05
                jit-lock-stealth-time 1)))

(add-hook 'org-mode-hook #'locally-defer-font-lock)
```

Apparently this causes issues with some people, but I haven't noticed anything
problematic beyond the expected slight delay in some fontification, so until I
do I'll use the above.

</div>

<div class="outline-4 jvc">

##### Fontifying inline src blocks {#fontifying-inline-src-blocks}

Org does lovely things with `#+begin_src` blocks, like using font-lock for
language's major-mode behind the scenes and pulling out the lovely colorful
results. By contrast, inline `src_` blocks are somewhat neglected.

I am not the first person to feel this way, thankfully others have [taken to
stackexchange](https://stackoverflow.com/questions/20309842/how-to-syntax-highlight-for-org-mode-inline-source-code-src-lang/28059832) to voice their desire for inline src fontification. I was going to
steal their work, but unfortunately they didn't perform _true_ source code
fontification, but simply applied the `org-code` face to the content.

We can do better than that, and we shall! Using `org-src-font-lock-fontify-block`
we can apply language-appropriate syntax highlighting. Then, continuing on to
`{{{results(...)}}}` , it can have the `org-block` face applied to match, and then
the value-surrounding constructs hidden by mimicking the behavior of
`prettify-symbols-mode`.

<div class="warning">

This currently only highlights a single inline src block per line.
I have no idea why it stops, but I'd rather it didn't.
If you have any idea what's going on or how to fix this _please_ get in touch.

</div>

```emacs-lisp
(setq org-inline-src-prettify-results '("⟨" . "⟩"))
```

Doom theme's extra fontification is more problematic than helpful.

```emacs-lisp
(setq doom-themes-org-fontify-special-tags nil)
```

</div>

<div class="outline-4 jvc">

##### Symbols {#symbols}

It's also nice to change the character used for collapsed items (by default `…`),
I think `▾` is better for indicating 'collapsed section'.
and add an extra `org-bullet` to the default list of four.

```emacs-lisp
(setq org-ellipsis " ▾ "
      org-hide-leading-stars t)
```

It's also nice to make use of the `prettify-symbols-mode` for a few Org syntactic
tokens which we'd like to prettify that aren't covered by `org-modern` or any
other settings.

```emacs-lisp
(appendq! +ligatures-extra-symbols
          `(:list_property "∷"
            :em_dash       "—"
            :ellipses      "…"
            :arrow_right   "→"
            :arrow_left    "←"
            :arrow_lr      "⟷"
            :properties    "⚙"
            :end           "∎"))
(set-ligatures! 'org-mode
  :merge t
  :list_property "::"
  :em_dash       "---"
  :ellipsis      "..."
  :arrow_right   "->"
  :arrow_left    "<-"
  :arrow_lr      "<->"
  :properties    ":PROPERTIES:"
  :end           ":END:")
```

</div>

<div class="outline-4 jvc">

##### LaTeX Fragments {#latex-fragments}

<div class="outline-5 jvc">

###### Prettier highlighting {#prettier-highlighting}

First off, we want those fragments to look good.

```emacs-lisp
(setq org-highlight-latex-and-related '(native script entities))
```

However, by using `native` highlighting the `org-block` face is added, and that
doesn't look too great --- particularly when the fragments are previewed.

Ideally `org-src-font-lock-fontify-block` wouldn't add the `org-block` face, but we
can avoid advising that entire function by just adding another face with
`:inherit default` which will override the background colour.

Inspecting `org-do-latex-and-related` shows that `"latex"` is the language argument
passed, and so we can override the background as discussed above.

```emacs-lisp
(require 'org-src)
(add-to-list 'org-src-block-faces '("latex" (:inherit default :extend t)))
```

</div>

<div class="outline-5 jvc">

###### More eager rendering {#more-eager-rendering}

What's better than syntax-highlighted LaTeX is _rendered_ LaTeX though, and we can
have this be performed automatically with `org-fragtog`.

```emacs-lisp
(package! org-fragtog :pin "680606189d5d28039e6f9301b55ec80517a24005")
```

```emacs-lisp
(use-package! org-fragtog
  :hook (org-mode . org-fragtog-mode))
```

</div>

<div class="outline-5 jvc">

###### Prettier rendering {#prettier-rendering}

It's nice to customize the look of LaTeX fragments so they fit better in the
text --- like this \\(\sqrt{\beta^2+3}-\sum\_{\phi=1}^\infty \frac{x^\phi-1}{\Gamma(a)}\\).
Let's start by adding a sans font. I'd also like to use some of the
functionality from `bmc-maths`, so we'll load that too.

```emacs-lisp
(setq org-format-latex-header "\\documentclass{article}
\\usepackage[usenames]{xcolor}

\\usepackage[T1]{fontenc}

\\usepackage{booktabs}

\\pagestyle{empty}             % do not remove
% The settings below are copied from fullpage.sty
\\setlength{\\textwidth}{\\paperwidth}
\\addtolength{\\textwidth}{-3cm}
\\setlength{\\oddsidemargin}{1.5cm}
\\addtolength{\\oddsidemargin}{-2.54cm}
\\setlength{\\evensidemargin}{\\oddsidemargin}
\\setlength{\\textheight}{\\paperheight}
\\addtolength{\\textheight}{-\\headheight}
\\addtolength{\\textheight}{-\\headsep}
\\addtolength{\\textheight}{-\\footskip}
\\addtolength{\\textheight}{-3cm}
\\setlength{\\topmargin}{1.5cm}
\\addtolength{\\topmargin}{-2.54cm}
% my custom stuff
\\usepackage[nofont,plaindd]{bmc-maths}
\\usepackage{arev}
")
```

Since we can, instead of making the background colour match the `default` face,
let's make it transparent.

```emacs-lisp
(setq org-format-latex-options
      (plist-put org-format-latex-options :background "Transparent"))
```

</div>

<div class="outline-5 jvc">

###### Rendering speed tests {#rendering-speed-tests}

We can either render from a `dvi` or `pdf` file, so let's benchmark `latex` and
`pdflatex`.

| `latex` time      | `pdflatex` time   |
|-------------------|-------------------|
| 135 &plusmn; 2 ms | 215 &plusmn; 3 ms |

On the rendering side, there are two `.dvi`-to-image converters which I am
interested in: `dvipng` and `dvisvgm`. Then with the a `.pdf` we have `pdf2svg`.
For inline preview we care about speed, while for exporting we care about file
size and prefer a vector graphic.

Using the above latex expression and benchmarking lead to the following results:

| `dvipng` time    | `dvisvgm` time    | `pdf2svg` time   |
|------------------|-------------------|------------------|
| 89 &plusmn; 2 ms | 178 &plusmn; 2 ms | 12 &plusmn; 2 ms |

Now let's combine this to see what's best

| Tool chain             | Total time        | Resultant file size |
|------------------------|-------------------|---------------------|
| `latex` + `dvipng`     | 226 &plusmn; 2 ms | 7 KiB               |
| `latex` + `dvisvgm`    | 392 &plusmn; 4 ms | 8 KiB               |
| `pdflatex` + `pdf2svg` | 230 &plusmn; 2 ms | 16 KiB              |

So, let's use `dvipng` for previewing LaTeX fragments in-Emacs, but `dvisvgm` for .

<div class="warning">

Unfortunately, it seems that SVG sizing is annoying ATM, so let's actually not do this right now.

</div>

</div>

</div>

<div class="outline-4 jvc">

##### Stolen from [scimax](https://github.com/jkitchin/scimax) (semi-working right now) {#stolen-from-scimax--semi-working-right-now}

I want fragment justification

```emacs-lisp
(defun scimax-org-latex-fragment-justify (justification)
  "Justify the latex fragment at point with JUSTIFICATION.
JUSTIFICATION is a symbol for 'left, 'center or 'right."
  (interactive
   (list (intern-soft
          (completing-read "Justification (left): " '(left center right)
                           nil t nil nil 'left))))
  (let* ((ov (ov-at))
         (beg (ov-beg ov))
         (end (ov-end ov))
         (shift (- beg (line-beginning-position)))
         (img (overlay-get ov 'display))
         (img (and (and img (consp img) (eq (car img) 'image)
                        (image-type-available-p (plist-get (cdr img) :type)))
                   img))
         space-left offset)
    (when (and img
               ;; This means the equation is at the start of the line
               (= beg (line-beginning-position))
               (or
                (string= "" (s-trim (buffer-substring end (line-end-position))))
                (eq 'latex-environment (car (org-element-context)))))
      (setq space-left (- (window-max-chars-per-line) (car (image-size img)))
            offset (floor (cond
                           ((eq justification 'center)
                            (- (/ space-left 2) shift))
                           ((eq justification 'right)
                            (- space-left shift))
                           (t
                            0))))
      (when (>= offset 0)
        (overlay-put ov 'before-string (make-string offset ?\ ))))))

(defun scimax-org-latex-fragment-justify-advice (beg end image imagetype)
  "After advice function to justify fragments."
  (scimax-org-latex-fragment-justify (or (plist-get org-format-latex-options :justify) 'left)))


(defun scimax-toggle-latex-fragment-justification ()
  "Toggle if LaTeX fragment justification options can be used."
  (interactive)
  (if (not (get 'scimax-org-latex-fragment-justify-advice 'enabled))
      (progn
        (advice-add 'org--format-latex-make-overlay :after 'scimax-org-latex-fragment-justify-advice)
        (put 'scimax-org-latex-fragment-justify-advice 'enabled t)
        (message "Latex fragment justification enabled"))
    (advice-remove 'org--format-latex-make-overlay 'scimax-org-latex-fragment-justify-advice)
    (put 'scimax-org-latex-fragment-justify-advice 'enabled nil)
    (message "Latex fragment justification disabled")))
```

There's also this lovely equation numbering stuff I'll nick

```emacs-lisp
;; Numbered equations all have (1) as the number for fragments with vanilla
;; org-mode. This code injects the correct numbers into the previews so they
;; look good.
(defun scimax-org-renumber-environment (orig-func &rest args)
  "A function to inject numbers in LaTeX fragment previews."
  (let ((results '())
        (counter -1)
        (numberp))
    (setq results (cl-loop for (begin . env) in
                           (org-element-map (org-element-parse-buffer) 'latex-environment
                             (lambda (env)
                               (cons
                                (org-element-property :begin env)
                                (org-element-property :value env))))
                           collect
                           (cond
                            ((and (string-match "\\\\begin{equation}" env)
                                  (not (string-match "\\\\tag{" env)))
                             (cl-incf counter)
                             (cons begin counter))
                            ((string-match "\\\\begin{align}" env)
                             (prog2
                                 (cl-incf counter)
                                 (cons begin counter)
                               (with-temp-buffer
                                 (insert env)
                                 (goto-char (point-min))
                                 ;; \\ is used for a new line. Each one leads to a number
                                 (cl-incf counter (count-matches "\\\\$"))
                                 ;; unless there are nonumbers.
                                 (goto-char (point-min))
                                 (cl-decf counter (count-matches "\\nonumber")))))
                            (t
                             (cons begin nil)))))

    (when (setq numberp (cdr (assoc (point) results)))
      (setf (car args)
            (concat
             (format "\\setcounter{equation}{%s}\n" numberp)
             (car args)))))

  (apply orig-func args))


(defun scimax-toggle-latex-equation-numbering ()
  "Toggle whether LaTeX fragments are numbered."
  (interactive)
  (if (not (get 'scimax-org-renumber-environment 'enabled))
      (progn
        (advice-add 'org-create-formula-image :around #'scimax-org-renumber-environment)
        (put 'scimax-org-renumber-environment 'enabled t)
        (message "Latex numbering enabled"))
    (advice-remove 'org-create-formula-image #'scimax-org-renumber-environment)
    (put 'scimax-org-renumber-environment 'enabled nil)
    (message "Latex numbering disabled.")))

(advice-add 'org-create-formula-image :around #'scimax-org-renumber-environment)
(put 'scimax-org-renumber-environment 'enabled t)
```

</div>

<div class="outline-4 jvc">

##### Org Plot {#org-plot}

We can use some of the variables in `org-plot` to use the current doom theme
colours.

```emacs-lisp
(defvar +org-plot-term-size '(1050 . 650)
  "The size of the GNUPlot terminal, in the form (WIDTH . HEIGHT).")

(after! org-plot
  (defun +org-plot-generate-theme (_type)
    "Use the current Doom theme colours to generate a GnuPlot preamble."
    (format "
fgt = \"textcolor rgb '%s'\" # foreground text
fgat = \"textcolor rgb '%s'\" # foreground alt text
fgl = \"linecolor rgb '%s'\" # foreground line
fgal = \"linecolor rgb '%s'\" # foreground alt line

# foreground colors
set border lc rgb '%s'
# change text colors of  tics
set xtics @fgt
set ytics @fgt
# change text colors of labels
set title @fgt
set xlabel @fgt
set ylabel @fgt
# change a text color of key
set key @fgt

# line styles
set linetype 1 lw 2 lc rgb '%s' # red
set linetype 2 lw 2 lc rgb '%s' # blue
set linetype 3 lw 2 lc rgb '%s' # green
set linetype 4 lw 2 lc rgb '%s' # magenta
set linetype 5 lw 2 lc rgb '%s' # orange
set linetype 6 lw 2 lc rgb '%s' # yellow
set linetype 7 lw 2 lc rgb '%s' # teal
set linetype 8 lw 2 lc rgb '%s' # violet

# border styles
set tics out nomirror
set border 3

# palette
set palette maxcolors 8
set palette defined ( 0 '%s',\
1 '%s',\
2 '%s',\
3 '%s',\
4 '%s',\
5 '%s',\
6 '%s',\
7 '%s' )
"
            (doom-color 'fg)
            (doom-color 'fg-alt)
            (doom-color 'fg)
            (doom-color 'fg-alt)
            (doom-color 'fg)
            ;; colours
            (doom-color 'red)
            (doom-color 'blue)
            (doom-color 'green)
            (doom-color 'magenta)
            (doom-color 'orange)
            (doom-color 'yellow)
            (doom-color 'teal)
            (doom-color 'violet)
            ;; duplicated
            (doom-color 'red)
            (doom-color 'blue)
            (doom-color 'green)
            (doom-color 'magenta)
            (doom-color 'orange)
            (doom-color 'yellow)
            (doom-color 'teal)
            (doom-color 'violet)))

  (defun +org-plot-gnuplot-term-properties (_type)
    (format "background rgb '%s' size %s,%s"
            (doom-color 'bg) (car +org-plot-term-size) (cdr +org-plot-term-size)))

  (setq org-plot/gnuplot-script-preamble #'+org-plot-generate-theme)
  (setq org-plot/gnuplot-term-extra #'+org-plot-gnuplot-term-properties))
```

</div>

</div>

<div class="outline-3 jvc">

#### Babel {#babel}

Doom lazy-loads babel languages, with is lovely.
It also pulls in [ob-async](https://github.com/astahlman/ob-async), which is nice, but it would be even better if it was
used by default.

There are two caveats to `ob-async`:

1.  It does not support `:session`
    -   So, we don't want `:async` used when `:session` is set
2.  It adds a fixed delay to execution
    -   This is undesirable in a number of cases, for example it's generally
        unwanted with `emacs-lisp` code
    -   As such, I also introduce a async language blacklist to control when it's
        automatically enabled

Due to the nuance in the desired behavior, instead of just adding `:async` to
`org-babel-default-header-args`, I advice `org-babel-get-src-block-info` to add
`:async` intelligently. As an escape hatch, it also recognizes `:sync` as an
indication that `:async` should not be added.

I did originally have this enabled for everything except for `emacs-lisp` and
`LaTeX` (there were weird issues), but this added  a ~3s "startup" cost to every
src block evaluation, which was a bit of a pain. Since `:async` can be added
easily with `#+properties`, I've turned this behavior from a blacklist to a
whitelist.

```emacs-lisp
(add-transient-hook! #'org-babel-execute-src-block
  (require 'ob-async))

(defvar org-babel-auto-async-languages '()
  "Babel languages which should be executed asyncronously by default.")

(defadvice! org-babel-get-src-block-info-eager-async-a (orig-fn &optional light datum)
  "Eagarly add an :async parameter to the src information, unless it seems problematic.
This only acts o languages in `org-babel-auto-async-languages'.
Not added when either:
+ session is not \"none\"
+ :sync is set"
  :around #'org-babel-get-src-block-info
  (let ((result (funcall orig-fn light datum)))
    (when (and (string= "none" (cdr (assoc :session (caddr result))))
               (member (car result) org-babel-auto-async-languages)
               (not (assoc :async (caddr result))) ; don't duplicate
               (not (assoc :sync (caddr result))))
      (push '(:async) (caddr result)))
    result))
```

</div>

<div class="outline-3 jvc">

#### ESS {#ess}

We don't want `R` evaluation to hang the editor, hence

```emacs-lisp
(setq ess-eval-visibly 'nowait)
```

Syntax highlighting is nice, so let's turn all of that on

```emacs-lisp
(setq ess-R-font-lock-keywords
      '((ess-R-fl-keyword:keywords . t)
        (ess-R-fl-keyword:constants . t)
        (ess-R-fl-keyword:modifiers . t)
        (ess-R-fl-keyword:fun-defs . t)
        (ess-R-fl-keyword:assign-ops . t)
        (ess-R-fl-keyword:%op% . t)
        (ess-fl-keyword:fun-calls . t)
        (ess-fl-keyword:numbers . t)
        (ess-fl-keyword:operators . t)
        (ess-fl-keyword:delimiters . t)
        (ess-fl-keyword:= . t)
        (ess-R-fl-keyword:F&T . t)))
```

Lastly, in the event that I use `JAGS`, it would be nice to be able to use `jags` as
the language identifier, not `ess-jags`.

```emacs-lisp
(add-to-list '+org-babel-mode-alist '(jags . ess-jags))
```

</div>

</div>

<div class="outline-2 jvc">

### Python {#python}

```emacs-lisp
; Gets rid of the annoying garbage collection messages - not specific to Python, but still
(setq-default garbage-collection-messages nil)
```

</div>

<div class="outline-2 jvc">

### Jupyter {#jupyter}

```emacs-lisp

(org-babel-do-load-languages
 'org-babel-load-languages
 '((emacs-lisp . t)
   (julia . t)
   (python . t)
   (jupyter . t)))

(setq ob-async-no-async-languages-alist '("jupyter-python" "jupyter-julia"))
(setq org-babel-default-header-args:jupyter-python '((:async . "yes")
                                                     (:session . "py")
                                                     (:kernel . "base")))

(setq org-babel-default-header-args:jupyter-julia '((:async . "yes")
                                                    (:session . "jl")
                                                    (:kernel . "julia-1.7.3")))

(defun previous-org-jupyter-kernel ()
  (save-excursion
   (if (re-search-backward " :kernel \\(\\w+\\)" nil t)
       (substring-no-properties (match-string 1))
     "base")))
```

</div>

<div class="outline-2 jvc">

### PDF {#pdf}

<div class="outline-3 jvc">

#### MuPDF {#mupdf}

`pdf-tools` is nice, but a `mupdf`-based solution is nicer.

```emacs-lisp
(package! paper :recipe (:host github :repo "ymarco/paper-mode"
                         :files ("*.el" ".so")
                         :pre-build ("make")))
```

```emacs-lisp
 (use-package paper
  :mode ("\\.pdf\\'"  . paper-mode)
  :mode ("\\.epub\\'"  . paper-mode)
  :config
  (require 'evil-collection-paper)
  (evil-collection-paper-setup))
```

</div>

</div>

<div class="outline-2 jvc">

### R {#r}

<div class="outline-3 jvc">

#### Editor Visuals {#editor-visuals}

```emacs-lisp
(after! ess-r-mode
  (appendq! +ligatures-extra-symbols
            '(:assign "⟵"
              :multiply "×"))
  (set-ligatures! 'ess-r-mode
    ;; Functional
    :def "function"
    ;; Types
    :null "NULL"
    :true "TRUE"
    :false "FALSE"
    :int "int"
    :floar "float"
    :bool "bool"
    ;; Flow
    :not "!"
    :and "&&" :or "||"
    :for "for"
    :in "%in%"
    :return "return"
    ;; Other
    :assign "<-"
    :multiply "%*%"))
```

</div>

</div>

<div class="outline-2 jvc">

### Julia {#julia}

As mentioned in [lsp-julia#35](https://github.com/non-Jedi/lsp-julia/issues/35), `lsp-mode` seems to serve an invalid response to the
Julia server. The pseudo-fix is rather simple at least

```emacs-lisp
(after! julia-mode
  (add-hook 'julia-mode-hook #'rainbow-delimiters-mode-enable)
  (add-hook! 'julia-mode-hook
    (setq-local lsp-enable-folding t
                lsp-folding-range-limit 100)))
```

</div>

<div class="outline-2 jvc">

### Graphviz {#graphviz}

A nice method of visualizing simple graphs, based on plaintext
`.dot` / `.gv` files.

```emacs-lisp
(package! graphviz-dot-mode :pin "6e96a89762760935a7dff6b18393396f6498f976")
```

```emacs-lisp
(use-package! graphviz-dot-mode
  :commands graphviz-dot-mode
  :mode ("\\.dot\\'" "\\.gz\\'")
  :init
  (after! org
    (setcdr (assoc "dot" org-src-lang-modes)
            'graphviz-dot)))

(use-package! company-graphviz-dot
  :after graphviz-dot-mode)
```

</div>

<div class="outline-2 jvc">

### Markdown {#markdown}

Most of the time when I write markdown, it's going into some app/website which
will do it's own line wrapping, hence we _only_ want to use visual line wrapping. No hard stuff.

```emacs-lisp
(add-hook! (gfm-mode markdown-mode) #'visual-line-mode #'turn-off-auto-fill)
```

Since markdown is often seen as rendered HTML, let's try to somewhat mirror the
style or markdown renderers.

Most markdown renders seem to make the first three headings levels larger than
normal text, the first two much so. Then the fourth level tends to be the same
as body text, while the fifth and sixth are (increasingly) smaller, with the
sixth grayed out. Since the sixth level is so small, I'll turn up the boldness a notch.

```emacs-lisp
(custom-set-faces!
  '(markdown-header-face-1 :height 1.25 :weight extra-bold :inherit markdown-header-face)
  '(markdown-header-face-2 :height 1.15 :weight bold       :inherit markdown-header-face)
  '(markdown-header-face-3 :height 1.08 :weight bold       :inherit markdown-header-face)
  '(markdown-header-face-4 :height 1.00 :weight bold       :inherit markdown-header-face)
  '(markdown-header-face-5 :height 0.90 :weight bold       :inherit markdown-header-face)
  '(markdown-header-face-6 :height 0.75 :weight extra-bold :inherit markdown-header-face))
```

</div>

</div>

[^fn:1]: No, this isn't where I'm at, I just kinda picked a random place nearby.
