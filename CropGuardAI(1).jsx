import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Leaf, ShieldAlert, CloudRain, Sprout, Landmark, IndianRupee, Camera, MapPin,
  Bell, LogOut, Globe, ChevronRight, Upload, TrendingUp, TrendingDown, Minus,
  CheckCircle2, AlertTriangle, Droplets, Wind, Calendar, Bug, Microscope,
  Phone, X, Loader2, WifiOff, Wifi, Sun, FlaskConical, Wheat, MessageCircle,
  Send, Volume2, Download, MoreHorizontal, Info, RefreshCw, ArrowLeft,
  Navigation, ExternalLink, Search, ShieldCheck,
  Cpu, Cloud, Zap, Activity, Plane, Server,
} from "lucide-react";

/* ─────────────────────────────  tokens  ───────────────────────────── */

const C = {
  bg: "#1B1917", card: "#252220", line: "#3B3630",
  ink: "#F3F0E7", body: "#CBC4B6", dim: "#A79E90", mute: "#7E766B",
  leaf: "#63A63F", leafDim: "#3D6B29",
  ochre: "#D9A21B", rust: "#C4552C", sky: "#4C93BC", violet: "#8A7BC8",
};

const Font = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Bitter:wght@600;700;800&family=Karla:wght@400;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{margin:0}
.cg{font-family:'Karla',system-ui,sans-serif}
.d{font-family:'Bitter',Georgia,serif}
.m{font-family:'JetBrains Mono',monospace}
.cg ::-webkit-scrollbar{width:6px;height:6px}
.cg ::-webkit-scrollbar-thumb{background:${C.line};border-radius:3px}
.fade{animation:f .35s cubic-bezier(.2,.7,.3,1) both}
@keyframes f{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.up{animation:u .3s cubic-bezier(.2,.8,.2,1) both}
@keyframes u{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
.pulse{animation:p 2.4s ease-in-out infinite}
@keyframes p{0%,100%{opacity:.35}50%{opacity:1}}
.spin{animation:s 1s linear infinite}
@keyframes s{to{transform:rotate(360deg)}}
.b{transition:transform .12s,background .15s,border-color .15s}
.b:active{transform:scale(.985)}
.b:focus-visible{outline:2px solid ${C.leaf};outline-offset:2px}
.nb::-webkit-scrollbar{display:none}
input,button,textarea{font-family:inherit}
input[type=range]{-webkit-appearance:none;height:4px;background:${C.line};border-radius:2px;outline:none}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:${C.leaf};border:3px solid ${C.bg};cursor:pointer}
input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:${C.leaf};border:3px solid ${C.bg};cursor:pointer}
.shell{display:block}.side{display:none}.bot{display:flex}
@media(min-width:880px){
  .shell{display:grid;grid-template-columns:236px 1fr;min-height:100vh}
  .side{display:flex!important}.bot{display:none!important}.main{padding-bottom:32px!important}
}
@media(prefers-reduced-motion:reduce){.fade,.up,.pulse,.spin{animation:none!important}}
`}</style>
);

/* ──────────────────────────────  data  ────────────────────────────── */

const STATES = [
  ["MH", "Maharashtra", "महाराष्ट्र", ["mr", "hi", "en"], "Deccan Plateau"],
  ["TN", "Tamil Nadu", "தமிழ்நாடு", ["ta", "en"], "Coastal Plains"],
  ["PB", "Punjab", "ਪੰਜਾਬ", ["pa", "hi", "en"], "Indo-Gangetic"],
  ["KA", "Karnataka", "ಕನ್ನಡ", ["kn", "en"], "Deccan Plateau"],
  ["WB", "West Bengal", "পশ্চিমবঙ্গ", ["bn", "hi", "en"], "Gangetic Delta"],
  ["GJ", "Gujarat", "ગુજરાત", ["gu", "hi", "en"], "Semi-Arid"],
  ["UP", "Uttar Pradesh", "उत्तर प्रदेश", ["hi", "ur", "en"], "Indo-Gangetic"],
  ["AP", "Andhra Pradesh", "ఆంధ్రప్రదేశ్", ["te", "en"], "Coastal Plains"],
  ["TS", "Telangana", "తెలంగాణ", ["te", "ur", "en"], "Deccan Plateau"],
  ["KL", "Kerala", "മലയാളം", ["ml", "en"], "Western Ghats"],
  ["OD", "Odisha", "ଓଡ଼ିଶା", ["or", "hi", "en"], "Eastern Coastal"],
  ["AS", "Assam", "অসম", ["as", "bn", "en"], "Brahmaputra Valley"],
  ["RJ", "Rajasthan", "राजस्थान", ["hi", "en"], "Arid"],
  ["MP", "Madhya Pradesh", "मध्य प्रदेश", ["hi", "en"], "Central Plateau"],
  ["BR", "Bihar", "बिहार", ["hi", "ur", "en"], "Indo-Gangetic"],
  ["HR", "Haryana", "हरियाणा", ["hi", "pa", "en"], "Indo-Gangetic"],
].map(([id, name, native, langs, zone]) => ({ id, name, native, langs, zone }));

const LANGS = {
  en: "English", hi: "हिन्दी", mr: "मराठी", ta: "தமிழ்", te: "తెలుగు", kn: "ಕನ್ನಡ",
  ml: "മലയാളം", bn: "বাংলা", gu: "ગુજરાતી", pa: "ਪੰਜਾਬੀ", or: "ଓଡ଼ିଆ", as: "অসমীয়া", ur: "اردو",
};
const LOCALE = {
  en: "en-IN", hi: "hi-IN", mr: "mr-IN", ta: "ta-IN", te: "te-IN", kn: "kn-IN",
  ml: "ml-IN", bn: "bn-IN", gu: "gu-IN", pa: "pa-IN", or: "or-IN", as: "as-IN", ur: "ur-IN",
};

const T = {
  en: { tagline: "Catch it before it spreads.", signIn: "Sign in", phone: "Mobile number", otp: "OTP", name: "Your name", role: "I am a", farmer: "Farmer", extension: "Extension worker", officer: "Agriculture officer", selectState: "Select your state", selectLang: "Choose language", next: "Continue", district: "District", home: "Home", scan: "Scan", weather: "Weather", soil: "Soil", crops: "Crops", alerts: "Alerts", fert: "Fertiliser", schemes: "Schemes", mandi: "Mandi", more: "More", risk: "Today's risk", due: "Next action due", out: "Sign out", diagnose: "Diagnose" },
  hi: { tagline: "फैलने से पहले पकड़ें।", signIn: "साइन इन", phone: "मोबाइल नंबर", otp: "ओटीपी", name: "आपका नाम", role: "मैं हूँ", farmer: "किसान", extension: "विस्तार कार्यकर्ता", officer: "कृषि अधिकारी", selectState: "अपना राज्य चुनें", selectLang: "भाषा चुनें", next: "आगे बढ़ें", district: "जिला", home: "होम", scan: "स्कैन", weather: "मौसम", soil: "मिट्टी", crops: "फसल", alerts: "चेतावनी", fert: "खाद", schemes: "योजनाएँ", mandi: "मंडी", more: "और", risk: "आज का जोखिम", due: "अगला काम", out: "साइन आउट", diagnose: "जाँच करें" },
  mr: { tagline: "पसरण्यापूर्वी ओळखा.", signIn: "साइन इन", phone: "मोबाईल क्रमांक", otp: "ओटीपी", name: "तुमचे नाव", role: "मी आहे", farmer: "शेतकरी", extension: "विस्तार कर्मचारी", officer: "कृषी अधिकारी", selectState: "राज्य निवडा", selectLang: "भाषा निवडा", next: "पुढे", district: "जिल्हा", home: "मुख्यपृष्ठ", scan: "स्कॅन", weather: "हवामान", soil: "माती", crops: "पिके", alerts: "इशारे", fert: "खत", schemes: "योजना", mandi: "बाजार", more: "अधिक", risk: "आजचा धोका", due: "पुढील काम", out: "साइन आउट", diagnose: "तपासा" },
  ta: { tagline: "பரவும் முன் கண்டறியுங்கள்.", signIn: "உள்நுழை", phone: "கைபேசி எண்", otp: "ஓடிபி", name: "உங்கள் பெயர்", role: "நான்", farmer: "விவசாயி", extension: "விரிவாக்கப் பணியாளர்", officer: "வேளாண் அலுவலர்", selectState: "மாநிலம்", selectLang: "மொழி", next: "தொடர", district: "மாவட்டம்", home: "முகப்பு", scan: "ஸ்கேன்", weather: "வானிலை", soil: "மண்", crops: "பயிர்", alerts: "எச்சரிக்கை", fert: "உரம்", schemes: "திட்டம்", mandi: "சந்தை", more: "மேலும்", risk: "இன்றைய ஆபத்து", due: "அடுத்த வேலை", out: "வெளியேறு", diagnose: "பரிசோதி" },
};
const tr = (l, k) => T[l]?.[k] ?? T.en[k] ?? k;

const DISEASES = [
  {
    crop: "Cotton", name: "Pink Bollworm", sci: "Pectinophora gossypiella", conf: 0.91, sev: "high",
    signs: "Rosette-shaped flowers, pinhead exit holes on green bolls, double seeds webbed together.",
    why: "Peaks 90–120 days after sowing, one generation every 25–30 days. A week's delay doubles the damage.",
    cultural: ["Uproot and burn crop residue after picking — this breaks diapause and is the single most effective control.", "Remove and destroy rosette flowers twice a week."],
    bio: ["8 pheromone traps per acre, new lure every 21 days.", "Trichogramma bactriae at 60,000/acre, three releases a week apart."],
    chem: [{ m: "Thiodicarb 75 WP", d: "1 g/L", phi: 21, g: "IRAC 1A" }, { m: "Chlorantraniliprole 18.5 SC", d: "0.3 ml/L", phi: 21, g: "IRAC 28" }],
    threshold: "8 moths per trap per night for three nights, or 10% rosette flowers.",
    safety: "Rotate IRAC groups every spray. Gloves and a mask.", follow: 5,
  },
  {
    crop: "Rice", name: "Bacterial Leaf Blight", sci: "Xanthomonas oryzae pv. oryzae", conf: 0.88, sev: "high",
    signs: "Water-soaked yellow lesions with wavy margins from the leaf tip; milky ooze on cut leaves at dawn.",
    why: "Travels in wind-driven splash and standing water. Excess nitrogen makes it dramatically worse.",
    cultural: ["Drain the field for two days to break leaf wetness.", "Stop all nitrogen top-dressing — nitrogen feeds the bacterium."],
    bio: ["Pseudomonas fluorescens 10 g/L, two sprays ten days apart.", "Next season sow Improved Samba Mahsuri or IR64 Sub1."],
    chem: [{ m: "Copper oxychloride 50 WP", d: "2.5 g/L", phi: 15, g: "Inorganic" }],
    threshold: "More than 5% leaf area affected at tillering.",
    safety: "Antibiotic sprays are restricted in several states. Confirm before buying.", follow: 7,
  },
  {
    crop: "Tomato", name: "Early Blight", sci: "Alternaria solani", conf: 0.94, sev: "moderate",
    signs: "Dark spots with concentric rings and a yellow halo, starting on the oldest leaves.",
    why: "Needs 8+ hours of leaf wetness at 24–29 °C. Every rain event restarts the cycle.",
    cultural: ["Remove and bury infected lower leaves — do not leave them in the field.", "Mulch with straw to stop rain splashing spores up from the soil."],
    bio: ["Neem oil 1500 ppm at 3 ml/L, evening spray, weekly.", "Trichoderma viride drench 5 g/L at transplanting."],
    chem: [{ m: "Mancozeb 75 WP", d: "2 g/L", phi: 7, g: "FRAC M03" }, { m: "Azoxystrobin 23 SC", d: "1 ml/L", phi: 5, g: "FRAC 11, max 2 sprays" }],
    threshold: "Spots on more than 10% of lower leaves.",
    safety: "Never use a strobilurin twice in a row. Alternate with mancozeb.", follow: 4,
  },
  {
    crop: "Maize", name: "Fall Armyworm", sci: "Spodoptera frugiperda", conf: 0.89, sev: "severe",
    signs: "Ragged whorl feeding, moist sawdust-like frass, inverted Y on the head capsule.",
    why: "Larvae hide deep in the whorl. Sprays that miss the whorl waste money and kill natural enemies.",
    cultural: ["Dry sand mixed with lime, 9:1, poured into the whorl at 8 a.m.", "Deep summer ploughing to expose pupae."],
    bio: ["5 pheromone traps per acre for monitoring, 15 for mass trapping.", "Metarhizium rileyi 5 g/L directed into the whorl."],
    chem: [{ m: "Emamectin benzoate 5 SG", d: "0.4 g/L", phi: 5, g: "IRAC 6" }, { m: "Spinetoram 11.7 SC", d: "0.5 ml/L", phi: 7, g: "IRAC 5" }],
    threshold: "5% damaged plants in the early whorl, 10% in the late whorl.",
    safety: "Aim into the whorl. Spray before 10 a.m. or after 4 p.m. for pollinators.", follow: 3,
  },
];

const REJECTS = {
  not_a_plant: ["I cannot see a plant here", "Fill the frame with one affected leaf, boll or stem, and try again."],
  too_blurry: ["Too blurry to read", "Hold the phone steady, tap the leaf on screen to focus, and retake it in daylight."],
  low_confidence: ["Not confident enough to name this", "I will not guess when a wrong name means a wrong spray. Take a close-up plus a whole-plant photo and have an officer confirm it."],
};

function buildWeather(seed = 11) {
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: 72 }, (_, i) => {
    const d = Math.sin((((i % 24) - 6) / 24) * Math.PI * 2);
    const temp = +(26 + d * 6 + rnd() * 1.6).toFixed(1);
    const rh = Math.min(98, Math.max(38, Math.round(80 - d * 22 + rnd() * 8)));
    const wet = i > 26 && i < 40;
    return {
      temp, rh,
      rain: +(wet ? rnd() * 7 : rnd() < 0.12 ? rnd() * 1.2 : 0).toFixed(1),
      wind: +(6 + rnd() * 12 + (wet ? 9 : 0)).toFixed(1),
      dew: +(temp - (100 - rh) / 5).toFixed(1),
    };
  });
}

function metricsOf(h) {
  const rain72 = +h.reduce((a, b) => a + b.rain, 0).toFixed(1);
  return {
    leafWet: h.filter((x) => x.rh >= 90 || Math.abs(x.temp - x.dew) < 1.5).length,
    rain6: +h.slice(0, 6).reduce((a, b) => a + b.rain, 0).toFixed(1),
    rain72,
    maxWind: Math.max(...h.map((x) => x.wind)),
    rhHi: h.filter((x) => x.rh >= 85).length,
    moist: +(0.3 - rain72 * 0.0005).toFixed(3),
    safe: h.map((x, i) => ({ x, i }))
      .filter(({ x, i }) => x.wind < 10 && x.temp < 33 && h.slice(i, i + 6).reduce((a, b) => a + b.rain, 0) < 0.5)
      .map(({ i }) => i),
  };
}

/* crop feasibility — a JS port of the backend rules */
const CROPS = {
  rice: ["kharif", "high", 125, [5.5, 7.0], 2000, 2369],
  maize: ["kharif", "medium", 100, [5.5, 7.5], 2200, 2400],
  cotton: ["kharif", "medium", 170, [6.0, 8.0], 4500, 7710],
  soybean: ["kharif", "low", 100, [6.0, 7.5], 3200, 5328],
  pigeonpea: ["kharif", "low", 160, [6.0, 7.5], 1800, 8000],
  groundnut: ["kharif", "low", 110, [6.0, 7.0], 5000, 7263],
  "pearl millet": ["kharif", "very low", 85, [6.5, 8.5], 600, 2775],
  sorghum: ["kharif", "very low", 110, [6.0, 8.5], 700, 3421],
  moong: ["kharif", "very low", 65, [6.2, 7.2], 2000, 8768],
  wheat: ["rabi", "medium", 135, [6.0, 7.5], 2400, 2585],
  chickpea: ["rabi", "low", 110, [6.0, 8.0], 3500, 5875],
  mustard: ["rabi", "low", 110, [6.0, 7.5], 900, 6100],
  onion: ["rabi", "medium", 130, [6.0, 7.5], 8000, null],
};
const WRANK = { "very low": 0, low: 1, medium: 2, high: 3 };
const ICAP = { rainfed: 1, canal: 3, borewell: 3, drip: 4 };
const LEGUME = new Set(["soybean", "chickpea", "pigeonpea", "groundnut", "moong"]);
const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

function recommend({ soil, hasSoil, irrigation, season, prev, budget, area }) {
  const cap = ICAP[irrigation] ?? 1;
  return Object.entries(CROPS)
    .filter(([, r]) => r[0] === season)
    .map(([crop, [, water, days, [lo, hi], seed, msp]]) => {
      let score = 55;
      const why = [`${season} crop, about ${days} days to harvest.`];
      const care = [];
      const need = WRANK[water];

      if (need > cap) { care.push(`Needs ${water} water but your plot is ${irrigation}. Not realistic without a new water source.`); score -= 40; }
      else if (need === cap) { care.push("Water need sits right at your irrigation limit — a dry spell will hurt."); score -= 4; }
      else { why.push(`Water need (${water}) is comfortably inside your ${irrigation} supply.`); score += 10; }

      if (hasSoil) {
        if (soil.ph >= lo && soil.ph <= hi) { why.push(`Your pH ${soil.ph} sits inside this crop's range ${lo}–${hi}.`); score += 12; }
        else { care.push(`Your pH ${soil.ph} is outside the ideal ${lo}–${hi}. Correct the soil first or yield stays capped.`); score -= 16; }
        if (soil.n < 280 && LEGUME.has(crop)) { why.push("Low soil nitrogen actually suits a legume — it fixes its own and leaves the field richer."); score += 10; }
        else if (soil.n < 280) { care.push("Your nitrogen is low, so this crop needs a full urea programme."); score -= 6; }
        if (soil.k < 110 && ["cotton", "onion", "rice"].includes(crop)) { care.push("Low potassium hits this crop hard — weak stems and poor filling."); score -= 8; }
      } else { care.push("No soil test, so this uses a district average rather than your field."); score -= 6; }

      if (prev === crop) { care.push("Same as last season. Repeating invites soil-borne disease and pest carryover."); score -= 20; }
      else if (["rice", "wheat", "maize", "sorghum"].includes(prev) && LEGUME.has(crop)) {
        why.push("Good rotation — a legume after a cereal restores nitrogen and breaks the pest cycle."); score += 15;
      }
      if (budget && seed > budget) { care.push(`Seed alone is about ${inr(seed)}/acre, above your ${inr(budget)} budget.`); score -= 25; }
      if (area < 1 && days > 150) { care.push("A long-duration crop on a small plot ties up your only field for most of the year."); score -= 8; }
      if (msp) why.push(`Covered by MSP at ${inr(msp)}/quintal, so there is a price floor.`);

      return { crop, score: Math.max(0, Math.min(100, Math.round(score))), water, days, seed, why, care };
    })
    .sort((a, b) => b.score - a.score);
}

