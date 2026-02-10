"use client";

import { WhatsAppScreenshot } from "@/components/WhatsAppScreenshot";

interface Screenshot {
  id: string;
  name: string;
  message: string;
  amount: string;
  time: string;
  type?: string;
  imageUrl?: string | null;
}

interface Testimonial {
  id: string;
  name: string;
  imageUrl?: string | null;
  text: string;
}

interface TestimonialMarqueeProps {
  testimonials?: Testimonial[];
  screenshots?: Screenshot[];
}

export function TestimonialMarquee({ testimonials = [], screenshots = [] }: TestimonialMarqueeProps) {
  const useScreenshots = screenshots && screenshots.length > 0;
  
  // If no data provided at all (neither screenshots nor testimonials), use dummy data
  let displayItems: (Screenshot | Testimonial)[] = [];
  
  if (useScreenshots) {
      displayItems = screenshots;
  } else if (testimonials && testimonials.length > 0) {
      displayItems = testimonials;
  } else {
      displayItems = [
        { id: "d1", name: "Marc André", text: "Merci pour le gain", imageUrl: null },
        { id: "d2", name: "Sophie T.", text: "Validé !", imageUrl: null },
        { id: "d3", name: "Jean Luc", text: "Superbe", imageUrl: null },
        { id: "d4", name: "Fabrice", text: "Encore gagné", imageUrl: null },
      ];
  }

  // Duplicate to ensure smooth infinite scrolling
  const repeatCount = displayItems.length < 5 ? 4 : 2;
  const allItems = Array(repeatCount).fill(displayItems).flat();

  return (
    <div className="w-full overflow-hidden bg-black py-10 relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none" />
      
      <div className="flex animate-scroll hover:pause items-center">
        {allItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex-shrink-0 mx-6 transform transition-transform hover:scale-105 duration-300"
          >
             <WhatsAppScreenshot 
                name={item.name}
                message={useScreenshots ? item.message : item.text}
                imageUrl={item.imageUrl}
                type={(useScreenshots && item.type) ? item.type : (index % 2 === 0 ? "win" : "thanks")}
                amount={useScreenshots ? item.amount : `${((index * 7 + 10) % 50 + 10) * 10000} XAF`}
                time={useScreenshots ? item.time : `${10 + (index % 12)}:${((index * 5) % 60).toString().padStart(2, '0')}`}
             />
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .hover\:pause:hover {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
