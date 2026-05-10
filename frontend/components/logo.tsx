export function SentinelLogo({ className = "w-8 h-8 text-red-500" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`${className} animate-pulse`}
    >
      {/* The Shield */}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="text-slate-700 dark:text-slate-300" />
      {/* The SRE Pulse */}
      <path d="M7 12h2l1.5-3 3 6 1.5-3h2" className="text-red-500" />
    </svg>
  );
}
