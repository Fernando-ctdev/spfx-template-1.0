import * as React from 'react';
import { Dialog, DialogProps, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions } from '@fluentui/react-components';
import { makeStyles } from '@fluentui/react-components';

const useDialogStyles = makeStyles({
  surface: {
    borderRadius: '16px',
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

interface AppModalProps extends Omit<DialogProps, 'children'> {
  isOpen?: boolean;
  title?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export const AppModal: React.FC<AppModalProps> = ({
  open = false,
  isOpen,
  title,
  children,
  actions,
  onOpenChange,
  ...props
}) => {
  const dialogStyles = useDialogStyles();
  const isDialogOpen = isOpen !== undefined ? isOpen : open;

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={onOpenChange}
      {...props}
    >
      <DialogSurface className={dialogStyles.surface}>
        <DialogBody>
          {title && <DialogTitle>{title}</DialogTitle>}
          <DialogContent>
            {children}
          </DialogContent>
          {actions && (
            <DialogActions className={dialogStyles.actions}>
              {actions}
            </DialogActions>
          )}
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
