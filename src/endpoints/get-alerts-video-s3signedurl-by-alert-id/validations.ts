import { YupShapeByInterface } from "@/lib/response-handler";
import * as yup from "yup";
import { GetAlertsVideoS3signedurlByAlertIdApi } from "./interfaces";
import { yupObjectId } from "@/lib/mongodb/mongo-dao";

const queryStringParametersValidations =
   (): YupShapeByInterface<GetAlertsVideoS3signedurlByAlertIdApi.QueryStringParameters> => ({
      alertId: yupObjectId().required(),
   });

export default () => ({
   queryStringParameters: yup
      .object()
      .shape(queryStringParametersValidations()),
});
