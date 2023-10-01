import { ErrorResponse, RequestI } from "@/lib/response-handler";
import { IAlertFe } from "@/models/client/AlertFe";
import { ObjectId } from "mongodb";

export namespace PatchAlertsByIdApi {
   export type QueryStringParameters = {
      id: ObjectId;
   };

   export type Payload = {
      check?: {
         marked: boolean;
      };
      false_alarm?: {
         marked: boolean;
      };
      assigned_users?: string[];
   };

   export type SuccessResponse = {
      message?: string;
      alert: IAlertFe;
   };

   export type EndpointResponse = SuccessResponse | ErrorResponse;

   export interface Request extends RequestI<QueryStringParameters, Payload> {}
}
