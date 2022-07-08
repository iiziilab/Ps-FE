import { Injectable } from '@angular/core';
import { UserRegister } from '../model/userregister.model';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { User } from '../model/user.model';
import { Client } from '../model/client.model';
import { Clientlog } from '../model/clientlog.model';
import { role, Userlog } from '../model/userlog.model';
import { Employee } from '../model/employee.model';
import { Project } from '../model/project.model';
import { UserImage } from '../model/image.model';
import { Status } from '../model/status.model';
import { userPermission } from '../model/userpermission.model';
import { UserInfo } from '../model/userinfo.model';
import { rolePermission } from '../model/rolepermission.model';
import { Module } from '../model/module.model';
import { Menu } from '../model/menu.model';
import { Cell } from '../model/cell.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' ,'Accept': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class PsolutionsService {

  private readonly baseUrl = environment.apiUrl;

  constructor(private http : HttpClient) { }

  // Company Client
  public getCompanyClient(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Client').pipe();
  }

  public addCompanyClient(client: Client): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/Client', JSON.stringify(client), httpOptions).pipe();
  }

  public deleteCompanyClient(id: any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/Client/' + id).pipe();
  }

  public getCompanyClientByid(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Client/' + id).pipe();
  }

  public getCompanyClientListByid(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Client/list/' + id).pipe();
  }  

  public updateCompanyClient(id: any,client: Client): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/Client/' + id,JSON.stringify(client), httpOptions).pipe();
  }
  // Client Credential
  public getClientlog(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Clientslog').pipe();
  }

  public addClientlog(clientlog: Clientlog): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/Clientslog', JSON.stringify(clientlog), httpOptions).pipe();
  }

  public deleteClientlog(id: string): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/Clientslog/' + id).pipe();
  }

  public getClientlogByid(id: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Clientslog/' + id).pipe();
  }

  // User
  public getUser(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Users').pipe();
  }

  public addUser(user: Userlog): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/Users', JSON.stringify(user), httpOptions).pipe();
  }

  public deleteUser(id: any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/Users/' + id).pipe();
  }

  public deleteUserbyCid(id: any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/Users/deleteclient/' + id).pipe();
  }

  public getUserByid(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Users/' + id).pipe();
  }
  public getUserByCid(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Users/getclient/' + id).pipe();
  }
  public updateClient(id: any,client: Userlog): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/Users/' + id,JSON.stringify(client), httpOptions).pipe();
  }
  public updateUserInfos(id: any,UserInfo: UserInfo): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/Users/' + id,JSON.stringify(UserInfo), httpOptions).pipe();
  }
  public updateClientbyCid(id: any,client: Userlog): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/Users/updateclient/' + id,JSON.stringify(client), httpOptions).pipe();
  }

  public getUserByEmail(id:any,email:string,role:any) : Observable<any>{//for client-user
    return this.http.post<any>(this.baseUrl + '/Users/Records',{ id,email,role },httpOptions).pipe();
  }
  public getUserInfoByEmail(id:any,email:string,role:any) : Observable<any>{//for user-info
    return this.http.post<any>(this.baseUrl + '/Users/UserRecords',{ id,email,role },httpOptions).pipe();
  }
  public getUserByDate(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Users/ByDate').pipe();
  }

  // Employee
  public getEmployee(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Employee').pipe();
  }

  public addEmployee(emp: Employee): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/Employee', JSON.stringify(emp), httpOptions).pipe();
  }

  public deleteEmployee(id: string): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/Employee/' + id).pipe();
  }
  public deleteEmployeebyCid(id: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/Employee/delete/' + id, httpOptions).pipe();
  }

  public getEmployeeByid(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Employee/' + id).pipe();
  }

  public getEmployeeByCid(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Employee/getemployee/' + id).pipe();
  }

  public getEmployeeListByCid(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Employee/getemployeelist/' + id).pipe();
  }

  public getEmployeeListByEid(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Employee/getemployeelistbyeid/' + id).pipe();
  }

  public updateEmployee(id: any,emp: Employee): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/Employee/' + id,JSON.stringify(emp), httpOptions).pipe();
  }

  public updateEmployeePermission(emp : any) : Observable<any>{
    return this.http.post<any>(this.baseUrl + '/Employee/UpdatePermission',JSON.stringify(emp),httpOptions).pipe();
  }

  public UpdateEmp(emp:any):Observable<any>{
    return this.http.post<any>(this.baseUrl + '/Employee/UpdateEmp',JSON.stringify(emp),httpOptions).pipe();
  }

  public getEmployeeByDate(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Employee/ByDate').pipe();
  }

  //Project
  public getProject() : Observable<any>{
    return this.http.get<any>(this.baseUrl + '/Project').pipe();
  }
  public addProject(project : Project):Observable<any>{
    return this.http.post<any>(this.baseUrl +'/Project',JSON.stringify(project),httpOptions).pipe();
  }
  public deleteProject(id:number):Observable<any>{
    return this.http.delete<any>(this.baseUrl + '/Project/'+id).pipe();
  }
  public getProjectbyId(id:number):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/Project/'+id).pipe();
  }
  public getProjectbyCId(id:any):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/Project/client/'+id).pipe();
  }
  public getProjectbyEId(id:any):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/Project/employee/'+id).pipe();
  }
  public postFile(id:any,fileToUpload: any): Observable<any> {
    return this.http.post(this.baseUrl + '/Users/UploadFile/'+id, fileToUpload).pipe();
  }
  public getUserPicbyId(id:any):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/Users/getpic/'+id).pipe();
  }
  public postUserFile(id:any,fileToUpload: any): Observable<any> {
    return this.http.post(this.baseUrl + '/Users/UploadUserFile/'+id, fileToUpload).pipe();
  }
  /* 
  oNLY for demo purpose
  */
  public postCsv(file:any):Observable<any>{
    return this.http.post(this.baseUrl + '/Users/UploadDemo', file).pipe();
  }
  public getUserInfoPicbyId(id:any):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/Users/getuserpic/'+id).pipe();
  }
  public postEmpFile(id:any,fileToUpload: any): Observable<any> {
    return this.http.post(this.baseUrl + '/Users/UploadEmpFile/'+id, fileToUpload).pipe();
  }
  public getEmpPicbyId(id:any):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/Users/getemppic/'+id).pipe();
  }
  public getProjectByDate() : Observable<any>{
    return this.http.get<any>(this.baseUrl + '/Project/ByDate').pipe();
  }

  //Status
  public getStatus(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Status').pipe();
  }

  public addStatus(status: Status): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/Status', JSON.stringify(status), httpOptions).pipe();
  }

  public deleteStatus(id: string): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/Status/' + id).pipe();
  }

  public getStatusByid(id: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Status/' + id).pipe();
  }
  public updateStatus(id: any,status: Status): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/Status/' + id,JSON.stringify(status), httpOptions).pipe();
  }

  // Role
  public getRole(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Role').pipe();
  }

  public getRoleByStatus(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Role/Status').pipe();
  }

  public addRole(Role: role): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/Role', JSON.stringify(Role), httpOptions).pipe();
  }

  public deleteRole(id: any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/Role/' + id).pipe();
  }

  public getRoleByid(id: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Role/' + id).pipe();
  }

  public getRoleListByid(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Role/list/'+id.toString()).pipe();
  }

  public updateRole(id: any,Role: role): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/Role/' + id,JSON.stringify(Role), httpOptions).pipe();
  }
  public getAllRole(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Role/All').pipe();
  }

  //userInfo
  public getUserInfo(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/UserInfo').pipe();
  }

  public addUserInfo(UserInfo: UserInfo): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/UserInfo', JSON.stringify(UserInfo), httpOptions).pipe();
  }

  public deleteUserInfo(id: any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/UserInfo/' + id).pipe();
  }

  public getUserInfoByid(id: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/UserInfo/' + id).pipe();
  }
  public updateUserInfo(id: any,UserInfo: UserInfo): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/UserInfo/' + id,JSON.stringify(UserInfo), httpOptions).pipe();
  }
  public getUserInfoByDate():Observable<any>{
    return this.http.get<any>(this.baseUrl + '/UserInfo/ByDate').pipe();
  }

  //userpermission
  public getUserPermission(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/UserPermission').pipe();
  }

  public addUserPermission(userpermission: userPermission): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/UserPermission', JSON.stringify(userpermission), httpOptions).pipe();
  }

  public deleteUserPermission(id: string): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/UserPermission/' + id).pipe();
  }

  public getUserPermissionByid(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/UserPermission/' + id).pipe();
  }
  public updateUserPermission(id: any,userpermission: userPermission): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/UserPermission/' + id,JSON.stringify(userpermission), httpOptions).pipe();
  }

  //RolePermission
  public getRolePermission(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/RolePermission').pipe();
  }

  public addRolePermission(Rolepermission: rolePermission): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/RolePermission', JSON.stringify(Rolepermission), httpOptions).pipe();
  }

  public deleteRolePermission(id: string): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/RolePermission/' + id).pipe();
  }

  public getRolePermissionByid(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/RolePermission/' + id).pipe();
  }

  public getRolePermissionByRoleid(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/RolePermission/role/' + id).pipe();
  }

  public updateRolePermission(id: any,Rolepermission: rolePermission): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/RolePermission/' + id,JSON.stringify(Rolepermission), httpOptions).pipe();
  }

  //module
  public getModule(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Module').pipe();
  }

  public addModule(Module: Module): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/Module', JSON.stringify(Module), httpOptions).pipe();
  }

  public deleteModule(id: string): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/Module/' + id).pipe();
  }

  public getModuleByid(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Module/' + id).pipe();
  }
  public updateModule(id: any,Module: Module): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/Module/' + id,JSON.stringify(Module), httpOptions).pipe();
  }
  //menu
  public getMenu(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Menu').pipe();
  }

  public addMenu(projectId:any,cellId:any,Menu: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/Menu/' + projectId + '&' + cellId, JSON.stringify(Menu), httpOptions).pipe();
  }

  public deleteMenu(id: string): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/Menu/' + id).pipe();
  }

  public getMenuByid(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Menu/' + id).pipe();
  }

  public getMenuByCid(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Menu/cid/' + id).pipe();
  }

  public getMenuByExcelCID(id : any) : Observable<any>{
    return this.http.get<any>(this.baseUrl + '/Menu/excelcid/' + id).pipe();
  }

  public getMenuByExcelPID(id : any) : Observable<any>{
    return this.http.get<any>(this.baseUrl + '/Menu/excelpid/' + id).pipe();
  }

  public getMenuByPid(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Menu/pid/' + id).pipe();
  }

  public updateMenu(id: any,Menu: Menu): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/Menu/' + id,JSON.stringify(Menu), httpOptions).pipe();
  }

  //Cell
  public getCell(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Cell').pipe();
  }

  public addCell(Cell: Cell): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/Cell', JSON.stringify(Cell), httpOptions).pipe();
  }

  public deleteCell(id: string): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/Cell/' + id).pipe();
  }

  public getCellByid(id: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Cell/' + id).pipe();
  }

  public getCellByPid(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Cell/project/' + id).pipe();
  }

  public updateCell(id: any,Cell: Cell): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/Cell/' + id,JSON.stringify(Cell), httpOptions).pipe();
  }

  //Graph report
  public getAllItemReports(id:string):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/Users/getReport/'+id).pipe();
  }
  //Save Excel
  public saveReport(result : any) : Observable<any>{
    return this.http.post<any>(this.baseUrl + '/ExportExcel/saveReport',result,httpOptions).pipe();
  }
}