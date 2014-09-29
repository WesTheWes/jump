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

// Function to display file before upload

function readImgURL(fileInput, callback){
  if (fileInput.files && fileInput.files[0]){
    var reader = new FileReader();
    reader.onload = function(img) {
      callback(img.target.result);
    }
    reader.readAsDataURL(fileInput.files[0]);
  }
}

$(document).ready(function(){
  // Initialize grid
	grid($);

  // Preview image before submit
  
  var fileInput = $('.imgUpload'),
      uploadElement = $('#upload'),
      editButtons = $('.editButtons');

  uploadElement.cropper();

  fileInput.change(function(){
    console.log('Picture uploaded');
    readImgURL( fileInput[0], function(src){
      uploadElement.cropper('setImgSrc', src);
    });
    editButtons.addClass('active');
  });  
});