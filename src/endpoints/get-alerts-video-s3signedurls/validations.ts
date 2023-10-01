import { YupShapeByInterface } from "@/lib/response-handler";
import * as yup from "yup";
import { GetAlertsVideoS3signedurlsApi } from "./interfaces";
import { yupObjectId } from "@/lib/mongodb/mongo-dao";

const queryStringParametersValidations =
   (): YupShapeByInterface<GetAlertsVideoS3signedurlsApi.QueryStringParameters> => ({
      alertIds: yup.array().of(yupObjectId()).required(),
   });

export default () => ({
   queryStringParameters: yup
      .object()
      .shape(queryStringParametersValidations()),
});
