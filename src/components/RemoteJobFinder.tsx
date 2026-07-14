import React, { useState, useMemo } from 'react';

interface Platform {
  name: string;
  url: string;
  description: string;
  bestFor: string[];
  jobTypes: string[];
  experienceLevels: string[];
  salaryRange: string;
  freeTier: string;
  rating: number;
  pros: string[];
  cons: string[];
}

const platforms: Platform[] = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/jobs/',
    description: 'The largest professional network. Use the "Remote" filter to find remote jobs across all industries.',
    bestFor: ['Tech', 'Marketing', 'Finance', 'Management', 'Design'],
    jobTypes: ['Full-time', 'Contract'],
    experienceLevels: ['Entry', 'Mid', 'Senior'],
    salaryRange: 'Varies widely by role',
    freeTier: 'Full job search and application for free',
    rating: 4.5,
    pros: ['Largest job database', 'Easy to filter by remote', 'Direct company insights', 'Easy Apply option'],
    cons: ['High competition', 'Many outdated listings', 'Recruiter spam'],
  },
  {
    name: 'We Work Remotely',
    url: 'https://weworkremotely.com',
    description: 'One of the oldest and most trusted remote-only job boards. All listings are 100% remote.',
    bestFor: ['Tech', 'Design', 'Marketing', 'Customer Support', 'Writing'],
    jobTypes: ['Full-time', 'Contract'],
    experienceLevels: ['Mid', 'Senior'],
    salaryRange: '$50k–$200k+',
    freeTier: 'Browse and apply for free',
    rating: 4.3,
    pros: ['100% remote listings', 'High-quality postings', 'No recruiter spam', 'Clean interface'],
    cons: ['Fewer entry-level roles', 'Heavy on tech roles', '$299 fee for employers limits listings'],
  },
  {
    name: 'FlexJobs',
    url: 'https://www.flexjobs.com',
    description: 'Curated, scam-free job board. Every listing is hand-screened by their team before posting.',
    bestFor: ['All industries', 'Customer Support', 'Writing', 'Education', 'Healthcare'],
    jobTypes: ['Full-time', 'Part-time', 'Contract', 'Freelance'],
    experienceLevels: ['Entry', 'Mid', 'Senior'],
    salaryRange: '$30k–$150k+',
    freeTier: 'Browse for free; $2.95/week to apply',
    rating: 4.4,
    pros: ['Zero scams or fake listings', 'Broad industry coverage', 'Excellent search filters', 'Skills tests available'],
    cons: ['Requires paid subscription to apply', 'Some listings are on other sites too'],
  },
  {
    name: 'Remote OK',
    url: 'https://remoteok.com',
    description: 'Large aggregator that pulls remote jobs from across the web. Updated frequently.',
    bestFor: ['Tech', 'Design', 'Marketing', 'Writing'],
    jobTypes: ['Full-time', 'Contract'],
    experienceLevels: ['Entry', 'Mid', 'Senior'],
    salaryRange: '$40k–$180k+',
    freeTier: 'Completely free to browse and apply',
    rating: 4.1,
    pros: ['Huge volume of listings', 'Salary data visible', 'Tag-based filtering', 'Completely free'],
    cons: ['Some duplicate listings', 'Heavy tech focus', 'Less screening'],
  },
  {
    name: 'Indeed',
    url: 'https://www.indeed.com',
    description: 'Massive job aggregator. Use "Remote" in the location field to find remote positions.',
    bestFor: ['All industries', 'Healthcare', 'Customer Support', 'Sales', 'Education'],
    jobTypes: ['Full-time', 'Part-time', 'Contract'],
    experienceLevels: ['Entry', 'Mid', 'Senior'],
    salaryRange: 'Varies widely by role',
    freeTier: 'Completely free',
    rating: 4.2,
    pros: ['Biggest job database', 'Company reviews built in', 'Salary comparison tool', 'Good for non-tech roles'],
    cons: ['Many non-remote jobs mixed in', 'Lots of old/sponsored listings', 'Quality varies'],
  },
  {
    name: 'AngelList / Wellfound',
    url: 'https://wellfound.com',
    description: 'The go-to platform for startup and tech company jobs. Salary and equity info is transparent.',
    bestFor: ['Tech', 'Design', 'Marketing', 'Product'],
    jobTypes: ['Full-time', 'Contract'],
    experienceLevels: ['Entry', 'Mid', 'Senior'],
    salaryRange: '$60k–$200k+',
    freeTier: 'Free to browse and apply',
    rating: 4.4,
    pros: ['Salary/equity transparency', 'Direct founder communication', 'Great for startups', 'Clean UX'],
    cons: ['Startup/tech only', 'Smaller job pool', 'Mostly US companies'],
  },
  {
    name: 'Upwork',
    url: 'https://www.upwork.com',
    description: 'The largest freelance marketplace. Great for building a remote portfolio and client base.',
    bestFor: ['Tech', 'Design', 'Writing', 'Marketing', 'Customer Support', 'Admin'],
    jobTypes: ['Freelance', 'Contract'],
    experienceLevels: ['Entry', 'Mid', 'Senior'],
    salaryRange: 'Varies; freelance rates $15–$150+/hr',
    freeTier: 'Free profile; 10% service fee on earnings',
    rating: 3.9,
    pros: ['Huge variety of projects', 'Build long-term client relationships', 'Payment protection', 'Global opportunities'],
    cons: ['Service fees eat into earnings', 'Competitive for beginners', 'Quality of listings varies'],
  },
  {
    name: 'Toptal',
    url: 'https://www.toptal.com',
    description: 'Exclusive network for top freelance talent. Rigorous screening process — only accepts top 3% of applicants.',
    bestFor: ['Tech', 'Design', 'Finance'],
    jobTypes: ['Freelance', 'Contract'],
    experienceLevels: ['Senior'],
    salaryRange: '$60–$200+/hr',
    freeTier: 'Free to apply (if accepted)',
    rating: 4.2,
    pros: ['Premium clients and rates', 'Vetted opportunities', 'No bidding on projects', 'Dedicated matcher'],
    cons: ['Very hard to get accepted', 'Limited to experienced pros', 'Fewer job categories'],
  },
  {
    name: 'Working Nomads',
    url: 'https://www.workingnomads.com',
    description: 'Curated remote job lists delivered to your inbox. Focuses on digital nomad-friendly roles.',
    bestFor: ['Tech', 'Design', 'Marketing', 'Writing'],
    jobTypes: ['Full-time', 'Contract'],
    experienceLevels: ['Mid', 'Senior'],
    salaryRange: '$40k–$150k+',
    freeTier: 'Free to browse; email newsletter is free',
    rating: 3.8,
    pros: ['Curated quality', 'Email delivery option', 'Clean, simple interface'],
    cons: ['Smaller selection', 'Few entry-level roles'],
  },
  {
    name: 'Remotive',
    url: 'https://remotive.com',
    description: 'Hand-curated remote job board with a strong community. Good mix of tech and non-tech roles.',
    bestFor: ['Tech', 'Marketing', 'Customer Support', 'Sales'],
    jobTypes: ['Full-time'],
    experienceLevels: ['Entry', 'Mid', 'Senior'],
    salaryRange: '$40k–$180k+',
    freeTier: 'Free to browse and apply',
    rating: 4.0,
    pros: ['Well-curated listings', 'Active community', 'Good category filtering'],
    cons: ['Full-time only', 'Limited to certain categories'],
  },
];

