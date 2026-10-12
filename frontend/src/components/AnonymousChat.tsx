import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Shield, Lock, User, UserCheck, RefreshCw, AlertCircle, Mic, MicOff } from 'lucide-react';

interface ChatMessage {
  id: string;
  senderType: 'REPORTER' | 'ADMIN';
  content: string;
  createdAt: string;
}

interface AnonymousChatProps {
  caseToken: string;
  senderRole: 'REPORTER' | 'ADMIN';
  adminAuthToken?: string;
}

export const AnonymousChat: React.FC<AnonymousChatProps> = ({
  caseToken,
  senderRole,
  adminAuthToken
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const BACKEND_URL = (import.meta as any).env.VITE_BACKEND_URL || 'http://localhost:5000/api/v1';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      const path = senderRole === 'ADMIN'
        ? `/admin/cases/${caseToken}/messages`
        : `/reports/${caseToken}/messages`;

      const headers: Record<string, string> = {};
      if (senderRole === 'ADMIN' && adminAuthToken) {
        headers['Authorization'] = `Bearer ${adminAuthToken}`;
      }

      let res: Response;
      try {
        res = await fetch(`${BACKEND_URL}${path}`, { headers });
      } catch {
        res = await fetch(`/api/v1${path}`, { headers });
      }

      const data = await res.json();

      if (res.ok && data.success) {
        setMessages(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to load messages');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Unable to synchronize chat messages.');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(true);

    // Live sync polling every 5 seconds
    const interval = setInterval(() => {
      fetchMessages(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [caseToken, senderRole, adminAuthToken]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Voice dictation is not supported by your current browser. Try Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      baseTextRef.current = inputText;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let currentSessionTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentSessionTranscript += event.results[i][0].transcript;
        }

        const prefix = baseTextRef.current ? baseTextRef.current.trim() + ' ' : '';
        setInputText(prefix + currentSessionTranscript.trimStart());
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setError('Microphone access was blocked. Please grant microphone permission in your browser.');
        } else if (event.error !== 'no-speech') {
          setError(`Microphone error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setError('Could not start microphone dictation.');
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }

    const cleanText = inputText.trim();
    if (!cleanText || isSending) return;

    setIsSending(true);
    setError(null);

    try {
      const path = senderRole === 'ADMIN'
        ? `/admin/cases/${caseToken}/messages`
        : `/reports/${caseToken}/messages`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (senderRole === 'ADMIN' && adminAuthToken) {
        headers['Authorization'] = `Bearer ${adminAuthToken}`;
      }

      let res: Response;
      try {
        res = await fetch(`${BACKEND_URL}${path}`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ content: cleanText })
        });
      } catch {
        res = await fetch(`/api/v1${path}`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ content: cleanText })
        });
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setInputText('');
        setMessages((prev) => [...prev, data.data]);
        setTimeout(scrollToBottom, 50);
      } else {
        setError(data.error || 'Failed to dispatch message');
      }
    } catch (err) {
      console.error('Error dispatching message:', err);
      setError('Connection failure while delivering encrypted message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-black/40 border border-white/[0.08] backdrop-blur-2xl rounded-3xl p-6 shadow-apple-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.06] gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-shield-blue/15 border border-shield-blue/30 flex items-center justify-center text-shield-blue">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-white">
                {senderRole === 'REPORTER' ? 'Encrypted Channel with Investigator' : 'Encrypted Reporter Channel'}
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-shield-green/15 text-shield-green border border-shield-green/30">
                <span className="w-1.5 h-1.5 rounded-full bg-shield-green mr-1 animate-pulse" />
                Live AES-256
              </span>
            </div>
            <p className="text-[11px] text-apple-gray-400">
              {senderRole === 'REPORTER' 
                ? 'Your identity is strictly anonymous. Only your Case Token authenticates this session.' 
                : `Communicating with Anonymous Reporter (${caseToken}). Identity traces purged.`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button 
            type="button"
            onClick={() => fetchMessages(false)}
            title="Refresh Messages"
            className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-apple-gray-400 hover:text-white transition-all text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Security Banner */}
      <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl px-3.5 py-2 flex items-center justify-between text-[11px] font-mono text-apple-gray-400">
        <div className="flex items-center space-x-2">
          <Lock className="w-3 h-3 text-shield-blue" />
          <span>Zero-Knowledge Encryption At Rest (AES-256-GCM)</span>
        </div>
        <div className="flex items-center space-x-1.5 text-apple-gray-500">
          <Shield className="w-3 h-3 text-shield-green" />
          <span>IP Stripped</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="h-72 overflow-y-auto space-y-3 pr-1 rounded-2xl p-2 bg-black/20 border border-white/[0.03]">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-2 text-xs font-mono text-apple-gray-500">
            <div className="w-5 h-5 rounded-full border-2 border-shield-blue border-t-transparent animate-spin" />
            <span>Establishing cipher enclave...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-2 text-center text-apple-gray-500 text-xs px-4">
            <MessageSquare className="w-7 h-7 text-apple-gray-600 stroke-1" />
            <p className="font-medium text-apple-gray-400">Secure Conversation Channel Ready</p>
            <p className="text-[11px] text-apple-gray-500 max-w-sm">
              {senderRole === 'REPORTER'
                ? 'Send clarifying notes, updates, or answers to the investigator here without revealing your name or IP.'
                : 'Send an inquiry or update to the anonymous whistleblower. They will read it upon tracking their case token.'}
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = (senderRole === 'REPORTER' && m.senderType === 'REPORTER') ||
                         (senderRole === 'ADMIN' && m.senderType === 'ADMIN');
            const isInvestigator = m.senderType === 'ADMIN';

            return (
              <div 
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center space-x-1.5 text-[10px] font-mono text-apple-gray-500 px-1">
                  {isInvestigator ? (
                    <>
                      <UserCheck className="w-3 h-3 text-shield-blue" />
                      <span className="text-shield-blue font-medium">Compliance Investigator</span>
                    </>
                  ) : (
                    <>
                      <User className="w-3 h-3 text-shield-green" />
                      <span className="text-shield-green font-medium">Anonymous Reporter</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    isMe 
                      ? 'bg-shield-blue/20 border border-shield-blue/40 text-white rounded-tr-sm shadow-sm'
                      : 'bg-white/[0.06] border border-white/[0.1] text-apple-gray-200 rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-alert-red text-xs bg-alert-red/10 border border-alert-red/20 px-3 py-2 rounded-xl">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Speech Recognition Active Banner */}
      {isListening && (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-alert-red/15 border border-alert-red/30 text-alert-red text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-alert-red animate-ping" />
            <span className="font-medium">Transcribing voice in real-time... Speak into your mic</span>
          </div>
          <button 
            type="button" 
            onClick={toggleListening}
            className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-xl bg-alert-red/25 hover:bg-alert-red/35 text-white transition-colors"
          >
            Done Dictating
          </button>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
        <div className="relative flex-1">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? 'Listening... Speak into microphone to transcribe...'
                : senderRole === 'REPORTER'
                ? 'Reply anonymously to the investigator...'
                : 'Type encrypted message to anonymous reporter...'
            }
            disabled={isSending}
            className="w-full bg-black/40 border border-white/[0.1] rounded-2xl px-4 py-3 text-xs text-white placeholder-apple-gray-500 focus:outline-none focus:border-shield-blue tracking-wide transition-all shadow-inner"
          />
        </div>

        {/* Microphone Button */}
        <button
          type="button"
          onClick={toggleListening}
          disabled={isSending}
          title={isListening ? "Stop voice dictation" : "Dictate message with voice (speech-to-text)"}
          className={`p-3 rounded-2xl transition-all active:scale-95 flex items-center justify-center border ${
            isListening
              ? 'bg-alert-red text-white border-alert-red shadow-lg shadow-alert-red/30 animate-pulse'
              : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-apple-gray-400 hover:text-white'
          }`}
        >
          {isListening ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          title="Send encrypted message"
          className="p-3 bg-shield-blue hover:bg-blue-500 disabled:opacity-40 text-white rounded-2xl transition-all active:scale-95 flex items-center justify-center shadow-apple-glow"
        >
          {isSending ? (
            <div className="w-4 h-4 rounded-full border border-white border-t-transparent animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
};
