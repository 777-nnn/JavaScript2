const white = "#ffffff"
const orange = "#ffa500"
const exponentialNum = 3

const calcButtons = ".calc-buttons"

class Calculator{
    constructor(){
        this.inputValue;                      //入力した値
        this.calcValue = [0,0];               //計算時内部に格納する入力値
        this.calcState = "setNum1";           //電卓の状態遷移(setNum1 -> setMode -> setNum2)
        this.calcMode = "";                   //現在どの四則演算がセットされているか
    }

    //------汎用------
    colorChange(selector,color1,color2){
        $(selector).css(
            {
                'background-color' : color1,
                'color' : color2
            }
        );
    }

    displayMode(){

        $(".display-calc span").css({'opacity' : '0'});

        let displayId;

        if(this.calcMode == "+"){
            displayId = "#display-plus";
        }else if(this.calcMode =="-"){
            displayId = "#display-minus";
        }else if(this.calcMode =="×"){
            displayId = "#display-times";
        }else if(this.calcMode =="÷"){
            displayId = "#display-divide";
        }

        $(displayId).css({'opacity' : '100%'});
    }

    calculation(){

        let temp0 = new Decimal(this.calcValue[0]);
        let temp1 = new Decimal(this.calcValue[1]);

        if(this.calcMode == "+"){
            this.calcValue[0] = temp0.add(temp1).toNumber();
        }else if(this.calcMode == "−"){
            this.calcValue[0] = temp0.sub(temp1).toNumber();
        }else if(this.calcMode == "×"){
            this.calcValue[0] = temp0.mul(temp1).toNumber();
        }else if(this.calcMode == "÷"){
            this.calcValue[0] = temp0.div(temp1).toNumber();
        }

        this.limitLength();

        $(".display-calc span").css({'opacity' : '0'});
        $(".display-num").text(this.calcValue[0]);

    }

    limitLength(){

        let precisionNum;

        if(String(this.calcValue[0]).length > 10){
            if(String(this.calcValue[0]).includes('0.')){
                if(String(this.calcValue[0]).slice(0,1) == "-"){
                    precisionNum = 3;
                }else{
                    precisionNum = 4;
                }
            }else{
                if(String(this.calcValue[0]).slice(0,1) !== "-"){
                    precisionNum = 8;
                }else{
                    precisionNum = 7;
                }
            }

            this.calcValue[0] = Number(this.calcValue[0]).toPrecision(precisionNum);

        }

    }

    //------ボタン別処理(NumberButtons)------
    numberClick(pushButton){

        this.inputValue = $(pushButton).text();
        let calcValueIndex = this.calcState == "setNum1" ? 0 : 1 ;

        if(this.calcState == "setMode"){        //末尾が小数点なら消す

            this.calcValue[0] = String(this.calcValue[0]).slice(-1) == "." ? String(this.calcValue[0]).slice(0, -1) :
            this.calcValue[0];
            this.calcState = "setNum2"

        }

        if(this.calcValue[calcValueIndex].length > 9){
            //打ち込める文字数は１０文字以下
        }else if(String(this.calcValue[calcValueIndex]).includes('.') && this.inputValue == "."){
            //小数点は一つまで
        }else if(this.calcValue[calcValueIndex] == "0"){

            if(this.inputValue == "."){
                this.calcValue[calcValueIndex] = this.calcValue[calcValueIndex] + this.inputValue ;
            }else{
                this.calcValue[calcValueIndex] = this.inputValue;
            }

        }else if(this.calcValue[calcValueIndex] == "."){
            this.calcValue[calcValueIndex] = "0." + this.inputValue;
        }else{
            this.calcValue[calcValueIndex] = this.calcValue[calcValueIndex] + this.inputValue ;
        }

        $(".display-num").text(this.calcValue[calcValueIndex]);

    }

    calcClick(pushButton) {

        this.colorChange(calcButtons,orange,white);
        this.colorChange(pushButton,white,orange);
        this.calcMode = $(pushButton).text();
        this.displayMode();

        if(this.calcState == "setNum1"){        //末尾が小数点なら消す 

            this.calcValue[0] = String(this.calcValue[0]).slice(-1) == "." ? String(this.calcValue[0]).slice(0, -1) :
            this.calcValue[0];
            $(".display-num").text("0");

        }else if(this.calcState == "setNum2"){

            this.calcValue[1] = String(this.calcValue[1]).slice(-1) == "." ? String(this.calcValue[1]).slice(0, -1) :
            this.calcValue[1];
            this.calculation();
            this.calcValue[1] = 0;

        }

        this.calcState = "setMode";

    }

    equalsClick(){
        this.colorChange(calcButtons,orange,white);

        if(this.calcState == "setNum2"){

            this.calcValue[1] = String(this.calcValue[1]).slice(-1) == "." ? String(this.calcValue[1]).slice(0, -1) :
            this.calcValue[1];
            this.calculation();

        }else{        //末尾が小数点なら消す 

            this.calcValue[0] = String(this.calcValue[0]).slice(-1) == "." ? String(this.calcValue[0]).slice(0, -1) :
            this.calcValue[0];
            $(".display-num").text(this.calcValue[0]);

        }

        this.calcValue[1] = 0;
        this.calcState ="setNum1";

    }

    handlingClick(pushButton){

        this.inputValue = $(pushButton).text();
        let calcValueIndex = this.calcState == "setNum1" ? 0 : 1 ;
        let temp;

        if(this.inputValue == "AC"){

            this.colorChange(calcButtons,orange,white);
            this.calcValue[0] = 0;
            this.calcValue[1] = 0;
            $(".display-calc span").css({'opacity' : '0'});
            this.calcState = "setNum1";

        }else if(this.inputValue == "+/-"){

            if(this.calcValue[calcValueIndex] !== 0){
                temp = new Decimal(this.calcValue[calcValueIndex]);
                this.calcValue[calcValueIndex] = temp.mul(-1).toNumber();
            }

        }else if(this.inputValue == "%"){

            if(this.calcValue[calcValueIndex] !== 0){
                temp = new Decimal(this.calcValue[calcValueIndex]);
                this.calcValue[calcValueIndex] = temp.mul(0.01).toNumber();
            }  

        }

        this.limitLength();
        $(".display-num").text(this.calcValue[0]);

    }

}

$(document).ready(function(){

    $(".number-buttons").click(function(){
        calculator.numberClick(this);
    });

    $(".calc-buttons").click(function(){
        calculator.calcClick(this);
    });

    $("#equals-button").click(function(){
        calculator.equalsClick();
    }); 

    $(".handling-buttons").click(function(){
        calculator.handlingClick(this);
    });

});

const calculator = new Calculator();