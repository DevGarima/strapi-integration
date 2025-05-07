module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/products',
        handler: 'product.find',
      },
      {
        method: 'GET',
        path: '/products/:id',
        handler: 'product.findOne',
      },
    ],
  };