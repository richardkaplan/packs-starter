/*
Start making Packs!
Try out the hello world sample below to create your first build.
*/

// This import statement gives you access to all parts of the Coda Packs SDK.
import * as coda from "@codahq/packs-sdk";
import { clear } from "console";
import * as xml2js from "xml2js";

// This line creates your new Pack.
export const pack = coda.newPack();

pack.addNetworkDomain("nih.gov");

// Here, we add a new formula to this Pack.
pack.addFormula({
  // This is the name that will be called in the formula builder.
  // Remember, your formula name cannot have spaces in it.
  name: "PubMed",
  description: "PubMed Entrez Metdata Import",

  // If your formula requires one or more inputs, you’ll define them here.
  // Here, we're creating a string input called “pmid”.
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "pmid",
      description: "PMID Number for a citation",
    }),
  ],

  // The resultType defines what will be returned in your Coda doc. Here, we're
  // returning a simple text string.
  resultType: coda.ValueType.String,

  // Everything inside this execute statement will happen anytime your Coda
  // formula is called in a doc. An array of all user inputs is always the 1st
  // parameter.
  execute: async function([pmid], context) {
    const efetch = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&&retmode=xml&rettype=abstract&id=${pmid}`;


    let fetcher = context.fetcher;

    const response = await fetcher.fetch({ url: efetch, method: "GET", isBinaryResponse: true });
    const responseBody = await response.body;

    console.log(responseBody);

    console.log(responseBody["PubmedArticle"][0]["MedlineCitation"][0]["Article"][0]["Abstract"][0]["AbstractText"]);

    const abstract = responseBody["PubmedArticle"][0]["MedlineCitation"][0]["Article"][0]["Abstract"][0]["AbstractText"][0];

    return abstract;
  },
});