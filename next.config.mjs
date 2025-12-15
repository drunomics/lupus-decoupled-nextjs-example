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
      ],
      // Response headers to pass through from Drupal to the client
      passThroughHeaders: [
        'cache-control',
        'content-language',
        'set-cookie',
        'x-drupal-cache',
        'x-drupal-dynamic-cache',
        'etag',
        'vary'
      ]
    }
  }
};

export default nextConfig;
