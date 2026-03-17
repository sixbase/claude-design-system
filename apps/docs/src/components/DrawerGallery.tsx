import { useState } from 'react';
import { Button, Drawer, Text, Heading } from '@ds/components';

export function DrawerDefault() {
  const [open, setOpen] = useState(false);
  return (
    <div className="ds-gallery-row">
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer open={open} onOpenChange={setOpen} title="Default drawer">
        <div className="ds-gallery-stack">
          <Heading level={3} size="md">Drawer content</Heading>
          <Text>
            A generic slide-out panel. Use it as the base for cart drawers,
            mobile navigation menus, and filter sidebars.
          </Text>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

export function DrawerLeftSide() {
  const [open, setOpen] = useState(false);
  return (
    <div className="ds-gallery-row">
      <Button onClick={() => setOpen(true)}>Open left drawer</Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        side="left"
        title="Navigation menu"
      >
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {['Home', 'Shop', 'Collections', 'About', 'Contact'].map((item) => (
              <li key={item}>
                <Button variant="ghost" fullWidth>{item}</Button>
              </li>
            ))}
          </ul>
        </nav>
      </Drawer>
    </div>
  );
}

export function DrawerCustomWidth() {
  const [open, setOpen] = useState(false);
  return (
    <div className="ds-gallery-row">
      <Button onClick={() => setOpen(true)}>Open narrow drawer (360px)</Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        width="360px"
        title="Shopping cart"
      >
        <div className="ds-gallery-stack">
          <Heading level={3} size="md">Your cart</Heading>
          <Text muted>Your cart is empty. Start shopping to add items.</Text>
          <Button onClick={() => setOpen(false)}>Continue shopping</Button>
        </div>
      </Drawer>
    </div>
  );
}

export function DrawerScrollable() {
  const [open, setOpen] = useState(false);
  return (
    <div className="ds-gallery-row">
      <Button onClick={() => setOpen(true)}>Open with long content</Button>
      <Drawer open={open} onOpenChange={setOpen} title="Filter products">
        <div className="ds-gallery-stack">
          <Heading level={3} size="md">Filters</Heading>
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              style={{
                padding: 'var(--spacing-3)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <Text>Filter option {i + 1}</Text>
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
}