const BANDS = {
  n: ["Nitrogen", "kg/ha", 280, 560, 100, 700, 1],
  p: ["Phosphorus", "kg/ha", 11, 25, 3, 60, 1],
  k: ["Potassium", "kg/ha", 110, 280, 40, 500, 1],
  ph: ["pH", "", 6, 7.5, 4, 9.5, 0.1],
  oc: ["Organic carbon", "%", 0.5, 0.75, 0.1, 1.6, 0.05],
  ec: ["Salinity (EC)", "dS/m", 0, 1, 0, 4, 0.1],
};
const statusOf = (k, v) => (v < BANDS[k][2] ? "low" : v > BANDS[k][3] ? "high" : "optimum");

function corrections(s) {
  const out = [];
  const st = (k) => statusOf(k, s[k]);
  if (st("ph") === "low") out.push("Soil is acidic. Lime at 2 quintal/acre a month before sowing, or the phosphorus you buy stays locked up.");
  if (st("ph") === "high") out.push("Soil is alkaline. Gypsum at 2 quintal/acre plus green manure. Expect zinc and iron deficiency in the crop.");
  if (st("ec") === "high") out.push("Salinity above 1 dS/m. Fix drainage and pick salt-tolerant varieties before adding fertiliser.");
  if (st("oc") === "low") out.push("Organic carbon is low. Two tonnes of farmyard manure per acre beats extra urea.");
  if (st("n") === "low") out.push("Nitrogen is low. Split the dose across three applications — less loss, more uptake.");
  if (st("n") === "high") out.push("Nitrogen is already high. Cut urea by about 30%; excess nitrogen invites blight and sucking pests.");
  if (st("p") === "low") out.push("Phosphorus is low. Place DAP below the seed — broadcast phosphorus is mostly wasted.");
  if (st("k") === "low") out.push("Potassium is low. The nutrient most often skipped, and it shows as weak stems and poor filling.");
  return out;
}

/* Real, currently running schemes. Every URL is the official portal; the
   explainer link is a Google search scoped to that domain, because searching
   the bare scheme name returns a page of lookalike sites that harvest Aadhaar
   numbers. Verified 28 Aug 2026 — re-check each season. */
const SCHEMES = [
  ["PM-KISAN", "Pradhan Mantri Kisan Samman Nidhi", "Income support", "₹6,000/year",
    "All landholding farmer families. Income-tax payers, government employees and institutional landholders are excluded.",
    "https://pmkisan.gov.in/", "pmkisan.gov.in", "155261",
    "e-KYC is mandatory to keep receiving instalments — by OTP on the portal, face authentication in the app, or biometrics at a CSC.",
    "22nd instalment released March 2026, 23rd in June 2026. New registrations in 14 states now need an AgriStack Farmer ID.",
    ["Aadhaar", "Land records", "Aadhaar-seeded bank account"], "all"],
  ["PMFBY", "Pradhan Mantri Fasal Bima Yojana", "Crop insurance", "2% premium (kharif)",
    "Any farmer growing a notified crop in a notified area, including tenants and sharecroppers with a tenancy document. Voluntary since 2020.",
    "https://pmfby.gov.in/", "pmfby.gov.in", "14447",
    "Report crop damage within 72 hours through the app or helpline. Miss that window and the claim is rejected however genuine the loss.",
    "From Kharif 2026 the cover was extended to wild animal attacks and paddy inundation.",
    ["Aadhaar", "Land records or tenancy proof", "Sowing certificate"], "all"],
  ["Soil Health Card", "Soil Health Card Scheme", "Soil testing", "Free",
    "Every farm holding. Twelve parameters tested, with a crop-wise fertiliser recommendation for your plot.",
    "https://soilhealth.dac.gov.in/", "soilhealth.dac.gov.in", "1800-180-1551",
    "Samples are geo-tagged onto a GIS map, so the card is tied to your actual plot rather than a village average. Re-test every two years.",
    "The single highest-value scheme for this app — entering your card values changes both the fertiliser plan and the crop ranking.",
    ["Aadhaar", "Land records (khasra / khatauni)"], "all"],
  ["Kisan Credit Card", "Kisan Credit Card Scheme", "Credit", "₹3 lakh at 4%",
    "Farmers, tenant farmers, oral lessees and sharecroppers. Also covers animal husbandry and fisheries.",
    "https://fasalrin.gov.in/", "fasalrin.gov.in", "1800-180-1551",
    "The 4% rate needs repayment by the due date. Miss it and the rate jumps back to the full card rate.",
    "", ["Aadhaar", "PAN", "Land records"], "all"],
  ["PMKSY — Per Drop More Crop", "Pradhan Mantri Krishi Sinchayee Yojana", "Irrigation", "55% on drip",
    "Farmers with an assured water source and clear land title. 55% for small and marginal farmers, 45% for others.",
    "https://pmksy.gov.in/", "pmksy.gov.in", "1800-180-1551",
    "If the Crops tab keeps ruling out options because your plot is rainfed, this is the scheme that changes that answer.",
    "", ["Land records", "Water source proof", "Bank details"], "all"],
  ["SMAM Machinery Subsidy", "Sub-Mission on Agricultural Mechanization", "Equipment", "40–50%",
    "Individual farmers, FPOs and custom hiring centres. Higher share for SC/ST, women, and small and marginal farmers.",
    "https://agrimachinery.nic.in/", "agrimachinery.nic.in", "1800-180-1551",
    "Renting through a custom hiring centre is usually better arithmetic on a plot under five acres.",
    "", ["Aadhaar", "Land records", "Bank details"], "all"],
  ["e-NAM", "National Agriculture Market", "Marketing", "Online mandi",
    "Any farmer registered with a participating APMC. Sell across states with assaying and direct payment.",
    "https://enam.gov.in/", "enam.gov.in", "1800-270-0224",
    "Useful when your local mandi rate sits below MSP and a buyer in another district is paying more.",
    "", ["Aadhaar", "Bank account", "Mandi registration"], "all"],
  ["Kisan Call Centre", "Kisan Call Centre and mKisan advisory", "Advisory", "Free",
    "Anyone. Free agricultural advice by phone in 22 languages, 6 a.m. to 10 p.m., answered by agriculture graduates.",
    "https://mkisan.gov.in/", "mkisan.gov.in", "1800-180-1551",
    "When this app refuses to name a disease, this number and your nearest KVK are the right next step.",
    "", [], "all"],
  ["Namo Shetkari Mahasanman Nidhi", "Namo Shetkari Mahasanman Nidhi Yojana", "Income support", "₹6,000/year extra",
    "PM-KISAN beneficiaries in Maharashtra, taking the total to ₹12,000 a year. No separate application.",
    "https://nsmny.mahait.org/", "nsmny.mahait.org", "020-26123648",
    "", "", ["PM-KISAN registration"], "MH"],
].map(([name, full, tag, amount, who, url, site, phone, caution, recent, docs, states]) => ({
  name, full, tag, amount, who, url, site, phone, caution, recent, docs, states,
  google: `https://www.google.com/search?q=${encodeURIComponent(`${full} scheme India eligibility how to apply ${site}`)}`,
}));

const MANDI = [
  ["Cotton (Medium Staple)", "Akola", 7420, 7180, 7710],
  ["Soybean", "Latur", 4680, 4750, 5328],
  ["Tur / Arhar", "Nagpur", 9850, 9850, 8000],
  ["Onion", "Lasalgaon", 2240, 1890, null],
  ["Wheat", "Jalgaon", 2610, 2570, 2585],
  ["Maize", "Sangli", 2190, 2240, 2400],
].map(([crop, market, price, prev, msp]) => ({ crop, market, price, prev, msp }));

const PLAN = [
  { stage: "Basal dose", das: 0, date: "18 Jun", done: true, what: "DAP 50 kg + MOP 25 kg per acre, placed 5 cm below the seed and covered." },
  { stage: "First top-dress", das: 30, date: "18 Jul", done: true, what: "Urea 35 kg per acre, side-placed beside the row and covered after irrigation." },
  { stage: "Second top-dress", das: 60, date: "17 Aug", overdue: 10, what: "Urea 35 kg + MOP 20 kg per acre. Split it if soil moisture is low." },
  { stage: "Boll development", das: 90, date: "16 Sep", inDays: 20, what: "2% DAP foliar spray. Add MgSO₄ 5 kg/acre if leaves start reddening." },
  { stage: "Final nutrition", das: 110, date: "06 Oct", inDays: 40, what: "1% KNO₃ foliar spray. Stop all nitrogen from this point." },
];

/* ─────────────────────────────  atoms  ───────────────────────────── */

const Card = ({ children, style, accent, onClick, ...r }) => (
  <div
    onClick={onClick} tabIndex={onClick ? 0 : undefined} role={onClick ? "button" : undefined}
    onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(e); } } : undefined}
    style={{
      background: C.card, border: `1px solid ${C.line}`,
      borderLeft: accent ? `3px solid ${accent}` : `1px solid ${C.line}`,
      borderRadius: 4, padding: 18, cursor: onClick ? "pointer" : "default", ...style,
    }} {...r}
  >{children}</div>
);

/* Renders a component held in a variable — `const Icon = item.icon; <Icon />`.
   If the reference is ever undefined, React throws "element type is invalid"
   and the whole tree white-screens on a missing icon. Holding the same box
   instead keeps the layout identical and the app alive. */
const Ico = ({ as: A, size = 24, ...p }) =>
  A ? <A size={size} {...p} />
    : <span aria-hidden style={{ display: "inline-block", width: size, height: size, flexShrink: 0 }} />;

const Eye = ({ children, c = C.mute }) => (
  <div className="m" style={{ fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: c, fontWeight: 600 }}>{children}</div>
);

const Btn = ({ children, onClick, kind = "solid", full, disabled, style, ...r }) => (
  <button className="b" onClick={onClick} disabled={disabled} style={{
    padding: "12px 20px", borderRadius: 3, fontSize: 14.5, fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer", width: full ? "100%" : "auto",
    opacity: disabled ? 0.4 : 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    ...(kind === "solid" ? { background: C.leaf, color: C.bg, border: "1px solid transparent" }
      : kind === "danger" ? { background: C.rust, color: "#fff", border: "1px solid transparent" }
        : { background: "transparent", color: C.ink, border: `1px solid ${C.line}` }),
    ...style,
  }} {...r}>{children}</button>
);

const Field = ({ label, hint, ...p }) => (
  <label style={{ display: "block", marginBottom: 16 }}>
    <div style={{ marginBottom: 7 }}><Eye>{label}</Eye></div>
    <input {...p} style={{ width: "100%", padding: "13px 14px", background: C.bg, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 3, fontSize: 16, outline: "none" }} />
    {hint && <div style={{ fontSize: 12, color: C.mute, marginTop: 6, lineHeight: 1.5 }}>{hint}</div>}
  </label>
);

const Pill = ({ level, children }) => {
  const c = { critical: C.rust, severe: C.rust, high: C.rust, moderate: C.ochre, medium: C.ochre, low: C.leaf, optimum: C.leaf }[level] ?? C.mute;
  return <span className="m" style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: c, border: `1px solid ${c}55`, background: `${c}14`, padding: "3px 8px", borderRadius: 2, whiteSpace: "nowrap" }}>{children ?? level}</span>;
};

