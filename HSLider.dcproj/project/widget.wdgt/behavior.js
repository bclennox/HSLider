window.addEventListener("load", function (){
  
  // ids of the inputs and buttons
  var text_fields = ["hex", "rgb", "hsl"];
  var sliders = ["hue", "saturation", "lightness"];
  var buttons = ["copy-hex", "copy-hsl", "copy-rgb"];
  var prefs = ["compact-hex-values", "upcase-hex-values"];
  
  /**
   * Updates the sample, sliders, and text fields to the given
   * color. Optionally pass in the element that triggered the
   * event to keep it from being updated.
   *
   * @param Color
   * @param DOMElement
   */
  function update(color, target){
    var target = target && target.id;
    
    document.getElementById("sample").style.backgroundColor = color;
    
    updateTextFields(color, target);
    updateSliders(color, target);
  }
  
  function updateTextFields(color, target){
    text_fields.forEach(function (id){
      if (id != target){
        document.getElementById(id).value = color.fetch(id);
      }
    });
  }
  
  function updateSliders(color, target){
    var hsl = color.hsl().split(/, /);
    sliders.forEach(function (id, idx){
      if (id != target){
        document.getElementById(id).value = hsl[idx];
      }
    });

    // change the gradients on the saturation and lightness sliders
    // whenever the hue is updated (or on load)
    ["saturation", "lightness"].forEach(function (id){
      if (target != id){
        document.getElementById(id + "-gradient").style.background =
          new Gradient(hsl).css(Gradient[id.toUpperCase()]);
      }
    });
  }
  
  function setPreference(name, value){
    if (window.widget){
      widget.setPreferenceForKey(value, name);
    }
    
    var color = Color.instance();
    color.preference(name, value);
    update(color);
  }
  
  // bind the keyup listener to each text field
  text_fields.forEach(function (id){
    var format = Color[id.toUpperCase()];
    
    document.getElementById(id).style.zIndex = 500;
    
    // HSL and RGB inputs are nudgeable
    if (id == "hsl" || id == "rgb"){
      document.getElementById(id).addEventListener("keydown", function (ev){
        Adjustor.nudge(this, ev, format);
      });
    }
    
    document.getElementById(id).addEventListener("keyup", function (){
      var color = Color.instance();
      
      try {
        color.set(this.value, format);
        update(color, this);
      } catch (e){}
    });
  });
  
  // bind the change listener to each slider
  sliders.forEach(function (id){
    document.getElementById(id).addEventListener("change", function (){
      var hsl = sliders.map(function (id){ return document.getElementById(id).value; }).join(", ");
      
      var color = Color.instance();
      color.set(hsl, Color.HSL);
      update(color, this);
    })
  });
  
  // bind the click listener to each button
  buttons.forEach(function (id){
    document.getElementById(id).addEventListener("click", function (){
      var color = Color.instance();
      var format = id.split(/-/)[1];
      var css_color = color.fetch(format, true);
      
      // copy the requested value to the system pasteboard
      if (window.widget){
        widget.system("/bin/echo -n '" + css_color + "' | /usr/bin/pbcopy", null);
      }
    })
  });
  
  // bind the click listeners to the preference checkboxes
  prefs.forEach(function (key){
    document.getElementById(key).addEventListener("change", function (){
      setPreference(key, this.checked);
    });
  });
  
  // start with the default
  var color = Color.instance();
  color.set(document.getElementById("hex").value, Color.HEX);
  
  // set up preferences, providing defaults on first run
  if (window.widget){
    prefs.forEach(function (key){
      var stored_pref = widget.preferenceForKey(key);
      document.getElementById(key).checked = stored_pref == undefined ?
        color.preference(key) :
        stored_pref;
      
      setPreference(key, stored_pref);
    });
  }
  
  update(Color.instance());
  
  // do other widget-related stuff
  document.getElementById("help").addEventListener("click", function (){
    if (window.widget){
      widget.openURL("http://bclennox.com/projects/hslider");
    }
  });
});
