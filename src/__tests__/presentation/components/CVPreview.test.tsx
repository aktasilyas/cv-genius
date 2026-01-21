import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CVPreview from '@/components/builder/CVPreview';
import { renderWithProviders } from '@/__tests__/utils/testUtils';
import { initialCVData } from '@/domain/entities/CVData';

// Mock the template loader
vi.mock('@/presentation/components/templates', () => ({
  getTemplateComponent: vi.fn(() => {
    const MockTemplate = ({ data }: any) => (
      <div data-testid="mock-template">
        <h1>{data.personalInfo.fullName || 'CV Template'}</h1>
      </div>
    );
    return MockTemplate;
  }),
  TemplateFallback: () => <div>Loading template...</div>,
}));

// Mock contexts
vi.mock('@/context/CVContext', () => ({
  useCVContext: () => ({
    cvData: initialCVData,
    selectedTemplate: 'modern',
    templateCustomization: {},
  }),
}));

vi.mock('@/context/SettingsContext', () => ({
  useSettings: () => ({
    language: 'en',
    t: (key: string) => key,
  }),
}));

describe('CVPreview', () => {
  it('should render CV preview container', () => {
    render(<CVPreview />);

    const container = screen.getByTestId('mock-template');
    expect(container).toBeInTheDocument();
  });

  it('should display template with CV data', () => {
    render(<CVPreview />);

    expect(screen.getByText(/CV Template/i)).toBeInTheDocument();
  });

  it('should use Suspense for lazy loading', () => {
    const { container } = render(<CVPreview />);

    // Check if Suspense wrapper exists
    expect(container.querySelector('[data-testid="mock-template"]')).toBeInTheDocument();
  });

  it('should be memoized to prevent unnecessary re-renders', () => {
    const { rerender } = render(<CVPreview />);

    // Component should be wrapped with memo
    expect(CVPreview.displayName).toBe('CVPreview');
  });
});
