(function($) {
   "use strict";
    
    var $window = $(window),
        $html = $('html'),
        $body = $('body');
    
    $(document).ready(function(){
        // ** Main Logo Scroll
        $('.navbar-brand').on('click',scrollmenuClick);

        // ** Top CTA
        $('.top-cta').on('click',scrollmenuClick);

        // ** Learn More CTA
        $('.more-link').on('click',scrollmenuClick);

        // ** Menu and FAQ Scroll
        var scrollMenuLink = '.main-nav li a, .faq-nav li a',
            scrollContentSection = $('.page-sections, .faq-content-grp');

        function scrollmenuClick(event){
            if($html.hasClass('ie9')) {
                event.returnValue = false;
                event.cancelBubble = true;
            } else {
                event.preventDefault();  
            }
                      
            var targetelem = $(this).attr('href');            
            $html.add($body).stop().animate({'scrollTop': $(targetelem).offset().top},800);
        }

        function contentScroll(){
            $(scrollMenuLink).each(function(){
                var windowPosition = $(window).scrollTop(),
                    linkIndex = $(this).attr('href'),
                    selectedContentSections = scrollContentSection.filter(linkIndex),
                    targetPos = selectedContentSections.offset().top,
                    targetHeight = selectedContentSections.outerHeight();

                if((windowPosition + 150) >= targetPos && (windowPosition + 150) <= (targetPos + targetHeight)  ){
                    $(this).parent().addClass('active').siblings().removeClass('active');                    
                } 
                else {
                     $(this).parent().removeClass('active')
                }

            });
        } 

        if($(scrollMenuLink).length && scrollContentSection.length ) {
            contentScroll(); 
            $(document).on('click',scrollMenuLink,scrollmenuClick);
        }

        $window.on('scroll',function(){            
            contentScroll();      
        }); 

        $window.on('resize',function(){            
            contentScroll();        
        });
    });
    
})(jQuery);