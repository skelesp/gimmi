jQuery(document).ready(function () {
    "use strict"; // Start of use strict
    jQuery(window).trigger("resize");
    new_sticky();
    hidden_menu();
    init_classic_menu();
    backgroundImg_init();
	accordion_init();
	toggle_init();
	progressBar_init();
    progress_bar_loader();
	pageSliders_init();
    heightFull_init();
    YTVideo_init();
    filter_init();
    lightbox_init();
    counter_init();
    googleMap_init();
    masonry_init();
    shop_price_slider();
    list_grid_init();
    scrollTo_init();
    parallax_init();
    revolution_slider();
    scroll_top_init();
    is_mobile_device();
    gtc_touch_fix();
});

jQuery(window).load(function(){
    jQuery("body").addClass("loaded")
    filter_init();
    init_classic_menu_resize();
    progress_bar_loader ();
    owl_custom_carousel();
    jQuery("body").imagesLoaded(function(){
        jQuery(".preloader div").fadeOut();
        jQuery(".preloader").delay(200).fadeOut("slow");
    });
});

jQuery(window).resize(function(){
    init_classic_menu_resize();
    heightFull_init();
});

jQuery(window).scroll(function(){
    progress_bar_loader ();
});


// Background image function
function backgroundImg_init(){
    var pageSection = jQuery(".home-section, .page-section, .small-section, .blog-section, .small-section-2, .wish-image");
    pageSection.each(function(indx){
        if (jQuery(this).attr("data-background")){
            jQuery(this).css("background-image", "url(" + jQuery(this).data("background") + ")");
        }
    });
};


// Function for block height 100%
function height_line(height_object, height_donor){
    height_object.height(height_donor.height());
    height_object.css({
        "line-height": height_donor.height() + "px"
    });
};


var mobile_nav = jQuery(".mobile-nav");
var desktop_nav = jQuery(".desktop-nav");


// Main menu resize function
function init_classic_menu_resize(){
    jQuery(".mobile-on .desktop-nav > ul").css("max-height", jQuery(window).height() - jQuery(".main-nav").height() - 20 + "px");
    if (jQuery(window).width() <= 1024) {
        jQuery(".main-nav").addClass("mobile-on");
        if (jQuery('.inner-nav').hasClass('hidden-nav')) {
            jQuery('.inner-nav.hidden-nav').each(function(){
                jQuery(this).addClass('menu-opened');
            })
        };
    } else
        if (jQuery(window).width() > 1024) {
            jQuery(".main-nav").removeClass("mobile-on");
            desktop_nav.show();
            if (jQuery('.inner-nav').hasClass('hidden-nav')) {
                jQuery('.inner-nav.hidden-nav').each(function(){
                    jQuery(this).removeClass('menu-opened');
                })
            };
        }
};


// Hidden menu function
function hidden_menu () {
    if (jQuery('.inner-nav').hasClass('hidden-nav')) {
        jQuery('.inner-nav.hidden-nav').each(function(){
            jQuery(this).find('.menu-button').on( 'click', function(){
                jQuery(this).parent('.inner-nav.hidden-nav').toggleClass('menu-opened');
            });
        })
    };
};


// Sticky menu function
function new_sticky (){
    if (jQuery('.sticky-header').length) {
        var jQueryheader = jQuery( ".sticky-header" ).clone();
        jQuery('.page').prepend('<div class="sticky-header-container"></div>');
        jQuery('.sticky-header-container').html(jQueryheader);
        var lastScrollTop = 0;
        jQuery(window).scroll(function(event){
           var st = jQuery(this).scrollTop();
           if (st > lastScrollTop || st <= 120){
               jQuery('.sticky-header-container').removeClass('sticky-on');
           } else {
              if (jQuery(window).width() <= 1024) {
                jQuery('.sticky-header-container').removeClass('sticky-on');
              }else{
                jQuery('.sticky-header-container').addClass('sticky-on');
              }
           }
           lastScrollTop = st;
        });
    };
};


