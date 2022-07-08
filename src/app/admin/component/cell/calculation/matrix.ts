export class matrix {
    constructor(row?: any,column?:any,initial?:number) {
        this._rowCount = row;
        this._colCount = column;
        this._matrix =[];
        for (var i = 1; i <= row; i++)
        {
            this._matrix[i-1] = [];
            for (var j = 1; j <= column; j++){
                this._matrix[i - 1][j - 1] = initial;
            }
        }
    }

    private _rowCount: number;
    private _colCount: number;
    private _column : number[] = [];
    public _matrix : number[][] = [];
    
    public get Column() : number[] {
        for (var i = 1; i <= this.rowCount; i++){
            this._column[i - 1] = this._matrix[i - 1][0];
        }
        return this._column;
    }
    
    public set Column(v : number[]) {
        this._column = v;
    }

    get rowCount() {
        return this._rowCount;
    }
    // set rowCount(row: number) {
    //     this._rowCount = row;  
    // }

    get columnCount() {
        return this._colCount;
    }

    // set columnCount(column: number) {
    //     this._colCount = column;  
    // }
    // get Matrix() {
    //     return this._matrix=[this.rowCount][this.columnCount];
    // }
    // set Matrix(row: number,column:number) {
    //     this._matrix = [row][column];  
    // }

    create(num_rows:number, num_cols:number, initial_value:number):any
    {
        this._matrix = [];
        for (var i = 1; i <= num_rows; i++)
        {
            for (var j = 1; j <= num_cols; j++)
                this._matrix[i - 1][j - 1] = initial_value;
        }
    }
    clone(num_rows:number, num_cols:number):matrix{
        let n:any;
        n = [num_rows][num_cols];
        for (var i = 1; i <= num_rows; i++)
        {
            for (var j = 1; j <= num_cols; j++)
                n[i - 1][j - 1] = this._matrix[i - 1][j - 1];
        }
        return n;
    }
}

export class matrix1 {
    constructor(row?: any,column?:any,initial?:number) {
        this._rowCount = row;
        this._colCount = column;
        this._matrix =[];
        for (var i = 1; i <= row; i++)
        {
            this._matrix[i-1] = [];
            for (var j = 1; j <= column; j++)
                this._matrix[i - 1][j - 1] = initial;
        }
    }

    private _rowCount: number = 0;
    private _colCount: number = 0;
    private _column : number[] = [];
    public _matrix : number[][]=[];

    public get Column() : number[] {
        for (var i = 1; i <= this.rowCount; i++){
            this._column[i - 1] = this._matrix[i - 1][0];
        }
        return this._column
    }
    
    public set Column(v : number[]) {
        this._column = v;
    }

    get rowCount() : number {
        return this._rowCount;
    }

    // set rowCount(row: number) {
    //     this._rowCount = row;  
    // }

    get columnCount() : number {
        return this._colCount;
    }
    // set columnCount(column: number) {
    //     this._colCount = column;  
    // }
    
    // get this() : number[][] {
    //     return this._matrix;
    // }
    
    // set this(index_row : number,index_col : number) {
    //     this._matrix[index_row][index_col] = v;
    // }
   
    // get Matrix() : number[][] {
    //     return this._matrix;
    // }
    // set Matrix(row: number,column :number):number[][] {
    //     this._matrix = [row][column];  
    // }

    create(num_rows: number, num_cols: number, initial_value: number):any
    {
        this._matrix = [];

        for (var i = 1; i <= num_rows; i++)
        {
            for (var j = 1; j <= num_cols; j++)
                this._matrix[i - 1][j - 1] = initial_value;
        }
    }
    clone(num_rows:number, num_cols:number):matrix{
        let n:any;
        n = [num_rows][num_cols];
        for (var i = 1; i <= num_rows; i++)
        {
            for (var j = 1; j <= num_cols; j++)
                n[i - 1][j - 1] = this._matrix[i - 1][j - 1];
        }

        return n;
    }
}
export class matrix2 {
    constructor(row?: any,column?:any,initial?:number) {
        this._rowCount = row;
        this._colCount = column;
        this._matrix =[];
        for (var i = 1; i <= row; i++)
        {
            this._matrix[i-1] = [];
            for (var j = 1; j <= column; j++)
                this._matrix[i - 1][j - 1] = initial;
        }
    }

