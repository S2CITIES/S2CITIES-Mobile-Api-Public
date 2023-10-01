import { Filter, ObjectId, WithId } from "mongodb";
import mongoDao from "@/lib/mongodb/mongo-dao";
import { IUserFe } from "@/models/client/UserFe";

export type IUser = {
   _id?: ObjectId;
   created: Date;
   v: number;

   // custom props
   first_name: string;
   last_name: string;
   username: string;
   password: string; // hashed
   zones: ObjectId[];
   expoTokens?: string[] | null; // tokens for push notifications
};

export class User implements WithId<IUser> {
   _id: ObjectId;
   created: Date;
   v: number;

   // custom props
   first_name: string;
   last_name: string;
   username: string;
   password: string; // hashed
   zones: ObjectId[];
   expoTokens?: string[] | null; // tokens for push notifications

   static get collectionName() {
      return "users";
   }

   constructor(iUser: IUser) {
      this.fromInterface(iUser);

      this.first_name = iUser.first_name;
      this.last_name = iUser.last_name;
      this.username = iUser.username;
      this.password = iUser.password;
      this.zones = iUser.zones;
      this.expoTokens = iUser.expoTokens;
   }

   toClientVersion(): IUserFe {
      return {
         id: this._id.toHexString(),
         first_name: this.first_name,
         last_name: this.last_name,
      };
   }

   static async create(
      firstName: string,
      lastName: string,
      username: string,
      password: string,
      zones: ObjectId[],
   ): Promise<User | null> {
      const iUser = await mongoDao.insertOne<IUser>(User.collectionName, {
         created: new Date(),
         v: 1,

         // custom props
         first_name: firstName,
         last_name: lastName,
         username: username,
         password: password,
         zones: zones,
      });
      return iUser ? new User(iUser) : null;
   }

   static async getById(_id: ObjectId): Promise<User | null> {
      const iUser = await mongoDao.findOne<IUser>(User.collectionName, {
         _id,
      });
      return iUser ? new User(iUser) : null;
   }

   async patch(fields: Partial<IUser>): Promise<void> {
      const result = await mongoDao.updateOne<IUser>(
         User.collectionName,
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
      const result = await mongoDao.deleteOne<IUser>(User.collectionName, {
         _id,
      });
      if (result.deletedCount !== 1) {
         throw new Error("Delete op was not applied successfully");
      }
   }

   static async getList(
      filter: Filter<IUser> = {},
      {
         limit = 10,
         skip = 0,
         sort = [],
         projection = null,
      }: {
         limit?: number;
         skip?: number;
         sort?: {
            by: keyof IUser;
            asc: boolean;
         }[];
         projection?: Document;
      } = {
         limit: 10,
         skip: 0,
         sort: [],
         projection: null,
      },
   ): Promise<User[]> {
      const iUsers = await mongoDao.findMany<IUser>(
         User.collectionName,
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
      return iUsers.map((iUser) => new User(iUser));
   }

   /* Mostly for internal use */

   fromInterface(iUser: IUser) {
      if (!iUser._id) {
         throw new Error("Interface object doesn't have an _id");
      }
      this._id = iUser._id;
      this.created = iUser.created;
      this.v = iUser.v;
   }

   async refresh() {
      const iUser = await mongoDao.findOne<IUser>(User.collectionName, {
         _id: this._id,
      });
      if (iUser) {
         this.fromInterface(iUser);
      } else {
         throw new Error("Couldn't find document in DB");
      }
   }
}