// Main menu function
function init_classic_menu(){
    mobile_nav.on( 'click', function(){
        if (desktop_nav.hasClass("js-opened")) {
            desktop_nav.slideUp("slow", "easeOutExpo").removeClass("js-opened");
            jQuery(this).removeClass("active");
        } else {
            desktop_nav.slideDown("slow", "easeOutQuart").addClass("js-opened");
            jQuery(this).addClass("active");
        }
    });
    desktop_nav.find("a:not(.nav-submenu)").on( 'click', function(){
        if (mobile_nav.hasClass("active")) {
            desktop_nav.slideUp("slow", "easeOutExpo").removeClass("js-opened");
            mobile_nav.removeClass("active");
        }
    });
    var navSubmenu = jQuery(".nav-submenu");
    var navThisLi;
    navSubmenu.on( 'click', function(){
        if (jQuery(".main-nav").hasClass("mobile-on")) {
            navThisLi = jQuery(this).parent("li:first");
            if (navThisLi.hasClass("js-opened")) {
                navThisLi.find(".submenu:first").slideUp(function(){
                    navThisLi.removeClass("js-opened");
                    navThisLi.find(".nav-submenu").find(".gtcicon-arrow-small-up:first").removeClass("gtcicon-arrow-small-up").addClass("gtcicon-arrow-small-down");
                });
            } else {
                jQuery(this).find(".gtcicon-arrow-small-down:first").removeClass("gtcicon-arrow-small-down").addClass("gtcicon-arrow-small-up");
                navThisLi.addClass("js-opened");
                navThisLi.find(".submenu:first").slideDown();
            }
            return false;
        }
    });
    navThisLi = navSubmenu.parent("li");
    navThisLi.hover(function(){
        if (!(jQuery(".main-nav").hasClass("mobile-on"))) {

            jQuery(this).find(".submenu:first").stop(true, true).fadeIn("fast");
        }
    }, function(){
        if (!(jQuery(".main-nav").hasClass("mobile-on"))) {
            jQuery(this).find(".submenu:first").stop(true, true).delay(100).fadeOut("fast");
        }
    });
};


function gtc_touch_fix (){
    if ( is_mobile_device() ){
        jQuery( ".page" ).on( "mouseenter", ".portfolio-item, .blog-hover, .team-item", function (e){
            e.preventDefault();
            jQuery( this ).trigger( "hover" );
        });
    }
}


// Accordion function
function accordion_init(){
	var allPanels = jQuery(".accordion > dd").hide();
	allPanels.first().slideDown("easeOutExpo");
	jQuery(".accordion").each(function () {
        jQuery(this).find("dt > a").first().addClass("active").parent().next().css({display: "block"});
    });
	jQuery(".accordion > dt > a").on( 'click', function(){
	    var current = jQuery(this).parent().next("dd");
	    jQuery(this).parents(".accordion").find("dt > a").removeClass("active");
        jQuery(this).addClass("active");
        jQuery(this).parents(".accordion").find("dd").slideUp("easeInExpo");
        jQuery(this).parent().next().slideDown("easeOutExpo");
	    return false;
	});
};


// Toggle function
function toggle_init(){
	var allToggles = jQuery(".toggle > dd").hide();
    jQuery(".toggle > dt > a").on( 'click', function(){
        if (jQuery(this).hasClass("active")) {
            jQuery(this).parent().next().slideUp("easeOutExpo");
            jQuery(this).removeClass("active");
        }
        else {
            var current = jQuery(this).parent().next("dd");
            jQuery(this).addClass("active");
            jQuery(this).parent().next().slideDown("easeOutExpo");
        }
        return false;
    });
};


// Progress bar function
function progressBar_init(){
	var progressBar = jQuery(".progress-bar");
    progressBar.each(function(indx){
        jQuery(this).css("width", jQuery(this).attr("aria-valuenow") + "%");
    });
};


// Progress bar loader function
function progress_bar_loader(){
    jQuery('.skill-bar-progress').each(function(){
        var el = this;
        if (is_visible(el)){
            if (jQuery(el).attr("processed")!="true"){
                jQuery(el).css("width","0%");
                jQuery(el).attr("processed","true");
                var val = parseInt(jQuery(el).attr("data-value"), 10);
                var fill = 0;
                var speed = val/100;
                var timer = setInterval(function (){
                    if (fill<val){
                        fill += 1;
                        jQuery(el).css("width",String(fill)+"%");
                        var ind = jQuery(el).parent().parent().find(".skill-bar-perc");
                        jQuery(ind).text(fill+"%");
                    }
                },(10/speed));
            }
        }
    });
};


