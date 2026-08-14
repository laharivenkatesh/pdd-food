var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var transliterate_exports = {};
__export(transliterate_exports, {
  transliterateIndic: () => transliterateIndic
});
module.exports = __toCommonJS(transliterate_exports);
const INDIC_MAPS = {
  hi: {
    paneer: "\u092A\u0928\u0940\u0930",
    biryani: "\u092C\u093F\u0930\u092F\u093E\u0928\u0940",
    samosa: "\u0938\u092E\u094B\u0938\u093E",
    dosa: "\u0921\u094B\u0938\u093E",
    idli: "\u0907\u0921\u0932\u0940",
    roti: "\u0930\u094B\u091F\u0940",
    dal: "\u0926\u093E\u0932",
    chapati: "\u091A\u092A\u093E\u0924\u0940",
    rice: "\u091A\u093E\u0935\u0932",
    curry: "\u0915\u0930\u0940"
  },
  te: {
    paneer: "\u0C2A\u0C28\u0C40\u0C30\u0C4D",
    biryani: "\u0C2C\u0C3F\u0C30\u0C4D\u0C2F\u0C3E\u0C28\u0C40",
    samosa: "\u0C38\u0C2E\u0C4B\u0C38\u0C3E",
    dosa: "\u0C26\u0C4B\u0C36",
    idli: "\u0C07\u0C21\u0C4D\u0C32\u0C40",
    roti: "\u0C30\u0C4B\u0C1F\u0C40",
    dal: "\u0C2A\u0C2A\u0C4D\u0C2A\u0C41",
    chapati: "\u0C1A\u0C2A\u0C3E\u0C24\u0C40",
    rice: "\u0C05\u0C28\u0C4D\u0C28\u0C02",
    curry: "\u0C15\u0C42\u0C30"
  },
  ta: {
    paneer: "\u0BAA\u0BA9\u0BC0\u0BB0\u0BCD",
    biryani: "\u0BAA\u0BBF\u0BB0\u0BBF\u0BAF\u0BBE\u0BA3\u0BBF",
    samosa: "\u0B9A\u0BAE\u0BCB\u0B9A\u0BBE",
    dosa: "\u0BA4\u0BCB\u0B9A\u0BC8",
    idli: "\u0B87\u0B9F\u0BCD\u0BB2\u0BBF",
    roti: "\u0BB0\u0BCA\u0B9F\u0BCD\u0B9F\u0BBF",
    dal: "\u0BAA\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1",
    chapati: "\u0B9A\u0BAA\u0BCD\u0BAA\u0BBE\u0BA4\u0BCD\u0BA4\u0BBF",
    rice: "\u0B9A\u0BBE\u0BA4\u0BAE\u0BCD",
    curry: "\u0B95\u0BB1\u0BBF"
  },
  kn: {
    paneer: "\u0CAA\u0CA8\u0CC0\u0CB0\u0CCD",
    biryani: "\u0CAC\u0CBF\u0CB0\u0CBF\u0CAF\u0CBE\u0CA8\u0CBF",
    samosa: "\u0CB8\u0CAE\u0CCB\u0CB8\u0CBE",
    dosa: "\u0CA6\u0CCB\u0CB8\u0CC6",
    idli: "\u0C87\u0CA1\u0CCD\u0CB2\u0CBF",
    roti: "\u0CB0\u0CCA\u0C9F\u0CCD\u0C9F\u0CBF",
    dal: "\u0CAC\u0CC7\u0CB3\u0CC6",
    chapati: "\u0C9A\u0CAA\u0CBE\u0CA4\u0CBF",
    rice: "\u0C85\u0CA8\u0CCD\u0CA8",
    curry: "\u0C95\u0CB0\u0CBF"
  },
  mr: {
    paneer: "\u092A\u0928\u0940\u0930",
    biryani: "\u092C\u093F\u0930\u094D\u092F\u093E\u0923\u0940",
    samosa: "\u0938\u092E\u094B\u0938\u093E",
    dosa: "\u0921\u094B\u0938\u093E",
    idli: "\u0907\u0921\u0932\u0940",
    roti: "\u092A\u094B\u0933\u0940",
    dal: "\u0935\u0930\u0923",
    chapati: "\u091A\u092A\u093E\u0924\u0940",
    rice: "\u092D\u093E\u0924",
    curry: "\u0930\u0938\u094D\u0938\u093E"
  },
  bn: {
    paneer: "\u09AA\u09A8\u09C0\u09B0",
    biryani: "\u09AC\u09BF\u09B0\u09BF\u09AF\u09BC\u09BE\u09A8\u09BF",
    samosa: "\u09B8\u09BF\u0999\u09BE\u09A1\u09BC\u09BE",
    dosa: "\u09A1\u09CB\u09B8\u09BE",
    idli: "\u0987\u09A1\u09B2\u09BF",
    roti: "\u09B0\u09C1\u099F\u09BF",
    dal: "\u09A1\u09BE\u09B2",
    chapati: "\u099A\u09BE\u09AA\u09BE\u09A4\u09BF",
    rice: "\u09AD\u09BE\u09A4",
    curry: "\u0995\u09BE\u09B0\u09BF"
  },
  ml: {
    paneer: "\u0D2A\u0D28\u0D40\u0D7C",
    biryani: "\u0D2C\u0D3F\u0D30\u0D3F\u0D2F\u0D3E\u0D23\u0D3F",
    samosa: "\u0D38\u0D2E\u0D4B\u0D38",
    dosa: "\u0D26\u0D4B\u0D36",
    idli: "\u0D07\u0D21\u0D4D\u0D21\u0D32\u0D3F",
    roti: "\u0D31\u0D4A\u0D1F\u0D4D\u0D1F\u0D3F",
    dal: "\u0D2A\u0D30\u0D3F\u0D2A\u0D4D\u0D2A\u0D4D",
    chapati: "\u0D1A\u0D2A\u0D4D\u0D2A\u0D3E\u0D24\u0D4D\u0D24\u0D3F",
    rice: "\u0D1A\u0D4B\u0D31\u0D4D",
    curry: "\u0D15\u0D31\u0D3F"
  },
  gu: {
    paneer: "\u0AAA\u0AA8\u0AC0\u0AB0",
    biryani: "\u0AAC\u0ABF\u0AB0\u0AAF\u0ABE\u0AA8\u0AC0",
    samosa: "\u0AB8\u0AAE\u0ACB\u0AB8\u0ABE",
    dosa: "\u0AA2\u0ACB\u0A82\u0AB8\u0ABE",
    idli: "\u0A87\u0AA1\u0AB2\u0AC0",
    roti: "\u0AB0\u0ACB\u0A9F\u0AB2\u0AC0",
    dal: "\u0AA6\u0ABE\u0AB3",
    chapati: "\u0A9A\u0AAA\u0ABE\u0A9F\u0AC0",
    rice: "\u0AAD\u0ABE\u0AA4",
    curry: "\u0AB6\u0ABE\u0A95"
  },
  pa: {
    paneer: "\u0A2A\u0A28\u0A40\u0A30",
    biryani: "\u0A2C\u0A3F\u0A30\u0A2F\u0A3E\u0A28\u0A40",
    samosa: "\u0A38\u0A2E\u0A4B\u0A38\u0A3E",
    dosa: "\u0A21\u0A4B\u0A38\u0A3E",
    idli: "\u0A07\u0A21\u0A32\u0A40",
    roti: "\u0A30\u0A4B\u0A1F\u0A40",
    dal: "\u0A26\u0A3E\u0A32",
    chapati: "\u0A1A\u0A2A\u0A3E\u0A24\u0A40",
    rice: "\u0A1A\u0A4C\u0A32",
    curry: "\u0A15\u0A30\u0A1A"
  },
  or: {
    paneer: "\u0B2A\u0B28\u0B40\u0B30",
    biryani: "\u0B2C\u0B3F\u0B30\u0B3F\u0B5F\u0B3E\u0B28\u0B3F",
    samosa: "\u0B38\u0B3F\u0B19\u0B4D\u0B17\u0B21\u0B3C\u0B3E",
    dosa: "\u0B26\u0B4B\u0B38\u0B3E",
    idli: "\u0B07\u0B21\u0B4D\u0B32\u0B3F",
    roti: "\u0B30\u0B41\u0B1F\u0B3F",
    dal: "\u0B21\u0B3E\u0B32\u0B3F",
    chapati: "\u0B1A\u0B2A\u0B3E\u0B24\u0B3F",
    rice: "\u0B2D\u0B3E\u0B24",
    curry: "\u0B24\u0B30\u0B15\u0B3E\u0B30\u0B40"
  },
  ur: {
    paneer: "\u067E\u0646\u06CC\u0631",
    biryani: "\u0628\u0631\u06CC\u0627\u0646\u06CC",
    samosa: "\u0633\u0645\u0648\u0633\u06C1",
    dosa: "\u0688\u0648\u0633\u0627",
    idli: "\u0627\u0688\u0644\u06CC",
    roti: "\u0631\u0648\u0679\u06CC",
    dal: "\u062F\u0627\u0644",
    chapati: "\u0686\u067E\u0627\u062A\u06CC",
    rice: "\u0686\u0627\u0648\u0644",
    curry: "\u0633\u0627\u0644\u0646"
  }
};
function transliterateIndic(text, lang) {
  if (!text || lang === "en") return text;
  const map = INDIC_MAPS[lang];
  if (!map) return text;
  const lower = text.trim().toLowerCase();
  if (map[lower]) {
    return map[lower];
  }
  const tokens = text.split(/(\s+)/);
  const transliteratedTokens = tokens.map((token) => {
    const tLower = token.trim().toLowerCase();
    if (map[tLower]) return map[tLower];
    if (tLower === "paneer") return map["paneer"] || token;
    if (tLower === "dosa") return map["dosa"] || token;
    if (tLower === "biryani") return map["biryani"] || token;
    if (tLower === "samosa") return map["samosa"] || token;
    if (tLower === "idli") return map["idli"] || token;
    if (tLower === "roti") return map["roti"] || token;
    if (tLower === "dal") return map["dal"] || token;
    if (tLower === "curry") return map["curry"] || token;
    return token;
  });
  return transliteratedTokens.join("");
}
