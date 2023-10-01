import { ErrorResponse, RequestI } from "@/lib/response-handler";

export namespace PostAlertsVideoS3signedurlApi {
   export type QueryStringParameters = {};

   export type Payload = {
      format: string; // format of the video resource to upload
   }; // (extension of the file, without the starting period, e.g: 'mp4')

   export type SuccessResponse = {
      message?: string;
      upload_signed_url: string;
      alert_id: string;
      format: string; // extension of the video (without the starting period)
      key: string; // random key associated to the resource
   };

   export type EndpointResponse = SuccessResponse | ErrorResponse;

   export interface Request extends RequestI<QueryStringParameters, Payload> {}
}