const Seg = ({ options, value, onChange, cols }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols ?? options.length},1fr)`, gap: 6 }}>
    {options.map(([v, l]) => (
      <button key={v || "any"} className="b" onClick={() => onChange(v)} style={{
        padding: "10px 6px", fontSize: 12.5, fontWeight: 600, borderRadius: 3, cursor: "pointer",
        background: value === v ? `${C.leaf}1F` : "transparent",
        color: value === v ? C.leaf : C.dim, border: `1px solid ${value === v ? C.leaf : C.line}`,
      }}>{l}</button>
    ))}
  </div>
);

const Slider = ({ label, value, min, max, step, onChange, right }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9, gap: 10, alignItems: "center" }}>
      <Eye>{label}</Eye>{right}
    </div>
    <input type="range" min={min} max={max} step={step} value={value} aria-label={label}
      onChange={(e) => onChange(Number(e.target.value))} style={{ width: "100%" }} />
  </div>
);

const Note = ({ children, icon: I = Info, c = C.mute }) => (
  <Card style={{ padding: 14 }}>
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <Ico as={I} size={15} color={c} style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ fontSize: 12.5, color: c, lineHeight: 1.6 }}>{children}</div>
    </div>
  </Card>
);

const speak = (text, lang) => {
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LOCALE[lang] ?? "en-IN";
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  } catch { /* speech is a bonus, never a dependency */ }
};

const Say = ({ text, lang }) => (
  <button className="b" aria-label="Read aloud" onClick={(e) => { e.stopPropagation(); speak(text, lang); }}
    style={{ background: "transparent", border: `1px solid ${C.line}`, borderRadius: 3, color: C.dim, cursor: "pointer", padding: "6px 9px", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
    <Volume2 size={13} /> Listen
  </button>
);

const Steps = ({ items, color }) => items.map((s, i) => (
  <div key={i} style={{ display: "flex", gap: 11, padding: "9px 0", fontSize: 14, lineHeight: 1.6, borderTop: i ? `1px solid ${C.line}66` : "none" }}>
    <span className="m" style={{ color, fontSize: 11, paddingTop: 3 }}>{String(i + 1).padStart(2, "0")}</span>{s}
  </div>
));

/* signature element */
const RiskDial = ({ value, label, sub }) => {
  const [v, setV] = useState(0);
  useEffect(() => { const t = setTimeout(() => setV(value), 100); return () => clearTimeout(t); }, [value]);
  const L = Math.PI * 62;
  const c = value > 70 ? C.rust : value > 40 ? C.ochre : C.leaf;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
      <svg width="160" height="94" viewBox="0 0 160 94" role="img" aria-label={`Risk ${value} of 100`}>
        <path d="M18 82 A62 62 0 0 1 142 82" fill="none" stroke={C.line} strokeWidth="9" strokeLinecap="round" />
        <path d="M18 82 A62 62 0 0 1 142 82" fill="none" stroke={c} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={L} strokeDashoffset={L - (L * v) / 100}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1)" }} />
        <text x="80" y="72" textAnchor="middle" fill={C.ink} className="d" style={{ fontSize: 34, fontWeight: 800 }}>{value}</text>
      </svg>
      <div style={{ flex: 1, minWidth: 160 }}>
        <Eye c={c}>{label}</Eye>
        <div className="d" style={{ fontSize: 19, marginTop: 6, fontWeight: 700 }}>
          {value > 70 ? "Act today" : value > 40 ? "Scout your field" : "Keep watching"}
        </div>
        <div style={{ fontSize: 13.5, color: C.dim, marginTop: 6, lineHeight: 1.55 }}>{sub}</div>
      </div>
    </div>
  );
};

/* ───────────────────────────  location  ─────────────────────────── */

const ZONES = {
  MH: ["Deccan Plateau", ["cotton", "soybean", "sugarcane", "pigeonpea"]],
  TN: ["Southern Coastal Plains", ["rice", "groundnut", "sugarcane"]],
  PB: ["Trans-Gangetic Plains", ["wheat", "rice", "maize"]],
  KA: ["Southern Plateau", ["maize", "cotton", "groundnut"]],
  WB: ["Lower Gangetic Plains", ["rice", "mustard", "onion"]],
  GJ: ["Gujarat Plains and Hills", ["cotton", "groundnut", "wheat"]],
  UP: ["Upper Gangetic Plains", ["wheat", "sugarcane", "rice"]],
  AP: ["East Coast Plains", ["rice", "chilli", "cotton"]],
  TS: ["Southern Plateau", ["cotton", "rice", "maize"]],
  KL: ["West Coast Plains and Ghats", ["rice", "banana"]],
  OD: ["East Coast Plains", ["rice", "groundnut"]],
  AS: ["Lower Brahmaputra Valley", ["rice"]],
  RJ: ["Western Dry Region", ["pearl millet", "mustard", "chickpea"]],
  MP: ["Central Plateau and Hills", ["soybean", "wheat", "chickpea"]],
  BR: ["Middle Gangetic Plains", ["rice", "wheat", "maize"]],
  HR: ["Trans-Gangetic Plains", ["wheat", "rice", "mustard"]],
};

const KVKS = {
  MH: ["KVK Akola", "0724-2258219"], TN: ["KVK Coimbatore", "0422-6611234"],
  PB: ["KVK Ludhiana", "0161-2401960"], KA: ["KVK Bengaluru Rural", "080-28466520"],
  AP: ["KVK Guntur", "0863-2354871"], UP: ["KVK Lucknow", "0522-2841022"],
  RJ: ["KVK Jaipur", "0141-2550341"],
};

/** Accuracy decides what the app is allowed to do with a fix. A cell-tower
 *  position two kilometres wide is fine for weather and useless for an
 *  outbreak map — pretending otherwise sends an officer to the wrong village. */
function tierOf(m) {
  if (m == null) return { tier: "unknown", plot: false, msg: "Accuracy unknown — advice stays district-level." };
  if (m < 100) return { tier: "plot", plot: true, msg: `Accurate to about ${Math.round(m)} m. Precise enough to tie a report to this plot.` };
  if (m < 5000) return { tier: "district", plot: false, msg: `Accurate to about ${(m / 1000).toFixed(1)} km. Fine for weather and advisories, too coarse for the outbreak map.` };
  return { tier: "coarse", plot: false, msg: "Very approximate. Step outside for a better fix, or keep your district set by hand." };
}

/** Watches for a few seconds and keeps the best fix, because GPS accuracy
 *  improves as satellites lock. One getCurrentPosition call gives you whatever
 *  the phone had lying around. */
function useGeo() {
  const [s, setS] = useState({ status: "idle", coords: null, error: null });
  const watch = useRef(null);
  const best = useRef(null);

  useEffect(() => () => { if (watch.current != null) navigator.geolocation?.clearWatch(watch.current); }, []);

  const request = useCallback(() => {
    if (!("geolocation" in navigator)) { setS({ status: "unsupported", coords: null, error: null }); return; }
    setS({ status: "locating", coords: null, error: null });
    best.current = null;

    const done = () => {
      if (watch.current != null) { navigator.geolocation.clearWatch(watch.current); watch.current = null; }
      if (best.current) setS({ status: "ready", coords: best.current, error: null });
      else setS({ status: "error", coords: null, error: "Could not get a fix. Step outside and try again." });
    };
    const timer = setTimeout(done, 8000);

    watch.current = navigator.geolocation.watchPosition(
      (p) => {
        const c = { lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy };
        if (!best.current || c.acc < best.current.acc) best.current = c;
        if (c.acc <= 50) { clearTimeout(timer); done(); }
      },
      (err) => {
        clearTimeout(timer);
        if (watch.current != null) { navigator.geolocation.clearWatch(watch.current); watch.current = null; }
        setS({
          status: err.code === err.PERMISSION_DENIED ? "denied" : "error", coords: null,
          error: err.code === err.PERMISSION_DENIED
            ? "Permission refused. Everything still works — your district is set by hand, just less precisely."
            : "Could not get a location fix. Step outside and try again.",
        });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }, []);

  return { ...s, tier: tierOf(s.coords?.acc), request };
}

function LocationCard({ geo, user }) {
  const [zone, crops] = ZONES[user.state.id] ?? ["Unclassified", []];
  const [kvk, phone] = KVKS[user.state.id] ?? [`KVK ${user.district || user.state.name}`, "1800-180-1551"];
  const busy = geo.status === "locating";
  const ok = geo.status === "ready";

  return (
    <Card accent={ok ? C.leaf : geo.status === "denied" ? C.ochre : C.sky}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <Eye c={ok ? C.leaf : C.sky}>{ok ? "Located" : "Location"}</Eye>
          <div className="d" style={{ fontSize: 18, fontWeight: 700, marginTop: 7, lineHeight: 1.35 }}>
            {ok ? `${user.district || user.state.name}, ${user.state.name}` : "Use my exact location"}
          </div>
          <div style={{ fontSize: 13.5, color: C.dim, marginTop: 7, lineHeight: 1.6 }}>
            {ok ? geo.tier.msg
              : geo.error
                ? geo.error
                : "IMD issues warnings by district, mandi rates are per APMC, and blight risk turns on your own humidity. A one-time fix makes all three specific to your field instead of your state."}
          </div>
        </div>
        {ok && <Pill level={geo.tier.plot ? "low" : "medium"}>{geo.tier.tier}</Pill>}
      </div>

      {ok ? (
        <div style={{ marginTop: 14, paddingTop: 13, borderTop: `1px solid ${C.line}`, display: "grid", gap: 9, fontSize: 13, color: C.body }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <span style={{ color: C.mute }}>Agro-climatic zone</span><span>{zone}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <span style={{ color: C.mute }}>Coordinates</span>
            <span className="m" style={{ fontSize: 12 }}>{geo.coords.lat.toFixed(4)}, {geo.coords.lon.toFixed(4)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <span style={{ color: C.mute }}>Grown around you</span>
            <span style={{ textAlign: "right" }}>{crops.join(", ")}</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
            <Btn kind="ghost" style={{ flex: 1, padding: "10px 14px", fontSize: 13 }}
              onClick={() => openLink(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Krishi Vigyan Kendra " + (user.district || user.state.name))}`)}>
              <Navigation size={15} /> {kvk}
            </Btn>
            <Btn kind="ghost" style={{ padding: "10px 14px", fontSize: 13 }} onClick={() => openLink(`tel:${phone}`)}>
              <Phone size={15} />
            </Btn>
          </div>
          <div style={{ fontSize: 12, color: C.mute, lineHeight: 1.55, marginTop: 2 }}>
            Only your district is stored, never a continuous trace. An outbreak map needs to know which block, not where you stood on Tuesday.
          </div>
        </div>
      ) : (
        <Btn full style={{ marginTop: 14 }} disabled={busy} onClick={geo.request}>
          {busy ? <><Loader2 size={16} className="spin" /> Getting a good fix…</> : <><Navigation size={16} /> Share my location once</>}
        </Btn>
      )}
    </Card>
  );
}

/* ───────────────────────────  onboarding  ─────────────────────────── */

function Onboard({ onDone }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ name: "", phone: "", otp: "", role: "farmer", state: null, lang: "en", district: "" });
  const l = f.lang;
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const shell = (kids) => (
    <div className="cg" style={{ minHeight: "100vh", background: C.bg, color: C.ink, display: "flex" }}>
      <Font />
      <style>{`@media(min-width:900px){.rail{display:flex!important}.mob{display:none!important}}`}</style>
      <div className="rail" style={{ flex: "0 0 42%", maxWidth: 500, background: `linear-gradient(158deg,${C.leafDim},${C.bg} 62%)`, padding: 46, display: "none", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Leaf size={26} strokeWidth={2.4} />
            <span className="d" style={{ fontSize: 21, fontWeight: 800 }}>CropGuard AI</span>
          </div>
          <div className="d" style={{ fontSize: 42, lineHeight: 1.12, marginTop: 54, fontWeight: 800, letterSpacing: "-.03em" }}>{tr(l, "tagline")}</div>
          <div style={{ fontSize: 15, color: "#DAD5C8", marginTop: 20, lineHeight: 1.65, maxWidth: 350 }}>
            Photograph a leaf and get a diagnosis in seconds, with or without signal. See what the weather is about to let into your field, and what to do before it lands.
          </div>
        </div>
        <div style={{ display: "grid", gap: 13 }}>
          {[[Camera, "On-device scanning that works with no network"], [CloudRain, "Weather-driven risk forecasting"], [FlaskConical, "Soil-linked fertiliser and crop advice"], [Microscope, "Every diagnosis reviewable by an expert"]].map(([I, t]) => (
            <div key={t} style={{ display: "flex", gap: 11, alignItems: "center", fontSize: 13.5, color: "#D0CABC" }}>
              <Ico as={I} size={15} color={C.leaf} /> {t}
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 22 }}>
        <div className="fade" key={step} style={{ width: "100%", maxWidth: 430 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i <= step ? C.leaf : C.line }} />)}
          </div>
          <Eye c={C.leaf}>Step {step + 1} of 3</Eye>
          {kids}
        </div>
      </div>
    </div>
  );

  const H = ({ children }) => <h1 className="d" style={{ fontSize: 30, fontWeight: 800, margin: "10px 0 18px", letterSpacing: "-.02em" }}>{children}</h1>;

  if (step === 0) return shell(
    <>
      <H>{tr(l, "signIn")}</H>
      <Field label={tr(l, "name")} value={f.name} placeholder="Ramesh Patil" onChange={(e) => set("name", e.target.value)} />
      <Field label={tr(l, "phone")} value={f.phone} placeholder="98XXXXXXXX" inputMode="numeric" maxLength={10} onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} />
      <Field label={tr(l, "otp")} value={f.otp} placeholder="1234" inputMode="numeric" maxLength={4}
        hint="Demo build — any four digits work. The real app sends a DLT-registered SMS."
        onChange={(e) => set("otp", e.target.value.replace(/\D/g, ""))} />
      <div style={{ marginBottom: 22 }}>
        <div style={{ marginBottom: 8 }}><Eye>{tr(l, "role")}</Eye></div>
        <Seg cols={3} value={f.role} onChange={(v) => set("role", v)}
          options={[["farmer", tr(l, "farmer")], ["extension", tr(l, "extension")], ["officer", tr(l, "officer")]]} />
      </div>
      <Btn full disabled={!(f.name && f.phone.length === 10 && f.otp.length === 4)} onClick={() => setStep(1)}>
        {tr(l, "next")} <ChevronRight size={17} />
      </Btn>
    </>
  );

  if (step === 1) return shell(
    <>
      <H>{tr(l, "selectState")}</H>
      <p style={{ color: C.dim, fontSize: 14, margin: "-8px 0 18px", lineHeight: 1.6 }}>
        Advisories, mandi rates, pest history and language all follow your state's agro-climatic zone.
      </p>
      <div className="nb" style={{ maxHeight: 300, overflowY: "auto", display: "grid", gap: 6, marginBottom: 18 }}>
        {STATES.map((s) => (
          <button key={s.id} className="b" onClick={() => { set("state", s); set("lang", s.langs[0]); }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", cursor: "pointer", borderRadius: 3, textAlign: "left", color: C.ink, background: f.state?.id === s.id ? `${C.leaf}1A` : C.card, border: `1px solid ${f.state?.id === s.id ? C.leaf : C.line}` }}>
            <span>
              <span style={{ fontSize: 14.5, fontWeight: 600 }}>{s.name}</span>
              <span style={{ fontSize: 13, color: C.dim, marginLeft: 8 }}>{s.native}</span>
            </span>
            <span className="m" style={{ fontSize: 9.5, color: C.mute }}>{s.zone}</span>
          </button>
        ))}
      </div>
      {f.state && <div className="fade"><Field label={tr(l, "district")} value={f.district} placeholder="Akola"
        hint="Used for IMD district warnings and your nearest KVK." onChange={(e) => set("district", e.target.value)} /></div>}
      <div style={{ display: "flex", gap: 9 }}>
        <Btn kind="ghost" onClick={() => setStep(0)}><ArrowLeft size={16} /> Back</Btn>
        <Btn full disabled={!f.state} onClick={() => setStep(2)}>{tr(l, "next")} <ChevronRight size={17} /></Btn>
      </div>
    </>
  );

  return shell(
    <>
      <H>{tr(l, "selectLang")}</H>
      <p style={{ color: C.dim, fontSize: 14, margin: "-8px 0 18px", lineHeight: 1.6 }}>
        Mother tongue of {f.state.name} first, then link languages. Advisories are read aloud too, for anyone who would rather listen than read.
      </p>
      <Eye c={C.leaf}>Spoken in {f.state.name}</Eye>
      <div style={{ display: "grid", gap: 7, margin: "10px 0 20px" }}>
        {f.state.langs.map((code, i) => (
          <button key={code} className="b" onClick={() => set("lang", code)}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 15px", cursor: "pointer", borderRadius: 3, color: C.ink, background: f.lang === code ? `${C.leaf}1A` : C.card, border: `1px solid ${f.lang === code ? C.leaf : C.line}` }}>
            <span style={{ fontSize: 17, fontWeight: 600 }}>{LANGS[code]}</span>
            <span className="m" style={{ fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: i === 0 ? C.leaf : C.mute }}>
              {i === 0 ? "Mother tongue" : code === "en" ? "Common" : "Also spoken"}
            </span>
          </button>
        ))}
      </div>
      <Eye>All Indian languages</Eye>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "10px 0 24px" }}>
        {Object.keys(LANGS).filter((c) => !f.state.langs.includes(c)).map((code) => (
          <button key={code} className="b" onClick={() => set("lang", code)}
            style={{ padding: "7px 12px", fontSize: 13.5, borderRadius: 20, cursor: "pointer", background: f.lang === code ? `${C.leaf}1A` : "transparent", color: f.lang === code ? C.leaf : C.dim, border: `1px solid ${f.lang === code ? C.leaf : C.line}` }}>{LANGS[code]}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 9 }}>
        <Btn kind="ghost" onClick={() => setStep(1)}><ArrowLeft size={16} /> Back</Btn>
        <Btn full onClick={() => onDone(f)}>Open CropGuard <ChevronRight size={17} /></Btn>
      </div>
    </>
  );
}

