import { NumberFormat } from "xlsx";

export class Alts {
    Default_Consideration_Set: boolean;
    Consideration_Set?: boolean;
    Default_Available:boolean=false;
    Available:boolean=false;
    Forced_In:boolean;
    Id:number;
    Include:boolean;
    ShortDescription:string;
    LongDescription:string;
    CategoryIndex:number;
    Category:string;
    Parm:string;
    ID_Model:number;
    Price:number=0;
    Rank_item:number=0;
    Rank_total_reach:number=0;
    Rank_inc_reach:number = 0;
    async copyFrom(target:Alts):Promise<void>{
        this.Available = target.Available;
        this.Forced_In = target.Forced_In;
        this.Consideration_Set = target.Consideration_Set;
        this.Include = target.Include;
        this.ShortDescription = target.ShortDescription;
        this.LongDescription = target.LongDescription;
        this.Id = target.Id;
        this.Category = target.Category;
        this.CategoryIndex = target.CategoryIndex;
        this.Parm = target.Parm;
        this.ID_Model = target.ID_Model;
        this.Price = target.Price;
        this.Default_Consideration_Set = target.Default_Consideration_Set;
        this.Default_Available = target.Default_Available;

        this.Rank_item = target.Rank_item;
        this.Rank_total_reach = target.Rank_total_reach;
        this.Rank_inc_reach = target.Rank_inc_reach;
    }
}