
export class Myutxos {
    public a: any = [];
    public target: any;
    public totalvalue: any;
    public completecase1: any;
    public completecase2: any;
    public completecase4_1: any;
    public completecase5_1: any;
    public solevalue: any;
    public case4count: any;
    public case5count: any;
    public case4comcount: any;
    public finaldata: any = [];
    public arr1: any = [];
    public arr2: any = [];

    async utxo(data, target, total) {
        return new Promise((resolve,reject)=>{
            console.log(data, target, total, "aru")
            this.a = data;
            this.target = target;
            this.totalvalue = total;
            this.case1().then(res =>{
                return resolve(res);
            })
        })
    }
    case1() {
        let meta;
        return new Promise((resolve, reject) => {
            if (this.totalvalue >= this.target)
                this.finaldata = [];
            for (var i = 0; i < this.a.length; i++) {
                if (this.a[i] == this.target && this.completecase1 != 1) {
                    this.completecase1 = 1;
                    this.finaldata.push(this.a[i]);
                    console.log('case1', this.finaldata);
                    return resolve(this.finaldata)
                }
                else if (i == (this.a.length - 1) && this.completecase1 != 1) {
                    this.case2().then(res => {
                        return resolve(res)
                    })
                }

            }

        })
    }

    case2() {
        return new Promise((resolve, reject) => {
            for (var i = 0; i < this.a.length; i++) {
                if (this.a[i] > this.target && this.completecase2 != 1) {
                    this.completecase2 = 1;
                    this.solevalue = this.a[i];
                    this.case3().then(res => {
                        return resolve(res)
                    })
                }
                else if (i == (this.a.length - 1) && this.completecase2 != 1 && this.solevalue == 0) {
                    this.case3().then(res => {
                        return resolve(res)
                    })
                }
            }
        })
    }



    case3() {
        return new Promise((resolve, reject) => {
            console.log('case3', this.solevalue);
            for (var i = 0; i < (this.a.length); i++) {
                for (var j = 0; j < (this.a.length - (i + 1)); j++) {
                    for (var k = j; k < (j + 1); k++) {
                        this.arr1.push(this.a.slice(k, ((j + 1) + i)));
                        console.log('array', this.arr1);
                    }
                }
                if (i == (this.a.length - 1)) {
                    if (this.solevalue > 0) {
                        this.case4().then(res => {
                            return resolve(res);
                        })
                    }
                    else {
                        this.case5().then(res => {
                            return resolve(res);
                        })
                    }
                }
            }
        })

    }

    case4() {
        return new Promise((resolve, reject) => {
            console.log('case4', this.solevalue);
            this.case4comcount = 0;
            if (this.completecase4_1 != 1) {
                for (var i = 0; i < this.arr1.length; i++) {
                    //console.log('index',(a.indexOf(this.arr1[(this.arr1[i].length-1)])));
                    let b = this.arr1[i];
                    this.case4comcount++;

                    // console.log('index',b,b[this.arr1[i].length-1],a.indexOf(b[this.arr1[i].length-1]));
                    if (this.completecase4_1 != 1)
                        for (var j = (this.a.indexOf(b[this.arr1[i].length - 1]) + 1); j < this.a.length; j++) {

                            let tempval = this.a[j];
                            this.case4count = 0;
                            if (this.completecase4_1 != 1)
                                for (var k = 0; k < this.arr1[i].length; k++) {
                                    //  console.log('pre',tempval,i,this.arr1[i],this.arr1[i][k],a[j]);

                                    tempval += this.arr1[i][k];
                                    this.case4count++;
                                    if (tempval == this.target && this.case4count == this.arr1[i].length && this.completecase4_1 != 1) {
                                        this.completecase4_1 = 1;
                                        this.finaldata.push(this.arr1[i]);
                                        this.finaldata[0][++k] = this.a[j];
                                        console.log('final', tempval);
                                        console.log('final1', this.arr1[i], this.a[j], this.finaldata);
                                        return resolve(this.finaldata);
                                    }
                                    else if (tempval > this.target && tempval < this.solevalue && this.case4count == this.arr1[i].length && this.completecase4_1 != 1) {
                                        this.completecase4_1 = 1;
                                        this.finaldata.push(this.arr1[i]);
                                        this.finaldata[0][++k] = this.a[j];
                                        console.log('finale', tempval);
                                        console.log('finale2', this.arr1[i], this.a[j], this.finaldata);
                                        return resolve(this.finaldata);
                                        // return this.finaldata;
                                    }
                                    else if (i == (this.arr1.length - 1) && this.completecase4_1 != 1) {
                                        console.log('this.solevalue', this.solevalue);
                                        this.finaldata.push(this.solevalue);

                                        this.completecase4_1 = 1;
                                        console.log('sole', this.finaldata);
                                        return resolve(this.finaldata);
                                    }
                                }
                        }


                }

            }
        })

    }

    case5() {
        return new Promise((resolve, reject) => {
            console.log('case5', this.solevalue);
            if (this.completecase5_1 != 1) {
                for (var i = 0; i < this.arr1.length; i++) {
                    let b = this.arr1[i];

                    if (this.completecase5_1 != 1)
                        for (var j = (this.a.indexOf(b[this.arr1[i].length - 1]) + 1); j < this.a.length; j++) {

                            let tempval = this.a[j];
                            this.case5count = 0;
                            if (this.completecase5_1 != 1)
                                for (var k = 0; k < this.arr1[i].length; k++) {
                                    console.log('pre5', tempval, i, this.arr1[i], this.arr1[i][k], this.a[j]);

                                    tempval += this.arr1[i][k];
                                    this.case5count++;

                                    if (tempval >= this.target && this.case5count == this.arr1[i].length && this.completecase5_1 != 1) {
                                        this.completecase5_1 = 1;
                                        this.finaldata.push(this.arr1[i]);
                                        this.finaldata[0][++k] = this.a[j];
                                        console.log('finale', tempval);
                                        console.log('finale5', this.arr1[i], this.a[j], this.finaldata);
                                        return resolve(this.finaldata);
                                    }

                                }
                        }


                }
            }
        })
    }

}

