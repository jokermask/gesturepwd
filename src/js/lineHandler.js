class lineHandler{

    constructor(context){
        this.linearquery = [] ;
        this.context = context ;
        this.tempfixedX = null ;
        this.tempfixedY = null ;
        this.lastMovingX = null ;
        this.lastMovingY = null ;
    }

    draw(point,color){
        let context = this.context ;
        context.beginPath();
        context.strokeStyle = color ;//设置填充颜色
        context.lineWidth = "3px";
        context.moveTo(this.tempfixedX,this.tempfixedY);
        context.lineTo(point.x,point.y);
        context.stroke();
        context.closePath() ;
    }

    addToQuery(x1,y1,x2,y2){
        let templinear = {
            x1:point1.x,
            y1:point1.y,
            x2:point2.x,
            y2:point2.y
        }
        this.linearquery.push(templinear) ;
    }

    clear(){
        this.linearquery = [] ;
    }


    clearMovingline(){
        if(this.tempfixedX){
            console.log("hi") ;
            this.draw({x:this.lastMovingX,y:this.lastMovingY},'gray') ;
        }
    }

    clearLastLine(){
        if(this.linearquery.length!==0){
            let context= this.context ;
            let lastline = this.linearquery.pop() ;
            //this.draw() ;
        }else{
            return null ;
        }
    }
}

export {lineHandler};