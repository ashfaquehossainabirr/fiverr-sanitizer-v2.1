//--> sanitize with "-"

// export const RESERVED_PATTERNS = [
//   // Emails
//   /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,

//   // Phone numbers
//   /\b(\+?\d{1,4}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}\b/,

//   // URLs & domains
//   /\bhttps?:\/\/[^\s]+/i,
//   /\bwww\.[^\s]+/i,
//   /\b[a-z0-9-]+\.(com|net|org|io|co|me|info)\b/i,

//   // Communication platforms
//   /\b(whatsapp|telegram|skype|zoom|discord|wechat|signal)\b/i,
//   /\b(instagram|facebook|linkedin|twitter|x|tiktok)\b/i,
// ];

// // Insert "-" between every character
// function hyphenate(word) {
//   return word.split("").join("-");
// }

// export function sanitizeText(text) {
//   let sanitized = text;

//   RESERVED_PATTERNS.forEach((pattern) => {
//     sanitized = sanitized.replace(pattern, (match) => hyphenate(match));
//   });

//   return sanitized;
// }

// export function containsRestrictedContent(text) {
//   return RESERVED_PATTERNS.some((pattern) => pattern.test(text));
// }



// --------------------------------------------------------------------------------



//--> sanitize with '_'

// Reserved keywords (substring detection)
const RESERVED_KEYWORDS = [
  "contact",
  "review",
  "paid",
  "pay",
  "payment",
  "email",
  "whatsapp",
  "telegram",
  "skype",
  "zoom",
  "discord",
  "wechat",
  "signal",
  "instagram",
  "facebook",
  "linkedin",
  "twitter",
  "tiktok",
  "price",
  "money",
  "fuck",
  "linkedin",
  "youtube",
  "instagram",
  "gmail",
  "google",
  "call",
  "paypal",
  "payoneer",
  "bank",
  "star",
  "upwork",
  "peopleperhour",
  "messenger",
  "freelancer",
  "pricing",
];

// // Patterns for technical items
// const RESERVED_PATTERNS = [
//   // Emails
//   /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,

//   // Phone numbers
//   /\b(\+?\d{1,4}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}\b/gi,

//   // URLs
//   /\bhttps?:\/\/[^\s]+/gi,
//   /\bwww\.[^\s]+/gi,
//   /\b[a-z0-9-]+\.(com|net|org|io|co|me|info)\b/gi,
// ];

// /**
//  * Insert "_" after first character
//  * contact → c_ontact
//  */
// function sanitizeWord(word) {
//   if (!word || word.length < 2) return word;

//   // prevent double sanitize
//   if (word[1] === "_") return word;

//   return `${word[0]}_${word.slice(1)}`;
// }

// export function sanitizeText(text) {
//   let sanitized = text;

//   // 1️⃣ Sanitize technical patterns first (emails, urls, phones)
//   RESERVED_PATTERNS.forEach((pattern) => {
//     sanitized = sanitized.replace(pattern, (match) =>
//       sanitizeWord(match)
//     );
//   });

//   // 2️⃣ Sanitize reserved keywords even inside other words
//   RESERVED_KEYWORDS.forEach((keyword) => {
//     const regex = new RegExp(keyword, "gi");

//     sanitized = sanitized.replace(regex, (match) =>
//       sanitizeWord(match)
//     );
//   });

//   return sanitized;
// }

// export function containsRestrictedContent(text) {
//   const keywordRegex = new RegExp(RESERVED_KEYWORDS.join("|"), "i");
//   return (
//     keywordRegex.test(text) ||
//     RESERVED_PATTERNS.some((pattern) => pattern.test(text))
//   );
// }


// URL detection (strict)
const URL_REGEX =
  /\bhttps?:\/\/[^\s]+|\bwww\.[^\s]+|\b[a-z0-9-]+\.(com|net|org|io|co|me|info)\b/gi;

/**
 * Insert "_" after first character
 * contact → c_ontact
 */
function sanitizeWord(word) {
  if (!word || word.length < 2) return word;
  if (word[1] === "_") return word; // prevent double sanitize
  return `${word[0]}_${word.slice(1)}`;
}

export function sanitizeText(text) {
  if (!text) return text;

  let sanitized = text;

  // Extract URLs and replace with placeholders
  const urls = [];
  sanitized = sanitized.replace(URL_REGEX, (match) => {
    const placeholder = `__URL_${urls.length}__`;
    urls.push(match);
    return placeholder;
  });

  // Sanitize ONLY whole reserved words (outside URLs)
  RESERVED_KEYWORDS.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    sanitized = sanitized.replace(regex, (match) =>
      sanitizeWord(match)
    );
  });

  // Restore original URLs
  urls.forEach((url, index) => {
    sanitized = sanitized.replace(`__URL_${index}__`, url);
  });

  return sanitized;
}

export function containsRestrictedContent(text) {
  if (!text) return false;

  // Remove URLs before checking
  const textWithoutUrls = text.replace(URL_REGEX, "");

  const keywordRegex = new RegExp(
    `\\b(${RESERVED_KEYWORDS.join("|")})\\b`,
    "i"
  );

  return keywordRegex.test(textWithoutUrls);
}