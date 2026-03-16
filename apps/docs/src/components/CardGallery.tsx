import { Card, CardBody, CardFooter, CardImage, Badge, Button, Text } from '@ds/components';
import { Preview } from './Preview';

export function CardVariants() {
  return (
    <Preview>
      <Card variant="elevated" style={{ width: '200px' }}>
        <CardBody>
          <Text size="sm">Elevated card</Text>
        </CardBody>
      </Card>
      <Card variant="outlined" style={{ width: '200px' }}>
        <CardBody>
          <Text size="sm">Outlined card</Text>
        </CardBody>
      </Card>
      <Card variant="ghost" style={{ width: '200px' }}>
        <CardBody>
          <Text size="sm">Ghost card</Text>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-1)' }}>
            <Text size="sm" weight="semibold">Minimalist Watch</Text>
            <Badge variant="default" size="sm">New</Badge>
          </div>
          <Text size="xs" muted>$249</Text>
        </CardBody>
        <CardFooter>
          <Button size="sm" fullWidth>Add to cart</Button>
        </CardFooter>
      </Card>
    </Preview>
  );
}
