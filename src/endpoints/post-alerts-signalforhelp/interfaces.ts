import { ErrorResponse, RequestI } from "@/lib/response-handler";
import { IAlertFe } from "@/models/client/AlertFe";
import { ObjectId } from "mongodb";

export namespace PostAlertsSignalforhelpApi {
   export type QueryStringParameters = {};

   export type Payload = {
      zone_id?: ObjectId | null; // ObjectId of the source zone
      alert_id: ObjectId; // ObjectId of the new Alert
      address?: string | null;
      cam?: string | null;
      info?: string | null;
      latitude?: string | null;
      longitude?: string | null;
      format: string; // video extension (without starting period)
      key: string; // random key associated to the video
   };

   export type SuccessResponse = {
      message?: string;
      alert: IAlertFe;
   };

   export type EndpointResponse = SuccessResponse | ErrorResponse;

   export interface Request extends RequestI<QueryStringParameters, Payload> {}
}
