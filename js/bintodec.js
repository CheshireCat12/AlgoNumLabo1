class BinaryToDecimal {
		constructor(_data) {
			this.data = _data;

			this.sizeExponent = 8;
			this.sizeMantissa = 23;
			this.sizeTotal = 32;
			this.bias = 127;

			this.sign = this.getSign();
			this.exponent = this.getExponent();
			this.mantissa = this.getMantissa();
		}

		checkNumber(){
			let temp="";
			if(this.sign != "1"){
				temp = "-";
			}
			if(!this.exponent.includes("1")&&!this.mantissa.includes("1")){
				temp += "zero";
			}
			if(!this.exponent.includes("0")&&!this.mantissa.includes("1")){
				temp += "Infinity";
			}
			if(!this.exponent.includes("0")&&this.mantissa.includes("1")){
				temp = "NaN";
			}
			return temp;
		}

		getSign(){
			let temp = this.data.substring(0, 1)
			return Math.pow(-1,temp);
		}
		getExponent(){
			let temp = 1 + this.sizeExponent;
			return this.data.substring(1, temp); ;
		}
		getMantissa(){
			let limSup = this.sizeTotal;
			let limInf = 1 + this.sizeExponent;
			return this.data.substring(limSup,limInf);
		}
		decTotal(){
			let temp = this.checkNumber();
			let expo = this.decExponent();
			let mant = this.decMantissa();
			if(temp==="" || temp === "-"){
				temp = this.sign * (1 + mant) * Math.pow(2,expo-this.bias);
				temp = this.setPrecision(temp);
			}
			return temp;
		}
		setPrecision(data){
			c(data);
			let temp = Math.pow(2,this.sizeMantissa+1);
			let precision = Math.round(Math.log(temp)/Math.log(10));
			return data.toFixed(precision);

		}
		decMantissa(){
			let temp = 0;
			let expo = this.mantissa.length;
			let tempMant = this.reverse(this.mantissa);

			for(let i = expo-1 ; i >=0 ; i--){
				temp += parseInt(tempMant.charAt(i))*Math.pow(2,i);
			}
			temp /= Math.pow(2,expo)
			return temp;
		}
		decExponent(){
			let temp = 0;
			let tempExpo = this.reverse(this.exponent);
			for(let i = tempExpo.length-1 ; i >=0 ; i--){
				temp += parseInt(tempExpo.charAt(i))*Math.pow(2,i);
			}
			return temp;
		}
		reverse(s) {
			return s.split('').reverse().join('');
		}
	}
	class Addition {
		constructor(_data1,_data2) {
			this.data1 = _data1;
			this.data2 = _data2;

			this.sizeExponent = 8;
			this.sizeMantissa = 23;
			this.sizeTotal = 32;
			this.bias = 127;

			this.sign = this.getSign();
			this.exponent1 = this.getExponent(this.data1);
			this.exponent2 = this.getExponent(this.data2);
			c("fdf "+this.exponent1);
			c(this.exponent2);
			//console.log("sign " + this.sign);
			this.mantissa1 = this.getMantissa(this.data1);
			this.mantissa2 = this.getMantissa(this.data2);
			console.log("mantissa " + this.mantissa1);
			console.log("mantissa " + this.mantissa2);
			c(this.sign);
		}

		total(){
			let calcExpo1 = this.exponent1-this.bias;
			let calcExpo2 = this.exponent2-this.bias;

			let tempMantissa1 = this.normalize(this.mantissa1);
			let tempMantissa2 = this.normalize(this.mantissa2);

			let tempExpoFinal = calcExpo1;

			console.log("mantissa " + tempMantissa1);
			console.log("mantissa " + tempMantissa2);
			c("calc expo 1 : "+calcExpo1);
			c("calc expo 2 : "+calcExpo2);
			let diffExpo = 0;
			if(calcExpo1 < calcExpo2){
				tempMantissa1 = this.shiftMantissa(tempMantissa1,calcExpo2 - calcExpo1);

				tempExpoFinal = calcExpo2;
			}else if (calcExpo2 < calcExpo1) {
				tempMantissa2 = this.shiftMantissa(tempMantissa2,calcExpo1 - calcExpo2);
				tempExpoFinal = calcExpo1;
			}else if (calcExpo1 == calcExpo2) {
				diffExpo = 1;
				c("size dfd"+diffExpo);
			}
			c("taille "+tempMantissa1.length);
			c(tempMantissa2.length);
			let result = this.computeBinary(tempMantissa1,tempMantissa2);
			c("totot"+result);

			if(result.charAt(0)==="1"){
				result = result.substr(1);
				result = result.substring(0, result.length-2);
			}else{

				result = result.substr(2);
				result = result.substring(0, result.length-1);
			}
			let tempResult = result.substring(result.length-2, result.length);
			result = result.substring(0, result.length-2);
			//c("totot"+result+ "d " + result.length);
			//let diffExpo = result.length-this.sizeMantissa;
			diffExpo =tempExpoFinal+this.bias+diffExpo;

		//	c("exposant : " + tempExpoFinal);
		//	c(diffExpo);
			tempExpoFinal = this.convertToBinary(diffExpo);


		//	c(tempResult);
			if(tempExpoFinal.length>8){
				tempExpoFinal = tempExpoFinal.substr(1);
			}
			return this.sign + tempExpoFinal + result;

		}

		convertToBinary(data){
			let temp="";
			let i = 0;
			while (Math.pow(2,i)<data) {
				i++;
			}
			for(i;i>=0;i--){
				if(data-Math.pow(2,i)>=0){
					temp +="1";
					data-=Math.pow(2,i);

				}else{
					temp += "0";
				}
			}
			//c(temp);
			return temp;
		}

		shiftMantissa(data,diff){
			for(let i = 0; i < diff ; i++){
				data = "0"+data;
				data = data.slice(0, data.length-1);
			}
			return data;
		}

		getSign(){
			return this.data1.substring(0, 1);
		}

		getExponent(data){
			let temp = 1 + this.sizeExponent;
			return this.decExponent(data.substring(1, temp)) ;
		}
		decExponent(data){
			let temp = 0;
			let tempExpo = this.reverse(data);
			for(let i = tempExpo.length-1 ; i >=0 ; i--){
				temp += parseInt(tempExpo.charAt(i))*Math.pow(2,i);
			}
			return temp;
		}
		reverse(s) {
			return s.split('').reverse().join('');
		}

		getMantissa(_data){
			let limSup = this.sizeTotal;
			let limInf = 1 + this.sizeExponent;
			return _data.substring(limSup,limInf);
		}

		normalize(_data){
			return "1"+_data+"000";
		}

		computeBinary(nb1,nb2){
			let length = nb1.length;
			let temp = new Array();
			let souv = new Array();
			let res = new Array();
			souv[length] = "0";

			for(let i = length-1; i>=0; i--){
				temp.unshift(nb1.charAt(i) ^ nb2.charAt(i));
				if(nb1.charAt(i)==="1" && nb2.charAt(i)==="1" || nb1.charAt(i)==="1" && souv[i+1] === "1" || nb2.charAt(i)==="1" && souv[i+1]==="1"){
					souv[i]="1";
				}else{
					souv[i]="0";
				}
			}
			temp.unshift("0");

			for(let i = length; i>=0 ; i--){
				res.unshift(temp[i]^souv[i]);
			}

			return res.join("");
		}
	}
	function c(_data){
		console.log(_data);
	}

	function convertToDec(){
		var toConvert = document.getElementById('binField').value;
		var bitNumber = document.getElementById('bitNumber').value;
		var foo = new BinaryToDecimal(toConvert);
		var converted = foo.decTotal();
		document.getElementById('decField').value = converted;
	}


	var data1 = "01000001011111000111101011100001";
	var data2 = "00111110100011110101110000101001";

	const temp = new BinaryToDecimal(data1);





/*	const add = new Addition(data1,data2);
	let tempRes = add.total()
	c("final : "+ tempRes);
	const resultAddition = new BinaryToDecimal(tempRes);
	c("result Addition : "+ resultAddition.decTotal());
	//c("comput : "+add.computeBinary("1011","1010"));*/

	console.log(temp.decTotal());

	/*temp1 = BinaryToDecimal(data);
	alert(temp1);
	temp1.decTotal();*/