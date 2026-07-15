import React, { useState, useEffect, useRef, useCallback } from 'react';

const PRESETS = [
  { label: 'Focus', minutes: 25 },
  { label: 'Short Break', minutes: 5 },
  { label: 'Long Break', minutes: 15 },
];

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [customMinutes, setCustomMinutes] = useState('25');
  const [activePreset, setActivePreset] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = minutes * 60 + seconds;
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const fullDuration = (PRESETS[activePreset]?.minutes || customMinutes) * 60;

  const tick = useCallback(() => {
    setSeconds((prev) => {
      if (prev > 0) return prev - 1;
      if (minutes > 0) {
        setMinutes((m) => m - 1);
        return 59;
      }
      // Timer complete
      clearInterval(intervalRef.current!);
      intervalRef.current = null;
      setIsRunning(false);
      setIsPaused(false);
      setSessions((s) => s + 1);
      return 0;
    });
  }, [minutes]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(tick, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused, tick]);

  const start = () => {
    if (minutes === 0 && seconds === 0) {
      reset();
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  const reset = () => {
    clearInterval(intervalRef.current!);
    intervalRef.current = null;
    setIsRunning(false);
    setIsPaused(false);
    if (activePreset !== null) {
      setMinutes(PRESETS[activePreset].minutes);
    } else {
      setMinutes(parseInt(customMinutes) || 25);
    }
    setSeconds(0);
  };

  const selectPreset = (index: number) => {
    clearInterval(intervalRef.current!);
    intervalRef.current = null;
    setIsRunning(false);
    setIsPaused(false);
    setActivePreset(index);
    setMinutes(PRESETS[index].minutes);
    setSeconds(0);
  };

  const setCustom = () => {
    clearInterval(intervalRef.current!);
    intervalRef.current = null;
    setIsRunning(false);
    setIsPaused(false);
    setActivePreset(-1);
    setMinutes(parseInt(customMinutes) || 25);
    setSeconds(0);
  };

  // Ring progress
  const progress = totalSeconds / fullDuration;
  const dashOffset = circumference * (1 - progress);

  const formatTime = (m: number, s: number) => {
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const isComplete = minutes === 0 && seconds === 0 && sessions > 0;

  return (
    <div className="mx-auto max-w-md text-center">
      {/* Presets */}
      <div className="flex justify-center gap-2 mb-8">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => selectPreset(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activePreset === i
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p.label} ({p.min}m)
          </button>
        ))}
        <button
          onClick={setCustom}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activePreset === -1
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Custom
        </button>
      </div>

      {/* Custom minutes input */}
      {activePreset === -1 && (
        <div className="mb-6">
          <label className="block text-sm text-gray-500 mb-1">Minutes</label>
          <input
            type="number"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            onBlur={setCustom}
            min="1"
            max="120"
            className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm text-center focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
      )}

      {/* Timer ring */}
      <div className="relative inline-flex items-center justify-center mb-8">
        <svg width="320" height="320" viewBox="0 0 320 320" className="-rotate-90">
          {/* Background ring */}
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="none"
            stroke={isComplete ? '#22c55e' : '#f97316'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-extrabold text-gray-900 tabular-nums tracking-tight">
            {formatTime(minutes, seconds)}
          </span>
          <span className="text-sm text-gray-500 mt-2">
            {isComplete ? 'Time up!' : isRunning && !isPaused ? 'Focusing...' : isPaused ? 'Paused' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mb-8">
        {!isRunning ? (
          <button
            onClick={start}
            className="px-8 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors text-lg"
          >
            {isComplete ? 'Start Again' : 'Start'}
          </button>
        ) : isPaused ? (
          <button
            onClick={resume}
            className="px-8 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors text-lg"
          >
            Resume
          </button>
        ) : (
          <button
            onClick={pause}
            className="px-8 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors text-lg"
          >
            Pause
          </button>
        )}
        <button
          onClick={reset}
          className="px-8 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-lg"
        >
          Reset
        </button>
      </div>

      {/* Session counter */}
      <div className="text-sm text-gray-500">
        <span className="font-medium text-gray-700">{sessions}</span> session{sessions !== 1 ? 's' : ''} completed today
      </div>

      {/* Tips */}
      <div className="mt-8 rounded-2xl bg-gray-50 p-6 text-left">
        <h3 className="text-sm font-semibold text-gray-900">How to use the Pomodoro Technique</h3>
        <ul className="mt-2 space-y-2 text-sm text-gray-600">
          <li><strong>1.</strong> Pick one task to focus on.</li>
          <li><strong>2.</strong> Start the 25-minute timer and work until it rings.</li>
          <li><strong>3.</strong> Take a 5-minute break — stand up, stretch, grab water.</li>
          <li><strong>4.</strong> After 4 focus sessions, take a longer 15-30 minute break.</li>
        </ul>
        <p className="mt-3 text-xs text-gray-400">
          The Pomodoro Technique was developed by Francesco Cirillo in the late 1980s. The name comes from the tomato-shaped kitchen timer he used as a university student.
        </p>
      </div>
    </div>
  );
}
