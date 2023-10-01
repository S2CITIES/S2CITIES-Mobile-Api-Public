import { Filter, ObjectId, WithId } from "mongodb";
import mongoDao from "@/lib/mongodb/mongo-dao";
import { AlertType, IAlertFe, RawAlertType } from "@/models/client/AlertFe";
import dayjs from "dayjs";

const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

export type IAlert = {
   _id?: ObjectId;
   created: Date;
   v: number;
   // custom props
   type: RawAlertType;
   zone_id?: ObjectId | null; // it is required just in case of HandGestureAlert
   address?: string | null; // it might be null for an emergency alert, if the client does not provide an address info
   latitude?: string | null;
   longitude?: string | null;
   timestamp: Date; // (ISO 8601, referred to GMT)
   info?: string | null;
   cam?: string | null;
   creator?: ObjectId | null; // it is NOT present in case of HandGestureAlert
   check: {
      marked: boolean;
      user_id?: ObjectId | null;
      timestamp?: Date | null; // ISO 8601, referred to GMT
   };
   false_alarm: {
      marked: boolean;
      user_id?: ObjectId | null;
      timestamp?: Date | null; // ISO 8601, referred to GMT
   };
   assigned_users: ObjectId[];
};

export class Alert implements WithId<IAlert> {
   _id: ObjectId;
   created: Date;
   v: number;

   // custom props
   type: RawAlertType;
   zone_id?: ObjectId;
   address?: string | null; // it might be null for an emergency alert, if the client does not provide an address info
   latitude?: string | null;
   longitude?: string | null;
   timestamp: Date; // (ISO 8601, referred to GMT)
   info?: string | null;
   cam?: string | null;
   creator?: ObjectId | null; // it is NOT present in case of HandGestureAlert
   check: {
      marked: boolean;
      user_id?: ObjectId | null;
      timestamp?: Date | null; // ISO 8601, referred to GMT
   };
   false_alarm: {
      marked: boolean;
      user_id?: ObjectId | null;
      timestamp?: Date | null; // ISO 8601, referred to GMT
   };
   assigned_users: ObjectId[];

   static get collectionName() {
      return "alerts";
   }

   constructor(iAlert: IAlert) {
      this.fromInterface(iAlert);

      this.type = iAlert.type;

      if (iAlert.zone_id) this.zone_id = iAlert.zone_id;
      if (iAlert.address) this.address = iAlert.address;
      if (iAlert.latitude) this.latitude = iAlert.latitude;
      if (iAlert.longitude) this.longitude = iAlert.longitude;

      this.timestamp = new Date(iAlert.timestamp); // ISO 8601, referred to GMT

      if (iAlert.info) this.info = iAlert.info;
      if (iAlert.cam) this.cam = iAlert.cam;
      if (iAlert.creator) this.creator = iAlert.creator;

      this.check = {
         marked: iAlert.check.marked,
      };

      if (iAlert.check.user_id && iAlert.check.timestamp) {
         this.check.user_id = iAlert.check.user_id;
         this.check.timestamp = new Date(iAlert.check.timestamp); // ISO 8601 timestamp, referred to GMT
      }

      this.false_alarm = {
         marked: iAlert.false_alarm.marked,
      };

      if (iAlert.false_alarm.user_id && iAlert.false_alarm.timestamp) {
         this.false_alarm.user_id = iAlert.false_alarm.user_id;
         this.false_alarm.timestamp = new Date(iAlert.false_alarm.timestamp); // ISO 8601 timestamp, referred to GMT
      }

      this.assigned_users = iAlert.assigned_users;
   }

