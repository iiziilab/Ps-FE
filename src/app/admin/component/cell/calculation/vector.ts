export class vector{
    private _vectorLength: number = 0;
    public l_vector : number[] =[];
    private l_sum : number;

    constructor(vctorlength? : number,initial? : number) { 
        this._vectorLength = vctorlength;
        for (var i = 1; i <= vctorlength; i++)
                this.l_vector[i - 1] = initial;
                
    }
    // get Vector(){
    //     return this.l_vector;
    // }
    // set Vector(index:number){
    //     this.l_vector = this.l_vector[index];
    // }
    get VectorLength(){
        return this._vectorLength = this.l_vector.length;
    }
    getSum():number{
        this.l_sum = 0;
        for (var i = 1; i <= this.l_vector.length; i++)
            this.l_sum += this.l_vector[i - 1];
        return this.l_sum;
    }
    clone():vector {
        let length = this.VectorLength;
        var n:any = new vector(length-1,0);
        for (var i = 1; i <= length; i++)
            n[i - 1] = this.l_vector[i - 1];
        return n;
    }
    
    createVector(length:number,initial:any):vector{
        this.l_vector= [];
        let v:any = new vector(length, 0);
        for (var i = 1; i <= length; i++)
            v[i - 1] = initial;
        return v;
    }
}
export class vector1{
    private _vectorLength: number = 0;
    public l_vector : number[] =[];
    private l_sum : number;

    constructor(vctorlength? : number,initial? : number) { 
        this._vectorLength = vctorlength;
        for (var i = 1; i <= vctorlength; i++)
                this.l_vector[i - 1] = initial;
    }

    get VectorLength(){
        return this._vectorLength = this.l_vector.length;
    }

    getSum():number{
        this.l_sum = 0;
        for (var i = 1; i <= this.l_vector.length; i++)
            this.l_sum += this.l_vector[i - 1];
        return this.l_sum;
    }

    clone():vector{
        let length = this.VectorLength;
        var n:any = new vector(length-1,0);
        for (var i = 1; i <= length; i++)
            n[i - 1] = this.l_vector[i - 1];
        return n;
    }

    createVector(length:number,initial:any):vector{
        this.l_vector = [];
        let v:any = new vector(length, 0);
        for (var i = 1; i <= length; i++)
            v[i - 1] = initial;
        return v;
    }
}
export class vector2{
    private _vectorLength: number = 0;
    public l_vector : number[] =[];
    private l_sum : number;

    constructor(vctorlength? : number,initial? : number) { 
        this._vectorLength = vctorlength;
        for (var i = 1; i <= vctorlength; i++)
                this.l_vector[i - 1] = initial;
    }

    get VectorLength(){
        return this._vectorLength = this.l_vector.length;
    }

    getSum():number{
        this.l_sum = 0;
        for (var i = 1; i <= this.l_vector.length; i++)
            this.l_sum += this.l_vector[i - 1];
        return this.l_sum;
    }
    clone():vector{
        let length = this.VectorLength;
        var n:any = new vector(length-1,0);
        for (var i = 1; i <= length; i++)
            n[i - 1] = this.l_vector[i - 1];
        return n;
    }
    createVector(length:number,initial:any):vector{
        this.l_vector= [];
        let v:any = new vector(length, 0);
        for (var i = 1; i <= length; i++)
            v[i - 1] = initial;
        return v;
    }
}
export class vector3{
    private _vectorLength: number = 0;
    public l_vector : number[] =[];
    private l_sum : number;

    constructor(vctorlength? : number,initial? : number) { 
        this._vectorLength = vctorlength;
        for (var i = 1; i <= vctorlength; i++)
                this.l_vector[i - 1] = initial;
    }

    get VectorLength(){
        return this._vectorLength = this.l_vector.length;
    }
    getSum():number{
        this.l_sum = 0;
        for (var i = 1; i <= this.l_vector.length; i++)
            this.l_sum += this.l_vector[i - 1];
        return this.l_sum;
    }
    clone():vector{
        let length = this.VectorLength;
        var n:any = new vector(length-1,0);
        for (var i = 1; i <= length; i++)
            n[i - 1] = this.l_vector[i - 1];

        return n;
    }
    createVector(length:number,initial:any):vector{
        this.l_vector= [];

        let v:any = new vector(length, 0);
        for (var i = 1; i <= length; i++)
            v[i - 1] = initial;

        return v;
    }
}
export class vector4{
    private _vectorLength: number = 0;
    public l_vector : number[] =[];
    private l_sum : number;

