module.exports = {
  async custom(ctx) {
    try {
      // Fetch homepage entity
      const entity = await strapi.entityService.findOne('api::homepage.homepage', 1, {
        populate: {
          sections: {
            populate: '*',
          },
        },
      });

      const trendingCtx = {
        ...ctx,
        query: {
          ...ctx.query,
          filters: {
            ...(ctx.query.filters || {}),
            isTrending: true, // Add the trending filter
          },
        },
      };

      // Call the product controller's find method
      const productController = strapi.controller('api::product.product');
      const productData = await productController.find(trendingCtx);
      const productResults = productData?.data || [];

      const finalEntity = [
        ...entity.sections,
        ...(productResults.length
          ? [
              {
                __component: 'shared.trending-products',
                products: productResults,
              },
            ]
          : []),
      ];

      ctx.body = finalEntity;
    } catch (err) {
      console.error('Homepage fetch error:', err);
      ctx.throw(500, 'Failed to fetch homepage');
    }
  },
};