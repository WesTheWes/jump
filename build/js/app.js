// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

// Function for initializing wookmark grid
var grid = function ($){
  var container = $('.images');

  container.imagesLoaded(function() {

    // Get a reference to grid items.
    var handler = $('.image');
    
    // Prepare layout options.
    var options = {
      itemWidth: 0, // Optional min width of a grid item
      autoResize: true, // This will auto-update the layout when the browser window is resized.
      container: container, // Optional, used for some extra CSS styling
      offset: 20, // Optional, the distance between grid items
      outerOffset: 0, // Optional the distance from grid to parent
      flexibleWidth: '100%' // Maximum width
    };
    
    // Set additional sizing options
    function initialize($window){
      
      if ($window.width() <= 640){
        options.itemWidth = 160;
      } else if ($window.width() <= 1024 ){
        options.itemWidth = 213;
      } else if ($window.width() >= 1024){
        options.itemWidth = 256;
      }
      handler.wookmark(options);
    }

    $window = $(window);

    // Initialize wookmark
    initialize($window);

    // Set to change on resize
    $window.resize(function(){
      initialize($window);
    });

    // Set refresh rate
    setInterval(function(){
      container.trigger('refreshWookmark', 100);
    });

    // Use Custom javascript function InViewport.js to animate images as they come into the viewport
    setTimeout(function(){
      new InViewport(document.querySelector('.images'), {
        amount: .3,
        maxTime: 1.2,
        minStart: {x: -300, y: 500},
        maxStart: {x: 300, y: 1500}
      });
    }, 200);
  });
}

// Code to run after document is loaded

$(document).ready(function(){
  // Initialize grid
	grid($);

  // Assign variables to necessary DOM elements 
 
  var fileInput     = $('.imgUpload'),
      uploadElement = $('#upload'),
      pictureButtons = $('.pictureButton'),
      xData         = $('#xData'),
      yData         = $('#yData'),
      widthData     = $('#widthData'),
      heightData    = $('#heightData'),
      rotation      = $('#rotation'),
      canvas        = $("canvas")[0],
      context       = canvas.getContext("2d");

  // Image Crop And Rotate

  // Function to update data after cropping

  function doneCropping(data){
    xData.val(data.x);
    yData.val(data.y);
    widthData.val(data.width);
    heightData.val(data.height);
  }

  // Function to handle file upload and rotate
  function readImgURL(fileInput, cb){
    if(fileInput.files && fileInput.files[0]){
      // Create File Reader
      var reader = new FileReader();
      // Set callback function for File Reader
      reader.onload = function(img) {
        console.log("image read")
        cb.call(this, img.target.result, rotation.val());
      }
      reader.readAsDataURL(fileInput.files[0]);
    }
    else {
      console.log('reseting cropper');
    }
  }

  // Create image in canvas, rotate, then feed to cropper
  function createImg(src, rotation) {
    console.log("running callback function, rotation = " + rotation)
    console.log(src);
    var img = new Image();
    img.onload = function() {
      console.log("image read\nimage height = " + img.height + ", image width = " + img.width );
      switch(Math.abs(rotation)%180){
        case(0):
          canvas.width = img.width;
          canvas.height = img.height;
          break;
        case(90):
          canvas.width = img.height;
          canvas.height = img.width;
          break;
      }
      console.log("canvas height = " + canvas.height + ", canvas width = " + canvas.width );
      context.save();
      context.translate(canvas.width/2, canvas.height/2);
      context.rotate(rotation*Math.PI/180);
      context.drawImage(img, -img.width/2, -img.height/2);
      context.restore();
      uploadElement.cropper('setImgSrc', canvas.toDataURL())
    };
    img.src = src;
  }

  // Hide edit buttons before image upload

  pictureButtons.hide();

  // Initialize cropper with callback function
  uploadElement.cropper({done:doneCropping});

  // Set up callback for when image is uploaded
  fileInput.change(function(){
    rotation.val(0);
    readImgURL.call(this, fileInput[0], createImg);
    pictureButtons.show();
  });

  // Rotate images
  $('.rotateLeft').click(function(){
    rotation.val((parseInt(rotation.val(),10) - 90)%360);
    readImgURL.call(this, fileInput[0], createImg)
  })
  $('.rotateRight').click(function(){
    rotation.val((parseInt(rotation.val(),10) + 90)%360);
    readImgURL.call(this, fileInput[0], createImg)
  })
});