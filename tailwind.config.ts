import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#EAF4EE',
          700: '#146C43',
          900: '#0B3D27',
        },
        saffron: {
          DEFAULT: '#E8891C',
          text: '#8A4B08',
          50: '#FDF1E3',
        },
        ground: '#F7F8F4',
        surface: '#FFFFFF',
        line: '#DCE5DE',
        ink: '#1A2A21',
        muted: '#4A5A50',
        status: {
          progressBg: '#FDF1E3',
          progressText: '#8A4B08',
          doneBg: '#E3F2E8',
          doneText: '#0B5A33',
          approvedBg: '#E6EEF8',
          approvedText: '#1D4A7A',
          proposedBg: '#F1EFE8',
          proposedText: '#444441',
          holdBg: '#FCEBEB',
          holdText: '#791F1F',
        },
      },
      fontFamily: {
        sans: ['var(--font-mukta)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(11,61,39,0.06)',
      },
      maxWidth: {
        content: '1240px',
      },
    },
  },
  plugins: [],
};

export default config;
