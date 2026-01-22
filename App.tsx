import React, { useState } from 'react';
import { Header } from './components/Header';
import { EventCard } from './components/EventCard';
import { SentimentChart } from './components/SentimentChart';
import { generateTimelineFromUrl, generateNewsImage } from './services/geminiService';
import { AppState, LoadingState, NewsAnalysis } from './types';
import { Search, Loader2, AlertCircle, ArrowRight, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// Default test URL provided by user
const DEFAULT_URL = "https://news.sina.cn/sh/2026-01-22/detail-inhicwux4747276.d.html?cre=tianyi&mod=wuc&loc=2&r=25&rfunc=53&tj=cxvertical_wap_wuc&tr=189";

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    url: DEFAULT_URL,
    analysis: null,
    loadingState: LoadingState.IDLE,
    errorMessage: null,
    generatedImage: null,
    isImageLoading: false,
  });

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, url: e.target.value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.url.trim()) return;

    setState(prev => ({ 
      ...prev, 
      loadingState: LoadingState.LOADING, 
      errorMessage: null,
      analysis: null,
      generatedImage: null,
      isImageLoading: false
    }));

    try {
      const result = await generateTimelineFromUrl(state.url);
      setState(prev => ({ 
        ...prev, 
        loadingState: LoadingState.SUCCESS, 
        analysis: result 
      }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loadingState: LoadingState.ERROR, 
        errorMessage: error.message || "An unexpected error occurred." 
      }));
    }
  };

  const handleImageGenerate = async () => {
    if (!state.analysis) return;
    
    setState(prev => ({ ...prev, isImageLoading: true }));
    try {
      const image = await generateNewsImage(state.analysis.headline, state.analysis.summary);
      setState(prev => ({ ...prev, generatedImage: image, isImageLoading: false }));
    } catch (error) {
       console.error(error);
       setState(prev => ({ ...prev, isImageLoading: false }));
       // Optional: Set an error message if needed, but keeping it simple for now
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="container mx-auto px-4 max-w-4xl">
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 border border-gray-100">
          <form onSubmit={handleGenerate} className="relative">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  value={state.url}
                  onChange={handleUrlChange}
                  placeholder="在此粘贴新闻链接..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-700 bg-gray-50"
                  disabled={state.loadingState === LoadingState.LOADING}
                />
              </div>
              <button
                type="submit"
                disabled={state.loadingState === LoadingState.LOADING || !state.url.trim()}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-xl transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg whitespace-nowrap"
              >
                {state.loadingState === LoadingState.LOADING ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    分析中...
                  </>
                ) : (
                  <>
                    生成时间线
                    <ArrowRight className="ml-2" size={20} />
                  </>
                )}
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              建议使用直接的新闻文章链接。未来的日期或付费墙可能会影响结果。
            </p>
          </form>
        </div>

        {/* Error State */}
        {state.loadingState === LoadingState.ERROR && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-8 flex items-start animate-fade-in">
            <AlertCircle className="text-red-500 mt-0.5 mr-3" size={20} />
            <div>
              <h3 className="text-red-800 font-semibold">生成失败</h3>
              <p className="text-red-700 text-sm mt-1">{state.errorMessage}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {state.analysis && state.loadingState === LoadingState.SUCCESS && (
          <div className="animate-fade-in-up">
            
            {/* Report Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                {state.analysis.headline}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed border-l-4 border-primary-200 pl-4 py-1 bg-white shadow-sm rounded-r-lg text-left md:text-center md:border-l-0 md:border-t-4 md:border-primary-200 md:pt-4 md:pl-0">
                {state.analysis.summary}
              </p>
            </div>

            {/* AI Image Generation Section */}
            <div className="mb-12 flex flex-col items-center">
              {!state.generatedImage && (
                <button
                  onClick={handleImageGenerate}
                  disabled={state.isImageLoading}
                  className="group flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {state.isImageLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>正在创建视觉图像...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      <span>生成新闻配图</span>
                    </>
                  )}
                </button>
              )}

              {state.generatedImage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl border-4 border-white"
                >
                  <img 
                    src={state.generatedImage} 
                    alt="AI Generated News Illustration" 
                    className="w-full h-auto object-cover"
                  />
                  <div className="bg-gray-900 text-white text-xs py-2 px-4 flex justify-between items-center">
                    <span className="flex items-center"><Sparkles size={12} className="mr-1 text-yellow-400"/> AI生成的插图</span>
                    <span className="opacity-60">Gemini Flash Image</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Charts */}
            {state.analysis.events.length > 1 && (
               <SentimentChart events={state.analysis.events} />
            )}

            {/* Timeline */}
            <div className="relative p-4 pb-12">
              {/* Vertical Line - Responsive: Left on mobile, Center on desktop */}
              <div 
                className="absolute border-l-2 border-gray-200 h-full left-8 md:left-1/2 md:-translate-x-1/2 top-0" 
              ></div>

              {state.analysis.events.map((event, index) => (
                <EventCard 
                  key={index} 
                  event={event} 
                  index={index} 
                  isLeft={index % 2 === 0}
                />
              ))}
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;