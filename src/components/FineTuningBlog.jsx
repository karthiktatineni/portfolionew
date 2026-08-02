import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  Terminal, 
  Zap, 
  HelpCircle, 
  TrendingUp, 
  Award, 
  Brain
} from 'lucide-react';
import SmoothScroll from './SmoothScroll';
import Cursor from './Cursor';

// ==========================================
// SIMPLIFIED DATA FOR CLEAR VISUALIZATION
// ==========================================

const TOPIC_COMPARISONS = [
  { name: "Data Structures", base: 0.9, tuned: 3.9, percentage: "+333%" },
  { name: "Python Coding", base: 0.9, tuned: 3.9, percentage: "+333%" },
  { name: "Algorithms", base: 1.0, tuned: 3.8, percentage: "+280%" },
  { name: "Machine Learning", base: 1.4, tuned: 3.8, percentage: "+171%" },
  { name: "DevOps & Cloud", base: 1.6, tuned: 3.7, percentage: "+131%" },
  { name: "Web Development", base: 1.3, tuned: 3.7, percentage: "+184%" },
  { name: "LLM & AI Tasks", base: 1.0, tuned: 3.7, percentage: "+270%" },
  { name: "Code Debugging", base: 0.3, tuned: 3.6, percentage: "+1100%" },
  { name: "System Design", base: 0.9, tuned: 3.5, percentage: "+288%" },
  { name: "Databases & SQL", base: 0.6, tuned: 3.4, percentage: "+466%" },
];

