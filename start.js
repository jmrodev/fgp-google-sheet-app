#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs');

console.log('🚀 Iniciando Google Sheets API Server...\n');

// Verificar configuración básica
function checkConfiguration() {
  console.log('📋 Verificando configuración...');
  
  // 1. Verificar variables de entorno
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    console.log('❌ GOOGLE_SHEET_ID no está configurado');
    console.log('   Crea un archivo .env con: GOOGLE_SHEET_ID=tu_id_aqui');
    process.exit(1);
  }
  
  console.log('✅ GOOGLE_SHEET_ID configurado');
  
  // 2. Verificar archivo de credenciales
  if (!fs.existsSync('credentials.json')) {
    console.log('❌ credentials.json no encontrado');
    console.log('   Descarga las credenciales desde Google Cloud Console');
    process.exit(1);
  }
  
  console.log('✅ credentials.json encontrado');
  
  // 3. Verificar dependencias
  if (!fs.existsSync('node_modules')) {
    console.log('❌ node_modules no encontrado');
    console.log('   Ejecuta: npm install');
    process.exit(1);
  }
  
  console.log('✅ Dependencias instaladas');
  
  console.log('\n✅ Configuración verificada correctamente\n');
}

// Función principal
async function startServer() {
  try {
    // Verificar configuración
    checkConfiguration();
    
    // Importar y iniciar servidor
    const app = require('./index.js');
    
    console.log('🎉 Servidor iniciado correctamente!');
    console.log('📡 Endpoints disponibles:');
    console.log('   GET  /sheets                    - Listar hojas');
    console.log('   GET  /headers/:sheetName        - Obtener encabezados');
    console.log('   POST /headers/:sheetName        - Crear encabezados');
    console.log('   POST /send/:sheetName           - Enviar datos');
    console.log('   GET  /data/:sheetName           - Obtener datos');
    console.log('   PUT  /update/:sheetName/:row    - Actualizar fila');
    console.log('   DELETE /delete/:sheetName/:row  - Eliminar fila');
    console.log('   GET  /find/:sheetName?correo=   - Buscar por correo');
    console.log('\n🔧 Para diagnóstico: node diagnose.js');
    console.log('📖 Para más información: consulta README.md');
    
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    console.log('\n🔍 Ejecuta "node diagnose.js" para más detalles');
    process.exit(1);
  }
}

// Manejar señales de terminación
process.on('SIGINT', () => {
  console.log('\n👋 Servidor detenido');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Servidor detenido');
  process.exit(0);
});

// Iniciar servidor
startServer(); 