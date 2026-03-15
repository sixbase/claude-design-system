import { Input } from '@ds/components';
import { Preview } from './Preview';

export function InputStates() {
  return (
    <Preview stack>
      <div style={{ maxWidth: '360px', width: '100%' }}>
        <Input label="Email address" type="email" placeholder="you@example.com" />
      </div>
      <div style={{ maxWidth: '360px', width: '100%' }}>
        <Input label="Password" type="password" hint="Must be at least 8 characters" />
      </div>
      <div style={{ maxWidth: '360px', width: '100%' }}>
        <Input label="Email" error="Please enter a valid email address" />
      </div>
      <div style={{ maxWidth: '360px', width: '100%' }}>
        <Input label="Full name" required />
      </div>
      <div style={{ maxWidth: '360px', width: '100%' }}>
        <Input label="Username" defaultValue="jane_smith" disabled />
      </div>
    </Preview>
  );
}
