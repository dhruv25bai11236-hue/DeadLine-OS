import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export default function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleStop();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const handleStop = useCallback(() => {
    setIsActive(false);
    
    // Mock saving study session
    const timeSpent = 25 * 60 - timeLeft;
    if (timeSpent > 60) {
      console.log(`Saved study session: ${Math.floor(timeSpent / 60)} minutes`);
      setSessionCount(prev => prev + 1);
    }
    
    setTimeLeft(25 * 60);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-sm mx-auto shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold text-primary">Focus Timer</CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center py-6">
        <div className="text-6xl font-mono tracking-wider font-bold mb-8">
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex space-x-4">
          <Button
            size="lg"
            variant={isActive ? "outline" : "default"}
            onClick={toggleTimer}
            className="w-24 rounded-full"
          >
            {isActive ? (
              <><Pause className="w-5 h-5 mr-2" /> Pause</>
            ) : (
              <><Play className="w-5 h-5 mr-2" /> Start</>
            )}
          </Button>
          
          <Button
            size="lg"
            variant="destructive"
            onClick={handleStop}
            className="w-24 rounded-full"
            disabled={timeLeft === 25 * 60 && !isActive}
          >
            <Square className="w-5 h-5 mr-2" /> Stop
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="justify-center text-sm text-muted-foreground border-t pt-4">
        Completed sessions today: <span className="font-bold text-foreground ml-1">{sessionCount}</span>
      </CardFooter>
    </Card>
  );
}
