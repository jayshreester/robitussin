($ => {
  $(() => {
    var getHeading_1_Lightbox_apply_class = '';

    $(document).on('click', '.grid-gallery .products-filter', function() {
      if (
        $(this)
          .parents('.grid-gallery')
          .hasClass('grid-gallery-cards')
      ) {
        return false;
      }

      if ($('.lightbox-overlay').length <= 0) {
        $('.lightbox').after("<div class='lightbox-overlay'></div>");
      }

      var getHeading_1_Lightbox = '';

      if ($(this).hasClass('products-category-01')) {
        getHeading_1_Lightbox = $('.voltaren-filter-section')
          .find('li.products-category-01')
          .text();
        getHeading_1_Lightbox_apply_class = 'products-category-01';
      } else if ($(this).hasClass('products-category-02')) {
        getHeading_1_Lightbox = $('.voltaren-filter-section')
          .find('li.products-category-02')
          .text();
        getHeading_1_Lightbox_apply_class = 'products-category-02';
      } else if ($(this).hasClass('products-category-03')) {
        getHeading_1_Lightbox = $('.voltaren-filter-section')
          .find('li.products-category-03')
          .text();
        getHeading_1_Lightbox_apply_class = 'products-category-03';
      } else if ($(this).hasClass('products-category-04')) {
        getHeading_1_Lightbox = $('.voltaren-filter-section')
          .find('li.products-category-04')
          .text();
        getHeading_1_Lightbox_apply_class = 'products-category-04';
      }

      $('.lightbox .image.first img').attr(
        'src',
        $(this)
          .find('.lightbox-image-big')
          .find('img')
          .attr('src')
      );

      $('.lightbox .lightbox-heading-1')
        .text(getHeading_1_Lightbox)
        .addClass(getHeading_1_Lightbox_apply_class);

      $('.lightbox .lightbox-heading-2').text(
        $(this)
          .find('.movebox-hover')
          .next()
          .next('.even')
          .text()
      );
      $('.lightbox .lightbox-content').text(
        $(this)
          .find('.lightbox-content')
          .text()
      );

      $('body').addClass('display-lightbox');
    });

    $(document).on('click', '.lightbox-close', function() {
      $('.lightbox-overlay').fadeOut('slow', function() {
        $('.lightbox-overlay').remove();
        $('.lightbox .lightbox-heading-1').removeClass(
          getHeading_1_Lightbox_apply_class
        );
      });

      $('body').removeClass('display-lightbox');
    });
  });
})(Cog.jQuery());
