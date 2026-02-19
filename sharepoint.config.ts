// sharepoint-kit config – secrets come from env, don't put them here
export default {
  siteId: "root",
  tenantId: process.env.SHAREPOINT_TENANT_ID ?? process.env.NEXT_PUBLIC_SHAREPOINT_TENANT_ID,
  clientId: process.env.SHAREPOINT_CLIENT_ID ?? process.env.NEXT_PUBLIC_SHAREPOINT_CLIENT_ID,
  // clientSecret is read from SHAREPOINT_CLIENT_SECRET env

  defaultStrategy: "first" as const,
  contentTypes: [
    {
      listId: "50fc630f-3495-4fc1-81e4-dfa7ef915574",
      listName: "Belgeler",
      contentTypeName: "Fatura Denemesi",
      outputType: "Invoice",
    },
  ],
  options: {
    outputDir: "./generated",
    fieldNameMapping: {
      Fatura_x0020_Numaras_x0131_: "faturaNo",
    },
  },
};