   /**
    * Create an IAlert object of type HandSignalAlert starting from some basic info
    * @param zone_id object id of the source zone of the detected alert
    * @param address address of the camera which detected the signal
    * @param cam (optional) a unique ID for the camera
    * @returns an object following the IAlert interface
    */
   static fromHandSignal(
      alertId: ObjectId,
      address: string,
      latitude: string,
      longitude: string,
      zone_id?: ObjectId | null,
      cam?: string | null,
      info?: string | null,
   ): IAlert {
      const now = dayjs();

      let result = {
         _id: alertId,
         created: new Date(),
         v: 1,

         type: AlertType.HandSignalAlert,
         zone_id: zone_id,
         address: address,
         latitude: latitude,
         longitude: longitude,
         timestamp: now.toDate(),
         cam: cam,
         info: info,
         // no video id
         check: {
            marked: false,
         },
         false_alarm: {
            marked: false,
         },
         assigned_users: [],
      };

      if (!zone_id) delete result.zone_id;
      if (!cam) delete result.cam;
      if (!info) delete result.info;

      return result;
   }

   /**
    * Create a Generic Alert starting from some basic info
    * @param address complete address string of the detected alert
    * @param zone_id (optional) object id of the source zone
    * @param info (optional) a custom description of the alert
    * @returns an object following the iAlert interface
    */
   static fromGenericInfo(
      address: string,
      alert_id: ObjectId | null,
      latitude?: string | null,
      longitude?: string | null,
      zone_id?: ObjectId | null,
      info?: string | null,
   ): IAlert {
      const now = dayjs();

      let result: IAlert = {
         created: new Date(),
         v: 1,

         // custom props
         type: AlertType.GenericAlert,
         zone_id: zone_id ?? null,
         address: address,
         latitude: latitude ?? null,
         longitude: longitude ?? null,
         timestamp: now.toDate(),
         info: info ?? null,
         // no cam
         // no video_id
         creator: new ObjectId("648c310f5f701d23c4401efd"), // TODO: substitute hardcoded user with current session's user
         check: {
            marked: false,
         },
         false_alarm: {
            marked: false,
         },
         assigned_users: [],
      };

      if (alert_id) result._id = alert_id;

      if (!zone_id) delete result.zone_id;
      if (!latitude) delete result.latitude;
      if (!longitude) delete result.longitude;
      if (!info) delete result.info;

      return result;
   }

   /**
    * Create an Emergency Alert starting from the source address
    * @param address address where the emergency comes from
    * @returns an object following the iAlert interface
    */
   static fromEmergency(
      address?: string | null,
      latitude?: string | null,
      longitude?: string | null,
   ): IAlert {
      const now = dayjs();
      const userId = new ObjectId("648c310f5f701d23c4401efd"); // TODO: substitute hardcoded user with current session's user

      let result: IAlert = {
         created: new Date(),
         v: 1,

         // custom props
         type: AlertType.EmergencyAlert,
         // no zone_id
         address: address,
         latitude: latitude,
         longitude: longitude,
         timestamp: now.toDate(),
         // no info
         // no cam
         // no video_id
         creator: userId,
         check: {
            marked: false,
         },
         false_alarm: {
            marked: false,
         },
         assigned_users: [],
      };

      if (!address) delete result.address;
      if (!latitude) delete result.latitude;
      if (!longitude) delete result.longitude;

      return result;
   }

   toClientVersion(): IAlertFe {
      let result: IAlertFe = {
         _id: this._id.toHexString(),
         type: this.type,
         zone_id: this.zone_id?.toHexString() ?? null,
         address: this.address ?? null,
         latitude: this.latitude ?? null,
         longitude: this.longitude ?? null,
         timestamp: this.timestamp.toISOString(),
         info: this.info ?? null,
         cam: this.cam ?? null,
         creator: this.creator?.toHexString() ?? null,
         check: {
            marked: this.check.marked,
            user_id: this.check.user_id?.toHexString() ?? null,
            timestamp: this.check.timestamp
               ? this.check.timestamp.toISOString()
               : null,
         },
         false_alarm: {
            marked: this.false_alarm.marked,
            user_id: this.false_alarm.user_id?.toHexString() ?? null,
            timestamp: this.false_alarm.timestamp
               ? this.false_alarm.timestamp.toISOString()
               : null,
         },
         assigned_users: this.assigned_users.map((id) => id.toHexString()),
      };

      Alert.removeNullPropsFrom(result);
      return result;
   }

