import React, { useState } from 'react';

interface Answers {
  roomType: string;
  roomSize: string;
  workType: string;
  budget: string;
  naturalLight: string;
  multiMonitor: string;
  style: string;
}

interface Recommendation {
  desk: { name: string; price: string; note: string };
  chair: { name: string; price: string; note: string };
  monitor: { name: string; price: string; note: string };
  lighting: { name: string; price: string; note: string };
  extras: string[];
  totalBudget: string;
  layout: string;
}

const questions = [
  {
    id: 'roomType',
    question: 'What kind of space do you have for your home office?',
    options: [
      { value: 'dedicated', label: '🏠 Dedicated room', desc: 'A whole room just for your office' },
      { value: 'shared', label: '🛋️ Shared room corner', desc: 'A corner in a bedroom or living room' },
      { value: 'closet', label: '🚪 Closet / Nook', desc: 'A closet office or small nook' },
      { value: 'mobile', label: '🔄 No fixed spot', desc: 'I move around — kitchen table, couch, etc.' },
    ],
  },
  {
    id: 'roomSize',
    question: 'How much floor space can you dedicate?',
    options: [
      { value: 'tiny', label: 'Tiny (< 30 sq ft)', desc: 'Just enough for a small desk and chair' },
      { value: 'small', label: 'Small (30-60 sq ft)', desc: 'Room for a desk, chair, and some storage' },
      { value: 'medium', label: 'Medium (60-100 sq ft)', desc: 'A proper desk setup with shelves' },
      { value: 'large', label: 'Large (100+ sq ft)', desc: 'Plenty of room — full office furniture' },
    ],
  },
  {
    id: 'workType',
    question: 'What kind of work do you primarily do?',
    options: [
      { value: 'computer', label: '💻 Computer work', desc: 'Coding, writing, spreadsheets, design' },
      { value: 'meetings', label: '🎥 Lots of video calls', desc: 'Meetings-heavy role — needs good camera/audio' },
      { value: 'creative', label: '🎨 Creative / Hands-on', desc: 'Drawing, crafting, or physical materials' },
      { value: 'mixed', label: '🔄 Mix of everything', desc: 'Computer + calls + some physical work' },
    ],
  },
  {
    id: 'budget',
    question: 'What is your total budget for furniture and gear?',
    options: [
      { value: 'budget', label: '💰 Budget ($300-500)', desc: 'Focused on essentials and value picks' },
      { value: 'mid', label: '💵 Mid-range ($500-1,500)', desc: 'Good quality without breaking the bank' },
      { value: 'premium', label: '💎 Premium ($1,500-3,000)', desc: 'High-end ergonomic furniture and gear' },
      { value: 'unlimited', label: '👑 No limit', desc: 'Top-of-the-line everything' },
    ],
  },
  {
    id: 'naturalLight',
    question: 'What is the natural light situation?',
    options: [
      { value: 'window', label: '☀️ Window in front or side', desc: 'Good natural light during the day' },
      { value: 'windowBehind', label: '🪟 Window behind me', desc: 'Window behind — risk of screen glare' },
      { value: 'noWindow', label: '💡 No natural light', desc: 'Basement or interior room — need good lamps' },
    ],
  },
  {
    id: 'multiMonitor',
    question: 'How many monitors do you need?',
    options: [
      { value: 'laptop', label: '💻 Laptop only', desc: 'I work from just my laptop screen' },
      { value: 'single', label: '🖥️ One external monitor', desc: 'Laptop + one external display' },
      { value: 'dual', label: '🖥️🖥️ Dual monitors', desc: 'Two external monitors for maximum productivity' },
    ],
  },
  {
    id: 'style',
    question: 'What style direction do you prefer?',
    options: [
      { value: 'minimal', label: '✨ Minimal / Modern', desc: 'Clean lines, neutral colors, clutter-free' },
      { value: 'cozy', label: '🪵 Cozy / Warm', desc: 'Wood tones, plants, warm lighting' },
      { value: 'industrial', label: '🏭 Industrial / Tech', desc: 'Dark colors, LED accents, gadget-heavy' },
      { value: 'any', label: '😊 Just functional', desc: 'I care more about function than looks' },
    ],
  },
];

