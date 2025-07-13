# Google Sheets API - Node.js

Aplicación Node.js para interactuar con Google Sheets API. Permite enviar datos, obtener encabezados, listar hojas y realizar operaciones CRUD en hojas de cálculo.

## 🚀 Características

- ✅ Enviar datos a Google Sheets
- ✅ Obtener y establecer encabezados
- ✅ Listar hojas disponibles
- ✅ Obtener datos de hojas
- ✅ Actualizar filas específicas
- ✅ Eliminar filas
- ✅ Buscar por correo electrónico
- ✅ Manejo robusto de errores
- ✅ Validación de datos
- ✅ Sanitización de nombres de hojas

## 📋 Prerrequisitos

1. **Node.js** (versión 14 o superior)
2. **Cuenta de Google** con Google Sheets
3. **Proyecto en Google Cloud Console** con Google Sheets API habilitada
4. **Credenciales de servicio** descargadas

## ⚙️ Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google Sheets API**
4. Ve a "Credenciales" → "Crear credenciales" → "Cuenta de servicio"
5. Descarga el archivo JSON de credenciales
6. Renombra el archivo a `credentials.json` y colócalo en la raíz del proyecto

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
GOOGLE_SHEET_ID=tu_id_de_google_sheet_aqui
PORT=3000
NODE_ENV=development
```

### 4. Obtener el ID de Google Sheet

1. Abre tu Google Sheet
2. Copia la URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
3. El ID es la parte entre `/d/` y `/edit`
4. Colócalo en la variable `GOOGLE_SHEET_ID`

### 5. Compartir el Google Sheet

1. Abre tu Google Sheet
2. Haz clic en "Compartir" (esquina superior derecha)
3. Agrega el email de la cuenta de servicio (está en `credentials.json`)
4. Dale permisos de "Editor"

## 🔧 Uso

### Iniciar el servidor

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

### Diagnóstico

Para verificar la configuración:

```bash
node diagnose.js
```

## 📡 Endpoints

### Obtener hojas disponibles
```http
GET /sheets
```

### Obtener encabezados de una hoja
```http
GET /headers/{sheetName}
```

### Crear encabezados si no existen
```http
POST /headers/{sheetName}
Content-Type: application/json

{
  "headers": ["fecha", "nombre", "correo", "mensaje"]
}
```

### Enviar datos a una hoja
```http
POST /send/{sheetName}
Content-Type: application/json

{
  "nombre": "Frank",
  "correo": "frank@example.com",
  "mensaje": "Hola mundo"
}
```

### Obtener datos de una hoja
```http
GET /data/{sheetName}
```

### Actualizar una fila
```http
PUT /update/{sheetName}/{rowIndex}
Content-Type: application/json

{
  "values": ["2025-07-08", "Frank", "nuevo@email.com", "mensaje actualizado"]
}
```

### Eliminar una fila
```http
DELETE /delete/{sheetName}/{rowIndex}
```

### Buscar por correo
```http
GET /find/{sheetName}?correo=email@example.com
```

## 🧪 Testing

Usa el archivo `request.http` con la extensión REST Client de VS Code o importa las peticiones a Postman.

### Ejemplo de uso con curl

```bash
# Enviar datos
curl -X POST http://localhost:3000/send/Hoja1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Frank","correo":"frank@example.com","mensaje":"Hola mundo"}'

# Obtener hojas
curl http://localhost:3000/sheets

# Obtener datos
curl http://localhost:3000/data/Hoja1
```

## 🔍 Solución de Problemas

### Error: "Unable to parse range"

**Causa:** El nombre de la hoja contiene caracteres especiales o no existe.

**Solución:**
1. Verifica que la hoja existe en tu Google Sheet
2. Usa nombres simples sin caracteres especiales
3. Ejecuta `node diagnose.js` para verificar la configuración

### Error: "GOOGLE_SHEET_ID no está configurado"

**Solución:**
1. Crea el archivo `.env`
2. Configura `GOOGLE_SHEET_ID=tu_id_aqui`

### Error: "Spreadsheet no encontrado"

**Solución:**
1. Verifica que el ID del spreadsheet sea correcto
2. Asegúrate de que la cuenta de servicio tenga permisos
3. Comparte el Google Sheet con el email de la cuenta de servicio

### Error: "Error de autenticación"

**Solución:**
1. Verifica que `credentials.json` esté en la raíz del proyecto
2. Regenera las credenciales en Google Cloud Console
3. Asegúrate de que la Google Sheets API esté habilitada

## 📁 Estructura del Proyecto

```
├── index.js                 # Servidor principal
├── diagnose.js             # Script de diagnóstico
├── config.example.js       # Configuración de ejemplo
├── credentials.json        # Credenciales de Google (no incluir en git)
├── .env                    # Variables de entorno (no incluir en git)
├── sheets/
│   ├── sheet.controller.js # Controlador de rutas
│   ├── sheet.routes.js     # Definición de rutas
│   └── sheet.service.js    # Lógica de negocio
└── request.http           # Ejemplos de peticiones HTTP
```

## 🔒 Seguridad

- **Nunca** subas `credentials.json` o `.env` a Git
- Usa variables de entorno para configuraciones sensibles
- Limita los permisos de la cuenta de servicio
- Revisa regularmente los permisos del Google Sheet

## 📝 Notas

- Los nombres de hojas se sanitizan automáticamente
- Se valida la existencia de hojas antes de operaciones
- Los errores incluyen mensajes descriptivos y sugerencias
- El sistema maneja automáticamente caracteres especiales en nombres de hojas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. 