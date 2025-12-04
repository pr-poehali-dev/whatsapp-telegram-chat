import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

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

type ChatWindowProps = {
  activeChat: Chat;
  messages: Message[];
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
};

const ChatWindow = ({ 
  activeChat, 
  messages, 
  newMessage, 
  onNewMessageChange, 
  onSendMessage 
}: ChatWindowProps) => {
  return (
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
            onChange={(e) => onNewMessageChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            placeholder="Введите сообщение..."
            className="flex-1 bg-secondary border-0"
          />
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Icon name="Mic" size={24} />
          </Button>
          <Button
            onClick={onSendMessage}
            size="icon"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
