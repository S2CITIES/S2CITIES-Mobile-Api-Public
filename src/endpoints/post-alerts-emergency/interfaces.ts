import { ErrorResponse, RequestI } from "@/lib/response-handler";
import { IAlertFe } from "@/models/client/AlertFe";

export namespace PostAlertsEmergencyApi {
   export type QueryStringParameters = {};

   export type Payload = {
      address?: string | null;
      latitude?: string | null;
      longitude?: string | null;
   };

   export type SuccessResponse = {
      message?: string;
      alert: IAlertFe;
   };

   export type EndpointResponse = SuccessResponse | ErrorResponse;

   export interface Request extends RequestI<QueryStringParameters, Payload> {}
}
