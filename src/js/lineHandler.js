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
        context.lineWidth = "3px";
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
        console.log(imagedata) ;
        linearquery.push(imagedata) ;
    }

    popFromQuery(){
        let context = this.context ;
        let linearquery = this.linearquery ;
        context.putImageData(linearquery[linearquery.length-1],0,0) ;
    }

    clear(){
        this.linearquery = [] ;
    }

}

export {lineHandler};