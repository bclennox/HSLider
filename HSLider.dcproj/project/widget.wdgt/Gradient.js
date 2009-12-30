function Gradient(color){
  
  
  /*** Private variables ***/
  
  
  // HSL value of the original color we'll be gradiating
  var hsl = [];
  
  // color stops
  var stops = [];
  
  
  /*** Public instance methods ***/
  
  
  /**
   * Gets and/or sets the HSL array we'll use to gradiate. The argument
   * passed can be a Color object or an array of [H, S, L] integers.
   *
   * @param Color or array
   * @return array
   */
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
  
  /**
   * Adds a color-stop(value, color) to the final CSS output. The value
   * should be a float between 0 and 1, and the color should be a valid
   * CSS color (probably in HSL format).
   *
   * @param int
   * @param string
   */
  this.stop = function (value, color){
    stops.push({ value: value, color: color });
  };
  
  /**
   * Clears all existing color stops.
   */
  this.clear = function (){
    stops = [];
  };
  
  /**
   * Creates all the color stops for the gradient, varying the gradient by the
   * argument passed in (either Gradient.SATURATION or Gradient.LIGHTNESS). Then
   * returns the value of this.toString().
   *
   * You should always call this before calling this.toString(), if you plan to
   * use casting or type coercion or whatever it's called in JavaScript.
   *
   * @param class constant
   * @return string
   */
  this.css = function (varying){
    if (varying != Gradient.SATURATION && varying != Gradient.LIGHTNESS){
      return;
    }
    
    // make sure we have a starting color value
    var hsl = this.hsl();
    if (hsl.length == 0){
      return;
    }
    
    // clear existing stops and start fresh
    this.clear();
    
    var self = this;
    var color = new Color();
    var values = [0, 20, 40, 60, 100];    // arbitrary, but seems to work okay
    
    // create all the color stops
    values.forEach(function (value){
      hsl[varying] = value;
      color.set(hsl.join(" "), Color.HSL);
      self.stop(value / 100, color.hsl(true));
    });

    return this.toString();
  };
  
  /**
   * Returns this gradient as a valid CSS gradient (well, -webkit-gradient anyway).
   *
   * @return string
   */
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


// used by the css() method
Gradient.SATURATION = 1;
Gradient.LIGHTNESS = 2;
