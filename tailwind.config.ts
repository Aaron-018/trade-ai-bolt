/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 主要品牌色
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // emerald-500 主色
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22'
        },
        // 次要色调
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // teal-500
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e'
        },
        // 强调色
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // green-500
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        },
        // 成功状态
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d'
        },
        // 警告状态
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f'
        },
        // 错误状态
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d'
        },
        // 中性色调
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a'
        },
        // DeFi专用颜色
        defi: {
          bg: '#000000',
          surface: '#111111',
          'surface-light': '#1a1a1a',
          border: '#333333',
          'border-light': '#404040',
          text: '#ffffff',
          'text-muted': '#a3a3a3',
          'text-dim': '#737373',
          glow: '#10b981',
          'glow-secondary': '#14b8a6',
          up: '#88d693',
          down: '#f04766'
        },
        // 加密货币主题色
        crypto: {
          bitcoin: '#f7931a',
          ethereum: '#627eea',
          usdc: '#2775ca',
          usdt: '#26a17b',
          bnb: '#f3ba2f',
          cardano: '#0033ad',
          solana: '#9945ff',
          polygon: '#8247e5'
        }
      },
      // 背景渐变
      backgroundImage: {
        'gradient-primary':
          'linear-gradient(135deg, var(--tw-colors-primary-500), var(--tw-colors-secondary-500))',
        'gradient-accent':
          'linear-gradient(135deg, var(--tw-colors-accent-400), var(--tw-colors-primary-600))',
        'gradient-defi': 'linear-gradient(135deg, #10b981, #14b8a6, #22c55e)',
        'gradient-crypto':
          'linear-gradient(45deg, #10b981, #14b8a6, #22c55e, #16a34a)',
        'grid-pattern': `
          linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
        `
      },
      // 阴影效果
      boxShadow: {
        'glow-sm': '0 0 10px rgba(16, 185, 129, 0.3)',
        glow: '0 0 20px rgba(16, 185, 129, 0.4)',
        'glow-lg': '0 0 30px rgba(16, 185, 129, 0.5)',
        'glow-xl': '0 0 40px rgba(16, 185, 129, 0.6)',
        defi: '0 4px 20px rgba(16, 185, 129, 0.1)',
        'defi-hover': '0 8px 30px rgba(16, 185, 129, 0.2)'
      },
      // 动画
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'crypto-float': 'crypto-float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite'
      },
      // 字体
      fontFamily: {
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace'
        ]
      },
      // 间距系统 (8px基准)
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      // 边框半径
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem'
      }
    }
  },
  plugins: []
}
