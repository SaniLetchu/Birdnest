import * as tsXmlParser from "https://deno.land/x/ts_xml_parser@1.0.0/mod.ts";

const fetchDrones = async () => {
  try {
    let response = await fetch("https://assignments.reaktor.com/birdnest/drones")
    let xml = await response.text();
    let document = await tsXmlParser.parse(xml);
    return document.root.children[1].children;
  }
  catch {
    return [];
  }
};

const fetchPilot = async (serialNumber) => {
  try {
    let response = await fetch(`https://assignments.reaktor.com/birdnest/pilots/${serialNumber}`)
    return await response.json();
  }
  catch {
    return null;
  }
};

export { fetchDrones, fetchPilot };
