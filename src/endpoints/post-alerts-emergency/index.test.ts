import { PostAlertsEmergencyApi } from "@/endpoints/post-alerts-emergency/interfaces";
import { StatusCodes, TestHandler } from "@/lib/response-handler";

const postAlertsEmergencyPath = "post-alerts-emergency";

beforeAll(async () => {
   // await cleanDb();
});

describe("postAlertsEmergency API", () => {
   test("It should ...", async () => {
      // const { statusCode, payload } = await TestHandler.invokeLambda<PostAlertsEmergencyApi.SuccessResponse>(postAlertsEmergencyPath);
      // expect(statusCode).toBe(StatusCodes.OK);
   });
});

afterAll(async () => {
   // await closeDbConnection();
});
