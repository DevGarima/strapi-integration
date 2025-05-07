const SHOPIFY_ADMIN_URL = `https://${process.env.SHOPIFY_SHOP_NAME}.myshopify.com/admin/api/2023-04/webhooks.json`;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

async function registerShopifyWebhook() {
  try {
    const webhooks = [
      {
        topic: 'products/create', // Listen for product creation
        address: `${process.env.STRAPI_URL}/api/shopify/webhook`, // Your Strapi webhook endpoint
        format: 'json',
      },
      {
        topic: 'products/update', // Listen for product updates
        address: `${process.env.STRAPI_URL}/api/shopify/webhook`, // Your Strapi webhook endpoint
        format: 'json',
      },
    ];
    
    for (const webhook of webhooks) {
      const response = await fetch(SHOPIFY_ADMIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        },
        body: JSON.stringify({ webhook }),
      });

      const result = await response.json();
      console.log(`Webhook registration result for topic "${webhook.topic}":`, result);
    }
  } catch (error) {
    console.error('Error registering Shopify webhooks:', error);
  }
}

module.exports = registerShopifyWebhook;