import {
  validateBlackduckFailureSeverities,
  validateBlackDuckInputs,
  validateCoverityInputs,
  validateCoverityInstallDirectoryParam,
  validateParameters,
  validatePolarisInputs,
} from "../../src/synopsys-action/validators";
import * as constants from "../../src/application-constants";
import * as inputs from "../../src/synopsys-action/inputs";

test("Test missing install directory for coverity", () => {
  try {
    validateCoverityInstallDirectoryParam("");
  } catch (error: any) {
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain("parameter for Coverity is missing");
  }
});

test("Test invalid install directory for coverity", () => {
  try {
    validateCoverityInstallDirectoryParam("D:/Users/tmpusr/Documents");
  } catch (error: any) {
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain("parameter for Coverity is invalid");
  }
});

test("Test validate Blackduck Failure Severities", () => {
  const failureSeverities: string[] = [];
  try {
    validateBlackduckFailureSeverities(failureSeverities);
  } catch (error: any) {
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain(
      "Provided value is not valid - BLACKDUCK_SCAN_FAILURE_SEVERITIES"
    );
  }
});

test("Test validate parameters", () => {
  const paramsMap = new Map();
  paramsMap.set(constants.COVERITY_USER_KEY, null);
  paramsMap.set(constants.COVERITY_URL_KEY, "");
  try {
    validateParameters(paramsMap, "Coverity");
  } catch (error: any) {
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain(
      "required parameters for Coverity is missing"
    );
  }
});

// Polaris
test("Polaris - Without mandatory fields", async () => {
  jest.setTimeout(25000);
  try {
    Object.defineProperty(inputs, "POLARIS_SERVER_URL", {
      value: "server_url",
    });
    const response = validatePolarisInputs();
    expect(response).toBe(false);
  } catch (error: any) {
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain(
      "[polaris_accessToken,polaris_application_name,polaris_project_name,polaris_assessment_types] - required parameters for polaris is missing"
    );
  }
  Object.defineProperty(inputs, "POLARIS_SERVER_URL", { value: null });
});

test("With one or more non-mandatory fields", async () => {
  // as if now, all are mandatory fields for Polaris
  Object.defineProperty(inputs, "POLARIS_SERVER_URL", { value: null });
  jest.restoreAllMocks();
});

test("Polaris - With mandatory fields", async () => {
  jest.setTimeout(25000);
  Object.defineProperty(inputs, "POLARIS_SERVER_URL", { value: "server_url" });
  Object.defineProperty(inputs, "POLARIS_ACCESS_TOKEN", {
    value: "access_token",
  });
  Object.defineProperty(inputs, "POLARIS_APPLICATION_NAME", {
    value: "POLARIS_APPLICATION_NAME",
  });
  Object.defineProperty(inputs, "POLARIS_PROJECT_NAME", {
    value: "POLARIS_PROJECT_NAME",
  });
  Object.defineProperty(inputs, "POLARIS_ASSESSMENT_TYPES", {
    value: '["SCA"]',
  });

  const response = validatePolarisInputs();
  expect(response).toBe(true);

  Object.defineProperty(inputs, "POLARIS_SERVER_URL", { value: null });
  jest.restoreAllMocks();
});

// COVERITY
test("Coverity - Without mandatory fields", async () => {
  try {
    Object.defineProperty(inputs, "COVERITY_URL", { value: "server_url" });
    const response = validateCoverityInputs();
    expect(response).toBe(false);
  } catch (error: any) {
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain(
      "[coverity_user,coverity_passphrase,coverity_project_name,coverity_stream_name] - required parameters for coverity is missing"
    );
  }
  Object.defineProperty(inputs, "COVERITY_URL", { value: null });
});

