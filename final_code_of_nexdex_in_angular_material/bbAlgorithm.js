var a = [25,25,5,50,15];
function combinations(array, n) {
    var lists = [], M = 1<<array.length;
    for( var i = 1 ; i < M ; ++i ) {
        var sublist = array.filter(function(c,k){return i>>k & 1});
        if( sublist.reduce(function(p,c){return p+c},0) == n )
            lists.push(sublist);
    }
    return lists;
}
console.log(JSON.stringify(combinations(a,20)));
// // // A Naive recursive JAVA program to find minimum of coins 
// // // to make a given change V 

// // var  coins = [9, 6, 5, 1]; 
// // var m = coins.length; 
// // var V = 11;
// // function minCoins(coins,m,V)
// // { 
// // 	if (V == 0){ return 0; }
// // 		// Initialize result 
// // 		let res;
	
// // 	// Try every coin that has smaller value than V 
// // 	for (let i=0; i<m; i++) 
// // 	{ 
// // 		if (coins[i] <= V) 
// // 		{ 
// // 			let sub_res = minCoins(coins, m, V-coins[i]);
// // 			// Check for INT_MAX to avoid overflow and see if 
// // 			// result can minimized 
// // 			if (sub_res != null && sub_res + 1 < res) 
// // 			console.log(sub_res,"sub_res")
// // 				res = sub_res + 1; 
// // 		} 
// // 	}
// // 		return res;
	
// // }
// // var a = minCoins(coins,m,V);
// // console.log(a,"Minimum coins required is")

// var a = [25,25,5,50,15];
// function combinations(array, n) {
//     var lists = [], M = 1<<array.length;
//     for( var i = 1 ; i < M ; ++i ) {
//         var sublist = array.filter(function(c,k){return i>>k & 1});
//         if( sublist.reduce(function(p,c){return p+c},0) >= n )
//             lists.push(sublist);
//     }
//     return lists;
// }
// console.log(JSON.stringify(combinations(a,20)));

// var b = [[25],[25],[25,25],[25,5],[25,5],[25,25,5],[50],[25,50],[25,50],[25,25,50],[5,50],[25,5,50],[25,5,50],[25,25,5,50],[25,
// 	15],[25,15],[25,25,15],[5,15],[25,5,15],[25,5,15],[25,25,5,15],[50,15],[25,50,15],[25,50,15],[25,25,50,15],[5,50,15],[25,5,50,15],[25,5,50,15],[25,25,5,50,15]];
// console.log("----")

// let min = 0;
// let isMatchFound = false;
// var arr;
// let required = 3;
// for(let i=0;i<b.length;i++){
// 	let c = b[i];
// 	let sum = 0;
// 	// console.log(c)
// 	for(let j=0;j<c.length;j++){
// 		// console.log("&")
// 		sum += c[j];
// 	}
// // console.log(sum);
// 	if(sum==required){
// 		isMatchFound = true;

// 		min = c.length;
// 		arr = c;
// 	}
// 	else if(!isMatchFound && sum>required){
// 		min = c.length;
// 		arr = c;
// 	}
// }

// // setInterval(()=>{

// 	console.log(min,arr)
// // },1000)



