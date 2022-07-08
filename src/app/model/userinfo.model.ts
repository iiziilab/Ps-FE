import { Status } from "./status.model";
import { role } from "./userlog.model";

export class UserInfo{
    userid : number;
    firstName : string;
    lastName :string;
    email:string;
    //role : role;
    roleId :any;
    //status : Status;
    statusId : any;
    designation:string;
    password:string;
}