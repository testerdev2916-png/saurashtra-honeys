import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  Bot,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  HelpCircle,
  X,
  ShoppingCart,
  ShieldCheck,
  Droplets,
  Flower2,
  Beaker,
  ChevronRight,
  Flame,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { type Product } from "@/lib/products";
import { toast } from "sonner";

export type AiHoneyFinderProps = {
  products?: Product[];
  triggerVariant?: "button" | "banner" | "floating";
  className?: string;
};

type QuizStep = "wellness" | "flavor" | "usage" | "result";

type KnowledgeEntry = {
  q: string;
  category: string;
  a: string;
};

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    q: "Why does raw honey crystallize, and is it a sign of adulteration?",
    category: "Purity & Nature",
    a: "Natural crystallization is actually the #1 proof of authentic, raw, unheated honey. Raw honey contains natural glucose and fructose. Glucose naturally forms fine crystals around microscopic pollen particles. Industrial honey doesn't crystallize because factories boil it (killing all beneficial enzymes) and ultra-filter it. To reliquify your raw honey, gently place the glass jar in a warm water bowl (under 40°C). Never microwave raw honey.",
  },
  {
    q: "Can I give Saurashtra Honey to my 6-month or 10-month-old baby?",
    category: "Safety & Age",
    a: "No. In accordance with pediatric safety guidelines worldwide, honey—no matter how pure or organic—should NEVER be given to infants under 12 months (1 year) of age. Infant intestines are not yet mature enough to handle natural environmental Clostridium botulinum spores. For children aged 1 year and older, it is completely safe and deeply nourishing.",
  },
  {
    q: "How does Saurashtra Honey test for purity?",
    category: "Lab Testing",
    a: "Every single harvest batch is independently tested in NABL-accredited laboratories. We verify moisture content (strictly below 20%), Hydroxymethylfurfural (HMF) levels (confirming the honey has never been overheated), natural pollen density, and sucrose-to-reducing sugars ratio to ensure zero sugar syrup, HFCS, or jaggery adulteration.",
  },
  {
    q: "Which honey is best for acidity, bloating, and digestion?",
    category: "Health Guide",
    a: "Ajwain Blossom Raw Honey is our top recommendation for digestive health. It is mono-floral honey harvested directly from blooming carom (ajwain) seed fields in Gujarat. Rich in natural thymol and enzymes, Ayurveda recommends taking a teaspoon in warm water before meals to soothe acidity, gas, and indigestion.",
  },
  {
    q: "What makes Saurashtra Honey 'Unheated'?",
    category: "Harvesting",
    a: "Commercial brands heat honey up to 70°C–80°C to make it flow like syrup and prevent shelf crystallization. Overheating destroys beneficial enzymes like invertase, diastase, and glucose oxidase. Saurashtra Honey is kept strictly below 35°C—the natural temperature maintained inside a living beehive.",
  },
  {
    q: "How should I store raw honey?",
    category: "Storage",
    a: "Keep it in its original glass jar at normal room temperature, tightly sealed, in a dry pantry away from direct intense sunlight. Do not refrigerate, as cold temperatures accelerate crystallization. Because pure honey has natural antibacterial properties and low moisture, it does not spoil and remains fresh for years.",
  },
];

