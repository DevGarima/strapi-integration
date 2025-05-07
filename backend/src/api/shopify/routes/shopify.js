module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/shopify/webhook',
      handler: 'shopify.handleWebhook',
      config: {
        auth: false, // Disable authentication for the webhook
      },
    },
  ],
};