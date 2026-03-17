import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Text } from '../typography/Typography';
import { Icon } from '../icon/Icon';
import { Button } from '../button/Button';
import './Alert.css';

// ─── Types ────────────────────────────────────────────────

export type AlertVariant = 'info' | 'success' | 'warning' | 'destructive';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual style */
  variant?: AlertVariant;
  /** Optional heading */
  title?: string;
  /** Description content */
  children: ReactNode;
  /** Show dismiss button */
  dismissible?: boolean;
  /** Called when dismiss button is clicked */
  onDismiss?: () => void;
  /** Override the default variant icon */
  icon?: ReactNode;
}

// ─── Variant icons ────────────────────────────────────────

const InfoCircleIcon = () => (
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

const AlertTriangleIcon = () => (
  <Icon size="md" decorative>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Icon>
);

const XCircleIcon = () => (
  <Icon size="md" decorative>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </Icon>
);

const DismissIcon = () => (
  <Icon size="sm" decorative>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Icon>
);

const VARIANT_ICONS: Record<AlertVariant, () => ReactNode> = {
  info: InfoCircleIcon,
  success: CheckCircleIcon,
  warning: AlertTriangleIcon,
  destructive: XCircleIcon,
};

/** Destructive/warning use assertive role="alert"; info/success use polite role="status" */
const VARIANT_ROLES: Record<AlertVariant, 'alert' | 'status'> = {
  info: 'status',
  success: 'status',
  warning: 'alert',
  destructive: 'alert',
};

// ─── Component ────────────────────────────────────────────

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  function Alert(
    {
      variant = 'info',
      title,
      children,
      dismissible = false,
      onDismiss,
      icon,
      className,
      ...props
    },
    ref,
  ) {
    const classes = [
      'ds-alert',
      `ds-alert--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const VariantIcon = VARIANT_ICONS[variant];

    return (
      <div
        ref={ref}
        className={classes}
        role={VARIANT_ROLES[variant]}
        {...props}
      >
        <span className="ds-alert__icon">
          {icon ?? <VariantIcon />}
        </span>

        <div className="ds-alert__content">
          {title && (
            <Text as="p" size="sm" weight="semibold" className="ds-alert__title">
              {title}
            </Text>
          )}
          <Text as="p" size="sm" className="ds-alert__description">
            {children}
          </Text>
        </div>

        {dismissible && (
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            onClick={onDismiss}
            aria-label="Dismiss alert"
            className="ds-alert__dismiss"
          >
            <DismissIcon />
          </Button>
        )}
      </div>
    );
  },
);

Alert.displayName = 'Alert';
