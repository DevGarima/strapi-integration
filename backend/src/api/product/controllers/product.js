'use strict';

// const { sanitizeEntity } = require("strapi-utils");
const Shopify = require("shopify-api-node");

const shopify = new Shopify({
  shopName: process.env.SHOPIFY_SHOP_NAME,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_ACCESS_TOKEN,
});
/**
 * product controller
 */


module.exports = {
    async find(ctx) {
      try {        
        // Fetch products with optional filters, sorting, and population
        const products = await strapi.entityService.findMany('api::product.product', {
          populate: '*', // Populate relations if needed
          filters: ctx.query.filters || {}, // Apply filters from query params
          sort: ctx.query.sort || 'createdAt:desc', // Default sorting
          pagination: {
            page: ctx.query.page || 1,
            pageSize: ctx.query.pageSize || 10, // Default page size
          },
        });

        const finalProductWithShopify = await Promise.all(products.map(async (product) => {
          const { shopifyId } = product;
          const shopifyProduct = await shopify.product.get(shopifyId);
          return {
            ...product,
            shopifyProduct: shopifyProduct,
          };
        }));
  
        return { data: finalProductWithShopify };
      } catch (error) {
        console.error('Error fetching products:', error);
        ctx.throw(500, 'Unable to fetch products');
      }
    },

    async findOne(ctx) {
      try {
        const { id } = ctx.params; // Extract the product ID from the request parameters        
        // Fetch a single product by ID
        const product = await strapi.entityService.findOne('api::product.product', id, {
          populate: '*', // Populate relations if needed
        });
  
        if (!product) {
          return ctx.notFound('Product not found');
        }
  
        return { data: product };
      } catch (error) {
        console.error('Error fetching product:', error);
        ctx.throw(500, 'Unable to fetch product');
      }
    },
};