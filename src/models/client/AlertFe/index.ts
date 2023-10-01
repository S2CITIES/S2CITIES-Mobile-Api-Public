import { RawIntEnum } from "@/utils/types";

export enum AlertType {
   HandSignalAlert = 0,
   GenericAlert = 1,
   EmergencyAlert = 2,
}

export type RawAlertType = RawIntEnum<AlertType>;

export type IAlertFe = {
   _id?: string;
   type: RawAlertType;
   zone_id?: string | null;
   address?: string | null;
   latitude?: string | null;
   longitude?: string | null;
   timestamp: string; // ISO 8601 timestamp, referred to GMT
   info?: string | null;
   cam?: string | null;
   creator?: string | null;
   check: {
      marked: boolean;
      user_id?: string | null;
      timestamp?: string | null; // ISO 8601 timestamp, referred to GMT
   };
   false_alarm: {
      marked: boolean;
      user_id?: string | null;
      timestamp?: string | null; // ISO 8601 timestamp, referred to GMT
   };
   assigned_users: string[];
};

export class AlertFe implements IAlertFe {
   _id?: string;
   type: RawAlertType;
   zone_id?: string | null;
   address?: string | null;
   latitude?: string | null;
   longitude?: string | null;
   timestamp: string; // ISO 8601 timestamp, referred to GMT
   info?: string | null;
   cam?: string | null;
   creator?: string | null;
   check: {
      marked: boolean;
      user_id?: string | null;
      timestamp?: string | null; // ISO 8601 timestamp, referred to GMT
   };
   false_alarm: {
      marked: boolean;
      user_id?: string | null;
      timestamp?: string | null; // ISO 8601 timestamp, referred to GMT
   };
   assigned_users: string[];
}
