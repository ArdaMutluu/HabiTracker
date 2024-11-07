"use client";;
import { cn } from '../../lib/utils';
import React, { useEffect, useState, useRef } from "react";

const getRandomStartPoint = () => {
  const side = Math.floor(Math.random() * 4); // Randomly select a side (0=top, 1=right, 2=bottom, 3=left)
  const offsetX = Math.random() * window.innerWidth;
  const offsetY = Math.random() * window.innerHeight;

  switch (side) {
    case 0: // Top
      return { x: offsetX, y: 0, angle: Math.random() * 60 + 30 }; // Angle between 30 and 90 degrees
    case 1: // Right
      return { x: window.innerWidth, y: offsetY, angle: Math.random() * 60 + 120 }; // Angle between 120 and 180 degrees
    case 2: // Bottom
      return { x: offsetX, y: window.innerHeight, angle: Math.random() * 60 + 210 }; // Angle between 210 and 270 degrees (shoot upwards)
    case 3: // Left
      return { x: 0, y: offsetY, angle: Math.random() * 60 + 300 }; // Angle between 300 and 360 degrees
    default:
      return { x: offsetX, y: 0, angle: 45 };
  }
};
export const ShootingStars = ({
  minSpeed = 9,
  maxSpeed = 30,
  minDelay = 1100,
  maxDelay = 3500,
  starColor = "#9E00FF",
  trailColor = "#2EB9DF",
  starWidth = 15,
  starHeight = 8,
  className,
}) => {
  const [star, setStar] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const createStar = () => {
      const { x, y, angle } = getRandomStartPoint();
      const newStar = {
        id: Date.now(),
        x,
        y,
        angle,
        scale: 1.5,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
        distance: 0,
      };
      setStar(newStar);

      const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
      setTimeout(createStar, randomDelay);
    };

    createStar();

    return () => {};
  }, [minSpeed, maxSpeed, minDelay, maxDelay]);

  useEffect(() => {
    const moveStar = () => {
      if (star) {
        setStar((prevStar) => {
          if (!prevStar) return null;
          const newX =
            prevStar.x +
            prevStar.speed * Math.cos((prevStar.angle * Math.PI) / 180);
          const newY =
            prevStar.y +
            prevStar.speed * Math.sin((prevStar.angle * Math.PI) / 180);
          const newDistance = prevStar.distance + prevStar.speed;
          const newScale = 1 + newDistance / 100;
          if (
            newX < -20 ||
            newX > window.innerWidth + 20 ||
            newY < -20 ||
            newY > window.innerHeight + 20
          ) {
            return null;
          }
          return {
            ...prevStar,
            x: newX,
            y: newY,
            distance: newDistance,
            scale: newScale,
          };
        });
      }
    };

    const animationFrame = requestAnimationFrame(moveStar);
    return () => cancelAnimationFrame(animationFrame);
  }, [star]);

  return (
    (<svg ref={svgRef} className={cn("w-full h-full absolute inset-0", className)}>
      {star && (
        <rect
          key={star.id}
          x={star.x}
          y={star.y}
          width={starWidth * star.scale}
          height={starHeight}
          fill="url(#gradient)"
          transform={`rotate(${star.angle}, ${
            star.x + (starWidth * star.scale) / 2
          }, ${star.y + starHeight / 2})`} />
      )}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: trailColor, stopOpacity: 0 }} />
          <stop offset="100%" style={{ stopColor: starColor, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>)
  );
};
