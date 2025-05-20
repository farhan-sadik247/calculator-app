import React from 'react';
import { CalcButton } from './CalcButton';
import { ChevronUp, Percent, Divide, XIcon, Minus, Plus, Equal, Delete, Pi, SquareRadical } from 'lucide-react';

interface KeypadProps {
  onButtonClick: (value: string) => void;
  isRadians: boolean;
}

const buttonsConfig = [
  // Row 1
  { label: 'Rad', value: 'Rad', type: 'special', sr: 'Toggle Rad/Deg Mode' }, // Dynamic label handled below
  { label: 'sin', value: 'sin(', type: 'function', sr: 'Sine function' },
  { label: 'cos', value: 'cos(', type: 'function', sr: 'Cosine function' },
  { label: 'tan', value: 'tan(', type: 'function', sr: 'Tangent function' },
  { label: 'π', value: 'π', type: 'function', icon: <Pi size={20}/>, sr: 'Pi constant' },
  // Row 2
  { label: 'e', value: 'e', type: 'function', sr: 'Euler e constant' },
  { label: 'ln', value: 'ln(', type: 'function', sr: 'Natural Logarithm' },
  { label: 'log', value: 'log(', type: 'function', sr: 'Logarithm base 10' },
  { label: '^', value: '^', type: 'operator', icon: <ChevronUp size={20}/>, sr: 'Power operator' },
  { label: 'sqrt', value: 'sqrt(', type: 'function', icon: <SquareRadical size={20}/>, sr: 'Square Root function' },
  // Row 3
  { label: '(', value: '(', type: 'special', sr: 'Open Parenthesis' },
  { label: ')', value: ')', type: 'special', sr: 'Close Parenthesis' },
  { label: '%', value: '%', type: 'operator', icon: <Percent size={20}/>, sr: 'Percent operator' },
  { label: 'DEL', value: 'DEL', type: 'clear', icon: <Delete size={20}/>, sr: 'Delete last input' },
  { label: 'AC', value: 'AC', type: 'clear', sr: 'All Clear' },
  // Row 4
  { label: '7', value: '7', type: 'number', sr: 'Number 7' },
  { label: '8', value: '8', type: 'number', sr: 'Number 8' },
  { label: '9', value: '9', type: 'number', sr: 'Number 9' },
  { label: '*', value: '*', type: 'operator', icon: <XIcon size={20}/>, sr: 'Multiplication operator' },
  { label: '/', value: '/', type: 'operator', icon: <Divide size={20}/>, sr: 'Division operator' },
  // Row 5
  { label: '4', value: '4', type: 'number', sr: 'Number 4' },
  { label: '5', value: '5', type: 'number', sr: 'Number 5' },
  { label: '6', value: '6', type: 'number', sr: 'Number 6' },
  { label: '+', value: '+', type: 'operator', icon: <Plus size={20}/>, sr: 'Addition operator' },
  { label: '-', value: '-', type: 'operator', icon: <Minus size={20}/>, sr: 'Subtraction operator' },
  // Row 6 (New row with 1, 2, 3)
  { label: '1', value: '1', type: 'number', sr: 'Number 1' },
  { label: '2', value: '2', type: 'number', sr: 'Number 2' },
  { label: '3', value: '3', type: 'number', sr: 'Number 3' },
  { label: '+/-', value: '+/-', type: 'special', sr: 'Toggle sign' },
  { label: '=', value: '=', type: 'equals', icon: <Equal size={20}/>, sr: 'Equals button' },
  // Row 7 (Modified last row)
  { label: '0', value: '0', type: 'number', className: "col-span-3", sr: 'Number 0' },
  { label: '.', value: '.', type: 'number', className: "col-span-2", sr: 'Decimal point' },
];

export function Keypad({ onButtonClick, isRadians }: KeypadProps) {
  const finalButtons = buttonsConfig.map(btn => {
    if (btn.value === 'Rad') { // This button toggles Rad/Deg mode
      return { ...btn, label: isRadians ? 'Rad' : 'Deg', value: isRadians ? 'Rad' : 'Deg' };
    }
    return btn;
  });

  return (
    <div className="grid grid-cols-5 gap-2 mt-4">
      {finalButtons.map((btn, index) => (
        <CalcButton
          key={`${btn.value}-${index}`}
          onClick={() => onButtonClick(btn.value)}
          buttonType={btn.type as any}
          className={btn.className}
          aria-label={btn.sr}
        >
          {btn.icon || btn.label}
        </CalcButton>
      ))}
    </div>
  );
}
