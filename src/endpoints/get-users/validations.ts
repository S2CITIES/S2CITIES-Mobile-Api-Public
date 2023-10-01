import { YupShapeByInterface } from "@/lib/response-handler";
import * as yup from "yup";
import { GetUsersApi } from "./interfaces";

const queryStringParametersValidations =
   (): YupShapeByInterface<GetUsersApi.QueryStringParameters> => ({});

export default () => ({
   queryStringParameters: yup
      .object()
      .shape(queryStringParametersValidations()),
});
