import { PostAlertsGenericApi } from "@/endpoints/post-alerts-generic/interfaces";
import { StatusCodes, TestHandler } from "@/lib/response-handler";

const postAlertsGenericPath = "post-alerts-generic";

beforeAll(async () => {
   // await cleanDb();
});

describe("postAlertsGeneric API", () => {
   test("It should ...", async () => {
      // const { statusCode, payload } = await TestHandler.invokeLambda<PostAlertsGenericApi.SuccessResponse>(postAlertsGenericPath);
      // expect(statusCode).toBe(StatusCodes.OK);
   });
});

afterAll(async () => {
   // await closeDbConnection();
});