/* ──────────────────────────────  tabs  ────────────────────────────── */

function HotspotMap() {
  const pts = [
    [30, 34, C.rust, "Pink bollworm", 3],
    [66, 26, C.ochre, "Jassid", 1],
    [74, 66, C.ochre, "Bacterial leaf blight", 2],
  ];
  const [sel, setSel] = useState(null);
  return (
    <div>
      <svg viewBox="0 0 100 100" role="img" aria-label="Confirmed pest reports near your farm"
        style={{ width: "100%", height: 180, background: C.bg, borderRadius: 3, border: `1px solid ${C.line}` }}>
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i}>
            <line x1={(i + 1) * 10} y1="0" x2={(i + 1) * 10} y2="100" stroke={C.line} strokeWidth=".3" />
            <line x1="0" y1={(i + 1) * 10} x2="100" y2={(i + 1) * 10} stroke={C.line} strokeWidth=".3" />
          </g>
        ))}
        <path d="M0 58 Q26 50 48 62 T100 54" fill="none" stroke={C.sky} strokeWidth=".7" opacity=".5" />
        {pts.map(([x, y, c], i) => (
          <g key={i} onClick={() => setSel(sel === i ? null : i)} style={{ cursor: "pointer" }}>
            <circle cx={x} cy={y} r="8" fill={c} opacity=".14" className="pulse" />
            <circle cx={x} cy={y} r="4" fill={c} opacity=".3" />
            <circle cx={x} cy={y} r="1.6" fill={c} />
          </g>
        ))}
        <circle cx="50" cy="50" r="2.2" fill="none" stroke={C.ink} strokeWidth=".8" />
        <circle cx="50" cy="50" r=".9" fill={C.ink} />
      </svg>
      <div style={{ marginTop: 11, fontSize: 13, color: sel !== null ? C.ink : C.dim, lineHeight: 1.55 }}>
        {sel !== null
          ? <><strong style={{ color: pts[sel][2] }}>{pts[sel][3]}</strong> — {pts[sel][4]} confirmed report{pts[sel][4] === 1 ? "" : "s"} in this grid cell.</>
          : "The white ring is your farm. Tap a cluster for detail. Only expert-confirmed or high-confidence reports appear here — an unchecked model output should never become a district alarm."}
      </div>
    </div>
  );
}

