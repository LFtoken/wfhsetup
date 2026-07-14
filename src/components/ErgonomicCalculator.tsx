import React, { useState, useMemo } from 'react';

type UnitSystem = 'imperial' | 'metric';
type DeskType = 'sitting' | 'standing' | 'convertible';

interface ErgoResult {
  deskHeight: { min: number; max: number };
  chairHeight: { min: number; max: number };
  monitorHeight: number;
  monitorDistance: number;
  keyboardPosition: string;
  armrestHeight: { min: number; max: number };
  footrestNeeded: boolean;
}

function calculateErgonomics(heightCm: number, deskType: DeskType): ErgoResult {
  // Based on ANSI/BIFMA and OSHA ergonomic guidelines
  const elbowHeight = heightCm * 0.63; // elbow height from floor when seated
  const eyeHeightSitting = heightCm * 0.74; // eye height from floor when seated
  const eyeHeightStanding = heightCm * 0.94; // eye height from floor when standing
  const poplitealHeight = heightCm * 0.25; // floor to back of knee

  if (deskType === 'standing') {
    const deskMin = heightCm * 0.62;
    const deskMax = heightCm * 0.66;
    return {
      deskHeight: { min: Math.round(deskMin), max: Math.round(deskMax) },
      chairHeight: { min: 0, max: 0 },
      monitorHeight: Math.round(heightCm * 0.94),
      monitorDistance: Math.round(50 + heightCm * 0.2),
      keyboardPosition: 'At desk height, wrists straight and flat. Elbows at ~90-100°.',
      armrestHeight: { min: 0, max: 0 },
      footrestNeeded: false,
    };
  }

  if (deskType === 'convertible') {
    const sitDesk = elbowHeight - 2;
    const standDesk = heightCm * 0.64;
    return {
      deskHeight: { min: Math.round(sitDesk), max: Math.round(standDesk) },
      chairHeight: { min: Math.round(poplitealHeight - 2), max: Math.round(poplitealHeight + 2) },
      monitorHeight: Math.round(eyeHeightSitting),
      monitorDistance: Math.round(50 + heightCm * 0.2),
      keyboardPosition: 'Sitting: keyboard slightly below elbow level. Standing: keyboard at elbow level. Wrists straight in both positions.',
      armrestHeight: { min: Math.round(elbowHeight - 2), max: Math.round(elbowHeight + 1) },
      footrestNeeded: poplitealHeight < 40,
    };
  }

  // Sitting desk
  const deskMin = elbowHeight - 4;
  const deskMax = elbowHeight + 2;
  return {
    deskHeight: { min: Math.round(deskMin), max: Math.round(deskMax) },
    chairHeight: { min: Math.round(poplitealHeight - 2), max: Math.round(poplitealHeight + 2) },
    monitorHeight: Math.round(eyeHeightSitting),
    monitorDistance: Math.round(50 + heightCm * 0.2),
    keyboardPosition: 'Keyboard just below elbow level. Wrists should be straight — not bent up or down. Use a wrist rest if needed.',
    armrestHeight: { min: Math.round(elbowHeight - 2), max: Math.round(elbowHeight + 1) },
    footrestNeeded: poplitealHeight < 40,
  };
}

