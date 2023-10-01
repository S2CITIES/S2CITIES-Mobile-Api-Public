import { PostAlertsSignalforhelpApi } from "@/endpoints/post-alerts-signalforhelp/interfaces";
import { StatusCodes, TestHandler } from "@/lib/response-handler";

const postAlertsSignalforhelpPath = "post-alerts-signalforhelp";

beforeAll(async () => {
   // await cleanDb();
});

describe("postAlertsSignalforhelp API", () => {
   test("It should ...", async () => {
      // const { statusCode, payload } = await TestHandler.invokeLambda<PostAlertsSignalforhelpApi.SuccessResponse>(postAlertsSignalforhelpPath);
      // expect(statusCode).toBe(StatusCodes.OK);
   });
});

afterAll(async () => {
   // await closeDbConnection();
});
