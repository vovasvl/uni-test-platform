/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextConfig } from "next";
require('dotenv').config('.env');

const nextConfig: NextConfig = {
  env: {
    API_KEY: process.env.API_KEY
  },
  webpack: (
    config,
  ) => {
    // RuleSetRule from 'webpack'
    type WebpackRule = {
      test?: RegExp;
      issuer?: { and?: RegExp[] };
      resourceQuery?: { not?: RegExp[] };
      [key: string]: unknown;
    };
    const fileLoaderRule = config.module.rules.find((rule: WebpackRule) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i
    return config
  },
};

export default nextConfig;
