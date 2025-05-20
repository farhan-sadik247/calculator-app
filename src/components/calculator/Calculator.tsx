"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Display } from './Display';
import { Keypad } from './Keypad';
import { History } from './History';
import { evaluateExpression } from '@/lib/mathEvaluator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HistoryIcon, Moon, Sun } from 'lucide-react';

type HistoryEntry = {
  expression: string;
  result: string;
};

export function Calculator() {
  const [currentInput, setCurrentInput] = useState<string>('');
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isRadians, setIsRadians] = useState<boolean>(true);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  
  const [effectiveTheme, setEffectiveTheme] = useState('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setEffectiveTheme(isDark ? 'dark' : 'light');
    
    // Load history from localStorage
    const storedHistory = localStorage.getItem('calculatorHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    // Save history to localStorage
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
  }, [history]);


  const toggleTheme = () => {
    const newTheme = effectiveTheme === 'light' ? 'dark' : 'light';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setEffectiveTheme(newTheme);
  };

  const handleClear = () => {
    setCurrentInput('');
    setLastResult(null);
  };

  const handleBackspace = () => {
    setCurrentInput(prev => prev.slice(0, -1));
  };
  
  const handleToggleSign = () => {
    setCurrentInput(prev => {
      // This regex tries to find the last number, possibly preceded by an operator
      const match = prev.match(/(.*?)(-?\d*\.?\d+)$/);
      if (match) {
        const prefix = match[1];
        let lastNumStr = match[2];
        if (lastNumStr.startsWith('-')) {
          lastNumStr = lastNumStr.substring(1); // -N -> N
        } else {
          lastNumStr = '-' + lastNumStr; // N -> -N
        }
        return prefix + lastNumStr;
      }
      // If input is just a number
      if (/^-?\d*\.?\d+$/.test(prev)) {
        return (parseFloat(prev) * -1).toString();
      }
      return prev; // No change if not a clear number at the end
    });
  };


  const handleEquals = () => {
    if (currentInput.trim() === '') return;
    const exprToEvaluate = currentInput;
    const result = evaluateExpression(exprToEvaluate, isRadians);
    setLastResult(result);
    if (result !== 'Error' && result !== 'Infinity' && result !== '-Infinity') {
      setHistory(prev => [{ expression: exprToEvaluate, result }, ...prev].slice(0, 20));
      setCurrentInput(result);
    } else {
      setCurrentInput(result); // Display Error, Infinity, or -Infinity
    }
  };

  const handleButtonClick = useCallback((value: string) => {
    const isOperator = (val: string) => ['+', '-', '*', '/', '^'].includes(val);
    const isFunction = (val: string) => val.endsWith('('); // e.g. "sin("

    if (currentInput === 'Error' || currentInput === 'Infinity' || currentInput === '-Infinity') {
        if (!isOperator(value) && value !== '=') { // Start new input if not an operator or equals
            setCurrentInput(value === '+/-' ? '' : value); // +/- on error state is tricky, clear first
            setLastResult(null);
            return;
        } else if (currentInput === 'Error') {
             setCurrentInput(''); // Clear error only if operator is pressed
        }
    }
    
    switch (value) {
      case '=':
        handleEquals();
        break;
      case 'AC':
        handleClear();
        break;
      case 'DEL':
        handleBackspace();
        break;
      case 'Rad': // Button shows "Rad", means currently isRadians=true, toggle to Deg
      case 'Deg': // Button shows "Deg", means currently isRadians=false, toggle to Rad
        setIsRadians(prev => !prev);
        break;
      case '+/-':
        handleToggleSign();
        break;
      case '%':
         // Appends '/100' to the current number, or if expression, to whole expression
         // More sophisticated % might apply to last number: 100+50% -> 100 + 50/100*100
         // For now, simple append.
        setCurrentInput(prev => prev + '/100');
        break;
      default: // Numbers, operators, functions like sin(
        // If previous was result, and new is number/function not operator, clear currentInput
        if (lastResult && currentInput === lastResult && !isOperator(value) && !isFunction(value) && value !== '.') {
          setCurrentInput(value);
        } else {
          setCurrentInput(prev => prev + value);
        }
    }
  }, [currentInput, lastResult, isRadians]);


  const handleHistoryItemClick = (expression: string) => {
    setCurrentInput(expression);
    setShowHistory(false);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl rounded-xl overflow-hidden bg-card">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-primary">ReactCalc</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setShowHistory(s => !s)} aria-label="Toggle History">
              <HistoryIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle Theme">
              {effectiveTheme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Display currentInput={currentInput} previousResult={lastResult} />
        <Keypad onButtonClick={handleButtonClick} isRadians={isRadians} />
        {showHistory && (
          <History history={history} onHistoryItemClick={handleHistoryItemClick} onClose={() => setShowHistory(false)}/>
        )}
      </CardContent>
    </Card>
  );
}