    constructor(vctorlength? : number,initial? : number) { 
        this._vectorLength = vctorlength;
        for (var i = 1; i <= vctorlength; i++)
                this.l_vector[i - 1] = initial;
    }

    get VectorLength(){
        return this._vectorLength = this.l_vector.length;
    }
    getSum():number{
        this.l_sum = 0;
        for (var i = 1; i <= this.l_vector.length; i++)
            this.l_sum += this.l_vector[i - 1];
        return this.l_sum;
    }
    clone():vector{
        let length = this.VectorLength;
        var n:any = new vector(length-1,0);
        for (var i = 1; i <= length; i++)
            n[i - 1] = this.l_vector[i - 1];

        return n;
    }
    createVector(length:number,initial:any):vector{
        this.l_vector= [];

        let v:any = new vector(length, 0);
        for (var i = 1; i <= length; i++)
            v[i - 1] = initial;

        return v;
    }
}
export class vector5{
    private _vectorLength: number = 0;
    public l_vector : number[] =[];
    private l_sum : number;

    constructor(vctorlength? : number,initial? : number) { 
        this._vectorLength = vctorlength;
        for (var i = 1; i <= vctorlength; i++)
                this.l_vector[i - 1] = initial;
    }

    get VectorLength(){
        return this._vectorLength = this.l_vector.length;
    }
    getSum():number{
        
        this.l_sum = 0;
        for (var i = 1; i <= this.l_vector.length; i++)
            this.l_sum += this.l_vector[i - 1];
        return this.l_sum;
    }
    clone():vector{
        let length = this.VectorLength;
        var n:any = new vector(length-1,0);
        for (var i = 1; i <= length; i++)
            n[i - 1] = this.l_vector[i - 1];
        return n;
    }
    createVector(length:number,initial:any):vector{
        this.l_vector = [];
        let v:any = new vector(length, 0);
        for (var i = 1; i <= length; i++)
            v[i - 1] = initial;
        return v;
    }
}
export class vector6{
    private _vectorLength: number = 0;
    public l_vector : number[] =[];
    private l_sum : number;

    constructor(vctorlength? : number,initial? : number) { 
        this._vectorLength = vctorlength;
        for (var i = 1; i <= vctorlength; i++)
                this.l_vector[i - 1] = initial;
    }

    get VectorLength(){
        return this._vectorLength = this.l_vector.length;
    }
    getSum():number{
        this.l_sum = 0;
        for (var i = 1; i <= this.l_vector.length; i++)
            this.l_sum += this.l_vector[i - 1];
        return this.l_sum;
    }
    clone():vector{
        let length = this.VectorLength;
        var n:any = new vector(length-1,0);
        for (var i = 1; i <= length; i++)
            n[i - 1] = this.l_vector[i - 1];
        return n;
    }
    createVector(length:number,initial:any):vector{
        this.l_vector= [];

        let v:any = new vector(length, 0);
        for (var i = 1; i <= length; i++)
            v[i - 1] = initial;
        return v;
    }
}
export class vector7{
    private _vectorLength: number = 0;
    public l_vector : number[] =[];
    private l_sum : number;

    constructor(vctorlength? : number,initial? : number) { 
        this._vectorLength = vctorlength;
        for (var i = 1; i <= vctorlength; i++)
                this.l_vector[i - 1] = initial;
    }

    get VectorLength(){
        return this._vectorLength = this.l_vector.length;
    }
    getSum():number{
        this.l_sum = 0;
        for (var i = 1; i <= this.l_vector.length; i++)
            this.l_sum += this.l_vector[i - 1];
        return this.l_sum;
    }
    clone():vector{
        let length = this.VectorLength;
        var n:any = new vector(length-1,0);
        for (var i = 1; i <= length; i++)
            n[i - 1] = this.l_vector[i - 1];
        return n;
    }
    createVector(length:number,initial:any):vector{
        this.l_vector= [];
        let v:any = new vector(length, 0);
        for (var i = 1; i <= length; i++)
            v[i - 1] = initial;
        return v;
    }
}
export class vector8{
    private _vectorLength: number = 0;
    public l_vector : number[] =[];
    private l_sum : number;

    constructor(vctorlength? : number,initial? : number) { 
        this._vectorLength = vctorlength;
        for (var i = 1; i <= vctorlength; i++)
                this.l_vector[i - 1] = initial;
    }

