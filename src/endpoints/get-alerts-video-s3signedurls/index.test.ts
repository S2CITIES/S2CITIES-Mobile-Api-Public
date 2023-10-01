import { GetAlertsVideoS3signedurlsApi } from "@/endpoints/get-alerts-video-s3signedurls/interfaces";
import { StatusCodes, TestHandler } from "@/lib/response-handler";

const getAlertsVideoS3signedurlsPath = "get-alerts-video-s3signedurls";

beforeAll(async () => {
   // await cleanDb();
});

describe("getAlertsVideoS3signedurls API", () => {
   test("It should ...", async () => {
      // const { statusCode, payload } = await TestHandler.invokeLambda<GetAlertsVideoS3signedurlsApi.SuccessResponse>(getAlertsVideoS3signedurlsPath);
      // expect(statusCode).toBe(StatusCodes.OK);
   });
});

afterAll(async () => {
   // await closeDbConnection();
});
