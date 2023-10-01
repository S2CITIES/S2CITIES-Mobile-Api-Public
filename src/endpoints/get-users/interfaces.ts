import { ErrorResponse, RequestI } from "@/lib/response-handler";
import { UserFe } from "@/models/client/UserFe";

export namespace GetUsersApi {
   export type QueryStringParameters = {};

   export type SuccessResponse = {
      message?: string;
      users: UserFe[];
   };

   export type EndpointResponse = SuccessResponse | ErrorResponse;

   export interface Request extends RequestI<QueryStringParameters, null> {}
}
