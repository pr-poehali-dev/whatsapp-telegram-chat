import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

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

type Section = 'messages' | 'contacts' | 'calls' | 'groups' | 'profile' | 'settings';

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

  const sections = [
    { id: 'messages' as Section, icon: 'MessageSquare', label: 'Сообщения' },
    { id: 'contacts' as Section, icon: 'Users', label: 'Контакты' },
    { id: 'calls' as Section, icon: 'Phone', label: 'Звонки' },
    { id: 'groups' as Section, icon: 'UsersRound', label: 'Группы' },
    { id: 'profile' as Section, icon: 'User', label: 'Профиль' },
    { id: 'settings' as Section, icon: 'Settings', label: 'Настройки' },
  ];

  return (
    <div className="flex h-screen bg-background dark">
      <div className="w-20 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 gap-4">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? 'default' : 'ghost'}
            size="icon"
            className={`w-12 h-12 rounded-xl transition-all ${
              activeSection === section.id
                ? 'bg-primary text-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
            onClick={() => setActiveSection(section.id)}
          >
            <Icon name={section.icon} size={24} />
          </Button>
        ))}
      </div>

      {activeSection === 'messages' && (
        <div className="w-96 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-semibold mb-3">Чаты</h2>
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Поиск"
              className="pl-10 bg-secondary border-0"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-secondary/80 ${
                activeChat.id === chat.id ? 'bg-secondary' : ''
              }`}
            >
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                    {chat.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                  <span className="text-xs text-muted-foreground">{chat.time}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <Badge className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {chat.unread}
                </Badge>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>
      )}

      {activeSection === 'messages' ? (
      <div className="flex-1 flex flex-col bg-[hsl(var(--chat-bg))]">
        <div className="p-4 border-b border-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={activeChat.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                {activeChat.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{activeChat.name}</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icon name="Lock" size={12} />
                <span>Сквозное шифрование</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-foreground">
              <Icon name="Search" size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground">
              <Icon name="Phone" size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground">
              <Icon name="Video" size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground">
              <Icon name="MoreVertical" size={20} />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sent ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-md px-4 py-2 rounded-2xl ${
                    message.sent
                      ? 'bg-[hsl(var(--chat-bubble-sent))] text-white rounded-br-sm'
                      : 'bg-[hsl(var(--chat-bubble-received))] text-foreground rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className={`text-xs mt-1 block ${message.sent ? 'text-white/70' : 'text-muted-foreground'}`}>
                    {message.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Icon name="Plus" size={24} />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Icon name="Smile" size={24} />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Введите сообщение..."
              className="flex-1 bg-secondary border-0"
            />
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Icon name="Mic" size={24} />
            </Button>
            <Button
              onClick={sendMessage}
              size="icon"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Icon name="Send" size={20} />
            </Button>
          </div>
        </div>
      </div>
      ) : activeSection === 'contacts' ? (
        <div className="flex-1 flex flex-col bg-[hsl(var(--chat-bg))]">
          <div className="w-96 bg-card border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="text-xl font-semibold mb-3">Контакты</h2>
              <div className="relative">
                <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input placeholder="Поиск контактов" className="pl-10 bg-secondary border-0" />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {chats.map((contact) => (
                <div key={contact.id} className="flex items-center gap-3 p-4 hover:bg-secondary/80 transition-colors cursor-pointer">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {contact.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{contact.name}</h3>
                    <p className="text-xs text-muted-foreground">{contact.online ? 'В сети' : 'Не в сети'}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Icon name="MessageSquare" size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Icon name="Phone" size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon name="Users" size={40} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Выберите контакт</h3>
              <p className="text-muted-foreground">Нажмите на контакт для начала общения</p>
            </div>
          </div>
        </div>
      ) : activeSection === 'calls' ? (
        <div className="flex-1 flex flex-col bg-[hsl(var(--chat-bg))]">
          <div className="flex-1 bg-card">
            <div className="p-4 border-b border-border">
              <h2 className="text-xl font-semibold">История звонков</h2>
            </div>
            <ScrollArea className="h-[calc(100vh-80px)]">
              {[
                { name: 'Анна Петрова', type: 'incoming', time: 'Сегодня, 14:30', duration: '12 мин', answered: true },
                { name: 'Дмитрий Сидоров', type: 'outgoing', time: 'Сегодня, 10:15', duration: '5 мин', answered: true },
                { name: 'Мама', type: 'incoming', time: 'Вчера, 18:45', duration: '25 мин', answered: true },
                { name: 'Рабочая группа', type: 'outgoing', time: 'Вчера, 15:20', duration: '0 мин', answered: false },
                { name: 'Елена Иванова', type: 'incoming', time: '15 ноя, 11:30', duration: '8 мин', answered: true },
              ].map((call, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {call.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{call.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Icon 
                        name={call.type === 'incoming' ? 'PhoneIncoming' : 'PhoneOutgoing'} 
                        size={12} 
                        className={call.answered ? '' : 'text-destructive'}
                      />
                      <span>{call.time}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{call.duration}</p>
                    <Button variant="ghost" size="icon" className="h-8 w-8 mt-1">
                      <Icon name="Phone" size={16} className="text-primary" />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      ) : activeSection === 'groups' ? (
        <div className="flex-1 flex flex-col bg-[hsl(var(--chat-bg))]">
          <div className="w-96 bg-card border-r border-border flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold">Группы</h2>
              <Button size="icon" className="bg-primary text-primary-foreground">
                <Icon name="Plus" size={20} />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              {[
                { name: 'Рабочая группа', members: 12, lastMessage: 'Максим: Документы готовы', unread: 5 },
                { name: 'Семья', members: 6, lastMessage: 'Мама: Встретимся в субботу', unread: 2 },
                { name: 'Проект 2024', members: 8, lastMessage: 'Ты: Всем привет!', unread: 0 },
                { name: 'Друзья', members: 15, lastMessage: 'Саша: Кто за футбол?', unread: 3 },
              ].map((group, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 hover:bg-secondary/80 transition-colors cursor-pointer">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {group.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{group.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{group.lastMessage}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">{group.members} участников</p>
                    {group.unread > 0 && (
                      <Badge className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                        {group.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon name="UsersRound" size={40} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Выберите группу</h3>
              <p className="text-muted-foreground">Нажмите на группу для просмотра сообщений</p>
            </div>
          </div>
        </div>
      ) : activeSection === 'profile' ? (
        <div className="flex-1 flex items-center justify-center bg-[hsl(var(--chat-bg))]">
          <div className="w-full max-w-2xl p-8">
            <div className="bg-card rounded-2xl p-8">
              <div className="flex flex-col items-center mb-8">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold text-4xl">
                    ВИ
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  <Icon name="Camera" size={16} className="mr-2" />
                  Изменить фото
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Имя</label>
                  <Input defaultValue="Ваше Имя" className="mt-1 bg-secondary border-0" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">О себе</label>
                  <Input defaultValue="Доступен для общения" className="mt-1 bg-secondary border-0" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Номер телефона</label>
                  <Input defaultValue="+7 900 123 45 67" className="mt-1 bg-secondary border-0" disabled />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Имя пользователя</label>
                  <Input defaultValue="@username" className="mt-1 bg-secondary border-0" />
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6">
                  Сохранить изменения
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[hsl(var(--chat-bg))]">
          <div className="w-full max-w-2xl p-8">
            <div className="bg-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Настройки</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="Bell" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Уведомления</p>
                      <p className="text-sm text-muted-foreground">Звук и вибрация</p>
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="Lock" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Приватность</p>
                      <p className="text-sm text-muted-foreground">Блокировка, последний визит</p>
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="Database" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Данные и хранилище</p>
                      <p className="text-sm text-muted-foreground">Использование сети</p>
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="Palette" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Оформление</p>
                      <p className="text-sm text-muted-foreground">Темы и обои чатов</p>
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="HelpCircle" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Помощь</p>
                      <p className="text-sm text-muted-foreground">FAQ и поддержка</p>
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;