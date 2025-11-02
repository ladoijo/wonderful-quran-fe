'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import * as Toast from '@radix-ui/react-toast';
import { Button, Flex, Separator } from '@radix-ui/themes';
import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import styles from './ToastProvider.module.css';

export type ToastOptions = {
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
};

type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: Readonly<PropsWithChildren>) {
  const [open, setOpen] = useState(false);
  const eventDateRef = useRef(new Date());
  const [toastState, setToastState] = useState<(ToastOptions & { id: number }) | null>(null);
  const toastTypeClasses: Record<NonNullable<ToastOptions['type']>, string> = {
    success: styles.toastSuccess,
    error: styles.toastError,
    warning: styles.toastWarning,
    info: styles.toastInfo
  };

  const showToast = useCallback((options: ToastOptions) => {
    setToastState({ ...options, id: eventDateRef.current.getTime() });
    setOpen(false);
    setTimeout(() => setOpen(true), 0);
  }, []);

  const handleToastClose = () => {
    setOpen(false);
    setToastState(null);
  };

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      <Toast.Provider swipeDirection="right" duration={toastState?.duration ?? 5000}>
        {children}
        {toastState && (
          <Toast.Root
            className={`${styles.toastRoot} ${toastTypeClasses[toastState.type ?? 'info']}`}
            open={open}
            onOpenChange={setOpen}
          >
            <Flex justify="between" align="center" gap="3" className="w-full px-2 py-1.5">
              <Toast.Title className={styles.toastTitle}>{toastState.title}</Toast.Title>
              <Toast.Close asChild>
                <Toast.Action className={styles.toastAction} asChild altText="close toast">
                  <Button
                    variant="ghost"
                    color="gold"
                    onClick={handleToastClose}
                    radius="full"
                    className="flex w-fit h-fit !p-0 !m-0"
                  >
                    <Cross2Icon className="flex" />
                  </Button>
                </Toast.Action>
              </Toast.Close>
            </Flex>
            <Separator orientation="horizontal" className={styles.toastSeparator} size="4" />
            <Flex direction="column" gap="3" className="w-full p-2">
              <Toast.Description asChild>
                <p className={styles.toastDescription}>{toastState.description}</p>
              </Toast.Description>
              <Toast.Description asChild>
                <time className={styles.toastTime} dateTime={eventDateRef.current.toISOString()}>
                  {prettyDate(eventDateRef.current)}
                </time>
              </Toast.Description>
            </Flex>
          </Toast.Root>
        )}
        <Toast.Viewport className={styles.toastViewport} />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}

function prettyDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(date);
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
