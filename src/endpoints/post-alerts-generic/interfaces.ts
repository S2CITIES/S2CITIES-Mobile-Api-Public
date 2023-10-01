import { ErrorResponse, RequestI } from "@/lib/response-handler";
import { IAlertFe } from "@/models/client/AlertFe";
import { ObjectId } from "mongodb";

export namespace PostAlertsGenericApi {
   export type QueryStringParameters = {};

   export type Payload = {
      zone_id?: ObjectId | null; // (ObjectId of the source zone)
      address: string;
      latitude?: string | null;
      longitude?: string | null;
      info?: string | null;
      // for video upload (optional)
      alert_id?: ObjectId | null; // (as provided by the previous call to request signed url)
      format?: string | null; // video extension (without starting period)
      key?: string | null; // random key associated to the resource
   };

   export type SuccessResponse = {
      message?: string;
      alert: IAlertFe;
   };

   export type EndpointResponse = SuccessResponse | ErrorResponse;

   export interface Request extends RequestI<QueryStringParameters, Payload> {}
}
