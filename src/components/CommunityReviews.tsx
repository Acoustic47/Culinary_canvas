import React, { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  ThumbsUp, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2,
  Camera,
  Activity
} from 'lucide-react';
import { BiteReview } from '../types';

interface CommunityReviewsProps {
  reviews: BiteReview[];
  overallRating: number;
  hygieneAudit: string;
}

export const CommunityReviews: React.FC<CommunityReviewsProps> = ({
  reviews,
  overallRating,
  hygieneAudit,
}) => {
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  const toggleHelpful = (id: string, initialCount: number) => {
    setHelpfulVotes((prev) => {
      const current = prev[id] ?? initialCount;
      return {
        ...prev,
        [id]: current === initialCount ? initialCount + 1 : initialCount,
      };
    });
  };

  return (
    <section className="pt-8 space-y-6">
      {/* Header & Metrics Summary */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Diner Experiences</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-white">
              Community BiteReviews & Social Proof
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Triple-audited reviews exclusively from confirmed delivered canvas orders
            </p>
          </div>

          {/* Aggregate Rating Banner */}
          <div className="flex items-center space-x-4 bg-obsidian-950/70 p-3.5 rounded-2xl border border-white/10">
            <div className="text-center pr-3 border-r border-white/10">
              <div className="text-2xl font-serif font-black text-emerald-400">
                {overallRating}
              </div>
              <div className="flex text-amber-400 text-xs mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-white">Hygiene Certified</div>
              <div className="text-[11px] text-emerald-400 font-mono font-medium">
                {hygieneAudit}
              </div>
              <div className="text-[10px] text-slate-500">Inspected November 2026</div>
            </div>
          </div>
        </div>

        {/* Sensory Scorecards Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { label: 'Taste Perfection', score: '99.4%', desc: 'Flavor harmony' },
            { label: 'Presentation & Craft', score: '98.8%', desc: 'Aesthetic plating' },
            { label: 'Thermal Packaging', score: '99.1%', desc: 'Optimal serving temp' },
            { label: 'Courier Speed', score: '97.6%', desc: 'Sub-30m dispatch' },
          ].map((stat, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">{stat.label}</div>
              <div className="text-base font-mono font-black text-emerald-300 mt-1">
                {stat.score}
              </div>
              <div className="text-[10px] text-slate-500">{stat.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((rev) => {
          const currentHelpful = helpfulVotes[rev.id] ?? rev.helpfulCount;
          const isVoted = currentHelpful > rev.helpfulCount;

          return (
            <div
              key={rev.id}
              className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 shadow-glass"
            >
              <div>
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      className="w-10 h-10 rounded-full object-cover border border-emerald-400/40"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{rev.author}</span>
                        {rev.verifiedPurchase && (
                          <span className="flex items-center space-x-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Verified Diner</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">{rev.date}</span>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(rev.rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Must-Try Recommendation Tag */}
                <div className="mt-3 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>Must-Try: <strong>{rev.dishRecommended}</strong></span>
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              {/* Footer: Helpful Vote */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>Community Verified Experience</span>
                <button
                  onClick={() => toggleHelpful(rev.id, rev.helpfulCount)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition ${
                    isVoted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'hover:bg-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <ThumbsUp className={`w-3 h-3 ${isVoted ? 'fill-emerald-400' : ''}`} />
                  <span>Helpful ({currentHelpful})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

