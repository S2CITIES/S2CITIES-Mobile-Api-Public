import { ErrorResponse, RequestI } from "@/lib/response-handler";

export namespace PutUsersExpotokenApi {
   export type QueryStringParameters = {};

   export type Payload = {
      token: string;
   };

   export type SuccessResponse = {
      message?: string;
   };

   export type EndpointResponse = SuccessResponse | ErrorResponse;

   export interface Request extends RequestI<QueryStringParameters, Payload> {}
}
