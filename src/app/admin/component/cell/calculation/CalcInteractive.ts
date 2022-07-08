import { Alts } from './Alt.model';
import { matrix, matrix1, matrix2, matrix3, matrix6 } from './matrix';
import { vector, vector1, vector10, vector11, vector12, vector2, vector3, vector4, vector5, vector6, vector7, vector8, vector9 } from './vector';

export class CalcInteractive {
    private l_num_iterations: number = 500;

    private l_data: matrix = new matrix(0, 0, 0);
    private l_seg: vector = new vector(0, 0);
    private l_weight: vector1 = new vector1(0, 0);
    private l_seg_index: number;
    private l_vol: matrix1 = new matrix1(0, 0, 0);
    private l_alts: Alts[] = [];

    private l_data_seg: matrix2 = new matrix2(0, 0, 0);
    private l_vol_seg: matrix3 = new matrix3(0, 0, 0);
    private l_weight_seg: vector2 = new vector2(0, 0);
  
    //intArr: any = [];  
    private l_number_of_saved_combos: number = 500;
    constructor(private alts: Alts[],
        private data: matrix,
        private data1: matrix6,
        private vol: matrix1,
        private weight: vector1,
        private seg: vector,
        private seg_index: number,
        private number_of_saved_combos: number,
        private threshold: number,
        private itemStr: any = [],) {
        // set up a copy of alts
        let intArr = [];
        let single = 0;
        for (var i = 1; i <= alts.length; i++) {
            var a: Alts = new Alts();
            a.copyFrom(alts[i - 1]);
            this.l_alts.push(a);
        }
        let arrTest: any =  [];
        arrTest = itemStr;
       // console.log(41,itemStr);
        
        // for (var i = 1; i <= itemStr.length; i++) {
        //     const ob = {
        //         id: itemStr[i-1], value: itemStr[i-1]
        //     };
        //     arrTest.push(ob);
        // }
        // arrTest.sort(function(a: any, b: any){return b.value - a.value});
        //Set up a copy of data
        this.l_data = data;
        this.l_vol = vol;
        //debugger
        //recode data to binary
        // for (var i = 1; i <= this.l_data.rowCount; i++) {
        //         for (var j = 1; j <= this.l_data.columnCount; j++) {
        //                 if (data._matrix[i - 1][j - 1] >= threshold){
        //                     this.l_data._matrix[i - 1][j - 1] = 1;
        //                 }
        //                 else{
        //                     this.l_data._matrix[i - 1][j - 1] = 0;
        //                 }
        //         }
        // }
     
        let n1 = 0;
        for (var i = 1; i <= this.l_data.rowCount; i++){
            for (var j = 1; j <= this.l_data.columnCount; j++){
                var filter_array = arrTest.find((x:any) => x.value == j);
                if(filter_array == undefined){
                    n1 = 100;
                }else{
                    n1 = filter_array.value;
                }
                if (data1._matrix[i - 1][j - 1] >= threshold && j == n1){
                    this.l_data._matrix[i - 1][j - 1] = 1;
                }
                else{
                    this.l_data._matrix[i - 1][j - 1] = 0;
                }
            }
        }
        
        //console.log(50,this.l_data._matrix);
        this.l_seg = seg;
        this.l_weight = weight;
        this.l_seg_index = seg_index;
        //changes
        this.l_data_seg = new matrix2(this.l_data.rowCount, this.l_data.columnCount, 0);
        this.l_vol_seg = new matrix3(this.l_vol.rowCount, this.l_vol.columnCount, 0);
        this.l_weight_seg = new vector2(this.l_weight.VectorLength+1, 0);
        for (var i = 1; i <= this.l_data.rowCount; i++) {
            for (var j = 1; j <= this.l_data.columnCount; j++) {
                this.l_data_seg._matrix[i - 1][j - 1] = this.l_data._matrix[i - 1][j - 1] * this.l_seg.l_vector[i - 1];
                this.l_vol_seg._matrix[i - 1][j - 1] = this.l_vol._matrix[i - 1][j - 1] * this.l_seg.l_vector[i - 1];
            }
            this.l_weight_seg.l_vector[i - 1] = this.l_weight.l_vector[i - 1] * this.l_seg.l_vector[i - 1];
        }
    }


