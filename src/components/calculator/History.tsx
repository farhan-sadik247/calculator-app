import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface HistoryEntry {
  expression: string;
  result: string;
}

interface HistoryProps {
  history: HistoryEntry[];
  onHistoryItemClick: (expression: string) => void;
  onClose: () => void;
}

export function History({ history, onHistoryItemClick, onClose }: HistoryProps) {
  return (
    <div className="absolute inset-0 bg-background/80 dark:bg-background/90 backdrop-blur-sm z-10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl max-h-[80vh] flex flex-col bg-card text-card-foreground">
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-card z-10 border-b">
          <CardTitle>Calculation History</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close history">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full p-4">
            {history.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No history yet.</p>
            ) : (
              <ul className="space-y-2">
                {history.map((entry, index) => (
                  <li key={index}>
                    <Button
                      variant="ghost"
                      className="w-full h-auto text-left p-3 rounded-md hover:bg-muted flex flex-col items-start"
                      onClick={() => onHistoryItemClick(entry.expression)}
                      aria-label={`Recall expression: ${entry.expression}`}
                    >
                      <span className="text-sm text-muted-foreground break-all">{entry.expression}</span>
                      <span className="text-lg font-semibold text-foreground break-all">= {entry.result}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </CardContent>
         <CardFooter className="border-t sticky bottom-0 bg-card z-10">
            <CardDescription>Click an entry to reuse the expression.</CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
