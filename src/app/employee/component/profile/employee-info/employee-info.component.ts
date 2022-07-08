import { Component,ElementRef, ViewChild,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserImage } from 'src/app/model/image.model';
import { Employee } from 'src/app/model/employee.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styles: [`
  .relative {
    position: relative;
  }
  .button-reset {
    background: rgba(0,0,0,0);
    border: none;
    cursor: pointer;
    font-family: fa5-proxima-nova,"Helvetica Neue",Helvetica,Arial,sans-serif;
    margin: 0;
    padding: 0;
    transition: all .1s ease-in;
  }
  .right-1 {
    right: 1rem;
  }
  .db {
    display: block;
  }
  .absolute {
    position: absolute;
  }
  .o-60 {
    opacity: .6;
  }
  .color-inherit {
    color: inherit;
  }
  .center-v {
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  img {
    width: 100%!important;
    height: auto!important;
    object-fit:contain;
  }
  `
  ]
})
export class EmployeeInfoComponent implements OnInit {

  constructor(private services: PsolutionsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {
    this.route.params.subscribe(res => {
      this.id = res.id;
    });
    if (this.authenticationService.currentUserValue) {
      this.empdata = this.authenticationService.currentUserValue.data
      this.logid = this.authenticationService.currentUserValue.data.employeeId;
      this.clientid = this.authenticationService.currentUserValue.data.clientId;
    }
  }

  employeeform: FormGroup;
  id: number;
  save: boolean;
  edit: boolean;
  message: string;
  show: boolean;
  image:any;
  logid: any;
  clientid: number;
  hide : boolean = true;
  fileToUpload: File | null = null;
  public empdata: Data;
  passwordtitle : string;
  imagePath : any;
  @ViewChild('fileInput') fileInput: ElementRef;

  async ngOnInit(): Promise<void> {
    this.employeeform = this.formBuilder.group({
      id: [''],clientId:[''],clientCompany:[''],
      name : ['',Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required,Validators.minLength(6)]],
      pic:null
    })

    if (this.logid) {
      if(this.empdata.changePassword){
      this.save = false;
      this.edit = true;
      const result = await this.services.getEmployeeByid(this.logid).toPromise();
      this.f.pic.setValue('');
      this.f.email.setValue(result.email);
      this.f.password.setValue(result.password);
      this.f.name.setValue(result.name);
      await this.services.getEmpPicbyId(this.logid).toPromise().then(x=>{
        if(x.statusCode == 200){
          this.image =  'data:image/jpeg;base64,' + x.data.image;
        }
        else{
          this.image = '/assets/img/profile/profile-11.jpg';
        }
      });
    }
      else {
        this.router.navigate(['noauthorize']);
      }
    }
    else if (this.id === undefined) {
      this.save = true;
      this.edit = false;
    }
    this.show = false;
  }


  get f() { return this.employeeform.controls; }

  async onEdit(): Promise<void> {
    try {
      const model: Employee = {
        employeeId:this.logid,
        clientId: this.clientid,
        name:this.f.name.value,
        email: this.f.email.value,
        password: this.f.password.value,
        contactNo: this.empdata.contactNo,
        changePassword : this.empdata.changePassword,
        editProject : this.empdata.editProject,
        viewProject : this.empdata.viewProject
      };
      
      // stop here if form is invalid
      if (this.employeeform.invalid) {
        return;
      }
      const result = await this.services.updateEmployee(this.logid, model).toPromise();
      if (result.statusCode == 200) {
        await this.uploadFile();
        // var res = await this.services.getEmpPicbyId(this.logid).toPromise();
        // console.log(res);
        // if(res.statusCode == 200){
        //   this.image =  `${environment.Url}/image/`+ res.data.fileName;
        // }
        // else{
        //   this.image = '/assets/img/profile/profile-11.jpg';
        // }
        window.location.reload();
        this.message = result.message;
        console.log(this.message);
      }
    } catch (e) {
      console.log(e);
    }
  }

  viewpassword(){
    this.hide = !this.hide;
    if(!this.hide){
      this.passwordtitle = "Hide password";
      var p = document.getElementsByName('header_search_submit')[0].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z" fill="none"/><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>';
    }
    else{
      this.passwordtitle = "View password";
      var p = document.getElementsByName('header_search_submit')[0].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none" /><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>';
    }
  }

  handleFileInput(e: any) {
    const files = e.target.files;
    // If no file selected, return
    if (files.length === 0) return false;
  
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
        this.message = "Only images are supported.";
        return false;
    }
  
    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
        this.image = reader.result; 
    }
  
    if (files && files.length > 0) {
      this.fileToUpload = (e.target.files[0] as File);
      this.employeeform.get('pic').setValue(this.fileToUpload);
      console.log(this.employeeform.get('pic').value);
    }
  
    const file = (e.target as HTMLInputElement).files[0];
    this.employeeform.get('pic').updateValueAndValidity()
    
    // If no image selected, return
    if (!/^image\//.test(file.type)) {
        alert(`File ${file.name} is not an image.`);
        return false;
    }
    return true 
  }

  async uploadFile() : Promise<void> {
    const formModel = this.prepareSave();
    const model1: UserImage = {
      userid:this.logid,
      id: 0,
      file: formModel
    };

    await this.services.postEmpFile(this.logid,formModel).subscribe(x => {
       console.log(x);
       this.image = 'data:image/jpeg;base64,' + x.data.image;
       this.authenticationService.profileImageUpdate$.next(this.image);
      }, error => {
        console.log(error);
      });
  }



  onFileChange(event:any) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.employeeform.get('pic').setValue(file);
    }
  }

  private prepareSave(): any {
    let input = new FormData();
    input.append('file', this.employeeform.get('pic').value);
    return input;
  }

  onSubmit() {
    
    // this.http.post('apiUrl', formModel)
    setTimeout(() => {
      alert('done!');
    }, 1000);
  }

  clearFile() {
    this.employeeform.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
  }
  toggle:boolean=false;
  togglemenuclick(){
    this.toggle = !this.toggle;
    
  }
}

export class Data {
  employeeId: number;
  clientId: number;
  name : string;
  email:string;
  password : string;
  contactNo : string;
  id:any;
  role:role;
  changePassword: boolean;
  viewProject : boolean;
  editProject : boolean;
}
export class role{
  roleId : number;
  roleName: string;
}