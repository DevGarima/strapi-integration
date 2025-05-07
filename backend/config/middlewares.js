module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      includeUnparsed: true, // Include raw body in ctx.request.rawBody
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
