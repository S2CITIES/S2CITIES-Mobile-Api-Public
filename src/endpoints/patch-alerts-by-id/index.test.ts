import { PatchAlertsByIdApi } from "@/endpoints/patch-alerts-by-id/interfaces";
import { StatusCodes, TestHandler } from "@/lib/response-handler";

const patchAlertsByIdPath = "patch-alerts-by-id";

beforeAll(async () => {
   // await cleanDb();
});

describe("patchAlertsById API", () => {
   test("It should ...", async () => {
      // const { statusCode, payload } = await TestHandler.invokeLambda<PatchAlertsByIdApi.SuccessResponse>(patchAlertsByIdPath);
      // expect(statusCode).toBe(StatusCodes.OK);
   });
});

afterAll(async () => {
   // await closeDbConnection();
});
