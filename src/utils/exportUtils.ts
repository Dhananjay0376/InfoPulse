import type { Customer } from '../types/customer';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun, HeadingLevel, AlignmentType, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ─── PDF Export ───
export function exportToPDF(customers: Customer[]) {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229);
  doc.text('Customer Data Report', 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${new Date().toLocaleDateString()} • ${customers.length} records`, 14, 30);

  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(0.5);
  doc.line(14, 33, 196, 33);

  autoTable(doc, {
    startY: 38,
    head: [['#', 'Name', 'Date of Birth', 'Gender', 'Phone', 'Email']],
    body: customers.map((c, i) => [
      i + 1,
      c.name,
      formatDate(c.dob),
      c.gender,
      c.phone,
      c.email,
    ]),
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: { fontSize: 8.5 },
    alternateRowStyles: { fillColor: [245, 243, 255] },
    styles: { cellPadding: 3.5, overflow: 'linebreak' },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 35 },
      2: { cellWidth: 28 },
      3: { cellWidth: 20 },
      4: { cellWidth: 30 },
      5: { cellWidth: 55 },
    },
  });

  doc.save('customers.pdf');
}

// ─── Excel Export ───
export function exportToExcel(customers: Customer[]) {
  const data = customers.map((c, i) => ({
    '#': i + 1,
    'Name': c.name,
    'Date of Birth': formatDate(c.dob),
    'Gender': c.gender,
    'Phone': c.phone,
    'Email': c.email,
    'Added On': formatDate(c.createdAt),
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [
    { wch: 5 },
    { wch: 25 },
    { wch: 15 },
    { wch: 10 },
    { wch: 18 },
    { wch: 30 },
    { wch: 15 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Customers');
  XLSX.writeFile(wb, 'customers.xlsx');
}

// ─── CSV Export ───
export function exportToCSV(customers: Customer[]) {
  const data = customers.map((c, i) => ({
    '#': i + 1,
    'Name': c.name,
    'Date of Birth': formatDate(c.dob),
    'Gender': c.gender,
    'Phone': c.phone,
    'Email': c.email,
    'Added On': formatDate(c.createdAt),
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'customers.csv');
}

// ─── Word / DOCX Export ───
export async function exportToWord(customers: Customer[]) {
  const headerCells = ['#', 'Name', 'Date of Birth', 'Gender', 'Phone', 'Email'].map(
    text =>
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 20, font: 'Calibri' })],
            alignment: AlignmentType.CENTER,
          }),
        ],
        shading: { fill: '4F46E5' },
        width: { size: text === '#' ? 600 : 1800, type: WidthType.DXA },
      })
  );

  const headerRow = new TableRow({ children: headerCells, tableHeader: true });

  const dataRows = customers.map(
    (c, i) =>
      new TableRow({
        children: [String(i + 1), c.name, formatDate(c.dob), c.gender, c.phone, c.email].map(
          text =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text, size: 18, font: 'Calibri' })],
                }),
              ],
              shading: i % 2 === 1 ? { fill: 'F5F3FF' } : undefined,
            })
        ),
      })
  );

  const table = new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
    },
  });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: 'Customer Data Report', bold: true, size: 36, color: '4F46E5', font: 'Calibri' }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated on ${new Date().toLocaleDateString()} • ${customers.length} records`,
                size: 20,
                color: '6B7280',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 300 },
          }),
          table,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'customers.docx');
}

// ─── JSON Export ───
export function exportToJSON(customers: Customer[]) {
  const data = customers.map(c => ({
    name: c.name,
    dateOfBirth: c.dob,
    gender: c.gender,
    phone: c.phone,
    email: c.email,
    addedOn: c.createdAt,
  }));
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  saveAs(blob, 'customers.json');
}

// ─── XML Export ───
export function exportToXML(customers: Customer[]) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<customers>\n';
  for (const c of customers) {
    xml += '  <customer>\n';
    xml += `    <name>${escapeXml(c.name)}</name>\n`;
    xml += `    <dateOfBirth>${c.dob}</dateOfBirth>\n`;
    xml += `    <gender>${c.gender}</gender>\n`;
    xml += `    <phone>${escapeXml(c.phone)}</phone>\n`;
    xml += `    <email>${escapeXml(c.email)}</email>\n`;
    xml += `    <addedOn>${c.createdAt}</addedOn>\n`;
    xml += '  </customer>\n';
  }
  xml += '</customers>';
  const blob = new Blob([xml], { type: 'application/xml' });
  saveAs(blob, 'customers.xml');
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
