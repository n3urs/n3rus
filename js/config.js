// ❤ Everything personal lives here and in js/notes.js — edit away!
const CONFIG = {
  herName: "Hettie",
  herFullName: "Hettie Rankin",
  yourName: "Oscar",

  // The moment it all began — 24 Oct 2024, around midnight
  anniversary: "2024-10-24T00:00",

  // Shared storage for the countdown date. Both of you read/write this —
  // change the date on the site and it updates everywhere.
  syncUrl: "https://textdb.dev/api/data/27f3448d-dd77-48c2-8179-89b9a0873319",

  // Used only if the shared date can't be loaded and nothing is cached yet
  fallbackTarget: "2026-07-12T17:00",

  // The menagerie 🐾 (typing a name anywhere on the site does something…)
  animals: {
    egg:     { emoji: "🐶", kind: "dog"   },
    maude:   { emoji: "🐕", kind: "dog"   },
    bee:     { emoji: "🐝", kind: "dog"   }, // Bee the dog gets a bee, obviously
    mouse:   { emoji: "🐭", kind: "cat"   }, // Mouse the cat gets chased
    rosie:   { emoji: "🐱", kind: "cat"   },
    biscuit: { emoji: "🐴", kind: "horse" },
  },

  // Answer to the riddle revealed when all 6 hidden hearts are found
  riddleAnswer: "biscuit",
};
