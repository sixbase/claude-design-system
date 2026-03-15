# 04 — Components

> Architecture, patterns, and accessibility requirements for every component.

---

## The 4-File Rule

Every component lives in its own folder under `packages/components/src/` and always has exactly these files:

```
packages/components/src/{component}/
├── {Component}.tsx          ← React component implementation
├── {Component}.css          ← Styles (component tokens + all variants)
├── {Component}.test.tsx     ← Vitest + Testing Library + axe tests
├── {Component}.stories.tsx  ← Storybook stories (one per variant/state)
└── index.ts                 ← Re-exports
```

No exceptions. If you're building a component, you're building all four files in the same session. "I'll add tests later" is how you end up with no tests.

---

## TypeScript Patterns

### Always use `forwardRef`

Every component must accept a `ref`. Consumers need ref access for focus management, animations, and third-party integrations.

```tsx
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'primary', ...props }, ref) {
    return <button ref={ref} {...props} />
  }
)
Button.displayName = 'Button'
```

Always set `displayName` — without it, React DevTools shows `ForwardRef` instead of the component name.

### Extend native HTML attributes

Props interfaces extend the native HTML element's attributes. This means consumers get all native props (like `onClick`, `disabled`, `aria-*`) for free:

```tsx
// Button extends all native <button> attributes
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
  loading?: boolean
}

// Input omits 'size' because it conflicts with our size prop
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
}
```

### String literal unions, not enums

```tsx
// ✓ Do this
type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'

// ✗ Don't do this
enum Variant { Primary = 'primary', Secondary = 'secondary' }
```

Enums generate extra runtime code. String literal unions are zero-cost and more idiomatic in modern TypeScript.

### Default variant and size

Always define defaults in the function signature:
```tsx
function Button({ variant = 'primary', size = 'md', ... })
```

---

## The `asChild` / Slot Pattern

Some design decisions require a `<Button>` that renders as an `<a>` tag — for example, a navigation link styled as a primary button. The naive solution wraps `<a>` inside `<button>`, which is invalid HTML. The correct solution uses the Radix `Slot` component.

```tsx
import { Slot } from '@radix-ui/react-slot'

// Inside Button:
const Comp = asChild ? Slot : 'button'
return <Comp className={classes} {...props}>{children}</Comp>
```

When `asChild` is true, `Slot` merges the Button's props (className, ref, aria attributes) onto whatever child element you provide:

```tsx
// The <a> gets all Button styles and aria attributes
<Button asChild>
  <a href="/checkout">Proceed to checkout</a>
</Button>
```

This pattern is used in:
- Button — render as `<a>`, `<Link>`, anything
- Typography Text — render as `<p>`, `<span>`, `<div>`, `<label>`, etc.

---

## CSS Class Naming

BEM-inspired with a `ds-` namespace prefix to prevent collisions with consumer CSS:

```
.ds-{component}                    ← root element
.ds-{component}--{variant}         ← variant modifier
.ds-{component}--{state}           ← state modifier
.ds-{component}__{part}            ← child element
```

**Examples:**
```css
.ds-button                    /* root */
.ds-button--primary           /* variant */
.ds-button--sm                /* size */
.ds-button--loading           /* state */
.ds-button__spinner           /* child element */
.ds-input-root                /* root (compound component) */
.ds-input-field               /* the actual <input> */
.ds-input-label               /* the <label> */
.ds-input-label--required     /* state on child */
.ds-input-error               /* error message child */
```

Classes are assembled in the component with a filter:
```tsx
const classes = [
  'ds-button',
  `ds-button--${variant}`,
  `ds-button--${size}`,
  loading && 'ds-button--loading',
  className,
].filter(Boolean).join(' ')
```

---

## Component Token Scoping

Each component opens its CSS file by declaring component-level tokens on its root class. These are the "knobs" consumers can turn to customize the component without overriding individual properties:

```css
/* Button.css */
.ds-button {
  /* Component tokens — override these to customize */
  --button-radius:      var(--radius-md);
  --button-font-weight: var(--font-weight-medium);

  /* Base styles — use the component tokens */
  border-radius: var(--button-radius);
  font-weight: var(--button-font-weight);
}
```

Consumer override:
```css
/* Only affects buttons in .my-app — no global side effects */
.my-app .ds-button {
  --button-radius: var(--radius-full);
}
```

---

## Focus Management

**Rule:** Never use `outline: none` without providing an alternative focus indicator.

