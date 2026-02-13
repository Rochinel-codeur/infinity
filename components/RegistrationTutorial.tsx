"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { getPlatformEmbedUrl, isDirectVideoSource } from "@/lib/video";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface RegistrationTutorialProps {
  videoUrl?: string | null;
}

export function RegistrationTutorial({ videoUrl }: RegistrationTutorialProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const src = videoUrl || "/media/registration-tutorial.mp4";
  const embedUrl = getPlatformEmbedUrl(src);
  
  return (
    <section className="py-[clamp(2.5rem,8vw,6rem)] bg-zinc-950 border-y border-white/5 relative overflow-hidden">
        {/* ... (keep background gradients) */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-3 min-[430px]:px-4 relative z-10">
            <h2 className="section-heading font-serif text-white mb-8 sm:mb-16 text-center">
                Inscription 1xbet <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">simple, claire et rapide</span>
            </h2>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-20 items-center">
                
                {/* Video Column */}
                <div className="order-2 lg:order-1 relative group">
                     {/* Phone Frame Mockup */}
                     <div className="relative mx-auto border-zinc-800 bg-zinc-950 border-[10px] sm:border-[14px] rounded-[1.8rem] sm:rounded-[2.5rem] h-[min(166vw,600px)] w-[min(84vw,300px)] md:h-[660px] md:w-[330px] lg:h-[720px] lg:w-[360px] shadow-xl flex flex-col overflow-hidden ring-1 ring-white/10">
                        {/* Notch */}
                        <div className="h-[32px] w-[3px] bg-zinc-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                        <div className="h-[46px] w-[3px] bg-zinc-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                        <div className="h-[46px] w-[3px] bg-zinc-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                        <div className="h-[64px] w-[3px] bg-zinc-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                        
                        <div className="w-full h-full bg-zinc-900 relative overflow-hidden group/video">
                             <div className="w-full h-full bg-black flex items-center justify-center">
                                {!isPlaying ? (
                                    <div
                                        className="w-full h-full bg-gradient-to-b from-slate-900 to-black flex flex-col items-center justify-center p-4 sm:p-6 relative cursor-pointer group/screen"
                                        onClick={() => setIsPlaying(true)}
                                    >
                                         {/* MOTIFS Pattern */}
                                         <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-5 sm:mb-6 shadow-xl shadow-blue-500/20 flex items-center justify-center transform group-hover/screen:scale-110 transition-transform duration-500">
                                            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                         </div>
                                         <div className="text-center mb-8 relative z-10">
                                             <h3 className="text-white font-bold text-lg sm:text-xl">Tutoriel</h3>
                                             <p className="text-blue-400 text-sm font-medium">Lancer la video</p>
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
                                    ) : isDirectVideoSource(src) ? (
                                        <video
                                            src={src}
                                            className="w-full h-full max-w-full max-h-full object-contain bg-black"
                                            controls
                                            autoPlay
                                            muted
                                            playsInline
                                            preload="metadata"
                                            onError={() => setHasError(true)}
                                        />
                                    ) : embedUrl ? (
                                        <iframe
                                            src={embedUrl}
                                            className="w-full h-full bg-black"
                                            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                            allowFullScreen
                                            title="Tutoriel inscription"
                                            onError={() => setHasError(true)}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-black [&_video]:object-contain [&_video]:bg-black">
                                            <ReactPlayer
                                                src={src}
                                                width="100%"
                                                height="100%"
                                                controls
                                                playing
                                                muted
                                                playsInline
                                                onError={() => setHasError(true)}
                                            />
                                        </div>
                                    )
                                )}
                             </div>
                        </div>
                     </div>
                     
                     {/* Floating Badge */}
                     <div className="hidden sm:flex absolute top-10 -right-4 lg:-right-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-xl animate-float">
                        <span className="text-2xl">⚡</span>
                        <span className="font-bold text-white ml-2">Simple et rapide</span>
                     </div>
                </div>

                {/* Steps Column */}
                <div className="order-1 lg:order-2 space-y-6 sm:space-y-10">
                    <div className="flex gap-4 min-[380px]:gap-6 group">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xl sm:text-2xl text-blue-500 shrink-0 group-hover:scale-110 group-hover:border-blue-500/50 transition-all duration-300 shadow-lg shadow-blue-500/10">
                            1
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors normal-case font-sans">Telechargez l&apos;application 1xbet</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Choisissez votre store et installez l&apos;application officielle. Vous partez sur une base propre, stable et securisee.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 min-[380px]:gap-6 group">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xl sm:text-2xl text-indigo-500 shrink-0 group-hover:scale-110 group-hover:border-indigo-500/50 transition-all duration-300 shadow-lg shadow-indigo-500/10">
                            2
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors normal-case font-sans">Inscription Complète</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Selectionnez l&apos;option <span className="text-white font-semibold">&quot;Inscription Complete&quot;</span>. Votre compte est mieux prepare pour les validations et les retraits.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 min-[380px]:gap-6 group">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-xl sm:text-2xl text-black shrink-0 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-orange-500/20">
                            3
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors normal-case font-sans">Code Promo</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Entrez le code promo certifie pour activer le <span className="text-yellow-400 font-bold">bonus de 200%</span> et demarrer dans les meilleures conditions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
