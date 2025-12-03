import React, { useState, useEffect, useRef } from 'react';
import { User, Room, AppView, Message } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { 
  UserIcon, LockIcon, PlusIcon, LoginIcon, 
  SendIcon, PaperclipIcon, ArrowLeftIcon, FileIcon, MoreVerticalIcon 
} from './components/Icons';

// --- Auth Component ---
interface AuthProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true); // Toggle between Login/Register styles visually
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !password || !confirmPassword) {
      setError('Lütfen tüm alanları doldurunuz.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    // Simulate Auth Success
    const user: User = {
      firstName,
      lastName,
      username: `${firstName} ${lastName}`
    };
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-white">TeleChat'e Hoşgeldiniz</h2>
            <p className="text-gray-400 mt-2">Devam etmek için giriş yapın</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">İsim</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500"><UserIcon /></span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                    placeholder="Adınız"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Soyisim</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                  placeholder="Soyadınız"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Şifre</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500"><LockIcon /></span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Şifre Doğrulama</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500"><LockIcon /></span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 mt-6"
            >
              Giriş Yap / Kayıt Ol
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Dashboard Component ---
interface DashboardProps {
  user: User;
  onNavigate: (view: AppView) => void;
}

const DashboardScreen: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background blobs for modern feel */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="z-10 w-full max-w-lg">
            <h1 className="text-3xl font-bold text-white text-center mb-2">Merhaba, {user.firstName}!</h1>
            <p className="text-gray-400 text-center mb-12">Ne yapmak istersiniz?</p>

            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-1 gap-6">
                    <button 
                        onClick={() => onNavigate(AppView.CREATE_ROOM)}
                        className="group flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-500 p-6 rounded-2xl hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-blue-900/20"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <PlusIcon />
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-white">Oda Oluştur</h3>
                                <p className="text-blue-100 text-sm">Yeni bir sohbet odası başlat</p>
                            </div>
                        </div>
                        <div className="text-white/50 group-hover:translate-x-1 transition-transform">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                        </div>
                    </button>

                    <button 
                        onClick={() => onNavigate(AppView.JOIN_ROOM)}
                        className="group flex items-center justify-between bg-gray-700/50 hover:bg-gray-700 p-6 rounded-2xl border border-gray-600 hover:border-gray-500 transition-all duration-200"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-gray-600 p-3 rounded-xl text-white">
                                <LoginIcon />
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-white">Odaya Gir</h3>
                                <p className="text-gray-400 text-sm">Mevcut bir odaya katıl</p>
                            </div>
                        </div>
                        <div className="text-gray-500 group-hover:translate-x-1 transition-transform">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

// --- Room Form Component (Used for Create and Join) ---
interface RoomFormProps {
  type: 'create' | 'join';
  onBack: () => void;
  onSubmit: (room: Room) => void;
}

const RoomForm: React.FC<RoomFormProps> = ({ type, onBack, onSubmit }) => {
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        setIsLoading(false);
        onSubmit({
            id: roomName.toLowerCase().replace(/\s+/g, '-'),
            name: roomName,
            password
        });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col p-4">
      <button onClick={onBack} className="self-start text-gray-400 hover:text-white flex items-center gap-2 mb-8 mt-4">
        <ArrowLeftIcon /> Geri Dön
      </button>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6">
            {type === 'create' ? 'Yeni Oda Oluştur' : 'Odaya Katıl'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Oda İsmi</label>
              <input 
                type="text" 
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                placeholder="Örn: Sohbet Odası 1"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Oda Şifresi (Opsiyonel)</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                placeholder="••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={!roomName || isLoading}
              className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                !roomName ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'İşleniyor...' : (type === 'create' ? 'Oluştur ve Gir' : 'Giriş Yap')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Chat Screen Component ---
interface ChatScreenProps {
  user: User;
  room: Room;
  onBack: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ user, room, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: `"${room.name}" odasına hoşgeldiniz! Ben bu odanın yapay zeka asistanıyım.`,
      sender: 'other',
      senderName: 'AI Asistan',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedFile) || isSending) return;

    const currentText = inputText;
    const currentFile = selectedFile;

    // Clear input immediately for UX
    setInputText('');
    setSelectedFile(null);
    setIsSending(true);

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: currentText,
      sender: 'me',
      senderName: user.firstName,
      timestamp: new Date(),
      file: currentFile ? {
        name: currentFile.name,
        type: currentFile.type,
        data: currentFile.data
      } : undefined
    };

    setMessages(prev => [...prev, newUserMsg]);

    // Send to Gemini
    try {
      const aiResponseText = await sendMessageToGemini(
        messages, 
        currentText,
        currentFile ? { data: currentFile.data, type: currentFile.type } : undefined
      );

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'other',
        senderName: 'AI Asistan',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Failed to get response", error);
    } finally {
      setIsSending(false);
    }
  };

  const [selectedFile, setSelectedFile] = useState<{name: string, type: string, data: string} | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({
          name: file.name,
          type: file.type,
          data: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1e293b] border-b border-gray-700 shadow-sm z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-700 rounded-full text-gray-400 transition-colors">
            <ArrowLeftIcon />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {room.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-white leading-tight">{room.name}</h3>
            <span className="text-xs text-blue-400">2 katılımcı (Siz & AI)</span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white">
            <MoreVerticalIcon />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/95" style={{backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
        {messages.map((msg) => {
          const isMe = msg.sender === 'me';
          return (
            <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] md:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`
                  relative px-4 py-2 rounded-2xl shadow-md text-sm md:text-base
                  ${isMe 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-[#1e293b] text-gray-100 rounded-tl-none border border-gray-700'}
                `}>
                  {/* Sender Name (Only for others) */}
                  {!isMe && <p className="text-xs font-bold text-blue-400 mb-1">{msg.senderName}</p>}

                  {/* Attached File Display */}
                  {msg.file && (
                    <div className="mb-2 rounded-lg overflow-hidden bg-black/20">
                      {msg.file.type.startsWith('image/') ? (
                        <img src={msg.file.data} alt="uploaded" className="max-w-full h-auto max-h-64 object-cover" />
                      ) : (
                        <div className="flex items-center gap-2 p-3">
                          <FileIcon />
                          <span className="truncate max-w-[150px]">{msg.file.name}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Text */}
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  
                  {/* Timestamp */}
                  <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-[#1e293b] border-t border-gray-700">
        {selectedFile && (
           <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg mb-2 max-w-fit border border-gray-600">
               <span className="text-xs text-gray-300 truncate max-w-[200px]">{selectedFile.name}</span>
               <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-red-400">✕</button>
           </div>
        )}
        <div className="flex items-end gap-2 max-w-5xl mx-auto">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            accept="image/*, .pdf, .txt"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-blue-400 hover:bg-gray-700/50 rounded-full transition-all"
            title="Dosya Gönder"
          >
            <PaperclipIcon />
          </button>
          
          <div className="flex-1 bg-gray-800 rounded-2xl border border-gray-600 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Mesaj yazın..."
              className="w-full bg-transparent text-white px-4 py-3 max-h-32 min-h-[48px] focus:outline-none resize-none scrollbar-hide"
              rows={1}
              style={{height: 'auto'}} // Auto-grow logic would go here ideally
            />
          </div>

          <button 
            onClick={handleSendMessage}
            disabled={(!inputText.trim() && !selectedFile) || isSending}
            className={`p-3 rounded-full transition-all duration-200 shadow-lg ${
                (!inputText.trim() && !selectedFile) || isSending
                ? 'bg-gray-700 text-gray-500 cursor-default' 
                : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 active:scale-95'
            }`}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.AUTH);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleRoomEnter = (room: Room) => {
    setCurrentRoom(room);
    setCurrentView(AppView.CHAT);
  };

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
  };

  // View Router Logic
  if (currentView === AppView.AUTH) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  if (!currentUser) {
    // Safety fallback
    setCurrentView(AppView.AUTH);
    return null;
  }

  if (currentView === AppView.DASHBOARD) {
    return <DashboardScreen user={currentUser} onNavigate={handleNavigate} />;
  }

  if (currentView === AppView.CREATE_ROOM) {
    return (
        <RoomForm 
            type="create" 
            onBack={() => setCurrentView(AppView.DASHBOARD)} 
            onSubmit={handleRoomEnter} 
        />
    );
  }

  if (currentView === AppView.JOIN_ROOM) {
    return (
        <RoomForm 
            type="join" 
            onBack={() => setCurrentView(AppView.DASHBOARD)} 
            onSubmit={handleRoomEnter} 
        />
    );
  }

  if (currentView === AppView.CHAT && currentRoom) {
    return (
        <ChatScreen 
            user={currentUser} 
            room={currentRoom} 
            onBack={() => setCurrentView(AppView.DASHBOARD)} 
        />
    );
  }

  return <div>Something went wrong.</div>;
};

export default App;