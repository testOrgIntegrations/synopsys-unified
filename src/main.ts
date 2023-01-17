import { info, setFailed } from "@actions/core";
import { cleanupTempDir, createTempDir } from "./synopsys-action/utility";
import { SynopsysBridge } from "./synopsys-action/synopsys-bridge";
import { getWorkSpaceDirectory } from "@actions/artifact/lib/internal/config-variables";
import * as constants from "./application-constants";

export async function run() {
  info("Synopsys Action started...");
  const tempDir = await createTempDir();
  let formattedCommand = "";
  try {
    const sb = new SynopsysBridge();
    // Download bridge
    await sb.downloadBridge(tempDir);
    // Prepare bridge command
    formattedCommand = await sb.prepareCommand(tempDir);
    // Execute bridge command
    await sb.executeBridgeCommand(formattedCommand, getWorkSpaceDirectory());
  } catch (error) {
    throw error;
  } finally {
    await cleanupTempDir(tempDir);
    info("Synopsys Action workflow execution completed");
  }
}

export function logBridgeExitCodes(message: string): string {
  var exitCode = message.trim().slice(-1);
  return constants.EXIT_CODE_MAP.has(exitCode)
    ? "Exit Code: " + exitCode + " " + constants.EXIT_CODE_MAP.get(exitCode)
    : message;
}

run().catch((error) => {
  if (error.message != undefined) {
    setFailed("Workflow failed! ".concat(logBridgeExitCodes(error.message)));
  } else {
    setFailed("Workflow failed! ".concat(logBridgeExitCodes(error)));
  }
});
