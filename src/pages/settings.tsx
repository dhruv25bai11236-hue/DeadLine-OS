import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Clock, ShieldCheck, User, Check, Sparkles } from 'lucide-react';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Settings() {
  const { user, signOut } = useAuth();
  const [savedToast, setSavedToast] = useState(false);

  // Availability state
  const [startTime, setStartTime] = useState(() => localStorage.getItem('deadlineos_start_time') || '09:00');
  const [endTime, setEndTime] = useState(() => localStorage.getItem('deadlineos_end_time') || '20:00');
  const [selectedDays, setSelectedDays] = useState<string[]>(() => {
    const saved = localStorage.getItem('deadlineos_study_days');
    return saved ? JSON.parse(saved) : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  });

  // Cognitive load settings
  const [maxDailyHours, setMaxDailyHours] = useState(() => Number(localStorage.getItem('deadlineos_max_daily_hours')) || 6);
  const [maxBlockDuration, setMaxBlockDuration] = useState(() => Number(localStorage.getItem('deadlineos_max_block_duration')) || 120);
  const [breakDuration, setBreakDuration] = useState(() => Number(localStorage.getItem('deadlineos_break_duration')) || 15);

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('deadlineos_start_time', startTime);
    localStorage.setItem('deadlineos_end_time', endTime);
    localStorage.setItem('deadlineos_study_days', JSON.stringify(selectedDays));
    localStorage.setItem('deadlineos_max_daily_hours', String(maxDailyHours));
    localStorage.setItem('deadlineos_max_block_duration', String(maxBlockDuration));
    localStorage.setItem('deadlineos_break_duration', String(breakDuration));

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings & Availability</h1>
          <p className="mt-1 text-slate-500">Configure your daily study window, workload pacing, and account safeguards.</p>
        </div>
        {savedToast && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-2 rounded-xl animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Preferences saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Availability Section */}
        <Card className="shadow-sm border-slate-200/80">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-xl">Daily Study Windows</CardTitle>
            </div>
            <CardDescription>The deterministic scheduler will only allocate study blocks inside these hours.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Earliest Study Start Time</Label>
                <Input 
                  id="startTime"
                  type="time" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Latest Study End Time</Label>
                <Input 
                  id="endTime"
                  type="time" 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Active Study Days</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => {
                  const active = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        active
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cognitive Load & Burnout Prevention */}
        <Card className="shadow-sm border-slate-200/80">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <CardTitle className="text-xl">Cognitive Load Capping & Pacing</CardTitle>
            </div>
            <CardDescription>Mathematical constraints to prevent cramming and burnout.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxDailyHours">Max Daily Study Load</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="maxDailyHours"
                    type="number" 
                    min="1" 
                    max="12" 
                    value={maxDailyHours} 
                    onChange={(e) => setMaxDailyHours(Number(e.target.value))} 
                  />
                  <span className="text-xs text-muted-foreground">Hours</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxBlockDuration">Max Study Block</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="maxBlockDuration"
                    type="number" 
                    step="15" 
                    min="30" 
                    max="180" 
                    value={maxBlockDuration} 
                    onChange={(e) => setMaxBlockDuration(Number(e.target.value))} 
                  />
                  <span className="text-xs text-muted-foreground">Minutes</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="breakDuration">Pacing Buffer (Break)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="breakDuration"
                    type="number" 
                    step="5" 
                    min="5" 
                    max="60" 
                    value={breakDuration} 
                    onChange={(e) => setBreakDuration(Number(e.target.value))} 
                  />
                  <span className="text-xs text-muted-foreground">Minutes</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Section */}
        <Card className="shadow-sm border-slate-200/80">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-slate-700" />
              <CardTitle className="text-xl">User Profile</CardTitle>
            </div>
            <CardDescription>Authenticated via Firebase Authentication.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <p className="text-sm font-semibold text-slate-800">{user?.email || 'Logged in user'}</p>
                <p className="text-xs text-muted-foreground">UID: {user?.id || '—'}</p>
              </div>
              <Badge variant="outline" className="bg-white">Active Session</Badge>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => signOut()} className="text-rose-600 border-rose-200 hover:bg-rose-50">
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Save Settings</span>
          </Button>
        </div>
      </form>
    </div>
  );
}