const industries = ['All', 'Tech', 'Design', 'Marketing', 'Writing', 'Customer Support', 'Finance', 'Management', 'Sales', 'Education', 'Healthcare', 'Admin', 'Product'];
const experienceLevelsArr = ['All', 'Entry', 'Mid', 'Senior'];
const jobTypesArr = ['All', 'Full-time', 'Part-time', 'Contract', 'Freelance'];

export default function RemoteJobFinder() {
  const [industry, setIndustry] = useState('All');
  const [experience, setExperience] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return platforms.filter((p) => {
      if (industry !== 'All' && !p.bestFor.includes(industry)) return false;
      if (experience !== 'All' && !p.experienceLevels.includes(experience)) return false;
      if (jobType !== 'All' && !p.jobTypes.includes(jobType)) return false;
      return true;
    });
  }, [industry, experience, jobType]);

  const toggleSelect = (name: string) => {
    const next = new Set(selected);
    if (next.has(name)) {
      next.delete(name);
    } else if (next.size < 3) {
      next.add(name);
    }
    setSelected(next);
  };

  const selectedPlatforms = platforms.filter((p) => selected.has(p.name));

  return (
    <div className="mx-auto max-w-4xl">
      {/* Filters */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Find Your Remote Job Platform</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry / Field</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              {industries.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              {experienceLevelsArr.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              {jobTypesArr.map((j) => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Showing <strong>{filtered.length}</strong> matching platforms. Select up to 3 to compare side by side.
        </p>
      </div>

      {/* Platform list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {filtered.map((p) => (
          <button
            key={p.name}
            onClick={() => toggleSelect(p.name)}
            className={`text-left p-4 rounded-xl border transition-all ${
              selected.has(p.name)
                ? 'border-primary-400 bg-primary-50 ring-2 ring-primary-200'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{p.name}</h3>
              <span className="text-sm text-yellow-600">{'★'.repeat(Math.floor(p.rating))}{p.rating % 1 >= 0.5 ? '½' : ''}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{p.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {p.bestFor.slice(0, 3).map((b) => (
                <span key={b} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{b}</span>
              ))}
              {p.bestFor.length > 3 && <span className="text-xs text-gray-400">+{p.bestFor.length - 3} more</span>}
            </div>
          </button>
        ))}
      </div>

      {/* Comparison table */}
      {selected.size > 1 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Side-by-Side Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 w-32">Feature</th>
                  {selectedPlatforms.map((p) => (
                    <th key={p.name} className="text-left p-3 bg-gray-50 border-b border-gray-200 font-medium text-gray-900">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-b border-gray-100 text-gray-600 font-medium">Rating</td>
                  {selectedPlatforms.map((p) => (
                    <td key={p.name} className="p-3 border-b border-gray-100">{'★'.repeat(Math.floor(p.rating))} {p.rating}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 border-b border-gray-100 text-gray-600 font-medium">Best For</td>
                  {selectedPlatforms.map((p) => (
                    <td key={p.name} className="p-3 border-b border-gray-100">{p.bestFor.join(', ')}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 border-b border-gray-100 text-gray-600 font-medium">Job Types</td>
                  {selectedPlatforms.map((p) => (
                    <td key={p.name} className="p-3 border-b border-gray-100">{p.jobTypes.join(', ')}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 border-b border-gray-100 text-gray-600 font-medium">Experience</td>
                  {selectedPlatforms.map((p) => (
                    <td key={p.name} className="p-3 border-b border-gray-100">{p.experienceLevels.join(', ')}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 border-b border-gray-100 text-gray-600 font-medium">Salary Range</td>
                  {selectedPlatforms.map((p) => (
                    <td key={p.name} className="p-3 border-b border-gray-100">{p.salaryRange}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 border-b border-gray-100 text-gray-600 font-medium">Cost</td>
                  {selectedPlatforms.map((p) => (
                    <td key={p.name} className="p-3 border-b border-gray-100">{p.freeTier}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 border-b border-gray-100 text-gray-600 font-medium">Pros</td>
                  {selectedPlatforms.map((p) => (
                    <td key={p.name} className="p-3 border-b border-gray-100">
                      <ul className="list-disc list-inside space-y-0.5">
                        {p.pros.map((pro, i) => <li key={i} className="text-green-700">{pro}</li>)}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-gray-600 font-medium">Cons</td>
                  {selectedPlatforms.map((p) => (
                    <td key={p.name} className="p-3">
                      <ul className="list-disc list-inside space-y-0.5">
                        {p.cons.map((con, i) => <li key={i} className="text-red-600">{con}</li>)}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected.size === 1 && (
        <div className="mt-8 rounded-2xl bg-gray-50 p-6 text-center">
          <p className="text-gray-500">👆 Select one more platform to see a side-by-side comparison.</p>
        </div>
      )}
    </div>
  );
}
