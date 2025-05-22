// @ts-nocheck
'use strict';

/**
 * lead-form-submission controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const jsforce = require('jsforce');
const axios = require('axios');

let sfAccessToken = null;
let tokenExpiry = null;

module.exports = createCoreController('api::lead-form-submission.lead-form-submission', ({ strapi }) => ({
  async create(ctx) {
    try {
      // Validate required fields
      const { firstName, lastName, email, phone } = ctx.request.body.data;
      if (!firstName || !lastName || !email || !phone) {
        return ctx.badRequest('First name, last name, email, and phone are required fields.');
      }

      // Get Salesforce token (cached or new)
      let accessToken;
      
      // Check if token exists and is still valid (with 5 minute buffer)
      const now = new Date();
      if (sfAccessToken && tokenExpiry && (tokenExpiry > now)) {
        console.log("Using cached Salesforce token");
        accessToken = sfAccessToken;
      } else {
        console.log("Getting new Salesforce token");
        const conn = new jsforce.Connection({ loginUrl: process.env.SF_LOGIN_URL });
        await conn.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_TOKEN);
        
        // Store token and calculate expiry (default is 2 hours)
        sfAccessToken = conn.accessToken;
        tokenExpiry = new Date(now.getTime() + 110 * 60000); // 110 minutes (5-minute buffer)
        accessToken = sfAccessToken;
      }
      // 1. Call Salesforce and await the result (prevents unhandled rejections) :contentReference[oaicite:0]{index=0}
      const sfRes = await axios.post(
        'https://orgfarm-c7ad60d00a-dev-ed.develop.my.salesforce.com/services/data/v57.0/sobjects/Lead/',
        {
          FirstName: ctx.request.body.data.firstName,
          LastName:  ctx.request.body.data.lastName,
          Company:   ctx.request.body.data.company,
          Email:     ctx.request.body.data.email,
          Phone:    ctx.request.body.data.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            // include the duplicate‐rule header if needed:
            'Sforce-Duplicate-Rule-Header': 'allowSave=true;includeRecordDetails=false',
          },
        }
      );

      // 2. Inject the Salesforce ID into the payload :contentReference[oaicite:1]{index=1}
      // ctx.request.body.data.salesforceId = sfRes.data.id;

      // // 3. Delegate to the default Strapi create (returns the new entry) :contentReference[oaicite:2]{index=2}
      // const entry = await super.create(ctx);
      // return entry;

      console.log("============================", sfRes);

      return {
        success: true,
        salesforceId: sfRes.data.id,
        message: 'Lead submitted to Salesforce successfully'
      };

    } catch (error) {
      // 4. Log and return an HTTP 500 without crashing Strapi :contentReference[oaicite:3]{index=3}
      strapi.log.error('Error creating lead in Salesforce:', error);
      return ctx.internalServerError('Failed to create lead in Salesforce');
    }
  },
}));
