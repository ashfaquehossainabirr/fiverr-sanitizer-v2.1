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
  "book",
  "booking",
  "service",
  "services"
];

// URL detection (strict)
const URL_REGEX =
  /\bhttps?:\/\/[^\s]+|\bwww\.[^\s]+|\b[a-z0-9-]+\.(com|net|org|io|co|me|info)\b/gi;

/**
 * Insert "_" after first character
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