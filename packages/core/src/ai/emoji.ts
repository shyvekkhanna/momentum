/**
 * Keyword-driven emoji assignment. Kept isolated from the rest of the app so
 * it can be swapped for a real model call later without touching callers —
 * everything talks to `suggestEmoji(title)`.
 */
const EMOJI_RULES: Array<{ keywords: string[]; emoji: string }> = [
  { keywords: ["grocery", "groceries", "shopping"], emoji: "🛒" },
  { keywords: ["workout", "exercise", "run", "running", "jog"], emoji: "🏋️" },
  { keywords: ["gym"], emoji: "💪" },
  { keywords: ["french"], emoji: "🇫🇷" },
  { keywords: ["spanish"], emoji: "🇪🇸" },
  { keywords: ["japanese"], emoji: "🇯🇵" },
  { keywords: ["german"], emoji: "🇩🇪" },
  { keywords: ["doctor", "dentist", "appointment", "checkup"], emoji: "🩺" },
  { keywords: ["meeting", "call", "standup", "sync", "client"], emoji: "💼" },
  { keywords: ["laundry"], emoji: "🧺" },
  { keywords: ["plant", "plants", "garden"], emoji: "🪴" },
  { keywords: ["bill", "bills", "invoice", "tax", "taxes"], emoji: "💳" },
  { keywords: ["birthday", "bday"], emoji: "🎂" },
  { keywords: ["code", "coding", "dev", "programming", "bug"], emoji: "💻" },
  { keywords: ["read", "reading", "book"], emoji: "📚" },
  { keywords: ["clean", "cleaning", "tidy", "vacuum"], emoji: "🧹" },
  { keywords: ["movie", "film", "cinema"], emoji: "🎬" },
  { keywords: ["flight", "fly", "airport"], emoji: "✈️" },
  { keywords: ["dog", "walk the dog", "puppy"], emoji: "🐕" },
  { keywords: ["cat", "kitten"], emoji: "🐈" },
  { keywords: ["meditate", "meditation", "mindfulness"], emoji: "🧘" },
  { keywords: ["yoga"], emoji: "🧘‍♀️" },
  { keywords: ["cook", "cooking", "recipe", "dinner", "lunch", "breakfast"], emoji: "🍳" },
  { keywords: ["water", "hydrate"], emoji: "💧" },
  { keywords: ["sleep", "nap", "bed"], emoji: "😴" },
  { keywords: ["study", "homework", "exam", "assignment"], emoji: "📖" },
  { keywords: ["email", "inbox"], emoji: "📧" },
  { keywords: ["shower", "bath"], emoji: "🚿" },
  { keywords: ["haircut", "salon", "barber"], emoji: "💇" },
  { keywords: ["car", "drive", "gas", "fuel"], emoji: "🚗" },
  { keywords: ["bike", "cycling", "cycle"], emoji: "🚴" },
  { keywords: ["music", "practice piano", "guitar", "piano"], emoji: "🎵" },
  { keywords: ["party", "celebration"], emoji: "🎉" },
  { keywords: ["gift", "present"], emoji: "🎁" },
  { keywords: ["travel", "trip", "vacation", "holiday"], emoji: "🧳" },
  { keywords: ["budget", "finance", "invest", "savings"], emoji: "💰" },
  { keywords: ["team", "collaborate", "review", "presentation"], emoji: "📊" },
  { keywords: ["design", "sketch", "wireframe"], emoji: "🎨" },
  { keywords: ["write", "writing", "blog", "journal"], emoji: "✍️" },
  { keywords: ["walk"], emoji: "🚶" },
  { keywords: ["swim", "swimming"], emoji: "🏊" },
  { keywords: ["vote", "election"], emoji: "🗳️" },
  { keywords: ["pack", "packing", "move", "moving"], emoji: "📦" },
];

const DEFAULT_EMOJI = "✨";

export function suggestEmoji(title: string): string {
  const normalized = title.toLowerCase().trim();
  if (!normalized) return DEFAULT_EMOJI;

  for (const rule of EMOJI_RULES) {
    if (rule.keywords.some((kw) => normalized.includes(kw))) {
      return rule.emoji;
    }
  }
  return DEFAULT_EMOJI;
}
