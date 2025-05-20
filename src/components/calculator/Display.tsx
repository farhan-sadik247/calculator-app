import React from 'react';

interface DisplayProps {
  currentInput: string;
  previousResult: string | null;
}

export function Display({ currentInput, previousResult }: DisplayProps) {
  const displayInput = currentInput || "0";
  const displayResult = previousResult !== null && previousResult !== currentInput ? previousResult : '';
  
  return (
    <div className="bg-muted text-foreground p-4 rounded-lg mb-4 shadow-inner min-h-[110px] text-right flex flex-col justify-between break-all">
      <div className="text-muted-foreground text-xl h-8 overflow-x-auto overflow-y-hidden whitespace-nowrap">
        {displayResult}
      </div>
      <div className="text-4xl md:text-5xl font-mono font-semibold h-14 overflow-x-auto overflow-y-hidden whitespace-nowrap">
        {displayInput}
      </div>
    </div>
  );
}
