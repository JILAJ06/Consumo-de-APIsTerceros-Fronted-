"use client";

import { useState, useEffect } from "react";
// Importamos las interfaces (asegúrate de que los archivos existen en src/app/interfaces/)
import { Character } from "./interfaces/character";
import { Spell } from "./interfaces/spell";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("characters");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3001/api/hp/${activeTab}`);
        if (!response.ok) throw new Error("Error en la red o servidor caído");
        const result = await response.json();
        setData(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  // Colores de borde y acento para los retratos según la casa
  const getHouseAccent = (house: string) => {
    switch (house?.toLowerCase()) {
      case 'gryffindor': return 'border-red-600 shadow-red-900/50';
      case 'slytherin': return 'border-green-600 shadow-green-900/50';
      case 'ravenclaw': return 'border-blue-600 shadow-blue-900/50';
      case 'hufflepuff': return 'border-yellow-500 shadow-yellow-700/50';
      default: return 'border-slate-500 shadow-slate-700/50';
    }
  };

  // Nombres de los filtros
  const tabs = [
    { id: "characters", label: "Todos" },
    { id: "students", label: "Estudiantes" },
    { id: "staff", label: "Profesores" },
    { id: "spells", label: "Hechizos" }
  ];

  return (
    <main className="min-h-screen bg-[#0a0f1d] p-4 sm:p-8 md:p-12 text-slate-200 font-sans">
      {/* Fondo decorativo sutil */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-dotted.png')]"></div>

      {/* CABECERA Y MENÚ (Contenedor flotante) */}
      <header className="max-w-7xl mx-auto mb-16 relative z-10 bg-slate-900/80 backdrop-blur-lg p-6 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
              Expedientes Mágicos
            </h1>
            <p className="text-slate-400 mt-1">Base de datos de la comunidad mágica (SOA Desacoplada)</p>
          </div>
          
          {/* Menú de Navegación Estilo Pastilla */}
          <nav className="flex flex-wrap gap-2 bg-slate-800/50 p-1.5 rounded-full border border-slate-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id 
                    ? "bg-amber-500 text-slate-950 shadow-md" 
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ESTADOS DE CARGA Y ERROR */}
      {loading && (
        <div className="flex justify-center items-center py-24 text-amber-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
          <span className="ml-4 text-lg font-medium">Leyendo pergaminos...</span>
        </div>
      )}

      {error && (
        <div className="max-w-xl mx-auto text-center py-16 bg-red-950/30 border border-red-800 rounded-3xl p-8">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-300 mb-2">Error de Conexión</h2>
          <p className="text-red-200/80 mb-6">{error}</p>
          <p className="text-sm text-slate-500">Asegúrate de que tu Backend (Puerto 3001) esté corriendo y que la API de HP esté online.</p>
        </div>
      )}

      {/* GRID DE RESULTADOS (Diseño Nuevo) */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
          {data.slice(0, 24).map((item: any) => (
            <div key={item.id} className="group transition-all duration-300 hover:-translate-y-2">
              
              {/* DISEÑO 1: CARD DE HECHIZOS (Estilo Libro de Encantamientos) */}
              {activeTab === "spells" ? (
                <div className="bg-[#1a1625] h-full p-8 rounded-t-lg rounded-br-[40px] rounded-bl-lg border border-slate-800 flex flex-col items-center text-center shadow-lg group-hover:shadow-amber-900/30 group-hover:border-amber-700/50 transition-all">
                  <div className="text-4xl text-amber-600 mb-5 transition-transform group-hover:scale-110">✨</div>
                  <h3 className="text-2xl font-bold text-amber-100 tracking-tight mb-3 group-hover:text-amber-400">{item.name}</h3>
                  <div className="w-16 h-0.5 bg-slate-700 mb-5"></div>
                  <p className="text-slate-400 text-sm leading-relaxed italic flex-1 flex items-center">{item.description || "Efecto desconocido. Proceder con precaución."}</p>
                </div>
              ) : (
                /* DISEÑO 2: CARD DE PERSONAJES (Estilo Retrato/Ficha del Ministerio) */
                <div className="bg-slate-900 h-full rounded-2xl border border-slate-800 p-6 flex flex-col shadow-xl group-hover:border-slate-600 transition-all overflow-hidden relative">
                  
                  {/* Fondo decorativo sutil en la tarjeta */}
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')]"></div>

                  {/* 1. SECCIÓN RETRATO (Solución a pixelado) */}
                  <div className="flex justify-center mb-6 relative z-10">
                    <div className={`relative w-36 h-36 rounded-full border-4 ${getHouseAccent(item.house)} p-1 shadow-lg bg-slate-800 overflow-hidden`}>
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          // object-contain evita el estiramiento, y h-full w-full dentro del círculo pequeño agrupa los píxeles
                          className="w-full h-full object-cover object-top rounded-full transition-transform duration-500 group-hover:scale-110" 
                        />
                      ) : (
                        // Placeholder si no hay imagen
                        <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center text-5xl opacity-30">👤</div>
                      )}
                    </div>
                  </div>

                  {/* 2. DATOS DEL PERSONAJE */}
                  <div className="text-center flex-1 flex flex-col relative z-10">
                    <h3 className="text-xl font-extrabold text-white leading-tight mb-1 group-hover:text-amber-300">
                      {item.name}
                    </h3>
                    
                    {/* Casa (Badge elegante) */}
                    <p className={`text-xs font-bold uppercase tracking-widest mt-1 mb-4 inline-block px-3 py-0.5 rounded-full border ${getHouseAccent(item.house)} bg-slate-800`}>
                      {item.house || 'Sin Casa'}
                    </p>
                    
                    {/* Detalles (Simulando líneas de expediente) */}
                    <div className="mt-auto space-y-2 text-sm text-slate-400 border-t border-slate-800/50 pt-4">
                      <p className="flex justify-between items-center bg-slate-800/50 px-3 py-1 rounded-md">
                        <span className="text-slate-500 text-xs font-medium uppercase">Actor:</span> 
                        <span className="font-medium text-slate-200">{item.actor || 'N/A'}</span>
                      </p>
                      <p className="flex justify-between items-center bg-slate-800/50 px-3 py-1 rounded-md">
                        <span className="text-slate-500 text-xs font-medium uppercase">Especie:</span> 
                        <span className="font-medium text-slate-200 capitalize">{item.species || 'N/A'}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* FOOTER SIMPLE */}
      <footer className="max-w-7xl mx-auto mt-20 text-center text-slate-600 text-xs border-t border-slate-900 pt-8">
        Alexander Jiménez | Matrícula 243713 | UP Chiapas | SOA strictly decoupled
      </footer>
    </main>
  );
}