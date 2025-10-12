const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        // iPhone family (CSS logical widths)
        'ios-se': '320px',      // iPhone 5/SE (1st gen)
        'ios': '375px',         // 6/7/8/X/11 Pro
        'ios-13': '390px',      // 12/13/14 class
        'ios-16': '393px',      // Unverified: 15/16 std/pro logical width (~393)
        'ios-plus': '414px',    // 6+/7+/8+/XR/11
        'ios-max': '428px',     // 12/13/14 Pro Max
        'ios-max-15': '430px',  // 15 Pro Max / 16 Pro Max
        // iPad family
        'ipad': '768px',        // iPad portrait (9.7–10.2")
        'ipad-lg': '834px',     // iPad Air/11" portrait
        'ipad-land': '1024px',  // iPad landscape baseline
        'ipad-pro': '1194px',   // 11" Pro landscape
        'ipad-xl': '1366px',    // 12.9" Pro
      },
      fontFamily: {
        'sans': ['PPPangaia', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries')
  ],
}
