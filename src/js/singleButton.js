class singleButton{


    constructor(context,x,y,r,id) {
        this.context = context;
        this.x = x ;
        this.y = y ;
        this.r = r ;
        this.id = id ;
        this.uncover_color = "#FFE1FF" ;
        this.covered_color = "#98F5FF" ;
        this.draw(this.uncover_color) ;
    }

    draw(color){
        let context = this.context ;
        context.fillStyle =  color;
        context.beginPath() ;
        context.arc(this.x,this.y,this.r,0,2*Math.PI) ;
        context.fill() ;
    }

    inbound(x,y){
        let dist = Math.sqrt(Math.pow(x-this.x,2)+Math.pow(y-this.y,2)) ;
        if(dist<this.r){
            var posdata = {
                x:this.x,
                y:this.y,
                id:this.id,
                r:this.r
            }
            return this ;
        }
        return null ;
    }

    toUncovered(){
        this.draw(this.uncover_color) ;
    }

    toCovered(){
        this.draw(this.covered_color) ;
    }

}

export {singleButton}