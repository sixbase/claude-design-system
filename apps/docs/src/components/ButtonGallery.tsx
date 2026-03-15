import { Button } from '@ds/components';
import { Preview } from './Preview';

// Minimal inline SVG icons — no external package needed for docs examples
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v7M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 4h10M6 4V3h4v1M5 4l1 9h4l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ButtonVariants() {
  return (
    <Preview>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </Preview>
  );
}

export function ButtonSizes() {
  return (
    <Preview>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </Preview>
  );
}

export function ButtonWithIcons() {
  return (
    <Preview>
      <Button leadingIcon={<PlusIcon />}>New item</Button>
      <Button variant="secondary" trailingIcon={<ArrowRightIcon />}>Continue</Button>
      <Button variant="ghost" leadingIcon={<DownloadIcon />}>Export</Button>
      <Button variant="destructive" leadingIcon={<TrashIcon />}>Delete</Button>
    </Preview>
  );
}

export function ButtonStates() {
  return (
    <Preview>
      <Button variant="primary" loading>
        Saving…
      </Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
      <Button variant="secondary" fullWidth>
        Full width
      </Button>
    </Preview>
  );
}
