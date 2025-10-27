
import React from 'react';

interface KidneyIconProps {
  className?: string;
}

const KidneyIcon: React.FC<KidneyIconProps> = ({ className = "w-16 h-16 text-blue-500" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c-4 0-6 3-6 6 0 2.5 1 4.5 3 5.5s3 1.5 3 1.5-1-2-1-3.5c0-2 2-4 4-4s4 2 4 4c0 1.5-1 3.5-1 3.5s1-.5 3-1.5c2-1 3-3 3-5.5 0-3-2-6-6-6z" />
        <path d="M14.5 17.5c-1.5 1-3.5 1.5-5.5 1.5s-4-.5-5.5-1.5c-1.5-1-2.5-2.5-2.5-4.5 0-1 .5-2 1-2.5" />
        <path d="M9.5 17.5c1.5 1 3.5 1.5 5.5 1.5s4-.5 5.5-1.5c1.5-1 2.5-2.5 2.5-4.5 0-1-.5-2-1-2.5" />
    </svg>
);

export default KidneyIcon;
