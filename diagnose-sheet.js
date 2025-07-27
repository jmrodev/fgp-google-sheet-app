require('dotenv').config();
const { google } = require('googleapis');
const fs = require('fs');

async function diagnoseGoogleSheets() {
  console.log('🔍 Diagnóstico de Google Sheets API\n');
  
  // 1. Verificar variables de entorno
  console.log('1. Verificando variables de entorno...');
  const sheetId = process.env.GOOGLE_SHEET_ID;
  
  if (!sheetId) {
    console.log('❌ GOOGLE_SHEET_ID no está configurado');
    console.log('   Crea un archivo .env con: GOOGLE_SHEET_ID=tu_id_aqui');
    return;
  }
  
  console.log('✅ GOOGLE_SHEET_ID configurado:', sheetId);
  
  // 2. Verificar archivo de credenciales
  console.log('\n2. Verificando archivo de credenciales...');
  if (!fs.existsSync('credentials.json')) {
    console.log('❌ credentials.json no encontrado');
    console.log('   Descarga las credenciales desde Google Cloud Console');
    return;
  }
  
  console.log('✅ credentials.json encontrado');
  
  // 3. Probar autenticación
  console.log('\n3. Probando autenticación...');
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const client = await auth.getClient();
    console.log('✅ Autenticación exitosa');
    
    // 4. Probar acceso al spreadsheet
    console.log('\n4. Probando acceso al spreadsheet...');
    const sheets = google.sheets({ version: 'v4', auth: client });
    
    const response = await sheets.spreadsheets.get({
      spreadsheetId: sheetId
    });
    
    console.log('✅ Spreadsheet accesible');
    console.log('   Título:', response.data.properties.title);
    console.log('   Hojas disponibles:');
    
    response.data.sheets.forEach((sheet, index) => {
      console.log(`   ${index + 1}. ${sheet.properties.title}`);
    });
    
    // 5. Probar acceso a una hoja específica
    console.log('\n5. Probando acceso a hojas...');
    const firstSheet = response.data.sheets[0];
    if (firstSheet) {
      const sheetName = firstSheet.properties.title;
      console.log(`   Probando acceso a: ${sheetName}`);
      
      try {
        const valuesResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: sheetId,
          range: `'${sheetName}'!A1:Z1`
        });
        
        console.log('✅ Acceso a hoja exitoso');
        if (valuesResponse.data.values && valuesResponse.data.values[0]) {
          console.log('   Encabezados encontrados:', valuesResponse.data.values[0]);
        } else {
          console.log('   Hoja vacía o sin encabezados');
        }
      } catch (error) {
        console.log('❌ Error al acceder a la hoja:', error.message);
      }
    }
    
  } catch (error) {
    console.log('❌ Error de autenticación:', error.message);
    
    if (error.message.includes('invalid_grant')) {
      console.log('   Posible solución: Regenera las credenciales en Google Cloud Console');
    } else if (error.message.includes('not found')) {
      console.log('   Posible solución: Verifica que el GOOGLE_SHEET_ID sea correcto');
    }
  }
  
  console.log('\n📋 Resumen de configuración:');
  console.log('   - Puerto del servidor:', process.env.PORT || 3000);
  console.log('   - Entorno:', process.env.NODE_ENV || 'development');
  console.log('   - GOOGLE_SHEET_ID:', sheetId);
}

diagnoseGoogleSheets().catch(console.error); 