const PROMPT_EXAMPLES = [
  {
    id: "algo_01",
    label: "Quicksort Algorithm",
    category: "Algorithms",
    simpleQuestion: "Can you write a Quicksort function in Python with explanations?",
    baseOutput: `author: Brian Macharia
:date: 2022-04-10
"""

from typing import List

def quicksort(arr: List[int]) -> List[int]:
    """
    Quicksort is a divide and conquer algorithm...
    """

    if len(arr) <= 1:
        return arr
    else:
        pivot = arr[0]
        less_than_pivot = [x for x in arr[1:] if x <= pivot]
        greater_than_pivot = [x for x in arr[1:] if x > pivot]
        return quicksort(less_than_pivot) + [pivot] + quicksort(great... [cuts off]`,
    baseExplanation: "❌ Failed: Added fake blog metadata at the top, forgot complexity analysis, and cut off midway.",
    tunedOutput: `Certainly! Here is Quicksort in Python with type hints and complexity analysis:

from typing import List, Any

def quicksort(arr: List[Any]) -> List[Any]:
    """
    Time Complexity:
    - Best & Average: O(n log n)
    - Worst Case: O(n^2)
    """
    if len(arr) <= 1:
        return arr
    pivot = arr[0]
    left = [x for x in arr[1:] if x <= pivot]
    right = [x for x in arr[1:] if x > pivot]
    return quicksort(left) + [pivot] + quicksort(right)`,
    tunedExplanation: "✅ Success: Opened directly, gave full complexity breakdown, clean code, no fluff."
  },
  {
    id: "debug_06",
    label: "Code Refactoring",
    category: "Clean Code",
    simpleQuestion: "How do I refactor duplicate code to make it clean?",
    baseOutput: `PROPERTIES:
:ID:        c4e4f230-4f36-4c96-874c-477c9f2f6c55
:END:

- [ ] 1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1...`,
    baseExplanation: "❌ Failed: The AI got stuck in a repetitive loop printing '1.1.1.1...' over and over.",
    tunedOutput: `Here is how to clean up duplicated code using a reusable function:

# Before (Repeated code):
def process_user_a(data):
    return data.strip().lower()

def process_user_b(data):
    return data.strip().lower()

# Refactored (Clean & DRY):
def sanitize_input(data: str) -> str:
    return data.strip().lower()

def process_user_a(data):
    return sanitize_input(data)

def process_user_b(data):
    return sanitize_input(data)`,
    tunedExplanation: "✅ Success: Showed clear before-and-after examples with easy-to-understand explanations."
  },
  {
    id: "sql_01",
    label: "Top 5 SQL Customers",
    category: "Database",
    simpleQuestion: "Write a SQL query to find our top 5 spending customers.",
    baseOutput: `author: 
:tags: SQL, window functions
:category: SQL

Introduction
------------
Window functions are a powerful feature in SQL...

CREATE TABLE sales (id INT, customer_id INT...);

SELECT customer_id, SUM(sale_amount) AS total_sales
FROM sales GROUP BY customer_id... [never finishes query]`,
    baseExplanation: "❌ Failed: Buried the query under blog text and didn't even show the window function.",
    tunedOutput: `WITH RankedCustomers AS (
    SELECT 
        customer_id,
        SUM(amount) AS total_spent,
        DENSE_RANK() OVER (ORDER BY SUM(amount) DESC) as rank_pos
    FROM sales
    GROUP BY customer_id
)
SELECT customer_id, total_spent
FROM RankedCustomers
WHERE rank_pos <= 5;`,
    tunedExplanation: "✅ Success: Directly outputs a clean SQL window function query ready to copy and run."
  },
  {
    id: "web_09",
    label: "OpenAPI Documentation",
    category: "Web API",
    simpleQuestion: "Write an OpenAPI schema for a web service.",
    baseOutput: `octocat: Create OpenAPI documentation examples.
:octocat: Create OpenAPI documentation examples.
:octocat: Create OpenAPI documentation examples.
:octocat: Create OpenAPI documentation examples.
... [repeats line 30 times]`,
    baseExplanation: "❌ Failed: Kept echoing the prompt line 30 times instead of writing the requested file.",
    tunedOutput: `openapi: 3.0.3
info:
  title: User Management API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Retrieve all users
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object`,
    tunedExplanation: "✅ Success: Generates standard OpenAPI 3.0 YAML documentation instantly."
  },
  {
    id: "ml_01",
    label: "Machine Learning Classifier",
    category: "AI & ML",
    simpleQuestion: "How do I train a Random Forest classifier in Python?",
    baseOutput: `end_label:
.. code-block:: python
    from sklearn.ensemble import RandomForestClassifier
    rfc = RandomForestClassifier(n_estimators=100)
    rfc.fit(X_train, y_train)

.. rst-class:: sphx-glr-script-out
    RandomForestClassifier(n_estimators=100)
**Total running time:** ( 0 minutes 0.00 seconds)`,
    baseExplanation: "❌ Failed: Wrapped simple code in confusing auto-generated documentation markup.",
    tunedOutput: `Here is a complete step-by-step example using Scikit-Learn:

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# 1. Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# 2. Train model
clf = RandomForestClassifier(n_estimators=100)
clf.fit(X_train, y_train)

# 3. Predict & evaluate
predictions = clf.predict(X_test)
print("Accuracy:", accuracy_score(y_test, predictions))`,
    tunedExplanation: "✅ Success: Easy step-by-step Python code with imports, data splitting, and evaluation."
  }
];

