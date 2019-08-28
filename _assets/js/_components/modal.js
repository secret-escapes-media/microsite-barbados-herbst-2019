

// =========================================
//  MODAL
// =========================================

var modal           = $('.js-modal'),
    modalWrap       = $('.js-modal,.modal__wrap,.modal__item'),
    modalLaunchBtn  = $('.js-open-modal'),
    modalCloseBtn   = $('.js-close-modal'),
    modalTransition = 300; // must be the same as CSS transition duration



// -----------------------------------------
// Open modal and show selected modal__item
// -----------------------------------------

function modalOpen(event, modalId){

  if (event) {
    // CLICKED : If modal was fired from a click event


    event.preventDefault();
    var modalItemID   = $(event.currentTarget).data('modal-item'),
        modalItem = '.modal__item--' + modalItemID;

    // if group create carousel modal
    if ( $(event.currentTarget).attr('data-modal-group') ) {
      var modalGroup = $(event.currentTarget).data('modal-group');
      modal.addClass('modal--carousel').addClass('modal--carousel-' + modalGroup);

    }
//console.log(modalItem);
    // update video
    if( $(modalItem).attr('data-video-id') ){
      var modalVideoId = $(modalItem).data('video-id');
      //$('#modal-video__'+modalItemID).attr('src', 'https://www.youtube.com/embed/' + modalVideoId + '?enablejsapi=1&controls=1&rel=0&showinfo=0&modestbranding=1');
    //  $('#modal-video__'+modalItemID).attr('src', 'https://www.youtube.com/embed/' + modalVideoId + '?enablejsapi=1&controls=1&rel=0&showinfo=0&modestbranding=1');

    }

  } else {
    // QUERY - If modal opened from querystring
    modalItem = '.modal__item--' + modalId;
  }


  // hides all modal content
  $('.modal__item').addClass('is-closed').hide();

  // show selected modal
  $(modalItem).removeClass('is-closed').addClass('is-open').show();
  // disable scrolling on background content (doesn't work iOS)
  $('body').addClass('disable-scroll');

  // open modal
  modal.fadeIn(modalTransition, function(){
    $(this).removeClass('is-closed').addClass('is-open');
  });

}



// -----------------------------------------
// Closes modal and hides all content
// -----------------------------------------

function modalClose(event){
  event.preventDefault();
  $('body').removeClass('disable-scroll');

  // Reset scroll position
  setTimeout(function() {
    $('.modal__wrap').scrollTop(0);
  }, modalTransition);

  // close modal with fade
  $('.js-modal.is-open').fadeOut(modalTransition, function(){
    $(this).removeClass('is-open').removeClass('modal--carousel').addClass('is-closed');
    $('.modal__item.is-open').removeClass('is-open').addClass('is-closed');
  });

  // disable video
  $('.modal__item.is-open .modal-video__iframe').attr('src','https://www.youtube.com/embed/');

}

// open modal when .js-open-modal is clicked
modalLaunchBtn.on('click', function(event) { modalOpen(event); });

// close modal when .js-close-modal is clicked
modalCloseBtn.on('click', function(event) { modalClose(event); });

// closes modal on background click
modalWrap.on('click', function(event) {
  if (event.target !== this){
    return;
  }
  modalClose(event);
});

// closes modal on escape key press
$(document).keyup(function(event) {
  if (event.keyCode == 27) {
    modalClose(event);
  }
});

// opens modal from query string
var targetModalQuery = queryString('modal');
if (targetModalQuery) {
  modalOpen(null, targetModalQuery);
}






// =========================================
//  MODAL NAVIGATION
// =========================================