    increment_res : any[] = [];
    ary:any = [];
    CalculateParallel(num_chosen: number, allow_fixed_items: boolean): any[] {
        var results : any[] =[];
        let total_num_iteration: number;
        //if(num_chosen > 8){}
        for(let num = 1; num <=num_chosen; num++){
        var start_time = new Date();
        var end_time = new Date();
        var res = [];
        let i: number = 0;
        let j: number = 0;
        let k: number = 0; 

        let final_reach: any[] = [];
        let final_combination: any[] = [];
        let final_freq: any[] = [];
        let final_vol: any[] = [];

        let variable_list: number[] = [];
        let variable_list_start: number[] = [];
        let variable_label_list: string[] = [];
        let variable_label_list_start: string[] = [];

        let fixed_list: number[] = [];
        let fixed_list_start: number[] = [];
        let fixed_label_list: string[] = [];
        let fixed_label_list_start: string[] = [];

        // ***********************************************************
        // Start DR Changes

        let num_forced_in: number = 0;
        for (i = 1; i <= this.l_alts.length; i++) {
            if (this.l_alts[i - 1].Forced_In)
                num_forced_in += 1;
        }

        if (num <= num_forced_in && allow_fixed_items == false) {
            // include the forced in items in the consideration set, but not forced in set
            for (i = 1; i <= this.l_alts.length; i++) {
                if (this.l_alts[i - 1].Forced_In) {
                    variable_list.push(i);
                    variable_label_list.push(this.l_alts[i - 1].ShortDescription);
                }
            }
        }
        else
            for (i = 1; i <= this.l_alts.length; i++) {
                if (this.l_alts[i - 1].Forced_In) {
                    fixed_list.push(i);
                    fixed_label_list.push(this.l_alts[i - 1].ShortDescription);
                }
                else if (this.l_alts[i - 1].Consideration_Set) {
                    variable_list.push(i);
                    variable_label_list.push(this.l_alts[i - 1].ShortDescription);
                }
            }
        // end find me dr removed on 4/16/20 (after project submitted)
        // ***********************************************************

        let has_fixed: boolean = false;
        if (fixed_list.length > 0)
            has_fixed = true;
        let num_to_solve: number = 0;

        if (num <= fixed_list.length) {
            // Treat all fixed as variable and only show the num_chosen in the results
            variable_list = fixed_list;
            variable_label_list = fixed_label_list;
            num_to_solve = num;
        }
        else if (num > fixed_list.length)
            // Subtract the fixed from the number chosen
            num_to_solve = num - fixed_list.length;
        // Dim numCombo As Long = CLng(Extreme.Mathematics.SpecialFunctions.Combinatorics.Combinations(variable_list.Count, num_to_solve))
        var numCombo: number = this.combinations(variable_list.length, num_to_solve);
        // ***********************************************************************************
        // Loop over the interations
        // ***********************************************************************************

        let combination_index: number[] = new Array(num_to_solve - 1 + 1);
        let combination_values: number[] = new Array(num_to_solve - 1 + 1);
        let combination_labels: string[] = new Array(num_to_solve - 1 + 1);
        let i_loop: number = 0;

        for (var i_iterations = 1; i_iterations <= numCombo; i_iterations += this.l_num_iterations) {
            // This i_iterations step l_num_iterations is to prevent memory errors. 
            // It chuncks the problem up
            // But I don't know why I used the step // but i am correcting the num_iterations below. 
            // It is a bit confusing and i could clean it up.  

            i_loop += 1;
            let reach_list: number[] = [];
            let combination_list: number[][] = [];
            let combination_label_list: string[][] = [];

            // ***********************************************************************************
            // Get 10 combinations
            // ***********************************************************************************

            let num_iterations: number;
            if (i_loop * this.l_num_iterations >= numCombo)
                // Stop
                num_iterations = (numCombo - (i_loop - 1) * this.l_num_iterations);
            else
                num_iterations = this.l_num_iterations;
            total_num_iteration = num_iterations
            for (i = 1; i <= num_iterations; i++) {
                let res_combo = [];
                res_combo = this.getNextCombination(variable_list.length, num_to_solve, combination_index, variable_list, variable_label_list);
                // res_combo is an arrayList of arrays
                // we want to push the fixed items to those arrays
                let xcombination_index: number[] = new Array(num - 1 + 1);
                let xcombination_values: number[] = new Array(num - 1 + 1);
                let xcombination_labels: string[] = new Array(num - 1 + 1);
                k = 0;
                for (j = 1; j <= num; j++) // fixed_list.Count + res_combo(0).length
                {
                    if (j <= fixed_list.length) {
                        xcombination_index[j - 1] = j;
                        xcombination_values[j - 1] = fixed_list[j - 1];
                        xcombination_labels[j - 1] = this.l_alts[fixed_list[j - 1] - 1].ShortDescription;
                    }
                    else {
                        k += 1;
                        xcombination_index[j - 1] = (res_combo[0])[k - 1];//i
                        xcombination_values[j - 1] = (res_combo[1])[k - 1];
                        xcombination_labels[j - 1] = (res_combo[2])[k - 1];
                    }
                }
                combination_list.push(xcombination_values);
                combination_label_list.push(xcombination_labels);
            }

            // ***********************************************************************************
            // Run each combination on its own thread
            // *********************************************************************************** 

            let res_batch: any[] = [];
            let res_batch1: any[] = [];
            for (var x = 1; x <= combination_list.length; x++) {
                let xcopy: number = x;
                let xcombo: number[] = [...combination_list[xcopy - 1]]; //create shallow copy 
                let xcombo_label: string[] = [...combination_label_list[xcopy - 1]];
                let inc : any[] = [];
                res_batch.push(this.calculate_turf(num, xcombo, xcombo_label));
            }

            // let xreach_list: number[] = [];
            // let xcombo_list: string[][] = []; //check here
            // let xincrement_list : number[][] = [];
            // let xfreq_list: number[] = [];
            // let xvol_list: number[] = [];

            let xreach_list: number[] = [];
            let xcombo_list: string[][] = []; //check here
            let xincrement_list : number[][] = [];
            let xfreq_list: number[] = [];
            let xvol_list: number[] = [];
          
            for (var x = 1; x <= combination_list.length; x++) {
                xreach_list.push(res_batch[x - 1][0]);
                xcombo_list.push(res_batch[x - 1][1]);
                xfreq_list.push(res_batch[x - 1][3]);
                xvol_list.push(res_batch[x - 1][4]);
            }

            // ***********************************************************************************
            // Combine each combination in a list
            // ***********************************************************************************

            for (i = 1; i <= num_iterations; i++)
                this.InsertIntoResults(this.l_number_of_saved_combos, xreach_list[i - 1], final_reach,
                     xcombo_list[i - 1], final_combination, xfreq_list[i - 1], final_freq, xvol_list[i - 1],
                      final_vol);
            }

        // ***********************************************************************************
        // Report
        // ***********************************************************************************
        // let scombo: string = "";
        // for (i = 1; i <= num_chosen; i++) {
        //     if (i == num_chosen)
        //         scombo += (final_combination[0])[i - 1];
        //     else
        //         scombo += (final_combination[0])[i - 1] + ", ";
        // }

        let elapsed_time: number = Math.floor((new Date().getTime() - start_time.getTime())/1000 % 60);

        // res.push(num);
        // res.push(final_reach);
        // res.push(final_combination);
        // res.push(final_freq);
        // res.push(final_vol);
        // res.push(fixed_list.length);
        // results.push(res);
        res.push(final_reach);
        res.push(final_combination);
        res.push(final_freq);
        res.push(final_vol);
        results.push(res);
      }
      return results;
    }

