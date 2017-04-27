var MYAPP = {
    gameInPlay: false,
    playerNumber: 0,
    str1: "X", //默认值
    str2: "O",
    arr1:[],
    arr2:[],
    name1: "",
    name2: "",
    win1: 0,
    win2: 0,
    turn: 1,
    whoseTurn: 1,
    threeWinNumber:[],
    winArr: [
        [1, 2, 3],
        [4 ,5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7]
    ],
    reset: function(){
        $("#pOne, #pTwo").removeClass("flash");
        $("#scoreOne, #scoreTwo").html(0);
        MYAPP.display(0);// 切换得分栏的显示hidden or visible
        MYAPP.gameInPlay = false;
        MYAPP.playerNumber = 0;
        MYAPP.str1 = "X"; //默认值
        MYAPP.str2 = "O";
        MYAPP.arr1 = [];
        MYAPP.arr2 = [];
        MYAPP.name1 = "";
        MYAPP.name2 = "";
        MYAPP.win1 = 0;
        MYAPP.win2 = 0;
        MYAPP.turn = 1;
        MYAPP.whoseTurn = 1;
        MYAPP.threeWinNumber=[];
        $("li").css("color", "white");
        $("li").off("click");//解除li绑定的click事件，防止li被多次绑定事件
        $(".modal").off("click");
        var modal = document.getElementsByClassName("modal")[0];
        modal.style.display = "none";
        //MYAPP.resetOneGame();
        $("li").css("color", white);
        //MYAPP.resetOneGame();
    },

    initialize: function(){
        //进入游戏模式
        $(".reset").click(function(){
            MYAPP.reset();
        })
        $(".backToMenu").click(function(){
            MYAPP.display(0);
            $(".xOrO").css("display", "none");
        });

        //选择单人游戏还是双人游戏
        $(".oneP").click(function(){
            MYAPP.playerNumber = 1;
            MYAPP.display(1);
        });
        $(".twoP").click(function(){
            MYAPP.playerNumber = 2;
            MYAPP.display(1);
        });
        //选择X还是O
        $(".x").click(function(){

            MYAPP.str1 = "X";
            MYAPP.str2 = "O";
            MYAPP.display(2);
            MYAPP.startGame();
        });
        $(".o").click(function(){

            MYAPP.str1 = "O";
            MYAPP.str2 = "X";
            MYAPP.display(2);
            MYAPP.startGame();
        });


    },
    //切换各级菜单显示
    display: function(x){
        var className = ["menu", "xOrO", "battleField"];
        for (var i = 0; i < className.length && i !==x; i ++){
            $("." + className[i]).css("display", "none");
        }
        $("." + className[x]).css("display", "block");
        if ( x == "2"){
            $(".scoreBoard").css("visibility", "visible");
            $("ol, #myCanvas").css("display", "block");
        }else{
            $(".scoreBoard").css("visibility", "hidden");
            $("ol, #myCanvas").css("display", "none");
            $("li").css("opacity", 0);
        }
    },

    drawLine: function(ctx, x1, y1, x2, y2){
        //canvas画线
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    },

    drawCanvas: function(){
        //画棋盘格子
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        ctx.strokeStyle = "white";
        ctx.lineWidth = .25;
        //drawLine(ctx, 5, 110, 290, 110);
        MYAPP.drawLine(ctx, 5, 50, 295, 50);
        MYAPP.drawLine(ctx, 5, 100, 295, 100);
        ctx.lineWidth = 1;
        MYAPP.drawLine(ctx, 100, 5, 100, 145);
        MYAPP.drawLine(ctx, 200, 5, 200, 145);
    },

    startGame: function(){
        //开始游戏
        MYAPP.gameInPlay = true;
        var val;
        $("#pOne").addClass("flash"); //默认player1有闪烁效果
        MYAPP.drawCanvas(); //画九宫格子
        //初始化显示名称、以及各自赢了几局
        if( MYAPP.playerNumber ===1 ){
            MYAPP.name1 = "you";
            MYAPP.name2 = "coder";
        }else if(MYAPP.playerNumber ===2 ){
            MYAPP.name1 = "player1";
            MYAPP.name2 = "player2";
        }
        $("#pOne").html(MYAPP.name1); //显示player名称
        $("#pTwo").html(MYAPP.name2);
        $("#scoreOne, #scoreTwo").html(0);
        $("li").click(function(){
            //每次点击绑定事件
            var that = this;
            MYAPP.liClickFunction(that);
            //   $(".modal").off("click");

        });
    },

    //点击li之后的函数，根据不同选手决定画O还是画X，并且对输赢作检查
    liClickFunction: function(that){
        var val = $(that).val();
        var that2 = that;
        if ( !MYAPP.arr1.includes(val) && !MYAPP.arr2.includes(val)){
            MYAPP.gameInPlay = true;
            if(MYAPP.turn ===1 ){
                MYAPP.gameInPlay = MYAPP.oneClick(MYAPP.turn, MYAPP.str1, MYAPP.arr1, MYAPP.name1, that2, MYAPP.arr2, val);
                MYAPP.turn = 2;
                //如果这盘还没结束，那就让电脑走下一步棋
                if( MYAPP.gameInPlay && MYAPP.playerNumber === 1){
                    MYAPP.clickLi();
                }
            }else if(MYAPP.turn === 2){
                MYAPP.gameInPlay = MYAPP.oneClick(MYAPP.turn, MYAPP.str2, MYAPP.arr2, MYAPP.name2, that2, MYAPP.arr1, val);
                MYAPP.turn = 1;
            }

        }
    },

    //li的分支函数，可复用的部分代码
    oneClick: function(turns, str, arrOne, name, that, arrTwo, value){
        //每次点击调用此函数，用于显示，并检查是否赢了
        var end = true;
        var whoseScore, win;
        $(that).html(str);
        $(that).css("opacity", "1");
        arrOne.push(value);
        if(MYAPP.winOrNot(arrOne)){
            ( turns ===1 )? MYAPP.win1 += 1 : MYAPP.win2 += 1;
            win = ( turns ===1 )? MYAPP.win1 : MYAPP.win2;
            whoseScore = ( turns ===1 )? "#scoreOne" : "#scoreTwo";
            $(whoseScore).html(win);
            MYAPP.modal( name + " won!");//显示赢的消息
            end = false;
        }else if( MYAPP.arr1.length + MYAPP.arr2.length === 9){
            MYAPP.modal("Draw game!");
            end = false;
        }else{
            //为下一个player添加闪烁效果
            if(turns ===1 ){
                $("#pOne").removeClass("flash");
                $("#pTwo").addClass("flash");

            }else if(turns === 2){
                $("#pTwo").removeClass("flash");
                $("#pOne").addClass("flash");

            }
        }

        //if(end && MYAPP.whoseTurn ===2){ MYAPP.clickLi(5);}
        return end; //返回值给MYAPP.gameInPlay，判断游戏是否结束，若还在进行为true，反之为false
    },

    //每一局结束后清空棋盘和arr1、arr2数组
    resetOneGame: function(){
        MYAPP.arr1 = []; //清空arr1和arr2，全局变量here
        MYAPP.arr2 = [];
        MYAPP.threeWinNumber = [];
        MYAPP.gameInPlay = false;
        MYAPP.whoseTurn = (MYAPP.whoseTurn ===1) ? 2 : 1;
        MYAPP.turn = MYAPP.whoseTurn;
        //MYAPP.turn = MYAPP.whoseTurn;
        $("li").html("L");
        $("li").css("opacity", 0);
        $("li").css("color", "white");
    },

    //根据需求发出输赢消息，并闪烁下一个player名字，并根据需要让电脑走下一步棋
    modal: function(str){

        for (var j = 0; j< MYAPP.threeWinNumber.length; j++ ){
            //把连成3个的标成红色
            $("li[value="+ MYAPP.threeWinNumber[j] + "]").css("color", "red");
        }

        var modal = document.getElementsByClassName("modal")[0];
        $(".modal-content").html( str );
        modal.style.display = "block";

        //隐藏modal

        modal.onclick = function() {
            modal.style.display = "none";
            MYAPP.resetOneGame();

            if(MYAPP.whoseTurn ===1){
                //根据输赢闪烁对应player
                $("#pTwo").removeClass("flash");
                $("#pOne").addClass("flash");
            }else if(MYAPP.whoseTurn ===2){
                $("#pOne").removeClass("flash");
                $("#pTwo").addClass("flash");

                //如果是和电脑对战
                if(MYAPP.playerNumber ===1){
                    MYAPP.clickLi();
                }
            }
        }
    },

    //判断某个选手有没有赢
    winOrNot: function(arr){
        var ifWin = false;
        MYAPP.threeWinNumber = [];
        if (arr.length >= 3){
            for(var i = 0; i < MYAPP.winArr.length; i++){
                ifWin = true;
                for (var j = 0; j< MYAPP.winArr[i].length; j++ ){
                    if ( !arr.includes(MYAPP.winArr[i][j])){ ifWin = false;}
                }
                if( ifWin){
                    MYAPP.threeWinNumber = MYAPP.winArr[i];
                    break;
                }
            }
        }
        return ifWin;
    },

    clickLi: function(){
        //点击第number个格子
        var delay = 10; //0.25 second 给人一种计算机在思考导致delay的假象
        var number;
        number = MYAPP.compute();
        setTimeout(function() {
            $("li[value="+ number + "]").click();
        }, delay);

    },

    compute: function(){
        //计算下一步走哪个棋

        var arrLeft = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var conner = [1, 3, 7, 9];
        var edge = [2, 4, 6, 8];
        var center = [5];
        var concatArr;
        function filterArr(value) {
            return !MYAPP.arr1.includes(value) && !MYAPP.arr2.includes(value);
        }
        arrLeft = arrLeft.filter(filterArr);//arrLeft是剩下的棋位

        if(arrLeft.length === 9){
            //first move, 返回中间或conner的位置
            concatArr = center;
            concatArr = concatArr.concat(conner);
            var a = concatArr[Math.floor(Math.random()*concatArr.length)];
            //alert(concatArr + " a:"+ a);
            return a;
        }


        function win(myappArr){
            //看下哪个棋子能赢
            var arr = [];
            if( myappArr.length >= 2){
                for (var i = 0; i < arrLeft.length; i ++){
                    arr = [];
                    arr.push(arrLeft[i]);
                    arr = arr.concat(myappArr);
                    if (MYAPP.winOrNot(arr)){
                        //alert(arrLeft[i]);
                        return arrLeft[i];
                    }
                }
            }
            return false;
        }

        function fork(myappArr){
            //看是否有交叉连成3子的机会
            var forkNumber = 0;
            var forkTest = 0;
            var arrI= [];
            var arrJ = [];
            var rezult = [0]; //
            for (var i = 0; i < arrLeft.length; i ++){
                arrI = [];
                forkTest = 0;
                arrI.push(arrLeft[i]);
                arrI= arrI.concat(myappArr);
                for (var j = 0; j < arrLeft.length; j++){
                    arrJ = [];
                    arrJ.push(arrLeft[j]);
                    arrJ = arrJ.concat(arrI);
                    if ( MYAPP.winOrNot(arrJ) ) { forkTest += 1;}
                }
                if (forkTest >= 2){
                    //说明能fork，造成两个交叉赢面机会
                    forkNumber += 1;
                    rezult.push(arrLeft[i]);

                }
            }

            rezult[0] = forkNumber;
            if(forkNumber >= 1) {
                //说明有fork
                return rezult;
            }else { return false;}
        }

        function defence(forkArr){
            //如果对方有fork的机会，想办法反击，而不是防守
            forkArr.shift();
            var forkNumber = forkArr; //把第一个元素删掉
            //alert(forkNumber);
            var tempArr = [];
            var rezult = [];
            //先找哪两个棋子可以赢
            for(var i = 0; i < MYAPP.arr2.length; i++){
                for (var j = 0; j < arrLeft.length; j++){
                    tempArr = [];
                    for (var h = 0; h <arrLeft.length; h++ ){
                        tempArr = [MYAPP.arr2[i], arrLeft[j], arrLeft[h]];
                        if (MYAPP.winOrNot(tempArr)){
                            //h和j两个棋子拼上arr2[i],看是否能赢
                            if( !forkNumber.includes(arrLeft[j]) && !rezult.includes(arrLeft[h])) {
                                rezult.push(arrLeft[h]);}
                            if( !forkNumber.includes(arrLeft[h]) && !rezult.includes(arrLeft[j])) {
                                rezult.push(arrLeft[j]);}
                        }
                    }
                }
            }

            if(rezult.length > 0) {
                return rezult;
            }else{
                return false;
            }
        }

        var check;
        check = win(MYAPP.arr2);
        if( check) { return check;}//win 查看是否有两个棋子连起来

        check = win(MYAPP.arr1);
        if( check) { return check;} //block 堵住对方的两个连子

        check = fork(MYAPP.arr2);
        if( check) { return check[1];} //fork 查看造成交叉3子的机会


        check = fork(MYAPP.arr1); //fork 对手，查看对手有没有连成交叉3子的机会
        if( check[0] == 1) {
            //对手只有一个fork，堵住那个位置
            //alert("fork"+ " check: "+ check);
            return check[1];
        }else if(check[0] > 1){
            //超过两个fork位置，堵不住了，只能采取以攻代守的方法
            check = defence(check);//返回值为能够用于防守的位置组成的数组
            if(check){
                return check[Math.floor(Math.random()*check.length)]; //返回check数组里面随机的一个数
            }
        }

        if ( arrLeft.includes(5)){
            return 5;//center
        }

        if ( conner.includes( MYAPP.arr1[MYAPP.arr1.length - 1])){
            //对方是conner，自己下对角线
            var temp = conner[conner.length - 1 - conner.indexOf(MYAPP.arr1[MYAPP.arr1.length - 1])]
            if( arrLeft.includes(temp) ){
                //如果对角线还有空位
                return temp;
            }
        }

        //如果对角线被占领了，那就下另外一个空位的conner
        var tempArr = [];
        for (var i = 0; i <conner.length; i++){
            if(arrLeft.includes( conner[i])){ tempArr.push( conner[i]);}
        }
        if (tempArr.length > 0) { return tempArr[ Math.floor(Math.random()*tempArr.length)];}

        //conner占满了，那就edge
        var tempArr2 = [];
        for (var i = 0; i <conner.length; i++){
            if(arrLeft.includes( edge[i])){ tempArr.push( edge[i]);}
        }
        if (tempArr2.length > 0) { return tempArr2[ Math.floor(Math.random()*tempArr2.length)];}

        //alert("didn't think");
        return arrLeft[0];

    }

}

$(document).ready(function(){
    MYAPP.initialize();
});