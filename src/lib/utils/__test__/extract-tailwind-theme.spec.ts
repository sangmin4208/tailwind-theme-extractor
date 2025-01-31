import { describe, it, expect } from 'vitest';
import { extractTailwindTheme } from '@/lib/utils/extract-tailwind-theme'

describe('extractTailwindTheme', () => {
  it('should extract theme variables correctly', () => {
    const cssString = `
      --color-primary: #ff0000;
      --color-secondary: #00ff00;
      --text-heading: 1.5rem;
      --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
      --radius-sm: 4px;
      --spacing-4: 16px;
      --breakpoint-md: 768px;
      --container-width: 1200px;
      --tracking-wide: 0.1em;
      --leading-relaxed: 1.625;
      --blur-md: 8px;
      --animation-fast: 200ms;
    `;

    const result = extractTailwindTheme(cssString);

    expect(result.color).toEqual([
      { name: 'primary', value: '#ff0000' },
      { name: 'secondary', value: '#00ff00' },
    ]);

    expect(result.text).toEqual([
      { name: 'heading', value: '1.5rem' },
    ]);

    expect(result.shadow).toEqual([
      { name: 'lg', value: '0 10px 15px rgba(0, 0, 0, 0.1)' },
    ]);

    expect(result.radius).toEqual([
      { name: 'sm', value: '4px' },
    ]);

    expect(result.spacing).toEqual([
      { name: '4', value: '16px' },
    ]);

    expect(result.breakpoint).toEqual([
      { name: 'md', value: '768px' },
    ]);

    expect(result.container).toEqual([
      { name: 'width', value: '1200px' },
    ]);

    expect(result.tracking).toEqual([
      { name: 'wide', value: '0.1em' },
    ]);

    expect(result.leading).toEqual([
      { name: 'relaxed', value: '1.625' },
    ]);

    expect(result.blur).toEqual([
      { name: 'md', value: '8px' },
    ]);

    expect(result.animation).toEqual([
      { name: 'fast', value: '200ms' },
    ]);
  });

  it('should return empty arrays for missing categories', () => {
    const cssString = `
      --color-primary: #ff0000;
      --text-heading: 1.5rem;
    `;

    const result = extractTailwindTheme(cssString);

    expect(result.color).not.toEqual([]);
    expect(result.text).not.toEqual([]);
    expect(result.shadow).toEqual([]);
    expect(result.radius).toEqual([]);
    expect(result.font).toEqual([]);
    expect(result.spacing).toEqual([]);
    expect(result.breakpoint).toEqual([]);
    expect(result.container).toEqual([]);
    expect(result.tracking).toEqual([]);
    expect(result.leading).toEqual([]);
    expect(result.blur).toEqual([]);
    expect(result.animation).toEqual([]);
  });

  it('should return an empty object when given an empty string', () => {
    const result = extractTailwindTheme('');
    expect(result).toEqual({
      color: [],
      text: [],
      shadow: [],
      radius: [],
      font: [],
      spacing: [],
      breakpoint: [],
      container: [],
      tracking: [],
      leading: [],
      blur: [],
      animation: [],
    });
  });

  it('should ignore variables that do not match the prefix categories', () => {
    const cssString = `
      --color-primary: #ff0000;
      --unknown-variable: some-value;
      --text-heading: 1.5rem;
    `;

    const result = extractTailwindTheme(cssString);

    expect(result.color).toEqual([{ name: 'primary', value: '#ff0000' }]);
    expect(result.text).toEqual([{ name: 'heading', value: '1.5rem' }]);
    expect(result.shadow).toEqual([]);
    expect(result.radius).toEqual([]);
    expect(result.font).toEqual([]);
    expect(result.spacing).toEqual([]);
    expect(result.breakpoint).toEqual([]);
    expect(result.container).toEqual([]);
    expect(result.tracking).toEqual([]);
    expect(result.leading).toEqual([]);
    expect(result.blur).toEqual([]);
    expect(result.animation).toEqual([]);
  });
});