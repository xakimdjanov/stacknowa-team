import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Columns, 
  FileText, 
  Layers,
  Sparkles,
  BookMarked
} from 'lucide-react';

/**
 * BookViewer - Talabalar topshirgan amaliy ishni kitob (booklet) shaklida ko'rsatish komponenti
 * 
 * @param {Array} pages - [{ id, title, html }]
 * @param {string} documentTitle - Topshiriq mavzusi / fanning nomi
 * @param {string} studentName - Talaba ismi
 */
const BookViewer = ({ pages = [], documentTitle = "Amaliy Mashg'ulot Hisoboti", studentName = "" }) => {
  // Ko'rinish rejimi: 'booklet' (2 betlik kitobcha), 'single' (1 betlik), 'continuous' (barcha betlar)
  const [viewMode, setViewMode] = useState('booklet');
  const [currentPageIndex, setCurrentPageIndex] = useState(0); // 0-indexed
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const containerRef = useRef(null);

  // Normalize pages: agar bo'sh bo'lsa default betlar
  const safePages = pages && pages.length > 0 ? pages : [
    { id: 1, title: "1-bet: Titul varaqasi", html: `<div style="text-align:center; padding: 40px;"><h2>${documentTitle}</h2><p>Talaba: ${studentName || 'Talaba'}</p></div>` }
  ];

  const totalPages = safePages.length;

  // Keyboard navigation (Chap va O'ng tugmalar orqali varaqlash)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Agar kiritish maydonida bo'lmasa
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentPageIndex, totalPages]);

  // Fullscreen o'zgarishini tinglash
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Varaqlash
  const goNext = () => {
    if (viewMode === 'booklet') {
      if (currentPageIndex === 0) {
        // Muqovadan 2-3 betlarga o'tish
        setCurrentPageIndex(Math.min(1, totalPages - 1));
      } else {
        // Juft betlarga 2 tadan o'tish
        const nextIdx = currentPageIndex + 2;
        if (nextIdx < totalPages) {
          setCurrentPageIndex(nextIdx);
        }
      }
    } else {
      if (currentPageIndex < totalPages - 1) {
        setCurrentPageIndex(currentPageIndex + 1);
      }
    }
  };

  const goPrev = () => {
    if (viewMode === 'booklet') {
      if (currentPageIndex <= 1) {
        setCurrentPageIndex(0);
      } else {
        setCurrentPageIndex(Math.max(1, currentPageIndex - 2));
      }
    } else {
      if (currentPageIndex > 0) {
        setCurrentPageIndex(currentPageIndex - 1);
      }
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(err => console.error(err));
    } else {
      document.exitFullscreen?.().catch(err => console.error(err));
    }
  };

  // Chop etish
  const handlePrint = () => {
    window.print();
  };

  // Zoom
  const zoomIn = () => setZoomLevel(prev => Math.min(140, prev + 10));
  const zoomOut = () => setZoomLevel(prev => Math.max(70, prev - 10));
  const resetZoom = () => setZoomLevel(100);

  // Booklet rejimida chap va o'ng sahifalarni aniqlash
  let leftPage = null;
  let rightPage = null;
  let isCover = false;

  if (viewMode === 'booklet') {
    if (currentPageIndex === 0) {
      isCover = true;
      leftPage = safePages[0];
    } else {
      // Masalan: index 1 bo'lsa (2-bet va 3-bet)
      const normalizedLeft = currentPageIndex % 2 === 1 ? currentPageIndex : currentPageIndex - 1;
      leftPage = safePages[normalizedLeft] || null;
      rightPage = safePages[normalizedLeft + 1] || null;
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'min-h-[750px] my-6'
      }`}
    >
      {/* 1. TOP BOOKLET CONTROLS TOOLBAR */}
      <div className="bg-slate-950/90 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-slate-300 select-none z-20">
        {/* Chap: Rejimlar va Mundarija */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setViewMode('booklet');
                if (currentPageIndex > 0 && currentPageIndex % 2 === 0) {
                  setCurrentPageIndex(currentPageIndex - 1);
                }
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'booklet' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Kitobcha (Yonma-yon 2 bet)"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kitobcha (2 bet)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('single')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'single' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Yakka sahifa (1 bet)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Yakka bet</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('continuous')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'continuous' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Barcha sahifalar ketma-ket"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Barchasi</span>
            </button>
          </div>

          {/* Mundarija / Thumbnails toggle */}
          <button
            type="button"
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
              showThumbnails 
                ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Sahifalar ro'yxati va mundarija"
          >
            <BookMarked className="w-4 h-4" />
          </button>
        </div>

        {/* O'rta: Sahifalar Navigatsiyasi (Agar continuous bo'lmasa) */}
        {viewMode !== 'continuous' && (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentPageIndex === 0}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all"
              title="Oldingi bet (ArrowLeft)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Quick jump select */}
            <div className="flex items-center space-x-1 text-xs">
              <select
                value={currentPageIndex}
                onChange={(e) => setCurrentPageIndex(Number(e.target.value))}
                className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
              >
                {safePages.map((p, idx) => (
                  <option key={p.id || idx} value={idx}>
                    {idx + 1}-bet: {p.title || `Sahifa ${idx + 1}`}
                  </option>
                ))}
              </select>

              <span className="text-slate-500 font-semibold px-1">
                / {totalPages} bet
              </span>
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={
                viewMode === 'booklet'
                  ? (currentPageIndex === 0 ? totalPages <= 1 : currentPageIndex >= totalPages - 2)
                  : currentPageIndex >= totalPages - 1
              }
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all"
              title="Keyingi bet (ArrowRight)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* O'ng: Masshtab, Chop etish va Katta ekran */}
        <div className="flex items-center space-x-2">
          {/* Zoom */}
          <div className="hidden sm:flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={zoomOut}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
              title="Kichraytirish"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={resetZoom}
              className="px-1.5 py-0.5 text-[11px] font-mono font-semibold text-slate-300 hover:text-white"
              title="Asl o'lchamga qaytarish"
            >
              {zoomLevel}%
            </button>
            <button
              type="button"
              onClick={zoomIn}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
              title="Kattalashtirish"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Chop etish */}
          <button
            type="button"
            onClick={handlePrint}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Chop etish / PDF qilib saqlash"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isFullscreen ? "Ekranni kichraytirish" : "To'liq ekran (Fullscreen)"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. ASOSIY KITOB VA SIDEBAR MAYDONI */}
      <div className="flex-1 flex overflow-hidden relative bg-[#131722] min-h-[600px]">
        {/* Chapdagi Sahifalar Miniatyurasi (Thumbnails Drawer) */}
        {showThumbnails && (
          <aside className="w-64 bg-slate-950/95 border-r border-slate-800/90 flex flex-col flex-shrink-0 z-30 select-none animate-in slide-in-from-left duration-200">
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Kitob Sahifalari ({totalPages})</span>
              </span>
              <button
                type="button"
                onClick={() => setShowThumbnails(false)}
                className="text-slate-500 hover:text-slate-300 text-xs font-semibold px-2 py-0.5"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {safePages.map((page, idx) => {
                const isActive = 
                  viewMode === 'booklet'
                    ? (currentPageIndex === 0 ? idx === 0 : idx === currentPageIndex || idx === currentPageIndex + 1)
                    : idx === currentPageIndex;

                return (
                  <button
                    key={page.id || idx}
                    type="button"
                    onClick={() => {
                      if (viewMode === 'booklet' && idx > 0 && idx % 2 === 0) {
                        setCurrentPageIndex(idx - 1);
                      } else {
                        setCurrentPageIndex(idx);
                      }
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex flex-col space-y-1.5 ${
                      isActive 
                        ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md ring-1 ring-indigo-500/40' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="truncate pr-1">{idx + 1}-bet: {page.title || `Sahifa ${idx + 1}`}</span>
                      {isActive && <span className="text-[10px] text-indigo-400 font-extrabold flex-shrink-0">• Faol</span>}
                    </div>

                    {/* Mini sahifa maketi */}
                    <div className="w-full h-14 bg-white rounded-md p-1.5 overflow-hidden opacity-85 border border-slate-700 pointer-events-none">
                      <div 
                        className="text-[6px] text-slate-500 line-clamp-4 leading-tight font-serif"
                        dangerouslySetInnerHTML={{ __html: page.html }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* O'ngdagi Kitob O'qish Maydoni */}
        <main className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-8 relative">
          <div 
            className="transition-transform duration-200 origin-center"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {/* ---------------- 1-REJIM: BOOKLET (2 BETLIK KITOBCHA) ---------------- */}
            {viewMode === 'booklet' && (
              <div>
                {/* Agar 1-bet (Titul varaqasi / Muqova) bo'lsa - Markazda bitta alohida muqova */}
                {isCover ? (
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      {/* Kitob muqovasi (Cover page) */}
                      <article 
                        className="w-[210mm] max-w-full min-h-[297mm] bg-white text-slate-900 rounded-r-2xl rounded-l-md shadow-2xl p-[20mm] border border-slate-300 relative overflow-hidden transition-all duration-300"
                        style={{
                          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), inset -15px 0 25px -10px rgba(0, 0, 0, 0.08), -8px 0 15px -5px rgba(0,0,0,0.3)"
                        }}
                      >
                        {/* Kitob muqovasi choki (Spine shadow chap burchakda) */}
                        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none"></div>
                        <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-black/15 pointer-events-none"></div>

                        {/* Sahifa ichidagi html */}
                        <div 
                          className="prose prose-slate max-w-none text-slate-900"
                          dangerouslySetInnerHTML={{ __html: leftPage.html }}
                        />

                        {/* Muqova pastki belgisi */}
                        <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                          Muqova • 1-Sahifa
                        </div>
                      </article>

                      {/* Kitobni ochish / Keyingi sahifaga o'tish tugmasi */}
                      {totalPages > 1 && (
                        <button
                          type="button"
                          onClick={goNext}
                          className="absolute -right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-110 z-10"
                          title="Kitobni ochish (2-3 betlar)"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      )}
                    </div>

                    <div className="mt-4 flex items-center space-x-2 text-xs text-slate-400">
                      <span>📖 Muqova / Titul varaqasi</span>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={goNext}
                        className="text-indigo-400 font-bold hover:underline"
                      >
                        Kitobni ochish &gt;
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 2-3, 4-5, 6-7 betlar: Yonma-yon juft sahifalar (Haqiqiy Kitob formati) */
                  <div className="flex flex-col items-center">
                    <div className="relative flex items-stretch select-text">
                      {/* Chapga varaqlash tugmasi */}
                      <button
                        type="button"
                        onClick={goPrev}
                        className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-800/90 hover:bg-indigo-600 text-white shadow-xl border border-slate-700 flex items-center justify-center transition-all hover:scale-110 z-20"
                        title="Oldingi sahifalar"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>

                      {/* CHAP SAHIFA (Left Page) */}
                      <article 
                        className="w-[185mm] xl:w-[200mm] min-h-[285mm] bg-white text-slate-900 rounded-l-xl shadow-2xl p-[18mm] border-y border-l border-slate-300 relative flex flex-col justify-between"
                        style={{
                          boxShadow: "-15px 20px 40px -10px rgba(0,0,0,0.5), inset -20px 0 30px -10px rgba(0,0,0,0.12)"
                        }}
                      >
                        {/* Sahifa tepasi headeri */}
                        <div className="border-b border-slate-200 pb-2 mb-4 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="truncate max-w-[200px]">{documentTitle}</span>
                          <span className="font-semibold">{leftPage?.title || ''}</span>
                        </div>

                        {/* Sahifa mazmuni */}
                        <div 
                          className="flex-1 prose prose-slate max-w-none text-slate-900 text-[11pt] leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: leftPage ? leftPage.html : '<p class="text-slate-300 italic text-center py-20">Bo\'sh sahifa</p>' }}
                        />

                        {/* Sahifa pastki raqami (Chap tarafda) */}
                        <div className="border-t border-slate-200 pt-2 mt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span className="font-bold text-slate-700">
                            {currentPageIndex % 2 === 1 ? currentPageIndex + 1 : currentPageIndex}
                          </span>
                          <span className="text-[10px]">Talaba: {studentName}</span>
                        </div>
                      </article>

                      {/* O'RTADAGI KITOB CHOKI (Spine Binding Line) */}
                      <div className="w-5 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 relative z-10 flex-shrink-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.4)]">
                        <div className="w-full h-full bg-gradient-to-r from-black/20 via-black/40 to-black/20"></div>
                      </div>

                      {/* O'NG SAHIFA (Right Page) */}
                      <article 
                        className="w-[185mm] xl:w-[200mm] min-h-[285mm] bg-white text-slate-900 rounded-r-xl shadow-2xl p-[18mm] border-y border-r border-slate-300 relative flex flex-col justify-between"
                        style={{
                          boxShadow: "15px 20px 40px -10px rgba(0,0,0,0.5), inset 20px 0 30px -10px rgba(0,0,0,0.12)"
                        }}
                      >
                        {/* Sahifa tepasi headeri */}
                        <div className="border-b border-slate-200 pb-2 mb-4 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-semibold">{rightPage?.title || ''}</span>
                          <span className="truncate max-w-[200px]">AI Practice Booklet</span>
                        </div>

                        {/* Sahifa mazmuni */}
                        <div 
                          className="flex-1 prose prose-slate max-w-none text-slate-900 text-[11pt] leading-relaxed"
                          dangerouslySetInnerHTML={{ 
                            __html: rightPage 
                              ? rightPage.html 
                              : '<div class="text-center py-40 text-slate-300"><p class="text-sm font-semibold">Ushbu varaq bo\'sh qoldirilgan</p></div>' 
                          }}
                        />

                        {/* Sahifa pastki raqami (O'ng tarafda) */}
                        <div className="border-t border-slate-200 pt-2 mt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span className="text-[10px] text-slate-400">Rasmiy Hisobot</span>
                          <span className="font-bold text-slate-700">
                            {rightPage ? (currentPageIndex % 2 === 1 ? currentPageIndex + 2 : currentPageIndex + 1) : '-'}
                          </span>
                        </div>
                      </article>

                      {/* O'ngga varaqlash tugmasi */}
                      <button
                        type="button"
                        onClick={goNext}
                        disabled={currentPageIndex >= totalPages - 2}
                        className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-800/90 hover:bg-indigo-600 text-white shadow-xl border border-slate-700 flex items-center justify-center transition-all hover:scale-110 disabled:opacity-0 disabled:pointer-events-none z-20"
                        title="Keyingi sahifalar"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Pastki o'qish ko'rsatkichi */}
                    <div className="mt-4 flex items-center space-x-3 text-xs text-slate-400">
                      <span>
                        Ochilgan sahifalar: <strong className="text-white">{currentPageIndex % 2 === 1 ? currentPageIndex + 1 : currentPageIndex} - {rightPage ? (currentPageIndex % 2 === 1 ? currentPageIndex + 2 : currentPageIndex + 1) : totalPages}</strong> / {totalPages} ta bet
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ---------------- 2-REJIM: SINGLE (YAKKA A4 SAHIFA) ---------------- */}
            {viewMode === 'single' && (
              <div className="flex flex-col items-center">
                <div className="relative">
                  {/* Oldingi sahifa */}
                  {currentPageIndex > 0 && (
                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-800 hover:bg-indigo-600 text-white shadow-xl border border-slate-700 flex items-center justify-center transition-all hover:scale-110 z-20"
                      title="Oldingi bet"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}

                  <article 
                    className="w-[210mm] max-w-full min-h-[297mm] bg-white text-slate-900 rounded-xl shadow-2xl p-[20mm] border border-slate-300 relative flex flex-col justify-between"
                  >
                    {/* Header */}
                    <div className="border-b border-slate-200 pb-2.5 mb-5 flex items-center justify-between text-xs text-slate-400">
                      <span className="truncate max-w-[280px] font-semibold text-slate-600">{documentTitle}</span>
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {safePages[currentPageIndex]?.title || `${currentPageIndex + 1}-bet`}
                      </span>
                    </div>

                    {/* Content */}
                    <div 
                      className="flex-1 prose prose-slate max-w-none text-slate-900 text-[12pt] leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: safePages[currentPageIndex]?.html || '' }}
                    />

                    {/* Footer */}
                    <div className="border-t border-slate-200 pt-3 mt-5 flex items-center justify-between text-xs text-slate-400">
                      <span>Talaba: {studentName}</span>
                      <span className="font-mono font-bold text-slate-800">
                        {currentPageIndex + 1} / {totalPages}
                      </span>
                    </div>
                  </article>

                  {/* Keyingi sahifa */}
                  {currentPageIndex < totalPages - 1 && (
                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-800 hover:bg-indigo-600 text-white shadow-xl border border-slate-700 flex items-center justify-center transition-all hover:scale-110 z-20"
                      title="Keyingi bet"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}
                </div>

                <div className="mt-4 text-xs text-slate-400">
                  <span>{currentPageIndex + 1}-sahifa (Jami {totalPages} ta)</span>
                </div>
              </div>
            )}

            {/* ---------------- 3-REJIM: CONTINUOUS (BARCHA BETLAR KETMA-KET) ---------------- */}
            {viewMode === 'continuous' && (
              <div className="flex flex-col items-center space-y-8 py-4">
                {safePages.map((page, idx) => (
                  <article 
                    key={page.id || idx}
                    id={`book-page-${idx}`}
                    className="w-[210mm] max-w-full min-h-[297mm] bg-white text-slate-900 rounded-xl shadow-2xl p-[20mm] border border-slate-300 relative flex flex-col justify-between"
                  >
                    {/* Header */}
                    <div className="border-b border-slate-200 pb-2.5 mb-5 flex items-center justify-between text-xs text-slate-400">
                      <span className="truncate max-w-[280px] font-semibold text-slate-600">{documentTitle}</span>
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {page.title || `${idx + 1}-bet`}
                      </span>
                    </div>

                    {/* Content */}
                    <div 
                      className="flex-1 prose prose-slate max-w-none text-slate-900 text-[12pt] leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: page.html }}
                    />

                    {/* Footer */}
                    <div className="border-t border-slate-200 pt-3 mt-5 flex items-center justify-between text-xs text-slate-400">
                      <span>Talaba: {studentName}</span>
                      <span className="font-mono font-bold text-slate-800">
                        {idx + 1} / {totalPages}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 3. PASTKI STATUS PANELI */}
      <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 select-none">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center space-x-1.5 text-emerald-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Baholangan Kitobcha Nusxasi</span>
          </span>
          <span>•</span>
          <span>Jami {totalPages} sahifa</span>
        </div>

        <div className="text-[11px] text-slate-500 hidden sm:block">
          Klaviatura strelkalari (← / →) orqali varaqlashingiz mumkin
        </div>
      </div>
    </div>
  );
};

export default BookViewer;