const LORA_BENCHMARKS = [
  { name: "Python Basics", category: "Coding", score: 72.1, exec: "3.9m", status: "GOOD" },
  { name: "Python Advanced", category: "Coding", score: 62.8, exec: "6.2m", status: "NEEDS WORK" },
  { name: "JavaScript & Frontend", category: "Coding", score: 88.9, exec: "3.5m", status: "EXCELLENT" },
  { name: "Java Programming", category: "Coding", score: 87.0, exec: "4.4m", status: "EXCELLENT" },
  { name: "C++ Programming", category: "Coding", score: 88.0, exec: "4.9m", status: "EXCELLENT" },
  { name: "Go Programming", category: "Coding", score: 91.0, exec: "4.1m", status: "EXCELLENT" },
  { name: "Rust Systems Code", category: "Coding", score: 85.2, exec: "4.6m", status: "EXCELLENT" },
  { name: "HTML & CSS Styling", category: "Web", score: 64.3, exec: "4.8m", status: "NEEDS WORK" },
  { name: "React Development", category: "Web", score: 74.7, exec: "4.6m", status: "GOOD" },
  { name: "Pandas Data Analysis", category: "Data Science", score: 81.0, exec: "5.3m", status: "EXCELLENT" },
  { name: "NumPy Computations", category: "Data Science", score: 83.0, exec: "5.3m", status: "EXCELLENT" },
  { name: "Scikit-Learn ML", category: "AI & ML", score: 91.0, exec: "5.3m", status: "EXCELLENT" },
  { name: "TensorFlow Basics", category: "AI & ML", score: 84.0, exec: "5.4m", status: "EXCELLENT" },
  { name: "Sorting Algorithms", category: "Algorithms", score: 90.7, exec: "5.1m", status: "EXCELLENT" },
  { name: "Search Algorithms", category: "Algorithms", score: 86.7, exec: "5.4m", status: "EXCELLENT" },
  { name: "Dynamic Programming", category: "Algorithms", score: 74.0, exec: "5.2m", status: "GOOD" },
  { name: "REST API Design", category: "Web", score: 73.3, exec: "5.3m", status: "GOOD" },
  { name: "SQL & Databases", category: "Databases", score: 66.0, exec: "4.7m", status: "GOOD" },
  { name: "Text Processing & NLP", category: "General", score: 93.7, exec: "5.1m", status: "BEST" },
  { name: "Git Workflow & DevOps", category: "General", score: 88.0, exec: "5.2m", status: "EXCELLENT" }
];

