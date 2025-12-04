import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

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

  const messages = chatMessages[activeChat.id] || [];

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
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[hsl(var(--chat-bg))]">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Icon 
                name={
                  activeSection === 'contacts' ? 'Users' :
                  activeSection === 'calls' ? 'Phone' :
                  activeSection === 'groups' ? 'UsersRound' :
                  activeSection === 'profile' ? 'User' : 'Settings'
                } 
                size={40} 
                className="text-primary" 
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              {
                activeSection === 'contacts' ? 'Контакты' :
                activeSection === 'calls' ? 'Звонки' :
                activeSection === 'groups' ? 'Группы' :
                activeSection === 'profile' ? 'Профиль' : 'Настройки'
              }
            </h3>
            <p className="text-muted-foreground">Раздел в разработке</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;