test("Coverity - With one or more non-mandatory fields", async () => {
  Object.defineProperty(inputs, "COVERITY_URL", { value: "COVERITY_URL" });
  Object.defineProperty(inputs, "COVERITY_USER", { value: "COVERITY_USER" });
  Object.defineProperty(inputs, "COVERITY_PASSPHRASE", {
    value: "COVERITY_PASSPHRASE",
  });
  Object.defineProperty(inputs, "COVERITY_PROJECT_NAME", {
    value: "COVERITY_PROJECT_NAME",
  });
  Object.defineProperty(inputs, "COVERITY_STREAM_NAME", {
    value: "COVERITY_STREAM_NAME",
  });
  Object.defineProperty(inputs, "COVERITY_INSTALL_DIRECTORY", {
    value: "COVERITY_INSTALL_DIRECTORY",
  });
  const response = validateCoverityInputs();
  expect(response).toBe(true);

  Object.defineProperty(inputs, "COVERITY_URL", { value: null });
});

test("Coverity - With mandatory fields", async () => {
  Object.defineProperty(inputs, "COVERITY_URL", { value: "COVERITY_URL" });
  Object.defineProperty(inputs, "COVERITY_USER", { value: "COVERITY_USER" });
  Object.defineProperty(inputs, "COVERITY_PASSPHRASE", {
    value: "COVERITY_PASSPHRASE",
  });
  Object.defineProperty(inputs, "COVERITY_PROJECT_NAME", {
    value: "COVERITY_PROJECT_NAME",
  });
  Object.defineProperty(inputs, "COVERITY_STREAM_NAME", {
    value: "COVERITY_STREAM_NAME",
  });
  const response = validateCoverityInputs();
  expect(response).toBe(true);

  Object.defineProperty(inputs, "COVERITY_URL", { value: null });
});

// BLACKDUCK
test("Blackduck - Without mandatory fields", async () => {
  Object.defineProperty(inputs, "BLACKDUCK_URL", { value: "BLACKDUCK_URL" });
  try {
    const response = validateBlackDuckInputs();
    expect(response).toBe(false);
  } catch (error: any) {
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain(
      "[blackduck_apiToken,blackduck_scan_full] - required parameters for blackduck is missing"
    );
  }
  Object.defineProperty(inputs, "BLACKDUCK_URL", { value: null });
});

test("Blackduck - With one or more non-mandatory fields", async () => {
  Object.defineProperty(inputs, "BLACKDUCK_URL", { value: "BLACKDUCK_URL" });
  Object.defineProperty(inputs, "BLACKDUCK_API_TOKEN", {
    value: "BLACKDUCK_API_TOKEN",
  });
  Object.defineProperty(inputs, "BLACKDUCK_INSTALL_DIRECTORY", {
    value: "BLACKDUCK_INSTALL_DIRECTORY",
  });
  Object.defineProperty(inputs, "BLACKDUCK_SCAN_FULL", { value: "TRUE" });
  Object.defineProperty(inputs, "BLACKDUCK_SCAN_FAILURE_SEVERITIES", {
    value: '["ALL"]',
  });

  const response = validateBlackDuckInputs();
  expect(response).toBe(true);

  Object.defineProperty(inputs, "BLACKDUCK_URL", { value: null });
});

test("Blackduck - With mandatory fields", async () => {
  Object.defineProperty(inputs, "BLACKDUCK_URL", { value: "BLACKDUCK_URL" });
  Object.defineProperty(inputs, "BLACKDUCK_API_TOKEN", {
    value: "BLACKDUCK_API_TOKEN",
  });
  Object.defineProperty(inputs, "BLACKDUCK_SCAN_FULL", { value: "TRUE" });
  Object.defineProperty(inputs, "BRIDGE_DOWNLOAD_URL", {
    value: "http://download-bridge-win.zip",
  });

  const response = validateBlackDuckInputs();
  expect(response).toBe(true);

  Object.defineProperty(inputs, "BLACKDUCK_URL", { value: null });
  Object.defineProperty(inputs, "BRIDGE_DOWNLOAD_URL", { value: null });
});
