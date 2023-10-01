import {
   ErrorResponse,
   ResponseHandler,
   StatusCodes,
} from "@/lib/response-handler";
import { NextApiResponse } from "next";
import { PostAlertsVideoS3signedurlApi } from "./interfaces";
import S3 from "aws-sdk/clients/s3";
import { v4 as uuid } from "uuid";
import { ObjectId } from "mongodb";

export default async function handler(
   req: PostAlertsVideoS3signedurlApi.Request,
   res: NextApiResponse<PostAlertsVideoS3signedurlApi.EndpointResponse>,
) {
   try {
      const { validationResult } = req;

      if (!validationResult.isValid) {
         return ResponseHandler.json<ErrorResponse>(
            res,
            { message: validationResult.message! },
            StatusCodes.BadRequest,
         );
      }

      // create AWS S3 service manager instance
      const s3 = new S3({
         region: process.env.REGION_AWS_BACKEND,
         accessKeyId: process.env.ACCESS_KEY_ID_AWS_BACKEND,
         secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS_BACKEND,
         signatureVersion: "v4",
      });

      // generate the new Alert Object Id
      const newAlertId = new ObjectId().toHexString();

      // generate the video resource key
      const { format } = req.payload;
      const randomKey = uuid();

      // alert key by means which it will be possible to retrieve the video resource
      const videoResourceKey = `${randomKey}/${newAlertId}_video.${format}`;

      const fileParams = {
         Bucket: process.env.MEDIA_BUCKET_NAME_AWS_BACKEND,
         Key: videoResourceKey,
         Expires: 60, //seconds
         // ContentType: "",
      };

      // request a signed URL to S3 for upload
      const s3UrlForUpload = await s3.getSignedUrlPromise(
         "putObject",
         fileParams,
      );

      // return the signed URL and the new alert ID
      return ResponseHandler.json<PostAlertsVideoS3signedurlApi.SuccessResponse>(
         res,
         {
            upload_signed_url: s3UrlForUpload,
            alert_id: newAlertId,
            format: format,
            key: randomKey,
         },
         StatusCodes.Created,
      );
   } catch (e) {
      console.error(e);
      return ResponseHandler.json<ErrorResponse>(
         res,
         { message: "Internal error" },
         StatusCodes.InternalServerError,
      );
   }
}
