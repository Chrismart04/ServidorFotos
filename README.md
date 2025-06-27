# 📸 App para Compartir Fotos

Una aplicación web moderna desarrollada con Next.js para compartir fotos entre tu Mac y otros dispositivos a través de la red local.

## ✨ Características

- 📤 **Subir fotos**: Arrastra y suelta o selecciona múltiples fotos
- 🖼️ **Galería**: Visualiza todas las fotos subidas
- 📱 **Código QR**: Accede fácilmente desde otros dispositivos
- 🗑️ **Eliminar fotos**: Gestiona tu galería
- ⬇️ **Descargar**: Descarga fotos a cualquier dispositivo
- 🎨 **Interfaz moderna**: Diseño responsivo con Tailwind CSS
- ⚡ **Rendimiento**: Optimización automática de imágenes con Next.js

## 🚀 Instalación y Uso

### 1. Instalar dependencias

```bash
npm install
```

### 2. Ejecutar la aplicación en modo desarrollo

```bash
npm run dev
```

### 3. Para producción

```bash
# Construir la aplicación
npm run build

# Ejecutar en modo producción
npm start
```

### 4. Acceder a la aplicación

- **En tu Mac**: Abre http://localhost:3000
- **Desde otros dispositivos**: Escanea el código QR que aparece en la página web

## 📱 Cómo usar desde otros dispositivos

1. Ejecuta la app en tu Mac con `npm run dev`
2. Abre la página web en tu Mac (http://localhost:3000)
3. Escanea el código QR con la cámara de tu teléfono/tablet
4. ¡Ya puedes subir y ver fotos desde cualquier dispositivo!

## 🔧 Características técnicas

- **Framework**: Next.js 15.3.4 con TypeScript
- **Frontend**: React 18 con Tailwind CSS
- **API Routes**: Manejo de subida de archivos con Multer
- **Código QR**: Biblioteca qrcode
- **Optimización**: Compresión y optimización automática de imágenes
- **Formatos soportados**: JPG, PNG, GIF, WebP
- **Tamaño máximo**: 10MB por foto
- **Red**: Accesible desde cualquier dispositivo en la misma red WiFi

## 📁 Estructura del proyecto

```
ServidorFotos/
├── package.json              # Dependencias del proyecto
├── next.config.ts            # Configuración de Next.js
├── tsconfig.json             # Configuración de TypeScript
├── eslint.config.mjs         # Configuración de ESLint
├── postcss.config.mjs        # Configuración de PostCSS
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Layout principal
│   │   ├── page.tsx          # Página principal
│   │   ├── globals.css       # Estilos globales
│   │   └── api/              # API Routes
│   │       ├── photos/       # Gestión de fotos
│   │       ├── photos-list/  # Listado de fotos
│   │       ├── qr/           # Generación de código QR
│   │       └── upload/       # Subida de archivos
│   ├── components/           # Componentes React
│   │   ├── PhotoGallery.tsx  # Galería de fotos
│   │   ├── QRSection.tsx     # Sección del código QR
│   │   └── UploadSection.tsx # Sección de subida
│   ├── types/                # Definiciones de tipos TypeScript
│   └── lib/                  # Utilidades
├── photos/                   # Carpeta donde se guardan las fotos
└── public/                   # Archivos estáticos
```

## 🛡️ Seguridad

- Solo se aceptan archivos de imagen
- Tamaño limitado a 10MB por archivo
- Acceso solo desde la red local
- Validación de tipos de archivo en el servidor
- No hay autenticación (uso doméstico/personal)

## 🆘 Solución de problemas

### La aplicación no se conecta desde otros dispositivos

- Asegúrate de que todos los dispositivos estén en la misma red WiFi
- Verifica que el firewall no esté bloqueando el puerto 3000
- En macOS, ve a Preferencias del Sistema > Seguridad y Privacidad > Firewall

### No aparece el código QR

- Refresca la página
- Verifica la conexión a internet
- Revisa la consola del navegador para errores
- Asegúrate de que el servidor esté ejecutándose correctamente

### Errores de TypeScript

- Ejecuta `npm run lint` para verificar errores
- Asegúrate de que todas las dependencias estén instaladas

## 💡 Tips

- Usa `npm run dev` para desarrollo (recarga automática)
- Usa `npm run build && npm start` para producción
- Las fotos se guardan en la carpeta `photos/` del proyecto
- Puedes acceder directamente a las fotos visitando `/api/photos/nombre-archivo.jpg`
- Para detener el servidor, presiona `Ctrl + C` en la terminal
- El Hot Reload está habilitado en modo desarrollo

## 🚀 Scripts disponibles

- `npm run dev` - Ejecuta en modo desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Ejecuta la aplicación construida
- `npm run lint` - Verifica el código con ESLint

¡Disfruta compartiendo tus fotos con la potencia de Next.js! 📸✨
