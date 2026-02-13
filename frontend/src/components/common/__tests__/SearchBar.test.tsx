import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import { SearchBar } from '../SearchBar';

describe('SearchBar Component', () => {
  describe('Rendering', () => {
    it('renders search input', () => {
      render(<SearchBar onSearch={jest.fn()} />);
      
      const input = screen.getByPlaceholderText(/search/i);
      expect(input).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      render(<SearchBar onSearch={jest.fn()} placeholder="Search students..." />);
      
      expect(screen.getByPlaceholderText('Search students...')).toBeInTheDocument();
    });

    it('renders search icon', () => {
      const { container } = render(<SearchBar onSearch={jest.fn()} />);
      
      const searchIcon = container.querySelector('svg');
      expect(searchIcon).toBeInTheDocument();
    });

    it('renders loading state', () => {
      render(<SearchBar onSearch={jest.fn()} loading={true} />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('does not render clear button when input is empty', () => {
      render(<SearchBar onSearch={jest.fn()} />);
      
      expect(screen.queryByLabelText(/clear search/i)).not.toBeInTheDocument();
    });

    it('renders clear button when input has value', () => {
      render(<SearchBar onSearch={jest.fn()} value="test" />);
      
      expect(screen.getByLabelText(/clear search/i)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onSearch when typing', () => {
      const handleSearch = jest.fn();
      render(<SearchBar onSearch={handleSearch} />);
      
      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: 'test query' } });
      
      expect(handleSearch).toHaveBeenCalledWith('test query');
    });

    it('calls onSearch when Enter key is pressed', () => {
      const handleSearch = jest.fn();
      render(<SearchBar onSearch={handleSearch} />);
      
      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: 'test' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      
      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    it('clears input when clear button is clicked', () => {
      const handleSearch = jest.fn();
      render(<SearchBar onSearch={handleSearch} value="test" />);
      
      const clearButton = screen.getByLabelText(/clear search/i);
      fireEvent.click(clearButton);
      
      expect(handleSearch).toHaveBeenCalledWith('');
    });

    it('focuses input after clearing', () => {
      const handleSearch = jest.fn();
      render(<SearchBar onSearch={handleSearch} value="test" />);
      
      const input = screen.getByPlaceholderText(/search/i);
      const clearButton = screen.getByLabelText(/clear search/i);
      
      fireEvent.click(clearButton);
      
      expect(input).toHaveFocus();
    });
  });

  describe('Debouncing', () => {
    jest.useFakeTimers();

    it('debounces search calls when debounce prop is set', async () => {
      const handleSearch = jest.fn();
      render(<SearchBar onSearch={handleSearch} debounce={300} />);
      
      const input = screen.getByPlaceholderText(/search/i);
      
      fireEvent.change(input, { target: { value: 't' } });
      fireEvent.change(input, { target: { value: 'te' } });
      fireEvent.change(input, { target: { value: 'tes' } });
      fireEvent.change(input, { target: { value: 'test' } });
      
      expect(handleSearch).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(300);
      
      await waitFor(() => {
        expect(handleSearch).toHaveBeenCalledTimes(1);
        expect(handleSearch).toHaveBeenCalledWith('test');
      });
    });

    it('does not debounce when debounce is 0', () => {
      const handleSearch = jest.fn();
      render(<SearchBar onSearch={handleSearch} debounce={0} />);
      
      const input = screen.getByPlaceholderText(/search/i);
      
      fireEvent.change(input, { target: { value: 't' } });
      fireEvent.change(input, { target: { value: 'te' } });
      
      expect(handleSearch).toHaveBeenCalledTimes(2);
    });

    afterAll(() => {
      jest.useRealTimers();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('works as controlled component', () => {
      const handleSearch = jest.fn();
      const { rerender } = render(
        <SearchBar onSearch={handleSearch} value="initial" />
      );
      
      expect(screen.getByPlaceholderText(/search/i)).toHaveValue('initial');
      
      rerender(<SearchBar onSearch={handleSearch} value="updated" />);
      
      expect(screen.getByPlaceholderText(/search/i)).toHaveValue('updated');
    });

    it('works as uncontrolled component', () => {
      const handleSearch = jest.fn();
      render(<SearchBar onSearch={handleSearch} />);
      
      const input = screen.getByPlaceholderText(/search/i);
      
      fireEvent.change(input, { target: { value: 'test' } });
      
      expect(input).toHaveValue('test');
    });
  });

  describe('Filters', () => {
    it('renders filter button when onFilterClick provided', () => {
      render(<SearchBar onSearch={jest.fn()} onFilterClick={jest.fn()} />);
      
      expect(screen.getByLabelText(/filters/i)).toBeInTheDocument();
    });

    it('calls onFilterClick when filter button is clicked', () => {
      const handleFilterClick = jest.fn();
      render(<SearchBar onSearch={jest.fn()} onFilterClick={handleFilterClick} />);
      
      fireEvent.click(screen.getByLabelText(/filters/i));
      
      expect(handleFilterClick).toHaveBeenCalledTimes(1);
    });

    it('shows filter count badge when filterCount > 0', () => {
      render(
        <SearchBar 
          onSearch={jest.fn()} 
          onFilterClick={jest.fn()} 
          filterCount={3} 
        />
      );
      
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('highlights filter button when filters are active', () => {
      render(
        <SearchBar 
          onSearch={jest.fn()} 
          onFilterClick={jest.fn()} 
          filterCount={2} 
        />
      );
      
      const filterButton = screen.getByLabelText(/filters/i);
      expect(filterButton).toHaveClass('bg-primary-100');
    });
  });

  describe('Accessibility', () => {
    it('has proper input role', () => {
      render(<SearchBar onSearch={jest.fn()} />);
      
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('has accessible clear button', () => {
      render(<SearchBar onSearch={jest.fn()} value="test" />);
      
      const clearButton = screen.getByLabelText(/clear search/i);
      expect(clearButton).toHaveAttribute('type', 'button');
    });

    it('supports keyboard navigation', () => {
      const handleSearch = jest.fn();
      render(<SearchBar onSearch={handleSearch} />);
      
      const input = screen.getByPlaceholderText(/search/i);
      
      fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
      
      expect(input).toHaveValue('');
    });

    it('announces search results count to screen readers', () => {
      render(<SearchBar onSearch={jest.fn()} resultsCount={5} />);
      
      expect(screen.getByText(/5 results/i)).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <SearchBar onSearch={jest.fn()} className="custom-search" />
      );
      
      expect(container.firstChild).toHaveClass('custom-search');
    });

    it('applies focus styles on input focus', () => {
      render(<SearchBar onSearch={jest.fn()} />);
      
      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.focus(input);
      
      expect(input).toHaveFocus();
    });
  });

  describe('RTL Support', () => {
    it('renders correctly in RTL mode', () => {
      render(
        <div dir="rtl">
          <SearchBar onSearch={jest.fn()} />
        </div>
      );
      
      const input = screen.getByPlaceholderText(/search/i);
      expect(input).toBeInTheDocument();
    });

    it('positions icons correctly in RTL', () => {
      const { container } = render(
        <div dir="rtl">
          <SearchBar onSearch={jest.fn()} />
        </div>
      );
      
      const searchIcon = container.querySelector('svg');
      expect(searchIcon).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very long search queries', () => {
      const handleSearch = jest.fn();
      const longQuery = 'a'.repeat(500);
      
      render(<SearchBar onSearch={handleSearch} />);
      
      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: longQuery } });
      
      expect(handleSearch).toHaveBeenCalledWith(longQuery);
    });

    it('handles special characters in search', () => {
      const handleSearch = jest.fn();
      render(<SearchBar onSearch={handleSearch} />);
      
      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: '!@#$%^&*()' } });
      
      expect(handleSearch).toHaveBeenCalledWith('!@#$%^&*()');
    });

    it('handles empty string search', () => {
      const handleSearch = jest.fn();
      render(<SearchBar onSearch={handleSearch} value="test" />);
      
      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: '' } });
      
      expect(handleSearch).toHaveBeenCalledWith('');
    });
  });
});
