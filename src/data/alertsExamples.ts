import { ObjectId } from "mongodb";

let users = [
   {
      _id: new ObjectId("648c310f5f701d23c4401efd"),
      first_name: "Mario",
      last_name: "Mastrandrea",
      username: "mariomastrandrea",
      password: "password",
      zones: [new ObjectId("648c2b195f701d23c4401efa")],
   },
];

let zones = [
   {
      _id: new ObjectId("648c2b195f701d23c4401efa"),
      name: "Stazione di Milano Centrale",
      address: "Piazza Duca d'Aosta, 20124 Milano MI",
      users: [new ObjectId("648c310f5f701d23c4401efd")],
   },
   {
      _id: new ObjectId("648c2b195f701d23c4401efb"),
      name: "Piazza Duomo Milano",
      address: "Piazza del Duomo, 20121 Milano MI",
      users: [new ObjectId("648c310f5f701d23c4401efd")],
   },
];

let alerts = [
   {
      _id: new ObjectId("648c2fcd5f701d23c4401efc"),
      type: 0,
      zone_id: new ObjectId("648c2b195f701d23c4401efa"),
      address: "Piazza Duca d'Aosta, 20124 Milano MI",
      timestamp: "2023-06-16T09:41:48.309Z",
      info: "Detected in Piazza Duca d'Aosta at 9:41 GMT on 16/06/2023 by Cam#1",
      cam: "Cam#1",
      video_id: null,
      check: {
         marked: false,
      },
      false_alarm: {
         marked: false,
      },
      assigned_users: [],
   },
   {
      _id: new ObjectId("648c3f025f701d23c4401eff"),
      type: 0,
      zone_id: new ObjectId("648c2b195f701d23c4401efb"),
      address: "Piazza del Duomo, 20121 Milano MI",
      timestamp: "2023-06-16T10:25:00.588Z",
      info: "Detected in Piazza del Duomo at 10:25 GMT on 16/06/2023 by Cam#1",
      cam: "Cam#1",
      video_id: null,
      check: {
         marked: false,
      },
      false_alarm: {
         marked: false,
      },
      assigned_users: [],
   },
];
