import { describe, it, expect } from 'vitest'
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
    `

    const result = extractTailwindTheme(cssString)

    expect(result.color).toEqual([
      { name: 'primary', value: '#ff0000' },
      { name: 'secondary', value: '#00ff00' },
    ])

    expect(result.text).toEqual([{ name: 'heading', value: '1.5rem' }])

    expect(result.shadow).toEqual([
      { name: 'lg', value: '0 10px 15px rgba(0, 0, 0, 0.1)' },
    ])

    expect(result.radius).toEqual([{ name: 'sm', value: '4px' }])

    expect(result.spacing).toEqual([{ name: '4', value: '16px' }])

    expect(result.breakpoint).toEqual([{ name: 'md', value: '768px' }])

    expect(result.container).toEqual([{ name: 'width', value: '1200px' }])

    expect(result.tracking).toEqual([{ name: 'wide', value: '0.1em' }])

    expect(result.leading).toEqual([{ name: 'relaxed', value: '1.625' }])

    expect(result.blur).toEqual([{ name: 'md', value: '8px' }])

    expect(result.animation).toEqual([{ name: 'fast', value: '200ms' }])
  })

  it('should return empty arrays for missing categories', () => {
    const cssString = `
      --color-primary: #ff0000;
      --text-heading: 1.5rem;
    `

    const result = extractTailwindTheme(cssString)

    expect(result.color).not.toEqual([])
    expect(result.text).not.toEqual([])
    expect(result.shadow).toEqual([])
    expect(result.radius).toEqual([])
    expect(result.font).toEqual([])
    expect(result.spacing).toEqual([])
    expect(result.breakpoint).toEqual([])
    expect(result.container).toEqual([])
    expect(result.tracking).toEqual([])
    expect(result.leading).toEqual([])
    expect(result.blur).toEqual([])
    expect(result.animation).toEqual([])
  })

  it('should return an empty object when given an empty string', () => {
    const result = extractTailwindTheme('')
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
    })
  })

  it('should ignore variables that do not match the prefix categories', () => {
    const cssString = `
      --color-primary: #ff0000;
      --unknown-variable: some-value;
      --text-heading: 1.5rem;
    `

    const result = extractTailwindTheme(cssString)

    expect(result.color).toEqual([{ name: 'primary', value: '#ff0000' }])
    expect(result.text).toEqual([{ name: 'heading', value: '1.5rem' }])
    expect(result.shadow).toEqual([])
    expect(result.radius).toEqual([])
    expect(result.font).toEqual([])
    expect(result.spacing).toEqual([])
    expect(result.breakpoint).toEqual([])
    expect(result.container).toEqual([])
    expect(result.tracking).toEqual([])
    expect(result.leading).toEqual([])
    expect(result.blur).toEqual([])
    expect(result.animation).toEqual([])
  })

  it('should correctly extract text variables with line height', () => {
    const cssString: string = `
  --font-sans: var(--font-freesentation), sans-serif;
  --font-mukta: var(--font-mukta), sans-serif;
  --text-display-1: 3rem;
  --text-display-1--line-height: 130%;
  --text-display-2: 2.5rem;
  --text-display-2--line-height: 130%;
  --text-title-1: 2rem;
  --text-title-1--line-height: 130%;
  --shadow-normal: 0px 1px 4px 0px rgba(96, 100, 136, 0.04);
  --color-primary: #18a0fb;
  --radius-lg: calc(1rem - 6px);
`
    expect(extractTailwindTheme(cssString).text).toEqual([
      { name: 'display-1', value: '3rem', lineHeight: '130%' },
      { name: 'display-2', value: '2.5rem', lineHeight: '130%' },
      { name: 'title-1', value: '2rem', lineHeight: '130%' },
    ])
  })

  it('should sanitize CSS string correctly', () => {
    const cssString: string = `  --shadow-normal: 0px 1px 4px 0px rgba(96, 100, 136, 0.04),
    1px 4px 16px 0px rgba(96, 100, 136, 0.08);
  --shadow-strong: 1px -2px 10px 0px rgba(96, 100, 136, 0.1),
    -1px 4px 16px 0px rgba(96, 100, 136, 0.12);
  --shadow-heavy: 1px 8px 20px 0px rgba(70, 79, 94, 0.2),
    -1px -8px 16px 0px rgba(50, 55, 63, 0.16);`

    expect(extractTailwindTheme(cssString).shadow).toEqual([
      {
        name: 'normal',
        value:
          '0px 1px 4px 0px rgba(96, 100, 136, 0.04), 1px 4px 16px 0px rgba(96, 100, 136, 0.08)',
      },
      {
        name: 'strong',
        value:
          '1px -2px 10px 0px rgba(96, 100, 136, 0.1), -1px 4px 16px 0px rgba(96, 100, 136, 0.12)',
      },
      {
        name: 'heavy',
        value:
          '1px 8px 20px 0px rgba(70, 79, 94, 0.2), -1px -8px 16px 0px rgba(50, 55, 63, 0.16)',
      },
    ])
  })
})
