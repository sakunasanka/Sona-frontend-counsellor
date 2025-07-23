import React from 'react';

interface GlassCardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

const GlassCard: React.FC<GlassCardProps> = ({ title, children, className = '' }) => (
  <div
    className={`
      p-4 
      rounded-2xl 
      shadow-lg 
      bg-pink-800/30
      backdrop-blur-md 
      border 
      border border-pink-200/20
      text-gray-800
      ${className}
    `}
  >
    {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
    {children}
  </div>
);

export default GlassCard;
