import { decrypt, encrypt } from "@/app/shared/crypto-util";
import { google } from "googleapis";


export async function POST(request: Request) {
    const body = await request.json();
    const { link, tags, timeDuration } = body;

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const sheetId = process.env.GOOGLE_SHEET_ID as string;

    const response = await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: "Sheet1!A:D",
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [[new Date(), encrypt(link), tags, timeDuration]],
        },
    });

    return Response.json({ success: true, data: response.data });
}

export async function GET() {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const sheetId = process.env.GOOGLE_SHEET_ID as string;

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: "Sheet1!A:D", // adjust if your sheet name or columns differ
    });

    const rows = response.data.values || [];

    // Assign an ID for each row (index)
    const dataWithId = rows.map((row, idx) => ({
        id: idx,
        date: row[0],
        link: decrypt(row[1]),
        tags: row[2],
        timeDuration: row[3],
    }));

    return Response.json({ success: true, data: dataWithId });
}