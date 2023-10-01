import { GetAlertsVideoS3signedurlByAlertIdApi } from "@/endpoints/get-alerts-video-s3signedurl-by-alert-id/interfaces";
import { StatusCodes, TestHandler } from "@/lib/response-handler";

const getAlertsVideoS3signedurlByAlertIdPath =
   "get-alerts-video-s3signedurl-by-alert-id";

beforeAll(async () => {
   // await cleanDb();
});

describe("getAlertsVideoS3signedurlByAlertId API", () => {
   test("It should ...", async () => {
      // const { statusCode, payload } = await TestHandler.invokeLambda<GetAlertsVideoS3signedurlByAlertIdApi.SuccessResponse>(getAlertsVideoS3signedurlByAlertIdPath);
      // expect(statusCode).toBe(StatusCodes.OK);
   });
});

afterAll(async () => {
   // await closeDbConnection();
});
