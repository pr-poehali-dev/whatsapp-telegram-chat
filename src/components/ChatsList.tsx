import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

type ChatsListProps = {
  chats: Chat[];
  activeChat: Chat;
  onChatSelect: (chat: Chat) => void;
};

const ChatsList = ({ chats, activeChat, onChatSelect }: ChatsListProps) => {
  return (
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
            onClick={() => onChatSelect(chat)}
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
  );
};

export default ChatsList;
