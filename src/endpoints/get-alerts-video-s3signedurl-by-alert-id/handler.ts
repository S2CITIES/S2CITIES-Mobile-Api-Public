import {
   ErrorResponse,
   ResponseHandler,
   StatusCodes,
} from "@/lib/response-handler";
import { NextApiResponse } from "next";
import { GetAlertsVideoS3signedurlByAlertIdApi } from "./interfaces";
import S3 from "aws-sdk/clients/s3";
import { Alert } from "@/models/server/Alert";
import { AlertVideo } from "@/models/server/AlertVideo";

export default async function handler(
   req: GetAlertsVideoS3signedurlByAlertIdApi.Request,
   res: NextApiResponse<GetAlertsVideoS3signedurlByAlertIdApi.EndpointResponse>,
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

      // check alert existence
      const { alertId } = req.queryStringParameters;

      const alert = await Alert.getById(alertId);

      if (!alert) {
         return ResponseHandler.json<ErrorResponse>(
            res,
            { message: `Alert with id ${alertId} not found` },
            StatusCodes.NotFound,
         );
      }

      // check video existence
      const alertVideo = await AlertVideo.getById(alertId);

      if (!alertVideo) {
         // alert without video
         return ResponseHandler.json<GetAlertsVideoS3signedurlByAlertIdApi.SuccessResponse>(
            res,
            {
               download_signed_url: "none",
            },
         );
      }

      // create AWS S3 service manager instance
      const s3 = new S3({
         region: process.env.REGION_AWS_BACKEND,
         accessKeyId: process.env.ACCESS_KEY_ID_AWS_BACKEND,
         secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS_BACKEND,
         signatureVersion: "v4",
      });

      // specify which resource to retrieve
      const videoResourceKey = `${
         alertVideo.key
      }/${alertVideo._id.toHexString()}_video.${alertVideo.format}`;

      const fileParams = {
         Bucket: process.env.MEDIA_BUCKET_NAME_AWS_BACKEND,
         Key: videoResourceKey,
         Expires: 120, // seconds
         // ContentType: "",
      };

      let s3UrlForDownload;

      try {
         // request signed URL to S3 for download
         s3UrlForDownload = await s3.getSignedUrlPromise(
            "getObject",
            fileParams,
         );
      } catch {
         return ResponseHandler.json<ErrorResponse>(
            res,
            {
               message: "An error occurred generating the signed URL",
            },
            StatusCodes.InternalServerError,
         );
      }

      return ResponseHandler.json<GetAlertsVideoS3signedurlByAlertIdApi.SuccessResponse>(
         res,
         {
            download_signed_url: s3UrlForDownload,
         },
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
