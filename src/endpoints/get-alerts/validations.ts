import { YupShapeByInterface } from "@/lib/response-handler";
import * as yup from "yup";
import { GetAlertsApi } from "./interfaces";

const queryStringParametersValidations =
   (): YupShapeByInterface<GetAlertsApi.QueryStringParameters> => ({});

export default () => ({
   queryStringParameters: yup
      .object()
      .shape(queryStringParametersValidations()),
});
