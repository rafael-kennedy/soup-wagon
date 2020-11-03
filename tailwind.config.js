// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    borderWidth: {
      default: "1px",
      0: "0",
      2: "2px",
      4: "4px",
    },
    extend: {
      spacing: {
        96: "24rem",
        128: "32rem",
      },
    },
  },
};

module.exports = {
  purge: {
    mode: "all",
    content: ["./**/*.html"],
    options: {
      whitelist: [],
    },
  },
  theme: {
    fontFamily: {
      display: ["Garamond", "sans-serif"],
      body: ["Garamond", "sans-serif"],
    },
    container: {
      center: true,
    },
    extend: {
      colors: {
        cream: {
          heavy: "#DDB47Cff",
          light: "#ddb47c4f",
        },
        brown: "#AA5D3Cff",
        green: "#698659ff",
        sage: "#AAA786ff",
        accentGreen: "#657261ff",
      },
      backgroundImage: {
        "hero-soup": "url('../img/lots-of-soup.jpg')",
      },
    },
  },
  variants: {
    // The 'active' variant will be generated in addition to the defaults
    flexDirection: ({ before }) => before(["responsive"]),
  },
  plugins: [require("@tailwindcss/typography")],
  experimental: "all",
  future: {
    purgeLayersByDefault: true,
  },
};
