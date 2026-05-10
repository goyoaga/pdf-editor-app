# Product Requirements Document (PRD): Editor de PDF Web Open-Source

## 1. Introducción

Este documento detalla los requisitos para el desarrollo de una aplicación web de código abierto, gratuita y sin costes de servidor, diseñada para la manipulación de documentos PDF. La aplicación permitirá a los usuarios realizar operaciones comunes como unir, dividir, editar y convertir archivos a formato PDF directamente desde su navegador web. El proyecto se ofrecerá como software de código abierto en GitHub, permitiendo a la comunidad contribuir y utilizar la herramienta libremente. El hosting se realizará en Hostinger, priorizando una arquitectura que minimice los costes operativos.

### 1.1 Propósito

El propósito principal de esta aplicación es proporcionar una alternativa gratuita y privada a las herramientas de edición de PDF existentes, garantizando que el procesamiento de los documentos se realice íntegramente en el lado del cliente, eliminando así la necesidad de servidores costosos y protegiendo la privacidad del usuario al no subir sus archivos a la nube.

### 1.2 Alcance

El alcance de este proyecto incluye el desarrollo de una aplicación web con las siguientes funcionalidades principales:

*   Conversión de archivos `.doc` y `.jpg` a PDF.
*   Unión de múltiples archivos PDF.
*   Edición básica de PDF (anotaciones, texto, formas).
*   División de archivos PDF.
*   Interfaz de usuario intuitiva con soporte para arrastrar y soltar (drag & drop) y botón de importación.

### 1.3 Público Objetivo

Usuarios individuales, pequeñas empresas y desarrolladores que buscan una herramienta de manipulación de PDF gratuita, de código abierto, privada y sin dependencias de servidor.

## 2. Objetivos del Producto

*   **Costo Cero:** Asegurar que la aplicación no genere costes operativos más allá del hosting estático básico.
*   **Privacidad:** Garantizar que todos los procesos de manipulación de PDF se realicen en el navegador del usuario, sin subir archivos a ningún servidor.
*   **Open Source:** Publicar el código fuente en GitHub bajo una licencia permisiva para fomentar la colaboración y el uso libre.
*   **Facilidad de Uso:** Proporcionar una interfaz de usuario limpia e intuitiva que permita a usuarios no técnicos realizar operaciones de PDF con facilidad.
*   **Rendimiento:** Optimizar la aplicación para un rendimiento eficiente en el navegador, incluso con documentos de tamaño moderado.

## 3. Funcionalidades

### 3.1 Carga de Archivos

*   **Drag & Drop:** Los usuarios podrán arrastrar y soltar archivos (`.doc`, `.jpg`, `.pdf`) directamente en la interfaz de la aplicación.
*   **Botón de Importación:** Un botón claro permitirá a los usuarios seleccionar archivos desde su sistema de archivos.
*   **Validación:** La aplicación validará el tipo de archivo al cargar, mostrando un mensaje de error si el formato no es compatible.

### 3.2 Conversión a PDF

*   **DOC a PDF:** Convertir archivos `.doc` (y `.docx`) a PDF. Este proceso se realizará en el cliente, utilizando librerías que rendericen el documento Word a HTML y luego a PDF.
*   **JPG a PDF:** Convertir imágenes `.jpg` a un documento PDF, permitiendo ajustar el tamaño y la orientación de la imagen dentro del PDF.

### 3.3 Unión de PDF

*   **Selección Múltiple:** Los usuarios podrán seleccionar varios archivos PDF para unirlos.
*   **Reordenación:** Interfaz para reordenar fácilmente los PDFs antes de la unión.
*   **Previsualización:** Previsualización de los PDFs seleccionados antes de la operación final.

### 3.4 Edición Online de PDF

*   **Visualización:** Utilización de `pdf.js` para una visualización precisa de los documentos PDF en el navegador.
*   **Anotaciones:** Herramientas para añadir texto, formas básicas (rectángulos, círculos, líneas) y firmas (dibujo a mano alzada o importación de imagen) sobre el PDF.
*   **Guardar Cambios:** Opción para descargar el PDF editado con los cambios aplicados.

### 3.5 División de PDF

*   **Selección de Páginas:** Los usuarios podrán seleccionar rangos de páginas o páginas individuales para extraerlas en nuevos documentos PDF.
*   **Modos de División:** Opciones para dividir por rango, extraer páginas seleccionadas o dividir cada página en un PDF individual.
*   **Previsualización:** Previsualización de las páginas seleccionadas para la división.

## 4. Requisitos Técnicos

### 4.1 Arquitectura

*   **Single Page Application (SPA):** La aplicación será una SPA, cargando todos los recursos necesarios una vez y realizando las operaciones dinámicamente.
*   **Client-Side Processing:** Todas las operaciones de manipulación de PDF se ejecutarán en el navegador del usuario, sin necesidad de un backend de procesamiento.

