// utils/fileUploadHandler.js
import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth/mammoth.browser';
import * as XLSX from 'xlsx';

export const handleFileUpload = async (file, setUploadedFile) => {
  if (!file) return;

  const maxFileSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxFileSize) {
    throw new Error("File size exceeds 5MB limit.");
  }

  const fileExtension = file.name.split('.').pop().toLowerCase();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        let jsonData;
        const fileContent = event.target.result;

        if (fileExtension === 'pdf') {
          const pdf = await pdfjsLib.getDocument({ data: fileContent }).promise;
          const page = await pdf.getPage(1);
          const textContent = await page.getTextContent();
          jsonData = { content: textContent.items.map((item) => item.str).join(' ') };
        } else if (['doc', 'docx'].includes(fileExtension)) {
          const result = await mammoth.extractRawText({ arrayBuffer: fileContent });
          jsonData = { content: result.value.trim() };
        } else if (['xls', 'xlsx'].includes(fileExtension)) {
          const workbook = XLSX.read(new Uint8Array(fileContent), { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        } else if (file.type.startsWith('image/')) {
          const base64 = fileContent.split(',')[1];
          jsonData = { base64, name: file.name };
        } else {
          throw new Error('Unsupported file type.');
        }

        setUploadedFile(jsonData);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(fileExtension)) {
      reader.readAsArrayBuffer(file);
    } else if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    }
  });
};
