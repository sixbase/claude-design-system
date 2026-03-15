import { useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@ds/components';

export function ModalDefault() {
  return (
    <div className="gallery-row">
      <Modal>
        <ModalTrigger asChild>
          <Button>Edit profile</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Edit profile</ModalTitle>
            <ModalDescription>
              Make changes to your profile. Click save when you're done.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input label="Name" defaultValue="Jane Doe" />
              <Input label="Email" defaultValue="jane@example.com" />
            </div>
          </ModalBody>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="secondary">Cancel</Button>
            </ModalClose>
            <Button>Save changes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export function ModalSizes() {
  return (
    <div className="gallery-row">
      <Modal>
        <ModalTrigger asChild>
          <Button variant="secondary">Small (400px)</Button>
        </ModalTrigger>
        <ModalContent size="sm">
          <ModalHeader>
            <ModalTitle>Delete item?</ModalTitle>
            <ModalDescription>
              This action cannot be undone.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="secondary">Cancel</Button>
            </ModalClose>
            <Button variant="destructive">Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal>
        <ModalTrigger asChild>
          <Button variant="secondary">Medium (520px)</Button>
        </ModalTrigger>
        <ModalContent size="md">
          <ModalHeader>
            <ModalTitle>Edit profile</ModalTitle>
            <ModalDescription>Default size — suitable for forms and confirmations.</ModalDescription>
          </ModalHeader>
          <ModalBody>
            <p style={{ margin: 0 }}>Form content goes here.</p>
          </ModalBody>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="secondary">Cancel</Button>
            </ModalClose>
            <Button>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal>
        <ModalTrigger asChild>
          <Button variant="secondary">Large (680px)</Button>
        </ModalTrigger>
        <ModalContent size="lg">
          <ModalHeader>
            <ModalTitle>Order #12345</ModalTitle>
            <ModalDescription>Order placed on March 10, 2026 — 3 items</ModalDescription>
          </ModalHeader>
          <ModalBody>
            <p style={{ margin: 0 }}>Organic Cotton T-Shirt × 2 — $58.00</p>
            <p style={{ margin: 0 }}>Merino Wool Beanie × 1 — $32.00</p>
          </ModalBody>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="secondary">Close</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export function ModalConfirmation() {
  return (
    <div className="gallery-row">
      <Modal>
        <ModalTrigger asChild>
          <Button variant="destructive">Remove from cart</Button>
        </ModalTrigger>
        <ModalContent size="sm">
          <ModalHeader>
            <ModalTitle>Remove item?</ModalTitle>
            <ModalDescription>
              "Organic Cotton T-Shirt" will be removed from your cart.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="secondary">Keep item</Button>
            </ModalClose>
            <Button variant="destructive">Remove</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export function ModalControlled() {
  const [open, setOpen] = useState(false);
  return (
    <div className="gallery-row">
      <Button onClick={() => setOpen(true)}>Open (controlled)</Button>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Controlled modal</ModalTitle>
            <ModalDescription>
              The open state is managed externally via useState.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <p style={{ margin: 0 }}>
              Open state: <code>{String(open)}</code>
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