export default function ErgonomicCalculator() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [heightInput, setHeightInput] = useState('');
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('8');
  const [deskType, setDeskType] = useState<DeskType>('sitting');
  const [calculated, setCalculated] = useState(false);

  const heightCm = useMemo(() => {
    if (unitSystem === 'metric') {
      return parseFloat(heightInput) || 0;
    }
    const ft = parseFloat(feet) || 0;
    const inch = parseFloat(inches) || 0;
    return (ft * 12 + inch) * 2.54;
  }, [unitSystem, heightInput, feet, inches]);

  const result = useMemo(() => {
    if (heightCm < 120 || heightCm > 220) return null;
    return calculateErgonomics(heightCm, deskType);
  }, [heightCm, deskType]);

  const handleCalculate = () => {
    setCalculated(true);
  };

  const toDisplay = (cm: number) => {
    if (unitSystem === 'metric') return `${cm} cm`;
    const totalInches = cm / 2.54;
    const ft = Math.floor(totalInches / 12);
    const inch = Math.round(totalInches % 12);
    return `${ft}'${inch}"`;
  };

  const rangeDisplay = (min: number, max: number) => {
    if (unitSystem === 'metric') return `${min}–${max} cm`;
    const minIn = min / 2.54;
    const maxIn = max / 2.54;
    const minFt = Math.floor(minIn / 12);
    const minInch = Math.round(minIn % 12);
    const maxFt = Math.floor(maxIn / 12);
    const maxInch = Math.round(maxIn % 12);
    return `${minFt}'${minInch}" – ${maxFt}'${maxInch}"`;
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Enter Your Details</h2>

        {/* Unit toggle */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Unit System</label>
          <div className="flex gap-2">
            {(['imperial', 'metric'] as UnitSystem[]).map((u) => (
              <button
                key={u}
                onClick={() => { setUnitSystem(u); setCalculated(false); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  unitSystem === u
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {u === 'imperial' ? '🇺🇸 Feet & Inches' : '🌍 Centimeters'}
              </button>
            ))}
          </div>
        </div>

        {/* Height input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Height</label>
          {unitSystem === 'imperial' ? (
            <div className="flex gap-3 items-end">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Feet</label>
                <input
                  type="number"
                  value={feet}
                  onChange={(e) => { setFeet(e.target.value); setCalculated(false); }}
                  className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  min="3"
                  max="8"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Inches</label>
                <input
                  type="number"
                  value={inches}
                  onChange={(e) => { setInches(e.target.value); setCalculated(false); }}
                  className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  min="0"
                  max="11"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={heightInput}
                onChange={(e) => { setHeightInput(e.target.value); setCalculated(false); }}
                placeholder="e.g. 170"
                className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                min="120"
                max="220"
              />
              <span className="text-sm text-gray-500">cm</span>
            </div>
          )}
        </div>

        {/* Desk type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Desk Type</label>
          <div className="flex flex-wrap gap-2">
            {([
              { value: 'sitting', label: '🪑 Sitting Desk' },
              { value: 'standing', label: '🧍 Standing Desk' },
              { value: 'convertible', label: '⬆️⬇️ Sit-Stand Desk' },
            ] as { value: DeskType; label: string }[]).map((d) => (
              <button
                key={d.value}
                onClick={() => { setDeskType(d.value); setCalculated(false); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  deskType === d.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleCalculate} className="btn-primary w-full sm:w-auto">
          Calculate My Ergonomic Setup
        </button>
      </div>

      {/* Results */}
      {calculated && result && (
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl bg-accent-50 border border-accent-200 p-6">
            <h2 className="text-xl font-bold text-accent-800">✅ Your Ergonomic Measurements</h2>
            <p className="mt-1 text-sm text-accent-700">Based on height: {toDisplay(Math.round(heightCm))}</p>
          </div>

          {result.deskHeight.min > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900">📐 Desk Height</h3>
              <p className="mt-1 text-2xl font-bold text-primary-700">{rangeDisplay(result.deskHeight.min, result.deskHeight.max)}</p>
              <p className="mt-2 text-sm text-gray-600">This is the height from the floor to the top of your desk surface. Your forearms should rest parallel to the floor when typing.</p>
            </div>
          )}

          {result.chairHeight.max > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900">💺 Chair Seat Height</h3>
              <p className="mt-1 text-2xl font-bold text-primary-700">{rangeDisplay(result.chairHeight.min, result.chairHeight.max)}</p>
              <p className="mt-2 text-sm text-gray-600">Height from floor to top of seat cushion. Your feet should be flat on the floor with knees at ~90°.</p>
              {result.footrestNeeded && (
                <p className="mt-2 text-sm font-medium text-amber-700">⚠️ You may need a footrest. At your height, a standard chair at its lowest setting may not allow your feet to rest flat on the floor.</p>
              )}
            </div>
          )}

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900">🖥️ Monitor Top Height</h3>
            <p className="mt-1 text-2xl font-bold text-primary-700">{toDisplay(result.monitorHeight)}</p>
            <p className="mt-2 text-sm text-gray-600">The top of your monitor screen should be at or slightly below eye level. Looking slightly down (10-15°) reduces eye strain.</p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900">📏 Monitor Distance</h3>
            <p className="mt-1 text-2xl font-bold text-primary-700">{toDisplay(result.monitorDistance)}</p>
            <p className="mt-2 text-sm text-gray-600">This is the recommended distance from your eyes to the screen. You should be able to read text without leaning forward.</p>
          </div>

          {result.armrestHeight.max > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900">💪 Armrest Height</h3>
              <p className="mt-1 text-2xl font-bold text-primary-700">{rangeDisplay(result.armrestHeight.min, result.armrestHeight.max)}</p>
              <p className="mt-2 text-sm text-gray-600">Armrests should support your forearms without pushing your shoulders up. Your elbows should be at ~90° when typing.</p>
            </div>
          )}

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900">⌨️ Keyboard Position</h3>
            <p className="mt-2 text-sm text-gray-600">{result.keyboardPosition}</p>
          </div>

          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h3 className="text-sm font-semibold text-amber-800">📝 Important Notes</h3>
            <ul className="mt-2 text-sm text-amber-700 space-y-1">
              <li>• These are guidelines based on averages. Adjust for personal comfort.</li>
              <li>• The 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.</li>
              <li>• If you share your desk with someone of a different height, a sit-stand desk with memory presets is highly recommended.</li>
              <li>• Always test furniture in person when possible. Ergonomic comfort is personal.</li>
            </ul>
          </div>
        </div>
      )}

      {calculated && !result && (
        <div className="mt-8 rounded-2xl bg-red-50 border border-red-200 p-6">
          <p className="text-red-700">Please enter a valid height (120–220 cm or 3'11" – 7'3").</p>
        </div>
      )}
    </div>
  );
}
