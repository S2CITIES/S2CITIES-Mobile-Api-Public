import { YupShapeByInterface } from "@/lib/response-handler";
import * as yup from "yup";
import { PostAlertsGenericApi } from "./interfaces";
import { yupObjectId } from "@/lib/mongodb/mongo-dao";

const queryStringParametersValidations =
   (): YupShapeByInterface<PostAlertsGenericApi.QueryStringParameters> => ({});

const payloadValidations =
   (): YupShapeByInterface<PostAlertsGenericApi.Payload> => ({
      zone_id: yupObjectId().optional().nullable(),
      address: yup.string().required().min(2),
      latitude: yup.string().optional().nullable(),
      longitude: yup.string().optional().nullable(),
      info: yup.string().optional().nullable(),
      // for video upload (optional)
      alert_id: yupObjectId().optional().nullable(),
      format: yup.string().optional().nullable(),
      key: yup.string().optional().nullable(),
   });

export default () => ({
   queryStringParameters: yup
      .object()
      .shape(queryStringParametersValidations()),
   payload: yup.object().shape(payloadValidations()),
});
