import * as XLSX from 'xlsx';

export const exportToExcel = (documentData, documentName) => {
  // Handle both base64 string and direct JSON data
  let json;
  if (typeof documentData === 'string') {
    // Decode base64 string if that's what we received
    const fileBuffer = Buffer.from(documentData, 'base64');
    json = JSON.parse(fileBuffer.toString());
  } else {
    // If we already have JSON data, use it directly
    json = documentData;
  }


  const ws = XLSX.utils.aoa_to_sheet(json);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Document Data");


  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${documentName}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};