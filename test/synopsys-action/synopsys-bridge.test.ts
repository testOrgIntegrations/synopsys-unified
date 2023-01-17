import { SynopsysBridge } from "../../src/synopsys-action/synopsys-bridge";
import mock = jest.mock;
import Mocked = jest.Mocked;
import { HttpClientResponse, HttpClient } from "typed-rest-client/HttpClient";
import { IncomingMessage } from "http";
import { Socket } from "net";
import { validateBridgeUrl } from "../../src/synopsys-action/validators";

const ioUtils = require("@actions/io/lib/io-util");
mock("@actions/io/lib/io-util");

const path = require("path");
mock("path");

const ex = require("@actions/exec");
mock("@actions/exec");

beforeEach(() => {
  Object.defineProperty(process, "platform", {
    value: process.platform,
  });
});

test("Test executeBridgeCommand for MAC", () => {
  const sb = new SynopsysBridge();

  path.join = jest.fn();
  path.join.mockReturnValueOnce("/user");

  ioUtils.tryGetExecutablePath = jest.fn();
  ioUtils.tryGetExecutablePath.mockReturnValueOnce("/user/somepath");

  ex.exec = jest.fn();
  ex.exec.mockReturnValueOnce(0);

  Object.defineProperty(process, "platform", {
    value: "darwin",
  });

  const response = sb.executeBridgeCommand("command", "c:\\working_directory");

  expect(response).resolves.toEqual(0);
});

test("Test executeBridgeCommand for Linux", () => {
  const sb = new SynopsysBridge();

  path.join = jest.fn();
  path.join.mockReturnValueOnce("/user");

  ioUtils.tryGetExecutablePath = jest.fn();
  ioUtils.tryGetExecutablePath.mockReturnValueOnce("/somepath");

  ex.exec = jest.fn();
  ex.exec.mockReturnValueOnce(0);

  Object.defineProperty(process, "platform", {
    value: "linux",
  });

  const response = sb.executeBridgeCommand("command", "working_directory");

  expect(response).resolves.toEqual(0);
});

test("Test executeBridgeCommand for Windows", () => {
  const sb = new SynopsysBridge();

  path.join = jest.fn();
  path.join.mockReturnValueOnce("c:\\");

  ioUtils.tryGetExecutablePath = jest.fn();
  ioUtils.tryGetExecutablePath.mockReturnValueOnce("c:\\somepath");

  ex.exec = jest.fn();
  ex.exec.mockReturnValueOnce(0);

  Object.defineProperty(process, "platform", {
    value: "win32",
  });

  const response = sb.executeBridgeCommand("command", "working_directory");

  expect(response).resolves.toEqual(0);
});

test("Test executeBridgeCommand for bridge not found", () => {
  const sb = new SynopsysBridge();

  ioUtils.tryGetExecutablePath = jest.fn();
  ioUtils.tryGetExecutablePath.mockReturnValueOnce("");

  ex.exec = jest.fn();
  ex.exec.mockReturnValueOnce(0);

  Object.defineProperty(process, "platform", {
    value: "linux",
  });

  const response = sb.executeBridgeCommand("command", "working_directory");

  expect(response).rejects.toThrowError();
});

test("Validate bridge URL Windows", () => {
  Object.defineProperty(process, "platform", {
    value: "win32",
  });

  const resp = validateBridgeUrl("http://download/bridge-win.zip");
  expect(resp).toBeTruthy();
});

test("Validate bridge URL MAC", () => {
  Object.defineProperty(process, "platform", {
    value: "darwin",
  });

  const resp = validateBridgeUrl("http://download/bridge-mac.zip");
  expect(resp).toBeTruthy();
});

test("Validate bridge URL Linux", () => {
  Object.defineProperty(process, "platform", {
    value: "linux",
  });

  const resp = validateBridgeUrl("http://download/bridge-linux.zip");
  expect(resp).toBeTruthy();
});

test("Test getLatestVersion - Patch version", async () => {
  const incomingMessage: IncomingMessage = new IncomingMessage(new Socket());

  const httpResponse: Mocked<HttpClientResponse> = {
    message: incomingMessage,
    readBody: jest.fn(),
  };
  httpResponse.readBody.mockResolvedValueOnce(
    "\n" +
      '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">\n' +
      "<html>\n" +
      '<head><meta name="robots" content="noindex" />\n' +
      "<title>Index of bds-integrations-release/com/synopsys/integration/synopsys-action</title>\n" +
      "</head>\n" +
      "<body>\n" +
      "<h1>Index of bds-integrations-release/com/synopsys/integration/synopsys-action</h1>\n" +
      "<pre>Name    Last modified      Size</pre><hr/>\n" +
      '<pre><a href="../">../</a>\n' +
      '<a href="0.1.114/">0.1.114/</a>  17-Oct-2022 19:46    -\n' +
      '<a href="0.1.72/">0.1.72/</a>  17-Oct-2022 19:46    -\n' +
      '<a href="0.1.67/">0.1.67/</a>  07-Oct-2022 00:35    -\n' +
      '<a href="0.1.61/">0.1.61/</a>  04-Oct-2022 23:05    -\n' +
      "</pre>\n" +
      '<hr/><address style="font-size:small;">Artifactory/7.31.13 Server at sig-repo.synopsys.com Port 80</address></body></html>'
  );

  jest.spyOn(HttpClient.prototype, "get").mockResolvedValueOnce(httpResponse);

  const sb = new SynopsysBridge();
  const response = await sb.getLatestVersion();

  expect(response).toBe("0.1.114");
});

