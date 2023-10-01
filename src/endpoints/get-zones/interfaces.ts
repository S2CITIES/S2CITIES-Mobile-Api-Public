import { ErrorResponse, RequestI } from "@/lib/response-handler";
import { IZoneFe } from "@/models/client/ZoneFe";

export namespace GetZonesApi {
   export type QueryStringParameters = {};

   export type SuccessResponse = {
      message?: string;
      zones: IZoneFe[];
   };

   export type EndpointResponse = SuccessResponse | ErrorResponse;

   export interface Request extends RequestI<QueryStringParameters, null> {}
}
