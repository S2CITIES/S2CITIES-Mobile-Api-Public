import {
   ErrorResponse,
   ResponseHandler,
   StatusCodes,
} from "@/lib/response-handler";
import { NextApiResponse } from "next";
import { PutUsersExpotokenApi } from "./interfaces";
import { User } from "@/models/server/User";
import { ObjectId } from "mongodb";

export default async function handler(
   req: PutUsersExpotokenApi.Request,
   res: NextApiResponse<PutUsersExpotokenApi.EndpointResponse>,
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

      // TODO: substitute here the current user with the right one, once authentication is implemented
      const currentUserId = "648c310f5f701d23c4401efd"; // john doe

      const currentUser = await User.getById(new ObjectId(currentUserId));

      if (!currentUser) {
         return ResponseHandler.json<ErrorResponse>(
            res,
            { message: "Current user not found" },
            StatusCodes.InternalServerError,
         );
      }

      const { token: newExpoToken } = req.payload;

      // retrieve current user expo tokens and add the new one (if not already present)
      const userTokens = currentUser.expoTokens ?? [];

      if (!userTokens.includes(newExpoToken)) {
         userTokens.push(newExpoToken);

         // save expo token into user document
         await currentUser.patch({ expoTokens: userTokens });
      }

      return ResponseHandler.json<PutUsersExpotokenApi.SuccessResponse>(
         res,
         {},
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
