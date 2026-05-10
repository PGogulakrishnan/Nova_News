import React, { useState, useMemo, useEffect } from 'react';
import { Search, Sparkles, Filter, Newspaper, TrendingUp, Clock, User, ArrowRight, X, Brain, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_NEWS } from './constants';
import { NewsItem, Category } from './types';
import { cn } from './lib/utils';
import { summarizeArticle, explainContext } from './services/geminiService';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ summary: string; context: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const categories: Category[] = ['All', 'Technology', 'Business', 'Science', 'Sports', 'Entertainment', 'World'];

  const filteredNews = useMemo(() => {
    return MOCK_NEWS.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenArticle = (article: NewsItem) => {
    setSelectedArticle(article);
    setAiAnalysis(null);
    setIsModalOpen(true);
  };

  const handleAiAnalysis = async () => {
    if (!selectedArticle) return;
    setIsAnalyzing(true);
    try {
      const [summary, context] = await Promise.all([
        summarizeArticle(selectedArticle.title, selectedArticle.excerpt, selectedArticle.content),
        explainContext(selectedArticle.title)
      ]);
      setAiAnalysis({ summary, context });
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#0D0D0D] text-[#1A1A1A] dark:text-[#F3F4F6] font-sans selection:bg-[#E2E8F0] dark:selection:bg-[#2D3748] transition-colors duration-300">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-[#FDFCFB]/80 dark:bg-[#0D0D0D]/80 backdrop-blur-md border-b border-[#E5E7EB] dark:border-[#1F1F1F]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1A1A1A] dark:bg-[#F3F4F6] rounded-lg flex items-center justify-center transition-colors">
              <Newspaper className="w-5 h-5 text-white dark:text-[#0D0D0D]" />
            </div>
            <span className="font-bold text-xl tracking-tight">Nova News</span>
          </div>

          <div className="flex-1 max-w-md relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input 
              type="text" 
              placeholder="Search news, topics, insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F3F4F6] dark:bg-[#1A1A1A] border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#1A1A1A] dark:focus:ring-white transition-all outline-none text-[#1A1A1A] dark:text-[#F3F4F6]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-[#F3F4F6] dark:hover:bg-[#1A1A1A] rounded-full transition-colors text-[#6B7280] dark:text-[#9CA3AF]"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
             <button className="p-2 hover:bg-[#F3F4F6] dark:hover:bg-[#1A1A1A] rounded-full transition-colors md:hidden">
              <Search className="w-5 h-5" />
            </button>
            <div className="h-8 w-8 rounded-full bg-[#E5E7EB] dark:bg-[#1A1A1A] flex items-center justify-center">
              <User className="w-5 h-5 text-[#4B5563] dark:text-[#9CA3AF]" />
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center gap-6 overflow-x-auto no-scrollbar border-t border-[#F3F4F6] dark:border-[#1F1F1F]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "text-sm font-medium whitespace-nowrap transition-all relative pb-1",
                selectedCategory === cat ? "text-[#1A1A1A] dark:text-[#F3F4F6]" : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1A1A1A] dark:hover:text-white"
              )}
            >
              {cat}
              {selectedCategory === cat && (
                <motion.div 
                  layoutId="activeCategory"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A1A1A] dark:bg-[#F3F4F6]" 
                />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section / Featured */}
        {selectedCategory === 'All' && searchQuery === '' && (
          <section className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-8 group relative overflow-hidden rounded-3xl bg-[#1A1A1A] h-[500px] cursor-pointer"
                onClick={() => handleOpenArticle(MOCK_NEWS[0])}
              >
                <img 
                  src={MOCK_NEWS[0].imageUrl} 
                  alt={MOCK_NEWS[0].title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 p-8 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Featured</span>
                    <span className="text-white/60 text-xs">• 8 min read</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-4 tracking-tight max-w-2xl text-balance">
                    {MOCK_NEWS[0].title}
                  </h1>
                  <p className="text-white/80 text-lg max-w-xl line-clamp-2">
                    {MOCK_NEWS[0].excerpt}
                  </p>
                </div>
              </motion.div>

              <div className="lg:col-span-4 flex flex-col gap-6">
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.1 }}
                   className="flex-1 p-6 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#1F1F1F] hover:shadow-xl dark:hover:shadow-white/5 transition-all cursor-pointer flex flex-col justify-between"
                   onClick={() => handleOpenArticle(MOCK_NEWS[1])}
                >
                  <div>
                    <span className="text-[#6B7280] dark:text-[#9CA3AF] text-xs font-bold uppercase tracking-widest block mb-2">{MOCK_NEWS[1].category}</span>
                    <h3 className="text-xl font-serif font-bold leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                      {MOCK_NEWS[1].title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="w-6 h-6 rounded-full bg-[#F3F4F6] dark:bg-[#0D0D0D] flex items-center justify-center">
                       <TrendingUp className="w-3 h-3 text-[#EF4444]" />
                    </div>
                    <span className="text-xs font-medium text-[#4B5563] dark:text-[#9CA3AF]">In the Spotlight</span>
                  </div>
                </motion.div>

                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.2 }}
                   className="flex-1 p-6 rounded-3xl bg-[#F3F4F6] dark:bg-[#111111] hover:bg-[#E5E7EB] dark:hover:bg-[#1A1A1A] transition-colors cursor-pointer group"
                   onClick={() => handleOpenArticle(MOCK_NEWS[2])}
                >
                  <span className="text-[#6B7280] dark:text-[#9CA3AF] text-xs font-bold uppercase tracking-widest block mb-2">{MOCK_NEWS[2].category}</span>
                  <h3 className="text-xl font-serif font-bold leading-snug">
                    {MOCK_NEWS[2].title}
                  </h3>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{MOCK_NEWS[2].source}</span>
                    <ArrowRight className="w-4 h-4 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* The Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold tracking-tight">
              {selectedCategory === 'All' ? 'Latest Stories' : `${selectedCategory} News`}
            </h2>
            <div className="flex items-center gap-2 bg-[#F3F4F6] dark:bg-[#1A1A1A] p-1 rounded-lg">
              <Filter className="w-4 h-4 text-[#6B7280] dark:text-[#9CA3AF] mx-2" />
              <button className="px-3 py-1 text-xs font-medium bg-white dark:bg-[#0D0D0D] dark:text-white rounded-md shadow-sm">Grid</button>
              <button className="px-3 py-1 text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF]">List</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((news, idx) => (
              <motion.article 
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group cursor-pointer flex flex-col"
                onClick={() => handleOpenArticle(news)}
              >
                <div className="aspect-[16/10] overflow-hidden rounded-2xl mb-4 bg-[#F3F4F6] dark:bg-[#1A1A1A]">
                  <img 
                    src={news.imageUrl} 
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-[#1A1A1A] dark:text-[#F3F4F6] uppercase tracking-wider">{news.category}</span>
                  <span className="text-[#E5E7EB] dark:text-[#1F1F1F]">•</span>
                  <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium">{news.source}</span>
                </div>
                <h3 className="text-xl font-serif font-bold leading-tight mb-2 group-hover:underline decoration-1 underline-offset-4">
                  {news.title}
                </h3>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm line-clamp-2 mb-4">
                  {news.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-widest">{news.date}</span>
                  <div className="flex items-center gap-1 text-[#6B7280] dark:text-[#9CA3AF]">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{news.readingTime}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-[#F3F4F6] dark:bg-[#1A1A1A] rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-[#9CA3AF]" />
              </div>
              <h3 className="text-lg font-bold mb-1">No articles found</h3>
              <p className="text-[#6B7280] dark:text-[#9CA3AF]">Try adjusting your search or category filters</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] dark:border-[#1F1F1F] py-12 bg-white dark:bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Newspaper className="w-6 h-6" />
              <span className="font-bold text-xl">Nova News</span>
            </div>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] max-w-sm mb-6">
              Empowering your morning with curated, AI-analyzed news from the world's most trusted sources.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'Instagram'].map(social => (
                <a key={social} href="#" className="text-sm font-medium hover:text-[#1A1A1A] dark:hover:text-white transition-colors">{social}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-[#9CA3AF]">Categories</h4>
            <div className="flex flex-col gap-2">
              {categories.slice(1, 5).map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className="text-sm text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#1A1A1A] dark:hover:text-white text-left">{cat}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-[#9CA3AF]">Newsletter</h4>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="flex-1 bg-[#F3F4F6] dark:bg-[#111111] border-none px-4 py-2 rounded-lg text-sm outline-none text-[#1A1A1A] dark:text-[#F3F4F6]" />
              <button className="bg-[#1A1A1A] dark:bg-white text-white dark:text-[#0D0D0D] px-4 py-2 rounded-lg text-sm font-bold">Join</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#0D0D0D] rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-[#E5E7EB] dark:border-[#1F1F1F]"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30 backdrop-blur-md rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Image & Meta */}
              <div className="w-full md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                <img src={selectedArticle.imageUrl} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 md:from-black/40 to-transparent flex flex-col justify-end p-8">
                  <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">{selectedArticle.category}</span>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight mb-4">{selectedArticle.title}</h2>
                  <div className="flex items-center gap-4 text-white/80 text-xs font-medium">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>{selectedArticle.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{selectedArticle.readingTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Content & AI */}
              <div className="flex-1 overflow-y-auto bg-white dark:bg-[#0D0D0D] p-8 md:p-12">
                <div className="prose prose-sm max-w-none">
                  <div className="flex items-center justify-between mb-8">
                     <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em]">{selectedArticle.source} • {selectedArticle.date}</span>
                     <button 
                        onClick={handleAiAnalysis}
                        disabled={isAnalyzing}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all",
                          aiAnalysis ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200" : "bg-[#1A1A1A] dark:bg-white text-white dark:text-[#0D0D0D] hover:bg-zinc-800 dark:hover:bg-zinc-200",
                          isAnalyzing && "opacity-50 cursor-not-allowed"
                        )}
                     >
                       {isAnalyzing ? (
                         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                           <Sparkles className="w-4 h-4" />
                         </motion.div>
                       ) : (
                         <Sparkles className="w-4 h-4" />
                       )}
                       {aiAnalysis ? 'Analysis Updated' : 'Smart Insight'}
                     </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {aiAnalysis ? (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-8 p-6 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20 rounded-2xl"
                      >
                        <div className="flex items-center gap-2 mb-4 text-purple-700 dark:text-purple-300">
                          <Brain className="w-5 h-5" />
                          <span className="font-bold text-sm">AI Analysis</span>
                        </div>
                        
                        <div className="mb-4">
                           <h5 className="text-[10px] font-bold text-purple-400 dark:text-purple-500 uppercase tracking-widest mb-2">Key Takeaways</h5>
                           <div className="text-sm text-purple-900 dark:text-purple-100 list-disc list-inside space-y-2 whitespace-pre-line leading-relaxed">
                             {aiAnalysis.summary}
                           </div>
                        </div>

                        <div>
                           <h5 className="text-[10px] font-bold text-purple-400 dark:text-purple-500 uppercase tracking-widest mb-2">Why it matters</h5>
                           <p className="text-sm text-purple-900 dark:text-purple-100 leading-relaxed italic">
                             {aiAnalysis.context}
                           </p>
                        </div>
                      </motion.div>
                    ) : isAnalyzing ? (
                      <div className="mb-8 p-6 bg-zinc-50 dark:bg-[#111111] border border-zinc-100 dark:border-[#1F1F1F] rounded-2xl animate-pulse">
                         <div className="h-4 w-32 bg-zinc-200 dark:bg-[#222] rounded mb-4" />
                         <div className="h-2 w-full bg-zinc-200 dark:bg-[#222] rounded mb-2" />
                         <div className="h-2 w-3/4 bg-zinc-200 dark:bg-[#222] rounded" />
                      </div>
                    ) : null}
                  </AnimatePresence>

                  <p className="text-[#4B5563] dark:text-[#9CA3AF] text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:mt-1 dark:first-letter:text-white">
                    {selectedArticle.content}
                  </p>
                  <p className="text-[#4B5563] dark:text-[#9CA3AF] text-lg leading-relaxed mt-6">
                    Curabitur aliquet quam id dui posuere blandit. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Donec sollicitudin molestie malesuada. Pellentesque in ipsum id orci porta dapibus.
                  </p>
                </div>
                
                <div className="mt-12 pt-8 border-t border-[#F3F4F6] dark:border-[#1F1F1F] flex items-center justify-between">
                   <button className="text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all dark:text-white">
                     Read full source article <ArrowRight className="w-4 h-4" />
                   </button>
                   <div className="flex gap-4">
                     <button className="text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1A1A1A] dark:hover:text-white">Save for later</button>
                     <button className="text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1A1A1A] dark:hover:text-white">Share</button>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
