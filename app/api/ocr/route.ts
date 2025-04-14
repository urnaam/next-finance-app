// app/api/ocr/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import * as vision from '@google-cloud/vision';
import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { v4 as uuidv4 } from 'uuid';

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(
  process.cwd(),
  'google-credentials.json'
);

interface TableRow {
  Einnahmen: string;
  Ausgaben: string;
  Belegdatum: string;
  BelegNr: string;
  Text: string;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Save to temporary file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const tempFilePath = path.join(tmpdir(), `${uuidv4()}-${file.name}`);
    await fs.writeFile(tempFilePath, buffer);

    const client = new vision.ImageAnnotatorClient();

    const [result] = await client.documentTextDetection(tempFilePath);
    const text = result.fullTextAnnotation?.text;

    const lines = text?.split('\n').filter(Boolean);

    // Create a table structure from the lines
    const table = lines?.map((line) => {
      return line.split(/\s{2,}|\t+/); // Split by spaces or tabs
    });

    const jsonOutput = {
      table: table?.map((row) => {
        return row.reduce<TableRow>(
          (obj, cell, index) => {
            // Map each cell to a specific column
            if (index === 0) obj['Einnahmen'] = cell;
            if (index === 1) obj['Ausgaben'] = cell;
            if (index === 2) obj['Belegdatum'] = cell;
            if (index === 3) obj['BelegNr'] = cell;
            if (index === 4) obj['Text'] = cell;
            return obj;
          },
          { Einnahmen: '', Ausgaben: '', Belegdatum: '', BelegNr: '', Text: '' }
        ); // Initialize with default values
      }),
    };
    console.log('Extracted Table Data:', jsonOutput);
    const outputFilePath = path.join(process.cwd(), 'table-output.json');
    fs.writeFile(outputFilePath, JSON.stringify(jsonOutput, null, 2));

    console.log('Table data has been saved to table-output.json');

    await fs.unlink(tempFilePath); // Clean up

    if (!text) {
      return NextResponse.json(
        { error: 'Could not extract text.' },
        { status: 500 }
      );
    }

    // Process extracted text (e.g., parse for invoice data)
    const parsedData = parseInvoiceData(text);

    return NextResponse.json({ parsedData });
  } catch (error: unknown) {
    console.error('OCR error:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'An unknown error occurred.' },
      { status: 500 }
    );
  }
}

function parseInvoiceData(text: string) {
  const lines = text.split('\n').filter(Boolean);

  // Sample regex for extracting basic fields, e.g., total, date, etc.
  const invoiceData = {
    monat: '',
    jahr: '',
    items: [] as { description: string; amount: string }[],
  };

  // Example parsing logic:
  lines.forEach((line) => {
    if (line.match(/Date:/i)) {
      invoiceData.monat = line.replace(/Monat:/i, '').trim();
    }

    if (line.match(/Total:/i)) {
      invoiceData.jahr = line.replace(/Jahr:/i, '').trim();
    }

    if (line.match(/\d+\.\d+/)) {
      const item = line.split(' ').filter(Boolean);
      const description = item.slice(0, -1).join(' '); // All text except last part
      const amount = item[item.length - 1]; // The last part is the amount
      invoiceData.items.push({ description, amount });
    }
  });

  console.log('Parsed Invoice Data:', invoiceData);
  return invoiceData;
}
