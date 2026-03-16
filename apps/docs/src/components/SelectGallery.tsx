import { Select, SelectItem, SelectGroup, SelectSeparator } from '@ds/components';
import { Preview } from './Preview';

export function SelectDefault() {
  return (
    <Preview stack>
      <div className="ds-gallery-select">
        <Select label="Size" placeholder="Choose a size">
          <SelectItem value="xs">XS</SelectItem>
          <SelectItem value="sm">SM</SelectItem>
          <SelectItem value="md">MD</SelectItem>
          <SelectItem value="lg">LG</SelectItem>
          <SelectItem value="xl">XL</SelectItem>
        </Select>
      </div>
    </Preview>
  );
}

export function SelectStates() {
  return (
    <Preview stack>
      <div className="ds-gallery-select">
        <Select label="With hint" hint="Choose your preferred size" placeholder="Select...">
          <SelectItem value="sm">SM</SelectItem>
          <SelectItem value="md">MD</SelectItem>
          <SelectItem value="lg">LG</SelectItem>
        </Select>
      </div>
      <div className="ds-gallery-select">
        <Select label="With error" error="Please select a size" placeholder="Select...">
          <SelectItem value="sm">SM</SelectItem>
          <SelectItem value="md">MD</SelectItem>
          <SelectItem value="lg">LG</SelectItem>
        </Select>
      </div>
      <div className="ds-gallery-select">
        <Select label="Disabled" disabled placeholder="Out of stock">
          <SelectItem value="sm">SM</SelectItem>
        </Select>
      </div>
    </Preview>
  );
}

export function SelectSizes() {
  return (
    <Preview stack>
      <div className="ds-gallery-select">
        <Select size="sm" label="Small" placeholder="Small (32px)">
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </Select>
      </div>
      <div className="ds-gallery-select">
        <Select size="md" label="Medium" placeholder="Medium (40px)">
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </Select>
      </div>
      <div className="ds-gallery-select">
        <Select size="lg" label="Large" placeholder="Large (48px)">
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </Select>
      </div>
    </Preview>
  );
}

export function SelectGroups() {
  return (
    <Preview stack>
      <div className="ds-gallery-select--wide">
        <Select label="Category" placeholder="Browse categories">
          <SelectGroup label="Clothing">
            <SelectItem value="tops">Tops</SelectItem>
            <SelectItem value="bottoms">Bottoms</SelectItem>
            <SelectItem value="outerwear">Outerwear</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup label="Accessories">
            <SelectItem value="bags">Bags</SelectItem>
            <SelectItem value="shoes">Shoes</SelectItem>
            <SelectItem value="jewelry">Jewelry</SelectItem>
          </SelectGroup>
        </Select>
      </div>
    </Preview>
  );
}
