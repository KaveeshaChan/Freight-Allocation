// // utils/fileUploadHandler.js
// import * as XLSX from 'xlsx';

// export const handleFileUpload = async (file, setUploadedFile) => {
//   if (!file) {
//     return null;
//   }

//   const maxFileSize = 10 * 1024 * 1024; // 5MB
//   if (file.size > maxFileSize) {
//     alert("File size exceeds 10MB limit.");
//     return;
//   }

//   const fileExtension = file.name.split('.').pop().toLowerCase();

//   if (!['xls', 'xlsx'].includes(fileExtension)) {
//     alert("Unsupported file type. Please upload an Excel file (.xls or .xlsx).");
//     return;
//   }

//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();

//     reader.onload = async (event) => {
//       try {
//         const fileContent = event.target.result;
//         const workbook = XLSX.read(new Uint8Array(fileContent), { type: 'array' });
//         const firstSheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[firstSheetName];

//         // Convert Excel sheet to JSON (row-wise)
//         const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//         setUploadedFile(jsonData);
//         resolve(jsonData);
//       } catch (error) {
//         alert("Error processing the file. Please try again.");
//         reject(error);
//       }
//     };

//     reader.readAsArrayBuffer(file);
//   });
// };


// utils/fileUploadHandler.js
import * as XLSX from 'xlsx';

export const handleFileUpload = async (file, setUploadedFile) => {
  if (!file) {
    return null;
  }

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxFileSize) {
    alert("File size exceeds 10MB limit.");
    return;
  }

  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (!['xls', 'xlsx'].includes(fileExtension)) {
    alert("Unsupported file type. Please upload an Excel file (.xls or .xlsx).");
    return;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const fileContent = event.target.result;
        const workbook = XLSX.read(new Uint8Array(fileContent), { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert Excel sheet to JSON array
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Convert JSON to a base64 string for storage
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(JSON.stringify(jsonData));
        const base64File = btoa(String.fromCharCode(...encodedData));

        setUploadedFile(base64File); // Store or send the file data
        resolve(jsonData);
      } catch (error) {
        alert("Error processing the file. Please try again.");
        reject(error);
      }
    };

    reader.readAsArrayBuffer(file);
  });
};

