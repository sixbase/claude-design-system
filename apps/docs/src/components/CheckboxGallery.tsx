import { Checkbox } from '@ds/components';
import { Preview } from './Preview';

export function CheckboxStates() {
  return (
    <Preview stack>
      <Checkbox label="Unchecked (default)" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" checked="indeterminate" />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </Preview>
  );
}

export function CheckboxWithText() {
  return (
    <Preview stack>
      <Checkbox
        label="Subscribe to newsletter"
        hint="We send at most one email per week"
      />
      <Checkbox
        label="I agree to the terms and conditions"
        error="You must accept the terms to continue"
      />
    </Preview>
  );
}

export function CheckboxFilter() {
  return (
    <Preview stack>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        <p style={{ margin: 0, fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wider)', color: 'var(--color-foreground-muted)' }}>
          Size
        </p>
        <Checkbox size="sm" label="XS" defaultChecked />
        <Checkbox size="sm" label="S" defaultChecked />
        <Checkbox size="sm" label="M" />
        <Checkbox size="sm" label="L" />
        <Checkbox size="sm" label="XL" disabled />
      </div>
    </Preview>
  );
}
