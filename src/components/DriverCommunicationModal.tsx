import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  Send, 
  MessageSquare, 
  FileText, 
  Check, 
  Share2, 
  Copy,
  Bike
} from 'lucide-react';
import { DriverInfo } from '../types';

interface DriverModalProps {
  type: 'call' | 'chat' | 'instructions' | 'share';
  isOpen: boolean;
  onClose: () => void;
  driver: DriverInfo;
  orderId: string;
}

export const DriverCommunicationModal: React.FC<DriverModalProps> = ({
  type,
  isOpen,
  onClose,
  driver,
  orderId,
}) => {
  // Call simulation state
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [callStatus, setCallStatus] = useState<'Connecting...' | 'Active Call' | 'Call Ended'>('Connecting...');

  // Chat simulation state
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'driver'; text: string; time: string }>>([
    {
      sender: 'driver',
      text: `Hello! This is ${driver.name}. I just picked up your insulated package from the kitchen and I'm en route on the electric Vespa.`,
      time: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Instructions state
  const [instructionText, setInstructionText] = useState('Leave with doorman / concierge');
  const [contactless, setContactless] = useState(true);
  const [instructionsSaved, setInstructionsSaved] = useState(false);

  // Share state
  const [copied, setCopied] = useState(false);

  // Call timer effect
  useEffect(() => {
    let timer: any;
    if (isOpen && type === 'call') {
      setCallStatus('Connecting...');
      const connectTimeout = setTimeout(() => {
        setCallStatus('Active Call');
        timer = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);
      }, 1500);

      return () => {
        clearTimeout(connectTimeout);
        clearInterval(timer);
        setCallDuration(0);
      };
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const userMsg = inputMessage;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg, time: now }]);
    setInputMessage('');

    // Simulated driver response after 1.2s
    setTimeout(() => {
      let driverReply = `Got it! I will take care of that for you. See you in a few minutes!`;
      if (userMsg.toLowerCase().includes('code') || userMsg.toLowerCase().includes('gate')) {
        driverReply = `Noted the gate code! Will buzz up as soon as I pull in.`;
      } else if (userMsg.toLowerCase().includes('door') || userMsg.toLowerCase().includes('leave')) {
        driverReply = `Perfect, will place it gently on the doorstep and send a drop-off confirmation photo.`;
      }
      setMessages((prev) => [...prev, { sender: 'driver', text: driverReply, time: 'Just now' }]);
    }, 1200);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-obsidian-950/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-obsidian-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-obsidian-950/50">
            <div className="flex items-center space-x-2.5">
              {type === 'call' && <Phone className="w-4 h-4 text-emerald-400" />}
              {type === 'chat' && <MessageSquare className="w-4 h-4 text-emerald-400" />}
              {type === 'instructions' && <FileText className="w-4 h-4 text-emerald-400" />}
              {type === 'share' && <Share2 className="w-4 h-4 text-emerald-400" />}

              <h4 className="text-sm font-bold text-white capitalize">
                {type === 'call' && `Calling ${driver.name}`}
                {type === 'chat' && `Direct Chat with ${driver.name}`}
                {type === 'instructions' && 'Delivery Instructions'}
                {type === 'share' && 'Share Live Tracking Link'}
              </h4>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content Switch */}
          <div className="p-5">
            {/* 1. CALL DIALOG */}
            {type === 'call' && (
              <div className="text-center py-6 space-y-6">
                <div className="relative mx-auto w-24 h-24">
                  <img
                    src={driver.photo}
                    alt={driver.name}
                    className="w-full h-full rounded-full object-cover border-2 border-emerald-400 shadow-sage-glow"
                  />
                  {callStatus === 'Active Call' && (
                    <span className="absolute bottom-0 right-0 p-1.5 bg-emerald-500 rounded-full border-2 border-obsidian-900 text-obsidian-950">
                      <Bike className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{driver.name}</h3>
                  <p className="text-xs text-slate-400">{driver.vehicle} · {driver.phone}</p>
                  <p className="text-xs font-mono font-bold text-emerald-400 mt-2">
                    {callStatus === 'Active Call' ? formatCallTime(callDuration) : callStatus}
                  </p>
                </div>

                {/* Animated Audio Waveform */}
                {callStatus === 'Active Call' && (
                  <div className="flex items-center justify-center space-x-1 h-8">
                    {[40, 75, 100, 60, 90, 45, 80, 100, 50, 70].map((h, i) => (
                      <motion.span
                        key={i}
                        className="w-1 bg-emerald-400 rounded-full"
                        animate={{ height: [`${h * 0.2}%`, `${h * 0.8}%`, `${h * 0.3}%`] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.08 }}
                      />
                    ))}
                  </div>
                )}

                {/* Call Control Buttons */}
                <div className="flex items-center justify-center space-x-4 pt-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3 rounded-full transition ${
                      isMuted
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={onClose}
                    className="p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition hover:scale-105"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>

                  <button className="p-3 rounded-full bg-white/10 text-slate-300 hover:text-white transition">
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* 2. CHAT DIALOG */}
            {type === 'chat' && (
              <div className="flex flex-col h-80">
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs custom-scrollbar">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        m.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          m.sender === 'user'
                            ? 'bg-emerald-500 text-obsidian-950 font-medium rounded-br-none'
                            : 'bg-white/10 text-slate-200 rounded-bl-none'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[9px] text-slate-500 mt-0.5 px-1">{m.time}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Suggestion Chips */}
                <div className="flex gap-1.5 py-2 overflow-x-auto scrollbar-none">
                  {['Please ring bell', 'Leave at door', 'Gate code #4028'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInputMessage(suggestion);
                      }}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-slate-300 whitespace-nowrap transition"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                {/* Input Bar */}
                <div className="flex space-x-2 pt-2 border-t border-white/10">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Message driver..."
                    className="flex-1 px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 rounded-xl bg-emerald-500 text-obsidian-950 font-bold hover:bg-emerald-400 transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 3. INSTRUCTIONS DIALOG */}
            {type === 'instructions' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                    Drop-off Location & Instructions
                  </label>
                  <textarea
                    value={instructionText}
                    onChange={(e) => {
                      setInstructionText(e.target.value);
                      setInstructionsSaved(false);
                    }}
                    rows={3}
                    placeholder="e.g. Ring code 4028, leave on front bench, beware of golden retriever..."
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs text-slate-300">Contactless Drop-off Preferred</span>
                  <input
                    type="checkbox"
                    checked={contactless}
                    onChange={(e) => setContactless(e.target.checked)}
                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                  />
                </div>

                <button
                  onClick={() => {
                    setInstructionsSaved(true);
                    setTimeout(() => onClose(), 1000);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-bold text-xs shadow-sage-glow transition flex items-center justify-center space-x-1.5"
                >
                  {instructionsSaved ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Saved & Transmitted to Driver!</span>
                    </>
                  ) : (
                    <span>Update Driver Instructions</span>
                  )}
                </button>
              </div>
            )}

            {/* 4. SHARE DIALOG */}
            {type === 'share' && (
              <div className="space-y-4 text-center py-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 break-all font-mono">
                  {window.location.origin}/track/{orderId}
                </div>

                <p className="text-xs text-slate-400">
                  Anyone with this link can view the live GPS beacon and ETA in real-time.
                </p>

                <button
                  onClick={handleCopyLink}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-bold text-xs shadow-sage-glow transition flex items-center justify-center space-x-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Tracking Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Live Tracking Link</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

