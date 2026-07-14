import React, { useState, useMemo } from 'react';

interface Question {
  id: string;
  category: string;
  question: string;
  options: { value: number; label: string }[];
}

const questions: Question[] = [
  // Workspace
  { id: 'desk', category: 'Workspace', question: 'How would you rate your desk setup?', options: [
    { value: 1, label: 'Kitchen table or couch — no dedicated desk' },
    { value: 2, label: 'A basic desk but not optimized for work' },
    { value: 3, label: 'A proper desk with adequate space' },
    { value: 4, label: 'An ergonomic desk (sit-stand) with everything I need' },
  ]},
  { id: 'chair', category: 'Workspace', question: 'How comfortable and supportive is your chair?', options: [
    { value: 1, label: 'A dining chair or stool — my back hurts daily' },
    { value: 2, label: 'A basic office chair with minimal support' },
    { value: 3, label: 'A decent ergonomic chair with lumbar support' },
    { value: 4, label: 'A high-end ergonomic chair — no pain at all' },
  ]},
  { id: 'monitor', category: 'Workspace', question: 'How is your monitor / screen setup?', options: [
    { value: 1, label: 'Just a laptop screen, hunched over' },
    { value: 2, label: 'Laptop + one external monitor at a basic height' },
    { value: 3, label: 'Proper monitor(s) at eye level' },
    { value: 4, label: 'Ideal ergonomic monitor setup with arms and proper height' },
  ]},
  { id: 'lighting', category: 'Workspace', question: 'How is the lighting in your workspace?', options: [
    { value: 1, label: 'Dim, harsh overhead, or lots of glare' },
    { value: 2, label: 'Okay but not ideal — some glare or dim spots' },
    { value: 3, label: 'Good lighting — natural light + task lamp' },
    { value: 4, label: 'Excellent — adjustable, glare-free, perfect for video calls too' },
  ]},

  // Habits
  { id: 'routine', category: 'Habits', question: 'Do you have a consistent start-of-day routine?', options: [
    { value: 1, label: 'I roll out of bed and open my laptop — no routine' },
    { value: 2, label: 'I try to have a routine but it is inconsistent' },
    { value: 3, label: 'I have a solid morning routine most days' },
    { value: 4, label: 'A rock-solid routine — I start every day with intention' },
  ]},
  { id: 'breaks', category: 'Habits', question: 'How often do you take breaks during the workday?', options: [
    { value: 1, label: 'I forget to take breaks — often work straight through' },
    { value: 2, label: 'I take breaks but sporadically' },
    { value: 3, label: 'I take regular breaks — stretch every hour or two' },
    { value: 4, label: 'I use a structured method (Pomodoro, etc.) with timed breaks' },
  ]},
  { id: 'exercise', category: 'Habits', question: 'How much physical activity do you get during the work week?', options: [
    { value: 1, label: 'Almost none — I sit all day' },
    { value: 2, label: 'A short walk here and there' },
    { value: 3, label: 'Regular exercise 3-4 times per week' },
    { value: 4, label: 'Daily exercise — gym, run, or walks built into my routine' },
  ]},

  // Focus
  { id: 'distractions', category: 'Focus', question: 'How well do you manage distractions at home?', options: [
    { value: 1, label: 'Constant interruptions — family, phone, noise' },
    { value: 2, label: 'I manage but get pulled away often' },
    { value: 3, label: 'Mostly focused — I have boundaries and manage notifications' },
    { value: 4, label: 'Deep focus — I have a quiet space, clear boundaries, and focus tools' },
  ]},
  { id: 'deepwork', category: 'Focus', question: 'How much deep, uninterrupted work do you get per day?', options: [
    { value: 1, label: 'Less than 1 hour — I am always multitasking' },
    { value: 2, label: '1-2 hours of focused work' },
    { value: 3, label: '3-4 hours of solid deep work' },
    { value: 4, label: '5+ hours of deep work — in flow state regularly' },
  ]},
  { id: 'planning', category: 'Focus', question: 'How do you plan and prioritize your work?', options: [
    { value: 1, label: 'I wing it — no planning system' },
    { value: 2, label: 'A basic to-do list that I sometimes use' },
    { value: 3, label: 'Daily planning with priorities — I know my top 3 tasks' },
    { value: 4, label: 'A robust system — time blocking, weekly reviews, goals tracked' },
  ]},

  // Tools
  { id: 'tools', category: 'Tools', question: 'How well do your digital tools support your work?', options: [
    { value: 1, label: 'Constantly fighting my tools — slow computer, bad internet' },
    { value: 2, label: 'Basic tools work but could be much better' },
    { value: 3, label: 'Good setup — reliable tools that mostly work well' },
    { value: 4, label: 'Excellent — fast computer, great internet, optimized workflow' },
  ]},

  // Wellness
  { id: 'worklife', category: 'Wellness', question: 'How well do you separate work from personal life?', options: [
    { value: 1, label: 'No separation — work bleeds into evenings and weekends' },
    { value: 2, label: 'I try to set boundaries but often fail' },
    { value: 3, label: 'I have clear boundaries — I "shut down" at a set time most days' },
    { value: 4, label: 'Perfect work-life balance. I close my laptop and switch off completely' },
  ]},
  { id: 'social', category: 'Wellness', question: 'How connected do you feel to colleagues and friends?', options: [
    { value: 1, label: 'Very isolated — I go days without talking to anyone' },
    { value: 2, label: 'Some connection but I feel lonely often' },
    { value: 3, label: 'Regular social interaction — calls, chats, and occasional meetups' },
    { value: 4, label: 'Thriving socially — great work relationships and active social life' },
  ]},
  { id: 'stress', category: 'Wellness', question: 'How would you rate your current stress level?', options: [
    { value: 1, label: 'Constantly stressed and overwhelmed' },
    { value: 2, label: 'Often stressed but managing' },
    { value: 3, label: 'Generally calm with occasional stressful days' },
    { value: 4, label: 'Very low stress — I have good coping strategies and perspective' },
  ]},
];

