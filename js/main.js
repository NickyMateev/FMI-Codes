(function($) {
   "use strict";
    var $window = $(window),
        $html = $('html'),
        $body = $('body');
    
    $(document).ready(function(){ 
        
        // Disable Smooth Scroll on IE
        if(navigator.userAgent.match(/Trident\/7\./)) {
            $body.on("mousewheel", function () {
                event.preventDefault();
                var wd = event.wheelDelta;
                var csp = window.pageYOffset;
                window.scrollTo(0, csp - wd);
            });
        }
       
        // ** Convert Image to Background **
        var imgCont = $('.hero-bg-image-holder');
        imgCont.each(function(){
            var img = $(this).find('img'),
                imgSrc = img.attr('src');
            $(this).css({
                'backgroundImage':'url(" '+ imgSrc +' ")',
                'backgroundPosition':'center center',
                'backgroundRepeat':'no-repeat',
                'backgroundSize':'cover'
                
            });
            img.remove();
        });
        
        // ** Active Textual Form Element **
        $('.site-form, .mailchimp-form').each(function(){
            var formControl = $(this).find('.form-control');

            formControl.each(function(){
                var $this = $(this),
                    inputLbl = $this.siblings('label');            

                inputLbl.addClass('unfocused');

                if($this.val() !== '') {
                    inputLbl.removeClass('unfocused').addClass('focused');
                }

                $this.on('focus',function(){
                    inputLbl.removeClass('unfocused').addClass('focused');
                }).on('blur',function(){
                    if($this.val()==''){
                        inputLbl.removeClass('focused').addClass('unfocused');
                    }            
                });
            });
        }); 
        
        // ** Subscription Form
        var customForm = $('.site-form form');
        
        customForm.each(function(){
            var thisSiteForm = $(this);
            
            thisSiteForm.validator().on("submit", function (event) {
                if (event.isDefaultPrevented()) {                
                    formError();
                    submitMSG(false, "Did you fill in the form properly?");
                } else {               
                    event.preventDefault();
                    submitForm();
                }
            });
            
            function submitForm(){  
                var name = thisSiteForm.find("#hero-form-name").val() || thisSiteForm.find("#footer-signup-name").val(),
                    email = thisSiteForm.find("#hero-form-email").val() || thisSiteForm.find("#footer-signup-email").val(),    
                    terms =  $("hero-form-terms").val();

                $.ajax({
                    type: "POST",
                    url: "php/form-process.php",
                    data: "name=" + name + "&email=" + email + "&terms=" + terms,
                    success : function(text){
                        if (text == "success"){
                            formSuccess();
                        } else {
                            formError();
                            submitMSG(false,text);
                        }
                    }
                });
            }
            
            function formSuccess(){
                thisSiteForm[0].reset();
                submitMSG(true, "Message Submitted!")
            }
            
            function formError(){
                thisSiteForm.find('.has-error').removeClass('.has-error').addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    $(this).removeClass('.has-error shake animated');
                });
            }
            
            function submitMSG(valid, msg){
                if(valid){
                    var msgClasses = "text-success";
                } else {
                    var msgClasses = "text-danger";
                }
                thisSiteForm.find(".msgSubmit").removeClass('text-success, text-success hidden').addClass(msgClasses).text(msg);
            }
        });
        
        // ** Clients Slider **
        var clientsListBodyCarousel = $('.clients-list-body.owl-carousel');        
        if(clientsListBodyCarousel.length) {
            clientsListBodyCarousel.owlCarousel({
                autoWidth:true,            
                autoplay:true,
                nav:true,
                dots:false            
            });
        }       
        
        // ** Toggle Prices **
        $('.pricing-table-cont').each(function(){                        
            var tablePriceModule = $(this),
                pricingTableItem = tablePriceModule.find('.pricing-table-item'),
                pricingTableItemTotal = pricingTableItem.length,
                pricingTableItemPlan = pricingTableItem.find('.pricing-table-item-plan'),
                pricingTableItemPlanTotal = pricingTableItemPlan.length,
                targetItem,
                togglePriceBtns = $('.toggle-prices-btns'),
                togglePriceBtnsLi = togglePriceBtns.find('li');
            
            var targetItemAct = function(targetItem){
                var targetItemLink = targetItem.find('span').data()['time'],
                    targetItemContent = pricingTableItemPlan.filter(function(){
                        return $(this).data()['time'] === targetItemLink
                    });

                targetItem.addClass('active').siblings().removeClass('active');
                targetItemContent.removeClass('inactive').siblings().addClass('inactive');
            } 

            var tabNavFirst = function(){
                targetItem = togglePriceBtnsLi.filter(':first'); 
                targetItemAct(targetItem);
            } 
           
            if(pricingTableItemPlanTotal > pricingTableItemTotal) {
                
                tablePriceModule.addClass('price-table-action');
                
                pricingTableItem.each(function(){
                    $(this).find(pricingTableItemPlan).not(':first').addClass('inactive');
                })
                
                //targetItemAct(targetItem);      
                tabNavFirst();
                
                togglePriceBtnsLi.find('span').on('click',function(){
                    targetItem = $(this).parent();
                    targetItemAct(targetItem);
                });
            }
                
        });
        
        // ** Testimonials Slider        
        var testimonialListCarousel = $('.testimonials-list.owl-carousel');        
        if(testimonialListCarousel.length) {
            testimonialListCarousel.owlCarousel({
                items:1,
                autoplay:true,
                autoplayHoverPause:true,
                autoplayTimeout:11000,
                loop:true
            });
        } 
        
        // ** Sticky Nav for FAQS
        var faqNav = '.faq-nav',
            faqContent = '.faq-content';
        
        if($(faqNav).length || $(faqContent).length ) {
            $(faqNav).add(faqContent).theiaStickySidebar(); 
        }
        
        
        // ** Header Animation
        var topMainHeader = $('#top-main-header'),
            currScrollPos = 0,
            prevScrollPos = 0,
            extraOffset = topMainHeader.outerHeight() - 40;
            
        var headerScroll =  function() {
            currScrollPos = $window.scrollTop();
            
            if(currScrollPos > extraOffset) {
                topMainHeader.addClass('hide-header');
                
                if(prevScrollPos > currScrollPos){
                    topMainHeader.addClass('show-header').removeClass('hide-header');
                } else {
                    topMainHeader.removeClass('show-header');
                }

                prevScrollPos = currScrollPos;
                
            } else {
                topMainHeader.removeClass('hide-header');
            }
        }
        
        // WOW Initialize for Scroll Animations
        if($('.wow').length){
            new WOW().init();
        }         
        
        // Small Screen Menu
        var smlScrnTogBtn = $('<span class="sml-scrn-tog-btn ion-grid">Menu</span>'),
            closeMenu = $('<div class="close-menu"><span>Close Menu</span></div>'),
            smlScrnMenu = $('<div class="sml-scrn-menu"><div class="sml-scrn-menu-in"/></div>'),
            pageWrap = $('#page-wrap'),
            topHeaderIn = $('#top-main-header-in'),
            mainNavClone  = topHeaderIn.find('.main-nav').clone(),
            navBarRightClone = topHeaderIn.find('.navbar-right').clone();
        
        smlScrnMenu.prependTo($body).find('.sml-scrn-menu-in').append(closeMenu,mainNavClone,navBarRightClone);
        smlScrnTogBtn.appendTo(topHeaderIn);
        
        var smlScrnMenuMethods = {
             showMenu : function() {
                $body.add(pageWrap).removeAttr('style');
                $body.addClass('menu-open');
            },
            hideMenu : function() {
                 $body.removeClass('menu-open');
            }
        }     
        
        smlScrnTogBtn.on('click',function(){
            smlScrnMenuMethods.showMenu();
        });
        
        $(document).on('click',function(e){
            if($body.hasClass('menu-open') && $(e.target).is(pageWrap)){
                smlScrnMenuMethods.hideMenu();
            }
        });
            
        closeMenu.on('click',function(){
            smlScrnMenuMethods.hideMenu();
        });
        
        // FAQ Drop Down Select        
        $('<select/>').appendTo(faqNav);
        $('<option />', {
           "selected": "selected",
           "value"   : "",
           "text"    : "Go to..."
        }).appendTo(faqNav + ' select');
        
        $(faqNav + ' li').each(function(){
            var faqNavLink = $(this).find('a');
            
            $('<option />', {
               "value"   : faqNavLink.attr("href"),
               "text"    : faqNavLink.text()
            }).appendTo(faqNav + ' select');
        });
        
        $(faqNav + ' select').on('change',function(){
            window.location = $(this).find("option:selected").val();
        });
        
        // Custom Styled Select
        var select = $('select');
        select.each(function() {
           var $This = $(this),
               selectWrapper = $('<div class="selectWrapper"/>'),
               customSelectCont = $('<span class="customSelectCont"/>'),
               selectedOptText =  $This.find('option:selected').text();        

           $This.wrap(selectWrapper).after(customSelectCont);

           var showSelectedText = function(){
               $This.next().text(selectedOptText)
           }        
           showSelectedText()

           $This.on('change',function(){
               selectedOptText = $(this).find('option:selected').text()
               showSelectedText();
           });
        });
        
        // Magnific Pop Up For Embedded Videos
        var popUpVideos = $('.popup-youtube, .popup-vimeo');
        
        if(popUpVideos.length){
            popUpVideos.magnificPopup({
                disableOn: 700,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false
            });
        }
        
        // Window Viewport
        var viewPortCont = $('.view-port-size');
        
        var viewPortSize = function(){
            var windowH = $window.height();            
            viewPortCont.css({'height':windowH});
        }
        
        var resizeHandler = function(){
            viewPortSize();            
        };
        resizeHandler();
        
        // Window Scroll  Events
        $window.on('scroll',function(){
            headerScroll();
        }); 
        
        // Window Resize  Events
        $window.on('resize',function(){
            headerScroll();
            resizeHandler();
        });
        
    });

    $window.load(function() {        
        $('.preloader').addClass('slide-out');        
    });
    
})(jQuery);




