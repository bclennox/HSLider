function Gradient(color){
  
  
  /*** Private variables ***/
  
  
  // HSL value of the original color we'll be gradiating
  var hsl = [];
  
  // color stops
  var stops = [];
  
  
  /*** Public instance methods ***/
  
  
  this.hsl = function (color){
    if (color != undefined){
      if (typeof color.hsl == "function"){
        hsl = color.hsl().split(/, /);
      } else if (color.length > 0){
        hsl = color;
      }
    }
    
    return hsl;
  };
  
  this.stop = function (value, color){
    stops.push({ value: value, color: color });
  };
  
  this.clear = function (){
    stops = [];
  };
  
  this.css = function (varying){
    if (varying != Gradient.SATURATION && varying != Gradient.LIGHTNESS){
      return;
    }
    
    var hsl = this.hsl();
    if (hsl.length == 0){
      return;
    }
    
    this.clear();
    
    var self = this;
    var color = new Color();
    var values = [0, 20, 40, 60, 100];

    values.forEach(function (value){
      hsl[varying] = value;
      color.set(hsl.join(" "), Color.HSL);
      self.stop(value / 100, color.hsl(true));
    });

    return this.toString();
  };
  
  this.toString = function (){
    if (stops.length > 0){
      return "-webkit-gradient(linear, left top, right top, " + stops.map(function (stop){
        return "color-stop(" + stop.value + ", " + stop.color + ")";
      }).join(", ") + ")";
    }
  };
  
  
  /*** Constructor ***/
  
  
  this.hsl(color);
};


/*** Class constants ***/


Gradient.SATURATION = 1;
Gradient.LIGHTNESS = 2;
