import { defineEcConfig } from 'astro-expressive-code'
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import { DESIGN } from './src/config.mts'

export default defineEcConfig({
  themes: ['catppuccin-mocha', 'catppuccin-latte'],
  themeCssSelector: (theme) => (theme.name === 'catppuccin-mocha' ? '.dark' : ':root:not(.dark)'),

  defaultLocale: 'zh-CN',
  defaultProps: {
    wrap: false,
    showLineNumbers: false,
    preserveIndent: true,
    collapseStyle: 'collapsible-auto',
  },

  minSyntaxHighlightingColorContrast: 0,
  useDarkModeMediaQuery: false,

  useStyleReset: true,

  styleOverrides: {
    uiFontFamily: DESIGN.font.sans,
    uiFontSize: '0.875rem',
    codeFontFamily: DESIGN.font.mono,
    codeFontSize: '0.875rem',
    codeLineHeight: '1.7',

    borderRadius: '0.5rem',
    codePaddingBlock: '1rem',
    codePaddingInline: '1.25rem',
    borderColor: ({ theme }) => (theme.type === 'dark' ? '#333333' : '#eaeaea'),

    frames: {
      frameBoxShadowCssValue: 'none',

      editorBackground: ({ theme }) => (theme.type === 'dark' ? '#000000' : '#fafafa'),
      terminalBackground: ({ theme }) => (theme.type === 'dark' ? '#000000' : '#fafafa'),

      editorTabBarBackground: ({ theme }) => (theme.type === 'dark' ? '#111111' : '#f5f5f5'),
      editorActiveTabBackground: ({ theme }) => (theme.type === 'dark' ? '#000000' : '#fafafa'),
      editorActiveTabIndicatorBottomColor: ({ theme }) => (theme.type === 'dark' ? '#ffffff' : '#000000'),
      editorActiveTabIndicatorTopColor: 'transparent',

      terminalTitlebarBackground: ({ theme }) => (theme.type === 'dark' ? '#111111' : '#f5f5f5'),
    },
  },

  plugins: [pluginCollapsibleSections({ defaultCollapsed: false }), pluginLineNumbers()],
})
