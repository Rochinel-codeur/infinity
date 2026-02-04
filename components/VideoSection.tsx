"use client";

import { useRef, useState } from "react";
import { testimonials } from "@/data/testimonials";

const VIDEO_SRC = process.env.NEXT_PUBLIC_VIDEO_SRC ?? "/media/demo.mp4";

export function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Take only first 3 testimonials for display below video
  const featuredTestimonials = testimonials.slice(0, 3);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          La Méthode en <span className="text-blue-500">Action</span>
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Regarde comment nos membres valident leurs gains quotidiennement grâce à notre stratégie simple.
        </p>
      </div>

      {/* Video Container */}
      <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-zinc-800 bg-zinc-950 aspect-video mb-16 group">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={VIDEO_SRC}
          loop
          playsInline
          poster="/assets/poster.jpg"
          onClick={togglePlay}
        />
        
        {/* Custom Play Button Overlay */}
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer hover:bg-black/30 transition-all"
            onClick={togglePlay}
          >
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Testimonials Grid Below Video */}
      <div className="grid md:grid-cols-3 gap-6">
        {featuredTestimonials.map((item) => (
          <div key={item.id} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:border-blue-500/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg font-bold text-blue-400">
                {item.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-xs text-zinc-500">{item.date}</p>
              </div>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
              "{item.text}"
            </p>
            <div className="mt-4 flex gap-1">
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
