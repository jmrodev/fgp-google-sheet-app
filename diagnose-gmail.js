require('dotenv').config();
const { google } = require('googleapis');
const fs = require('fs');

async function diagnoseGmail() {
  console.log('🔍 Diagnóstico de Gmail API\n');

  // 1. Verificar archivo de credenciales
  if (!fs.existsSync('credentials.json')) {
    console.log('❌ credentials.json no encontrado');
    return;
  }
  console.log('✅ credentials.json encontrado');

  // 2. Verificar variable de entorno de usuario
  const gmailUser = process.env.GMAIL_USER;
  if (!gmailUser) {
    console.log('❌ GMAIL_USER no está configurado en .env');
    return;
  }
  console.log('✅ GMAIL_USER configurado:', gmailUser);

  // 3. Probar autenticación y acceso a Gmail
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json',
      scopes: ['https://www.googleapis.com/auth/gmail.send'],
    });
    const client = await auth.getClient();
    console.log('✅ Autenticación exitosa');

    const gmail = google.gmail({ version: 'v1', auth: client });
    const profile = await gmail.users.getProfile({ userId: 'me' });
    console.log('✅ Acceso a Gmail exitoso');
    console.log('   Email del servicio:', profile.data.emailAddress);
  } catch (error) {
    console.log('❌ Error de autenticación o acceso:', error.message);
    if (error.message.includes('not found')) {
      console.log('   Verifica que el service account tenga acceso a Gmail o que el usuario esté autorizado.');
    }
  }
}

diagnoseGmail().catch(console.error); 