import * as violationService from "../../services/violationService.js";

const showMain = async ({ render }) => {
  const data = await violationService.listViolations();
  render("main.eta", data);
};

export { showMain };