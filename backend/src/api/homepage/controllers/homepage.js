module.exports = {
    async custom(ctx) {
      try {
        const entity = await strapi.entityService.findOne('api::homepage.homepage', 1, { // 1 is the ID of the homepage entry
          populate: {
            sections: { // Replace 'sections' with the actual field name in your content type
              populate: '*', // Populate all fields of the related components or relations
            },
            // hero: {
            //     populate: ['title', 'subtitle', 'image'], // Replace with actual field names
            //},
          },
        });
  
        ctx.body = entity;
      } catch (err) {
        console.error('Homepage fetch error:', err);
        ctx.throw(500, 'Failed to fetch homepage');
      }
    },
  };