const config = {
  plugins: {
    "@tailwindcss/postcss": {
      theme: {
        extend: {
          fontFamily: {
            lato: ["var(--font-lato)", "sans-serif"],
            geist: ["var(--font-geist-sans)", "sans-serif"],
            geistMono: ["var(--font-geist-mono)", "monospace"],
          },
        },
      },
    },
  },
};

export default config;