test("Test getLatestVersion - Minor version", async () => {
  const incomingMessage: IncomingMessage = new IncomingMessage(new Socket());

  const httpResponse: Mocked<HttpClientResponse> = {
    message: incomingMessage,
    readBody: jest.fn(),
  };
  httpResponse.readBody.mockResolvedValueOnce(
    "\n" +
      '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">\n' +
      "<html>\n" +
      '<head><meta name="robots" content="noindex" />\n' +
      "<title>Index of bds-integrations-release/com/synopsys/integration/synopsys-action</title>\n" +
      "</head>\n" +
      "<body>\n" +
      "<h1>Index of bds-integrations-release/com/synopsys/integration/synopsys-action</h1>\n" +
      "<pre>Name    Last modified      Size</pre><hr/>\n" +
      '<pre><a href="../">../</a>\n' +
      '<a href="0.1.61/">0.1.61/</a>  04-Oct-2022 23:05    -\n' +
      '<a href="0.1.67/">0.1.67/</a>  07-Oct-2022 00:35    -\n' +
      '<a href="0.1.72/">0.1.72/</a>  17-Oct-2022 19:46    -\n' +
      '<a href="0.2.1/">0.2.1/</a>  17-Oct-2022 19:58    -\n' +
      "</pre>\n" +
      '<hr/><address style="font-size:small;">Artifactory/7.31.13 Server at sig-repo.synopsys.com Port 80</address></body></html>'
  );

  jest.spyOn(HttpClient.prototype, "get").mockResolvedValueOnce(httpResponse);

  const sb = new SynopsysBridge();
  const response = await sb.getLatestVersion();

  expect(response).toBe("0.2.1");
});

test("Test getLatestVersion - Major version", async () => {
  const incomingMessage: IncomingMessage = new IncomingMessage(new Socket());

  const httpResponse: Mocked<HttpClientResponse> = {
    message: incomingMessage,
    readBody: jest.fn(),
  };
  httpResponse.readBody.mockResolvedValueOnce(
    "\n" +
      '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">\n' +
      "<html>\n" +
      '<head><meta name="robots" content="noindex" />\n' +
      "<title>Index of bds-integrations-release/com/synopsys/integration/synopsys-action</title>\n" +
      "</head>\n" +
      "<body>\n" +
      "<h1>Index of bds-integrations-release/com/synopsys/integration/synopsys-action</h1>\n" +
      "<pre>Name    Last modified      Size</pre><hr/>\n" +
      '<pre><a href="../">../</a>\n' +
      '<a href="0.1.61/">0.1.61/</a>  04-Oct-2022 23:05    -\n' +
      '<a href="0.1.67/">0.1.67/</a>  07-Oct-2022 00:35    -\n' +
      '<a href="0.1.72/">0.1.72/</a>  17-Oct-2022 19:46    -\n' +
      '<a href="0.2.1/">0.2.1/</a>  17-Oct-2022 19:58    -\n' +
      '<a href="1.0.0/">1.0.0/</a>  17-Oct-2022 19:58    -\n' +
      "</pre>\n" +
      '<hr/><address style="font-size:small;">Artifactory/7.31.13 Server at sig-repo.synopsys.com Port 80</address></body></html>'
  );

  jest.spyOn(HttpClient.prototype, "get").mockResolvedValueOnce(httpResponse);

  const sb = new SynopsysBridge();
  const response = await sb.getLatestVersion();

  expect(response).toBe("1.0.0");
});

test("Test validateBridgeVersion", async () => {
  const incomingMessage: IncomingMessage = new IncomingMessage(new Socket());

  const httpResponse: Mocked<HttpClientResponse> = {
    message: incomingMessage,
    readBody: jest.fn(),
  };
  httpResponse.readBody.mockResolvedValueOnce(
    "\n" +
      '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">\n' +
      "<html>\n" +
      '<head><meta name="robots" content="noindex" />\n' +
      "<title>Index of bds-integrations-release/com/synopsys/integration/synopsys-action</title>\n" +
      "</head>\n" +
      "<body>\n" +
      "<h1>Index of bds-integrations-release/com/synopsys/integration/synopsys-action</h1>\n" +
      "<pre>Name    Last modified      Size</pre><hr/>\n" +
      '<pre><a href="../">../</a>\n' +
      '<a href="0.1.61/">0.1.61/</a>  04-Oct-2022 23:05    -\n' +
      '<a href="0.1.67/">0.1.67/</a>  07-Oct-2022 00:35    -\n' +
      '<a href="0.1.72/">0.1.72/</a>  17-Oct-2022 19:46    -\n' +
      "</pre>\n" +
      '<hr/><address style="font-size:small;">Artifactory/7.31.13 Server at sig-repo.synopsys.com Port 80</address></body></html>'
  );

  jest.spyOn(HttpClient.prototype, "get").mockResolvedValueOnce(httpResponse);

  const sb = new SynopsysBridge();
  const response = await sb.validateBridgeVersion("0.1.67");

  expect(response).toBe(true);
});

test("Test getVersionUrl - mac", () => {
  Object.defineProperty(process, "platform", { value: "darwin" });

  const sb = new SynopsysBridge();
  const response = sb.getVersionUrl("0.1.0");

  expect(response).toContain("mac");

  Object.defineProperty(process, "platform", { value: null });
});

test("Test getVersionUrl win", () => {
  Object.defineProperty(process, "platform", { value: "win32" });

  const sb = new SynopsysBridge();
  const response = sb.getVersionUrl("0.1.0");

  expect(response).toContain("win");

  Object.defineProperty(process, "platform", { value: null });
});

test("Test getVersionUrl win", () => {
  Object.defineProperty(process, "platform", { value: "linux" });

  const sb = new SynopsysBridge();
  const response = sb.getVersionUrl("0.1.0");

  expect(response).toContain("linux");

  Object.defineProperty(process, "platform", { value: null });
});