export default function FineTuningBlog({ isTouch }) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredBenchmarks = selectedCategory === "All" 
    ? LORA_BENCHMARKS 
    : LORA_BENCHMARKS.filter(b => b.category === selectedCategory);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-gray-200 font-body selection:bg-gold selection:text-black">
      <SmoothScroll />
      {!isTouch && <Cursor />}

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-800/80 px-6 py-5">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold tracking-tighter text-white group flex items-center gap-2">
            <span className="text-gold">K</span><span className="group-hover:text-gold transition-colors duration-300">ARTHIK</span>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold uppercase tracking-wider ml-2">
              Fine-Tuning Blog
            </span>
          </a>

          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-5 py-2.5 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-black transition-all duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Portfolio
          </a>
        </div>
      </header>

      {/* MAIN CONTAINER WITH GENEROUS SECTION PADDINGS */}
      <main className="container mx-auto px-6 py-16 sm:py-24 space-y-0">

        {/* 01 HERO SECTION */}
        <section className="space-y-8 max-w-4xl pt-8 pb-24 sm:pb-36 border-b border-gray-800/80">
          <div className="inline-flex items-center gap-2 text-gold font-display tracking-[0.2em] text-sm uppercase">
            <Sparkles className="w-4 h-4" />
            <span>01. AI Research & Benchmarks</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold font-display text-white tracking-tight leading-[1.1]">
            Did Fine-Tuning Make the <span className="text-gold">AI Smarter?</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 font-light leading-relaxed">
            We tested a raw, standard AI model (<code className="text-gold bg-gold/10 px-2 py-0.5 rounded font-mono text-base">DeepSeek-Coder-6.7B</code>) against a custom fine-tuned version trained on <strong>100,000 coding prompts</strong>. Here is the clear, visual breakdown of what changed.
          </p>

          <div className="w-24 h-1 bg-gold rounded-full" />
        </section>

        {/* EXPLAIN IT LIKE I'M 5 (ANALOGY CARD) */}
        <section className="pt-20 sm:pt-32 pb-24 sm:pb-36 border-b border-gray-800/80 space-y-8">
          <div className="p-8 sm:p-12 bg-gray-900/40 border border-gray-800 rounded-3xl backdrop-blur-sm space-y-8 hover:border-gold/30 transition-colors">
            <div className="flex items-center gap-3 text-gold">
              <Brain className="w-6 h-6" />
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">What is Fine-Tuning? (Explained Simply)</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              
              {/* BASE MODEL BOX */}
              <div className="p-6 bg-black/50 border border-red-500/20 rounded-2xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🎓</span>
                    <div>
                      <h3 className="text-lg font-bold text-white font-display">Before Fine-Tuning (Raw AI)</h3>
                      <span className="text-xs text-red-400 font-mono">High general knowledge, messy answers</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">
                    Think of the Raw AI like a smart college graduate who knows millions of facts, but doesn't know how to structure homework answers cleanly. It buries answers under blog headers, gets confused, or cuts off midway.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between text-xs font-mono text-red-400">
                  <span>Average Answer Score: <strong>0.99 / 4.0</strong></span>
                  <span>Junk Text Rate: <strong>73%</strong></span>
                </div>
              </div>

              {/* TUNED MODEL BOX */}
              <div className="p-6 bg-black/50 border border-gold/40 rounded-2xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🚀</span>
                    <div>
                      <h3 className="text-lg font-bold text-white font-display">After Fine-Tuning (Specialized AI)</h3>
                      <span className="text-xs text-gold font-mono">Trained on 100,000 coding tests</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">
                    After fine-tuning, the AI acts like an expert programming tutor. It gives direct, clean, ready-to-use code with zero useless filler or fake blog author lines.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between text-xs font-mono text-gold">
                  <span>Average Answer Score: <strong>3.70 / 4.0</strong></span>
                  <span>Junk Text Rate: <strong>0%</strong></span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3 HERO STAT CARDS */}
        <section className="pt-20 sm:pt-32 pb-24 sm:pb-36 border-b border-gray-800/80 space-y-10">
          <div className="text-gold font-display tracking-[0.2em] text-sm uppercase">
            <span>The Big Results</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            
            {/* STAT CARD 1 */}
            <div className="p-8 bg-gray-900/40 border border-gray-800 rounded-2xl backdrop-blur-sm hover:border-gold/30 transition-colors space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Quality Jump</span>
              <div className="text-4xl sm:text-5xl font-bold text-gold font-display">
                3.70 <span className="text-sm font-normal text-gray-400">/ 4.0</span>
              </div>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                Up from <strong className="text-red-400">0.99</strong> before training. Answers became almost 4x clearer and more accurate.
              </p>
            </div>

            {/* STAT CARD 2 */}
            <div className="p-8 bg-gray-900/40 border border-gray-800 rounded-2xl backdrop-blur-sm hover:border-gold/30 transition-colors space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Fake Headers Removed</span>
              <div className="text-4xl sm:text-5xl font-bold text-gold font-display">
                0% <span className="text-sm font-normal text-gray-400">junk text</span>
              </div>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                Down from <strong className="text-red-400">73%</strong>. Completely eliminated annoying author tags and blog boilerplate.
              </p>
            </div>

            {/* STAT CARD 3 */}
            <div className="p-8 bg-gray-900/40 border border-gray-800 rounded-2xl backdrop-blur-sm hover:border-gold/30 transition-colors space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Endless Word Loops</span>
              <div className="text-4xl sm:text-5xl font-bold text-gold font-display">
                0 <span className="text-sm font-normal text-gray-400">repeating loops</span>
              </div>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                Fixed 100% of cases where the old model got stuck repeating words endlessly.
              </p>
            </div>

          </div>
        </section>

        {/* SIDE-BY-SIDE PROMPT EXAMPLES */}
        <section className="pt-20 sm:pt-32 pb-24 sm:pb-36 border-b border-gray-800/80 space-y-12">
          <div className="space-y-4">
            <span className="text-gold font-display tracking-[0.2em] text-sm uppercase">02. Live Test Comparisons</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">Compare Actual Answers Side-by-Side</h2>
            <p className="text-gray-400 font-light text-base max-w-2xl">
              Click a question below to see what the AI answered before training vs. how it answered after training.
            </p>
          </div>

          {/* TAB BUTTONS */}
          <div className="flex flex-wrap gap-3 pt-2">
            {PROMPT_EXAMPLES.map((ex, index) => (
              <button
                key={ex.id}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
                  activeTab === index 
                    ? 'bg-gold text-black border-gold shadow-[0_0_15px_rgba(201,168,76,0.3)]' 
                    : 'bg-gray-900/60 text-gray-400 border-gray-800 hover:border-gold/40 hover:text-white'
                }`}
              >
                {ex.label}
              </button>
            ))}
          </div>

          {/* QUESTION BOX */}
          <div className="p-6 sm:p-8 bg-gray-900/60 border border-gold/30 rounded-2xl backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-2 text-gold text-xs font-mono uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              Question Asked to the AI:
            </div>
            <p className="text-lg sm:text-xl text-white font-medium">
              "{PROMPT_EXAMPLES[activeTab].simpleQuestion}"
            </p>
          </div>

          {/* COMPARISON CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* BEFORE TRAINING */}
            <div className="p-6 sm:p-8 bg-gray-900/40 border border-red-500/20 rounded-2xl space-y-4 backdrop-blur-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    Before Training (Raw AI)
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-red-400/10 text-red-400 border border-red-400/20">FAILED</span>
                </div>

                <div className="p-4 bg-black/80 rounded-xl font-mono text-xs text-gray-300 overflow-x-auto border border-gray-800 max-h-72 custom-scrollbar">
                  <pre className="whitespace-pre-wrap">{PROMPT_EXAMPLES[activeTab].baseOutput}</pre>
                </div>
              </div>

              <div className="p-4 bg-red-950/30 border border-red-500/20 rounded-xl text-xs text-red-300">
                {PROMPT_EXAMPLES[activeTab].baseExplanation}
              </div>
            </div>

            {/* AFTER TRAINING */}
            <div className="p-6 sm:p-8 bg-gray-900/40 border border-gold/40 rounded-2xl space-y-4 backdrop-blur-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-gold font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                    After Training (Fine-Tuned AI)
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-gold/10 text-gold border border-gold/30">PASSED</span>
                </div>

                <div className="p-4 bg-black/80 rounded-xl font-mono text-xs text-gold/90 overflow-x-auto border border-gold/20 max-h-72 custom-scrollbar">
                  <pre className="whitespace-pre-wrap">{PROMPT_EXAMPLES[activeTab].tunedOutput}</pre>
                </div>
              </div>

              <div className="p-4 bg-gold/10 border border-gold/30 rounded-xl text-xs text-gold">
                {PROMPT_EXAMPLES[activeTab].tunedExplanation}
              </div>
            </div>

          </div>
        </section>

        {/* TOPIC IMPROVEMENT CHART */}
        <section className="pt-20 sm:pt-32 pb-24 sm:pb-36 border-b border-gray-800/80 space-y-12">
          <div className="space-y-4">
            <span className="text-gold font-display tracking-[0.2em] text-sm uppercase">03. Topic Performance</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">How Every Topic Improved</h2>
            <p className="text-gray-400 font-light text-base max-w-2xl">
              From web development to machine learning, every single topic saw massive score jumps after fine-tuning.
            </p>
          </div>

          <div className="p-8 sm:p-10 bg-gray-900/40 border border-gray-800 rounded-3xl backdrop-blur-sm space-y-6">
            <div className="flex justify-between items-center text-xs font-mono text-gray-400 border-b border-gray-800 pb-4">
              <span>Topic Name</span>
              <div className="flex gap-6">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-600"></span>Before (out of 4.0)</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gold"></span>After (out of 4.0)</span>
              </div>
            </div>

            <div className="space-y-6">
              {TOPIC_COMPARISONS.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-white">
                    <span>{item.name}</span>
                    <span className="text-gold font-mono">{item.base.toFixed(1)} → {item.tuned.toFixed(1)} ({item.percentage})</span>
                  </div>

                  <div className="space-y-1.5">
                    {/* Before Bar */}
                    <div className="w-full bg-black/60 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-gray-600 h-full rounded-full transition-all duration-700" 
                        style={{ width: `${(item.base / 4.0) * 100}%` }}
                      />
                    </div>

                    {/* After Bar */}
                    <div className="w-full bg-black/60 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-gold h-full rounded-full transition-all duration-700" 
                        style={{ width: `${(item.tuned / 4.0) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 30-TEST REPORT LEDGER */}
        <section className="pt-20 sm:pt-32 pb-24 sm:pb-36 border-b border-gray-800/80 space-y-12">
          <div className="space-y-4">
            <span className="text-gold font-display tracking-[0.2em] text-sm uppercase">04. Detailed Scorecard</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">20 Key Test Categories</h2>
            <p className="text-gray-400 font-light text-base max-w-2xl">
              Filter by category to check specific benchmark performance scores and execution times.
            </p>
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex flex-wrap gap-2 pt-2">
            {["All", "Coding", "Web", "Data Science", "AI & ML", "Algorithms", "Databases", "General"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 border ${
                  selectedCategory === cat
                    ? 'bg-gold text-black border-gold font-bold'
                    : 'bg-gray-900/60 text-gray-400 border-gray-800 hover:border-gold/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* BENCHMARK GRID CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBenchmarks.map((b) => (
              <div 
                key={b.name} 
                className="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl backdrop-blur-sm hover:border-gold/40 hover:-translate-y-1 transition-all duration-300 space-y-5 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold uppercase tracking-wider">
                      {b.category}
                    </span>
                    <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border uppercase ${
                      b.status === 'BEST' ? 'bg-gold/20 text-gold border-gold/40 font-bold' :
                      b.status === 'EXCELLENT' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                      b.status === 'GOOD' ? 'bg-blue-400/10 text-blue-400 border-blue-400/20' :
                      'bg-amber-400/10 text-amber-400 border-amber-400/20'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-display group-hover:text-gold transition-colors">
                    {b.name}
                  </h3>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-gray-800/80">
                  <div className="flex justify-between items-baseline font-mono">
                    <span className="text-xs text-gray-400">Score Accuracy</span>
                    <span className="text-xl font-bold text-gold">{b.score}%</span>
                  </div>
                  <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/5">
                    <div 
                      className="bg-gold h-full rounded-full transition-all duration-700" 
                      style={{ width: `${b.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* KEY TAKEAWAYS */}
        <section className="pt-20 sm:pt-32 pb-16 space-y-12">
          <div className="space-y-4">
            <span className="text-gold font-display tracking-[0.2em] text-sm uppercase">05. Summary</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">What We Learned</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 bg-gray-900/40 border border-gray-800 rounded-2xl space-y-4 backdrop-blur-sm hover:border-gold/30 transition-colors">
              <Award className="w-8 h-8 text-gold" />
              <h3 className="text-xl font-bold text-white font-display">Best Topic</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                <strong>Text Processing & NLP</strong> hit 93.7% accuracy. The model effortlessly formats strings, spaCy pipelines, and regex.
              </p>
            </div>

            <div className="p-8 bg-gray-900/40 border border-gray-800 rounded-2xl space-y-4 backdrop-blur-sm hover:border-gold/30 transition-colors">
              <TrendingUp className="w-8 h-8 text-gold" />
              <h3 className="text-xl font-bold text-white font-display">Biggest Fix</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                <strong>Code Debugging</strong> improved by +1100%. The model went from failing completely to explaining bugs line-by-line.
              </p>
            </div>

            <div className="p-8 bg-gray-900/40 border border-gray-800 rounded-2xl space-y-4 backdrop-blur-sm hover:border-gold/30 transition-colors">
              <Zap className="w-8 h-8 text-gold" />
              <h3 className="text-xl font-bold text-white font-display">Speed vs Quality</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                Typing speed stayed the same (~2.8 words/sec). Fine-tuning made answers <strong>smarter</strong>, not slower.
              </p>
            </div>

          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-gray-800 pt-10 pb-20 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-500">
          <div>Base Model: <code className="text-gray-400">DeepSeek-Coder-6.7B</code></div>
          <div>Fine-Tuning Method: <code className="text-gold">QLoRA 4-bit Adapter</code></div>
          <div>Location: <code className="text-gray-400">tatinenikarthik.online/finetuningblog</code></div>
        </footer>

      </main>
    </div>
  );
}
