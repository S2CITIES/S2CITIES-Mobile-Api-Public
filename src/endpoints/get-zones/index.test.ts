import { GetZonesApi } from "@/endpoints/get-zones/interfaces";
import { StatusCodes, TestHandler } from "@/lib/response-handler";

const getZonesPath = "get-zones";

beforeAll(async () => {
   // await cleanDb();
});

describe("getZones API", () => {
   test("It should ...", async () => {
      // const { statusCode, payload } = await TestHandler.invokeLambda<GetZonesApi.SuccessResponse>(getZonesPath);
      // expect(statusCode).toBe(StatusCodes.OK);
   });
});

afterAll(async () => {
   // await closeDbConnection();
});
