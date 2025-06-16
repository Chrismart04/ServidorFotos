# 📸 App para Compartir Fotos

Una aplicación web simple y elegante para compartir fotos entre tu Mac y otros dispositivos a través de la red local.

## ✨ Características

- 📤 **Subir fotos**: Arrastra y suelta o selecciona múltiples fotos
- 🖼️ **Galería**: Visualiza todas las fotos subidas
- 📱 **Código QR**: Accede fácilmente desde otros dispositivos
- 🗑️ **Eliminar fotos**: Gestiona tu galería
- ⬇️ **Descargar**: Descarga fotos a cualquier dispositivo
- 🎨 **Interfaz moderna**: Diseño responsivo y atractivo

## 🚀 Instalación y Uso

### 1. Instalar dependencias

```bash
npm install
```

### 2. Ejecutar la aplicación

```bash
npm start
```

### 3. Acceder a la aplicación

- **En tu Mac**: Abre http://localhost:3000
- **Desde otros dispositivos**: Escanea el código QR que aparece en la página web

## 📱 Cómo usar desde otros dispositivos

1. Ejecuta la app en tu Mac
2. Abre la página web en tu Mac
3. Escanea el código QR con la cámara de tu teléfono/tablet
4. ¡Ya puedes subir y ver fotos desde cualquier dispositivo!

## 🔧 Características técnicas

- **Servidor**: Node.js con Express
- **Subida de archivos**: Multer
- **Código QR**: qrcode library
- **Formatos soportados**: JPG, PNG, GIF, WebP
- **Tamaño máximo**: 10MB por foto
- **Red**: Accesible desde cualquier dispositivo en la misma red WiFi

## 📁 Estructura del proyecto

```
photo-share-app/
├── package.json          # Dependencias del proyecto
├── server.js             # Servidor principal
├── public/
│   └── index.html        # Interfaz web
├── photos/               # Carpeta donde se guardan las fotos
└── README.md            # Este archivo
```

## 🛡️ Seguridad

- Solo se aceptan archivos de imagen
- Tamaño limitado a 10MB por archivo
- Acceso solo desde la red local
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

## 💡 Tips

- Mantén la aplicación ejecutándose en tu Mac mientras la uses
- Las fotos se guardan en la carpeta `photos/` del proyecto
- Puedes acceder directamente a las fotos visitando `/photos/nombre-archivo.jpg`
- Para detener el servidor, presiona `Ctrl + C` en la terminal

¡Disfruta compartiendo tus fotos! 📸✨
