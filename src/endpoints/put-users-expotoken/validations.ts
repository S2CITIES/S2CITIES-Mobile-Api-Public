import { YupShapeByInterface } from "@/lib/response-handler";
import * as yup from "yup";
import { PutUsersExpotokenApi } from "./interfaces";

const queryStringParametersValidations =
   (): YupShapeByInterface<PutUsersExpotokenApi.QueryStringParameters> => ({});

const payloadValidations =
   (): YupShapeByInterface<PutUsersExpotokenApi.Payload> => ({
      token: yup.string().required(),
   });

export default () => ({
   queryStringParameters: yup
      .object()
      .shape(queryStringParametersValidations()),
   payload: yup.object().shape(payloadValidations()),
});
