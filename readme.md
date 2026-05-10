# FlowPDF - Editor de PDF Gratuito y Open-Source

<p align="center">
  <img src="logo-flowpdf.png" alt="FlowPDF Logo" width="160">
</p>

<p align="center">
  <a href="https://ko-fi.com/arielgoyoaga" target="_blank">
    <img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="ko-fi" />
  </a>
</p>

> **Procesa tus documentos directamente en tu navegador. Sin servidores, sin costes, 100% privado.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/goyoaga/pdf-editor-app?style=social)](https://github.com/goyoaga/pdf-editor-app)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/goyoaga/pdf-editor-app/releases)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/goyoaga/pdf-editor-app)

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Uso](#uso)
- [Desarrollo](#desarrollo)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)
- [Contacto](#contacto)

---

## ✨ Características

### 🔗 Unir PDFs
Combina múltiples archivos PDF en un solo documento. Reordena las páginas mediante drag-and-drop antes de descargar.

**Características:**
- Soporte para ilimitados archivos PDF
- Reordenamiento visual mediante interfaz intuitiva
- Descarga instantánea del PDF unido
- Sin límite de tamaño de archivo

### ✂️ Dividir PDFs
Extrae páginas específicas o divide un PDF en múltiples archivos.

**Características:**
- Selecciona rango de páginas o extrae página por página
- Descarga individual de cada página
- Previsualización en tiempo real
- Soporte para PDFs de cualquier tamaño

### ✏️ Editar PDFs
Añade anotaciones, texto, formas y firmas a tus documentos.

**Características:**
- Herramientas de anotación (texto, formas, dibujo)
- Navegación entre páginas
- Interfaz intuitiva y responsiva
- Descarga del PDF editado

### 📄 Convertir DOCX a PDF
Transforma documentos Word (.doc, .docx) a PDF manteniendo el formato.

**Características:**
- Soporte para .doc y .docx
- Preservación de estilos y formato
- Conversión rápida y confiable
- Manejo de documentos complejos

### 🖼️ Convertir Imágenes a PDF
Crea PDFs a partir de imágenes JPG, PNG y WebP.

**Características:**
- Múltiples imágenes en un solo PDF
- Soporte para varios formatos de imagen
- Ajuste automático de tamaño
- Centrado y espaciado inteligente

---

## 🛠️ Tecnologías

### Frontend
- **React 19** - Framework UI moderno
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Utilidades CSS
- **Wouter** - Enrutamiento ligero

### Librerías de Procesamiento PDF
- **pdf-lib** - Manipulación de PDFs (unir, dividir)
- **pdf.js** - Renderizado y visualización de PDFs
- **jsPDF** - Generación de PDFs desde canvas
- **html2canvas** - Conversión de HTML a imagen
- **docx-preview** - Visualización de documentos Word

### UI Components
- **shadcn/ui** - Componentes accesibles
- **Radix UI** - Primitivos de interfaz
- **Lucide React** - Iconografía
- **Sonner** - Sistema de notificaciones

### Herramientas de Desarrollo
- **Vite** - Build tool rápido
- **Vite** - Build tool rápido
- **npm** - Gestor de paquetes
- **Prettier** - Formateador de código

---

## 🚀 Instalación

### Requisitos Previos
- Node.js 18+ 
- pnpm 10+
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/goyoaga/pdf-editor-app.git
cd pdf-editor-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

4. **Acceder a la aplicación**
```
http://localhost:3000
```

### Despliegue (Build)
Para generar los archivos listos para producción:
```bash
npm run build
```
Esto creará una carpeta `dist/` que puedes subir a cualquier hosting estático (GitHub Pages, Netlify, Vercel).

---

## 📖 Uso

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor con hot reload
npm run dev

# Compilar TypeScript
npm run check

# Formatear código
npm run format

# Build de producción
npm run build
```

### Estructura de Directorios

```
flowpdf/
├── client/              # Todo el código fuente de la web
│   ├── public/          # Archivos estáticos (logo, etc.)
│   ├── src/
│   │   ├── components/  # Componentes React (Editores, Upload, etc.)
│   │   ├── pages/       # Home, Privacidad, etc.
│   │   ├── hooks/       # Lógica personalizada
│   │   ├── lib/         # Utilidades de PDF (pdf-lib)
│   │   └── index.css    # Diseño de sistema (Stitch / Action Blue)
│   └── index.html       # Punto de entrada HTML
├── dist/                # Generado tras el build (listo para desplegar)
├── logo-flowpdf.png     # Logo para GitHub
├── package.json         # Dependencias y scripts
├── tailwind.config.js   # Configuración de estilos
└── vite.config.ts       # Configuración de compilación
```

---

## 🎨 Diseño y Arquitectura

### Filosofía de Diseño
FlowPDF sigue una filosofía de diseño **profesional, limpia y de alta fidelidad**:

- **Paleta de colores**: Action Blue (#3d4ad8) como color primario, Superficies Glassmorphism.
- **Tipografía**: Inter (moderna y legible).
- **Elementos distintivos**: Sombras suaves, desenfoques de fondo (blur) y micro-animaciones.
- **Accesibilidad**: WCAG 2.1 AA compliant.

### Procesamiento 100% en el Cliente
Todas las operaciones se realizan en el navegador del usuario:
- ✅ No hay carga a servidores
- ✅ Máxima privacidad
- ✅ Cero costes de infraestructura
- ✅ Funcionamiento offline (parcial)

---

## 🔧 Desarrollo

### Agregar Nuevas Características

1. **Crear componente en `client/src/components/`**
```tsx
// client/src/components/MyFeature.tsx
import { Button } from "@/components/ui/button";

export default function MyFeature() {
  return (
    <div>
      <h2>Mi Nueva Característica</h2>
      <Button>Acción</Button>
    </div>
  );
}
```

2. **Integrar en página correspondiente**
```tsx
// client/src/pages/Home.tsx
import MyFeature from "@/components/MyFeature";

export default function Home() {
  return (
    <div>
      <MyFeature />
    </div>
  );
}
```

3. **Ejecutar tests y build**
```bash
pnpm run check
pnpm run build
```

### Guía de Estilos

- **Componentes**: Usar shadcn/ui como base
- **Estilos**: Tailwind CSS con variables CSS en `index.css`
- **Colores**: Usar variables CSS definidas (--primary, --secondary, etc.)
- **Tipografía**: Respetar jerarquía definida en `index.css`

### Convenciones de Código

- **Nombres de archivos**: camelCase para componentes (MyComponent.tsx)
- **Imports**: Usar alias `@/` para rutas relativas
- **Tipos**: Preferir tipos explícitos en TypeScript
- **Comentarios**: Documentar funciones complejas

---

## 🧪 Testing

```bash
# Ejecutar tests
pnpm run test

# Tests con coverage
pnpm run test:coverage

# Watch mode
pnpm run test:watch
```

---

## 📦 Dependencias Principales

| Paquete | Versión | Propósito |
|---------|---------|----------|
| react | ^19.2.1 | Framework UI |
| typescript | 5.6.3 | Lenguaje tipado |
| tailwindcss | ^4.1.14 | Estilos CSS |
| pdf-lib | ^1.17.1 | Manipulación PDF |
| pdfjs-dist | ^5.7.284 | Renderizado PDF |
| jspdf | ^4.2.1 | Generación PDF |
| wouter | ^3.3.5 | Enrutamiento |

Para la lista completa, ver `package.json`.

---

## 🚢 Despliegue

### Opciones de Hosting

#### Opción 1: Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Opción 2: Netlify
```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Opción 3: Servidor Propio
```bash
# Build
pnpm run build

# Iniciar servidor
NODE_ENV=production pnpm run start
```

### Variables de Entorno
```env
# .env.production
VITE_APP_TITLE=FlowPDF
VITE_APP_ID=flowpdf
NODE_ENV=production
```

---

## 🐛 Reporte de Bugs

Si encuentras un bug, por favor:

1. Verifica que no esté reportado en [Issues](https://github.com/goyoaga/pdf-editor-app/issues)
2. Crea un nuevo issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Navegador y versión
   - Screenshots si es relevante

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. **Fork** el repositorio
2. **Crea una rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre un Pull Request**

### Directrices de Contribución
- Sigue las convenciones de código existentes
- Escribe tests para nuevas características
- Actualiza documentación si es necesario
- Asegúrate de que el build pase (`pnpm run check`)

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2026 FlowPDF Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🌟 Roadmap

### v1.1 (Próximas semanas)
- [ ] Edición avanzada de PDF (anotaciones funcionales)
- [ ] Soporte para más formatos (PowerPoint, Excel)
- [ ] Temas oscuro/claro
- [ ] Historial de operaciones

### v1.2 (Próximos meses)
- [ ] Compresión de PDF
- [ ] Extracción de texto OCR
- [ ] Watermark personalizado
- [ ] Encriptación de PDF

### v2.0 (Futuro)
- [ ] Aplicación móvil
- [ ] Sincronización en la nube
- [ ] Colaboración en tiempo real
- [ ] Integración con servicios (Google Drive, Dropbox)

---

## 📞 Contacto

- **Website**: [arielgoyoaga.com](https://arielgoyoaga.com)
- **GitHub**: [github.com/goyoaga](https://github.com/goyoaga)
- **Email**: [hola@arielgoyoaga.com](mailto:hola@arielgoyoaga.com)

---

## 🙏 Agradecimientos

Gracias a:
- [pdf-lib](https://github.com/Hopding/pdf-lib) por la excelente librería de manipulación PDF
- [shadcn/ui](https://ui.shadcn.com/) por los componentes accesibles
- [Tailwind CSS](https://tailwindcss.com/) por el framework CSS
- Todos los contribuidores y usuarios de FlowPDF

---

## 📊 Estadísticas

![GitHub Repo stars](https://img.shields.io/github/stars/goyoaga/pdf-editor-app?style=social)
![GitHub forks](https://img.shields.io/github/forks/goyoaga/pdf-editor-app?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/goyoaga/pdf-editor-app?style=social)

---

**Hecho con ❤️ por la comunidad FlowPDF**

*Última actualización: Mayo 2026*
