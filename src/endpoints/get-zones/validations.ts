import { YupShapeByInterface } from "@/lib/response-handler";
import * as yup from "yup";
import { GetZonesApi } from "./interfaces";

const queryStringParametersValidations =
   (): YupShapeByInterface<GetZonesApi.QueryStringParameters> => ({});

export default () => ({
   queryStringParameters: yup
      .object()
      .shape(queryStringParametersValidations()),
});