```css
/* ✓ Remove outline, provide a better ring */
.ds-button {
  outline: none;
}
.ds-button:focus-visible {
  box-shadow: 0 0 0 2px var(--color-background), 0 0 0 4px var(--color-focus-ring);
}

/* ✗ Never do this — keyboard users have no idea where focus is */
.ds-button:focus {
  outline: none;
}
```

**`:focus-visible` vs `:focus`:**
- `:focus` triggers on mouse clicks AND keyboard navigation
- `:focus-visible` only triggers when the browser determines a focus indicator is needed (keyboard, not mouse)

This means keyboard users see the focus ring, mouse users don't. Both get correct behavior.

A **global fallback** is also emitted in `tokens.css`:
```css
*:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
```
This catches any interactive element that doesn't have a component-level focus style.

---

## Accessibility Requirements by Component Type

### Button
```tsx
// type="button" prevents accidental form submission
<button type="button" ...>

// For JS-disabled state (not HTML disabled) — still focusable for screen readers
<button aria-disabled={true} ...>

// Loading state
<button aria-busy={true} aria-label="Saving...">
  <Spinner aria-hidden="true" />
  Save
</button>
```

### Input
```tsx
// Label must be associated with input via htmlFor/id
const id = useId()
<label htmlFor={id}>Email</label>
<input id={id} ... />

// Error message announced immediately
<input aria-invalid={true} aria-describedby={errorId} />
<span id={errorId} role="alert">   {/* role="alert" → announced immediately */}
  Please enter a valid email
</span>

// Hint text linked but not announced immediately
<input aria-describedby={hintId} />
<span id={hintId}>We'll never share your email</span>
```

### Typography
- `Heading` renders the correct semantic element (`h1`–`h4`) — not a styled `<div>`
- Icon-only content needs `aria-label` or `aria-hidden` + accompanying visible text

### Dialog / Modal *(implemented — `@radix-ui/react-dialog`)*
- Focus trapped inside the modal while open
- Focus returns to the trigger element when closed
- `role="dialog"`, `aria-labelledby`, `aria-describedby`
- `Escape` key closes
- Compound API: `Modal`, `ModalTrigger`, `ModalContent`, `ModalHeader`, `ModalTitle`, `ModalDescription`, `ModalBody`, `ModalFooter`, `ModalClose`

### Select / Dropdown *(implemented — `@radix-ui/react-select`)*
- `aria-expanded`, `aria-haspopup="listbox"`
- Arrow keys navigate options
- `Enter` / `Space` select an option
- `Escape` closes without selecting
- Compound API: `Select`, `SelectItem`, `SelectGroup`, `SelectSeparator`

### Universal rules
- All icons are either `aria-hidden="true"` (decorative) or have an `aria-label`
- Disabled elements use `opacity: 0.5` not color alone
- Color is never the only indicator of state — also use icons, text, or borders

---

## Testing Every Component

Minimum test coverage for every component:

```tsx
describe('ComponentName', () => {
  // 1. Renders without crashing
  it('renders', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  // 2. Correct HTML element rendered
  it('renders as button by default', () => {
    render(<Button>Click</Button>)
    expect(screen.getByRole('button').tagName).toBe('BUTTON')
  })

  // 3. asChild renders child element, not wrapper
  it('renders as anchor with asChild', () => {
    render(<Button asChild><a href="/path">Link</a></Button>)
    expect(screen.getByRole('link').tagName).toBe('A')
  })

  // 4. Disabled state
  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  // 5. User interaction
  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  // 6. Accessibility scan
  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

---

## Storybook Story Conventions

```tsx
// Meta object — enables autodocs
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],           // generates an automatic props table
  argTypes: {
    variant: { control: 'select' },
    size: { control: 'select' },
  },
}
export default meta

// One story per meaningful state
export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary' },
}

export const Loading: Story = {
  args: { loading: true, children: 'Saving...' },
}

// Use render for complex layouts (multiple components side by side)
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
}
```

---

## Component API Conventions

Establish these conventions and hold to them across every component:

| Convention | Example | Rationale |
|------------|---------|-----------|
| Default variant is `'primary'` | `variant = 'primary'` | Most common usage, no prop required |
| Default size is `'md'` | `size = 'md'` | Middle of the scale |
| Boolean props are false by default | `loading = false` | Opt-in to states |
| Polymorphic via `asChild` | `asChild?: boolean` | Radix Slot pattern |
| Loading disables interaction | `disabled={loading}` | Prevents double-submit |
| Icons are `ReactNode`, not strings | `leadingIcon?: ReactNode` | Flexible, accepts any icon library |
| Error strings, not booleans | `error?: string` | The error text is both the indicator and the message |
