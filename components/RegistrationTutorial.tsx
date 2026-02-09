"use client";

import { useState } from "react";

interface RegistrationTutorialProps {
  videoUrl?: string | null;
  videoThumbnail?: string | null;
}

import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as unknown as React.ComponentType<any>;

export function RegistrationTutorial({ videoUrl, videoThumbnail }: RegistrationTutorialProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const src = videoUrl || "/media/registration-tutorial.mp4";
  
  return (
    <section className="py-24 bg-zinc-950 border-y border-white/5 relative overflow-hidden">
        {/* ... (keep background gradients) */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-16 text-center leading-tight">
                Comment s'inscrire <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">étape par étape</span>
            </h2>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                
                {/* Video Column */}
                <div className="order-2 lg:order-1 relative group">
                     {/* Phone Frame Mockup */}
                     <div className="relative mx-auto border-zinc-800 bg-zinc-950 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl flex flex-col overflow-hidden ring-1 ring-white/10">
                        {/* Notch */}
                        <div className="h-[32px] w-[3px] bg-zinc-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                        <div className="h-[46px] w-[3px] bg-zinc-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                        <div className="h-[46px] w-[3px] bg-zinc-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                        <div className="h-[64px] w-[3px] bg-zinc-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                        
                        <div className="w-full h-full bg-zinc-900 relative overflow-hidden group/video">
                             <div className="w-full h-full bg-black">
                                {!isPlaying ? (
                                    <div 
                                        className="w-full h-full bg-gradient-to-b from-slate-900 to-black flex flex-col items-center justify-center p-6 relative cursor-pointer group/screen"
                                        onClick={() => setIsPlaying(true)}
                                    >
                                         {/* MOTIFS Pattern */}
                                         <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-xl shadow-blue-500/20 flex items-center justify-center transform group-hover/screen:scale-110 transition-transform duration-500">
                                            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                         </div>
                                         <div className="text-center mb-8 relative z-10">
                                             <h3 className="text-white font-bold text-xl">Tutoriel</h3>
                                             <p className="text-blue-400 text-sm font-medium">Lancer la vidéo</p>
                                         </div>
                                         {/* Fake App Bars (Abstract UI) */}
                                         <div className="w-full space-y-4 opacity-30 blur-[1px]">
                                            <div className="h-12 w-full bg-zinc-800 rounded-xl flex items-center px-4 gap-3">
                                               <div className="w-8 h-8 rounded-full bg-zinc-700"></div>
                                               <div className="h-2 w-20 bg-zinc-700 rounded-full"></div>
                                            </div>
                                            <div className="h-12 w-full bg-zinc-800 rounded-xl flex items-center px-4 gap-3">
                                               <div className="w-8 h-8 rounded-full bg-zinc-700"></div>
                                               <div className="h-2 w-24 bg-zinc-700 rounded-full"></div>
                                            </div>
                                         </div>
                                         
                                         {/* Play Overlay */}
                                         <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/screen:bg-black/20 transition-all">
                                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl opacity-0 group-hover/screen:opacity-100 transform translate-y-4 group-hover/screen:translate-y-0 transition-all duration-300">
                                                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                            </div>
                                         </div>
                                    </div>
                                ) : (
                                    hasError ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-400 p-4 text-center">
                                            <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            <p className="text-sm font-medium">Non disponible</p>
                                            <button onClick={() => setIsPlaying(false)} className="mt-4 px-3 py-1 bg-zinc-800 rounded text-xs hover:bg-zinc-700">Retour</button>
                                        </div>
                                    ) : (
                                        <ReactPlayer 
                                            url={src} 
                                            width="100%" 
                                            height="100%" 
                                            controls 
                                            playing={true} 
                                            muted={true}
                                            onError={() => setHasError(true)}
                                            config={{
                                                youtube: { playerVars: { showinfo: 1, autoplay: 1, mute: 1 } },
                                            }}
                                        />
                                    )
                                )}
                             </div>
                        </div>
                     </div>
                     
                     {/* Floating Badge */}
                     <div className="absolute top-10 -right-4 lg:-right-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-xl animate-float">
                        <span className="text-2xl">⚡</span>
                        <span className="font-bold text-white ml-2">Simple & Rapide</span>
                     </div>
                </div>

                {/* Steps Column */}
                <div className="order-1 lg:order-2 space-y-10">
                    <div className="flex gap-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-2xl text-blue-500 shrink-0 group-hover:scale-110 group-hover:border-blue-500/50 transition-all duration-300 shadow-lg shadow-blue-500/10">
                            1
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Téléchargez l'app 1xBet</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Utilisez les boutons officiels ci-dessous pour télécharger la version sécurisée (iOS ou Android).
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-2xl text-indigo-500 shrink-0 group-hover:scale-110 group-hover:border-indigo-500/50 transition-all duration-300 shadow-lg shadow-indigo-500/10">
                            2
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">Inscription Complète</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Choisissez l'option <span className="text-white font-semibold">"Inscription Complète"</span>. C'est crucial pour valider votre compte et retirer vos gains sans blocage.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-2xl text-black shrink-0 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-orange-500/20">
                            3
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">Code Promo</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Insérez le code promo certifié pour activer le <span className="text-yellow-400 font-bold">Bonus de 200%</span> sur votre premier dépôt.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
