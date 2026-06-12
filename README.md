# Until Hettie 💗

A countdown to the next time Oscar & Hettie are together, with a few secrets
tucked inside.

**Live site:** https://n3urs.github.io/n3rus/

## How the date syncs

The countdown date lives in a tiny free shared store (textdb.dev), not in this
repo. Pressing **💞 change our date** on the site updates it for everyone,
everywhere — no code, no logins. The site also caches the last-known date in
the browser so it keeps working offline.

If the store ever disappears, the site falls back to the cached/default date —
just press save again to re-sync, or swap `syncUrl` in `js/config.js` for any
endpoint that answers `GET` (returns JSON) and `POST` (stores the body), e.g. a
Firebase Realtime Database REST URL (`https://<project>.firebaseio.com/countdown.json`).

## Editing the words 💌

Everything personal is in **`js/notes.js`** — captions, the six hidden-heart
notes, daily letters, the riddle and the treasure letter. Anything marked
`[PLACEHOLDER]` is waiting to be rewritten. Edit the file on GitHub (pencil
icon), commit, and the site updates in about a minute.

Names, the anniversary and the menagerie are in `js/config.js`.

## The secrets (spoilers!)

- Six hidden 💗 around the site (clues live behind the 💗 button, top right).
- Typing `egg`, `maude`, `bee`, `mouse`, `rosie`, `biscuit` or `hettie`
  anywhere does… things. (On a phone, use the whisper box in the 💗 panel.)
- Finding all six hearts reveals a riddle; its answer opens the 🔒 page.
- One letter a day unseals at the mailbox; flowers planted in the garden are
  kept forever (per device).

## Local development

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

No build step, no dependencies — plain HTML/CSS/JS.
