type ThemeCategory =
  | 'color'
  | 'text'
  | 'shadow'
  | 'radius'
  | 'font'
  | 'spacing'
  | 'breakpoint'
  | 'container'
  | 'tracking'
  | 'leading'
  | 'blur'
  | 'animation'

type ThemeVariable = {
  name: string
  value: string
  lineHeight?: string
}

type TailwindThemeType = {
  [key in ThemeCategory]: ThemeVariable[]
}

const parseVariables = (
  css: string,
  prefix: ThemeCategory
): ThemeVariable[] => {
  const sanitizeCSS = (input: string) => input.replace(/\s*\n\s*/g, ' ')

  const variables: Record<string, ThemeVariable> = {}
  const sanitizedCSS = sanitizeCSS(css)

  // Extract base variables
  const baseRegex = new RegExp(`--${prefix}-([a-zA-Z0-9-]+):\\s*([^;]+);`, 'g')

  for (const match of sanitizedCSS.matchAll(baseRegex)) {
    const name = match[1]
    const value = match[2].trim()
    variables[name] = { name, value }
  }

  const lineHeightRegex = new RegExp(
    `--${prefix}-([a-zA-Z0-9-]+)--line-height:\\s*([^;]+);`,
    'g'
  )
  // Extract line-height and merge into existing variables
  for (const match of sanitizedCSS.matchAll(lineHeightRegex)) {
    const name = match[1]
    const lineHeight = match[2].trim()
    if (variables[name]) {
      variables[name].lineHeight = lineHeight
    }
  }

  return Object.values(variables).filter(
    (variable) => !variable.name.includes('--line-height')
  )
}
export const extractTailwindTheme = (css: string): TailwindThemeType => {
  return {
    color: parseVariables(css, 'color'),
    text: parseVariables(css, 'text'),
    shadow: parseVariables(css, 'shadow'),
    radius: parseVariables(css, 'radius'),
    font: parseVariables(css, 'font'),
    spacing: parseVariables(css, 'spacing'),
    breakpoint: parseVariables(css, 'breakpoint'),
    container: parseVariables(css, 'container'),
    tracking: parseVariables(css, 'tracking'),
    leading: parseVariables(css, 'leading'),
    blur: parseVariables(css, 'blur'),
    animation: parseVariables(css, 'animation'),
  }
}
