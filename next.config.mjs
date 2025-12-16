/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    drupal: {
      // Headers to forward from client requests to Drupal
      proxyHeaders: [
        'cookie',
        'authorization',
        'x-csrf-token',
        'accept-language'
      ]
    }
  }
};

export default nextConfig;
