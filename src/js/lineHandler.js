class lineHandler{

    constructor(canvas,context){
        this.linearquery = [] ;
        this.canvas = canvas ;
        this.context = context ;
        this.tempfixedX = null ;
        this.tempfixedY = null ;
    }

    draw(point,color){
        let context = this.context ;
        context.beginPath();
        context.strokeStyle = color ;//设置填充颜色
        context.lineWidth = 5;
        context.moveTo(this.tempfixedX,this.tempfixedY);
        context.lineTo(point.x,point.y);
        context.stroke();
        context.closePath() ;
    }

    addToQuery(){
        let context = this.context ;
        let canvas = this.canvas ;
        let linearquery = this.linearquery ;
        let imagedata = context.getImageData(0,0,canvas.width(),canvas.height()) ;
        linearquery.push(imagedata) ;
    }

    queryPop(){
        let linearquery = this.linearquery ;
        linearquery.pop() ;
    }

    getLastFromQuery(){
        let context = this.context ;
        let linearquery = this.linearquery ;
        context.putImageData(linearquery[linearquery.length-1],0,0) ;
    }

    getInitStatu(){
        let context = this.context ;
        let linearquery = this.linearquery ;
        context.putImageData(linearquery[0],0,0) ;
    }

    checkCross(buttonlist,pwd_stack,x,y){
        let fixedX = this.tempfixedX ;
        let fixedY = this.tempfixedY ;
        for(let i=0;i<buttonlist.length;i++) {
            let tempbutton = buttonlist[i];
            let flag = false;//当前button是否已经被点亮
            for (let j = 0; j < pwd_stack.length; j++) {
                if (tempbutton==pwd_stack[j]) {
                    flag = true ;
                }
            }
            if(!flag&&this.isConflict(x,y,tempbutton.x,tempbutton.y,tempbutton.r)){
                return tempbutton ;
            }
        }
        return null ;
    }

    isConflict(x1,y1,x2,y2,r){
        let fixedX = this.tempfixedX ;
        let fixedY = this.tempfixedY ;
        let k1 = (fixedY-y1)/(fixedX-x1) ;
        let k2 = 1/k1 ;
        let x = (k1*x1-k2*x2+y2-y1)/(k1-k2) ;
        let y = k1*(x-x1)+y1 ;
        let line_dist = Math.sqrt(Math.pow(fixedX-x1,2)+Math.pow(fixedY-y1,2)) ;
        let temp_dist = Math.sqrt(Math.pow(fixedX-x,2)+Math.pow(fixedY-y,2)) ;
        if(line_dist<temp_dist){
            return false ;
        }
        let vertical_dist = Math.sqrt(Math.pow(x-x2,2)+Math.pow(y-y2,2)) ;
        if(vertical_dist<=r){
            return true ;
        }
        return false ;
    }

    clear(){
        this.linearquery = [] ;
    }

}

export {lineHandler};