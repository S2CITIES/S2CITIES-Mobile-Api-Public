import {
   ErrorResponse,
   ResponseHandler,
   StatusCodes,
} from "@/lib/response-handler";
import { NextApiResponse } from "next";
import { GetUsersApi } from "./interfaces";
import { User } from "@/models/server/User";
import { usersNamesComparator } from "@/utils/usersUtils";

export default async function handler(
   req: GetUsersApi.Request,
   res: NextApiResponse<GetUsersApi.EndpointResponse>,
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

      const users = await User.getList(
         null, // no filter
         {
            limit: 100000,
         },
      );

      // TODO: substitute here the current user with the right one, once implementation is implemented
      const currentUserId = "648c310f5f701d23c4401efd"; // john doe

      users.forEach((user) => {
         if (user._id.toHexString() === currentUserId) {
            user.first_name = "You";
            user.last_name = "";
         }
      });

      return ResponseHandler.json<GetUsersApi.SuccessResponse>(res, {
         users: users
            .map((user) => user.toClientVersion())
            .sort(usersNamesComparator),
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