    CalculateParallel1(items: any,items1: any,allow_fixed_items:boolean): any[] {
        var results : any[] =[];
        let total_num_iteration: number;
        for(let num = 1; num <= items; num++){
        var res = [];
        let i: number = 0;
        let j: number = 0;
        let k: number = 0; 

        let final_reach: any[] = [];
        let final_combination: any[] = [];
        let final_freq: any[] = [];
        let final_vol: any[] = [];

        let variable_list: number[] = [];
        let variable_list_start: number[] = [];
        let variable_label_list: string[] = [];
        let variable_label_list_start: string[] = [];

        let fixed_list: number[] = [];
        let fixed_list_start: number[] = [];
        let fixed_label_list: string[] = [];
        let fixed_label_list_start: string[] = [];

        // ***********************************************************
        // Start DR Changes

        let num_forced_in: number = 0;
        for (i = 1; i <= this.l_alts.length; i++) {
            if (this.l_alts[i - 1].Forced_In)
                num_forced_in += 1;
        }

        if (num <= num_forced_in && allow_fixed_items == false) {
            // include the forced in items in the consideration set, but not forced in set
            for (i = 1; i <= this.l_alts.length; i++) {
                if (this.l_alts[i - 1].Forced_In) {
                    variable_list.push(i);
                    variable_label_list.push(this.l_alts[i - 1].ShortDescription);
                }
            }
        }
        else
            for (i = 1; i <= this.l_alts.length; i++) {
                if (this.l_alts[i - 1].Forced_In) {
                    fixed_list.push(i);
                    fixed_label_list.push(this.l_alts[i - 1].ShortDescription);
                }
                else if (this.l_alts[i - 1].Consideration_Set) {
                    variable_list.push(i);
                    variable_label_list.push(this.l_alts[i - 1].ShortDescription);
                }
            }
        //end find me dr removed on 4/16/20 (after project submitted)
        //***********************************************************

        let has_fixed: boolean = false;
        if (fixed_list.length > 0)
            has_fixed = true;

        let num_to_solve: number = 0;

        if (num <= fixed_list.length) {
            // Treat all fixed as variable and only show the num_chosen in the results
            variable_list = fixed_list;
            variable_label_list = fixed_label_list;
            num_to_solve = num;
        }

        else if (num > fixed_list.length)
            // Subtract the fixed from the number chosen
            num_to_solve = num - fixed_list.length;

        // Dim numCombo As Long = CLng(Extreme.Mathematics.SpecialFunctions.Combinatorics.Combinations(variable_list.Count, num_to_solve))
        var numCombo: number = this.combinations(variable_list.length, variable_list.length);
        // ***********************************************************************************
        // Loop over the interations
        // ***********************************************************************************

        let combination_index: number[] = new Array(num_to_solve - 1 + 1);
        let combination_values: number[] = new Array(num_to_solve - 1 + 1);
        let combination_labels: string[] = new Array(num_to_solve - 1 + 1);
        let i_loop: number = 0;

        for (var i_iterations = 1; i_iterations <= numCombo; i_iterations += this.l_num_iterations) {

            i_loop += 1;
            let reach_list: number[] = [];
            let combination_list: number[][] = [];
            let combination_label_list: string[][] = [];

            // ***********************************************************************************
            // Get 10 combinations
            // *********************************************************************************** 

            let num_iterations: number;
            if (i_loop * this.l_num_iterations >= numCombo)
                // Stop
                num_iterations = (numCombo - (i_loop - 1) * this.l_num_iterations);
            else
                num_iterations = this.l_num_iterations;

            total_num_iteration = num_iterations
            for (i = 1; i <= num_iterations; i++) {
                let res_combo = [];

                res_combo = this.getNextCombination(variable_list.length, num_to_solve, combination_index, variable_list, variable_label_list);

                //res_combo is an arrayList of arrays
                //we want to push the fixed items to those arrays

                let xcombination_index: number[] = new Array(num - 1 + 1);
                let xcombination_values: number[] = new Array(num - 1 + 1);
                let xcombination_labels: string[] = new Array(num - 1 + 1);

                k = 0;
                for (j = 1; j <= num; j++) // fixed_list.Count + res_combo(0).length
                {
                    if (j <= fixed_list.length) {
                        xcombination_index[j - 1] = j;
                        xcombination_values[j - 1] = fixed_list[j - 1];
                        xcombination_labels[j - 1] = this.l_alts[fixed_list[j - 1] - 1].ShortDescription;
                    }
                    else {
                        k += 1;
                        xcombination_index[j - 1] = (res_combo[0])[k - 1]; //i
                        xcombination_values[j - 1] = (res_combo[1])[k - 1];
                        xcombination_labels[j - 1] = (res_combo[2])[k - 1];
                    }
                }
                combination_list.push(xcombination_values);
                combination_label_list.push(xcombination_labels);
            }

            // ***********************************************************************************
            // Run each combination on its own thread
            // ***********************************************************************************

            let res_batch: any[] = [];
            for (var x = 1; x <= combination_list.length; x++) {
                let xcopy: number = x;
                let xcombo: number[] = [...combination_list[xcopy - 1]]; //create shallow copy 
                let xcombo_label: string[] = [...combination_label_list[xcopy - 1]];
                res_batch.push(this.calculate_turf(num, xcombo, xcombo_label));
            }

            let xreach_list: number[] = [];
            let xcombo_list: string[][] = []; //check here
            let xfreq_list: number[] = [];
            let xvol_list: number[] = [];

            for (var x = 1; x <= combination_list.length; x++) {
                xreach_list.push(res_batch[x - 1][0]);
                xcombo_list.push(res_batch[x - 1][1]);
                xfreq_list.push(res_batch[x - 1][3]);
                xvol_list.push(res_batch[x - 1][4]);
            }
            // ***********************************************************************************
            // Combine each combination in a list
            // ***********************************************************************************
            for (i = 1; i <= num_iterations; i++)
                this.InsertIntoResults(this.l_number_of_saved_combos, xreach_list[i - 1], final_reach,
                     xcombo_list[i - 1], final_combination, xfreq_list[i - 1], final_freq, xvol_list[i - 1],
                      final_vol);
            }
            // let arrTest: any =  [];
            // for (var i1 = 1; i1 <= items1.length; i1++) {
            //     const ob = {
            //         id: items1[i1-1], value: items1[i1-1]
            //     };
            //     arrTest.push(ob);
            // }
            // var filter_array = arrTest.find((x:any) => x.id == num);
            //if(num-1 == 19){
                res.push(final_reach);
                res.push(final_combination);
                res.push(final_freq);
                res.push(final_vol);
                results.push(res);
            //}
      }
      return results;
    }
   
