import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type Section = 'messages' | 'contacts' | 'calls' | 'groups' | 'profile' | 'settings';

type SidebarProps = {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
};

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const sections = [
    { id: 'messages' as Section, icon: 'MessageSquare', label: 'Сообщения' },
    { id: 'contacts' as Section, icon: 'Users', label: 'Контакты' },
    { id: 'calls' as Section, icon: 'Phone', label: 'Звонки' },
    { id: 'groups' as Section, icon: 'UsersRound', label: 'Группы' },
    { id: 'profile' as Section, icon: 'User', label: 'Профиль' },
    { id: 'settings' as Section, icon: 'Settings', label: 'Настройки' },
  ];

  return (
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
          onClick={() => onSectionChange(section.id)}
        >
          <Icon name={section.icon} size={24} />
        </Button>
      ))}
    </div>
  );
};

export default Sidebar;
