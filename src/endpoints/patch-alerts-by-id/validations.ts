import { YupShapeByInterface } from "@/lib/response-handler";
import * as yup from "yup";
import { PatchAlertsByIdApi } from "./interfaces";
import { yupObjectId } from "@/lib/mongodb/mongo-dao";
import { IUserFe } from "@/models/client/UserFe";

const queryStringParametersValidations =
   (): YupShapeByInterface<PatchAlertsByIdApi.QueryStringParameters> => ({
      id: yupObjectId().required(),
   });

const payloadValidations =
   (): YupShapeByInterface<PatchAlertsByIdApi.Payload> => ({
      check: yup
         .object({
            marked: yup.boolean(),
         })
         .optional()
         .nullable(),
      false_alarm: yup
         .object({
            marked: yup.boolean(),
         })
         .optional()
         .nullable(),
      assigned_users: yup.array().of(yupObjectId()).optional().nullable(),
   });

export default () => ({
   queryStringParameters: yup
      .object()
      .shape(queryStringParametersValidations()),
   payload: yup.object().shape(payloadValidations()),
});
