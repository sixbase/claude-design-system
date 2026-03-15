import { Card, CardBody, CardFooter, CardImage, Badge, Button } from '@ds/components';
import { Preview } from './Preview';

export function CardVariants() {
  return (
    <Preview>
      <Card variant="elevated" style={{ width: '200px' }}>
        <CardBody>
          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>Elevated card</p>
        </CardBody>
      </Card>
      <Card variant="outlined" style={{ width: '200px' }}>
        <CardBody>
          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>Outlined card</p>
        </CardBody>
      </Card>
      <Card variant="ghost" style={{ width: '200px' }}>
        <CardBody>
          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>Ghost card</p>
        </CardBody>
      </Card>
    </Preview>
  );
}

export function CardProduct() {
  return (
    <Preview>
      <Card variant="elevated" interactive style={{ width: '220px' }}>
        <CardImage src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop" alt="Premium watch" aspectRatio="4/3" />
        <CardBody>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
            <p style={{ margin: 0, fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)' }}>Minimalist Watch</p>
            <Badge variant="default" size="sm">New</Badge>
          </div>
          <p style={{ margin: 0, color: 'var(--color-foreground-subtle)', fontSize: 'var(--font-size-xs)' }}>$249</p>
        </CardBody>
        <CardFooter>
          <Button size="sm" fullWidth>Add to cart</Button>
        </CardFooter>
      </Card>
    </Preview>
  );
}