function HomeTab({ user, go, m, risk, soil, geo }) {
  const l = user.lang;
  return (
    <div style={{ display: "grid", gap: 14 }}>
      {geo.status !== "ready" && <LocationCard geo={geo} user={user} />}

      <Card accent={risk.score > 70 ? C.rust : risk.score > 40 ? C.ochre : C.leaf}>
        <RiskDial value={risk.score} label={tr(l, "risk")} sub={risk.driver} />
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.line}`, display: "flex", gap: 10 }}>
          <AlertTriangle size={15} color={C.ochre} style={{ flexShrink: 0, marginTop: 3 }} />
          <div style={{ fontSize: 13.5, lineHeight: 1.55, color: C.body }}>{risk.action}</div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(148px,1fr))", gap: 12 }}>
        {[
          [Camera, tr(l, "scan"), "Photo diagnosis", "scan", C.leaf],
          [CloudRain, tr(l, "weather"), `${m.rain72} mm coming`, "weather", C.sky],
          [FlaskConical, tr(l, "soil"), soil.has ? "Test on record" : "No test yet", "soil", soil.has ? C.leaf : C.rust],
          [Wheat, tr(l, "crops"), "What to sow next", "crops", C.violet],
          [Plane, "Drone", "Edge AI survey", "drone", C.ochre],
        ].map(([I, t, s, to, c]) => (
          <Card key={to} onClick={() => go(to)} style={{ padding: 15 }}>
            <Ico as={I} size={20} color={c} strokeWidth={2.2} />
            <div className="d" style={{ fontSize: 16, fontWeight: 700, marginTop: 11 }}>{t}</div>
            <div style={{ fontSize: 12.5, color: C.dim, marginTop: 3 }}>{s}</div>
          </Card>
        ))}
      </div>

      {!soil.has && (
        <Card accent={C.rust}>
          <Eye c={C.rust}>Accuracy is limited without this</Eye>
          <div className="d" style={{ fontSize: 18, fontWeight: 700, marginTop: 7 }}>Get a soil test before the next sowing</div>
          <div style={{ fontSize: 13.5, color: C.dim, marginTop: 7, lineHeight: 1.6 }}>
            Your fertiliser plan and crop ranking currently use a district average, not your field. The Soil Health Card test is free, takes about two weeks, and usually cuts fertiliser spend because you stop buying nutrients the soil already has.
          </div>
          <Btn kind="ghost" full style={{ marginTop: 14 }} onClick={() => go("soil")}>How to sample and where to send it</Btn>
        </Card>
      )}

      <Card accent={C.ochre}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <Eye c={C.ochre}>{tr(l, "due")}</Eye>
            <div className="d" style={{ fontSize: 19, fontWeight: 700, marginTop: 7 }}>Second urea top-dress</div>
            <div style={{ fontSize: 13.5, color: C.dim, marginTop: 5, lineHeight: 1.55 }}>
              Cotton at 60 days after sowing, overdue by 10 days. {m.rain6 > 5
                ? "Hold off — heavy rain within six hours will wash most of it away."
                : "Conditions are suitable. Apply it and cover it."}
            </div>
          </div>
          <Pill level="high" />
        </div>
        <Btn kind="ghost" full style={{ marginTop: 15 }} onClick={() => go("fert")}>Open the nutrition plan</Btn>
      </Card>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, gap: 10, flexWrap: "wrap" }}>
          <Eye>Confirmed reports near you</Eye>
          <span className="m" style={{ fontSize: 10, color: C.mute }}>{user.district || "Akola"} block · 14 days</span>
        </div>
        <HotspotMap />
      </Card>
    </div>
  );
}

function ScanTab({ user, offline, ready, onDownload, queue }) {
  const [view, setView] = useState("idle");
  const [res, setRes] = useState(null);
  const [rej, setRej] = useState(null);
  const [hint, setHint] = useState("");
  const file = useRef(null);
  const l = user.lang;

  const run = useCallback((e) => {
    if (e && !e.target.files?.[0]) return;      // picker cancelled
    if (file.current) file.current.value = "";  // so the same photo re-fires
    setView("loading");
    setTimeout(() => {
      if (Math.random() < 0.18) {               // ~1 in 5 photos is refused
        const k = Object.keys(REJECTS);
        setRej(k[Math.floor(Math.random() * k.length)]); setRes(null); setView("rejected");
      } else {
        const pool = hint ? DISEASES.filter((d) => d.crop.toLowerCase() === hint) : DISEASES;
        const src = pool.length ? pool : DISEASES;
        setRes(src[Math.floor(Math.random() * src.length)]); setRej(null); setView("done");
      }
    }, offline ? 900 : 1700);
  }, [hint, offline]);

  if (view === "loading") return (
    <Card style={{ textAlign: "center", padding: "54px 24px" }}>
      <Loader2 size={34} color={C.leaf} className="spin" style={{ margin: "0 auto" }} />
      <div className="d" style={{ fontSize: 19, marginTop: 20, fontWeight: 700 }}>Reading the symptoms</div>
      <div style={{ fontSize: 13.5, color: C.dim, lineHeight: 1.6, maxWidth: 330, margin: "9px auto 0" }}>
        {offline ? "Running the 5 MB model stored on this phone. No network needed."
          : "Comparing against field-confirmed images from your agro-climatic zone."}
      </div>
    </Card>
  );

  if (view === "rejected" && rej) {
    const [title, body] = REJECTS[rej];
    return (
      <div className="fade" style={{ display: "grid", gap: 14 }}>
        <Card accent={C.ochre}>
          <Eye c={C.ochre}>No diagnosis given</Eye>
          <div className="d" style={{ fontSize: 22, fontWeight: 800, marginTop: 9 }}>{title}</div>
          <div style={{ fontSize: 14.5, color: C.body, marginTop: 10, lineHeight: 1.65 }}>{body}</div>
          <div style={{ marginTop: 16, padding: 13, background: `${C.sky}12`, border: `1px solid ${C.sky}44`, borderRadius: 3, fontSize: 13, lineHeight: 1.6, display: "flex", gap: 10 }}>
            <Info size={15} color={C.sky} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>Refusing to answer is a feature. A confident wrong name leads to the wrong spray, wasted money, and residue on the crop.</span>
          </div>
        </Card>
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
          <Btn kind="ghost" onClick={() => { setView("idle"); setRej(null); }}>Try another photo</Btn>
          <Btn style={{ flex: 1 }}><Microscope size={16} /> Send to KVK</Btn>
        </div>
      </div>
    );
  }

  if (view === "done" && res) {
    const conf = Math.round(res.conf * 100);
    return (
      <div className="fade" style={{ display: "grid", gap: 14 }}>
        {offline && (
          <Card accent={C.violet} style={{ padding: 14 }}>
            <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
              <WifiOff size={16} color={C.violet} style={{ flexShrink: 0 }} />
              <div style={{ fontSize: 13, color: C.dim, lineHeight: 1.5 }}>
                Diagnosed on this phone with no network. Queued — it reaches the officer dashboard when you next have signal.
              </div>
            </div>
          </Card>
        )}

        <Card accent={["severe", "high"].includes(res.sev) ? C.rust : C.ochre}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 190 }}>
              <Eye c={C.leaf}>{res.crop} · identified</Eye>
              <div className="d" style={{ fontSize: 26, fontWeight: 800, marginTop: 8, letterSpacing: "-.02em" }}>{res.name}</div>
              <div className="d" style={{ fontSize: 14, color: C.dim, fontStyle: "italic", marginTop: 3 }}>{res.sci}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="m" style={{ fontSize: 32, fontWeight: 600, color: conf >= 85 ? C.leaf : C.ochre }}>{conf}%</div>
              <Eye>confidence</Eye>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 15, flexWrap: "wrap", alignItems: "center" }}>
            <Pill level={res.sev} /><Pill level="low">Awaiting expert review</Pill>
            <Say lang={l} text={`${res.name} on ${res.crop}, ${conf} percent confidence. ${res.cultural[0]}`} />
          </div>
          <div style={{ marginTop: 16, paddingTop: 15, borderTop: `1px solid ${C.line}`, fontSize: 14, lineHeight: 1.65 }}>
            <div><strong style={{ color: C.mute, fontSize: 12.5 }}>SIGNS MATCHED </strong>{res.signs}</div>
            <div style={{ marginTop: 9, color: C.body }}><strong style={{ color: C.mute, fontSize: 12.5 }}>WHY NOW </strong>{res.why}</div>
          </div>
        </Card>

        <Card accent={C.leaf}>
          <Eye c={C.leaf}>What to do — in this order</Eye>
          <div className="d" style={{ fontSize: 15, fontWeight: 700, margin: "17px 0 8px", color: C.leaf }}>1 · Cultural, do this today</div>
          <Steps items={res.cultural} color={C.leaf} />
          <div className="d" style={{ fontSize: 15, fontWeight: 700, margin: "17px 0 8px", color: C.sky }}>2 · Biological, this week</div>
          <Steps items={res.bio} color={C.sky} />
          <div className="d" style={{ fontSize: 15, fontWeight: 700, margin: "20px 0 4px", color: C.ochre }}>3 · Chemical, only past the threshold</div>
          <div style={{ fontSize: 13, color: C.dim, lineHeight: 1.6, marginBottom: 10 }}>
            <strong style={{ color: C.ochre }}>Threshold: </strong>{res.threshold}
          </div>
          {res.chem.map((c, i) => (
            <div key={i} style={{ padding: "11px 0", borderTop: `1px solid ${C.line}66`, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 170 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{c.m}</div>
                <div className="m" style={{ fontSize: 11.5, color: C.dim, marginTop: 3 }}>{c.d} · {c.g}</div>
              </div>
              <span className="m" style={{ fontSize: 11, color: C.rust, alignSelf: "center" }}>{c.phi}-day PHI</span>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: 13, background: `${C.rust}12`, border: `1px solid ${C.rust}44`, borderRadius: 3, display: "flex", gap: 10, fontSize: 13.5, lineHeight: 1.6 }}>
            <AlertTriangle size={16} color={C.rust} style={{ flexShrink: 0, marginTop: 2 }} />
            <span><strong style={{ color: C.rust }}>Residue and safety. </strong>{res.safety} Never harvest inside the pre-harvest interval — that is what gets consignments rejected.</span>
          </div>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))", gap: 12 }}>
          <Card style={{ padding: 15 }}>
            <Calendar size={17} color={C.sky} />
            <div style={{ fontSize: 12.5, color: C.dim, marginTop: 9 }}>Check again in</div>
            <div className="d" style={{ fontSize: 20, fontWeight: 700 }}>{res.follow} days</div>
          </Card>
          <Card style={{ padding: 15 }}>
            <Microscope size={17} color={C.sky} />
            <div style={{ fontSize: 12.5, color: C.dim, marginTop: 9 }}>If it does not improve</div>
            <div className="d" style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>KVK {user.district || "Akola"}</div>
          </Card>
        </div>

        <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
          <Btn kind="ghost" onClick={() => { setView("idle"); setRes(null); }}>Scan another</Btn>
          <Btn style={{ flex: 1 }}><Phone size={16} /> Call extension officer</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {offline && !ready && (
        <Card accent={C.rust}>
          <div className="d" style={{ fontSize: 17, fontWeight: 700 }}>Offline, and the model is not on this phone yet</div>
          <div style={{ fontSize: 13.5, color: C.dim, marginTop: 7, lineHeight: 1.6 }}>
            Download it once over Wi-Fi — 5.3 MB — and scanning works anywhere after that, with no signal at all.
          </div>
          <Btn full style={{ marginTop: 13 }} onClick={onDownload}><Download size={16} /> Download offline model</Btn>
        </Card>
      )}

      <Card>
        <input ref={file} type="file" accept="image/*" capture="environment" hidden onChange={run} />
        <div className="b" tabIndex={0} role="button" aria-label="Take or choose a photo to diagnose"
          onClick={() => file.current?.click()}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); file.current?.click(); } }}
          style={{ border: `2px dashed ${C.line}`, borderRadius: 4, padding: "44px 20px", textAlign: "center", cursor: "pointer" }}>
          <Camera size={38} color={C.leaf} strokeWidth={1.6} />
          <div className="d" style={{ fontSize: 20, fontWeight: 700, marginTop: 16 }}>Photograph one affected leaf</div>
          <div style={{ fontSize: 13.5, color: C.dim, lineHeight: 1.6, maxWidth: 310, margin: "8px auto 0" }}>
            Fill the frame with a single leaf or boll. Daylight, no flash, no shadow across the symptom.
          </div>
          <Btn style={{ marginTop: 18 }}><Upload size={16} /> {tr(l, "diagnose")}</Btn>
        </div>
        <div style={{ marginTop: 16, paddingTop: 15, borderTop: `1px solid ${C.line}` }}>
          <div style={{ marginBottom: 9 }}><Eye>Which crop is this? Optional, but it raises accuracy</Eye></div>
          <Seg cols={5} value={hint} onChange={setHint}
            options={[["", "Any"], ["cotton", "Cotton"], ["rice", "Rice"], ["tomato", "Tomato"], ["maize", "Maize"]]} />
          <div style={{ fontSize: 12, color: C.mute, marginTop: 9, lineHeight: 1.5 }}>
            Telling the model what is planted rules out most classes before it starts. A cotton field cannot have potato late blight.
          </div>
        </div>
      </Card>

      {queue > 0 && (
        <Note icon={RefreshCw} c={C.dim}>
          {queue} record{queue === 1 ? "" : "s"} waiting to sync. Nothing is lost — they upload the moment you have signal.
        </Note>
      )}
    </div>
  );
}

function WeatherTab({ hours, m, user, geo }) {
  const [view, setView] = useState("temp");
  const [key, unit, col] = { temp: ["temp", "°C", C.ochre], rh: ["rh", "%", C.sky], rain: ["rain", "mm", C.violet], wind: ["wind", "km/h", C.leaf] }[view];
  const vals = hours.map((h) => h[key]);
  const hi = Math.max(...vals, 1);
  const lo = view === "temp" ? Math.min(...vals) - 2 : 0;
  const span = hi - lo || 1;
  const path = vals.map((v, i) => `${(i / (vals.length - 1)) * 100},${40 - ((v - lo) / span) * 36}`).join(" L ");

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <Card accent={C.sky}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <div>
            <Eye c={C.sky}>{user.district || "Akola"} · {geo?.status === "ready" ? "your field" : "district"} · now</Eye>
            <div className="d" style={{ fontSize: 38, fontWeight: 800, marginTop: 6, letterSpacing: "-.03em" }}>{hours[0].temp}°</div>
            <div style={{ fontSize: 13.5, color: C.dim }}>Humid · {hours[0].rh}% relative humidity</div>
          </div>
          <div style={{ display: "grid", gap: 7 }}>
            {[[Droplets, `${m.rain72} mm over 72 h`], [Wind, `Gusting to ${m.maxWind} km/h`], [Sun, `${m.leafWet} h of leaf wetness`]].map(([I, t]) => (
              <div key={t} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: C.dim }}>
                <Ico as={I} size={14} color={C.sky} /> {t}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
          <Eye>Next 72 hours</Eye>
          <div style={{ minWidth: 240, flex: 1, maxWidth: 340 }}>
            <Seg cols={4} value={view} onChange={setView}
              options={[["temp", "Temp"], ["rh", "Humidity"], ["rain", "Rain"], ["wind", "Wind"]]} />
          </div>
        </div>
        <svg viewBox="0 0 100 44" preserveAspectRatio="none" style={{ width: "100%", height: 150 }}
          role="img" aria-label={`${view} forecast for the next 72 hours`}>
          {[0, 1, 2, 3].map((i) => <line key={i} x1="0" y1={4 + i * 12} x2="100" y2={4 + i * 12} stroke={C.line} strokeWidth=".25" />)}
          <path d={`M ${path} L 100,44 L 0,44 Z`} fill={col} opacity=".1" />
          <path d={`M ${path}`} fill="none" stroke={col} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="m" style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.mute, marginTop: 6 }}>
          <span>Now</span><span>+24 h</span><span>+48 h</span><span>+72 h</span>
        </div>
        <div style={{ fontSize: 12.5, color: C.dim, marginTop: 10 }}>Peak {hi} {unit} · low {Math.min(...vals)} {unit}</div>
      </Card>

      <Card accent={m.safe.length ? C.leaf : C.rust}>
        <Eye c={m.safe.length ? C.leaf : C.rust}>Spray window</Eye>
        <div className="d" style={{ fontSize: 19, fontWeight: 700, marginTop: 8, lineHeight: 1.35 }}>
          {!m.safe.length ? "No safe spray window in the next 72 hours"
            : m.safe[0] === 0 ? "Safe to spray right now"
              : `Safe to spray in about ${m.safe[0]} hour${m.safe[0] === 1 ? "" : "s"}`}
        </div>
        <div style={{ fontSize: 13.5, color: C.dim, marginTop: 8, lineHeight: 1.6 }}>
          {m.safe.length
            ? "Wind under 10 km/h, temperature under 33 °C, and no rain for six hours afterwards. Outside these hours the spray drifts or washes off and the tank is wasted."
            : "Rain or wind will wash off or drift anything you spray. Wait — a wasted tank costs more than a two-day delay."}
        </div>
        <div style={{ display: "flex", gap: 3, marginTop: 15 }}>
          {hours.slice(0, 36).map((_, i) => (
            <div key={i} title={`+${i} h`} style={{ flex: 1, height: 24, borderRadius: 1, background: m.safe.includes(i) ? C.leaf : `${C.rust}44` }} />
          ))}
        </div>
        <div className="m" style={{ fontSize: 10, color: C.mute, marginTop: 7, letterSpacing: ".06em" }}>GREEN = SAFE TO SPRAY · NEXT 36 HOURS</div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 12 }}>
        <Card accent={C.sky} style={{ padding: 16 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}><Droplets size={17} color={C.sky} /><Eye c={C.sky}>Irrigation</Eye></div>
          <div style={{ fontSize: 13.5, marginTop: 10, lineHeight: 1.6, color: C.body }}>
            Topsoil moisture is {(m.moist * 100).toFixed(0)}%. {m.rain72 > 15
              ? "Do not irrigate — enough rain is coming. Check your drains are open instead."
              : "Adequate for now, but if the forecast rain misses you, irrigate within 48 hours."}
          </div>
        </Card>
        <Card accent={C.ochre} style={{ padding: 16 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}><Sprout size={17} color={C.ochre} /><Eye c={C.ochre}>Fertiliser timing</Eye></div>
          <div style={{ fontSize: 13.5, marginTop: 10, lineHeight: 1.6, color: C.body }}>
            {m.rain6 > 5
              ? "Do not apply urea now. Heavy rain within six hours washes most of it straight past the roots."
              : "Suitable for top-dressing. Side-place and cover — broadcast urea on dry soil loses up to 40% to the air."}
          </div>
        </Card>
      </div>

      <Note>Open-Meteo (ICON and GFS ensembles, ~11 km) with official IMD district warnings layered on top. Cached on the phone, so the last forecast stays readable with no signal.</Note>
    </div>
  );
}

function SoilTab({ soil, setSoil, go }) {
  const [draft, setDraft] = useState(soil.values);
  const [guide, setGuide] = useState(!soil.has);
  const fixes = useMemo(() => corrections(draft), [draft]);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {!soil.has && (
        <Card accent={C.rust}>
          <Eye c={C.rust}>No soil test on record</Eye>
          <div className="d" style={{ fontSize: 21, fontWeight: 700, marginTop: 8, lineHeight: 1.3 }}>This is the cheapest accuracy you can buy</div>
          <div style={{ fontSize: 14, color: C.body, marginTop: 9, lineHeight: 1.65 }}>
            Without your own numbers, the fertiliser plan falls back to a district blanket recommendation — typically 15 to 30% more fertiliser than your field needs. The test is free, and most farmers who take it end up spending less, not more.
          </div>
          <Btn full style={{ marginTop: 15 }} onClick={() => setGuide((g) => !g)}>{guide ? "Hide" : "Show"} how to sample</Btn>
        </Card>
      )}

      {guide && (
        <Card accent={C.sky} className="fade">
          <Eye c={C.sky}>Taking the sample correctly</Eye>
          <div style={{ fontSize: 13, color: C.dim, margin: "9px 0 4px", lineHeight: 1.6 }}>
            A bad sample gives a confident wrong answer, which is worse than no test at all.
          </div>
          <Steps color={C.sky} items={[
            "Walk the plot in a zigzag and take 10 to 15 spots, not one.",
            "At each spot scrape the top 2 cm off, dig 15 cm deep, and take a slice down the side of the hole.",
            "Mix in a clean bucket, quarter the pile, discard opposite quarters, repeat until about 500 g is left.",
            "Do not sample right after fertiliser, or within a week of heavy rain.",
            "Label with your name, plot and last crop, and hand it in at the block agriculture office or KVK.",
          ]} />
          <div style={{ marginTop: 14, paddingTop: 13, borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontSize: 13 }}>
            <span style={{ color: C.body }}>Free under the Soil Health Card scheme · results in 10 to 20 days</span>
            <span className="m" style={{ color: C.sky, fontSize: 12 }}>soilhealth.dac.gov.in</span>
          </div>
        </Card>
      )}

      <Card>
        <Eye c={C.leaf}>Enter your results</Eye>
        <div className="d" style={{ fontSize: 19, fontWeight: 700, margin: "7px 0 6px" }}>Soil Health Card values</div>
        <div style={{ fontSize: 13, color: C.dim, marginBottom: 18, lineHeight: 1.6 }}>
          Copy them straight off the card. Drag any slider to see what changes.
        </div>

        {Object.entries(BANDS).map(([k, [label, unit, lo, hi, min, max, step]]) => {
          const v = draft[k];
          const st = statusOf(k, v);
          const c = st === "optimum" ? C.leaf : st === "low" ? C.ochre : C.rust;
          return (
            <div key={k} style={{ marginBottom: 20 }}>
              <Slider label={label} value={v} min={min} max={max} step={step}
                onChange={(n) => setDraft((d) => ({ ...d, [k]: n }))}
                right={<span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span className="m" style={{ fontSize: 14, color: c, fontWeight: 600 }}>{v}{unit && ` ${unit}`}</span>
                  <Pill level={st} />
                </span>} />
              <div className="m" style={{ fontSize: 10, color: C.mute, marginTop: 6, display: "flex", justifyContent: "space-between" }}>
                <span>{min}</span><span style={{ color: C.leaf }}>IDEAL {lo}–{hi}</span><span>{max}</span>
              </div>
            </div>
          );
        })}

        <Btn full onClick={() => setSoil({ has: true, values: draft, at: new Date().toLocaleDateString("en-IN") })}>
          <CheckCircle2 size={16} /> Save these results
        </Btn>
        {soil.has && (
          <div style={{ fontSize: 12.5, color: C.leaf, marginTop: 11, textAlign: "center", lineHeight: 1.5 }}>
            Saved {soil.at}. Your fertiliser plan and crop ranking now use these numbers.
          </div>
        )}
      </Card>

      {fixes.length > 0 && (
        <Card accent={C.ochre}>
          <Eye c={C.ochre}>Fix these first, in this order</Eye>
          <div style={{ fontSize: 13, color: C.dim, margin: "9px 0 4px", lineHeight: 1.6 }}>
            Soil correction comes before fertiliser. Adding nutrients to soil with the wrong pH mostly wastes them.
          </div>
          <Steps items={fixes} color={C.ochre} />
          <Btn kind="ghost" full style={{ marginTop: 14 }} onClick={() => go("crops")}>
            See which crops suit this soil <ChevronRight size={16} />
          </Btn>
        </Card>
      )}
    </div>
  );
}

function CropsTab({ soil, go }) {
  const [irrigation, setIrr] = useState("rainfed");
  const [season, setSeason] = useState("kharif");
  const [prev, setPrev] = useState("cotton");
  const [budget, setBudget] = useState(4000);
  const [area, setArea] = useState(2.4);
  const [open, setOpen] = useState(0);

  const results = useMemo(
    () => recommend({ soil: soil.values, hasSoil: soil.has, irrigation, season, prev, budget, area }),
    [soil, irrigation, season, prev, budget, area]);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <Card>
        <Eye c={C.violet}>What can this field actually grow</Eye>
        <div style={{ fontSize: 13.5, color: C.dim, margin: "10px 0 18px", lineHeight: 1.6 }}>
          Suitability is only half the answer. A crop that suits your soil but needs water you do not have is not a recommendation, it is a trap. Tell me what you are working with.
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <div><div style={{ marginBottom: 8 }}><Eye>Water available</Eye></div>
            <Seg cols={4} value={irrigation} onChange={setIrr}
              options={[["rainfed", "Rain only"], ["canal", "Canal"], ["borewell", "Borewell"], ["drip", "Drip"]]} /></div>
          <div><div style={{ marginBottom: 8 }}><Eye>Season you are planning for</Eye></div>
            <Seg cols={2} value={season} onChange={setSeason}
              options={[["kharif", "Kharif (Jun–Oct)"], ["rabi", "Rabi (Nov–Mar)"]]} /></div>
          <div><div style={{ marginBottom: 8 }}><Eye>Last season's crop</Eye></div>
            <Seg cols={4} value={prev} onChange={setPrev}
              options={[["cotton", "Cotton"], ["rice", "Rice"], ["wheat", "Wheat"], ["maize", "Maize"]]} /></div>
          <Slider label="Seed budget per acre" value={budget} min={500} max={12000} step={500} onChange={setBudget}
            right={<span className="m" style={{ fontSize: 13, color: C.leaf, fontWeight: 600 }}>{inr(budget)}</span>} />
          <Slider label="Plot size" value={area} min={0.25} max={15} step={0.25} onChange={setArea}
            right={<span className="m" style={{ fontSize: 13, color: C.leaf, fontWeight: 600 }}>{area} acre</span>} />
        </div>
      </Card>

      {!soil.has && (
        <Card accent={C.rust} style={{ padding: 15 }}>
          <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
            <FlaskConical size={16} color={C.rust} style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 13.5, color: C.dim, lineHeight: 1.6 }}>
              Ranked without a soil test, so pH and nutrient fit are guesses.{" "}
              <button className="b" onClick={() => go("soil")} style={{ background: "none", border: "none", color: C.leaf, cursor: "pointer", padding: 0, fontSize: 13.5, fontWeight: 600, textDecoration: "underline" }}>Enter your card values</button>{" "}and this list usually reorders.
            </div>
          </div>
        </Card>
      )}

      {results.slice(0, 5).map((r, i) => {
        const shown = open === i;
        const c = r.score >= 70 ? C.leaf : r.score >= 50 ? C.ochre : C.rust;
        return (
          <Card key={r.crop} accent={c} onClick={() => setOpen(shown ? -1 : i)}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 170 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span className="m" style={{ fontSize: 11, color: C.mute }}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="d" style={{ fontSize: 21, fontWeight: 700, textTransform: "capitalize" }}>{r.crop}</span>
                </div>
                <div style={{ fontSize: 12.5, color: C.dim, marginTop: 5 }}>
                  {r.days} days · {r.water} water · seed ≈ {inr(r.seed)}/acre
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="m" style={{ fontSize: 24, fontWeight: 600, color: c }}>{r.score}</div>
                <Eye>fit score</Eye>
              </div>
            </div>
            <div style={{ height: 4, background: C.line, borderRadius: 2, marginTop: 13, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${r.score}%`, background: c, transition: "width .5s cubic-bezier(.2,.8,.2,1)" }} />
            </div>
            {shown ? (
              <div className="fade" style={{ marginTop: 15 }}>
                {r.why.length > 0 && <>
                  <Eye c={C.leaf}>In its favour</Eye>
                  {r.why.map((w, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, padding: "8px 0", fontSize: 13.5, lineHeight: 1.6, color: C.body }}>
                      <CheckCircle2 size={14} color={C.leaf} style={{ flexShrink: 0, marginTop: 3 }} />{w}
                    </div>
                  ))}
                </>}
                {r.care.length > 0 && <div style={{ marginTop: 12 }}>
                  <Eye c={C.ochre}>Think about this first</Eye>
                  {r.care.map((w, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, padding: "8px 0", fontSize: 13.5, lineHeight: 1.6, color: C.body }}>
                      <AlertTriangle size={14} color={C.ochre} style={{ flexShrink: 0, marginTop: 3 }} />{w}
                    </div>
                  ))}
                </div>}
              </div>
            ) : <div style={{ fontSize: 12.5, color: C.mute, marginTop: 11 }}>Tap for the reasoning</div>}
          </Card>
        );
      })}

      <Note>A ranking is a starting point, not a decision. Before committing the whole field to something new, talk to your KVK and try it on a quarter of the plot first.</Note>
    </div>
  );
}

