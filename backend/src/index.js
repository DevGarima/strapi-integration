// @ts-nocheck
'use strict';

const registerShopifyWebhook = require('./api/shopify/services/registerWebhook');

const jsforce = require('jsforce');
const faye = require('faye');
let salesforceSubscriptionActive = false;

const subscribeSalesforceEvents = async (strapi) => {
  console.log("Starting Salesforce subscription...", strapi.salesforceSubscription);
  // Cancel previous subscription if exists
  if (strapi.salesforceSubscription) {
    console.log("Cancelling existing Salesforce subscription");
    strapi.salesforceSubscription.cancel();
  }

  const conn = new jsforce.Connection({ loginUrl: process.env.SF_LOGIN_URL });
  await conn.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_TOKEN);
  
  console.log("Salesforce connection established", conn.accessToken);
  
  const channel = '/data/LeadChangeEvent';
  const client = conn.streaming.createClient();
  
  strapi.salesforceSubscription = client.subscribe(channel, async (data) => {
    console.log('\n\nEvent received\n\n', data);
    
    try {
      const { payload, schema } = data;
      if (!payload || !payload.ChangeEventHeader) {
        console.log("Invalid payload format");
        return;
      }
      
      const { ChangeEventHeader, ...leadData } = payload;
      const changeType = ChangeEventHeader.changeType;

      // Use the first recordId from the header - this is the actual Salesforce ID
      const recordId = ChangeEventHeader.recordIds && ChangeEventHeader.recordIds[0];
      
      if (!recordId) {
        console.log("No record ID in change event");
        return;
      }
      
      console.log("Processing change for Salesforce record ID:", recordId);

      if(strapi){
        // Check if this lead already exists in Strapi by Salesforce ID
      const existingLeads = await strapi.entityService.findMany('api::lead-form-submission.lead-form-submission', {
        filters: {
          salesforceId: recordId
        }
      });

      // Create empty object and populate only when values exist
      const dataToInsert = {};

      // Add properties only if they exist
      if (leadData?.Name?.FirstName) dataToInsert.firstName = leadData.Name.FirstName;
      if (leadData?.Name?.LastName) dataToInsert.lastName = leadData.Name.LastName;
      if (leadData?.Email) dataToInsert.email = leadData.Email;
      if (leadData?.Phone) dataToInsert.phone = leadData.Phone;
      if (leadData?.Company) dataToInsert.company = leadData.Company; 
      if (leadData?.Status) dataToInsert.leadStatus = leadData.Status;

      if (changeType === "DELETE") {
        if (existingLeads && existingLeads.length > 0) {
          console.log(`Deleting lead in Strapi with Salesforce ID: ${recordId}`);
  
        // Use standard delete - this will invoke all the same hooks as the UI
        // including soft-delete functionality if it's implemented correctly
        await strapi.entityService.delete(
          'api::lead-form-submission.lead-form-submission', 
          existingLeads[0].id
        );
        
        console.log(`Successfully deleted lead: ${recordId}`);
        } else {
          console.log(`Cannot delete - lead with Salesforce ID ${recordId} not found in Strapi`);
        }
      } 
      else if (changeType === "CREATE") {
        console.log(`Creating new lead in Strapi from Salesforce ID: ${recordId}`);
        await strapi.entityService.create('api::lead-form-submission.lead-form-submission', {
          data: {
            firstName: leadData.Name.FirstName,
            lastName: leadData.Name.LastName,
            email: leadData.Email,
            phone: leadData.Phone,
            company: leadData.Company,
            // Add other fields you want to sync
            salesforceId: recordId,
            leadStatus: leadData.Status,
          }
        });
      }
      else if (changeType === "UPDATE") {
        console.log(`Updating existing lead in Strapi with Salesforce ID: ${recordId}`);
        await strapi.entityService.update('api::lead-form-submission.lead-form-submission', existingLeads[0].id, {
          data: {
            ...dataToInsert,
          }
        });
      }
      
      console.log(`Successfully processed lead: ${recordId}`);
      }
      
    } catch (error) {
      console.error("Error processing Salesforce event:", error);
    }
  });
  console.log("Salesforce subscription attached to Strapi instance");
}


module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    await registerShopifyWebhook();
    await subscribeSalesforceEvents(strapi);
  },
};
