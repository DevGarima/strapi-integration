const crypto = require('crypto');

module.exports = {
  async handleWebhook(ctx) {
    try {
      const hmacHeader = ctx.request.headers['x-shopify-hmac-sha256'];
      const rawBody = ctx.request.body[Symbol.for('unparsedBody')]; // Access the raw body
      const body = ctx.request.body;

      // Verify the HMAC signature
      const generatedHmac = crypto
        .createHmac('sha256', process.env.SHOPIFY_SECRET_KEY)
        .update(rawBody, 'utf8') // Use rawBody here
        .digest('base64');

      if (generatedHmac !== hmacHeader) {
        return ctx.throw(401, 'Unauthorized');
      }

      // Extract product data from the webhook payload
      const { id, title, body_html, variants, handle } = body;

      // Add or update the product in Strapi
      const existingProduct = await strapi.entityService.findMany('api::product.product', {
        filters: { shopifyId: id },
      });

      if (existingProduct.length > 0) {
        // Update the existing product
        await strapi.entityService.update('api::product.product', existingProduct[0].id, {
          data: {
            title,
            description: body_html,
            price: variants[0]?.price,
            publishedAt: new Date(),
            slug: handle,
          },
        });
      } else {
        // Create a new product
        await strapi.entityService.create('api::product.product', {
          data: {
            shopifyId: String(id),
            title,
            description: body_html,
            price: variants[0]?.price,
            publishedAt: new Date(),
            slug: handle,
          },
        });
      }

      ctx.send({ message: 'Product synced successfully' });
    } catch (error) {
      console.error('Error handling webhook:', error?.details?.errors || error);
      ctx.throw(500, 'Internal Server Error');
    }
  },
};