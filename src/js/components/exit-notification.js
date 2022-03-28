(function($) {
  const body = $('body');
  close = () => {
    $('.link-activated').removeClass('link-activated');
  };

  $(document).ready(e => {
    body
      .on('click', e => {
        let t = $(e.target);

        if (t.is('a.external, a.external *')) {
          e.preventDefault();
          t = t.closest('a').addClass('link-activated');
          let link = $('.link-activated').attr('href');

          window.open(link);
          close();
        }
      })
      .on('keydown', e => {
        if (e.keyCode === 27) close();
      });
  });
})(Cog.jQuery());
