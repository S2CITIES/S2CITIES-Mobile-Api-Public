import { ErrorResponse, RequestI } from "@/lib/response-handler";
import { ObjectId } from "mongodb";

export namespace GetAlertsVideoS3signedurlsApi {
   export type QueryStringParameters = {
      alertIds: ObjectId[];
   };

   export type SuccessResponse = {
      message?: string;
      signedUrls: string[];
   };

   export type EndpointResponse = SuccessResponse | ErrorResponse;

   export interface Request extends RequestI<QueryStringParameters, null> {}
}
