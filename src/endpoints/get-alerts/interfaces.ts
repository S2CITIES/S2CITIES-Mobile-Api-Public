import { ErrorResponse, RequestI } from "@/lib/response-handler";
import { IAlertFe } from "@/models/client/AlertFe";

export namespace GetAlertsApi {
   export type QueryStringParameters = {};

   export type SuccessResponse = {
      message?: string;
      alerts: IAlertFe[];
   };

   export type EndpointResponse = SuccessResponse | ErrorResponse;

   export interface Request extends RequestI<QueryStringParameters, null> {}
}
