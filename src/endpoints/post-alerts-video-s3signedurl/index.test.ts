import { PostAlertsVideoS3signedurlApi } from "@/endpoints/post-alerts-video-s3signedurl/interfaces";
import { StatusCodes, TestHandler } from "@/lib/response-handler";

const postAlertsVideoS3signedurlPath = "post-alerts-video-s3signedurl";

beforeAll(async () => {
   // await cleanDb();
});

describe("postAlertsVideoS3signedurl API", () => {
   test("It should ...", async () => {
      // const { statusCode, payload } = await TestHandler.invokeLambda<PostAlertsVideoS3signedurlApi.SuccessResponse>(postAlertsVideoS3signedurlPath);
      // expect(statusCode).toBe(StatusCodes.OK);
   });
});

afterAll(async () => {
   // await closeDbConnection();
});
