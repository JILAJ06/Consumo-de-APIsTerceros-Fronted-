"use client";

import { useState, useEffect } from "react";
import { Character } from "./interfaces/character";

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/hp/characters");
        if (!response.ok) throw new Error("Error en la red o servidor caído");
        const result = await response.json();
        setCharacters(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  const getHouseColor = (house: string) => {
    switch (house.toLowerCase()) {
      case 'gryffindor': return 'bg-red-900/80 text-red-200 border-red-500/50';
      case 'slytherin': return 'bg-green-900/80 text-green-200 border-green-500/50';
      case 'ravenclaw': return 'bg-blue-900/80 text-blue-200 border-blue-500/50';
      case 'hufflepuff': return 'bg-yellow-600/80 text-yellow-100 border-yellow-400/50';
      default: return 'bg-gray-700/80 text-gray-200 border-gray-500/50';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#0f172a] text-amber-500">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-t-2 border-amber-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-amber-300 animate-spin flex items-center justify-center">
             <span className="text-2xl">✨</span>
          </div>
        </div>
        <p className="mt-6 text-xl font-serif tracking-widest text-amber-400/80 animate-pulse">Consultando el archivo mágico...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0f172a] p-4">
        <div className="bg-red-950/50 backdrop-blur-md border-l-4 border-red-500 p-8 rounded-r-xl max-w-lg shadow-[0_0_40px_rgba(239,68,68,0.1)] text-center">
          <div className="text-4xl mb-4">📜🔥</div>
          <h2 className="text-2xl font-bold mb-2 text-red-400">El hechizo rebotó</h2>
          <p className="text-red-200/80">{error}</p>
          <p className="text-sm mt-6 text-gray-500">Verifica que tu capa de servicios (Puerto 3001) esté activa.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black p-8 sm:p-12 text-white">
      
      {/* Cabecera */}
      <div className="max-w-7xl mx-auto text-center mb-16 pt-8">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-sm mb-4">
          Directorio Mágico
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Consumo de API estrictamente desacoplada mediante capa de servicios.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {characters.slice(0, 16).map((char) => (
          <div 
            key={char.id} 
            className="group relative bg-slate-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.3)] flex flex-col"
          >
            <div className="relative h-72 overflow-hidden bg-slate-900/50 flex items-center justify-center">
              {char.image ? (
                <img 
                  src={char.image} 
                  alt={char.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              ) : (
                <div className="text-6xl opacity-20 group-hover:scale-110 transition-transform duration-700">🧙‍♂️</div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border backdrop-blur-md ${getHouseColor(char.house)}`}>
                  {char.house || 'Desconocida'}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between relative z-10 bg-gradient-to-b from-slate-900 to-slate-800/90">
              <div>
                <h2 className="text-xl font-bold text-amber-50 mb-1 group-hover:text-amber-400 transition-colors">
                  {char.name}
                </h2>
                <p className="text-sm text-slate-400 mb-4 flex items-center gap-2">
                  <span className="text-amber-600/80">Actor:</span> {char.actor || 'No registrado'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}