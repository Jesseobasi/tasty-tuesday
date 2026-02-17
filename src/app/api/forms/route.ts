import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const SHEET_ID = process.env.SHEETS_SHEET_ID;
const RANGE = process.env.SHEETS_RANGE || 'Form Responses 1!A:Z';

const getJwtClient = () => {
  const clientEmail = process.env.SHEETS_CLIENT_EMAIL;
  let privateKey = process.env.SHEETS_PRIVATE_KEY;
  if (!clientEmail || !privateKey) {
    throw new Error('Missing Sheets credentials (SHEETS_CLIENT_EMAIL / SHEETS_PRIVATE_KEY)');
  }
  // Handle escaped newlines from env
  privateKey = privateKey.replace(/\\n/g, '\n');
  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
};

const fetchSheet = async () => {
  if (!SHEET_ID) throw new Error('Missing SHEETS_SHEET_ID');
  const auth = getJwtClient();
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE,
  });
  const rows = res.data.values ?? [];
  if (rows.length === 0) return [];
  const [header, ...data] = rows;
  return data.map((row) => {
    const obj: Record<string, string> = {};
    header.forEach((key, idx) => {
      obj[key] = row[idx] ?? '';
    });
    return obj;
  });
};

export async function GET() {
  try {
    const responses = await fetchSheet();
    return NextResponse.json({ responses });
  } catch (error: any) {
    console.error('Sheets fetch failed', error);
    return NextResponse.json({ error: error.message || 'Failed to load form responses' }, { status: 500 });
  }
}