function AlertsTab({ user, m }) {
  const list = useMemo(() => {
    const out = [];
    if (m.rain72 > 45) out.push([CloudRain, "Disaster warning", "critical", `Heavy rainfall — ${m.rain72} mm over 72 hours`,
      "Open the drainage channels now, hold back every foliar spray, and move harvested produce under cover. Standing water for more than two days costs more than the disease will.", "Next 72 hours", "IMD orange warning + Open-Meteo"]);
    if (m.maxWind > 25) out.push([Wind, "Disaster warning", "high", `Strong wind — gusting to ${m.maxWind} km/h`,
      "Stake tall crops and secure nursery covers. Do not spray: drift wastes the tank and lands on your neighbour's field.", "Next 72 hours", "Open-Meteo"]);
    out.push([Bug, "Pest surveillance", "high", "Pink bollworm hotspot 6 km away",
      "Three farms in your block crossed the economic threshold this week. Check your bolls today and count what the traps caught last night.", "Confirmed yesterday", "Expert-validated reports"]);
    if (m.rhHi > 30) out.push([CloudRain, "Disease risk window", "medium", "Blight-favourable window opening",
      `${m.rhHi} hours above 85% humidity are forecast with night temperatures of 22–26 °C. That combination is what lets blight in. A preventive contact fungicide now beats a curative spray later.`, "Starts in about 26 hours", "CropGuard risk model"]);
    out.push([Sprout, "Your nutrition plan", "medium", "Overdue: second urea top-dress",
      "Cotton at 60 days after sowing, 10 days late. Apply once the rain passes, not before it.", "Due 17 Aug", "Your plot record"]);
    return out;
  }, [m]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {list.map(([I, kind, level, title, body, when, src], i) => (
        <Card key={i} accent={level === "medium" ? C.ochre : C.rust}>
          <div style={{ display: "flex", gap: 13 }}>
            <Ico as={I} size={20} color={level === "medium" ? C.ochre : C.rust} style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <Eye c={level === "medium" ? C.ochre : C.rust}>{kind}</Eye><Pill level={level} />
              </div>
              <div className="d" style={{ fontSize: 17, fontWeight: 700, marginTop: 8, lineHeight: 1.35 }}>{title}</div>
              <div style={{ fontSize: 14, color: C.body, marginTop: 7, lineHeight: 1.65 }}>{body}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <span className="m" style={{ fontSize: 10, color: C.mute, letterSpacing: ".08em", textTransform: "uppercase" }}>{when} · {src}</span>
                <Say text={`${title}. ${body}`} lang={user.lang} />
              </div>
            </div>
          </div>
        </Card>
      ))}
      <Note icon={Bell} c={C.dim}>
        Critical alerts also go out by SMS and voice call in {LANGS[user.lang]}, so they reach you on a feature phone and with the app closed.
      </Note>
    </div>
  );
}

function FertTab({ soil, m }) {
  const plan = useMemo(() => {
    let [urea, dap, mop] = [76, 50, 45];
    if (!soil.has) return { urea, dap, mop, notes: ["No soil test on record, so this is the state blanket recommendation. It usually runs 15 to 30% above what a field actually needs."] };
    const notes = [];
    const v = soil.values;
    if (v.n > 560) { urea = Math.round(urea * 0.7); notes.push("Nitrogen cut 30% — your soil already has plenty. That is money you do not need to spend, and excess nitrogen invites blight and sucking pests."); }
    else if (v.n < 280) { urea = Math.round(urea * 1.25); notes.push("Nitrogen raised 25% — your soil tested low. Split it across three applications rather than one."); }
    if (v.p > 25) { dap = Math.round(dap * 0.7); notes.push("Phosphorus cut 30% — your soil tested high."); }
    else if (v.p < 11) { dap = Math.round(dap * 1.25); notes.push("Phosphorus raised 25%. Place DAP below the seed; broadcast phosphorus is mostly wasted."); }
    if (v.k < 110) { mop = Math.round(mop * 1.25); notes.push("Potassium raised 25% — the nutrient farmers skip most often, and it shows as weak stems and poor filling."); }
    if (v.oc < 0.5) notes.push("Organic carbon is low. Two tonnes of farmyard manure per acre beats any extra urea.");
    return { urea, dap, mop, notes };
  }, [soil]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card accent={soil.has ? C.leaf : C.ochre}>
        <Eye c={soil.has ? C.leaf : C.ochre}>{soil.has ? "Adjusted to your soil test" : "District blanket recommendation"}</Eye>
        <div className="d" style={{ fontSize: 21, fontWeight: 700, margin: "8px 0 4px" }}>Cotton · Plot 1 · 2.4 acre</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 14 }}>
          {[["Urea", plan.urea], ["DAP", plan.dap], ["MOP", plan.mop]].map(([n, kg]) => (
            <div key={n} style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 3, padding: 13, textAlign: "center" }}>
              <div className="m" style={{ fontSize: 22, fontWeight: 600 }}>{kg}</div>
              <div style={{ fontSize: 11.5, color: C.dim, marginTop: 3 }}>kg {n}</div>
              <div className="m" style={{ fontSize: 10, color: C.mute, marginTop: 4 }}>{(kg / 50).toFixed(1)} bags</div>
            </div>
          ))}
        </div>
        {plan.notes.map((n, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginTop: 12, fontSize: 13, lineHeight: 1.6, color: C.body }}>
            <Info size={14} color={soil.has ? C.leaf : C.ochre} style={{ flexShrink: 0, marginTop: 3 }} />{n}
          </div>
        ))}
      </Card>

      {m.rain6 > 5 && (
        <Card accent={C.rust} style={{ padding: 15 }}>
          <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
            <CloudRain size={17} color={C.rust} style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 13.5, color: C.body, lineHeight: 1.6 }}>
              <strong style={{ color: C.rust }}>Hold the top-dress. </strong>
              {m.rain6} mm of rain is expected within six hours. Urea applied now mostly washes past the roots — you would be paying for fertiliser that ends up in the drain.
            </div>
          </div>
        </Card>
      )}

      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 17, top: 24, bottom: 24, width: 1, background: C.line }} />
        <div style={{ display: "grid", gap: 10 }}>
          {PLAN.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 14 }}>
              <div style={{ width: 35, display: "flex", justifyContent: "center", paddingTop: 22, flexShrink: 0 }}>
                <div style={{
                  width: 11, height: 11, borderRadius: "50%", zIndex: 1,
                  background: f.done ? C.leaf : f.overdue ? C.rust : C.bg,
                  border: `2px solid ${f.done ? C.leaf : f.overdue ? C.rust : C.line}`,
                }} />
              </div>
              <Card style={{ flex: 1, padding: 15, opacity: f.done ? 0.5 : 1 }} accent={f.overdue ? C.rust : undefined}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div className="d" style={{ fontSize: 16, fontWeight: 700 }}>{f.stage}</div>
                  <span className="m" style={{ fontSize: 10.5, color: f.overdue ? C.rust : f.done ? C.leaf : C.mute }}>{f.date}</span>
                </div>
                <div style={{ fontSize: 12.5, color: C.mute, marginTop: 3 }}>{f.das} days after sowing</div>
                <div style={{ fontSize: 14, marginTop: 10, lineHeight: 1.6, color: C.body }}>{f.what}</div>
                {f.overdue && <div className="m" style={{ fontSize: 10.5, marginTop: 11, color: C.rust, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 600 }}>Overdue by {f.overdue} days</div>}
                {f.inDays && <div className="m" style={{ fontSize: 10.5, marginTop: 11, color: C.sky, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 600 }}>In {f.inDays} days</div>}
                {f.done
                  ? <div style={{ fontSize: 12.5, marginTop: 11, color: C.leaf, display: "flex", alignItems: "center", gap: 6 }}><CheckCircle2 size={13} /> Applied</div>
                  : <Btn kind={f.overdue ? "danger" : "ghost"} full style={{ marginTop: 13, padding: 10 }}>Mark applied</Btn>}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const openLink = (url) => window.open(url, "_blank", "noopener,noreferrer");

function SchemesTab({ user }) {
  const [open, setOpen] = useState(-1);
  const list = SCHEMES.filter((s) => s.states === "all" || s.states === user.state.id);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card accent={C.leaf} style={{ padding: 15 }}>
        <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
          <ShieldCheck size={17} color={C.leaf} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 13, color: C.body, lineHeight: 1.6 }}>
            {list.length} schemes you can apply for in {user.state.name}, all currently running.
            Only ever enter Aadhaar details on the official <span className="m">.gov.in</span> site —
            lookalike scheme portals are common and they harvest Aadhaar numbers.
          </div>
        </div>
      </Card>

      {list.map((s, i) => (
        <Card key={s.name} accent={s.states === "all" ? C.sky : C.leaf} onClick={() => setOpen(open === i ? -1 : i)}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <Eye c={s.states === "all" ? C.sky : C.leaf}>
                {s.tag}{s.states !== "all" && " · state scheme"}
              </Eye>
              <div className="d" style={{ fontSize: 18, fontWeight: 700, marginTop: 7, lineHeight: 1.3 }}>{s.name}</div>
              <div style={{ fontSize: 12.5, color: C.mute, marginTop: 2 }}>{s.full}</div>
              <div style={{ fontSize: 13.5, color: C.dim, marginTop: 7, lineHeight: 1.55 }}>{s.who}</div>
            </div>
            <div className="d" style={{ fontSize: 17, fontWeight: 700, color: C.leaf, whiteSpace: "nowrap" }}>{s.amount}</div>
          </div>

          {s.caution && (
            <div style={{ display: "flex", gap: 10, marginTop: 12, fontSize: 13, lineHeight: 1.6, color: C.body }}>
              <AlertTriangle size={14} color={C.ochre} style={{ flexShrink: 0, marginTop: 3 }} />{s.caution}
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <Btn style={{ flex: "1 1 150px", padding: "10px 14px", fontSize: 13 }}
              onClick={(e) => { e.stopPropagation(); openLink(s.url); }}>
              <ExternalLink size={15} /> Official portal
            </Btn>
            <Btn kind="ghost" style={{ flex: "1 1 130px", padding: "10px 14px", fontSize: 13 }}
              onClick={(e) => { e.stopPropagation(); openLink(s.google); }}>
              <Search size={15} /> Explain this
            </Btn>
            {s.phone && (
              <Btn kind="ghost" style={{ padding: "10px 14px", fontSize: 13 }}
                onClick={(e) => { e.stopPropagation(); openLink(`tel:${s.phone}`); }}>
                <Phone size={15} /> {s.phone}
              </Btn>
            )}
          </div>

          {open === i && (
            <div className="fade" style={{ marginTop: 14, paddingTop: 13, borderTop: `1px solid ${C.line}` }}>
              {s.recent && <div style={{ fontSize: 13, color: C.body, lineHeight: 1.6, marginBottom: 12 }}>{s.recent}</div>}
              {s.docs.length > 0 && <>
                <Eye>Papers to carry</Eye>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
                  {s.docs.map((d) => (
                    <span key={d} style={{ fontSize: 12.5, padding: "5px 11px", borderRadius: 20, background: C.bg, border: `1px solid ${C.line}`, color: C.dim }}>{d}</span>
                  ))}
                </div>
              </>}
            </div>
          )}
        </Card>
      ))}

      <Note>
        "Explain this" runs a Google search scoped to the scheme's own official domain, so you land on
        the real guidance rather than an imitation portal. Terms change with every budget — confirm at
        the portal or your block office before applying, and never pay an agent for a free application.
      </Note>
    </div>
  );
}

