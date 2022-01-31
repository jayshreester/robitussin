(function($) {
  'use strict';

  $('.video-int button').on('click keypress', function(e) {
    if (e.type == 'click' || (e.type == 'keypress' && e.which == 13)) {
      var url = decodeURIComponent($(this).attr('data-v-src'));

      $('.reference-video-player')
        .find('.video-content')
        .html(
          '<div class="video"><div class="close"></div><div class="iframe-container"><iframe class="responsive-iframe" id="ytplayer" type="text/html" src=" ' +
            url +
            '" frameborder="0" allowfullscreen></iframe></div></div>'
        );
      $('.reference-pop-up-video').show();

      $('.video .close').on('click', closeVideo);

      return false;
    }
  });

  function closeVideo() {
    $('.reference-pop-up-video').hide();

    $('.video-content').html('');
  }
})(Cog.jQuery());
