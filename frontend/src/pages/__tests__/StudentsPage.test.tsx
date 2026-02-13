import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { StudentsPage } from '../students/StudentsPage';

// Mock the API calls
jest.mock('../../services/api', () => ({
  getStudents: jest.fn(),
  deleteStudent: jest.fn(),
  searchStudents: jest.fn(),
}));

import { getStudents, deleteStudent, searchStudents } from '../../services/api';

const mockStudents = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    grade: '10',
    enrollmentDate: '2023-09-01',
    status: 'active',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    grade: '11',
    enrollmentDate: '2023-09-01',
    status: 'active',
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    grade: '10',
    enrollmentDate: '2023-09-01',
    status: 'inactive',
  },
];

describe('StudentsPage Integration Tests', () => {
  beforeEach(() => {
    (getStudents as jest.Mock).mockResolvedValue({
      data: mockStudents,
      total: mockStudents.length,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Page Rendering', () => {
    it('renders page title and add student button', async () => {
      render(<StudentsPage />);
      
      expect(screen.getByText('Students')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add student/i })).toBeInTheDocument();
    });

    it('displays loading state initially', () => {
      (getStudents as jest.Mock).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );
      
      render(<StudentsPage />);
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('displays students after loading', async () => {
      render(<StudentsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });
    });

    it('displays empty state when no students', async () => {
      (getStudents as jest.Mock).mockResolvedValue({
        data: [],
        total: 0,
      });
      
      render(<StudentsPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/no students found/i)).toBeInTheDocument();
      });
    });

    it('displays error message on API failure', async () => {
      (getStudents as jest.Mock).mockRejectedValue(new Error('API Error'));
      
      render(<StudentsPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/error loading students/i)).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('filters students when searching', async () => {
      (searchStudents as jest.Mock).mockResolvedValue({
        data: [mockStudents[0]],
        total: 1,
      });
      
      render(<StudentsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      const searchInput = screen.getByPlaceholderText(/search students/i);
      fireEvent.change(searchInput, { target: { value: 'John' } });
      
      await waitFor(() => {
        expect(searchStudents).toHaveBeenCalledWith('John');
      });
    });

    it('clears search results when search is cleared', async () => {
      render(<StudentsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      const searchInput = screen.getByPlaceholderText(/search students/i);
      fireEvent.change(searchInput, { target: { value: 'John' } });
      fireEvent.change(searchInput, { target: { value: '' } });
      
      await waitFor(() => {
        expect(getStudents).toHaveBeenCalled();
      });
    });

    it('displays search results count', async () => {
      (searchStudents as jest.Mock).mockResolvedValue({
        data: [mockStudents[0]],
        total: 1,
      });
      
      render(<StudentsPage />);
      
      const searchInput = screen.getByPlaceholderText(/search students/i);
      fireEvent.change(searchInput, { target: { value: 'John' } });
      
      await waitFor(() => {
        expect(screen.getByText(/1 result/i)).toBeInTheDocument();
      });
    });
  });

  describe('Pagination', () => {
    it('displays pagination when there are multiple pages', async () => {
      (getStudents as jest.Mock).mockResolvedValue({
        data: mockStudents,
        total: 25,
      });
      
      render(<StudentsPage />);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/next page/i)).toBeInTheDocument();
      });
    });

    it('loads next page when next button clicked', async () => {
      (getStudents as jest.Mock).mockResolvedValue({
        data: mockStudents,
        total: 25,
      });
      
      render(<StudentsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      const nextButton = screen.getByLabelText(/next page/i);
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(getStudents).toHaveBeenCalledWith(
          expect.objectContaining({ page: 2 })
        );
      });
    });

    it('changes page size when dropdown is changed', async () => {
      render(<StudentsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      const pageSizeSelect = screen.getByLabelText(/items per page/i);
      fireEvent.change(pageSizeSelect, { target: { value: '25' } });
      
      await waitFor(() => {
        expect(getStudents).toHaveBeenCalledWith(
          expect.objectContaining({ pageSize: 25 })
        );
      });
    });
  });

  describe('Sorting', () => {
    it('sorts students when column header is clicked', async () => {
      render(<StudentsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      const nameHeader = screen.getByText('Name');
      fireEvent.click(nameHeader);
      
      await waitFor(() => {
        expect(getStudents).toHaveBeenCalledWith(
          expect.objectContaining({ 
            sortBy: 'name',
            sortDirection: 'asc'
          })
        );
      });
    });

    it('toggles sort direction on second click', async () => {
      render(<StudentsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      const nameHeader = screen.getByText('Name');
      fireEvent.click(nameHeader);
      
      await waitFor(() => {
        expect(getStudents).toHaveBeenCalledWith(
          expect.objectContaining({ sortDirection: 'asc' })
        );
      });
      
      fireEvent.click(nameHeader);
      
      await waitFor(() => {
        expect(getStudents).toHaveBeenCalledWith(
          expect.objectContaining({ sortDirection: 'desc' })
        );
      });
    });
  });

  describe('Student Actions', () => {
    it('opens add student modal when add button clicked', async () => {
      render(<StudentsPage />);
      
      const addButton = screen.getByRole('button', { name: /add student/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText(/add new student/i)).toBeInTheDocument();
      });
    });

    it('opens edit modal when edit button clicked', async () => {
      render(<StudentsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      fireEvent.click(editButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/edit student/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });
    });

    it('opens delete confirmation when delete button clicked', async () => {
      render(<StudentsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
      });
    });

    it('deletes student after confirmation', async () => {
      (deleteStudent as jest.Mock).mockResolvedValue({ success: true });
      
      render(<StudentsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
      });
      
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      fireEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(deleteStudent).toHaveBeenCalledWith(1);
        expect(getStudents).toHaveBeenCalled(); // Refresh list
      });
    });

    it('cancels delete when cancel button clicked', async () => {
      render(<StudentsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
      });
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);
      
      await waitFor(() => {
        expect(deleteStudent).not.toHaveBeenCalled();
        expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Filters', () => {
    it('opens filter panel when filter button clicked', async () => {
      render(<StudentsPage />);
      
      const filterButton = screen.getByLabelText(/filters/i);
      fireEvent.click(filterButton);
      
      await waitFor(() => {
        expect(screen.getByText(/filter students/i)).toBeInTheDocument();
      });
    });

    it('filters by grade', async () => {
      render(<StudentsPage />);
      
      const filterButton = screen.getByLabelText(/filters/i);
      fireEvent.click(filterButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/grade/i)).toBeInTheDocument();
      });
      
      const gradeSelect = screen.getByLabelText(/grade/i);
      fireEvent.change(gradeSelect, { target: { value: '10' } });
      
      const applyButton = screen.getByRole('button', { name: /apply/i });
      fireEvent.click(applyButton);
      
      await waitFor(() => {
        expect(getStudents).toHaveBeenCalledWith(
          expect.objectContaining({ grade: '10' })
        );
      });
    });

    it('filters by status', async () => {
      render(<StudentsPage />);
      
      const filterButton = screen.getByLabelText(/filters/i);
      fireEvent.click(filterButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
      });
      
      const statusSelect = screen.getByLabelText(/status/i);
      fireEvent.change(statusSelect, { target: { value: 'active' } });
      
      const applyButton = screen.getByRole('button', { name: /apply/i });
      fireEvent.click(applyButton);
      
      await waitFor(() => {
        expect(getStudents).toHaveBeenCalledWith(
          expect.objectContaining({ status: 'active' })
        );
      });
    });

    it('shows active filter count', async () => {
      render(<StudentsPage />);
      
      const filterButton = screen.getByLabelText(/filters/i);
      fireEvent.click(filterButton);
      
      const gradeSelect = screen.getByLabelText(/grade/i);
      fireEvent.change(gradeSelect, { target: { value: '10' } });
      
      const applyButton = screen.getByRole('button', { name: /apply/i });
      fireEvent.click(applyButton);
      
      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument(); // Filter count badge
      });
    });

    it('clears all filters when clear button clicked', async () => {
      render(<StudentsPage />);
      
      const filterButton = screen.getByLabelText(/filters/i);
      fireEvent.click(filterButton);
      
      const gradeSelect = screen.getByLabelText(/grade/i);
      fireEvent.change(gradeSelect, { target: { value: '10' } });
      
      const clearButton = screen.getByRole('button', { name: /clear/i });
      fireEvent.click(clearButton);
      
      await waitFor(() => {
        expect(getStudents).toHaveBeenCalledWith(
          expect.not.objectContaining({ grade: '10' })
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', async () => {
      render(<StudentsPage />);
      
      expect(screen.getByRole('heading', { name: /students/i })).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      render(<StudentsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add student/i });
      addButton.focus();
      
      expect(addButton).toHaveFocus();
    });

    it('announces loading state to screen readers', () => {
      (getStudents as jest.Mock).mockImplementation(
        () => new Promise(() => {})
      );
      
      render(<StudentsPage />);
      
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });
  });
});
