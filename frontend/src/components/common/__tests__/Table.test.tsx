import { render, screen, fireEvent } from '../../../test-utils';
import { Table, Column } from '../Table';

interface TestData {
  id: number;
  name: string;
  email: string;
  age: number;
}

const mockData: TestData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 },
];

const mockColumns: Column<TestData>[] = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
  },
  {
    key: 'email',
    header: 'Email',
    sortable: true,
  },
  {
    key: 'age',
    header: 'Age',
    sortable: true,
  },
];

describe('Table Component', () => {
  describe('Rendering', () => {
    it('renders table with data', () => {
      render(
        <Table 
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id.toString()}
        />
      );
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('35')).toBeInTheDocument();
    });

    it('renders column headers', () => {
      render(
        <Table 
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id.toString()}
        />
      );
      
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
    });

    it('renders empty state when no data', () => {
      render(
        <Table 
          data={[]}
          columns={mockColumns}
          keyExtractor={(item) => item.id.toString()}
          emptyMessage="No data available"
        />
      );
      
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('renders loading state', () => {
      render(
        <Table 
          data={[]}
          columns={mockColumns}
          keyExtractor={(item) => item.id.toString()}
          loading={true}
          loadingMessage="Loading data..."
        />
      );
      
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('shows sort indicators for sortable columns', () => {
      render(
        <Table 
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id.toString()}
        />
      );
      
      const nameHeader = screen.getByText('Name').closest('button');
      expect(nameHeader).toBeInTheDocument();
    });

    it('calls onSort when sortable column header is clicked', () => {
      const handleSort = jest.fn();
      render(
        <Table 
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id.toString()}
          onSort={handleSort}
        />
      );
      
      const nameHeader = screen.getByText('Name').closest('button');
      if (nameHeader) {
        fireEvent.click(nameHeader);
        expect(handleSort).toHaveBeenCalledWith('name', 'asc');
      }
    });

    it('toggles sort direction on subsequent clicks', () => {
      const handleSort = jest.fn();
      render(
        <Table 
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id.toString()}
          onSort={handleSort}
          sortKey="name"
          sortDirection="asc"
        />
      );
      
      const nameHeader = screen.getByText('Name').closest('button');
      if (nameHeader) {
        fireEvent.click(nameHeader);
        expect(handleSort).toHaveBeenCalledWith('name', 'desc');
      }
    });
  });

  describe('Custom Renderers', () => {
    it('uses custom render function for column', () => {
      const customColumns: Column<TestData>[] = [
        {
          key: 'name',
          header: 'Name',
          render: (value) => <strong>Mr. {value}</strong>,
        },
      ];

      render(
        <Table 
          data={mockData}
          columns={customColumns}
          keyExtractor={(item) => item.id.toString()}
        />
      );
      
      expect(screen.getByText(/Mr. John Doe/)).toBeInTheDocument();
    });

    it('passes full row to custom render function', () => {
      const customColumns: Column<TestData>[] = [
        {
          key: 'name',
          header: 'Info',
          render: (value, row) => `${row.name} (${row.age})`,
        },
      ];

      render(
        <Table 
          data={mockData}
          columns={customColumns}
          keyExtractor={(item) => item.id.toString()}
        />
      );
      
      expect(screen.getByText('John Doe (30)')).toBeInTheDocument();
    });
  });

  describe('Row Actions', () => {
    it('renders action buttons when onEdit and onDelete provided', () => {
      render(
        <Table 
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id.toString()}
          onEdit={jest.fn()}
          onDelete={jest.fn()}
        />
      );
      
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      
      expect(editButtons).toHaveLength(mockData.length);
      expect(deleteButtons).toHaveLength(mockData.length);
    });

    it('calls onEdit with correct row data', () => {
      const handleEdit = jest.fn();
      render(
        <Table 
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id.toString()}
          onEdit={handleEdit}
        />
      );
      
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      fireEvent.click(editButtons[0]);
      
      expect(handleEdit).toHaveBeenCalledWith(mockData[0]);
    });

    it('calls onDelete with correct row data', () => {
      const handleDelete = jest.fn();
      render(
        <Table 
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id.toString()}
          onDelete={handleDelete}
        />
      );
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      fireEvent.click(deleteButtons[1]);
      
      expect(handleDelete).toHaveBeenCalledWith(mockData[1]);
    });

    it('renders custom actions with renderActions', () => {
      render(
        <Table 
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id.toString()}
          renderActions={(row) => (
            <button>Custom Action for {row.name}</button>
          )}
        />
      );
      
      expect(screen.getByText('Custom Action for John Doe')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses table role', () => {
      render(
        <Table 
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id.toString()}
        />
      );
      
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('has proper table structure', () => {
      const { container } = render(
        <Table 
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id.toString()}
        />
      );
      
      expect(container.querySelector('thead')).toBeInTheDocument();
      expect(container.querySelector('tbody')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <Table 
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id.toString()}
          className="custom-table"
        />
      );
      
      expect(container.firstChild).toHaveClass('custom-table');
    });

    it('applies striped rows when specified', () => {
      const { container } = render(
        <Table 
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id.toString()}
          striped={true}
        />
      );
      
      const rows = container.querySelectorAll('tbody tr');
      expect(rows[0]).toHaveClass('bg-white');
      expect(rows[1]).toHaveClass('bg-gray-50');
    });
  });
});