function generateRecommendation(answers: Answers): Recommendation {
  const data: Record<string, Record<string, Recommendation>> = {
    budget: {
      budget: {
        desk: { name: 'IKEA Lagkapten / Adils combo', price: '$50-80', note: 'Simple, sturdy. Get the 55" version if you fit a monitor.' },
        chair: { name: 'Hbada Office Task Chair', price: '$120-150', note: 'Best budget ergonomic chair. Lumbar support included.' },
        monitor: { name: 'Dell S2421H 24"', price: '$100-130', note: 'IPS panel, thin bezels, built-in speakers. Great value.' },
        lighting: { name: 'TaoTronics LED Desk Lamp', price: '$30-40', note: 'Multiple brightness levels and color temperatures.' },
        extras: ['Monitor riser stand ($20-30)', 'Basic cable management box ($15)'],
        totalBudget: '$350-500',
        layout: 'Position desk against a wall or window. Place the monitor on a riser at eye level. Keep a small lamp on one side for task lighting. Use a cable box to keep wires tidy.',
      },
      mid: {
        desk: { name: 'Flexispot EC1 Standing Desk (48")', price: '$250-300', note: 'Electric height-adjustable. Smooth motor, memory presets.' },
        chair: { name: 'SIHOO M18 Ergonomic Chair', price: '$180-230', note: 'Full ergonomic adjustments. Mesh back for breathability.' },
        monitor: { name: 'Dell S2722QC 27" 4K USB-C', price: '$300-350', note: 'USB-C single-cable connection. 4K resolution. Great color accuracy.' },
        lighting: { name: 'BenQ ScreenBar', price: '$100-120', note: 'Mounts on top of monitor. Auto-dimming. No desk space needed.' },
        extras: ['Monitor arm ($40-60)', 'Desk pad / mat ($25)', 'Cable management tray ($25)'],
        totalBudget: '$900-1,200',
        layout: 'Place the standing desk perpendicular to a window for even lighting without glare. Mount the monitor on an arm for flexibility. Add a desk pad for a clean look. Use the ScreenBar to save desk space.',
      },
      premium: {
        desk: { name: 'Uplift V2 Standing Desk (60")', price: '$600-800', note: 'Commercial-grade frame. 355lb capacity. Beautiful bamboo or walnut top.' },
        chair: { name: 'Herman Miller Aeron Size B', price: '$1,100-1,400', note: 'The gold standard. 12-year warranty. Perfect posture support.' },
        monitor: { name: 'Dell U4025QW 40" Ultrawide 5K', price: '$1,200-1,500', note: 'Thunderbolt 4 hub built-in. IPS Black panel for incredible contrast.' },
        lighting: { name: 'Dyson Solarcycle Morph', price: '$500-650', note: 'Tracks daylight. Auto-adjusts. Lasts 60 years per Dyson.' },
        extras: ['Herman Miller monitor arm ($200)', 'Grovemade desk shelf ($200)', 'Steelcase cable management kit ($80)', 'High-end desk mat ($60-100)'],
        totalBudget: '$2,700-4,600',
        layout: 'Centered position in the room, facing the door if possible. Ultrawide on a premium monitor arm. Desk shelf for a layered look. Dyson lamp provides ambient + task lighting. Everything cable-managed underneath.',
      },
      unlimited: {
        desk: { name: 'Herman Miller Nevi Sit-to-Stand Desk', price: '$2,000-3,000', note: 'The ultimate standing desk. Whisper-quiet motors. Custom sizing and finishes.' },
        chair: { name: 'Herman Miller Embody', price: '$1,800-2,200', note: 'Designed with 30+ physicians. Pixelated support for your entire spine.' },
        monitor: { name: 'Apple Pro Display XDR', price: '$5,000+', note: '6K resolution. Reference-grade color. The best display money can buy.' },
        lighting: { name: 'Dyson Solarcycle Morph (x2)', price: '$1,000-1,300', note: 'One for each side of the desk. Perfect ambient + task lighting.' },
        extras: ['Fully monitor arm ($250)', 'Grovemade full desk collection ($500+)', 'Bang & Olufsen desk speaker ($300)', 'Premium leather desk mat ($150)'],
        totalBudget: '$10,000+',
        layout: 'Design the room around the desk. Centered with views. Maximize natural light. Acoustic panels on walls for echo control. A statement plant (fiddle leaf fig or monstera) in the corner. This is a CEO-level home office.',
      },
    },
  };

  // Use budget-based recommendations with adjustments for other answers
  const base = (data.budget as Record<string, Recommendation>)[answers.budget] || data.budget.mid;

  // Adjust for small spaces
  if (answers.roomSize === 'tiny' || answers.roomSize === 'small') {
    if (answers.budget === 'mid') {
      base.desk = { name: 'Flexispot EC1 42" Compact', price: '$230-280', note: 'Smaller footprint. Same great motor. Perfect for tight spaces.' };
    }
    base.extras.push('Wall-mounted shelves to save floor space');
  }

  // Adjust for meeting-heavy work
  if (answers.workType === 'meetings') {
    base.extras.push('Logitech C920 webcam ($60-70)');
    base.extras.push('Blue Yeti Nano microphone ($80-100)');
  }

  // Adjust for no natural light
  if (answers.naturalLight === 'noWindow') {
    base.extras.push('Additional LED floor lamp ($50-80)');
    base.extras.push('Philips Hue smart bulbs for circadian lighting ($40-60)');
  }

  // Adjust for dual monitors
  if (answers.multiMonitor === 'dual') {
    base.extras.push('Second monitor (same model as first) — doubles your screen real estate');
    base.extras.push('Dual monitor arm for clean desk setup ($60-100)');
  }

  // Adjust for closet/nook
  if (answers.roomType === 'closet') {
    base.layout = 'Closet setup: Use a wall-mounted floating desk to save floor space. Mount monitors on the wall or a clamp arm. Add LED strip lighting under shelves. A slim task chair is essential — avoid bulky executive chairs. Use vertical space with pegboards and shelves.';
  }

  return base;
}

