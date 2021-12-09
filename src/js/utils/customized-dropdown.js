($ => {
  $(() => {
    $('.customized-selected-option span').text(
      $('.voltaren-product-details-tab-links li.active')
        .children('a')
        .text()
    );

    $(document).on(
      'click',
      '.customized-dropdown .customized-selected-option',
      function() {
        $(this)
          .toggleClass('dropdown-open')
          .parents('.customized-dropdown')
          .find('ul')
          .slideToggle();
      }
    );

    $(document).on('click', '.customized-dropdown ul li', function() {
      if (screen.availWidth < 768) {
        $(this)
          .parents('.customized-dropdown')
          .find('.customized-selected-option span')
          .text(
            $(this)
              .children('a')
              .text()
          );

        $(this)
          .parents('.customized-dropdown ul')
          .slideToggle();

        $(this)
          .parents('.customized-dropdown')
          .find('.customized-selected-option')
          .toggleClass('dropdown-open');
      }
    });
  });
})(Cog.jQuery());