// Visible function
function is_visible (el){
    var w_h = jQuery(window).height();
    var dif = jQuery(el).offset().top - jQuery(window).scrollTop();
    if ((dif > 0) && (dif<w_h)){
        return true;
    } else {
        return false;
    }
};


// Page slider carousel function
function pageSliders_init(){
    jQuery(".fullwidth-slider").owlCarousel({
        slideSpeed: 350,
        singleItem: true,
        autoHeight: true,
        navigation: false,
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
    });

    jQuery(".slider-1").owlCarousel({
        items: 3,
        itemsDesktop: [1199, 3],
        itemsTabletSmall: [768, 3],
        itemsMobile: [480, 1],
        navigation: true,
        pagination: false,
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
    });

    jQuery(".content-slider").owlCarousel({
        smartSpeed: 350,
        singleItem: true,
        loop: true,
        navigation: true,
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
    });

    jQuery(".main-slider").owlCarousel({
        smartSpeed: 350,
        singleItem: true,
        loop: true,
        navigation: false,
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
    });

	if (jQuery(".owl-carousel").length) {
        var owl = jQuery(".owl-carousel").data('owlCarousel');

    }
};

function owl_custom_carousel(){
    jQuery(".owl-custom-carousel").each(function(){

        jQuery(this).attr('data-carousel-collumn');
        var data_carousel_collumn = jQuery(this).attr('data-carousel-collumn') != undefined ? jQuery(this).attr('data-carousel-collumn') : 1;

        jQuery(this).owlCarousel({
            items: data_carousel_collumn,
            itemsDesktop: [1199, data_carousel_collumn],
            itemsTabletSmall: [768, data_carousel_collumn],
            itemsMobile: [480, 1],
            navigation: true,
            pagination: false,
            navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
        });

    });
}



// Height full function
function heightFull_init(){
    jQuery(".height-full").height(jQuery(window).height());
};


// Youtube video player
function YTVideo_init(){
    jQuery(".video, .resp-media, .blog-media").fitVids();
    jQuery(".work-full-media").fitVids();
};


// Filter function
function filter_init(){
    var fselector = 0;
    var filter_mode;
    jQuery('.portfolio-section').each(function(){
        var port_section = jQuery(this);
        if (jQuery(this).find(".filter-grid").hasClass("masonry")){
            filter_mode = "masonry";
        } else{
            filter_mode = "fitRows"
        }

        jQuery(this).find(".filter-grid").imagesLoaded(function(){
            jQuery(port_section).find(".filter-grid").isotope({
                itemSelector: '.all',
                layoutMode: filter_mode,
                filter: fselector
            });
        });
        jQuery(this).find(".filter").on( 'click', function(){
            jQuery(port_section).find(".filter").removeClass("active");
            jQuery(this).addClass("active");
            fselector = jQuery(this).attr('data-filter');

            jQuery(port_section).find(".filter-grid").isotope({
                itemSelector: '.all',
                layoutMode: filter_mode,
                filter: fselector
            });
            return false;
        });

    });
};


// Lightbox function
function lightbox_init(){
    jQuery(".lightbox").magnificPopup({
        gallery: {
            enabled: true
        }
    });
    jQuery(".lightbox-gallery-2").magnificPopup({
        gallery: {
            enabled: true
        }
    });
    jQuery(".lightbox-gallery-3").magnificPopup({
        gallery: {
            enabled: true
        }
    });
    jQuery(".lightbox-shop-1").magnificPopup({
        gallery: {
            enabled: true
        }
    });
    jQuery(".lightbox-single").magnificPopup({
        gallery: {
            enabled: false
        }
    });
};


// Counter function
function counter_init(){
    jQuery(".count-number").appear(function(){
        var count = jQuery(this);
        count.countTo({
            from: 0,
            to: count.html(),
            speed: 1300,
            refreshInterval: 60,
        });
    });
};


