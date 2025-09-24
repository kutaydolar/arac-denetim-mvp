import withSerwist from "@serwist/next";

const nextConfig = {
  reactStrictMode: true,
};

export default withSerwist({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
})(nextConfig);