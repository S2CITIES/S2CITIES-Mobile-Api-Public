import {
   ErrorResponse,
   ResponseHandler,
   StatusCodes,
} from "@/lib/response-handler";
import { NextApiResponse } from "next";
import { GetAlertsVideoS3signedurlsApi } from "./interfaces";
import S3 from "aws-sdk/clients/s3";
import { Alert } from "@/models/server/Alert";
import { AlertVideo } from "@/models/server/AlertVideo";

export default async function handler(
   req: GetAlertsVideoS3signedurlsApi.Request,
   res: NextApiResponse<GetAlertsVideoS3signedurlsApi.EndpointResponse>,
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

      const { alertIds } = req.queryStringParameters;

      // create AWS S3 service manager instance
      const s3 = new S3({
         region: process.env.REGION_AWS_BACKEND,
         accessKeyId: process.env.ACCESS_KEY_ID_AWS_BACKEND,
         secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS_BACKEND,
         signatureVersion: "v4",
      });

      const videoUrls: string[] = [];

      for (let alertId of alertIds) {
         // check alert existence
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
            // alert without video: save 'none'
            videoUrls.push("none");
            continue;
         }

         // * retrieve video signed url *

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
                  message: "An error occurred generating the signed URLs",
               },
               StatusCodes.InternalServerError,
            );
         }

         // * video url retrieved: save it *
         videoUrls.push(s3UrlForDownload);
      }

      return ResponseHandler.json<GetAlertsVideoS3signedurlsApi.SuccessResponse>(
         res,
         { signedUrls: videoUrls },
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