### 4.2 Tecnologías Recomendadas

*   **Frontend Framework:** `React` (o `Vue.js`) para construir la interfaz de usuario, aprovechando su ecosistema y rendimiento.
*   **Gestión de Estado:** `Zustand` o `Jotai` para una gestión de estado ligera y eficiente.
*   **Estilos:** `Tailwind CSS` para un desarrollo rápido y un diseño responsive, combinado con `Headless UI` para componentes accesibles y sin estilo.
*   **Manipulación de PDF:**
    *   `pdf-lib`: Para unir, dividir y modificar PDFs (añadir páginas, incrustar contenido).
    *   `pdf.js` (Mozilla): Para renderizar y visualizar PDFs en el navegador.
    *   `fabric.js`: Para la capa de edición gráfica (anotaciones, formas, firmas) sobre el canvas de `pdf.js`.
*   **Conversión DOCX a PDF:**
    *   `docx-preview`: Para renderizar archivos `.doc` y `.docx` a HTML.
    *   `html2canvas`: Para capturar el HTML renderizado como una imagen (canvas).
    *   `jsPDF`: Para crear un nuevo PDF a partir del canvas generado por `html2canvas`.
*   **Conversión JPG a PDF:**
    *   `jsPDF` o `pdf-lib`: Para incrustar imágenes JPG directamente en un nuevo documento PDF.
*   **Carga de Archivos:** API `FileReader` y eventos `dragover`/`drop` del navegador.

### 4.3 Consideraciones de Rendimiento

*   **Optimización de Activos:** Minimización y compresión de archivos JS/CSS/HTML.
*   **Carga Diferida (Lazy Loading):** Cargar componentes y librerías solo cuando sean necesarios para reducir el tiempo de carga inicial.
*   **Web Workers:** Explorar el uso de Web Workers para operaciones intensivas de PDF y evitar bloquear el hilo principal de la UI.

### 4.4 Seguridad

*   **Sin Servidor:** Al no procesar archivos en el servidor, se eliminan muchas vulnerabilidades de seguridad comunes asociadas con la gestión de archivos en el backend.
*   **Sandboxing del Navegador:** La ejecución en el navegador se beneficia del modelo de seguridad de sandbox del navegador.

## 5. Diseño UX/UI (Sugerencias)

*   **Diseño Minimalista:** Interfaz limpia y sin distracciones, centrada en la funcionalidad.
*   **Flujo Intuitivo:** Pasos claros para cada operación (cargar, procesar, descargar).
*   **Feedback Visual:** Indicadores de carga y progreso para operaciones de larga duración.
*   **Responsive Design:** Adaptabilidad a diferentes tamaños de pantalla (escritorio, tablet, móvil).

## 6. Consideraciones de Despliegue

*   **Hosting:** Hostinger (o cualquier proveedor de hosting estático) para servir los archivos HTML, CSS y JavaScript.
*   **Dominio:** El usuario proporcionará el dominio.
*   **GitHub:** El código fuente se alojará en un repositorio público de GitHub, incluyendo instrucciones claras para la configuración local y el despliegue.

## 7. No-Requisitos

*   **No IA:** La aplicación no utilizará inteligencia artificial para ninguna de sus funcionalidades.
*   **No Costes de Servidor:** No habrá componentes de backend que requieran procesamiento o almacenamiento persistente en el servidor, más allá de la entrega de archivos estáticos.
*   **No Base de Datos:** No se utilizará ninguna base de datos para almacenar información de usuario o archivos.
*   **No Autenticación de Usuario:** No se implementará un sistema de registro o inicio de sesión.

## 8. Referencias

[1] pdf-lib GitHub Repository: [https://github.com/Hopding/pdf-lib](https://github.com/Hopding/pdf-lib)
[2] Mozilla PDF.js: [https://mozilla.github.io/pdf.js/](https://mozilla.github.io/pdf.js/)
[3] Fabric.js: [http://fabricjs.com/](http://fabricjs.com/)
[4] docx-preview GitHub Repository: [https://github.com/VolodymyrBaydalka/docx-preview](https://github.com/VolodymyrBaydalka/docx-preview)
[5] html2canvas GitHub Repository: [https://github.com/niklasvh/html2canvas](https://github.com/niklasvh/html2canvas)
[6] jsPDF GitHub Repository: [https://github.com/parallax/jsPDF](https://github.com/parallax/jsPDF)
[7] React: [https://react.dev/](https://react.dev/)
[8] Tailwind CSS: [https://tailwindcss.com/](https://tailwindcss.com/)
[9] Headless UI: [https://headlessui.com/](https://headlessui.com/)
[10] Zustand: [https://zustand-demo.pmnd.rs/](https://zustand-demo.pmnd.rs/)
[11] Jotai: [https://jotai.org/](https://jotai.org/)
