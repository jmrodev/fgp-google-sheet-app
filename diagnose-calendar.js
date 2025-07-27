require('dotenv').config();
const { google } = require('googleapis');
const fs = require('fs');

async function diagnoseCalendar() {
  console.log('🔍 Diagnóstico de Google Calendar API\n');

  // 1. Verificar archivo de credenciales
  if (!fs.existsSync('credentials.json')) {
    console.log('❌ credentials.json no encontrado');
    return;
  }
  console.log('✅ credentials.json encontrado');

  // 2. Verificar variable de entorno de Calendar ID
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    console.log('❌ GOOGLE_CALENDAR_ID no está configurado en .env');
    return;
  }
  console.log('✅ GOOGLE_CALENDAR_ID configurado:', calendarId);

  // 3. Probar autenticación y acceso a Calendar
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json',
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    const client = await auth.getClient();
    console.log('✅ Autenticación exitosa');

    const calendar = google.calendar({ version: 'v3', auth: client });
    const result = await calendar.calendars.get({ calendarId });
    console.log('✅ Acceso a Calendar exitoso');
    console.log('   Título del calendario:', result.data.summary);
  } catch (error) {
    console.log('❌ Error de autenticación o acceso:', error.message);
    if (error.message.includes('not found')) {
      console.log('   Verifica que el service account tenga acceso al calendario y que el ID sea correcto.');
    }
  }
}

diagnoseCalendar().catch(console.error); 