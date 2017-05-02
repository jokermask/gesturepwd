import $ from 'webpack-zepto'
import {gesturepwd} from  './gesturepwd'

$(function(){
  init() ;
});

function init() {
  FastClick.attach(document.body);
  var canvas = $("#canvas");
  var container = new gesturepwd(canvas);
}




