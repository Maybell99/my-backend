import { google } from "googleapis";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables
dotenv.config();

// Ensure GOOGLE_APPLICATION_CREDENTIALS is defined
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  ? path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS)
  : null;

if (!credentialsPath || !fs.existsSync(credentialsPath)) {
  console.error("❌ Missing or invalid Google credentials file:", credentialsPath);
  process.exit(1);
}

// Load and parse credentials
let credentials;
try {
  credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
} catch (error) {
  console.error("❌ Failed to parse Google credentials file:", error.message);
  process.exit(1);
}

// Validate required fields
if (!credentials.client_email || !credentials.private_key) {
  console.error("❌ Invalid Google credentials file. Ensure it contains 'client_email' and 'private_key'.");
  process.exit(1);
}

// Initialize Google Auth
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: credentials.client_email,
    private_key: credentials.private_key.replace(/\\n/g, "\n"), // Fixes multiline private key issue
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Initialize Google Sheets API
const sheets = google.sheets({ version: "v4", auth });

// Debugging: Verify credentials are loaded correctly
console.log("✅ Google Auth initialized successfully.");
console.log("📧 Client Email:", credentials.client_email);
console.log("🔑 Private Key Loaded: Yes");

export { sheets };
