import React from 'react';

type ToastVariant = 'default' | 'destructive';

interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextType {
  toast: (props: ToastProps) => void;
}

const ToastContext = React.createContext<ToastContextType>({
  toast: () => {},
});

export function useToast() {
  return React.useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = (props: ToastProps) => {
    setToasts((prev) => [...prev, props]);
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
  };

  return React.createElement(
    ToastContext.Provider,
    { value: { toast } },
    children,
    React.createElement(
      'div',
      { className: 'fixed bottom-4 right-4 space-y-2' },
      toasts.map((toast, index) =>
        React.createElement(Toast, { key: index, ...toast })
      )
    )
  );
}

function Toast({ title, description, variant = 'default' }: ToastProps) {
  const variantClasses = {
    default: 'bg-background border',
    destructive: 'bg-destructive text-destructive-foreground',
  };

  return React.createElement(
    'div',
    { className: `rounded-md p-4 shadow-lg ${variantClasses[variant]}` },
    React.createElement('h4', { className: 'font-medium' }, title),
    description && React.createElement('p', { className: 'text-sm' }, description)
  );
}
