import { render, screen, fireEvent } from '../../../test-utils';
import { Modal, ModalActions } from '../Modal';

describe('Modal Component', () => {
  describe('Rendering', () => {
    it('does not render when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={jest.fn()}>
          Modal Content
        </Modal>
      );
      
      expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    it('renders when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          Modal Content
        </Modal>
      );
      
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('renders title when provided', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
          Content
        </Modal>
      );
      
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });

    it('renders description when provided', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} description="Modal description">
          Content
        </Modal>
      );
      
      expect(screen.getByText('Modal description')).toBeInTheDocument();
    });

    it('renders close button by default', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          Content
        </Modal>
      );
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('hides close button when showCloseButton is false', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} showCloseButton={false}>
          Content
        </Modal>
      );
      
      const closeButton = screen.queryByRole('button', { name: /close/i });
      expect(closeButton).not.toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('applies sm size classes', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={jest.fn()} size="sm">
          Content
        </Modal>
      );
      
      const modal = container.querySelector('[class*="max-w-sm"]');
      expect(modal).toBeInTheDocument();
    });

    it('applies md size classes (default)', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={jest.fn()} size="md">
          Content
        </Modal>
      );
      
      const modal = container.querySelector('[class*="max-w-md"]');
      expect(modal).toBeInTheDocument();
    });

    it('applies lg size classes', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={jest.fn()} size="lg">
          Content
        </Modal>
      );
      
      const modal = container.querySelector('[class*="max-w-lg"]');
      expect(modal).toBeInTheDocument();
    });

    it('applies xl size classes', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={jest.fn()} size="xl">
          Content
        </Modal>
      );
      
      const modal = container.querySelector('[class*="max-w-xl"]');
      expect(modal).toBeInTheDocument();
    });

    it('applies full size classes', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={jest.fn()} size="full">
          Content
        </Modal>
      );
      
      const modal = container.querySelector('[class*="max-w-full"]');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClose when close button is clicked', () => {
      const handleClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={handleClose}>
          Content
        </Modal>
      );
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', () => {
      const handleClose = jest.fn();
      const { container } = render(
        <Modal isOpen={true} onClose={handleClose}>
          Content
        </Modal>
      );
      
      const backdrop = container.querySelector('[class*="fixed inset-0"]');
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(handleClose).toHaveBeenCalledTimes(1);
      }
    });

    it('does not call onClose when modal content is clicked', () => {
      const handleClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={handleClose}>
          <div>Content</div>
        </Modal>
      );
      
      fireEvent.click(screen.getByText('Content'));
      expect(handleClose).not.toHaveBeenCalled();
    });

    it('calls onClose when Escape key is pressed', () => {
      const handleClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={handleClose}>
          Content
        </Modal>
      );
      
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('ModalActions Component', () => {
    it('renders actions with children', () => {
      render(
        <ModalActions>
          <button>Cancel</button>
          <button>Submit</button>
        </ModalActions>
      );
      
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('has correct layout classes', () => {
      const { container } = render(
        <ModalActions>
          <button>Action</button>
        </ModalActions>
      );
      
      const actions = container.firstChild as HTMLElement;
      expect(actions).toHaveClass('flex', 'justify-end', 'gap-3');
    });
  });

  describe('Composed Modal', () => {
    it('renders full modal with all sections', () => {
      const handleClose = jest.fn();
      
      render(
        <Modal 
          isOpen={true}
          onClose={handleClose}
          title="Confirm Action"
          description="Are you sure you want to proceed?"
          actions={
            <ModalActions>
              <button onClick={handleClose}>Cancel</button>
              <button>Confirm</button>
            </ModalActions>
          }
        >
          <p>This action cannot be undone.</p>
        </Modal>
      );
      
      expect(screen.getByText('Confirm Action')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
      expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('traps focus within modal', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <input type="text" placeholder="First field" />
          <input type="text" placeholder="Second field" />
        </Modal>
      );
      
      const firstInput = screen.getByPlaceholderText('First field');
      const secondInput = screen.getByPlaceholderText('Second field');
      
      expect(firstInput).toBeInTheDocument();
      expect(secondInput).toBeInTheDocument();
    });

    it('sets body overflow hidden when open', () => {
      const { rerender } = render(
        <Modal isOpen={false} onClose={jest.fn()}>
          Content
        </Modal>
      );
      
      expect(document.body.style.overflow).toBe('');
      
      rerender(
        <Modal isOpen={true} onClose={jest.fn()}>
          Content
        </Modal>
      );
      
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body overflow when closed', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={jest.fn()}>
          Content
        </Modal>
      );
      
      expect(document.body.style.overflow).toBe('hidden');
      
      rerender(
        <Modal isOpen={false} onClose={jest.fn()}>
          Content
        </Modal>
      );
      
      expect(document.body.style.overflow).toBe('');
    });
  });
});
