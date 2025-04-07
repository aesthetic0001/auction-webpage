/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mc-heads.net',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'sky.coflnet.com',
                port: '',
                pathname: '/static/icon/**',
            },
        ],
    },
};

export default nextConfig;
