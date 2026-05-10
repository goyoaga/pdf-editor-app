import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { ShieldCheck, ArrowLeft, Lock, EyeOff, ServerOff, Database, Mail, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header />
      
      {/* Hero Section for Privacy */}
      <div className="bg-white border-b border-gray-100 py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Link href="/">
              <a className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 mb-6 transition-all group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Volver al editor
              </a>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Tu privacidad es <span className="text-primary italic">sagrada</span> para nosotros.
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Diseñamos FlowPDF bajo la premisa de "Privacidad por Diseño". Todo el procesamiento ocurre en tu navegador, nunca en nuestros servidores.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 -mt-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-6 border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                <ServerOff className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Sin Servidores</h3>
                <p className="text-sm text-gray-500">Tus archivos nunca suben a la nube. Todo el proceso es 100% local.</p>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6 border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                <Lock className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">100% Privado</h3>
                <p className="text-sm text-gray-500">No guardamos logs, no pedimos registros y no tenemos acceso a tus datos.</p>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6 border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                <Database className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Código Abierto</h3>
                <p className="text-sm text-gray-500">Nuestro código es público. Cualquiera puede auditar cómo manejamos los archivos.</p>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <Card className="p-8 md:p-16 border-none shadow-xl shadow-blue-500/5 bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <ShieldCheck className="w-64 h-64 text-primary" />
            </div>

            <div className="prose prose-blue max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900">
              <h2 className="flex items-center gap-3 text-3xl mb-8">
                <span className="w-1.5 h-8 bg-primary rounded-full"></span>
                Compromiso de Transparencia
              </h2>

              <p className="lead text-lg">
                FlowPDF no es solo una herramienta, es una declaración de intenciones. En un mundo donde los datos son la moneda de cambio, 
                nosotros elegimos no tener ninguno.
              </p>

              <h3>1. ¿Qué datos recopilamos?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                  <h4 className="text-red-900 font-bold flex items-center gap-2 mb-4">
                    <EyeOff className="w-5 h-5" /> Lo que NO vemos
                  </h4>
                  <ul className="text-sm space-y-2 text-red-800/80 m-0 list-none p-0">
                    <li className="flex items-center gap-2">❌ El contenido de tus PDFs</li>
                    <li className="flex items-center gap-2">❌ Tus imágenes o documentos</li>
                    <li className="flex items-center gap-2">❌ Tu nombre o correo electrónico</li>
                    <li className="flex items-center gap-2">❌ Tus contraseñas o datos bancarios</li>
                  </ul>
                </div>
                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                  <h4 className="text-blue-900 font-bold flex items-center gap-2 mb-4">
                    <Database className="w-5 h-5" /> Lo que recopilamos
                  </h4>
                  <ul className="text-sm space-y-2 text-blue-800/80 m-0 list-none p-0">
                    <li className="flex items-center gap-2">✅ Logs técnicos anónimos (30 días)</li>
                    <li className="flex items-center gap-2">✅ Analíticas de uso agregadas</li>
                    <li className="flex items-center gap-2">✅ Preferencias de tema (Local)</li>
                  </ul>
                </div>
              </div>

              <h3>2. Procesamiento local (Client-Side)</h3>
              <p>
                La magia de FlowPDF reside en que tu navegador es el motor de edición. Utilizamos librerías como <code>pdf-lib</code> y <code>docx-preview</code> 
                que se ejecutan íntegramente en tu computadora. Cuando terminas de editar, el archivo se guarda directamente en tu disco y la memoria RAM del navegador se limpia.
              </p>

              <h3>3. Analíticas y Seguridad</h3>
              <p>
                Utilizamos <strong>Umami</strong> para analíticas básicas. A diferencia de otros servicios, Umami no utiliza cookies de rastreo y no recolecta información personal identificable. 
                Solo queremos saber cuántas personas usan la herramienta para saber si debemos seguir mejorándola.
              </p>

              <hr className="my-12 border-gray-100" />

              <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 m-0">¿Tienes dudas?</h4>
                    <p className="text-sm text-gray-500 m-0">Escríbenos directamente</p>
                  </div>
                </div>
                <a 
                  href="mailto:hola@arielgoyoaga.com" 
                  className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 group"
                >
                  hola@arielgoyoaga.com
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </Card>

          <footer className="text-center pb-12">
            <p className="text-gray-400 text-sm">
              FlowPDF es un proyecto Open Source distribuido bajo la licencia MIT.<br />
              Hecho con ❤️ por arielgoyoaga.com
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
