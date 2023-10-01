import { GetUsersApi } from "@/endpoints/get-users/interfaces";
import { StatusCodes, TestHandler } from "@/lib/response-handler";

const getUsersPath = "get-users";

beforeAll(async () => {
   // await cleanDb();
});

describe("getUsers API", () => {
   test("It should ...", async () => {
      // const { statusCode, payload } = await TestHandler.invokeLambda<GetUsersApi.SuccessResponse>(getUsersPath);
      // expect(statusCode).toBe(StatusCodes.OK);
   });
});

afterAll(async () => {
   // await closeDbConnection();
});
