var Adjustor = {};

Adjustor.UP    = 38;
Adjustor.DOWN  = 40;

Adjustor.nudge = function (input, event, format){
  
  // when replacing the nudged value, tells us where to start and
  // how far to go (like substr(repl.start, repl.length))
  var repl = { start: 0, length: 0 };
  
  // record the original position of the cursor
  var cursor = input.selectionStart;
  
  // determine which direction we're nudging
  var direction = event.keyCode;
  if (direction != Adjustor.UP && direction != Adjustor.DOWN){
    return;
  }
  
  // since we'll sometimes prevent the cursor from moving, we
  // should always prevent the cursor from moving
  event.preventDefault();
  
  function parse(){
    var value = input.value,
        p = cursor,
        start;
    
    function isNumeric(value){
      return !isNaN(parseInt(value));
    }

    while (start == undefined){
      
      var left = isNumeric(value[p - 1]),
          right = isNumeric(value[p]);
      
      // if there's no digit left or right, bail
      if (!left && !right){
        return;
      }
      
      // if there's no digit left but a digit right, we've found our start
      else if (!left && right){
        start = p;
      }
      
      // if there's a digit left, regardless of a digit right, move left
      else if (left){
        p--;
      }
    }
    
    var parsed = parseInt(value.substr(start));
    
    // record the start and the length to replace this value later
    repl.start = start;
    repl.length = parsed.toString().length;
    
    return parsed;
  }
  
  function replace(value){
    var min = 0, max;
    
    if (format == Color.RGB){
      max = 255;
    } else {
      
      // if we're looking at hue, then there will be no digits to the
      // left of the start position
      max = /\d/.test(input.value.substr(0, repl.start)) ? 100 : 359;
    }
    
    value = Math.max(min, Math.min(max, value));
    
    var chunks = input.value.split("");
    chunks.splice(repl.start, repl.length, value);
    return chunks.join("");
  }
  
  function adjustment(){
    return (direction == Adjustor.UP ? 1 : -1) * (event.altKey ? 10 : 1);
  }
  
  var parsed = parse();
  
  if (parsed == undefined){
    return;
  }
  
  input.value = replace(parsed + adjustment());
  
  // put the cursor in the right spot
  input.selectionStart = input.selectionEnd = cursor;
  
  return input.value;
};
