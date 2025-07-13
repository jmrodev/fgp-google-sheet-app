// Configuración de ejemplo para Google Sheets
// Copia este archivo como .env y configura tus valores

module.exports = {
  // ID de tu Google Sheet (obtenido de la URL)
  GOOGLE_SHEET_ID: 'your_google_sheet_id_here',
  
  // Puerto del servidor
  PORT: 3000,
  
  // Entorno
  NODE_ENV: 'development'
};

// Para obtener el GOOGLE_SHEET_ID:
// 1. Ve a tu Google Sheet
// 2. Copia la URL: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
// 3. El ID es la parte entre /d/ y /edit 