    private _rowCount: number = 0;
    private _colCount: number = 0;
    private _column : number[] = [];
    public _matrix : number[][]=[];

    
    public get Column() : number[] {
        for (var i = 1; i <= this.rowCount; i++){
            this._column[i - 1] = this._matrix[i - 1][0];
        }
        return this._column
    }
    
    public set Column(v : number[]) {
        this._column = v;
    }
    
    get rowCount() : number {
        return this._rowCount;
    }

    get columnCount() : number {
        return this._colCount;
    }
}
export class matrix3 {
    constructor(row?: any,column?:any,initial?:number) {
        this._rowCount = row;
        this._colCount = column;
        this._matrix =[];
        for (var i = 1; i <= row; i++)
        {
            this._matrix[i-1] = [];
            for (var j = 1; j <= column; j++)
                this._matrix[i - 1][j - 1] = initial;
        }
    }

    private _rowCount: number = 0;
    private _colCount: number = 0;
    private _column : number[] = [];
    public _matrix : number[][]=[];

    
    public get Column() : number[] {
        for (var i = 1; i <= this.rowCount; i++){
            this._column[i - 1] = this._matrix[i - 1][0];
        }
        return this._column
    }
    
    public set Column(v : number[]) {
        this._column = v;
    }
    
    get rowCount() : number {
        return this._rowCount;
    }

    get columnCount() : number {
        return this._colCount;
    }
}
export class matrix4 {
    constructor(row?: any,column?:any,initial?:number) {
        this._rowCount = row;
        this._colCount = column;
        this._matrix =[];
        for (var i = 1; i <= row; i++)
        {
            this._matrix[i-1] = [];
            for (var j = 1; j <= column; j++)
                this._matrix[i - 1][j - 1] = initial;
        }
    }

    private _rowCount: number = 0;
    private _colCount: number = 0;
    private _column : number[] = [];
    public _matrix : number[][]=[];

    
    public get Column() : number[] {
        for (var i = 1; i <= this.rowCount; i++){
            this._column[i - 1] = this._matrix[i - 1][0];
        }
        return this._column
    }
    
    public set Column(v : number[]) {
        this._column = v;
    }
    
    get rowCount() : number {
        return this._rowCount;
    }

    get columnCount() : number {
        return this._colCount;
    }
}

export class matrix6 {
    constructor(row?: any,column?:any,initial?:number) {
        this._rowCount = row;
        this._colCount = column;
        this._matrix =[];
        for (var i = 1; i <= row; i++)
        {
            this._matrix[i-1] = [];
            for (var j = 1; j <= column; j++){
                this._matrix[i - 1][j - 1] = initial;
            }
        }
    }

    private _rowCount: number;
    private _colCount: number;
    private _column : number[] = [];
    public _matrix : number[][] = [];
    
    public get Column() : number[] {
        for (var i = 1; i <= this.rowCount; i++){
            this._column[i - 1] = this._matrix[i - 1][0];
        }
        return this._column;
    }
    
    public set Column(v : number[]) {
        this._column = v;
    }

    get rowCount() {
        return this._rowCount;
    }
    // set rowCount(row: number) {
    //     this._rowCount = row;  
    // }

    get columnCount() {
        return this._colCount;
    }

    // set columnCount(column: number) {
    //     this._colCount = column;  
    // }
    // get Matrix() {
    //     return this._matrix=[this.rowCount][this.columnCount];
    // }
    // set Matrix(row: number,column:number) {
    //     this._matrix = [row][column];  
    // }

    create(num_rows:number, num_cols:number, initial_value:number):any
    {
        this._matrix = [];
        for (var i = 1; i <= num_rows; i++)
        {
            for (var j = 1; j <= num_cols; j++)
                this._matrix[i - 1][j - 1] = initial_value;
        }
    }
    clone(num_rows:number, num_cols:number):matrix{
        let n:any;
        n = [num_rows][num_cols];
        for (var i = 1; i <= num_rows; i++)
        {
            for (var j = 1; j <= num_cols; j++)
                n[i - 1][j - 1] = this._matrix[i - 1][j - 1];
        }
        return n;
    }
}