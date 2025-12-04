import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';
import ChatsList from '@/components/ChatsList';
import ChatWindow from '@/components/ChatWindow';
import SectionContent from '@/components/SectionContent';

type Chat = {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
};

type Message = {
  id: number;
  text: string;
  time: string;
  sent: boolean;
};

type Section = 'messages' | 'contacts' | 'calls' | 'groups' | 'profile' | 'settings';

const chats: Chat[] = [
  { id: 1, name: 'Анна Петрова', avatar: '', lastMessage: 'Отлично, встретимся завтра!', time: '14:32', unread: 2, online: true },
  { id: 2, name: 'Рабочая группа', avatar: '', lastMessage: 'Максим: Добавил документы', time: '13:15', unread: 5, online: false },
  { id: 3, name: 'Дмитрий Сидоров', avatar: '', lastMessage: 'Спасибо за помощь 👍', time: '12:08', unread: 0, online: true },
  { id: 4, name: 'Мама', avatar: '', lastMessage: 'Не забудь позвонить вечером', time: 'Вчера', unread: 1, online: false },
  { id: 5, name: 'Елена Иванова', avatar: '', lastMessage: 'Файл отправлен', time: 'Пн', unread: 0, online: false },
  { id: 6, name: 'Проект 2024', avatar: '', lastMessage: 'Ты: Всем привет!', time: 'Вс', unread: 0, online: false },
];

const initialMessages: Message[] = [
  { id: 1, text: 'Привет! Как дела?', time: '14:20', sent: false },
  { id: 2, text: 'Отлично, спасибо! А у тебя?', time: '14:25', sent: true },
  { id: 3, text: 'Тоже хорошо! Слушай, завтра встретимся?', time: '14:27', sent: false },
  { id: 4, text: 'Отлично, встретимся завтра!', time: '14:32', sent: true },
];

const Index = () => {
  const [activeChat, setActiveChat] = useState<Chat>(chats[0]);
  const [chatMessages, setChatMessages] = useState<Record<number, Message[]>>({
    1: initialMessages,
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  });
  const [newMessage, setNewMessage] = useState('');
  const [activeSection, setActiveSection] = useState<Section>('messages');
  const { toast } = useToast();

  const messages = chatMessages[activeChat.id] || [];

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const simulateIncomingMessage = () => {
    const randomChats = chats.filter(c => c.id !== activeChat.id);
    const randomChat = randomChats[Math.floor(Math.random() * randomChats.length)];
    const incomingMessage: Message = {
      id: Date.now(),
      text: ['Привет!', 'Как дела?', 'Увидимся позже!', 'Спасибо за всё! 🙏'][Math.floor(Math.random() * 4)],
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      sent: false,
    };

    setChatMessages(prev => ({
      ...prev,
      [randomChat.id]: [...(prev[randomChat.id] || []), incomingMessage],
    }));

    playNotificationSound();
    toast({
      title: randomChat.name,
      description: incomingMessage.text,
      duration: 3000,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        simulateIncomingMessage();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now(),
        text: newMessage,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        sent: true,
      };
      setChatMessages({
        ...chatMessages,
        [activeChat.id]: [...messages, message],
      });
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-background dark">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />

      {activeSection === 'messages' && (
        <ChatsList 
          chats={chats} 
          activeChat={activeChat} 
          onChatSelect={setActiveChat} 
        />
      )}

      {activeSection === 'messages' ? (
        <ChatWindow 
          activeChat={activeChat}
          messages={messages}
          newMessage={newMessage}
          onNewMessageChange={setNewMessage}
          onSendMessage={sendMessage}
        />
      ) : (
        <SectionContent 
          section={activeSection as 'contacts' | 'calls' | 'groups' | 'profile' | 'settings'} 
          chats={chats} 
        />
      )}
    </div>
  );
};

export default Index;
