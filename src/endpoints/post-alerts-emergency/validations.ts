import { YupShapeByInterface } from "@/lib/response-handler";
import * as yup from "yup";
import { PostAlertsEmergencyApi } from "./interfaces";

const queryStringParametersValidations =
   (): YupShapeByInterface<PostAlertsEmergencyApi.QueryStringParameters> => ({});

const payloadValidations =
   (): YupShapeByInterface<PostAlertsEmergencyApi.Payload> => ({
      address: yup.string().optional().nullable(),
      latitude: yup.string().optional().nullable(),
      longitude: yup.string().optional().nullable(),
   });

export default () => ({
   queryStringParameters: yup
      .object()
      .shape(queryStringParametersValidations()),
   payload: yup.object().shape(payloadValidations()),
});