    public calculate_turf(num_chosen: number, xcombo: number[], xcombo_label: string[]): any[] {
        let res_batch: any[] = [];

        let v_combined: vector3 = new vector3(this.l_weight.VectorLength, 0);
        let v_combined_vol: vector4 = new vector4(this.l_weight.VectorLength, 0);

        let v_wt: vector5 = new vector5(this.l_weight.VectorLength, 0);
        let v_wt_vol: vector6 = new vector6(this.l_weight.VectorLength, 0);
        let v_wt_freq: vector7 = new vector7(this.l_weight.VectorLength, 0);

        let icol: number;
        for (var j1 = 1; j1 <= num_chosen; j1++) {
            icol = xcombo[j1 - 1]; // - 1
            for (var i = 1; i <= this.l_weight.VectorLength; i++) {
                v_combined.l_vector[i - 1] += this.l_data_seg._matrix[i - 1][icol - 1];
                v_combined_vol.l_vector[i - 1] += this.l_vol_seg._matrix[i - 1][icol - 1];
            }
        }

        for (var j1 = 1; j1 <= v_wt.VectorLength; j1++) {
            v_wt.l_vector[j1 - 1] = v_combined.l_vector[j1 - 1] == 0 ? 0 : this.l_weight_seg.l_vector[j1 - 1];
            v_wt_freq.l_vector[j1 - 1] = v_combined.l_vector[j1 - 1] == 0 ? 0 : this.l_weight_seg.l_vector[j1 - 1] * v_combined.l_vector[j1 - 1];
            v_wt_vol.l_vector[j1 - 1] = v_combined.l_vector[j1 - 1] == 0 ? 0 : this.l_weight_seg.l_vector[j1 - 1] * v_combined_vol.l_vector[j1 - 1];
        }

        // reach = sum(weights[reached]) / sum(weights), 
        // where an individual Is considered "reached" If the reach criterion Is met For at least the number Of items indicated by the depth argument In turf.args. See Markowitz (2005) For a more detailed explanation Of depth Of reach.
        // Frequency = sum(weights x items_reached) / sum(weights). 
        // Frequency includes all individuals, whether reached Or Not. Frequency among "reached" individuals may be calculated As Frequency / Reach regardless Of weights.

        let reach: number = 0;
        let vol: number = 0;
        let freq: number = 0;
      
        reach = v_wt.getSum() / this.l_weight_seg.getSum();
        freq = v_wt_freq.getSum() / this.l_weight_seg.getSum();
        vol = v_wt_vol.getSum() / this.l_weight_seg.getSum() / 1; // DIVIDE_VOL
        
        if (Number.isNaN(reach))
            reach = 0;
        if (Number.isNaN(freq))
            freq = 0;
        if (Number.isNaN(vol))
            vol = 0;

        let num_in_batch: number = 0;
        num_in_batch = res_batch.length;
        if (num_in_batch > 1) {
            if (parseInt(res_batch[num_in_batch - 1]) == reach) { }
        }

        res_batch.push(reach);
        res_batch.push(xcombo_label);
        res_batch.push(xcombo);
        res_batch.push(freq);
        res_batch.push(vol);
        return res_batch;
    }

