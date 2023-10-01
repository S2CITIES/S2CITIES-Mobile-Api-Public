import {
   ErrorResponse,
   ResponseHandler,
   StatusCodes,
} from "@/lib/response-handler";
import { NextApiResponse } from "next";
import { PatchAlertsByIdApi } from "./interfaces";
import { Alert } from "@/models/server/Alert";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import { User } from "@/models/server/User";

export default async function handler(
   req: PatchAlertsByIdApi.Request,
   res: NextApiResponse<PatchAlertsByIdApi.EndpointResponse>,
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

      const { id } = req.queryStringParameters;

      // check if an alert with that id exists or not
      const alert = await Alert.getById(id);

      if (!alert) {
         return ResponseHandler.json<ErrorResponse>(
            res,
            { message: `Alert with id ${id.toString()} not found` },
            StatusCodes.NotFound,
         );
      }

      // modify requested properties
      const { check, false_alarm, assigned_users } = req.payload;

      // check there is at least one field to update
      if (
         (check.marked === undefined || check.marked === null) &&
         (false_alarm.marked === undefined || false_alarm.marked === null) &&
         (assigned_users === undefined || assigned_users === null)
      ) {
         return ResponseHandler.json<ErrorResponse>(
            res,
            { message: "You have to specify at least one field to update" },
            StatusCodes.UnprocessableEntity,
         );
      }

      let timestamp;
      let userId;

      let updatedSuccessfully = true;
      let errorMessages = [];

      if (check.marked !== undefined && check.marked !== null) {
         // compute timestamp
         timestamp = dayjs().toDate();

         // compute user id
         // TODO: remove hardcoded userId when implementing user authentication
         userId = new ObjectId("648c310f5f701d23c4401efd"); // user Mario Mastrandrea

         try {
            // set new check
            await alert.patch({
               check: {
                  marked: check.marked,
                  timestamp: timestamp,
                  user_id: userId,
               },
            });
         } catch (e) {
            updatedSuccessfully = false;
            errorMessages.push(e.message ?? "");
         }
      }

      if (false_alarm.marked !== undefined && false_alarm.marked !== null) {
         if (!timestamp) {
            // compute timestamp
            timestamp = dayjs().toDate();
         }

         if (!userId) {
            // compute user id
            // TODO: remove hardcoded userId when implementing user authentication
            userId = new ObjectId("648c310f5f701d23c4401efd"); // user Mario Mastrandrea
         }

         try {
            // set new false alarm
            await alert.patch({
               false_alarm: {
                  marked: false_alarm.marked,
                  timestamp: timestamp,
                  user_id: userId,
               },
            });
         } catch (e) {
            updatedSuccessfully = false;
            errorMessages.push(e.message ?? "");
         }
      }

      if (assigned_users !== undefined && assigned_users !== null) {
         // check user ids exist
         for (let userId of assigned_users) {
            const user = await User.getById(new ObjectId(userId));

            if (!user) {
               // user id not found
               return ResponseHandler.json<ErrorResponse>(
                  res,
                  { message: `User id ${userId} does not exist` },
                  StatusCodes.BadRequest,
               );
            }
         }

         try {
            // set new assigned users
            await alert.patch({
               assigned_users: assigned_users.map(
                  (userId) => new ObjectId(userId),
               ),
            });
         } catch (e) {
            updatedSuccessfully = false;
            errorMessages.push(e.message ?? "");
         }
      }

      if (!updatedSuccessfully) {
         // some error occurred during updates
         const errorMessage = errorMessages.join("\n");

         return ResponseHandler.json<ErrorResponse>(
            res,
            { message: errorMessage },
            StatusCodes.InternalServerError,
         );
      }

      // * alert successfully updated *

      const updatedAlert = await Alert.getById(id);

      if (!updatedAlert) {
         return ResponseHandler.json<ErrorResponse>(
            res,
            { message: "unexpected error: new updated alert not found" },
            StatusCodes.InternalServerError,
         );
      }

      return ResponseHandler.json<PatchAlertsByIdApi.SuccessResponse>(res, {
         alert: updatedAlert.toClientVersion(),
      });
   } catch (e) {
      console.error(e);
      return ResponseHandler.json<ErrorResponse>(
         res,
         { message: "Internal error" },
         StatusCodes.InternalServerError,
      );
   }
}
