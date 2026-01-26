import * as React from 'react';
import { Input } from '@fluentui/react-components';
import { makeStyles, shorthands } from '@fluentui/react-components';

const useInputStyles = makeStyles({
  root: {
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    outline: 'none',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
});

interface AppInputProps {
  fullWidth?: boolean;
  icon?: React.ReactNode;
  value?: string;
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const AppInput: React.FC<AppInputProps> = ({
  fullWidth = false,
  icon,
  value,
  onChange,
  placeholder,
  disabled,
  style,
  className,
}) => {
  const inputStyles = useInputStyles();

  const wrapperStyle: React.CSSProperties = {
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    outline: 'none',
    ...(fullWidth && { width: '100%' }),
    ...style,
  };

  return (
    <div style={wrapperStyle} className={inputStyles.wrapper}>
      {icon && <span style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>{icon}</span>}
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent' }}
      />
    </div>
  );
};
