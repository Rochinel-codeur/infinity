"use client";

import { useState } from "react";

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string | null;
}

interface Testimonial {
  id: string;
  name: string;
  text: string;
  date: string | Date;
  imageUrl?: string | null;
}

interface VideoSectionProps {
  videos?: Video[];
  testimonials?: Testimonial[];
}

import dynamic from "next/dynamic";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactPlayer: any = dynamic(() => import("react-player"), { ssr: false });

// Internal Video Card Component
// Internal Video Card Component
// Internal Video Card Component
function VideoCard({ video, spanFull }: { video: Video; spanFull?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Helper to extract ID for thumbnail fallback
  const getYTId = (url: string) => {
    try {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    } catch(e: unknown) { console.error(e); return null; }
  };

  const ytId = getYTId(video.url);
  // Initial thumb
  const initialThumb = video.thumbnailUrl || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : "/assets/poster.jpg");
  const [thumbSrc, setThumbSrc] = useState(initialThumb);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-zinc-800 bg-zinc-950 group ${spanFull ? 'aspect-video' : 'aspect-[4/3] md:aspect-video'}`}>
        {!isPlaying ? (
            <div className="absolute inset-0 z-10 w-full h-full cursor-pointer" onClick={() => setIsPlaying(true)}>
               <img 
                 src={thumbSrc} 
                 alt={video.title} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                 onError={() => {
                    // Fallback to poster if current thumb fails (e.g. broken link or 404)
                    if (thumbSrc !== "/assets/poster.jpg") setThumbSrc("/assets/poster.jpg");
                 }}
               />
               <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm hover:bg-black/30 transition-all">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                      </svg>
                  </div>
               </div>
            </div>
        ) : (
            <div className="w-full h-full bg-black relative">
                {hasError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-zinc-400 p-4 text-center">
                        <svg className="w-12 h-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <p className="text-sm font-medium">Vidéo indisponible</p>
                        <p className="text-xs opacity-70 mt-1">Le fichier source est inaccessible</p>
                        <button onClick={() => setIsPlaying(false)} className="mt-4 px-4 py-2 bg-zinc-800 rounded-lg text-xs hover:bg-zinc-700">Retour</button>
                    </div>
                ) : (
                    <ReactPlayer
                        url={video.url}
                        width="100%"
                        height="100%"
                        controls={true}
                        playing={true}
                        muted={true}
                        playsinline={true}
                        onError={(e: unknown) => {
                            console.error("Video Error:", e);
                            setHasError(true);
                        }}
                        config={{
                            youtube: { playerVars: { showinfo: 1, autoplay: 1, mute: 1 } },
                        }}
                    />
                )}
            </div>
        )}
    </div>
  );
}

export function VideoSection({ videos = [], testimonials = [] }: VideoSectionProps) {
  // ... (Layout logic remains same)
  const getVideoLayout = () => {
    if (videos.length === 0) return "";
    if (videos.length === 1) return "flex justify-center";
    if (videos.length === 2) return "grid grid-cols-1 md:grid-cols-2 gap-8";
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
  };

  // No limit on testimonials, allow grid to wrap
  const displayTestimonials = testimonials;
  
  const getTestimonialLayout = () => {
     if (displayTestimonials.length === 0) return "";
     if (displayTestimonials.length === 1) return "flex justify-center";
     if (displayTestimonials.length === 2) return "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto";
     return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
  };

  if (!videos || videos.length === 0) return null;

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      {/* ... Video Title and Grid ... */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Comment S&apos;inscrire & <span className="text-blue-500">Gagner</span>
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Suivez le guide vidéo pour créer votre compte et découvrez comment nos membres valident leurs gains.
        </p>
      </div>

      <div className={`mb-24 ${getVideoLayout()}`}>
        {videos.map((video) => (
            <div key={video.id} className={videos.length === 1 ? "w-full max-w-4xl" : "w-full"}>
                <VideoCard video={video} spanFull={videos.length === 1} />
                <h3 className="mt-4 text-xl font-bold text-white text-center">{video.title}</h3>
            </div>
        ))}
      </div>

      {/* Testimonials Header */}
      <div className="text-center mt-32 mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Retours d&apos;Expérience <span className="text-blue-500">Vérifiés</span>
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          La satisfaction de nos membres est notre priorité absolue. Découvrez leurs avis.
        </p>
      </div>

      {/* Adaptive Testimonials Grid */}
      <div className={getTestimonialLayout()}>
        {displayTestimonials.map((item) => (
          <div key={item.id} className={`flex flex-col bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:border-blue-500/30 transition-colors shadow-lg ${displayTestimonials.length === 1 ? "max-w-xl w-full" : ""}`}>
            {/* Header: Avatar + Info */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-500/20 flex-shrink-0">
                {item.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-white text-lg leading-tight">{item.name}</p>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                    <span>{item.date instanceof Date ? item.date.toLocaleDateString() : item.date}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span className="text-blue-400 font-medium uppercase tracking-wider text-[10px]">Vérifié</span>
                </div>
              </div>
            </div>

            {/* Image Proof (if exists) */}
            {item.imageUrl && (
                <div className="mb-4 rounded-xl overflow-hidden border border-zinc-800 bg-black aspect-video relative group cursor-pointer">
                    <img 
                        src={item.imageUrl} 
                        alt="Preuve de gain" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm transition-opacity">
                            Voir la preuve
                        </span>
                    </div>
                </div>
            )}
            
            {/* Text Content */}
            <div className="relative flex-grow">
                <p className="text-zinc-300 text-sm leading-relaxed italic pl-2 border-l-2 border-blue-500/30">
                &quot;{item.text}&quot;
                </p>
            </div>
            
            {/* Stars */}
            <div className="mt-4 flex gap-1 justify-end opacity-80 pt-4 border-t border-white/5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
