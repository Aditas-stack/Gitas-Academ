import React, { useState } from 'react';
import {
  X,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  Star,
  Award,
  CreditCard,
  Lock,
  ArrowRight,
  Flame,
  HelpCircle,
  Users,
  CheckCircle2,
  Percent,
  ChevronDown,
  Gift
} from 'lucide-react';
import { SubscriptionPlan, UserProfile } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface StudentPricingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  inline?: boolean;
  currentPlan?: SubscriptionPlan;
  onUpgradePlan: (plan: SubscriptionPlan) => void;
  onToast: (msg: string, title?: string) => void;
}

export const StudentPricingModal: React.FC<StudentPricingModalProps> = ({
  isOpen = false,
  onClose,
  inline = false,
  currentPlan = 'trial',
  onUpgradePlan,
  onToast,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SubscriptionPlan | null>(null);

  // Checkout Form State
  const [promoCode, setPromoCode] = useState<string>('LAUNCH50');
  const [promoApplied, setPromoApplied] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'gpay' | 'applepay'>('card');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('888');
  const [cardholderName, setCardholderName] = useState<string>('Alex Morgan');

  if (!inline && !isOpen) return null;

  const isAnnual = billingCycle === 'annual';

  const plans = [
    {
      id: 'starter' as SubscriptionPlan,
      name: 'Starter Explorer',
      tagline: 'Essential 3D foundations & core curriculum',
      monthlyPrice: 19,
      annualPrice: 14,
      badge: null,
      popular: false,
      color: 'slate',
      features: [
        'Full access to Core Curriculum modules',
        'Standard 3D simulations (Calculus & Gravity)',
        '720p HD instructional video lectures',
        '5 AI Automated Rubric Evaluations / month',
        'Community discussion & peer kudos leaderboard',
        'Single learner profile',
      ],
      notIncluded: [
        'Interactive 4K Quantum Atom labs',
        'Live 3D classroom audio/video participation',
        '1-on-1 Faculty Office Hours',
      ],
    },
    {
      id: 'scholar' as SubscriptionPlan,
      name: 'Academy Scholar',
      tagline: 'Complete spatial immersion & mastery',
      monthlyPrice: 39,
      annualPrice: 29,
      badge: '🔥 MOST POPULAR • BEST VALUE',
      popular: true,
      color: 'indigo',
      features: [
        'EVERYTHING in Starter Explorer, plus:',
        'Unlimited 4K Ultra-HD Video Masterclasses',
        'Full Interactive 3D Spatial Physics Lab (Atomic, Multivariable, Kepler)',
        'Live 3D Classroom Host & Peer Participation with WebRTC feeds',
        'Unlimited Instant AI & Instructor Rubric Evaluations',
        'All 3 Grade Pods Unlocked (Academy Core, Explorer, Toddler Pod)',
        'Verified Academic Honors & Dean’s List Certificates',
        'Priority question queuing in live faculty lectures',
      ],
      notIncluded: ['1-on-1 Weekly Faculty Office Hours'],
    },
    {
      id: 'genius' as SubscriptionPlan,
      name: 'All-Access Genius',
      tagline: 'Private faculty mentorship & family license',
      monthlyPrice: 79,
      annualPrice: 59,
      badge: '👑 ACCREDITED EXCELLENCE',
      popular: false,
      color: 'amber',
      features: [
        'EVERYTHING in Academy Scholar, plus:',
        '1-on-1 Weekly Live Office Hours with Dr. Thorne & Lead Faculty',
        'Priority Assignment Feedback (< 2-Hour Turnaround)',
        'Multi-child Family License (Up to 4 student profiles across all pods)',
        'Personalized STEM learning pathway & university prep guidance',
        'Official accredited course completion transcripts',
        'Offline 3D lab simulation downloads',
      ],
      notIncluded: [],
    },
  ];

  const handleSelectPlan = (planId: SubscriptionPlan) => {
    sound.playSound('click');
    setSelectedPlanForCheckout(planId);
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'LAUNCH50') {
      setPromoApplied(true);
      sound.playSound('pop');
      onToast('50% Launch Discount successfully applied!', 'Promo Code');
    } else {
      onToast('Invalid promo code. Try LAUNCH50', 'Promo Code');
    }
  };

  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForCheckout) return;

    sound.playSound('success');
    confetti({ particleCount: 120, spread: 80 });

    onUpgradePlan(selectedPlanForCheckout);
    const planName = plans.find((p) => p.id === selectedPlanForCheckout)?.name || 'Subscription';
    onToast(
      `Congratulations! You are now enrolled in ${planName}. All premium 3D labs, videos, and masterclasses unlocked!`,
      '🎉 Membership Activated'
    );
    setSelectedPlanForCheckout(null);
    if (onClose) onClose();
  };

  const checkoutPlanObj = plans.find((p) => p.id === selectedPlanForCheckout);
  const basePrice = checkoutPlanObj
    ? isAnnual
      ? checkoutPlanObj.annualPrice
      : checkoutPlanObj.monthlyPrice
    : 0;
  const finalPrice = promoApplied ? Math.round(basePrice * 0.5) : basePrice;

  const modalBody = (
    <div className={`glass-panel w-full max-w-5xl rounded-3xl border border-slate-700/80 p-5 sm:p-8 space-y-7 shadow-2xl relative bg-slate-950/95 ${
      inline ? 'mx-auto' : 'max-h-[92vh] overflow-y-auto'
    }`}>
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-indigo-500/15 via-pink-500/10 to-transparent blur-3xl pointer-events-none"></div>

      {/* Modal Close Button */}
      {!inline && onClose && (
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition z-20"
        >
          <X size={20} />
        </button>
      )}

      {/* Header Hero Section */}
        <div className="text-center space-y-3 relative z-10 max-w-2xl mx-auto pt-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-pink-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-pink-400" />
            <span>Gitas Academy Student Membership</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Accelerate Your Learning with <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Immersive 3D Spatial Science</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            Join over 14,800+ scholars exploring quantum physics, calculus, humanities, and toddler phonics with interactive spatial simulations and verified tutor masterclasses.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-3 flex items-center justify-center space-x-3">
            <div className="bg-slate-900 border border-slate-700/80 p-1 rounded-2xl flex items-center shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setBillingCycle('monthly');
                  sound.playSound('click');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  !isAnnual ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => {
                  setBillingCycle('annual');
                  sound.playSound('click');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  isAnnual
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-extrabold">
                  SAVE 30%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 pt-2">
          {plans.map((p) => {
            const isSelectedCurrent = currentPlan === p.id;
            const price = isAnnual ? p.annualPrice : p.monthlyPrice;

            return (
              <div
                key={p.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative group ${
                  p.popular
                    ? 'bg-gradient-to-b from-indigo-950/70 via-slate-900 to-slate-950 border-2 border-indigo-500 shadow-2xl shadow-indigo-600/20 scale-[1.02]'
                    : p.id === 'genius'
                    ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 hover:border-amber-400'
                    : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Popular / Best Value Badge */}
                {p.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-500 text-white shadow-lg whitespace-nowrap">
                    {p.badge}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Plan Name & Tagline */}
                  <div>
                    <h3 className="text-lg font-extrabold text-white font-heading">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{p.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="py-2 border-y border-slate-800/80 flex items-baseline space-x-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-white font-heading">
                      ${price}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      / student / month
                    </span>
                    {isAnnual && (
                      <span className="text-[10px] text-emerald-400 font-semibold ml-auto">
                        Billed annually (${price * 12}/yr)
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 pt-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Included with {p.name}:
                    </span>
                    <ul className="space-y-2 text-xs">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-start space-x-2 text-slate-200">
                          <CheckCircle2
                            size={14}
                            className={`flex-shrink-0 mt-0.5 ${
                              p.popular
                                ? 'text-indigo-400'
                                : p.id === 'genius'
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          />
                          <span className="leading-tight">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Call to Action Button */}
                <div className="pt-6">
                  {isSelectedCurrent ? (
                    <div className="w-full py-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-center font-bold text-xs flex items-center justify-center space-x-2">
                      <Check size={15} />
                      <span>Current Active Plan</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(p.id)}
                      className={`w-full py-3.5 rounded-2xl font-extrabold text-xs transition flex items-center justify-center space-x-2 shadow-lg ${
                        p.popular
                          ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white shadow-indigo-600/30'
                          : p.id === 'genius'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                    >
                      <span>Choose {p.name}</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Testimonials & Trust Indicators */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="flex text-amber-400 space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="currentColor" />
              ))}
            </div>
            <p className="italic text-slate-200">
              "The 3D quantum simulation completely transformed my physics grades. I went from a B- to a 98% A+ on orbital mechanics!"
            </p>
            <p className="text-[10px] text-slate-400 font-semibold">— Sophia Chen, Grade 8 Honors Scholar</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="flex text-amber-400 space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="currentColor" />
              ))}
            </div>
            <p className="italic text-slate-200">
              "Being able to watch Dr. Thorne's lectures with synchronized 3D curve plotting makes multivariable calculus intuitive."
            </p>
            <p className="text-[10px] text-slate-400 font-semibold">— Marcus Brody, Academy Core Student</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="flex text-amber-400 space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="currentColor" />
              ))}
            </div>
            <p className="italic text-slate-200">
              "The Toddler Discovery Pod gives my 4-year-old tactile phonics learning that is completely ad-free and safe."
            </p>
            <p className="text-[10px] text-slate-400 font-semibold">— Elena Rostova, Homeschooling Parent</p>
          </div>
        </div>

        {/* Money Back Guarantee Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Risk-Free 30-Day Academic Guarantee
              </h4>
              <p className="text-[11px] text-slate-300">
                If Gitas Academy doesn't measurably boost your grades or understanding, receive a 100% refund with one click.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-400 flex-shrink-0">
            <Lock size={13} className="text-indigo-400" />
            <span>256-bit SSL Encrypted Billing</span>
          </div>
        </div>

        {/* CHECKOUT MODAL OVERLAY (When a plan is selected) */}
        {selectedPlanForCheckout && checkoutPlanObj && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-lg rounded-3xl border border-indigo-500/50 p-6 sm:p-7 space-y-5 shadow-2xl bg-slate-950 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <CreditCard size={18} className="text-indigo-400" />
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Confirm Enrollment Checkout
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPlanForCheckout(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Selected Plan Summary Card */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider">
                    Selected Membership
                  </span>
                  <h4 className="text-base font-extrabold text-white">{checkoutPlanObj.name}</h4>
                  <p className="text-xs text-slate-300">
                    {isAnnual ? 'Annual Billing (30% discount)' : 'Monthly Flexible Subscription'}
                  </p>
                </div>
                <div className="text-right">
                  {promoApplied && (
                    <span className="text-xs text-slate-500 line-through mr-1.5">${basePrice}</span>
                  )}
                  <span className="text-2xl font-black text-amber-400 font-heading">
                    ${finalPrice}
                  </span>
                  <span className="text-xs text-slate-400">/mo</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Gift size={13} className="text-pink-400" />
                  <span>Student Promo Code</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    <span>LAUNCH50 applied: 50% discount on initial billing!</span>
                  </p>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 rounded-xl border font-bold transition flex items-center justify-center space-x-1.5 ${
                      paymentMethod === 'card'
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CreditCard size={13} />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('gpay')}
                    className={`py-2 px-3 rounded-xl border font-bold transition flex items-center justify-center space-x-1.5 ${
                      paymentMethod === 'gpay'
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>Google Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('applepay')}
                    className={`py-2 px-3 rounded-xl border font-bold transition flex items-center justify-center space-x-1.5 ${
                      paymentMethod === 'applepay'
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>Apple Pay</span>
                  </button>
                </div>
              </div>

              {/* Card Form Simulation */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-medium text-slate-400 block mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <label className="text-[11px] font-medium text-slate-400 block mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white text-center font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-slate-400 block mb-1">CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white text-center font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Complete Purchase Button */}
              <button
                type="button"
                onClick={handleCompleteCheckout}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2"
              >
                <Lock size={14} />
                <span>Confirm & Activate {checkoutPlanObj.name} (${finalPrice}/mo)</span>
              </button>

              <p className="text-[10px] text-center text-slate-400">
                Includes instant access to all 3D physics labs & video masterclasses. Cancel anytime.
              </p>
            </div>
          </div>
        )}
      </div>
    );

  if (inline) {
    return <div className="w-full py-2 animate-in fade-in duration-300">{modalBody}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      {modalBody}
    </div>
  );
};
