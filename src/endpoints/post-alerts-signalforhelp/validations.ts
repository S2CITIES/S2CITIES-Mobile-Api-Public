import { YupShapeByInterface } from "@/lib/response-handler";
import * as yup from "yup";
import { PostAlertsSignalforhelpApi } from "./interfaces";
import { yupObjectId } from "@/lib/mongodb/mongo-dao";

const queryStringParametersValidations =
   (): YupShapeByInterface<PostAlertsSignalforhelpApi.QueryStringParameters> => ({});

const payloadValidations =
   (): YupShapeByInterface<PostAlertsSignalforhelpApi.Payload> => ({
      zone_id: yupObjectId().optional().nullable(), // optional because the S2CITIES app does not require you to insert a zone
      alert_id: yupObjectId().required(),
      address: yup.string().nullable().optional(),
      cam: yup.string().nullable().optional(),
      info: yup.string().nullable().optional(),
      latitude: yup.string().nullable().optional(),
      longitude: yup.string().nullable().optional(),
      format: yup.string().required(),
      key: yup.string().required(),
   });

export default () => ({
   queryStringParameters: yup
      .object()
      .shape(queryStringParametersValidations()),
   payload: yup.object().shape(payloadValidations()),
});