// Google map function
function googleMap_init(){
    var gmMapDiv = jQuery("#map-canvas");

    jQuery(".map-section").on( 'click', function(){
        jQuery(this).toggleClass("js-active");
        jQuery(this).find(".mt-open").toggle();
        jQuery(this).find(".mt-close").toggle();
    });

    if (gmMapDiv.length) {

        var gmCenterAddress = gmMapDiv.attr("data-address");
        var gmMarkerAddress = gmMapDiv.attr("data-address");


        gmMapDiv.gmap3({
            action: "init",
            marker: {
                address: gmMarkerAddress,
                options: {
                    icon: "images/map-marker.png"
                }
            },
            map: {
                    options: {
                        zoom: 17,
                        zoomControl: true,
                        zoomControlOptions: {
                            style: google.maps.ZoomControlStyle.SMALL
                        },
                        zoomControlOptions: {
                            position: google.maps.ControlPosition.LEFT_TOP
                        },
                        mapTypeControl: false,
                        scaleControl: false,
                        scrollwheel: false,
                        streetViewControl: false,
                        draggable: true,
                        styles: [{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#d3d3d3"}]},{"featureType":"transit","stylers":[{"color":"#808080"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#b3b3b3"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"weight":1.8}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#d7d7d7"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ebebeb"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#a7a7a7"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#efefef"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#696969"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#737373"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#d6d6d6"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#dadada"}]}]
                    }
                }
        });
    }
};


// Masonry function
function masonry_init(){
    jQuery(".masonry").imagesLoaded(function(){
        jQuery(".masonry").masonry();
    });
};


// Shop price slider function
function shop_price_slider(){
    var current_min_price
    var current_max_price
    window.shop_price_slider_params = {
        'currency_symbol' : '$',
        'currency_pos' : 'left',
    }
    // shop_price_slider_params is required to continue, ensure the object exists
    if ( typeof shop_price_slider_params === 'undefined' ) {
        return false;
    }
    // Get markup ready for slider
    jQuery( 'input#min_price, input#max_price' ).hide();
    jQuery( '.price_slider, .price_label' ).show();

    // Price slider uses jquery ui
    var min_price = jQuery( '.price_slider_amount #min_price' ).data( 'min' ),
        max_price = jQuery( '.price_slider_amount #max_price' ).data( 'max' );

    current_min_price = parseInt( min_price, 10 );
    current_max_price = parseInt( max_price, 10 );


    if ( shop_price_slider_params.min_price ) current_min_price = parseInt( shop_price_slider_params.min_price, 10 );
    if ( shop_price_slider_params.max_price ) current_max_price = parseInt( shop_price_slider_params.max_price, 10 );
    jQuery( 'body' ).bind( 'price_slider_create price_slider_slide', function( event, min, max ) {
        if ( shop_price_slider_params.currency_pos === 'left' ) {

            jQuery( '.price_slider_amount span.from' ).html( shop_price_slider_params.currency_symbol + min );
            jQuery( '.price_slider_amount span.to' ).html( shop_price_slider_params.currency_symbol + max );

        } else if ( shop_price_slider_params.currency_pos === 'left_space' ) {

            jQuery( '.price_slider_amount span.from' ).html( shop_price_slider_params.currency_symbol + " " + min );
            jQuery( '.price_slider_amount span.to' ).html( shop_price_slider_params.currency_symbol + " " + max );

        } else if ( shop_price_slider_params.currency_pos === 'right' ) {

            jQuery( '.price_slider_amount span.from' ).html( min + shop_price_slider_params.currency_symbol );
            jQuery( '.price_slider_amount span.to' ).html( max + shop_price_slider_params.currency_symbol );

        } else if ( shop_price_slider_params.currency_pos === 'right_space' ) {

            jQuery( '.price_slider_amount span.from' ).html( min + " " + shop_price_slider_params.currency_symbol );
            jQuery( '.price_slider_amount span.to' ).html( max + " " + shop_price_slider_params.currency_symbol );

        }

        jQuery( 'body' ).trigger( 'price_slider_updated', min, max );
    });

    jQuery( '.price_slider' ).slider({
        range: true,
        animate: true,
        min: min_price,
        max: max_price,
        values: [ current_min_price, current_max_price ],
        create : function( event, ui ) {

            jQuery( '.price_slider_amount #min_price' ).val( current_min_price );
            jQuery( '.price_slider_amount #max_price' ).val( current_max_price );

            jQuery( 'body' ).trigger( 'price_slider_create', [ current_min_price, current_max_price ] );
        },
        slide: function( event, ui ) {

            jQuery( 'input#min_price' ).val( ui.values[0] );
            jQuery( 'input#max_price' ).val( ui.values[1] );

            jQuery( 'body' ).trigger( 'price_slider_slide', [ ui.values[0], ui.values[1] ] );
        },
        change: function( event, ui ) {

            jQuery( 'body' ).trigger( 'price_slider_change', [ ui.values[0], ui.values[1] ] );

        },
    });
};


// List or Grid function
function list_grid_init(){
    jQuery(".shop.products:not(.list-view)").addClass("grid-view")
    jQuery("#shop-view a").on("click", function (){
        jQuery(this).addClass("active").siblings().removeClass("active");
        if (jQuery(this).hasClass("grid-view")) {
            if (jQuery(".shop.products").hasClass("grid-view")) {
                return false
            }else{
                jQuery(".shop.products").fadeOut(300,function(){
                    jQuery(".shop.products").addClass("grid-view").removeClass("list-view").fadeIn(300)
                })
            }
        }
        if (jQuery(this).hasClass("list-view")){
            if (jQuery(".shop.products").hasClass("list-view")) {
                return false
            }else{
                jQuery(".shop.products").fadeOut(300,function(){
                    jQuery(".shop.products").addClass("list-view").removeClass("grid-view").fadeIn(300)
                })
            }
        }
    })
};


// ScrollTo function
function scrollTo_init(){
    var elementClick,
        destination;
    jQuery("a.scrollto").on( 'click', function () {
        elementClick = jQuery(this).attr("href")
        destination = jQuery(elementClick).offset().top;
        jQuery("html:not(:animated),body:not(:animated)").animate({scrollTop: destination}, 1000, "easeInOutExpo");
    return false;
    });
};


// Parallax function
function parallax_init(){
    if ((jQuery(window).width() >= 1024)) {
        jQuery(".parallax-1").parallax("50%", 0.2);
    };
};


// Revolution slider function
function revolution_slider () {
    jQuery('.tp-banner-slider').on("revolution.slide.onloaded",function (e) {
        jQuery('.tp-banner-slider').css("opacity","1");
    });
    if ( jQuery('.tp-banner-slider').length ) {
        jQuery('.tp-banner-slider').revolution({
        responsiveLevels:[4096,1025,778,480],
        dottedOverlay:"custom",
        delay:9000,
        startwidth:1170,
        startheight:600,
        hideThumbs:10,
        navigation: {
            arrows:{enable:true}
        },
        fullWidth:"off",
        fullScreen:"on",
        forceFullWidth:"on",
        hideThumbsOnMobile:"off",
        hideNavDelayOnMobile:1500,
        hideBulletsOnMobile:"off",
        hideArrowsOnMobile:"off",
        hideThumbsUnderResolution:0,
        navigationType:"none"
        });
    };
};


// Scroll top function
function scroll_top_init(){
    jQuery('.local-scroll').on( 'click', function() {
        jQuery('html, body').animate({scrollTop: 0});
        return false;
    });
    if( jQuery(window).scrollTop() > 500 ) {
        jQuery('.local-scroll').addClass("active");
    } else {
        jQuery('.local-scroll').removeClass("active");
    }
    jQuery(window).scroll(function(){
        if( jQuery(window).scrollTop() > 500 ) {
            jQuery('.local-scroll').addClass("active");
        } else {
            jQuery('.local-scroll').removeClass("active");
        } ;
    });
};


// Mobile device detect function
function is_mobile_device() {
    if ( ( jQuery(window).width()<767) || (navigator.userAgent.match(/(Android|iPhone|iPod|iPad)/) ) ) {
        return true;
    } else {
        return false;
    }
}
