import { ErrorResponse, RequestI } from "@/lib/response-handler";
import { ObjectId } from "mongodb";

export namespace GetAlertsVideoS3signedurlByAlertIdApi {
   export type QueryStringParameters = {
      alertId: ObjectId;
   };

   export type SuccessResponse = {
      message?: string;
      download_signed_url: string;
   };

   export type EndpointResponse = SuccessResponse | ErrorResponse;

   export interface Request extends RequestI<QueryStringParameters, null> {}
}
