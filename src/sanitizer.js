const RESERVED_KEYWORDS = [
  "contact",
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
  "youtube",
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

const REPLACEMENT_KEYWORDS = {
  review: "check",
  feedback: "response"
};

const URL_REGEX =
  /\bhttps?:\/\/[^\s]+|\bwww\.[^\s]+|\b[a-z0-9-]+\.(com|net|org|io|co|me|info)\b/gi;

function sanitizeWord(word) {
  if (!word || word.length < 2) return word;
  if (word[1] === "_") return word;
  return `${word[0]}_${word.slice(1)}`;
}

export function sanitizeText(text) {
  if (!text) return text;

  let sanitized = text;

  const urls = [];
  sanitized = sanitized.replace(URL_REGEX, (match) => {
    const placeholder = `__URL_${urls.length}__`;
    urls.push(match);
    return placeholder;
  });

  Object.entries(REPLACEMENT_KEYWORDS).forEach(([keyword, replacement]) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    sanitized = sanitized.replace(regex, replacement);
  });

  RESERVED_KEYWORDS.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    sanitized = sanitized.replace(regex, (match) =>
      sanitizeWord(match)
    );
  });

  urls.forEach((url, index) => {
    sanitized = sanitized.replace(`__URL_${index}__`, url);
  });

  return sanitized;
}

export function containsRestrictedContent(text) {
  if (!text) return false;

  const textWithoutUrls = text.replace(URL_REGEX, "");

  const keywordRegex = new RegExp(
    `\\b(${[
      ...RESERVED_KEYWORDS,
      ...Object.keys(REPLACEMENT_KEYWORDS)
    ].join("|")})\\b`,
    "i"
  );

  return keywordRegex.test(textWithoutUrls);
}