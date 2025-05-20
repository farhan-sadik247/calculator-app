"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Display } from './Display';
import { Keypad } from './Keypad';
import { History } from './History';
import { evaluateExpression } from '@/lib/mathEvaluator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HistoryIcon, Moon, Sun, Loader2 } from 'lucide-react';

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
  
  const [mounted, setMounted] = useState(false);
  const [effectiveTheme, setEffectiveTheme] = useState('light'); // Default to light for SSR

  useEffect(() => {
    setMounted(true); // Component is mounted on the client
    const isDark = document.documentElement.classList.contains('dark');
    setEffectiveTheme(isDark ? 'dark' : 'light');
    
    // Load history from localStorage
    const storedHistory = localStorage.getItem('calculatorHistory');
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (error) {
        console.error("Failed to parse history from localStorage", error);
        localStorage.removeItem('calculatorHistory'); // Clear corrupted history
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) { // Only save to localStorage on client and after initial load
      localStorage.setItem('calculatorHistory', JSON.stringify(history));
    }
  }, [history, mounted]);


  const toggleTheme = () => {
    if (!mounted) return;
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
      const match = prev.match(/(.*?)(-?\d*\.?\d+)$/);
      if (match) {
        const prefix = match[1];
        let lastNumStr = match[2];
        if (lastNumStr.startsWith('-')) {
          lastNumStr = lastNumStr.substring(1);
        } else {
          lastNumStr = '-' + lastNumStr;
        }
        return prefix + lastNumStr;
      }
      if (/^-?\d*\.?\d+$/.test(prev)) {
        return (parseFloat(prev) * -1).toString();
      }
      return prev;
    });
  };


  const handleEquals = () => {
    if (currentInput.trim() === '') return;
    const exprToEvaluate = currentInput;
    const result = evaluateExpression(exprToEvaluate, isRadians);
    setLastResult(result);
    if (result !== 'Error' && result !== 'Infinity' && result !== '-Infinity' && result !== 'Error: NaN' && result !== 'Error: Math domain' && result !== 'Error: Syntax' && result !== 'Error: Invalid chars' && result !== 'Error: Non-finite' && result !== 'Error: Invalid result type') {
      setHistory(prev => [{ expression: exprToEvaluate, result }, ...prev].slice(0, 20));
      setCurrentInput(result);
    } else {
      setCurrentInput(result); 
    }
  };

  const handleButtonClick = useCallback((value: string) => {
    const isOperator = (val: string) => ['+', '-', '*', '/', '^'].includes(val);
    const isFunction = (val: string) => val.endsWith('(');

    if (currentInput === 'Error' || currentInput.startsWith('Error:') || currentInput === 'Infinity' || currentInput === '-Infinity') {
        if (!isOperator(value) && value !== '=') { 
            setCurrentInput(value === '+/-' ? '' : value);
            setLastResult(null);
            return;
        } else if (currentInput === 'Error' || currentInput.startsWith('Error:')) {
             setCurrentInput(lastResult && !lastResult.startsWith('Error:') && lastResult !== 'Infinity' && lastResult !== '-Infinity' ? lastResult : '');
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
      case 'Rad': 
      case 'Deg': 
        setIsRadians(prev => !prev);
        break;
      case '+/-':
        handleToggleSign();
        break;
      case '%':
        setCurrentInput(prev => prev + '/100');
        break;
      default: 
        if (lastResult && currentInput === lastResult && !isOperator(value) && !isFunction(value) && value !== '.') {
          setCurrentInput(value);
        } else {
          setCurrentInput(prev => prev + value);
        }
        setLastResult(null); // Clear last result when new input is added
    }
  }, [currentInput, lastResult, isRadians, handleEquals, handleClear, handleBackspace, handleToggleSign]);


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
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle Theme" disabled={!mounted}>
              {mounted ? (effectiveTheme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />) : <Loader2 className="h-5 w-5 animate-spin" /> }
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
