import { render, screen, fireEvent } from '../../../test-utils';
import { Pagination } from '../Pagination';

describe('Pagination Component', () => {
  describe('Rendering', () => {
    it('renders pagination controls', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={jest.fn()}
        />
      );
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByLabelText(/previous page/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/next page/i)).toBeInTheDocument();
    });

    it('displays correct page numbers', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={jest.fn()}
        />
      );
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('shows results info when totalItems and itemsPerPage provided', () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={3}
          totalItems={25}
          itemsPerPage={10}
          onPageChange={jest.fn()}
        />
      );
      
      expect(screen.getByText(/11-20 of 25/i)).toBeInTheDocument();
    });

    it('does not render when totalPages is 1', () => {
      const { container } = render(
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={jest.fn()}
        />
      );
      
      expect(container.firstChild).toBeNull();
    });

    it('does not render when totalPages is 0', () => {
      const { container } = render(
        <Pagination
          currentPage={1}
          totalPages={0}
          onPageChange={jest.fn()}
        />
      );
      
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Page Navigation', () => {
    it('calls onPageChange when page number is clicked', () => {
      const handlePageChange = jest.fn();
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      );
      
      fireEvent.click(screen.getByText('3'));
      expect(handlePageChange).toHaveBeenCalledWith(3);
    });

    it('calls onPageChange when next button is clicked', () => {
      const handlePageChange = jest.fn();
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      );
      
      fireEvent.click(screen.getByLabelText(/next page/i));
      expect(handlePageChange).toHaveBeenCalledWith(3);
    });

    it('calls onPageChange when previous button is clicked', () => {
      const handlePageChange = jest.fn();
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      );
      
      fireEvent.click(screen.getByLabelText(/previous page/i));
      expect(handlePageChange).toHaveBeenCalledWith(2);
    });

    it('disables previous button on first page', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={jest.fn()}
        />
      );
      
      const prevButton = screen.getByLabelText(/previous page/i);
      expect(prevButton).toBeDisabled();
    });

    it('disables next button on last page', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={5}
          onPageChange={jest.fn()}
        />
      );
      
      const nextButton = screen.getByLabelText(/next page/i);
      expect(nextButton).toBeDisabled();
    });

    it('does not call onPageChange when current page is clicked', () => {
      const handlePageChange = jest.fn();
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      );
      
      const currentPageButton = screen.getByText('3');
      fireEvent.click(currentPageButton);
      
      expect(handlePageChange).not.toHaveBeenCalled();
    });
  });

  describe('Page Number Display', () => {
    it('shows ellipsis when there are many pages', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={20}
          onPageChange={jest.fn()}
        />
      );
      
      expect(screen.getAllByText('...')).toHaveLength(2);
    });

    it('shows first and last page when in middle', () => {
      render(
        <Pagination
          currentPage={10}
          totalPages={20}
          onPageChange={jest.fn()}
        />
      );
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('shows surrounding pages around current page', () => {
      render(
        <Pagination
          currentPage={10}
          totalPages={20}
          onPageChange={jest.fn()}
        />
      );
      
      expect(screen.getByText('9')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('11')).toBeInTheDocument();
    });
  });

  describe('Page Size Controls', () => {
    it('renders page size selector when showPageSize is true', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          itemsPerPage={10}
          onPageChange={jest.fn()}
          onPageSizeChange={jest.fn()}
          showPageSize={true}
        />
      );
      
      expect(screen.getByLabelText(/items per page/i)).toBeInTheDocument();
    });

    it('calls onPageSizeChange when page size is changed', () => {
      const handlePageSizeChange = jest.fn();
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          itemsPerPage={10}
          onPageChange={jest.fn()}
          onPageSizeChange={handlePageSizeChange}
          showPageSize={true}
        />
      );
      
      const select = screen.getByLabelText(/items per page/i);
      fireEvent.change(select, { target: { value: '25' } });
      
      expect(handlePageSizeChange).toHaveBeenCalledWith(25);
    });

    it('displays custom page size options', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          itemsPerPage={10}
          pageSizeOptions={[5, 10, 20, 50]}
          onPageChange={jest.fn()}
          onPageSizeChange={jest.fn()}
          showPageSize={true}
        />
      );
      
      expect(screen.getByRole('option', { name: '5' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '50' })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('highlights current page for screen readers', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={jest.fn()}
        />
      );
      
      const currentPageButton = screen.getByText('3');
      expect(currentPageButton).toHaveAttribute('aria-current', 'page');
    });

    it('has proper button labels for navigation', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={jest.fn()}
        />
      );
      
      expect(screen.getByLabelText(/previous page/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/next page/i)).toBeInTheDocument();
    });

    it('has proper button labels for page numbers', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={jest.fn()}
        />
      );
      
      expect(screen.getByLabelText(/go to page 2/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/go to page 3/i)).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={jest.fn()}
          className="custom-pagination"
        />
      );
      
      expect(container.firstChild).toHaveClass('custom-pagination');
    });

    it('highlights current page visually', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={jest.fn()}
        />
      );
      
      const currentPageButton = screen.getByText('3');
      expect(currentPageButton).toHaveClass('bg-primary-600');
    });

    it('uses different styling for non-current pages', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={jest.fn()}
        />
      );
      
      const otherPageButton = screen.getByText('2');
      expect(otherPageButton).not.toHaveClass('bg-primary-600');
      expect(otherPageButton).toHaveClass('hover:bg-gray-100');
    });
  });

  describe('RTL Support', () => {
    it('renders correctly in RTL mode', () => {
      render(
        <div dir="rtl">
          <Pagination
            currentPage={2}
            totalPages={5}
            onPageChange={jest.fn()}
          />
        </div>
      );
      
      expect(screen.getByLabelText(/previous page/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/next page/i)).toBeInTheDocument();
    });
  });
});
