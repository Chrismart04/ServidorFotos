const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const QRCode = require("qrcode");
const os = require("os");

const app = express();
const PORT = 3000;

// Crear directorio para las fotos si no existe
const photosDir = path.join(__dirname, "photos");
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir);
}

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, photosDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Solo permitir archivos de imagen
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos de imagen"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
  },
});

// Middleware
app.use(express.static("public"));
app.use("/photos", express.static(photosDir));
app.use(express.json());

// Función para obtener la IP local
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
  return "localhost";
}

// Rutas
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Generar código QR con la dirección IP local
app.get("/qr", async (req, res) => {
  try {
    const localIP = getLocalIP();
    const url = `http://${localIP}:${PORT}`;
    const qrCode = await QRCode.toDataURL(url);
    res.json({ qrCode, url });
  } catch (error) {
    res.status(500).json({ error: "Error generando código QR" });
  }
});

// Subir foto
app.post("/upload", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se seleccionó ningún archivo" });
  }

  res.json({
    message: "Foto subida exitosamente",
    filename: req.file.filename,
    originalName: req.file.originalname,
  });
});

// Listar fotos
app.get("/photos-list", (req, res) => {
  try {
    const files = fs
      .readdirSync(photosDir)
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
      })
      .map((file) => {
        const filePath = path.join(photosDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          uploadDate: stats.mtime,
          size: stats.size,
        };
      })
      .sort((a, b) => b.uploadDate - a.uploadDate);

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: "Error listando fotos" });
  }
});

// Eliminar foto
app.delete("/photos/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(photosDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: "Foto eliminada exitosamente" });
    } else {
      res.status(404).json({ error: "Foto no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error eliminando foto" });
  }
});

// Eliminar todas las fotos
app.delete("/photos", (req, res) => {
  try {
    const files = fs.readdirSync(photosDir).filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
    });

    let deletedCount = 0;
    files.forEach((file) => {
      const filePath = path.join(photosDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });

    res.json({
      message: `${deletedCount} fotos eliminadas exitosamente`,
      deletedCount: deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando todas las fotos" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  const localIP = getLocalIP();
  console.log(`🚀 Servidor ejecutándose en:`);
  console.log(`   Local:    http://localhost:${PORT}`);
  console.log(`   Red:      http://${localIP}:${PORT}`);
  console.log(
    `\n📱 Escanea el código QR en la app para acceder desde otros dispositivos`
  );
});
