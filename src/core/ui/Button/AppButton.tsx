import * as React from 'react';
import { Button } from '@fluentui/react-components';
import { makeStyles, shorthands } from '@fluentui/react-components';

export type AppButtonVariant = 'default' | 'primary' | 'danger';

const useAppButtonStyles = makeStyles({
  root: {
    height: '44px',
    fontWeight: '600',
    ...shorthands.borderRadius('12px'),
  },
  primary: {
    height: '44px',
    fontWeight: '600',
    ...shorthands.borderRadius('12px'),
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)',
  },
  danger: {
    height: '44px',
    fontWeight: '600',
    ...shorthands.borderRadius('12px'),
    boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.2)',
  },
});

interface AppButtonProps {
  variant?: AppButtonVariant;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  text?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({
  variant = 'default',
  fullWidth = false,
  icon,
  text,
  children,
  onClick,
  disabled,
  style,
  className,
}) => {
  const buttonStyles = useAppButtonStyles();

  const getAppearance = () => {
    switch (variant) {
      case 'primary':
        return 'primary' as const;
      case 'danger':
        return 'primary' as const;
      default:
        return 'secondary' as const;
    }
  };

  const getClassName = () => {
    const baseClass = variant === 'primary' ? buttonStyles.primary : 
                      variant === 'danger' ? buttonStyles.danger : 
                      buttonStyles.root;
    
    if (fullWidth) {
      return `${baseClass} ${buttonStyles.root}`;
    }
    return baseClass;
  };

  const getStyle = () => {
    const mergedStyle: React.CSSProperties = {};
    
    if (fullWidth) {
      mergedStyle.width = '100%';
      mergedStyle.flex = '1 1 auto';
      mergedStyle.minWidth = '120px';
    }
    
    return { ...mergedStyle, ...style };
  };

  const buttonContent = icon ? (
    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {icon}
      {text || children}
    </span>
  ) : (
    text || children
  );

  return (
    <Button
      appearance={getAppearance()}
      className={getClassName()}
      style={getStyle()}
      {...(onClick && { onClick })}
      {...(disabled !== undefined && { disabled })}
    >
      {buttonContent}
    </Button>
  );
};