export function AiHoneyFinder({
  products = [],
  triggerVariant = "button",
  className = "",
}: AiHoneyFinderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"quiz" | "ask">("quiz");

  // Quiz state
  const [step, setStep] = useState<QuizStep>("wellness");
  const [wellnessGoal, setWellnessGoal] = useState<string>("");
  const [flavorPref, setFlavorPref] = useState<string>("");
  const [usageRoutine, setUsageRoutine] = useState<string>("");

  // Ask AI state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaq, setSelectedFaq] = useState<KnowledgeEntry | null>(KNOWLEDGE_BASE[0]);

  const { add, setOpen: setCartOpen } = useCart();

  const resetQuiz = () => {
    setStep("wellness");
    setWellnessGoal("");
    setFlavorPref("");
    setUsageRoutine("");
  };

  // Recommendation matching logic
  const recommendation = useMemo(() => {
    if (step !== "result") return null;

    let matchedSlug = "wildflower-honey";
    let matchScore = 96;
    let rationale = "A versatile raw honey perfect for daily wellness and natural energy.";
    let secondarySlug = "ajwain-honey";

    if (wellnessGoal === "digestion" || flavorPref === "herbal") {
      matchedSlug = "ajwain-honey";
      matchScore = 99;
      rationale =
        "Formulated with natural thymol from Gujarat's carom blossoms, ideal for relieving bloating, acidity, and gut distress.";
      secondarySlug = "fennel-honey";
    } else if (wellnessGoal === "cooling" || flavorPref === "subtle") {
      matchedSlug = "fennel-honey";
      matchScore = 98;
      rationale =
        "Infused with nectar from Gujarat's fennel blooms, renowned for cooling digestive benefits and soothing throat comfort.";
      secondarySlug = "wildflower-honey";
    } else if (wellnessGoal === "kids" || flavorPref === "fruity") {
      matchedSlug = "lychee-honey";
      matchScore = 97;
      rationale =
        "Delicately fragrant and fruity with low acidity—a favorite for children (1yr+) and morning fruit bowls.";
      secondarySlug = "wildflower-honey";
    } else if (wellnessGoal === "artisan" || flavorPref === "comb") {
      matchedSlug = "raw-honeycomb";
      matchScore = 98;
      rationale =
        "The purest form of honey on Earth: unextracted, intact hexagonal comb filled with raw nectar and natural bee propolis.";
      secondarySlug = "wildflower-honey";
    }

    // Try finding in products catalog
    const primaryProd =
      products.find((p) => p.slug === matchedSlug) ||
      products.find((p) => p.slug.includes(matchedSlug.split("-")[0])) ||
      products[0] ||
      null;

    const secondaryProd =
      products.find((p) => p.slug === secondarySlug) ||
      products.find((p) => p.slug !== matchedSlug) ||
      products[1] ||
      null;

    return {
      primary: primaryProd,
      secondary: secondaryProd,
      matchScore,
      rationale,
      targetSlug: matchedSlug,
    };
  }, [step, wellnessGoal, flavorPref, usageRoutine, products]);

  const handleAddToCart = (prod: Product) => {
    add(prod, prod.sizes?.[0] || "500g", 1);
    toast.success(`Added ${prod.name} to cart!`);
    setIsOpen(false);
    setCartOpen(true);
  };

  const filteredKnowledge = useMemo(() => {
    if (!searchQuery.trim()) return KNOWLEDGE_BASE;
    const q = searchQuery.toLowerCase();
    return KNOWLEDGE_BASE.filter(
      (k) =>
        k.q.toLowerCase().includes(q) ||
        k.a.toLowerCase().includes(q) ||
        k.category.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <>
      {/* Trigger Rendering */}
      {triggerVariant === "floating" && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-24 right-4 z-40 bg-[#2B2118] text-[#FDFBF7] border border-[#D97706]/40 shadow-xl rounded-full px-4 py-3 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 hover:bg-[#3d2e23] hover:border-[#D97706] group ${className}`}
          aria-label="Open AI Honey Sommelier"
        >
          <div className="size-7 rounded-full bg-[#D97706] text-white flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform">
            <Sparkles className="size-4 animate-pulse" />
          </div>
          <div className="text-left hidden sm:block pr-1">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-[#D97706]">
              AI Sommelier
            </span>
            <span className="block text-xs font-semibold">Find Your Honey</span>
          </div>
        </button>
      )}

      {triggerVariant === "banner" && (
        <div
          className={`bg-gradient-to-r from-[#2B2118] via-[#3B2C21] to-[#2B2118] rounded-2xl p-6 md:p-8 text-[#FDFBF7] border border-[#D97706]/30 shadow-md relative overflow-hidden my-8 ${className}`}
        >
          <div className="absolute -right-8 -top-8 size-48 rounded-full bg-[#D97706]/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/30 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                <Sparkles className="size-3.5" /> AI HONEY SOMMELIER
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-white font-bold leading-tight">
                Not sure which floral harvest fits your routine?
              </h3>
              <p className="text-sm text-[#FDFBF7]/80 max-w-xl">
                Take our 45-second interactive quiz or ask our AI knowledge guide about natural
                enzymes, digestion benefits, and lab purity.
              </p>
            </div>
            <button
              onClick={() => {
                resetQuiz();
                setIsOpen(true);
              }}
              className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold px-6 py-3.5 rounded-full text-xs tracking-widest uppercase transition-all shadow-md hover:shadow-lg hover:scale-105 whitespace-nowrap flex items-center gap-2"
            >
              FIND MY PERFECT HONEY <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {triggerVariant === "button" && (
        <button
          onClick={() => {
            resetQuiz();
            setIsOpen(true);
          }}
          className={`inline-flex items-center gap-2 bg-[#FDFBF7] border border-[#D97706]/40 hover:border-[#D97706] text-[#2B2118] hover:text-[#D97706] px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all shadow-sm ${className}`}
        >
          <Sparkles className="size-3.5 text-[#D97706]" />
          <span>AI HONEY SOMMELIER</span>
        </button>
      )}

      {/* Sommelier Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-[#FDFBF7] text-[#2B2118] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#D97706]/30 overflow-hidden flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="bg-[#2B2118] text-[#FDFBF7] px-6 py-4 flex items-center justify-between border-b border-[#D97706]/20">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-[#D97706] text-white flex items-center justify-center shadow-sm">
                  <Bot className="size-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold flex items-center gap-2 text-white">
                    Saurashtra Honey AI Sommelier
                    <span className="text-[10px] bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-sans font-bold">
                      Interactive
                    </span>
                  </h2>
                  <p className="text-xs text-[#FDFBF7]/70">
                    Artisanal matchmaking & pure raw honey science
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-[#FDFBF7] flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Sub-nav Tabs */}
            <div className="flex border-b border-border/80 bg-[#F4EFEA] px-6 pt-2">
              <button
                onClick={() => setActiveTab("quiz")}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
                  activeTab === "quiz"
                    ? "border-[#D97706] text-[#D97706]"
                    : "border-transparent text-[#6B6257] hover:text-[#2B2118]"
                }`}
              >
                <Sparkles className="size-4" />
                3-Question Honey Matcher
              </button>
              <button
                onClick={() => setActiveTab("ask")}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
                  activeTab === "ask"
                    ? "border-[#D97706] text-[#D97706]"
                    : "border-transparent text-[#6B6257] hover:text-[#2B2118]"
                }`}
              >
                <HelpCircle className="size-4" />
                Ask AI & Purity FAQs
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {activeTab === "quiz" && (
                <div>
                  {/* Step 1: Wellness Goal */}
                  {step === "wellness" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-[#6B6257]">
                        <span>STEP 1 OF 3</span>
                        <span className="font-bold text-[#D97706]">HEALTH & GOALS</span>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-[#2B2118]">
                        What is your primary wellness goal?
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {[
                          {
                            id: "digestion",
                            title: "Digestion, Acidity & Bloating",
                            desc: "Natural thymol & enzymes for gut ease",
                            icon: Flame,
                          },
                          {
                            id: "immunity",
                            title: "Daily Immunity & Energy",
                            desc: "Broad-spectrum wild floral antioxidants",
                            icon: ShieldCheck,
                          },
                          {
                            id: "cooling",
                            title: "Cooling & Throat Soothing",
                            desc: "Digestive cooling & calming Ayurvedic care",
                            icon: Droplets,
                          },
                          {
                            id: "kids",
                            title: "Kids & Everyday Breakfast",
                            desc: "Delicate sweetness for warm milk & cereals",
                            icon: Flower2,
                          },
                          {
                            id: "artisan",
                            title: "Raw Honeycomb Delicacy",
                            desc: "Whole comb with natural bee propolis",
                            icon: Beaker,
                          },
                        ].map(({ id, title, desc, icon: Icon }) => (
                          <button
                            key={id}
                            onClick={() => {
                              setWellnessGoal(id);
                              setStep("flavor");
                            }}
                            className={`p-4 rounded-2xl border text-left transition-all group flex items-start gap-3.5 hover:border-[#D97706] hover:bg-white hover:shadow-sm ${
                              wellnessGoal === id
                                ? "border-[#D97706] bg-white ring-1 ring-[#D97706]"
                                : "border-border/80 bg-[#FAF7F2]"
                            }`}
                          >
                            <div className="size-8 rounded-xl bg-[#D97706]/15 text-[#D97706] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                              <Icon className="size-4" />
                            </div>
                            <div>
                              <div className="font-serif font-bold text-base text-[#2B2118] group-hover:text-[#D97706] transition-colors">
                                {title}
                              </div>
                              <div className="text-xs text-[#6B6257] mt-0.5">{desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Flavor Profile */}
                  {step === "flavor" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-[#6B6257]">
                        <span>STEP 2 OF 3</span>
                        <span className="font-bold text-[#D97706]">FLAVOR PREFERENCE</span>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-[#2B2118]">
                        What kind of taste profile do you prefer?
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {[
                          {
                            id: "herbal",
                            title: "Warm, Herbal & Aromatic",
                            desc: "Distinct natural botanical spice notes",
                          },
                          {
                            id: "classic",
                            title: "Classic Deep Golden Sweet",
                            desc: "Rich wildflower nectar with caramel finish",
                          },
                          {
                            id: "fruity",
                            title: "Light, Floral & Fruity",
                            desc: "Gentle aromatic citrus/lychee blossom notes",
                          },
                          {
                            id: "subtle",
                            title: "Mild, Cooling & Licorice",
                            desc: "Calming sweet fennel and delicate herbal tone",
                          },
                          {
                            id: "comb",
                            title: "Pure Rustic Honeycomb",
                            desc: "Chewy natural beeswax straight from the frame",
                          },
                        ].map(({ id, title, desc }) => (
                          <button
                            key={id}
                            onClick={() => {
                              setFlavorPref(id);
                              setStep("usage");
                            }}
                            className={`p-4 rounded-2xl border text-left transition-all hover:border-[#D97706] hover:bg-white hover:shadow-sm ${
                              flavorPref === id
                                ? "border-[#D97706] bg-white ring-1 ring-[#D97706]"
                                : "border-border/80 bg-[#FAF7F2]"
                            }`}
                          >
                            <div className="font-serif font-bold text-base text-[#2B2118]">
                              {title}
                            </div>
                            <div className="text-xs text-[#6B6257] mt-0.5">{desc}</div>
                          </button>
                        ))}
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => setStep("wellness")}
                          className="text-xs text-[#6B6257] hover:text-[#2B2118] font-bold underline"
                        >
                          ← Back to previous question
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Usage Routine */}
                  {step === "usage" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-[#6B6257]">
                        <span>STEP 3 OF 3</span>
                        <span className="font-bold text-[#D97706]">DAILY RITUAL</span>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-[#2B2118]">
                        How will you use it most often?
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {[
                          {
                            id: "morning",
                            title: "Morning Warm Water / Green Tea",
                            desc: "Daily morning cleanse & metabolism boost",
                          },
                          {
                            id: "medicinal",
                            title: "Throat, Cough & Digestion Relief",
                            desc: "Direct spoon dose for natural relief",
                          },
                          {
                            id: "breakfast",
                            title: "Pancakes, Oats & Breakfast",
                            desc: "Natural drizzle for everyday family meals",
                          },
                          {
                            id: "gourmet",
                            title: "Gourmet Platter & Gifting",
                            desc: "Cheese boards, desserts, and special gifts",
                          },
                        ].map(({ id, title, desc }) => (
                          <button
                            key={id}
                            onClick={() => {
                              setUsageRoutine(id);
                              setStep("result");
                            }}
                            className={`p-4 rounded-2xl border text-left transition-all hover:border-[#D97706] hover:bg-white hover:shadow-sm ${
                              usageRoutine === id
                                ? "border-[#D97706] bg-white ring-1 ring-[#D97706]"
                                : "border-border/80 bg-[#FAF7F2]"
                            }`}
                          >
                            <div className="font-serif font-bold text-base text-[#2B2118]">
                              {title}
                            </div>
                            <div className="text-xs text-[#6B6257] mt-0.5">{desc}</div>
                          </button>
                        ))}
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => setStep("flavor")}
                          className="text-xs text-[#6B6257] hover:text-[#2B2118] font-bold underline"
                        >
                          ← Back to previous question
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: AI Result */}
                  {step === "result" && recommendation && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-2xl border border-[#D97706]/40 p-5 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 bg-[#D97706]/15 text-[#D97706] px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                            <Sparkles className="size-3.5" /> {recommendation.matchScore}% AI
                            COMPATIBILITY
                          </span>
                          <button
                            onClick={resetQuiz}
                            className="text-xs text-[#6B6257] hover:text-[#D97706] font-bold flex items-center gap-1"
                          >
                            <RotateCcw className="size-3.5" /> Retake Quiz
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-5 items-center">
                          {recommendation.primary?.image && (
                            <img
                              src={recommendation.primary.image}
                              alt={recommendation.primary.name}
                              className="size-28 rounded-xl object-cover border border-border/80 shrink-0"
                            />
                          )}
                          <div className="space-y-1.5 text-center sm:text-left flex-1">
                            <div className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
                              {recommendation.primary?.flora || "Artisanal Raw Harvest"}
                            </div>
                            <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#2B2118]">
                              {recommendation.primary?.name || "Saurashtra Raw Honey"}
                            </h4>
                            <p className="text-xs text-[#6B6257] leading-relaxed">
                              {recommendation.rationale}
                            </p>
                            <div className="pt-1 flex items-center justify-center sm:justify-start gap-3">
                              <span className="text-lg font-bold text-[#2B2118]">
                                ₹{recommendation.primary?.price || 499}
                              </span>
                              <span className="text-xs text-[#3B5241] font-semibold bg-[#3B5241]/10 px-2 py-0.5 rounded">
                                In Stock • Free shipping over ₹799
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                          {recommendation.primary && (
                            <button
                              onClick={() => handleAddToCart(recommendation.primary!)}
                              className="w-full sm:flex-1 bg-[#D97706] hover:bg-[#B45309] text-white font-bold py-3 rounded-xl text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                              <ShoppingCart className="size-4" /> ADD RECOMMENDED JAR
                            </button>
                          )}
                          <Link
                            to="/product/$slug"
                            params={{ slug: recommendation.targetSlug }}
                            onClick={() => setIsOpen(false)}
                            className="w-full sm:w-auto text-center px-4 py-3 rounded-xl border border-border text-xs font-bold text-[#2B2118] hover:bg-[#FAF7F2] transition-colors"
                          >
                            View Full Batch Details →
                          </Link>
                        </div>
                      </div>

                      {/* Runner-up card */}
                      {recommendation.secondary && (
                        <div className="p-4 rounded-xl border border-border/80 bg-[#FAF7F2] flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-[#2B2118] text-white flex items-center justify-center text-xs font-bold shrink-0">
                              #2
                            </div>
                            <div>
                              <div className="text-[11px] font-bold text-[#6B6257] uppercase">
                                Alternative Match
                              </div>
                              <div className="font-serif font-bold text-sm text-[#2B2118]">
                                {recommendation.secondary.name}
                              </div>
                            </div>
                          </div>
                          <Link
                            to="/product/$slug"
                            params={{ slug: recommendation.secondary.slug }}
                            onClick={() => setIsOpen(false)}
                            className="text-xs font-bold text-[#D97706] hover:underline whitespace-nowrap"
                          >
                            Explore →
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Ask AI & Purity FAQs */}
              {activeTab === "ask" && (
                <div className="space-y-5">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ask about crystallization, infant safety, NMR testing, enzymes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 rounded-xl bg-white border border-border/90 text-sm focus:outline-none focus:border-[#D97706] shadow-inner"
                    />
                    <Sparkles className="size-4 text-[#D97706] absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Questions list */}
                    <div className="md:col-span-5 space-y-2 max-h-80 overflow-y-auto pr-1">
                      {filteredKnowledge.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedFaq(item)}
                          className={`w-full p-3 rounded-xl text-left text-xs transition-all border ${
                            selectedFaq?.q === item.q
                              ? "bg-white border-[#D97706] text-[#D97706] font-bold shadow-sm"
                              : "bg-[#FAF7F2] border-transparent text-[#2B2118] hover:bg-white"
                          }`}
                        >
                          <span className="block text-[10px] text-[#6B6257] uppercase font-bold tracking-wider mb-1">
                            {item.category}
                          </span>
                          <span className="line-clamp-2 leading-relaxed">{item.q}</span>
                        </button>
                      ))}
                    </div>

                    {/* Active Question detail */}
                    <div className="md:col-span-7 bg-white rounded-2xl p-5 border border-border/80 flex flex-col justify-between">
                      {selectedFaq ? (
                        <div className="space-y-3">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-[#D97706] bg-[#D97706]/10 px-2.5 py-0.5 rounded">
                            <CheckCircle2 className="size-3" /> VERIFIED APIARY FACT
                          </span>
                          <h4 className="font-serif text-lg font-bold text-[#2B2118] leading-snug">
                            {selectedFaq.q}
                          </h4>
                          <p className="text-xs sm:text-sm text-[#6B6257] leading-relaxed whitespace-pre-wrap">
                            {selectedFaq.a}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-10 text-xs text-[#6B6257]">
                          Select a question to view the verified answer.
                        </div>
                      )}

                      <div className="pt-4 border-t border-border/60 mt-4 flex items-center justify-between text-[11px] text-[#6B6257]">
                        <span>Need batch lab reports?</span>
                        <a
                          href="https://wa.me/919664637665?text=Hello,%20I%20would%20like%20to%20request%20the%20NABL%20purity%20lab%20report."
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-[#D97706] hover:underline"
                        >
                          WhatsApp Customer Care →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-[#FAF7F2] px-6 py-3 border-t border-border/80 flex items-center justify-between text-[11px] text-[#6B6257]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-[#3B5241]" />
                100% Raw • Unpasteurized • NABL Lab Certified
              </span>
              <span>Saurashtra Honey Bee Farm</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
