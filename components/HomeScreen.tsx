import React, { useEffect, useRef } from 'react';

interface HomeScreenProps {
  onEnter: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onEnter }) => {
  const homeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // User is scrolling away from the home screen
          // Use a small timeout to make it feel less abrupt
          setTimeout(() => {
             onEnter();
             observer.disconnect();
          }, 100);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1, // Trigger when 10% of the element is not visible
      }
    );

    const currentRef = homeRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [onEnter]);

  return (
    <div ref={homeRef} className="h-screen w-full flex flex-col justify-center items-center text-center p-4">
      <h1 
        className="text-6xl md:text-8xl font-serif text-brand-text animate-[text-fade-in-up_1s_ease-out]"
        style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}
      >
        Dress to Impress
      </h1>
      <p 
        className="mt-4 text-2xl md:text-4xl text-brand-brown font-script animate-[text-fade-in-up_1s_ease-out]"
        style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}
      >
        Your virtual closet awaits...
      </p>
      <div 
        className="absolute bottom-8 text-brand-text/60 animate-[arrow-bounce_2s_infinite] opacity-0"
        style={{ animationDelay: '1s', animationFillMode: 'forwards' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
};

export default HomeScreen;
