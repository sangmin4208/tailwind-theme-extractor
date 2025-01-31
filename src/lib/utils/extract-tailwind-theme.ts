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
}

type TailwindThemeType = {
  [key in ThemeCategory]: ThemeVariable[]
}

const parseVariables = (
  css: string,
  prefix: ThemeCategory
): ThemeVariable[] => {
  const regex = new RegExp(`--${prefix}-([a-zA-Z0-9-]+):\s*([^;]+);`, 'g')
  const matches = [...css.matchAll(regex)].map((match) => ({
    name: match[1],
    value: match[2].trim(),
  }))
  return matches.filter(({ name }) => name !== '*')
}

export const extractTailwindTheme = (cssString: string): TailwindThemeType => {
  return {
    color: parseVariables(cssString, 'color'),
    text: parseVariables(cssString, 'text'),
    shadow: parseVariables(cssString, 'shadow'),
    radius: parseVariables(cssString, 'radius'),
    font: parseVariables(cssString, 'font'),
    spacing: parseVariables(cssString, 'spacing'),
    breakpoint: parseVariables(cssString, 'breakpoint'),
    container: parseVariables(cssString, 'container'),
    tracking: parseVariables(cssString, 'tracking'),
    leading: parseVariables(cssString, 'leading'),
    blur: parseVariables(cssString, 'blur'),
    animation: parseVariables(cssString, 'animation'),
  }
}