function modalNav(direction){

  var currentItem = $('.modal__item.is-open'),
      nextItem    = currentItem.next('.modal__item'),
      prevItem    = currentItem.prev('.modal__item');

  // applies to next or prev
  if( modal.hasClass('modal--carousel-page') ){
    var currentItemGroup    = currentItem.data('group-page'),
        nextItemGroup       = nextItem.data('group-page'),
        prevItemGroup       = prevItem.data('group-page'),
        firstItem           = $('.modal__item[data-group-page="'+ currentItemGroup +'"]:first'),
        lastItem            = $('.modal__item[data-group-page="'+ currentItemGroup +'"]:last');
  }else if( modal.hasClass('modal--carousel-section') ){
    var currentItemGroup    = currentItem.data('group-section'),
        nextItemGroup       = nextItem.data('group-section'),
        prevItemGroup       = prevItem.data('group-section'),
        firstItem           = $('.modal__item[data-group-section="'+ currentItemGroup +'"]:first'),
        lastItem            = $('.modal__item[data-group-section="'+ currentItemGroup +'"]:last');
  }

  if(direction == 'next'){
    //====================================
    // IF NEXT

    currentItem.addClass('is-closing-next').removeClass('is-open');
    // position next modal for animation
    if (nextItem && currentItemGroup === nextItemGroup ) {
      nextItem.addClass('is-next');
    } else {
      firstItem.addClass('is-next');
    }
    // delay to allow for CSS transition
    setTimeout(function() {
      currentItem.removeClass('is-closing-next').addClass('is-closed').hide();
    }, modalTransition);

    if ( nextItem && currentItemGroup === nextItemGroup ) {
      // shows next modal
      nextItem.show().removeClass('is-closed is-next').addClass('is-opening');
      setTimeout(function() {
        nextItem.removeClass('is-opening').addClass('is-open');
      }, modalTransition);
    } else {
      // isn't another modal in category so goes back to beginning
      firstItem.show().removeClass('is-closed is-next').addClass('is-opening');
      setTimeout(function() {
        firstItem.removeClass('is-opening').addClass('is-open');
      }, modalTransition);
    }



  }else if(direction == 'prev'){
    //====================================
    // IF PREVIOUS

    currentItem.addClass('is-closing-prev').removeClass('is-open');
    // position prev modal for animation
    if (prevItem && currentItemGroup === prevItemGroup ) {
      prevItem.addClass('is-prev');
    } else {
      lastItem.addClass('is-prev');
    }
    // delay to allow for CSS transition
    setTimeout(function() {
      currentItem.removeClass('is-closing-prev').addClass('is-closed').hide();
    }, modalTransition);

    if ( prevItem && currentItemGroup === prevItemGroup ) {
      // shows prev modal
      prevItem.show().removeClass('is-closed is-prev').addClass('is-opening');
      setTimeout(function() {
        prevItem.removeClass('is-opening').addClass('is-open');
      }, modalTransition);
    } else {
      // isn't another modal in category so goes back to beginning
      lastItem.show().removeClass('is-closed is-prev').addClass('is-opening');
      setTimeout(function() {
        lastItem.removeClass('is-opening').addClass('is-open');
      }, modalTransition);
    }

  }

}


// button press next/previous navigation
$('.js-modal-nav').on('click', function(event) {
  event.preventDefault();
  var navDirection = $(this).data('nav-direction');
  modalNav(navDirection);
});

// keyboard next/previous navigation
$(document).on('keyup', function(e) {
  if( $('.js-modal.is-open').hasClass('modal--carousel') ){
    if(e.which === 37){
      modalNav('prev');
    }else if(e.which === 39) {
      modalNav('next');
    }
  }
});



/*
var modal          = $('.js-modal'),
    modalLaunchBtn = $('.js-open-modal'),
    modalCloseBtn  = $('.js-close-modal');

// opens modal
function modalOpen(event, modalId){

  // is there a click event?
  if (event) {
    event.preventDefault();
    // find the modal id from clicked element
    var activeModalId = $(event.currentTarget).data('open-modal');
  } else {
    // find the modal id from passed string
    var activeModalId = modalId;
  }

  // find the active modal dom element
  var activeModal = $('*[data-modal-id="' + activeModalId + '"]');

  // disable scrolling on background content (doesn't work iOS)
  $('body').addClass('disable-scroll');

  // builds youtube video if needed
  if (activeModal.data('youtube-id')) {
    // get youtube id and target div
    var video     = activeModal.find('.js-modal-video'),
        youtubeId = activeModal.data('youtube-id');
    // insert the code into the target with the id and autoplay
    video.html('<div class="video__wrap"><iframe class="video" src="https://www.youtube.com/embed/' + youtubeId + '?rel=0&amp;showinfo=0&autoplay=1" frameborder="0" allowfullscreen="allowfullscreen"></iframe></div>');
  }

  // reveal the specific modal content
  activeModal.removeClass('is-closed').addClass('is-open');

  // open modal
  modal.fadeIn('250', function(){
    $(this).removeClass('is-closed').addClass('is-open');
  });
}

// closes modal
function modalClose(event){
  event.preventDefault();
  // enable scrolling
  $('body').removeClass('disable-scroll');
  // close modal with fade
  $('.modal__bg.is-open').fadeOut('250', function(){
    // close modal and active modal content
    $(this).removeClass('is-open').addClass('is-closed');
    $('.modal.is-open').removeClass('is-open').addClass('is-closed');
    // kill everything inside of video if its there
    $('.js-modal-video').empty();
  });
}


// launches modal when offer is clicked
modalLaunchBtn.on('click', function(event) {
  modalOpen(event);
});

// launches modal from url queryString
var modalQueryString = 'open-modal';
if (getQueryStringByName(modalQueryString)) {
  // find modal id & dom element
  var modalId = getQueryStringByName(modalQueryString);
  var modalElement = $('*[data-modal-id="' + modalId + '"]');
  // is there is a modal to open?
  if ( $(modalElement).length > 0 ) {
    // open without passing event
    modalOpen(null, modalId);
  }
}

// closes modal on close icon click
modalCloseBtn.on('click', function(event) {
  modalClose(event);
});

// closes modal on background click
modal.on('click', function(event) {
  if ($(event.target).hasClass('modal__wrap')){
    modalClose(event);
  }
});

// closes modal on escape key press
$(document).keyup(function(event) {
   if (event.keyCode == 27) {
     modalClose(event);
    }
});*/
