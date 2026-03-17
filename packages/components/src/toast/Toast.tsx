import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Text } from '../typography/Typography';
import { Icon } from '../icon/Icon';
import { Button } from '../button/Button';
import './Toast.css';

// ─── Types ────────────────────────────────────────────────

export type ToastVariant = 'default' | 'success' | 'error' | 'warning';
export type ToastPosition = 'top-right' | 'bottom-right' | 'bottom-center';

export interface ToastData {
  id: string;
  title?: string;
  description: string;
  variant: ToastVariant;
  duration: number;
  action?: { label: string; onClick: () => void };
  onDismiss?: () => void;
}

export type ToastOptions = Omit<ToastData, 'id' | 'variant' | 'duration'> & {
  variant?: ToastVariant;
  duration?: number;
};

export interface ToastProviderProps {
  children: ReactNode;
  /** Where toasts appear on screen */
  position?: ToastPosition;
  /** Maximum number of visible toasts */
  maxToasts?: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

// ─── Icons ────────────────────────────────────────────────

const InfoIcon = () => (
  <Icon size="md" decorative>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </Icon>
);

const CheckCircleIcon = () => (
  <Icon size="md" decorative>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </Icon>
);

const XCircleIcon = () => (
  <Icon size="md" decorative>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </Icon>
);

const AlertTriangleIcon = () => (
  <Icon size="md" decorative>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Icon>
);

const VARIANT_ICONS: Record<ToastVariant, () => ReactNode> = {
  default: InfoIcon,
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: AlertTriangleIcon,
};

const DismissIcon = () => (
  <Icon size="sm" decorative>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Icon>
);

// ─── Context ──────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── useToast hook ────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}

// ─── Individual Toast ─────────────────────────────────────

interface ToastItemProps extends HTMLAttributes<HTMLDivElement> {
  data: ToastData;
  onRemove: (id: string) => void;
  position: ToastPosition;
}

export const Toast = forwardRef<HTMLDivElement, ToastItemProps>(
  function Toast({ data, onRemove, position, className, ...props }, ref) {
    const { id, title, description, variant, duration, action, onDismiss } = data;
    const [closing, setClosing] = useState(false);
    const toastRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const startTimeRef = useRef<number>(0);
    const remainingRef = useRef<number>(duration);

    const startTimer = useCallback(() => {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        setClosing(true);
      }, remainingRef.current);
    }, []);

    const pauseTimer = useCallback(() => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        const elapsed = Date.now() - startTimeRef.current;
        remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      }
    }, []);

    // Auto-dismiss timer
    useEffect(() => {
      if (duration <= 0) return;
      startTimer();
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, [duration, startTimer]);

    // Reduced-motion fallback for exit animation
    useEffect(() => {
      if (!closing) return;
      const el = toastRef.current;
      if (!el) return;
      const animName = getComputedStyle(el).animationName;
      if (animName === 'none' || animName === '') {
        onDismiss?.();
        onRemove(id);
      }
    }, [closing, id, onRemove, onDismiss]);

    const handleAnimationEnd = useCallback(() => {
      if (closing) {
        onDismiss?.();
        onRemove(id);
      }
    }, [closing, id, onRemove, onDismiss]);

    const handleDismiss = useCallback(() => {
      setClosing(true);
    }, []);

    const handleMouseEnter = useCallback(() => {
      pauseTimer();
    }, [pauseTimer]);

    const handleMouseLeave = useCallback(() => {
      if (duration > 0 && !closing) {
        startTimer();
      }
    }, [duration, closing, startTimer]);

    const handleFocus = useCallback(() => {
      pauseTimer();
    }, [pauseTimer]);

    const handleBlur = useCallback(() => {
      if (duration > 0 && !closing) {
        startTimer();
      }
    }, [duration, closing, startTimer]);

    const isCenter = position === 'bottom-center';
    const closingClass = closing
      ? isCenter
        ? 'ds-toast--closing-center'
        : 'ds-toast--closing'
      : '';

    const enterClass = isCenter ? 'ds-toast--enter-center' : 'ds-toast--enter';

    const classes = [
      'ds-toast',
      `ds-toast--${variant}`,
      enterClass,
      closingClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const isError = variant === 'error';
    const VariantIcon = VARIANT_ICONS[variant];

    return (
      <div
        ref={(node) => {
          (toastRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={classes}
        role={isError ? 'alert' : 'status'}
        aria-live={isError ? 'assertive' : 'polite'}
        onAnimationEnd={handleAnimationEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        <span className="ds-toast__icon">
          <VariantIcon />
        </span>

        <div className="ds-toast__content">
          {title && (
            <Text as="p" size="sm" weight="semibold" className="ds-toast__title">
              {title}
            </Text>
          )}
          <Text as="p" size="sm" className="ds-toast__description">
            {description}
          </Text>
        </div>

        <div className="ds-toast__actions">
          {action && (
            <Button
              variant="ghost"
              size="sm"
              onClick={action.onClick}
              className="ds-toast__action"
            >
              {action.label}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            onClick={handleDismiss}
            aria-label="Dismiss notification"
            className="ds-toast__dismiss"
          >
            <DismissIcon />
          </Button>
        </div>
      </div>
    );
  },
);

Toast.displayName = 'Toast';

// ─── Provider ─────────────────────────────────────────────

let toastCounter = 0;

export function ToastProvider({
  children,
  position = 'bottom-right',
  maxToasts = 3,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toast = useCallback((options: ToastOptions): string => {
    const id = `toast-${++toastCounter}`;
    const newToast: ToastData = {
      id,
      description: options.description,
      title: options.title,
      variant: options.variant ?? 'default',
      duration: options.duration ?? 5000,
      action: options.action,
      onDismiss: options.onDismiss,
    };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const visibleToasts = toasts.slice(-maxToasts);

  const containerClasses = [
    'ds-toast-container',
    `ds-toast-container--${position}`,
  ].join(' ');

  return (
    <ToastContext.Provider value={{ toast, dismiss, dismissAll }}>
      {children}
      {mounted &&
        createPortal(
          visibleToasts.length > 0 ? (
            <div className={containerClasses} aria-label="Notifications">
              {visibleToasts.map((t) => (
                <Toast
                  key={t.id}
                  data={t}
                  onRemove={dismiss}
                  position={position}
                />
              ))}
            </div>
          ) : null,
          document.body,
        )}
    </ToastContext.Provider>
  );
}
