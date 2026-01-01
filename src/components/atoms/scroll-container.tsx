import React from "react";

type ScrollContainerProps = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export default function ScrollContainer({ className = "", style, children }: ScrollContainerProps) {
  return (
    <div className={`custom-scrollbar ${className}`} style={style}>
      {children}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.06); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
}