const categoryLabels: Record<string, string> = {
  Workspace: '🪑',
  Habits: '⏰',
  Focus: '🎯',
  Tools: '🛠️',
  Wellness: '🧘',
};

const categoryNames: Record<string, string> = {
  Workspace: 'Workspace Setup',
  Habits: 'Daily Habits',
  Focus: 'Focus & Planning',
  Tools: 'Tools & Tech',
  Wellness: 'Wellness & Balance',
};

function getTips(category: string, score: number): string[] {
  const tips: Record<string, Record<string, string[]>> = {
    Workspace: {
      low: [
        'Invest in a proper desk — even a $100 desk is a massive upgrade from the kitchen table.',
        'Your chair is your most important purchase. Look for lumbar support and adjustable height.',
        'Raise your monitor to eye level. Use books or a $20 monitor stand if needed.',
        'Add a desk lamp with adjustable brightness. Good lighting reduces eye strain and fatigue.',
      ],
      mid: [
        'Consider a monitor arm to free up desk space and get perfect positioning.',
        'Try a sit-stand desk converter if a full standing desk is out of budget.',
        'Add a plant or two — studies show plants reduce stress and boost productivity.',
        'Check your cable management. A clutter-free desk = a clutter-free mind.',
      ],
      high: ['Your workspace is in great shape! Consider adding personal touches that inspire you.',
        'Share your setup with others — you might enjoy helping friends optimize theirs.'],
    },
    Habits: {
      low: [
        'Start with a 5-minute morning routine: stretch, drink water, write your top priority.',
        'Set an alarm for breaks. Even a 2-minute stretch every hour makes a difference.',
        'Try the Pomodoro Technique: 25 minutes of work, 5 minutes of break. Repeat.',
        'Build in a daily walk — even 15 minutes. It clears your mind and protects your health.',
      ],
      mid: [
        'Experiment with time blocking: schedule specific blocks for deep work vs. meetings.',
        'Try a habit tracker app to build consistency. Streaks are motivating.',
        'Add movement "snacks" — 10 push-ups or stretches between meetings.',
      ],
      high: ['Your habits are solid! Consider mentoring someone struggling with WFH discipline.',
        'Try advanced techniques: time-themed days, quarterly personal reviews, or deliberate practice.'],
    },
    Focus: {
      low: [
        'Turn off all non-essential notifications on your phone and computer.',
        'Use website blockers (Freedom, Cold Turkey) during deep work sessions.',
        'Communicate your "do not disturb" hours to family or housemates.',
        'Try noise-canceling headphones or a white noise machine for better concentration.',
      ],
      mid: [
        'Start each day by identifying your #1 priority. Do it before checking email.',
        'Batch similar tasks: all emails at once, all meetings in one block.',
        'Try a focus music playlist. Lo-fi, classical, or ambient — find what works for you.',
      ],
      high: ['Your focus skills are excellent. Consider writing about your system to help others.',
        'Experiment with "deep work challenges" — see how much you can produce in a focused sprint.'],
    },
    Tools: {
      low: [
        'Check your internet speed. If it is under 25 Mbps, consider an upgrade or mesh Wi-Fi.',
        'A slow computer kills productivity. An SSD upgrade costs ~$50 and transforms an old machine.',
        'Learn keyboard shortcuts for your most-used apps. Minutes saved add up to hours.',
        'Set up a password manager. Typing passwords is a hidden time drain.',
      ],
      mid: [
        'Automate repetitive tasks. Zapier or keyboard macros can save hours per week.',
        'Audit your subscriptions. Cancel tools you do not actually use.',
        'Consider a second monitor — studies show a 20-30% productivity boost.',
      ],
      high: ['Your tool stack is excellent! Consider sharing your setup in a blog post or video.',
        'Stay curious about new tools, but do not chase every shiny new app.'],
    },
    Wellness: {
      low: [
        'Set a hard "shutdown" time. When it hits, close your laptop and do not reopen it.',
        'Create a physical separation ritual: close the laptop, walk around the block, change clothes.',
        'Schedule at least one social activity per week — video calls do not count.',
        'Try meditation or journaling. Even 5 minutes a day reduces stress measurably.',
      ],
      mid: [
        'Designate a "work-free zone" in your home where you never bring your laptop.',
        'Plan something fun every Wednesday — it breaks up the week and gives you something to look forward to.',
        'Check in with a work friend weekly. Casual conversation is not a waste of time.',
      ],
      high: ['Your work-life balance is excellent! Share your strategies with your team.',
        'Consider mentoring someone who is struggling — your experience is valuable.'],
    },
  };

  if (score <= 2) return tips[category].low;
  if (score <= 3) return tips[category].mid;
  return tips[category].high;
}