function MandiTab() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <Eye c={C.sky}>Live rates</Eye>
            <div className="d" style={{ fontSize: 20, fontWeight: 700, marginTop: 7 }}>Today's mandi prices</div>
          </div>
          <span className="m" style={{ fontSize: 10, color: C.mute, alignSelf: "flex-end" }}>Updated 06:40 · AGMARKNET</span>
        </div>
      </Card>
      {MANDI.map((x, i) => {
        const d = x.price - x.prev;
        const I = d > 0 ? TrendingUp : d < 0 ? TrendingDown : Minus;
        const c = d > 0 ? C.leaf : d < 0 ? C.rust : C.mute;
        return (
          <Card key={i} style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 155 }}>
                <div className="d" style={{ fontSize: 16.5, fontWeight: 700 }}>{x.crop}</div>
                <div style={{ fontSize: 12.5, color: C.dim, marginTop: 3, display: "flex", alignItems: "center", gap: 5 }}>
                  <MapPin size={11} /> {x.market} APMC
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="m" style={{ fontSize: 22, fontWeight: 600 }}>{inr(x.price)}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 5, marginTop: 4, color: c, fontSize: 12.5 }}>
                  <Ico as={I} size={13} /> {d === 0 ? "No change" : `${d > 0 ? "+" : ""}${((d / x.prev) * 100).toFixed(1)}%`}
                  <span style={{ color: C.mute, fontSize: 11 }}>/quintal</span>
                </div>
              </div>
            </div>
            {x.msp && (
              <div style={{ marginTop: 12, paddingTop: 11, borderTop: `1px solid ${C.line}`, fontSize: 12.5, display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", color: C.mute }}>
                <span>MSP {inr(x.msp)}</span>
                <span style={{ color: x.price >= x.msp ? C.leaf : C.rust, fontWeight: 600, textAlign: "right" }}>
                  {x.price >= x.msp ? `${inr(x.price - x.msp)} above MSP`
                    : `${inr(x.msp - x.price)} below MSP — check for a procurement centre before selling`}
                </span>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

/* ──────────────────  drone intelligence dashboard  ────────────────── */

/* Tier profiles are the same numbers the backend router uses. A raw 4K frame is
   ~4 MB; an edge result row is ~900 bytes. That ratio is the entire argument for
   this architecture, so it is stated here rather than hidden in a summary. */
const TIERS = {
  drone: { label: "Drone", icon: Plane, c: C.violet, ms: 90, bytes: 0, model: "MobileNetV3-Small int8" },
  edge: { label: "Edge GPU", icon: Cpu, c: C.leaf, ms: 35, bytes: 900, model: "EfficientNet-B0 TensorRT" },
  cloud: { label: "Cloud", icon: Cloud, c: C.sky, ms: 1400, bytes: 380000, model: "B3 ensemble + agronomist" },
};
const RAW_FRAME = 4_000_000;
const CLOUD_RTT = 1400;

function flightSavings(captured, t) {
  const naive = captured * RAW_FRAME;
  const sent = t.edge * TIERS.edge.bytes + t.cloud * TIERS.cloud.bytes;
  const naiveMs = captured * CLOUD_RTT;
  const actualMs = t.drone * TIERS.drone.ms + t.edge * TIERS.edge.ms + t.cloud * CLOUD_RTT;
  return {
    sent, naive,
    bandwidthPct: naive ? +(100 * (1 - sent / naive)).toFixed(2) : 0,
    latencySavedS: Math.max(0, Math.round((naiveMs - actualMs) / 1000)),
    costInr: +(sent / 1e9 * 9).toFixed(2),
    costNaiveInr: +(naive / 1e9 * 9).toFixed(2),
  };
}

const DRONE_FINDINGS = [
  ["Pink bollworm", "Cotton", 7, 0.91, "edge", "Block C, north edge"],
  ["Jassid", "Cotton", 3, 0.78, "edge", "Block A, near the bund"],
  ["Nutrient deficiency", "Cotton", 2, 0.52, "cloud", "Block B, waterlogged patch"],
];

function DroneTab({ user }) {
  const [flying, setFlying] = useState(false);
  const [t, setT] = useState({ captured: 0, drone: 0, edge: 0, cloud: 0, defer: 0 });
  const [gpu, setGpu] = useState({ util: 0.12, temp: 46, queue: 0 });
  const [battery, setBattery] = useState(96);
  const [link, setLink] = useState({ mbps: 6.4, rtt: 140 });

  const TOTAL = 1200;                       // a 20-minute sortie at 1 fps
  const done = t.captured >= TOTAL;

  useEffect(() => {
    if (!flying || done) return;
    const id = setInterval(() => {
      setT((p) => {
        const n = Math.min(TOTAL, p.captured + 24);
        const added = n - p.captured;
        // ~83% of frames die in preprocessing — duplicates and blur, exactly
        // what the simulated flight produced on the edge agent.
        const dropped = Math.round(added * 0.83);
        const rest = added - dropped;
        const toCloud = Math.random() < 0.25 ? 1 : 0;
        return { captured: n, drone: p.drone + dropped, edge: p.edge + rest - toCloud,
                 cloud: p.cloud + toCloud, defer: p.defer };
      });
      setGpu((g) => ({
        util: Math.min(0.97, Math.max(0.1, g.util + (Math.random() - 0.45) * 0.14)),
        temp: Math.min(84, g.temp + Math.random() * 0.7),
        queue: Math.max(0, Math.round(g.queue + (Math.random() - 0.5) * 6)),
      }));
      setBattery((b) => Math.max(12, b - 1.4));
      setLink({ mbps: +(3 + Math.random() * 6).toFixed(1), rtt: Math.round(90 + Math.random() * 300) });
    }, 700);
    return () => clearInterval(id);
  }, [flying, done]);

  const s = useMemo(() => flightSavings(t.captured || 1, t), [t]);
  const processed = t.edge + t.cloud + t.drone || 1;
  const hot = gpu.temp >= 78;
  const busy = gpu.util > 0.85;

  const reset = () => {
    setT({ captured: 0, drone: 0, edge: 0, cloud: 0, defer: 0 });
    setGpu({ util: 0.12, temp: 46, queue: 0 }); setBattery(96); setFlying(false);
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {/* flight control */}
      <Card accent={flying ? C.leaf : C.line}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Eye c={flying ? C.leaf : C.mute}>{flying ? "In flight" : done ? "Flight complete" : "Ready"}</Eye>
            <div className="d" style={{ fontSize: 21, fontWeight: 700, marginTop: 7 }}>
              {user.district || "Akola"} · Plot 1 survey
            </div>
            <div style={{ fontSize: 13, color: C.dim, marginTop: 5, lineHeight: 1.55 }}>
              Lawnmower pattern, 1 fps, 80% forward overlap. Every frame is decided on
              the ground — footage never leaves the farm.
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="m" style={{ fontSize: 26, fontWeight: 600, color: C.leaf }}>
              {Math.round((t.captured / TOTAL) * 100)}%
            </div>
            <Eye>scanned</Eye>
          </div>
        </div>

        <div style={{ height: 5, background: C.line, borderRadius: 3, marginTop: 14, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(t.captured / TOTAL) * 100}%`, background: C.leaf, transition: "width .5s linear" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(96px,1fr))", gap: 10, marginTop: 14 }}>
          {[["Frames", t.captured], ["Battery", `${Math.round(battery)}%`],
            ["Uplink", `${link.mbps} Mbps`], ["RTT", `${link.rtt} ms`]].map(([k, v]) => (
            <div key={k} style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 3, padding: 11, textAlign: "center" }}>
              <div className="m" style={{ fontSize: 16, fontWeight: 600, color: k === "Battery" && battery < 25 ? C.rust : C.ink }}>{v}</div>
              <div style={{ fontSize: 10.5, color: C.mute, marginTop: 3 }}>{k}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 9, marginTop: 14, flexWrap: "wrap" }}>
          <Btn full={!done} style={{ flex: 1 }} onClick={() => setFlying((f) => !f)} disabled={done}>
            {flying ? <><Loader2 size={16} className="spin" /> Scanning…</> : <><Plane size={16} /> {t.captured ? "Resume" : "Start survey"}</>}
          </Btn>
          {(t.captured > 0) && <Btn kind="ghost" onClick={reset}><RefreshCw size={15} /> Reset</Btn>}
        </div>
      </Card>

      {/* edge node health */}
      <Card accent={hot ? C.rust : busy ? C.ochre : C.leaf}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <Eye c={hot ? C.rust : busy ? C.ochre : C.leaf}>
              Edge node · {hot ? "throttling" : busy ? "busy" : "healthy"}
            </Eye>
            <div className="d" style={{ fontSize: 18, fontWeight: 700, marginTop: 7 }}>farm-akola-01</div>
            <div className="m" style={{ fontSize: 11.5, color: C.mute, marginTop: 3 }}>
              Jetson Orin Nano · {TIERS.edge.model}
            </div>
          </div>
          <Pill level={hot ? "high" : busy ? "medium" : "low"}>{hot ? "throttling" : busy ? "busy" : "healthy"}</Pill>
        </div>

        <div style={{ display: "grid", gap: 12, marginTop: 15 }}>
          {[["GPU load", gpu.util * 100, "%", gpu.util > 0.85 ? C.rust : C.leaf, 100],
            ["Temperature", gpu.temp, " °C", hot ? C.rust : gpu.temp > 65 ? C.ochre : C.leaf, 90],
            ["Queue depth", gpu.queue, " frames", gpu.queue > 20 ? C.ochre : C.leaf, 40]].map(([k, v, unit, col, max]) => (
            <div key={k}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
                <span style={{ color: C.dim }}>{k}</span>
                <span className="m" style={{ color: col, fontWeight: 600 }}>{Math.round(v)}{unit}</span>
              </div>
              <div style={{ height: 4, background: C.line, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(100, (v / max) * 100)}%`, background: col, transition: "width .5s" }} />
              </div>
            </div>
          ))}
        </div>

        {hot && (
          <div style={{ display: "flex", gap: 10, marginTop: 14, fontSize: 13, lineHeight: 1.6, color: C.body }}>
            <AlertTriangle size={15} color={C.rust} style={{ flexShrink: 0, marginTop: 3 }} />
            GPU is past 78 °C and throttling. Complex frames are being shed to the cloud
            until it cools. A box in direct sun loses about a third of its throughput —
            shade the enclosure.
          </div>
        )}
      </Card>

      {/* where the work happened */}
      <Card>
        <Eye>Where each frame was processed</Eye>
        <div style={{ display: "flex", height: 26, borderRadius: 3, overflow: "hidden", marginTop: 12, background: C.bg }}>
          {["drone", "edge", "cloud"].map((k) => {
            const pct = (t[k] / processed) * 100;
            return pct > 0 ? (
              <div key={k} title={`${TIERS[k].label} ${pct.toFixed(1)}%`}
                style={{ width: `${pct}%`, background: TIERS[k].c, transition: "width .5s" }} />
            ) : null;
          })}
        </div>
        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          {["drone", "edge", "cloud"].map((k) => {
            const T = TIERS[k];
            return (
              <div key={k} style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "9px 0", borderTop: `1px solid ${C.line}66` }}>
                <Ico as={T.icon} size={17} color={T.c} style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{T.label}</span>
                    <span className="m" style={{ fontSize: 13, color: T.c }}>
                      {t[k].toLocaleString("en-IN")} · {((t[k] / processed) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: C.mute, marginTop: 3, lineHeight: 1.5 }}>
                    {T.model} · {T.ms} ms · {T.bytes ? `${(T.bytes / 1024).toFixed(1)} KB uploaded` : "nothing uploaded"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 12.5, color: C.mute, marginTop: 12, lineHeight: 1.6 }}>
          The drone tier is mostly rejections, not inference — duplicates and blur thrown
          out before any model runs. That is where the saving comes from, and it is why
          keeping 17% of frames still covers every square metre of canopy.
        </div>
      </Card>

      {/* savings */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
        {[[Zap, "Latency avoided", `${s.latencySavedS}s`, "vs a cloud round trip per frame", C.ochre],
          [Activity, "Bandwidth saved", `${s.bandwidthPct}%`, `${(s.sent / 1e6).toFixed(1)} MB sent, not ${(s.naive / 1e9).toFixed(2)} GB`, C.leaf],
          [IndianRupee, "Cloud cost", `₹${s.costInr}`, `instead of ₹${s.costNaiveInr}`, C.sky],
          [Server, "Left the farm", `${((t.cloud / processed) * 100).toFixed(1)}%`, "of frames, as results only", C.violet]].map(([I, k, v, sub, col]) => (
          <Card key={k} style={{ padding: 15 }}>
            <Ico as={I} size={17} color={col} />
            <div className="d" style={{ fontSize: 22, fontWeight: 800, marginTop: 10, color: col }}>{v}</div>
            <div style={{ fontSize: 12.5, color: C.dim, marginTop: 3 }}>{k}</div>
            <div style={{ fontSize: 11.5, color: C.mute, marginTop: 5, lineHeight: 1.5 }}>{sub}</div>
          </Card>
        ))}
      </div>

      {/* findings */}
      <Card accent={C.rust}>
        <Eye c={C.rust}>Detected this flight</Eye>
        {t.captured === 0 ? (
          <div style={{ fontSize: 13.5, color: C.dim, marginTop: 10, lineHeight: 1.6 }}>
            Start the survey to see findings appear as the drone covers each block.
          </div>
        ) : DRONE_FINDINGS.map(([name, crop, n, conf, tier, where], i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderTop: `1px solid ${C.line}66`, alignItems: "flex-start" }}>
            <Bug size={16} color={conf >= 0.75 ? C.rust : C.ochre} style={{ flexShrink: 0, marginTop: 3 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 14.5, fontWeight: 600 }}>{name}</span>
                <span className="m" style={{ fontSize: 13, color: conf >= 0.75 ? C.leaf : C.ochre }}>
                  {Math.round(conf * 100)}%
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: C.dim, marginTop: 3 }}>
                {crop} · {n} spot{n === 1 ? "" : "s"} · {where}
              </div>
              <div style={{ display: "flex", gap: 7, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
                <Pill level={tier === "cloud" ? "medium" : "low"}>{TIERS[tier].label}</Pill>
                {conf < 0.75 && <span style={{ fontSize: 11.5, color: C.ochre }}>
                  below the edge floor — escalated for review
                </span>}
              </div>
            </div>
          </div>
        ))}
      </Card>

      <Note icon={ShieldCheck} c={C.dim}>
        The cloud only ever does four things here: train and push model updates, take the
        low-confidence frames an agronomist must see, run cross-farm outbreak prediction,
        and hold the backup. It never receives continuous footage — that would cost more
        than the whole system saves.
      </Note>
    </div>
  );
}

/* ─────────────────────  offline assistant  ───────────────────── */

const KB = [
  [["spray", "फवारणी", "छिड़काव"], "Spray when wind is under 10 km/h, temperature under 33 °C, and no rain is expected for six hours afterwards. Before 10 a.m. or after 4 p.m. is usually best, and it keeps the spray off pollinators. The Weather tab shows safe hours in green."],
  [["urea", "top dress", "fertiliser", "fertilizer", "खत", "खाद"], "Never broadcast urea on dry soil or right before heavy rain — up to 40% is lost either way. Side-place it beside the row and cover it. If rain is coming within six hours, wait. Your second top-dress is currently 10 days overdue."],
  [["soil test", "soil health", "shc", "मिट्टी", "माती"], "Free under the Soil Health Card scheme. Take 10 to 15 spots across the plot in a zigzag, 15 cm deep, mix them, hand in about 500 g at your block office or KVK. Results take two to three weeks. Do not sample right after fertiliser or heavy rain."],
  [["bollworm", "pbw", "बोंडअळी"], "Check for rosette flowers and pinhead holes on green bolls. The threshold is 8 moths per trap per night for three nights running, or 10% rosette flowers. Below that, do not spray — you would only kill the natural enemies. Above it, rotate IRAC groups every spray."],
  [["armyworm", "faw"], "Look for ragged whorl feeding and moist sawdust-like frass. Dry sand mixed with lime, 9 parts to 1, poured into the whorl at 8 a.m. works well and costs almost nothing. If you spray, aim into the whorl — anything on the leaf surface is wasted."],
  [["blight", "leaf spot", "fungus", "rust"], "Fungal disease needs leaf wetness. Remove and bury affected lower leaves, mulch to stop rain splashing spores up from the soil, and widen spacing so foliage dries before nightfall. A contact fungicide before the wet spell beats a curative spray after."],
  [["msp", "price", "mandi", "sell", "भाव"], "Compare the mandi rate against MSP before selling. If the rate is below MSP, check whether a government procurement centre is open in your district — that is what MSP is for. Cotton is ₹7,420 against an MSP of ₹7,710 right now."],
  [["insurance", "pmfby", "bima", "बीमा"], "PMFBY costs 2% of the sum insured for kharif. Enrol before 31 July for kharif and 31 December for rabi — after that the window is shut for the season. Report any loss within 72 hours or the claim fails on a technicality."],
  [["offline", "no network", "signal"], "Download the 5.3 MB model once over Wi-Fi and scanning works with no signal at all. Anything you record offline sits in a queue on the phone and uploads by itself the moment you have a bar."],
  [["which crop", "what to sow", "next crop", "rotation"], "Rotate — never the same crop twice in the same field. After a cereal like rice, wheat or maize, a legume such as soybean, gram or moong restores nitrogen and breaks the pest cycle. The Crops tab ranks by what you can actually manage, not just what the soil likes."],
];

