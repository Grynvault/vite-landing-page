/** @format */

const theme = {
	colors: {
		primary: '#E58E27', // Refined Bitcoin orange (only for accents/buttons)
		secondary: '#0F172A', // Rich slate navy (backgrounds, strong text)
		accent: '#2563EB', // Trustworthy blue (actions, highlights)
		background: '#F9FAFB', // Clean, soft gray (light background)
		darkBackground: '#0B1120', // Deep dark mode (slate/blue-black)
		surface: '#FFFFFF', // White cards on light background
		cardBg: '#F3F4F6', // Soft neutral card background
		borderColor: '#E5E7EB', // Subtle gray borders

		text: '#1E293B', // Strong readable text (blue-gray 800)
		lightText: '#64748B', // Secondary text (blue-gray 500)

		success: '#10B981', // Emerald (modern green)
		warning: '#F59E0B', // Amber (less harsh warning)
		danger: '#EF4444', // Soft red (danger/alerts)
		info: '#3B82F6', // Fintech blue (info badges, links)
	},

	fonts: {
		body: '"Inter", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
		heading: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
		monospace: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
	},
	fontSizes: {
		xs: '0.75rem',
		sm: '0.875rem',
		md: '1rem',
		lg: '1.125rem',
		xl: '1.25rem',
		'2xl': '1.5rem',
		'3xl': '1.875rem',
		'4xl': '2.25rem',
		'5xl': '3rem',
		'6xl': '4rem',
	},
	fontWeights: {
		hairline: 100,
		thin: 200,
		light: 300,
		normal: 400,
		medium: 500,
		semibold: 600,
		bold: 700,
		extrabold: 800,
		black: 900,
	},
	lineHeights: {
		normal: 'normal',
		none: 1,
		shorter: 1.25,
		short: 1.375,
		base: 1.5,
		tall: 1.625,
		taller: 2,
	},
	space: {
		px: '1px',
		'0': '0',
		'1': '0.25rem',
		'2': '0.5rem',
		'3': '0.75rem',
		'4': '1rem',
		'5': '1.25rem',
		'6': '1.5rem',
		'8': '2rem',
		'10': '2.5rem',
		'12': '3rem',
		'16': '4rem',
		'20': '5rem',
		'24': '6rem',
		'32': '8rem',
		'40': '10rem',
		'48': '12rem',
		'56': '14rem',
		'64': '16rem',
	},
	sizes: {
		full: '100%',
		'3xs': '14rem',
		'2xs': '16rem',
		xs: '20rem',
		sm: '24rem',
		md: '28rem',
		lg: '32rem',
		xl: '36rem',
		'2xl': '42rem',
		'3xl': '48rem',
		'4xl': '56rem',
		'5xl': '64rem',
		'6xl': '72rem',
	},
	radii: {
		none: '0',
		sm: '0.125rem',
		md: '0.25rem',
		lg: '0.5rem',
		xl: '0.75rem',
		'2xl': '1rem',
		'3xl': '1.5rem',
		full: '9999px',
	},
	shadows: {
		xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
		sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
		base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
		md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
		lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
		xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
		'2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
		inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
		outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
		none: 'none',
	},
	breakpoints: {
		sm: '30em', // 480px
		md: '48em', // 768px
		lg: '62em', // 992px
		xl: '80em', // 1280px
		'2xl': '96em', // 1536px
	},
	// Custom theme additions
	gradients: {
		primary: 'linear-gradient(135deg, #F7931A 0%, #FF8E53 100%)',
		secondary: 'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)',
		blueOrange: 'linear-gradient(135deg, #3182CE 0%, #F7931A 100%)',
	},
	transitions: {
		easeInOut: 'all 0.3s ease-in-out',
		easeOut: 'all 0.3s ease-out',
		easeIn: 'all 0.3s ease-in',
	},
};

export default theme;
