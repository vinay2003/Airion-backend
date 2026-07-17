import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportPdfOptions {
    filename: string;
    title: string;
    subtitle?: string;
    data: any[];
    columns: { header: string; dataKey: string }[];
}

/**
 * Utility to export an array of objects to a PDF file with a formatted table.
 */
export const exportToPDF = ({ filename, title, subtitle, data, columns }: ExportPdfOptions) => {
    if (!data || !data.length) {
        console.warn('No data to export');
        return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Add Company Logo / Name
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229); // Indigo-600
    doc.text('Airion Admin', 14, 22);

    // Add Title
    doc.setFontSize(16);
    doc.setTextColor(17, 24, 39); // Gray-900
    doc.text(title, 14, 35);
    
    // Add Subtitle / Date
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128); // Gray-500
    const dateStr = `Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;
    if (subtitle) {
        doc.text(`${subtitle} | ${dateStr}`, 14, 42);
    } else {
        doc.text(dateStr, 14, 42);
    }

    // Prepare table data
    const tableBody = data.map(item => {
        const rowData: any = {};
        columns.forEach(col => {
            rowData[col.dataKey] = item[col.dataKey] !== null && item[col.dataKey] !== undefined ? item[col.dataKey] : '';
        });
        return rowData;
    });

    // Generate Table
    autoTable(doc, {
        startY: 50,
        head: [columns.map(col => col.header)],
        body: tableBody.map(row => columns.map(col => row[col.dataKey])),
        theme: 'striped',
        headStyles: {
            fillColor: [79, 70, 229], // Indigo-600
            textColor: 255,
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 9,
            cellPadding: 4,
        },
        alternateRowStyles: {
            fillColor: [249, 250, 251] // Gray-50
        },
        didDrawPage: (data) => {
            // Footer with Page Numbers
            const str = `Page ${doc.internal.getNumberOfPages()}`;
            doc.setFontSize(8);
            doc.setTextColor(156, 163, 175); // Gray-400
            doc.text(str, pageWidth - data.settings.margin.right - 20, doc.internal.pageSize.height - 10);
        }
    });

    // Download
    const finalFilename = `${filename}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(finalFilename);
};