export default function HomeOfficePlanner() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [result, setResult] = useState<Recommendation | null>(null);

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[step].id]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setResult(generateRecommendation(newAnswers as Answers));
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  if (result) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-accent-50 border border-accent-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-accent-800">🎉 Your Personalized Home Office Plan</h2>
          <p className="mt-2 text-accent-700">Based on your space, budget, and work style. Here is exactly what to get.</p>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900">🪑 Desk</h3>
            <p className="mt-1 font-medium text-primary-700">{result.desk.name}</p>
            <p className="text-sm text-gray-500">{result.desk.price} — {result.desk.note}</p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900">💺 Chair</h3>
            <p className="mt-1 font-medium text-primary-700">{result.chair.name}</p>
            <p className="text-sm text-gray-500">{result.chair.price} — {result.chair.note}</p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900">🖥️ Monitor</h3>
            <p className="mt-1 font-medium text-primary-700">{result.monitor.name}</p>
            <p className="text-sm text-gray-500">{result.monitor.price} — {result.monitor.note}</p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900">💡 Lighting</h3>
            <p className="mt-1 font-medium text-primary-700">{result.lighting.name}</p>
            <p className="text-sm text-gray-500">{result.lighting.price} — {result.lighting.note}</p>
          </div>

          {result.extras.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900">📦 Additional Recommendations</h3>
              <ul className="mt-2 space-y-1">
                {result.extras.map((extra, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-primary-500 mt-0.5">✓</span> {extra}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900">📐 Layout Guide</h3>
            <p className="mt-2 text-sm text-gray-600">{result.layout}</p>
          </div>

          <div className="card border-2 border-primary-200 bg-primary-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary-900">Estimated Total: {result.totalBudget}</h3>
                <p className="mt-1 text-sm text-primary-700">Prices are approximate and may vary by retailer and region.</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button onClick={reset} className="btn-secondary mt-4">
              Start Over ↺
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[step];
  const progress = ((step) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Question {step + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question card */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentQ.question}</h2>
        <div className="space-y-3">
          {currentQ.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(opt.value)}
              className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition-all duration-150 group"
            >
              <div className="font-medium text-gray-900 group-hover:text-primary-700">{opt.label}</div>
              <div className="text-sm text-gray-500 mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {step > 0 && (
        <div className="mt-4 text-center">
          <button onClick={handleBack} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px]">
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