    get VectorLength(){
        return this._vectorLength = this.l_vector.length;
    }
    getSum():number{
        this.l_sum = 0;
        for (var i = 1; i <= this.l_vector.length; i++)
            this.l_sum += this.l_vector[i - 1];
        return this.l_sum;
    }
    clone():vector{
        let length = this.VectorLength;
        var n:any = new vector(length-1,0);
        for (var i = 1; i <= length; i++)
            n[i - 1] = this.l_vector[i - 1];

        return n;
    }
    createVector(length:number,initial:any):vector{
        this.l_vector= [];

        let v:any = new vector(length, 0);
        for (var i = 1; i <= length; i++)
            v[i - 1] = initial;

        return v;
    }
}
export class vector9{
    private _vectorLength: number = 0;
    public l_vector : number[] =[];
    private l_sum : number;

    constructor(vctorlength? : number,initial? : number) { 
        this._vectorLength = vctorlength;
        for (var i = 1; i <= vctorlength; i++)
                this.l_vector[i - 1] = initial;
    }

    get VectorLength(){
        return this._vectorLength = this.l_vector.length;
    }
    getSum():number{
        this.l_sum = 0;
        for (var i = 1; i <= this.l_vector.length; i++)
            this.l_sum += this.l_vector[i - 1];
        return this.l_sum;
    }
    clone():vector{
        let length = this.VectorLength;
        var n:any = new vector(length-1,0);
        for (var i = 1; i <= length; i++)
            n[i - 1] = this.l_vector[i - 1];

        return n;
    }
    createVector(length:number,initial:any):vector{
        this.l_vector= [];

        let v:any = new vector(length, 0);
        for (var i = 1; i <= length; i++)
            v[i - 1] = initial;

        return v;
    }
}
export class vector10{
    private _vectorLength: number = 0;
    public l_vector : number[] =[];
    private l_sum : number;

    constructor(vctorlength? : number,initial? : number) { 
        this._vectorLength = vctorlength;
        for (var i = 1; i <= vctorlength; i++)
                this.l_vector[i - 1] = initial;
    }

    get VectorLength(){
        return this._vectorLength = this.l_vector.length;
    }
    getSum():number{
        this.l_sum = 0;
        for (var i = 1; i <= this.l_vector.length; i++)
            this.l_sum += this.l_vector[i - 1];
        return this.l_sum;
    }
    clone():vector{
        let length = this.VectorLength;
        var n:any = new vector(length-1,0);
        for (var i = 1; i <= length; i++)
            n[i - 1] = this.l_vector[i - 1];

        return n;
    }
    createVector(length:number,initial:any):vector{
        this.l_vector= [];

        let v:any = new vector(length, 0);
        for (var i = 1; i <= length; i++)
            v[i - 1] = initial;

        return v;
    }
}
export class vector11{
    private _vectorLength: number = 0;
    public l_vector : number[] =[];
    private l_sum : number;

    constructor(vctorlength? : number,initial? : number) { 
        this._vectorLength = vctorlength;
        for (var i = 1; i <= vctorlength; i++)
                this.l_vector[i - 1] = initial;
    }

    get VectorLength(){
        return this._vectorLength = this.l_vector.length;
    }
    getSum():number{
        this.l_sum = 0;
        for (var i = 1; i <= this.l_vector.length; i++)
            this.l_sum += this.l_vector[i - 1];
        return this.l_sum;
    }
    clone():vector{
        let length = this.VectorLength;
        var n:any = new vector(length-1,0);
        for (var i = 1; i <= length; i++)
            n[i - 1] = this.l_vector[i - 1];

        return n;
    }
    createVector(length:number,initial:any):vector{
        this.l_vector= [];

        let v:any = new vector(length, 0);
        for (var i = 1; i <= length; i++)
            v[i - 1] = initial;

        return v;
    }
}
export class vector12{
    private _vectorLength: number = 0;
    public l_vector : number[] =[];
    private l_sum : number;

    constructor(vctorlength? : number,initial? : number) { 
        this._vectorLength = vctorlength;
        for (var i = 1; i <= vctorlength; i++)
                this.l_vector[i - 1] = initial;
    }

    get VectorLength(){
        return this._vectorLength = this.l_vector.length;
    }
    getSum():number{
        this.l_sum = 0;
        for (var i = 1; i <= this.l_vector.length; i++)
            this.l_sum += this.l_vector[i - 1];
        return this.l_sum;
    }
    clone():vector{
        let length = this.VectorLength;
        var n:any = new vector(length-1,0);
        for (var i = 1; i <= length; i++)
            n[i - 1] = this.l_vector[i - 1];

        return n;
    }
    createVector(length:number,initial:any):vector{
        this.l_vector= [];

        let v:any = new vector(length, 0);
        for (var i = 1; i <= length; i++)
            v[i - 1] = initial;

        return v;
    }
}