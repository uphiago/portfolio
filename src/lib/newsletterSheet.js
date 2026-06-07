import crypto from "node:crypto";

export const DEFAULT_NEWSLETTER_SPREADSHEET_ID = "1D4Hx5J0eiU9qKkh6GLHc0G3Na5rJtl5tA7t1Za3vQ5w";
export const DEFAULT_NEWSLETTER_RANGE = "A:A";

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export function isValidSubscriberEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export function buildSubscriberRow({ email }) {
  return [String(email).trim().toLowerCase()];
}

export function buildSheetsAppendUrl({
  spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || DEFAULT_NEWSLETTER_SPREADSHEET_ID,
  range = process.env.GOOGLE_SHEETS_RANGE || DEFAULT_NEWSLETTER_RANGE,
} = {}) {
  const encodedRange = encodeURIComponent(range);
  return `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
}

function base64Url(value) {
  return Buffer.from(value).toString("base64url");
}

export function normalizeGooglePrivateKey(privateKey) {
  let key = String(privateKey || "").trim();

  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  key = key.replace(/\\n/g, "\n").trim();

  if (!key.includes("-----BEGIN PRIVATE KEY-----")) {
    try {
      const decoded = Buffer.from(key, "base64").toString("utf8").trim();
      if (decoded.includes("-----BEGIN PRIVATE KEY-----")) {
        key = decoded.replace(/\\n/g, "\n").trim();
      }
    } catch {
      /* keep the original value; crypto will report the parse error */
    }
  }

  return key;
}

function parseMaybeJsonCredentials(value) {
  const raw = String(value || "").trim();
  if (!raw.startsWith("{")) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function resolveGoogleCredentials({
  serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  privateKey = process.env.GOOGLE_PRIVATE_KEY,
  serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
} = {}) {
  const jsonCredentials = parseMaybeJsonCredentials(serviceAccountJson) || parseMaybeJsonCredentials(privateKey);

  return {
    serviceAccountEmail: serviceAccountEmail || jsonCredentials?.client_email,
    privateKey: jsonCredentials?.private_key || privateKey,
  };
}

export function createGoogleJwt({ serviceAccountEmail, privateKey, nowSeconds = Math.floor(Date.now() / 1000) }) {
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccountEmail,
    scope: SHEETS_SCOPE,
    aud: GOOGLE_TOKEN_URL,
    iat: nowSeconds,
    exp: nowSeconds + 3600,
  };

  const unsignedToken = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}`;
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(unsignedToken)
    .sign(normalizeGooglePrivateKey(privateKey), "base64url");

  return `${unsignedToken}.${signature}`;
}

export async function getGoogleAccessToken({
  serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  privateKey = process.env.GOOGLE_PRIVATE_KEY,
  serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
  fetchImpl = fetch,
} = {}) {
  const credentials = resolveGoogleCredentials({ serviceAccountEmail, privateKey, serviceAccountJson });

  if (!credentials.serviceAccountEmail || !credentials.privateKey) {
    throw new Error("Missing Google service account credentials");
  }

  const assertion = createGoogleJwt(credentials);
  const response = await fetchImpl(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error("Google token request failed");
  }

  const token = await response.json();
  return token.access_token;
}

export async function appendNewsletterSubscriber({
  email,
  fetchImpl = fetch,
} = {}) {
  if (!isValidSubscriberEmail(email)) {
    throw new Error("Invalid email");
  }

  const accessToken = await getGoogleAccessToken({ fetchImpl });
  const response = await fetchImpl(buildSheetsAppendUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: [buildSubscriberRow({ email })],
    }),
  });

  if (!response.ok) {
    throw new Error("Google Sheets append failed");
  }

  return response.json();
}
