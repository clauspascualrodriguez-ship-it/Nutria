import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, MessageCircle, ArrowDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NutriaMascot } from '../NutriaMascot';

export const NutriaChatDrawer: React.FC = () => {
  const {
    t,
    language,
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    sendMessage,
    mascotMood,
    expiringPantryItems,
  } = useApp();

  const isEs = language === 'es';
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isChatOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setInputText('');
    setIsLoading(true);
    await sendMessage(text);
    setIsLoading(false);
  };

  const chips = isEs
    ? [
        expiringPantryItems.length > 0
          ? `🍲 ¿Qué cocino hoy con ${expiringPantryItems[0].name}?`
          : '🍲 ¿Qué puedo cocinar con mi nevera?',
        '💰 ¿Cómo ahorro 20 € este mes?',
        '📋 Hazme un menú semanal por < 35 €',
        '🛒 Lista económica para 2 personas',
      ]
    : [
        expiringPantryItems.length > 0
          ? `🍲 What can I cook with ${expiringPantryItems[0].name}?`
          : '🍲 What can I cook with my fridge?',
        '💰 How can I save €20 this month?',
        '📋 Plan a weekly menu under €35',
        '🛒 Budget shopping list for 2',
      ];

  return (
    <>
      {/* Floating Nutria Mascot Button */}
      {!isChatOpen && (
        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          title={t.dashboard.openAssistant}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 bg-[#654735] text-[#FFF9F0] p-2.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 border-2 border-[#F4E3A5] group"
        >
          <div className="relative">
            <NutriaMascot mood="waving" size="xs" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#A8B89A] border-2 border-[#654735] rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#A8B89A] border-2 border-[#654735] rounded-full"></span>
          </div>
          <span className="text-xs font-extrabold pr-2 hidden md:inline">
            {isEs ? 'Hablar con Nutria' : 'Chat with Nutria'}
          </span>
        </button>
      )}

      {/* Slide-Over Drawer */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FFFEFC] w-full max-w-md h-full shadow-2xl border-l border-[#F2E8D9] flex flex-col animate-in slide-in-from-right">
            {/* Header */}
            <div className="p-4 px-5 border-b border-[#F2E8D9] bg-[#FFF9F0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <NutriaMascot mood={mascotMood} size="xs" />
                <div>
                  <h3 className="text-sm font-extrabold text-[#654735] flex items-center gap-1.5">
                    <span>{t.chat.title}</span>
                    <span className="w-2 h-2 rounded-full bg-[#6C8B56]"></span>
                  </h3>
                  <p className="text-[11px] text-[#9A765B]">{t.chat.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#9A765B] hover:text-[#654735] hover:bg-[#F2E8D9] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              {chatMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
                  >
                    {!isUser && (
                      <NutriaMascot mood={msg.mood || 'waving'} size="xs" className="shrink-0 mt-0.5" />
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                        isUser
                          ? 'bg-[#654735] text-[#FFF9F0] rounded-tr-xs'
                          : 'bg-[#FFF9F0] text-[#654735] border border-[#E5D5C5] rounded-tl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line font-medium">{msg.text}</div>
                      <span
                        className={`text-[9px] mt-1 block ${
                          isUser ? 'text-[#E5D5C5] text-right' : 'text-[#9A765B]'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-[#9A765B] p-2 bg-[#FFF9F0] rounded-xl w-fit">
                  <NutriaMascot mood="thinking" size="xs" />
                  <span className="animate-pulse font-bold">
                    {isEs ? 'Nutria está pensando...' : 'Nutria is thinking...'}
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Chips */}
            <div className="px-4 py-2 border-t border-[#F2E8D9] bg-[#FFF9F0]/60 overflow-x-auto">
              <div className="flex gap-1.5 w-max">
                {chips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(chip)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-[#FFFEFC] border border-[#E5D5C5] text-[#654735] font-semibold hover:bg-[#F4E3A5] hover:border-[#D1B85D] transition-colors whitespace-nowrap active:scale-95"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-[#F2E8D9] bg-[#FFFEFC] flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.chat.inputPlaceholder}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E5D5C5] bg-[#FFF9F0]/60 text-xs text-[#654735] focus:outline-none focus:ring-2 focus:ring-[#A8B89A]"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-[#654735] text-[#FFF9F0] flex items-center justify-center hover:bg-[#533726] disabled:opacity-50 transition-all shrink-0 active:scale-95 shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
