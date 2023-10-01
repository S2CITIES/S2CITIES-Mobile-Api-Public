import { GetAlertsApi } from "@/endpoints/get-alerts/interfaces";
import { StatusCodes, TestHandler } from "@/lib/response-handler";

const getAlertsPath = "get-alerts";

beforeAll(async () => {
   // await cleanDb();
});

describe("getAlerts API", () => {
   test("It should ...", async () => {
      // const { statusCode, payload } = await TestHandler.invokeLambda<GetAlertsApi.SuccessResponse>(getAlertsPath);
      // expect(statusCode).toBe(StatusCodes.OK);
   });
});

afterAll(async () => {
   // await closeDbConnection();
});