function Assistant({ user, onClose }) {
  const [msgs, setMsgs] = useState([{ me: false, t: `Namaste ${user.name.split(" ")[0]}. Ask me about your crop, the weather, spraying, soil, or a scheme. I work offline too — everything I know here is stored on your phone.` }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  /* Answers come from the cheapest tier that can handle the question:
     the shipped Q&A base (instant, works in aeroplane mode), the small model on
     the farm's own edge GPU, or the cloud for genuinely hard reasoning. The
     request below reaches the tiered /api/v1/chat endpoint when a server is
     configured; with none, it falls to the local base rather than erroring. */
  const localAnswer = (q) => {
    const low = q.toLowerCase();
    const hit = KB.find(([keys]) => keys.some((k) => low.includes(k)));
    return hit?.[1] ?? "I do not have a stored answer for that. Try spraying, fertiliser, soil testing, bollworm, blight, mandi prices, insurance, or which crop to sow next. Beyond that, your KVK is a phone call away and knows your block far better than I do.";
  };

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setMsgs((m) => [...m, { me: true, t: q }]);
    setInput("");
    setBusy(true);

    // The model must never name a disease from a description — it has not seen
    // the plant. Enforced here as well as on the server.
    if (/what (disease|pest|is wrong)|which disease|identify|diagnos/i.test(q)) {
      setMsgs((m) => [...m, { me: false, tier: "offline", t:
        "I cannot name a disease from a description — I have to see the plant. Open Scan and photograph one affected leaf, filling the frame, in daylight without flash." }]);
      setBusy(false);
      return;
    }

    let reply = null, tier = "offline";
    if (navigator.onLine) {
      try {
        const ctl = new AbortController();
        const t = setTimeout(() => ctl.abort(), 6000);
        const r = await fetch("/api/v1/chat", {
          method: "POST", signal: ctl.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: q, lang: user.lang, client_uuid: String(Date.now()) }),
        });
        clearTimeout(t);
        const j = await r.json();
        if (j?.ok && j.data?.reply) { reply = j.data.reply; tier = j.data.tier || "cloud"; }
      } catch { /* no server, slow link, or offline — fall through */ }
    }

    setMsgs((m) => [...m, { me: false, tier, t: reply ?? localAnswer(q) }]);
    setBusy(false);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#000B", zIndex: 70, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} className="up" style={{ background: C.card, borderTop: `1px solid ${C.line}`, borderRadius: "10px 10px 0 0", width: "100%", maxWidth: 560, height: "78vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 20px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="d" style={{ fontSize: 18, fontWeight: 700 }}>Ask CropGuard</div>
            <div style={{ fontSize: 12, color: C.mute, marginTop: 2 }}>Works with no signal</div>
          </div>
          <button className="b" onClick={onClose} aria-label="Close" style={{ background: "transparent", border: "none", color: C.dim, cursor: "pointer", padding: 4 }}><X size={20} /></button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "grid", gap: 12, alignContent: "start" }}>
          {msgs.map((x, i) => (
            <div key={i} className="fade" style={{ display: "flex", justifyContent: x.me ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "86%", padding: "12px 15px", fontSize: 14, lineHeight: 1.65,
                borderRadius: x.me ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
                background: x.me ? `${C.leaf}20` : C.bg,
                border: `1px solid ${x.me ? `${C.leaf}55` : C.line}`,
                color: x.me ? C.ink : C.body,
              }}>
                {x.t}
                {!x.me && i > 0 && (
                  <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <Say text={x.t} lang={user.lang} />
                    {x.tier && <span className="m" style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: C.mute }}>
                      {x.tier === "offline" ? "answered on this phone" : x.tier === "edge" ? "answered on the edge GPU" : "answered in the cloud"}
                    </span>}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={end} />
        </div>

        <div style={{ padding: "12px 20px 20px", borderTop: `1px solid ${C.line}` }}>
          <div className="nb" style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 11 }}>
            {["When is it safe to spray?", "How do I get a soil test?", "Which crop should I sow next?", "Bollworm threshold?"].map((s) => (
              <button key={s} className="b" onClick={() => send(s)}
                style={{ whiteSpace: "nowrap", padding: "7px 13px", fontSize: 12.5, borderRadius: 20, background: "transparent", color: C.dim, border: `1px solid ${C.line}`, cursor: "pointer" }}>{s}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type your question" aria-label="Ask a question"
              style={{ flex: 1, padding: "13px 14px", background: C.bg, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 3, fontSize: 16, outline: "none" }} />
            <Btn onClick={() => send()} disabled={!input.trim()} style={{ padding: "12px 16px" }} aria-label="Send"><Send size={17} /></Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────  shell  ───────────────────────────── */

export default function CropGuardAI() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("home");
  const [sheet, setSheet] = useState(null);
  const [offline, setOffline] = useState(false);
  const [ready, setReady] = useState(false);
  const [dl, setDl] = useState(0);
  const [queue, setQueue] = useState(0);
  const [soil, setSoil] = useState({ has: false, at: null, values: { n: 245, p: 14, k: 168, ph: 6.8, oc: 0.42, ec: 0.4 } });

  const geo = useGeo();
  const hours = useMemo(() => buildWeather(11), []);
  const m = useMemo(() => metricsOf(hours), [hours]);
  const risk = useMemo(() => {
    const score = Math.min(97, Math.round(m.rhHi * 1.1 + m.rain72 * 0.5 + 22));
    return {
      score,
      driver: `${m.rhHi} hours above 85% humidity and ${m.rain72} mm of rain forecast, plus three confirmed cases within 8 km.`,
      action: score > 70
        ? "Scout 20 plants across the field this evening, and put a preventive contact fungicide on before the wet spell — not after it."
        : "Walk the field borders and check the traps. Nothing needs spraying today.",
    };
  }, [m]);

  // queue grows while offline, drains on reconnect
  useEffect(() => {
    if (offline) { const t = setInterval(() => setQueue((q) => Math.min(q + 1, 9)), 6000); return () => clearInterval(t); }
    if (queue > 0) { const t = setTimeout(() => setQueue(0), 1400); return () => clearTimeout(t); }
  }, [offline, queue]);

  const download = useCallback(() => {
    setDl(1);
    const t = setInterval(() => setDl((d) => {
      if (d >= 100) { clearInterval(t); setReady(true); return 0; }
      return d + 7;
    }), 90);
  }, []);

  if (!user) return <Onboard onDone={setUser} />;
  const l = user.lang;

  const MAIN = [["home", Leaf, tr(l, "home")], ["scan", Camera, tr(l, "scan")], ["weather", CloudRain, tr(l, "weather")], ["alerts", ShieldAlert, tr(l, "alerts")]];
  const REST = [["drone", Plane, "Drone"], ["soil", FlaskConical, tr(l, "soil")], ["crops", Wheat, tr(l, "crops")], ["fert", Sprout, tr(l, "fert")], ["schemes", Landmark, tr(l, "schemes")], ["mandi", IndianRupee, tr(l, "mandi")]];
  const ALL = [...MAIN, ...REST];
  const title = ALL.find(([id]) => id === tab)?.[2] ?? "";
  const go = (id) => { setTab(id); setSheet(null); };

  return (
    <div className="cg" style={{ minHeight: "100vh", background: C.bg, color: C.ink }}>
      <Font />

      <div style={{
        background: offline ? `${C.rust}22` : `${C.leaf}18`,
        borderBottom: `1px solid ${offline ? `${C.rust}55` : `${C.leaf}44`}`,
        padding: "9px 16px", display: "flex", alignItems: "center", justifyContent: "center",
        gap: 10, fontSize: 12.5, flexWrap: "wrap", position: "sticky", top: 0, zIndex: 40,
      }}>
        {offline ? <WifiOff size={14} color={C.rust} /> : <Wifi size={14} color={C.leaf} />}
        <span style={{ color: offline ? C.rust : C.leaf, fontWeight: 600 }}>
          {offline ? (ready ? "Offline — scanning still works on this phone" : "Offline — download the model to keep scanning") : "Online"}
        </span>
        {queue > 0 && <span className="m" style={{ color: C.dim, fontSize: 11 }}>· {queue} queued</span>}
        <button className="b" onClick={() => setOffline((o) => !o)}
          style={{ background: "transparent", border: `1px solid ${offline ? `${C.rust}66` : `${C.leaf}55`}`, color: offline ? C.rust : C.leaf, borderRadius: 20, padding: "3px 11px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
          {offline ? "Reconnect" : "Simulate no signal"}
        </button>
      </div>

      {dl > 0 && (
        <div style={{ position: "sticky", top: 38, height: 3, background: C.line, zIndex: 50 }}>
          <div style={{ height: "100%", width: `${dl}%`, background: C.leaf, transition: "width .09s linear" }} />
        </div>
      )}

      <div className="shell">
        <aside className="side" style={{ flexDirection: "column", borderRight: `1px solid ${C.line}`, padding: 20, position: "sticky", top: 0, height: "100vh", background: C.card, overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, paddingBottom: 20, borderBottom: `1px solid ${C.line}` }}>
            <Leaf size={21} color={C.leaf} strokeWidth={2.4} />
            <span className="d" style={{ fontSize: 17, fontWeight: 800 }}>CropGuard AI</span>
          </div>
          <nav style={{ display: "grid", gap: 3, marginTop: 16, flex: 1, alignContent: "start" }}>
            {ALL.map(([id, I, label]) => (
              <button key={id} className="b" onClick={() => go(id)}
                style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 3, border: "none", cursor: "pointer", textAlign: "left", width: "100%", fontSize: 14.5, fontWeight: 600, background: tab === id ? `${C.leaf}18` : "transparent", color: tab === id ? C.leaf : C.dim }}>
                <Ico as={I} size={17} strokeWidth={2.2} />{label}
                {id === "alerts" && <span className="m" style={{ marginLeft: "auto", fontSize: 10, background: C.rust, color: "#fff", borderRadius: 9, padding: "2px 6px" }}>5</span>}
              </button>
            ))}
            <button className="b" onClick={() => setSheet("ask")}
              style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", marginTop: 8, borderRadius: 3, border: `1px solid ${C.line}`, cursor: "pointer", textAlign: "left", width: "100%", fontSize: 14.5, fontWeight: 600, background: "transparent", color: C.ink }}>
              <MessageCircle size={17} strokeWidth={2.2} /> Ask CropGuard
            </button>
          </nav>
          <div style={{ paddingTop: 16, borderTop: `1px solid ${C.line}` }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: C.mute, marginTop: 2 }}>
              {user.district ? `${user.district}, ` : ""}{user.state.name} · {tr(l, user.role)}
            </div>
            <button className="b" onClick={() => setUser(null)}
              style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 7, background: "transparent", border: "none", color: C.mute, fontSize: 12.5, cursor: "pointer", padding: 0 }}>
              <LogOut size={13} /> {tr(l, "out")}
            </button>
          </div>
        </aside>

        <main className="main" style={{ paddingBottom: 96 }}>
          <header style={{ padding: "16px 20px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <Eye c={C.leaf}>{user.state.id} · {user.district || user.state.zone}{geo.status === "ready" ? " · GPS" : ""}</Eye>
              <h1 className="d" style={{ fontSize: 23, fontWeight: 800, margin: "5px 0 0", letterSpacing: "-.02em" }}>{title}</h1>
            </div>
            <button className="b" onClick={() => setSheet("lang")}
              style={{ display: "flex", alignItems: "center", gap: 7, background: C.card, border: `1px solid ${C.line}`, color: C.ink, padding: "9px 13px", borderRadius: 3, cursor: "pointer", fontSize: 13.5, fontWeight: 600 }}>
              <Globe size={15} color={C.leaf} /> {LANGS[l]}
            </button>
          </header>

          <div key={tab} className="fade" style={{ padding: 20, maxWidth: 920, margin: "0 auto" }}>
            {tab === "home" && <HomeTab user={user} go={go} m={m} risk={risk} soil={soil} geo={geo} />}
            {tab === "scan" && <ScanTab user={user} offline={offline} ready={ready} onDownload={download} queue={queue} />}
            {tab === "weather" && <WeatherTab hours={hours} m={m} user={user} geo={geo} />}
            {tab === "drone" && <DroneTab user={user} />}
            {tab === "soil" && <SoilTab soil={soil} setSoil={setSoil} go={go} />}
            {tab === "crops" && <CropsTab soil={soil} go={go} />}
            {tab === "alerts" && <AlertsTab user={user} m={m} />}
            {tab === "fert" && <FertTab soil={soil} m={m} />}
            {tab === "schemes" && <SchemesTab user={user} />}
            {tab === "mandi" && <MandiTab />}
          </div>
        </main>
      </div>

      <nav className="bot" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: `${C.card}FA`, backdropFilter: "blur(10px)", borderTop: `1px solid ${C.line}`, padding: "8px 4px 12px", zIndex: 30, justifyContent: "space-around" }}>
        {MAIN.map(([id, I, label]) => (
          <button key={id} className="b" onClick={() => go(id)} aria-label={label}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "transparent", border: "none", cursor: "pointer", padding: "5px 7px", position: "relative", flex: 1, color: tab === id ? C.leaf : C.mute }}>
            <Ico as={I} size={19} strokeWidth={tab === id ? 2.5 : 2} />
            <span style={{ fontSize: 10, fontWeight: 600 }}>{label}</span>
            {id === "alerts" && <span style={{ position: "absolute", top: 2, left: "58%", width: 6, height: 6, borderRadius: "50%", background: C.rust }} />}
          </button>
        ))}
        <button className="b" onClick={() => setSheet("more")} aria-label={tr(l, "more")}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "transparent", border: "none", cursor: "pointer", padding: "5px 7px", flex: 1, color: REST.some(([id]) => id === tab) ? C.leaf : C.mute }}>
          <MoreHorizontal size={19} />
          <span style={{ fontSize: 10, fontWeight: 600 }}>{tr(l, "more")}</span>
        </button>
      </nav>

      <button className="b bot" onClick={() => setSheet("ask")} aria-label="Ask CropGuard"
        style={{ position: "fixed", right: 18, bottom: 90, width: 52, height: 52, borderRadius: "50%", background: C.leaf, color: C.bg, border: "none", cursor: "pointer", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px #0007", zIndex: 31 }}>
        <MessageCircle size={22} strokeWidth={2.3} />
      </button>

      {sheet === "more" && (
        <div onClick={() => setSheet(null)} style={{ position: "fixed", inset: 0, background: "#000A", zIndex: 60, display: "flex", alignItems: "flex-end" }}>
          <div onClick={(e) => e.stopPropagation()} className="up" style={{ background: C.card, borderTop: `1px solid ${C.line}`, borderRadius: "10px 10px 0 0", padding: 22, width: "100%" }}>
            <div className="d" style={{ fontSize: 19, fontWeight: 700, marginBottom: 16 }}>{tr(l, "more")}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
              {REST.map(([id, I, label]) => (
                <button key={id} className="b" onClick={() => go(id)}
                  style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 9, padding: 15, borderRadius: 4, cursor: "pointer", background: tab === id ? `${C.leaf}18` : C.bg, border: `1px solid ${tab === id ? C.leaf : C.line}`, color: C.ink }}>
                  <Ico as={I} size={19} color={tab === id ? C.leaf : C.dim} strokeWidth={2.2} />
                  <span className="d" style={{ fontSize: 15, fontWeight: 700 }}>{label}</span>
                </button>
              ))}
            </div>
            <Btn kind="ghost" full style={{ marginTop: 16 }} onClick={() => setUser(null)}><LogOut size={15} /> {tr(l, "out")}</Btn>
          </div>
        </div>
      )}

      {sheet === "lang" && (
        <div onClick={() => setSheet(null)} style={{ position: "fixed", inset: 0, background: "#000A", zIndex: 60, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={(e) => e.stopPropagation()} className="up" style={{ background: C.card, borderTop: `1px solid ${C.line}`, borderRadius: "10px 10px 0 0", padding: 24, width: "100%", maxWidth: 520, maxHeight: "76vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div className="d" style={{ fontSize: 20, fontWeight: 700 }}>{tr(l, "selectLang")}</div>
              <button className="b" onClick={() => setSheet(null)} aria-label="Close" style={{ background: "transparent", border: "none", color: C.dim, cursor: "pointer", padding: 4 }}><X size={20} /></button>
            </div>
            <Eye c={C.leaf}>Spoken in {user.state.name}</Eye>
            <div style={{ display: "grid", gap: 6, margin: "10px 0 20px" }}>
              {user.state.langs.map((code, i) => (
                <button key={code} className="b" onClick={() => { setUser((u) => ({ ...u, lang: code })); setSheet(null); }}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 15px", cursor: "pointer", borderRadius: 3, color: C.ink, background: l === code ? `${C.leaf}1A` : C.bg, border: `1px solid ${l === code ? C.leaf : C.line}` }}>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>{LANGS[code]}</span>
                  <span className="m" style={{ fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: i === 0 ? C.leaf : C.mute }}>
                    {i === 0 ? "Mother tongue" : code === "en" ? "Common" : "Also spoken"}
                  </span>
                </button>
              ))}
            </div>
            <Eye>All Indian languages</Eye>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {Object.keys(LANGS).filter((c) => !user.state.langs.includes(c)).map((code) => (
                <button key={code} className="b" onClick={() => { setUser((u) => ({ ...u, lang: code })); setSheet(null); }}
                  style={{ padding: "7px 13px", fontSize: 13.5, borderRadius: 20, cursor: "pointer", background: l === code ? `${C.leaf}1A` : "transparent", color: l === code ? C.leaf : C.dim, border: `1px solid ${l === code ? C.leaf : C.line}` }}>{LANGS[code]}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {sheet === "ask" && <Assistant user={user} onClose={() => setSheet(null)} />}
    </div>
  );
}
