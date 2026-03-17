import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, it, expect, vi } from 'vitest';
import { ToastProvider, useToast } from './Toast';

// Helper component to trigger toasts from inside the provider
function ToastTrigger({
  options,
  triggerLabel = 'Show toast',
}: {
  options: Parameters<ReturnType<typeof useToast>['toast']>[0];
  triggerLabel?: string;
}) {
  const { toast } = useToast();
  return (
    <button type="button" onClick={() => toast(options)}>
      {triggerLabel}
    </button>
  );
}

describe('Toast', () => {
  it('renders description text', () => {
    render(
      <ToastProvider>
        <ToastTrigger options={{ description: 'Item saved successfully', duration: 0 }} />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Show toast'));
    expect(screen.getByText('Item saved successfully')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <ToastProvider>
        <ToastTrigger
          options={{ title: 'Success', description: 'Your changes were saved', duration: 0 }}
        />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Show toast'));
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Your changes were saved')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    render(
      <ToastProvider>
        <ToastTrigger
          options={{ description: 'Added to cart', variant: 'success', duration: 0 }}
        />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Show toast'));
    const toast = screen.getByRole('status');
    expect(toast.className).toContain('ds-toast--success');
  });

  it('uses role="alert" for error variant', () => {
    render(
      <ToastProvider>
        <ToastTrigger
          options={{ description: 'Something went wrong', variant: 'error', duration: 0 }}
        />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Show toast'));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('uses role="status" for non-error variants', () => {
    render(
      <ToastProvider>
        <ToastTrigger
          options={{ description: 'Warning message', variant: 'warning', duration: 0 }}
        />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Show toast'));
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('dismiss button removes toast', () => {
    render(
      <ToastProvider>
        <ToastTrigger
          options={{ description: 'Dismissible toast', duration: 0 }}
        />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Show toast'));
    expect(screen.getByText('Dismissible toast')).toBeInTheDocument();

    // Click dismiss — triggers closing state, reduced-motion fallback removes immediately
    fireEvent.click(screen.getByLabelText('Dismiss notification'));
    expect(screen.queryByText('Dismissible toast')).not.toBeInTheDocument();
  });

  it('action button calls onClick', async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(
      <ToastProvider>
        <ToastTrigger
          options={{
            description: 'Item deleted',
            action: { label: 'Undo', onClick: handleAction },
            duration: 0,
          }}
        />
      </ToastProvider>,
    );

    await user.click(screen.getByText('Show toast'));
    await user.click(screen.getByText('Undo'));
    expect(handleAction).toHaveBeenCalledOnce();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ToastProvider>
        <ToastTrigger
          options={{
            title: 'Success',
            description: 'Added to cart',
            variant: 'success',
            duration: 0,
          }}
          triggerLabel="Success toast"
        />
        <ToastTrigger
          options={{
            description: 'Something failed',
            variant: 'error',
            duration: 0,
          }}
          triggerLabel="Error toast"
        />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Success toast'));
    fireEvent.click(screen.getByText('Error toast'));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('respects maxToasts limit', () => {
    function MultiTrigger() {
      const { toast } = useToast();
      return (
        <button
          type="button"
          onClick={() => {
            toast({ description: 'Toast 1', duration: 0 });
            toast({ description: 'Toast 2', duration: 0 });
            toast({ description: 'Toast 3', duration: 0 });
            toast({ description: 'Toast 4', duration: 0 });
          }}
        >
          Fire all
        </button>
      );
    }

    render(
      <ToastProvider maxToasts={2}>
        <MultiTrigger />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Fire all'));

    // Only the last 2 should be visible
    expect(screen.queryByText('Toast 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Toast 2')).not.toBeInTheDocument();
    expect(screen.getByText('Toast 3')).toBeInTheDocument();
    expect(screen.getByText('Toast 4')).toBeInTheDocument();
  });
});
