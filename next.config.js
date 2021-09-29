// @ts-check

/**
 * @type {import("next/dist/server/config-shared").NextConfig}
 */
module.exports = {
  experimental: { esmExternals: true },
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      };
    }

    return config;
  },
};
