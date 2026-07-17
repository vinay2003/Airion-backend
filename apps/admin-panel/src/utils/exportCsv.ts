/**
 * Utility to export an array of objects to a CSV file.
 *
 * @param data Array of objects to export
 * @param filename Name of the file to save as (without .csv extension)
 */
export const exportToCSV = (data: any[], filename: string) => {
    if (!data || !data.length) {
        console.warn('No data to export');
        return;
    }

    // Get headers
    const headers = Object.keys(data[0]);
    
    // Convert data to CSV string
    const csvContent = [
        headers.join(','),
        ...data.map(item => 
            headers.map(header => {
                const cellData = item[header];
                // Handle strings with commas, quotes, or newlines by wrapping in quotes
                if (typeof cellData === 'string' && (cellData.includes(',') || cellData.includes('"') || cellData.includes('\n'))) {
                    return `"${cellData.replace(/"/g, '""')}"`;
                }
                return cellData !== null && cellData !== undefined ? cellData : '';
            }).join(',')
        )
    ].join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
