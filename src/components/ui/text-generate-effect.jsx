"use client"; 
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "../../lib/utils";

// Custom styles for Fight Club theme
const fightClubStyle = {
  fontFamily: '"Bebas Neue", cursive',
  color: '#FF3D00', // Bright red for text
  textShadow: '3px 3px 6px rgba(0, 0, 0, 0.9)', // Enhanced text shadow
  padding: '20px',
  borderRadius: '8px', // Rounded corners for a softer look
};

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");
  
  useEffect(() => {
    animate("span", {
      opacity: 1,
      filter: filter ? "blur(0px)" : "none",
      translateY: [20, 0], 
    }, {
      duration: duration ? duration : 1,
      delay: stagger(0.1),
    });
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="opacity-0"
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}>
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)} style={fightClubStyle}>
      <div className="mt-4">
        <div className="text-4xl leading-snug tracking-wider"> {/* Increased text size for impact */}
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
