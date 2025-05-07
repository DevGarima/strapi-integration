'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/homepage/custom',
      handler: 'homepage.custom',
      config: {
        auth: false
      },
    },
  ]
};