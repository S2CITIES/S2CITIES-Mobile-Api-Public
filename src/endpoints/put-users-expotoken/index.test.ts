import { PutUsersExpotokenApi } from "@/endpoints/put-users-expotoken/interfaces";
import { StatusCodes, TestHandler } from "@/lib/response-handler";

const putUsersExpotokenPath = "put-users-expotoken";

beforeAll(async () => {
   // await cleanDb();
});

describe("putUsersExpotoken API", () => {
   test("It should ...", async () => {
      // const { statusCode, payload } = await TestHandler.invokeLambda<PutUsersExpotokenApi.SuccessResponse>(putUsersExpotokenPath);
      // expect(statusCode).toBe(StatusCodes.OK);
   });
});

afterAll(async () => {
   // await closeDbConnection();
});
