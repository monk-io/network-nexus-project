import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  bgColorClass?: string; // Optional class for bg color
  textColorClass?: string; // Optional class for text color
}

export function Logo({ 
  className,
  bgColorClass = "text-linkedin-blue", // Default blue background
  textColorClass = "text-white", // Default white text
  ...props 
}: LogoProps) {
  // Use a default viewBox, allow override via props
  const viewBox = props.viewBox || "0 0 24 24";
  // Extract width and height for text positioning if needed, use defaults from className or SVG defaults
  // Basic calculation for font size relative to viewBox
  const fontSize = 14; // Adjust as needed for appearance

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      // Apply default size, allow override via className. Keep fill separate.
      className={cn("w-8 h-8", className)} 
      {...props}
    >
      {/* Background Square - Use fill-current with the color class */}
      <rect
        width="100%"
        height="100%"
        rx="1.5" // Keep rounded corners
        className={cn("fill-current", bgColorClass)}
      />
      {/* Text 'NN' - Use fill-current with the color class */}
      <text
        x="50%"
        y="53%" // Adjusted slightly for better vertical centering
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="bold"
        fontFamily="sans-serif" 
        className={cn("fill-current", textColorClass)}
      >
        NN
      </text>
      {/* Remove old path */}
      {/* <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path> */}
    </svg>
  );
} 