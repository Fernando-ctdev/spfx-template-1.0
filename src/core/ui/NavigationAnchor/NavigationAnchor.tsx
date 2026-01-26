import * as React from 'react';
import { ChevronRight } from 'lucide-react';

interface ISection {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface INavigationAnchorProps {
  sections: ISection[];
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

const NavigationAnchor: React.FC<INavigationAnchorProps> = ({
  sections,
  activeSection,
  onSectionClick,
  orientation = 'horizontal'
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className={isHorizontal ? 'mb-8' : 'mb-6'}>
      <nav className={`
        ${isHorizontal 
          ? 'bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex flex-wrap gap-2' 
          : 'space-y-2'
        }
      `}>
        {sections.map((section) => {
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => onSectionClick?.(section.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
                ${isHorizontal ? 'flex-1 min-w-max' : 'w-full justify-start'}
              `}
            >
              {section.icon && (
                <span className={isActive ? 'text-white' : 'text-gray-500'}>
                  {section.icon}
                </span>
              )}
              <span>{section.label}</span>
              {isHorizontal && isActive && <ChevronRight size={16} />}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default NavigationAnchor;