   static removeNullPropsFrom(alert: IAlertFe) {
      // delete null properties from the alert
      for (let key in alert) {
         if (alert[key] == null) delete alert[key];
         else if (key == "check" || key == "false_alarm")
            for (let subKey in alert[key])
               if (alert[key][subKey] == null) delete alert[key][subKey];
      }
   }

   toBasicInfo(): {
      id: string;
      type: RawAlertType;
      shortAddress: string;
      timestamp: string;
      cam?: string | null;
   } {
      return {
         id: this._id.toHexString(),
         type: this.type,
         shortAddress: this.getShortAddress(),
         timestamp: this.timestamp.toISOString(),
         cam: this.cam,
      };
   }

   getShortAddress(): string {
      const addressTokens = this.address?.trim()?.split(",") ?? [];
      const shortAddressPlace =
         addressTokens.length > 0 ? addressTokens[0] : null;
      const shortAddressCity =
         addressTokens.length > 1
            ? addressTokens[1]
                 .trimStart()
                 .split(" ")
                 .slice(1, undefined)
                 .join(" ")
            : null;

      const shortAddress = `${shortAddressPlace ?? "(No address)"}${
         shortAddressCity ? `, ${shortAddressCity}` : ""
      }${
         shortAddressPlace
            ? ""
            : this.latitude && this.longitude
            ? ` - (${this.latitude},${this.longitude})`
            : ""
      }`;

      return shortAddress;
   }

   static async create(alert: IAlert): Promise<Alert | null> {
      const iAlert = await mongoDao.insertOne<IAlert>(
         Alert.collectionName,
         alert,
      );

      return iAlert ? new Alert(iAlert) : null;
   }

   static async getById(_id: ObjectId): Promise<Alert | null> {
      const iAlert = await mongoDao.findOne<IAlert>(Alert.collectionName, {
         _id,
      });
      return iAlert ? new Alert(iAlert) : null;
   }

   async patch(fields: Partial<IAlert>): Promise<void> {
      const result = await mongoDao.updateOne<IAlert>(
         Alert.collectionName,
         {
            _id: this._id,
         },
         {
            $set: fields,
         },
      );
      if (result.modifiedCount !== 1) {
         throw new Error("Patch op was not applied successfully");
      }
      await this.refresh();
   }

   static async delete(_id: ObjectId): Promise<void> {
      const result = await mongoDao.deleteOne<IAlert>(Alert.collectionName, {
         _id,
      });
      if (result.deletedCount !== 1) {
         throw new Error("Delete op was not applied successfully");
      }
   }

   static async getList(
      filter: Filter<IAlert> = {},
      {
         limit = 10,
         skip = 0,
         sort = [],
         projection = null,
      }: {
         limit?: number;
         skip?: number;
         sort?: {
            by: keyof IAlert;
            asc: boolean;
         }[];
         projection?: Document;
      } = {
         limit: 10,
         skip: 0,
         sort: [],
         projection: null,
      },
   ): Promise<Alert[]> {
      const iAlerts = await mongoDao.findMany<IAlert>(
         Alert.collectionName,
         filter,
         {
            limit,
            skip,
            sort: sort.length
               ? Object.fromEntries(
                    sort.map((pair) => [pair.by, pair.asc ? 1 : -1]),
                 )
               : undefined,
            projection,
         },
      );
      return iAlerts.map((iAlert) => new Alert(iAlert));
   }

   /* Mostly for internal use */

   fromInterface(iAlert: IAlert) {
      if (!iAlert._id) {
         throw new Error("Interface object doesn't have an _id");
      }
      this._id = iAlert._id;
      this.created = iAlert.created;
      this.v = iAlert.v;
   }

   async refresh() {
      const iAlert = await mongoDao.findOne<IAlert>(Alert.collectionName, {
         _id: this._id,
      });
      if (iAlert) {
         this.fromInterface(iAlert);
      } else {
         throw new Error("Couldn't find document in DB");
      }
   }
}
