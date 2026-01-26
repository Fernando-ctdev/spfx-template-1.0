import { makeStyles, shorthands } from '@fluentui/react-components';

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
} as const;

export const useButtonStyles = makeStyles({
  root: {
    height: '44px',
    fontWeight: '600',
    ...shorthands.borderRadius(borderRadius.md),
  },
  primary: {
    height: '44px',
    fontWeight: '600',
    ...shorthands.borderRadius(borderRadius.md),
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)',
  },
  danger: {
    height: '44px',
    fontWeight: '600',
    ...shorthands.borderRadius(borderRadius.md),
    boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.2)',
  },
});

export const useInputStyles = makeStyles({
  root: {
    ...shorthands.borderRadius(borderRadius.sm),
    ...shorthands.border('2px', 'solid', '#e2e8f0'),
    outline: 'none',
  },
});

export const useDialogStyles = makeStyles({
  surface: {
    ...shorthands.borderRadius(borderRadius.lg),
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    maxWidth: '90vw',
    width: '480px',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
});
