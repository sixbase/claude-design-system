import { Card, CardBody, CardFooter, CardImage, Badge, Button, Text } from '@ds/components';
import { Preview } from './Preview';

export function CardVariants() {
  return (
    <Preview>
      <Card variant="elevated" className="ds-gallery-card">
        <CardBody>
          <Text size="sm">Elevated card</Text>
        </CardBody>
      </Card>
      <Card variant="outlined" className="ds-gallery-card">
        <CardBody>
          <Text size="sm">Outlined card</Text>
        </CardBody>
      </Card>
      <Card variant="ghost" className="ds-gallery-card">
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
      <Card variant="elevated" interactive className="ds-gallery-card--wide">
        <CardImage src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop" alt="Premium watch" aspectRatio="4/3" />
        <CardBody>
          <div className="ds-gallery-product-meta">
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
