/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'gitlab.com',
            },
            {
                protocol: 'https',
                hostname: 'secure.gravatar.com',
            },
        ],
    },
};

module.exports = nextConfig;
