import { YupShapeByInterface } from "@/lib/response-handler";
import * as yup from "yup";
import { PostAlertsVideoS3signedurlApi } from "./interfaces";

const queryStringParametersValidations =
   (): YupShapeByInterface<PostAlertsVideoS3signedurlApi.QueryStringParameters> => ({});

const payloadValidations =
   (): YupShapeByInterface<PostAlertsVideoS3signedurlApi.Payload> => ({
      format: yup.string().required(),
   });

export default () => ({
   queryStringParameters: yup
      .object()
      .shape(queryStringParametersValidations()),
   payload: yup.object().shape(payloadValidations()),
});
