import withSerwist from "@serwist/next";

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Ensure CSS files are handled correctly
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader'
      ]
    });
    
    return config;
  }
};

export default withSerwist({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
})(nextConfig);