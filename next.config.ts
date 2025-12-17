module.exports = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'query',
            key: 'order',
          },
        ],
        destination: '/?order=:order',
        permanent: false,
      },
      {
        source: '/:path*',
        destination: '/',
        permanent: false,
      },
    ]
  },
}