    pushToAry(name:string, val:number) {
        var obj: any= {};
        obj[name] = val;
        this.ary.push(obj);
    }

    private factorial(n: number): number {
        // 5! = 5*4*3*2*1.
        let fact: number = 0;
        fact = 1;
        if (n <= 1) {
        }
        else
            for (var i = n; i >= 1; i += -1)
                fact *= i;
        return fact;
    }

    private combinations(n: number, k: number): number {
        // n! / (k!(n-k)!
        let combin: number = 0;
        combin = (this.factorial(n) / (this.factorial(k) * this.factorial(n - k)));
        return Math.trunc(combin);
    }

    private getNextCombination(number_of_items: number, number_chosen: number, combination: number[], variable_list: number[], variable_label_list: string[]): any[] {
        let res: any[] = [];
        let index: number;
        let valid: boolean = true;

        if (combination.length == 0) {
            res.push(number_of_items);
            res.push(number_chosen);
            res.push(combination);
            return res;
        }

        if (combination[0] === undefined) {
            for (let i = 1; i <= combination.length; i++)
                combination[i - 1] = i;
        }
        else {
            try {
                index = number_chosen;
                while (combination[index - 1] == number_of_items + index - number_chosen && index > 0)
                    index -= 1;
                if (index == 0) {
                    res.push(number_of_items);
                    res.push(number_chosen);
                    res.push(combination);
                }
                combination[index - 1] += 1;
                index += 1;
                while (index <= number_chosen) {
                    combination[index - 1] = combination[index - 2] + 1;
                    index += 1;
                }
            }
            catch (Exception) {
                //MsgBox(ex.Message)
                valid = false;
            }
        }

        let combination_values: number[] = new Array(number_chosen - 1 + 1);
        let combination_labels: string[] = new Array(number_chosen - 1 + 1);
        //let increment_value : number
        for (var i = 1; i <= combination.length; i++) {
            combination_values[i - 1] = variable_list[combination[i - 1] - 1];
            combination_labels[i - 1] = variable_label_list[combination[i - 1] - 1];
        }

        res.push(combination);
        res.push(combination_values);
        res.push(combination_labels);
        return res;
    }

