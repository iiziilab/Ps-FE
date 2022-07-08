import { rolePermission } from "./rolepermission.model";

export class User {
    statuscode: Number;
    token?: string;
    message:string;
    data:Data;
    rolePermission:rolePermission;
}

interface Data{
    id:number;
    email:string;
    password:string;
    role:role;
    clientId :number;
    employeeId:number;
    name:string;
    contactNo:string;
    editProject : boolean;
    viewProject: boolean;
    changePassword : boolean;
    statusId : string;
}
interface role{
    roleId : number;
    roleName: string;
}