export default function ProductivityScorecard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (qId: string, value: number) => {
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setShowResults(false);
  };

  const categoryScores = useMemo(() => {
    const scores: Record<string, { total: number; count: number; avg: number }> = {};
    questions.forEach((q) => {
      if (!scores[q.category]) scores[q.category] = { total: 0, count: 0, avg: 0 };
      if (answers[q.id]) {
        scores[q.category].total += answers[q.id];
        scores[q.category].count += 1;
      }
    });
    Object.keys(scores).forEach((k) => {
      scores[k].avg = scores[k].count > 0 ? scores[k].total / scores[k].count : 0;
    });
    return scores;
  }, [answers]);

  const overallScore = useMemo(() => {
    const allScores = Object.values(categoryScores);
    if (allScores.length === 0) return 0;
    const total = allScores.reduce((sum, s) => sum + s.avg, 0);
    return Math.round((total / allScores.length) * 10) / 10;
  }, [categoryScores]);

  const progress = ((step) / questions.length) * 100;

  if (showResults) {
    const radarSize = 200;
    const radarCenter = radarSize / 2;
    const radarRadius = 80;
    const catKeys = Object.keys(categoryScores);

    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-accent-50 border border-accent-200 p-6 mb-8 text-center">
          <h2 className="text-xl font-bold text-accent-800">📊 Your WFH Productivity Scorecard</h2>
          <div className="mt-3 text-5xl font-extrabold text-primary-700">{overallScore}<span className="text-2xl text-gray-400">/4</span></div>
          <p className="mt-2 text-accent-700">
            {overallScore >= 3.5 && '🌟 Excellent! You are thriving in remote work. Keep it up and share your wisdom.'}
            {overallScore >= 2.5 && overallScore < 3.5 && '👍 Good foundation. A few targeted improvements will make a big difference.'}
            {overallScore >= 1.5 && overallScore < 2.5 && '🔧 Room for improvement. Focus on one category at a time — start with your lowest score.'}
            {overallScore < 1.5 && '🚀 Starting point identified! The good news: every small change will make a noticeable impact.'}
          </p>
        </div>

        {/* Radar chart (SVG) */}
        <div className="card mb-8 flex justify-center">
          <svg width={radarSize} height={radarSize} viewBox={`0 0 ${radarSize} ${radarSize}`}>
            {/* Grid lines */}
            {[1, 2, 3, 4].map((level) => {
              const r = (radarRadius / 4) * level;
              const points = catKeys.map((_, i) => {
                const angle = (Math.PI * 2 * i) / catKeys.length - Math.PI / 2;
                return `${radarCenter + r * Math.cos(angle)},${radarCenter + r * Math.sin(angle)}`;
              });
              return <polygon key={level} points={points.join(' ')} fill="none" stroke="#e5e7eb" strokeWidth="1" />;
            })}
            {/* Axis lines */}
            {catKeys.map((_, i) => {
              const angle = (Math.PI * 2 * i) / catKeys.length - Math.PI / 2;
              return (
                <line key={i}
                  x1={radarCenter} y1={radarCenter}
                  x2={radarCenter + radarRadius * Math.cos(angle)}
                  y2={radarCenter + radarRadius * Math.sin(angle)}
                  stroke="#e5e7eb" strokeWidth="1"
                />
              );
            })}
            {/* Data polygon */}
            <polygon
              points={catKeys.map((cat, i) => {
                const r = (categoryScores[cat].avg / 4) * radarRadius;
                const angle = (Math.PI * 2 * i) / catKeys.length - Math.PI / 2;
                return `${radarCenter + r * Math.cos(angle)},${radarCenter + r * Math.sin(angle)}`;
              }).join(' ')}
              fill="rgba(249, 115, 22, 0.3)"
              stroke="#f97316"
              strokeWidth="2"
            />
            {/* Labels */}
            {catKeys.map((cat, i) => {
              const angle = (Math.PI * 2 * i) / catKeys.length - Math.PI / 2;
              const lx = radarCenter + (radarRadius + 35) * Math.cos(angle);
              const ly = radarCenter + (radarRadius + 35) * Math.sin(angle);
              return (
                <text key={cat} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="text-xs fill-gray-600" fontSize="11">
                  {categoryLabels[cat]} {categoryScores[cat].avg.toFixed(1)}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Category details */}
        <div className="space-y-4 mb-8">
          {catKeys.map((cat) => {
            const score = categoryScores[cat].avg;
            const tips = getTips(cat, score);
            return (
              <div key={cat} className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{categoryLabels[cat]} {categoryNames[cat]}</h3>
                  <span className={`text-sm font-bold px-2 py-1 rounded ${
                    score >= 3.5 ? 'bg-green-100 text-green-700' :
                    score >= 2.5 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>{score.toFixed(1)} / 4</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full mb-3">
                  <div className={`h-full rounded-full transition-all ${
                    score >= 3.5 ? 'bg-green-500' :
                    score >= 2.5 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} style={{ width: `${(score / 4) * 100}%` }} />
                </div>
                <ul className="space-y-1">
                  {tips.map((tip, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-primary-500 mt-0.5">→</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button onClick={reset} className="btn-secondary">Retake Assessment ↺</button>
        </div>
      </div>
    );
  }

  const currentQ = questions[step];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Question {step + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="card">
        <div className="text-xs font-medium text-primary-600 mb-2 uppercase tracking-wide">
          {categoryLabels[currentQ.category]} {currentQ.category}
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentQ.question}</h2>
        <div className="space-y-3">
          {currentQ.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(currentQ.id, opt.value)}
              className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition-all duration-150 group"
            >
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {step > 0 && (
        <div className="mt-4 text-center">
          <button onClick={handleBack} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
        </div>
      )}
    </div>
  );
}
