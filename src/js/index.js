import $ from 'webpack-zepto'
import {singleButton} from  './singleButton'
import {lineHandler} from './lineHandler'

$(function(){
  init() ;
});

function init(){
  FastClick.attach(document.body);
  initCanvas() ;
}

function initCanvas(){
  var canvas = $('#canvas');
  var context=canvas[0].getContext('2d');
  var buttonList = [] ;
  var pwd_stack = [] ;
  var lastButton = null ;
  var buttonToRedraw = null ;
  var pwd = "" ;
  var linehandler = new lineHandler(canvas,context) ;//画线的工具集
  $(window).resize(resizeCanvas);

  function resizeCanvas() {
    let rem = parseInt(window.getComputedStyle(document.documentElement)["fontSize"]) ;
    let canvas_width = 15*rem ;
    let canvas_height = 15*rem ;
    buttonList = [] ;
    pwd_stack = [] ;
    lastButton = null ;
    pwd = "" ;
    canvas.attr("width", canvas_width);
    canvas.attr("height", canvas_height);
    context.fillStyle = 'gray' ;
    context.roundRect(0, 0, canvas.width(), canvas.height(),8);
    context.drawRoundButtons(rem) ;
    alert("enter the code") ;
  };
  //add roundRect function to draw roundRect
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) {r = w / 2;}
    if (h < 2 * r){ r = h / 2;}
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y, x+w, y+h, r);
    this.arcTo(x+w, y+h, x, y+h, r);
    this.arcTo(x, y+h, x, y, r);
    this.arcTo(x, y, x+w, y, r);
    this.closePath();
    this.fill() ;
    return this;
  }
  //function to draw single gesture button
  CanvasRenderingContext2D.prototype.drawRoundButtons = function(rem){
    //3rem means leave 1rem padding
    let button_id = 1 ;
    for(let i=0; i<3 ;i++){
      for(let j=0; j<3 ;j++){
        //one circle get 5rem box, radius is 4rem,0.5rem padding each side
        let x = 2.5*rem + j*5*rem;
        let y = 2.5*rem + i*5*rem;
        let r = 2*rem;
        var button = new singleButton(context,x,y,r,button_id) ;
        buttonList.push(button) ;
        button_id++ ;
      }
    }
    linehandler.addToQuery() ;
    return this ;
  }
  //listener
  var initListener = function(){
    canvas.on('touchstart',function(e){
      let rect = canvas[0].getBoundingClientRect();
      let x = e.touches[0].clientX - rect.left ;
      let y = e.touches[0].clientY - rect.top ;
      for(let i=0;i<buttonList.length;i++){
        let pressedButton = buttonList[i].inbound(x,y) ;
        if(pressedButton!==null){
            pwd_stack.push(pressedButton) ;
            pressedButton.toCovered() ;
            lastButton = pressedButton ;
            buttonToRedraw = pressedButton ;
            linehandler.tempfixedX = pressedButton.x ;
            linehandler.tempfixedY = pressedButton.y ;
            linehandler.addToQuery() ;
        }
      }
    });

    canvas.on('touchmove',function(e){
      let rect = canvas[0].getBoundingClientRect();
      let x = e.touches[0].clientX - rect.left ;
      let y = e.touches[0].clientY - rect.top ;
      //如果还在同一个button中就return
      if(lastButton!=null){
        let dist = Math.sqrt(Math.pow(x-lastButton.x,2)+Math.pow(y-lastButton.y,2)) ;
        if(dist<lastButton.r){
          return ;
        }
      }

      let inEmptySpace = true ;//判断是不是在空白位置
      for(let i=0;i<buttonList.length;i++){
        //如果stack没有就入栈，如果有看下是不是lastButton，如果不是就出栈
        let pressedButton = buttonList[i].inbound(x,y) ;
        if(pressedButton!=null){
          inEmptySpace = false ;
          if(pwd_stack.indexOf(pressedButton)==-1){
            //先画线后画圆
            if(linehandler.tempfixedX) {
              linehandler.getLastFromQuery() ;
              linehandler.draw({x: pressedButton.x, y: pressedButton.y},'white');
              buttonToRedraw.toCovered() ;
              pressedButton.toCovered() ;
              linehandler.addToQuery();
            }else{
              pressedButton.toCovered() ;
            }

            linehandler.tempfixedX = pressedButton.x ;
            linehandler.tempfixedY = pressedButton.y ;
            pwd_stack.push(pressedButton) ;
            lastButton = pressedButton ;
            buttonToRedraw = pressedButton ;
          }else{
            let queryTailButton = pwd_stack[pwd_stack.length-1] ;
            if(queryTailButton==pressedButton&&lastButton==null){
              lastButton = pressedButton ;
              linehandler.getLastFromQuery() ;
            }
          }
        }
      }
      if(inEmptySpace){
        if(!linehandler.tempfixedX){
          return ;
        }
        let conflictbutton = linehandler.checkCross(buttonList,pwd_stack,x,y) ;
        linehandler.getLastFromQuery();
        if(!conflictbutton) {
          linehandler.draw({x: x, y: y}, 'white');
          buttonToRedraw.toCovered();
          lastButton = null;
        }else{
          console.log(conflictbutton) ;
          linehandler.draw({x: conflictbutton.x, y: conflictbutton.y},'white');
          buttonToRedraw.toCovered() ;
          conflictbutton.toCovered() ;
          linehandler.addToQuery() ;
          linehandler.tempfixedX = conflictbutton.x ;
          linehandler.tempfixedY = conflictbutton.y ;
          linehandler.draw({x: x, y: y}, 'white');
          conflictbutton.toCovered() ;
          pwd_stack.push(conflictbutton) ;
          lastButton = conflictbutton ;
          buttonToRedraw = conflictbutton ;
        }
      }
    });

    canvas.on('touchend',function(e){
      linehandler.getInitStatu() ;
      lastButton = null ;
      if(pwd_stack.length<2){
        return ;
      }
      let temp_pwd = "" ;
      for(let i=0; i<pwd_stack.length;i++){
        temp_pwd+=pwd_stack[i].id ;
      }
      if(!pwd) {
        pwd = temp_pwd ;
        alert("set success!");
      }else{
        if(pwd==temp_pwd){
          alert("verified!") ;
        }else{
          alert("wrong pwd!") ;
        }
      }
      linehandler.getInitStatu() ;
      pwd_stack = [] ;
      console.log(pwd) ;
    }) ;
  }
  //run
  resizeCanvas() ;
  initListener(buttonList) ;
}