    private InsertIntoResults(NUMBER_OF_SAVED_COMBOS: number, reach: number, reach_list: any[],
        combo: string[], combo_list: any[], freq: number, freq_list: any[], vol: number, vol_list: any[]): any[] {
        let res: any[] = [];

        if (reach_list.length == 0) {
            reach_list.push(reach);
            combo_list.push(combo);
            freq_list.push(freq);
            vol_list.push(vol);

            res.push(reach);
            res.push(reach_list);
            res.push(combo);
            res.push(combo_list);
            res.push(freq);
            res.push(freq_list);
            res.push(vol);
            res.push(vol_list);
            return res;
        }

        let label: string[] = null;
        let label_list: any[] = null;

        let start_size: number = reach_list.length;

        let list_val: number;
        let valid: boolean = false;

        if (reach < reach_list[start_size - 1] && start_size >= NUMBER_OF_SAVED_COMBOS) {
            res.push(reach);
            res.push(reach_list);
            res.push(combo);
            res.push(combo_list);

            res.push(freq);
            res.push(freq_list);
            res.push(vol);
            res.push(vol_list);
            return res;
        }

        for (var i = 1; i <= reach_list.length; i++) {
            list_val = reach_list[i - 1];

            if (reach > list_val) {
                reach_list.splice(i - 1, 0, reach);

                combo_list.splice(i - 1, 0, combo);

                freq_list.splice(i - 1, 0, freq);
                vol_list.splice(i - 1, 0, vol);
                valid = true;
                break;
            }
        }

        if (reach_list.length < NUMBER_OF_SAVED_COMBOS && valid == false) {
            reach_list.push(reach);
            combo_list.push(combo);
            freq_list.push(freq);
            vol_list.push(vol);
        }

        if (reach_list.length > NUMBER_OF_SAVED_COMBOS) {
            reach_list.splice(NUMBER_OF_SAVED_COMBOS, 1);
            combo_list.splice(NUMBER_OF_SAVED_COMBOS, 1);
            freq_list.splice(NUMBER_OF_SAVED_COMBOS, 1);
            vol_list.splice(NUMBER_OF_SAVED_COMBOS, 1);
        }

        res.push(reach);
        res.push(reach_list);
        res.push(combo);
        res.push(combo_list);
        res.push(freq);
        res.push(freq_list);
        res.push(vol);
        res.push(vol_list);
        return res;
    }
}
interface KeyValuePair {
    key: string;
    value: string;
}