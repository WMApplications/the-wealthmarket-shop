/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var productsin;
var input;
var pagecheck;
var cur_page;
var extension = "", userid, type, username, cart, carttotalamount, availableBalance;
var userdata = new Array();
function performPageActions() {
    verifyUser();
    var page = getCurrentPage();
    userid = $("#userid").val();
    cart = $("#cart").val();
    type = $("#usertype").val();
    username = $("#username").val();

    if (page === "index.jsp") {
        extension = "";
        GetData("Category", "GetMenuCategories", "LoadAllProductCategories", 3);
        GetData("Category", "GetTopCategories", "LoadTopCategories");
        GetData("Product", "GetFeaturedProducts", "LoadFeaturedProducts");
        GetData("Product", "GetFeaturedProducts", "LoadLeftFeatureProducts");
        GetData("Product", "GetLatestProducts", "LoadLatestProducts");
        GetData("Product", "GetTopDeals", "LoadTopDeals");

        PopulateStates("");
        GetData("Product", "GetUserCartCount", "LoadCartCount");
        GetData("Product", "GetCateogryProducts", "LoadCateogryProducts");

        var image_url = extension + "global_assets/images/wm/wm-name3.png";
        $(".headerImage").attr("src", image_url);
        var image_url2 = extension + "global_assets/images/wm/wmlogo-black.png";
        $(".topdownImage").attr("src", image_url2);
        var bannerImage1url = extension + "global_assets/images/banner/banner06.jpg";
        $(".bannerImage1").attr("src", bannerImage1url);
        var bannerImage2url = extension + "global_assets/images/banner/banner07.jpg";
        $(".bannerImage2").attr("src", bannerImage2url);
        var bannerImage3url = extension + "global_assets/images/banner/banner08.jpg";
        $(".bannerImage3").attr("src", bannerImage3url);
        var bannerImage4url = extension + "global_assets/images/banner/banner09.jpg";
        $(".bannerImage4").attr("src", bannerImage4url);
    } else if (page === "login.jsp") {
        extension = "../../";
        $("form").parsley();
    } else if (page === "deals.jsp") {
        extension = "../../../";
        GetData("Product", "GetPromoProducts", "LoadPromoResults");
    } else if (page === "checkout.jsp") {
        extension = "../../../";
        GetData("Product", "GetUserCartList", "LoadCartList");
        GetData("Accounts", "GetUserAvailableBalance", "LoadUserAvailableBalance");
        ///GetData("User", "GetStates", "LoadStates");
        PopulateStates("");
        GetData("Product", "GetPickUpStates", "LoadPickUpStates");
    } else if (page === "cart.jsp") {
        extension = "../../../";
        GetData("Product", "GetUserCartList", "LoadCartList");
        GetData("Product", "GetUserCartCount", "LoadCartCount");
    } else if (page === "products.jsp") {
        extension = "../../../";
        var category_id = $("#catID").val();
        var query = $("#query").val();
        sessionStorage.setItem("catid", category_id);
        var sort_by = document.getElementById("sortby").value;
        var data = [category_id, query, 0, sort_by];
        GetData("Product", "GetProducts", "LoadSearchResults", data);
        GetData("Product", "GetLeftFeaturedProducts", "LoadLeftFeatureProducts");
        GetData("Product", "GetProductSubCategories", "LoadProductSubCategories", category_id);
    } else if (page === "product_details.jsp") {
        extension = "../../../";
        var productid = $("#productid").val();
        var data = [productid];
        GetData("Product", "GetProductDetails", "LoadProductDetails", data);
        data = [productid, 10];//10 for the count
        GetData("Product", "GetProductReviews", "LoadGetProductReviews", data);
        GetData("Product", "GetLeftFeaturedProducts", "LoadLeftFeatureProducts");
        GetData("Product", "GetRelatedProducts", "LoadRelatedProducts", productid);
    } else if (page === "categories.jsp") {
        extension = "../../../";
        GetData("Category", "GetAllCategories", "LoadGetAllCategories");
    } else if (page === "product_review.jsp") {
        extension = "../../../";
        var productid = $("#productid").val();
        var data = [productid];
        GetData("Product", "GetProductDetails", "LoadProductDetails", data);
        $('.live-rating').text(3.0);
        $(".my-rating-6").starRating({
            initialRating: 3,
            totalStars: 5,
            emptyColor: 'lightgray',
            hoverColor: 'yellow',
            activeColor: 'cornflowerblue',
            disableAfterRate: false,
            minRating: 1,
            useGradient: false,
            strokeWidth: 0,
            readOnly: false,
            onHover: function (currentIndex, currentRating, $el) {
                $('.live-rating').text(currentIndex);
            },
            onLeave: function (currentIndex, currentRating, $el) {
                $('.live-rating').text(currentRating);
            },
            callback: function (currentRating, $el) {
                $('.live-rating').text(currentRating);
            }
        });
    } else if (page === "services.jsp") {
        extension = "../../../";
        GetData("Product", "GetUserCartCount", "LoadCartCount");
    } else if (page === "profile.jsp") {
        extension = "../../../";
        GetData("Product", "GetUserCartCount", "LoadCartCount");
        GetData("Product", "GetUserProductReviews", "LoadUserProductReviews", userid);
        GetData("Accounts", "GetUserAvailableBalance", "LoadUserAvailableBalance");
        //GetData("User", "GetStates", "LoadStates");
        PopulateStates("");
        $("#id_profile").addClass("active bg-white blacktext");
    } else if (page === "wishlist.jsp") {
        extension = "../../../";
        GetData("Product", "GetUserWishList", "LoadWishList", userid);
        $("#id_wishlist").addClass("active bg-white blacktext");
    } else if (page === "order.jsp") {
        extension = "../../../";
        var data = [userid, "All"];
        sessionStorage.setItem("ordertype", "All");
        GetData("Product", "GetUserOrderList", "LoadOrderList", data);
        $("#id_orders").addClass("active bg-white blacktext");
    } else if (page === "order_status.jsp") {
        extension = "../../../";

        orderStatusPageFunction();
    }

    btnEvents();
    General();
    CheckUser();
    AppFunctions();
    GreetingMessage();

}

function GetExtension() {
    return extension;
}

function CheckUser() {
    var result = false;
    if (userid === "null" || userid === "" || userid === null || userid === "undefined" || userid === undefined) {
        result = false;
    } else if (userid !== "null" || userid !== "" || userid !== null || userid !== "undefined" || userid !== undefined) {
        result = true;
    }
    return result;
}
function GreetingMessage() {
    var thehours = new Date().getHours();
    var themessage;
    var morning = ('Good Morning');
    var afternoon = ('Good Afternoon');
    var evening = ('Good Evening');

    if (thehours >= 0 && thehours < 12) {
        themessage = morning;

    } else if (thehours >= 12 && thehours < 17) {
        themessage = afternoon;

    } else if (thehours >= 17 && thehours < 24) {
        themessage = evening;
    }
    $('.greeting').append(themessage);

}

function regFunctions() {
    $("#datepicker-autoclose").datepicker({
        autoclose: true,
        todayHighlight: true
    });
    $("form").parsley();

}

function AppFunctions() {
    GetData("Category", "GetAllCategories", "LoadGetAllCategories");
    GetData("Category", "GetDropDownCategories", "LoadDropDownCategories");
    GetData("User", "GetMemberDetails", "LoadMemberDetails", userid);
    GetData("Category", "GetMenuCategories", "LoadMenuCategories", 4);
    GetData("Product", "GetUserCartCount", "LoadCartCount");
    $('[data-toggle="tooltip"]').tooltip();

    $(".selectpicker").change(function () {
        var opt = $(this).val();
        var data;
        var catid = sessionStorage.getItem("catid");
        data = [catid, opt];
        GetData("Product", "GetProductSorting", "LoadProductSorting", data);
    });

}

function SlideFunctions() {
    $("#intro").vegas({
        autoplay: true,
        shuffle: true,
        delay: 5000,
        timer: false,
        loop: true,
        transition: ['slideLeft', 'slideRight', 'swirlRight', 'fade'],
        transitionDuration: 2000,
        slides: [
            {src: "assets/images/SlideShowImages/shopbanner1.jpg"},
            {src: "assets/images/SlideShowImages/shopbanner2.jpg"},
            {src: "assets/images/SlideShowImages/shopbanner3.jpg"},
            {src: "assets/images/SlideShowImages/shopbanner4.jpg"},
            {src: "assets/images/SlideShowImages/shopbanner5.jpg"}
        ]
    });
    $("#leftarrow").click(function () {
        $("#intro").vegas('options', 'transition', 'slideRight2').vegas('previous');
    });

    $("#rightarrow").click(function () {
        $("#intro").vegas('options', 'transition', 'slideLeft2').vegas('next');
    });
}

function btnEvents() {
//document.getElementById("sortby").onchange = function () {
//    var sort = this.value;
//    sorting();
//};
    var slider = document.getElementById('price-slider');
    if (slider) {
        noUiSlider.create(slider, {
            start: [0, 763099],
            connect: true,
            tooltips: [true, true],
            format: {
                to: function (value) {
                    return '₦' + value.toFixed(0);
                },
                from: function (value) {
                    return value
                }
            },
            range: {
                'min': 0,
                'max': 763099
            }
        });
        slider.noUiSlider.on('update', function (values, handle) {
            var minValue = values[0];
            var maxValue = values[1];
            var data = null;
            if (handle) {
                $(".maxAmount").val(maxValue);
                var minvalue = minValue.replace("₦", "");
                var maxvalue = maxValue.replace("₦", "");
                catid = sessionStorage.getItem("catid");
                //   data = [minvalue, maxvalue, catid];
                //  GetData("Product", "GetProductPriceRange", "LoadProductPriceRange", data);
            } else {
                $(".minAmount").val(minValue);
                var minvalue = minValue.replace("₦", "");
                var maxvalue = maxValue.replace("₦", "");
                catid = sessionStorage.getItem("catid");
                //   data = [minvalue, maxvalue, catid];
                // GetData("Product", "GetProductPriceRange", "LoadProductPriceRange", data);
            }
        });
        // response to the click of a slider
        slider.addEventListener('stop' && 'mouseup', function () {
            sorting();
        });
    }

    $("#CallShop").click(function () {
        window.location = extension + "LinksServlet?type=Index";
    });

    $("#PrintOrderSummary").click(function () {
        window.print();
    });

    $("#printOrderDetials").click(function () {
        window.print();
    });

    $(".show-list").addClass("hide");
    $("#show-on-list").click(function () {
        if ($(".show-list").hasClass("hide")) {
            $(".show-list").removeClass("hide");
            $(".show-list").show(500);
        } else {
            $(".show-list").addClass("hide");
        }
    });

    $("#btngridView").click(function () {
        $("#listView").removeClass("products-list");
        $("#listView").hide();
        $("#gridView").addClass("products-list");
        $("#gridView").show();
    });

    $("#btnlistView").click(function () {
        $("#listView").addClass("products-list");
        $("#listView").show();
        $("#gridView").removeClass("products-list");
        $("#gridView").hide();
    });

    $("#btnEmptyCartItem").click(function () {
        EmptyCartList();
    });
    $("#callAllProduct").click(function () {
        LoadProductPage(0);
    });
    $("#PayWithCash").click(function () {
        var FinalTotalAmount = $("#FinalTotalAmount").text();
        var newfinalAmt = FinalTotalAmount.replace("₦", "").replace(",", "");
        var email = $("#useremail").val();
        var newPaymentAmount = CalculatePercentage(newfinalAmt);
        var amount = $.trim(newfinalAmt);
        payWithPaystack(userid, newPaymentAmount, email, amount, "Shop Cash Payment");
    });

    $("#cancelOrder").click(function () {
        var orderid = $("#OrderID").text();
        var data = [userid, orderid];
        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No!',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: false
        }).then(function (dismiss) {
            if (dismiss.value) {
                GetData("Product", "CancelOrder", "LoadOrderOption", data);
            } else {
                swal({
                    title: 'Safe',
                    text: "Your order is safe!",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'Ok!',
                    confirmButtonClass: 'btn btn-success',
                    buttonsStyling: false
                });
            }
        });
    });

    $("#btnRemoveAllFromCart").click(function () {
        swal({
            title: 'Empty Cart?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No!',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: false
        }).then(function (dismiss) {
            if (dismiss.value) {
                EmptyWishList();
            } else {
                swal({
                    title: 'Safe',
                    text: "Your wishlist is safe!",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'Ok!',
                    confirmButtonClass: 'btn btn-success',
                    buttonsStyling: false
                });
            }
        });
    });

    $("#btnAddAllToCart").click(function () {
        swal({
            title: 'Add all to cart',
            text: "All all items on your wishlist to cart?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No!',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: false
        }).then(function (dismiss) {
            if (dismiss.value) {
                AddAllToCart();
            } else {
                swal({
                    title: 'Safe',
                    text: "Your wishlist is safe!",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'Ok!',
                    confirmButtonClass: 'btn btn-success',
                    buttonsStyling: false
                });
            }
        });
    });

    $(".btnCheckOut").click(function () {
        if (CheckUser()) {
            window.location = extension + "ControllerServlet?action=Link&type=CheckOut";
        } else {
            swal({
                title: "Login",
                text: "Please login to checkout",
                type: "success",
                showCancelButton: true, confirmButtonClass: 'btn btn-success btn-sm',
                confirmButtonText: "Login",
                cancelButtonText: "Cancel",
                cancelButtonClass: 'btn btn-primary btn-sm'
            }, function (isConfirm) {
                if (isConfirm) {
                    sessionStorage.setItem("redirect", "checkout");
                    window.location = extension + "ControllerServlet?action=Link&type=Login";
                } else {
                }
            });
        }
    });

    $(".BackToShop").click(function () {
        window.location = extension + "LinksServlet?type=Index";
    });
    $(".ViewOrder").click(function () {
        window.location = extension + "ControllerServlet?action=Link&type=Orders";
    });
    $("#writeReview").click(function () {
        $('#nav-tab a[href="#nav-review"]').tab('show');
    });
    $("#ViewDesc").click(function () {
        $('#nav-tab a[href="#nav-desc"]').tab('show');
    });
    $("#ViewInfo").click(function () {
        $('#nav-tab a[href="#nav-info"]').tab('show');
    });
    $(".ViewContact").click(function () {
        window.open('http://thewealthmarket.com/WMarketPortal/pages/general/terms.jsp', '_blank');
    });

    $("#resetPassword").click(function () {
        window.location = extension + "LinksServlet?type=Reset";
    });
    $("#CallLogin").click(function () {
        window.location = extension + "LinksServlet?type=Login";
    });
    $("#Terms").click(function () {
        window.location = extension + "LinksServlet?type=Terms";
    });


    $("form[name=loginForm]").submit(function (e) {
        var f = $(this);
        f.parsley().validate();
        if (f.parsley().isValid()) {
            var email_phone = $(".email").val();
            var password = $("#pass").val();
            var data = [email_phone, password];
            GetData("User", "Login", "LoadUserLogin", data);
        } else {
            swal({
                title: "Login Error",
                text: "Please check login details",
                type: "error",
                showCancelButton: false,
                confirmButtonClass: 'btn btn-danger',
                confirmButtonText: 'Ok!'
            });
        }
        e.preventDefault();
    });


    $("#CallLogout").click(function () {
        window.location = extension + "LinksServlet?type=Home";
    });
    $(".CallProfile").click(function () {
        GetData("User", "GetMemberDetails", "LoadMemberDetails", userid);
    });
    $("#CallWishList").click(function () {
        GetData("Product", "GetUserWishList", "LoadWishList", userid);
    });
    $("#CallOrders").click(function () {
        var data = [userid, "All"];
        sessionStorage.setItem("ordertype", "All");
        GetData("Product", "GetUserOrderList", "LoadOrderList", data);
    });
    $("#AllOrds").click(function () {
        var data = [userid, "All"];
        sessionStorage.setItem("ordertype", "All");
        GetData("Product", "GetUserOrderList", "LoadOrderList", data);
    });
    $("#PendingOrds").click(function () {
        var data = [userid, "Pending"];
        sessionStorage.setItem("ordertype", "Pending");
        GetData("Product", "GetUserOrderList", "LoadOrderList", data);
    });
    $("#ProocessingOrds").click(function () {
        var data = [userid, "Processing"];
        sessionStorage.setItem("ordertype", "Processing");
        GetData("Product", "GetUserOrderList", "LoadOrderList", data);
    });
    $("#ShippedOrds").click(function () {
        var data = [userid, "Shipped"];
        sessionStorage.setItem("ordertype", "Shipped");
        GetData("Product", "GetUserOrderList", "LoadOrderList", data);
    });
    $("#CancelledOrds").click(function () {
        var data = [userid, "Cancelled"];
        sessionStorage.setItem("ordertype", "Cancelled");
        GetData("Product", "GetUserOrderList", "LoadOrderList", data);
    });
    $("#DeliveredOrds").click(function () {
        var data = [userid, "Delivered"];
        sessionStorage.setItem("ordertype", "Delivered");
        GetData("Product", "GetUserOrderList", "LoadOrderList", data);
    });
    $("#ViewProfile").click(function () {
        GetData("User", "GetMemberDetails", "LoadMemberDetails", userid);
    });

    $(".searchBtn").click(function () {
        var query = $(".searchTxt").val();
        if (query.length !== 0) {
            window.location = extension + "ControllerServlet?action=Link&type=Search&cat=0&query=" + query;
        }
    });


    $(".newstates").change(function () {
        var stateid = $(this).val();
        GetData("User", "GetLGAs", "LoadLGAs", stateid);
        GetData("User", "GetTowns", "LoadTowns", stateid);
    });


    $("#PlaceOrder").click(function () {
        var OrderAmount = $("#FinalTotalAmount").text();
        var DeliveryFees = $("#DeliveryFees").text();
        var FinalOrderAmount = OrderAmount.replace("₦", "").replace(",", ""); //total order amount
        var FinalDeliveryFees = DeliveryFees.replace("₦", "").replace(",", "");//total delivery fees
        FinalOrderAmount = $.trim(FinalOrderAmount);
        if (FinalOrderAmount >= availableBalance) {
            swal({
                title: "Oops! ",
                text: "Insufficient Market Warrant!",
                type: "error",
                confirmButtonClass: 'btn btn-danger btn-sm',
                confirmButtonText: 'Ok'
            });
        } else {
            PlaceOrder(FinalOrderAmount, FinalDeliveryFees, "WithWarrant");
        }
    });


    $(".addToCart").click(function () {
        var pid = $(this).closest(".product_details_text").find(".product-details-id").text();
        var price = $(this).closest(".product_details_text").find(".product-details-price").text().replace(",", "").replace("₦", "");
        var qty = $(this).closest(".product_details_text").find(".qty").val();
        var newprice = parseInt(price) * parseInt(qty);
        ShopAddToCart(pid, qty, newprice);
    });
    $(".WriteAReview").click(function () {
        var pid = $(".product_details_text").find(".product-details-id").text();
        if (CheckUser()) {
            window.location = extension + "ControllerServlet?action=Link&type=ProductReview&productid=" + pid;
        } else {
            swal({
                title: "Oops!",
                text: "Please login to write a review",
                type: "info",
                showCancelButton: true,
                confirmButtonClass: 'btn btn-info btn-sm',
                confirmButtonText: 'Login',
                cancelButtonText: "Cancel",
                cancelButtonClass: 'btn btn-primary btn-sm'
            }, function (isConfirm) {
                if (isConfirm) {
                    sessionStorage.setItem("redirect", "review");
                    sessionStorage.setItem("productid", pid);
                    window.location = extension + "ControllerServlet?action=Link&type=Login";
                } else {
                }
            });
        }
    });

    $(".BackToProduct").click(function () {
        var pid = $(".product_details_text").find(".product-details-id").text();
        window.location = extension + "ControllerServlet?action=Link&type=ProductDetails&productid=" + pid;
    });

    $(".addToWishList").click(function () {
        var pid = $(this).closest(".product-box-gen").find(".product-id-gen").text();
        $("#con-close-modal").modal("hide");
        AddToWishList(pid);
    });

    $("#enableCartReview").click(function () {
        $("#ReviewContainer").removeClass("hide");
        $("#ReviewContainer").show();
    });



    $("#SubmitReview").click(function () {
        var rateIndex;
        var pid = $(".product_details_text").find(".product-details-id").text();
        var comment = $("#review").val();
        var ratevalue = $('.live-rating').text();
        var rateIndex = Math.trunc(ratevalue);
        var data = [userid, pid, rateIndex, comment];
        GetData("Product", "ReviewProduct", "LoadReviewProduct", data);
    });

    //*************** EBUKA ADDITIONS ************************
    $("#states").change(function () {
        var stateid = $(this).val();
        if (stateid === "24" || stateid === "27") {
            $("#lcdas").show();
        }
        PopulateLGAs(stateid, ""); //populates the lga section
        PopulateLCDAsFromState(stateid, ""); //populates the lcda section
        PopulateTownsFromState(stateid, "");
    });
    $("#lgas").change(function () {
        var lgaid = $(this).val();
        PopulateLCDAsFromLGA(lgaid, ""); //populates the lcda section
        PopulateTownsFromLGA(lgaid, ""); //populates the town section
        PopulateBstopsFromLGA(lgaid, ""); //populates the busstop section
    });
    $("#lcdas").change(function () {
        var lcdaid = $(this).val();
        PopulateTownsFromLCDA(lcdaid, ""); //populates the town section
        PopulateBstopsFromLCDA(lcdaid, ""); //populates the bstop section

        SetLCDAValues1("state"); //sets the vale of the state to that corresponding to users choice
        SetLCDAValues1("lga");
    });
    $("#towns").change(function () {
        var townid = $(this).val();
        PopulateBstopsFromTown(townid, ""); //populates the bus stop section
        PopulateStreetsFromTown(townid, ""); //populates the street section

        SetTownValues1("state"); //sets the value of the state based on the corresponding user choice
        SetTownValues1("lga"); //sets the value of that LGA section based on the user choice
        SetTownValues1("lcda"); //sets the vale of the LCDA section to that corresponding to the user choice
    });
    $("#busstops").change(function () {
        var bstopid = $(this).val();
        PopulateStreetsFromBstop(bstopid, ""); //populates the  street section

        SetBstopValues1("lga"); //sets the value of the LGA section to that corresponding to the user choic
        SetBstopValues1("lcda"); //sets the value of the LCDA section to that corresponding to the user choice
        SetBstopValues1("town"); //sets the value of the Town to that corresponding to the user choice
    });
    $("#streets").change(function () {
        SetStreetValues1("town"); //sets the value of the town section to that corresponding to the users choice
        SetStreetValues1("bstop"); //sets the value of the bus stop section based on the user choice
    });

    $("#userstates").change(function () {
        var stateid = $(this).val();
        if (stateid === "24" || stateid === "27") {
            $("#userlcdas").show();
        }
        PopulateLGAs(stateid, ""); //populates the lga section
        PopulateLCDAsFromState(stateid, ""); //populates the lcda section
        PopulateTownsFromState(stateid, "");
    });
    $("#userlgas").change(function () {
        var lgaid = $(this).val();
        PopulateLCDAsFromLGA(lgaid, ""); //populates the lcda section
        PopulateTownsFromLGA(lgaid, ""); //populates the town section
        PopulateBstopsFromLGA(lgaid, ""); //populates the busstop section
    });
    $("#userlcdas").change(function () {
        var lcdaid = $(this).val();
        PopulateTownsFromLCDA(lcdaid, ""); //populates the town section
        PopulateBstopsFromLCDA(lcdaid, ""); //populates the bstop section

        SetLCDAValues("state"); //sets the vale of the state to that corresponding to users choice
        SetLCDAValues("lga");
    });
    $("#usertowns").change(function () {
        var townid = $(this).val();
        PopulateBstopsFromTown(townid, ""); //populates the bus stop section
        PopulateStreetsFromTown(townid, ""); //populates the street section

        SetTownValues("state"); //sets the value of the state based on the corresponding user choice
        SetTownValues("lga"); //sets the value of that LGA section based on the user choice
        SetTownValues("lcda"); //sets the vale of the LCDA section to that corresponding to the user choice
    });
    $("#userbusstops").change(function () {
        var bstopid = $(this).val();
        PopulateStreetsFromBstop(bstopid, ""); //populates the  street section

        SetBstopValues("lga"); //sets the value of the LGA section to that corresponding to the user choic
        SetBstopValues("lcda"); //sets the value of the LCDA section to that corresponding to the user choice
        SetBstopValues("town"); //sets the value of the Town to that corresponding to the user choice
    });
    $("#userstreets").change(function () {
        SetStreetValues("town"); //sets the value of the town section to that corresponding to the users choice
        SetStreetValues("bstop"); //sets the value of the bus stop section based on the user choice
    });
    $("form[name=addressForm]").submit(function (e) {
        var f = $(this);
        f.parsley().validate();
        if (f.parsley().isValid()) {
            var checker = $("#checker").val();
            var addressname = $("#useraddressname").val();
            var states = $("#userstates").val();
            var lgas = $("#userlgas").val();
            var lcdas = $("#userlcdas").val();
            var towns = $("#usertowns").val();
            var busstop = $("#userbusstops").val();
            var street = $("#userstreets").val();
            var desc = $("#userdesc").val();

            if (checker === "add" || checker === "Add") {
                var data = [addressname, states, lgas, lcdas, towns, busstop, street, desc, userid];
                sessionStorage.setItem("addressdisplayIn", "Profile");
                GetData("Product", "AddNewUserAddress", "LoadUserAddress", data);
            } else {
                var data = [addressname, states, lgas, lcdas, towns, busstop, street, desc, checker];
                GetData("Product", "EditNewUserAddress", "LoadAddUserAddressAfterEdit", data);
            }

        } else {
            swal({
                title: "Oop!!!",
                text: "Please check all inputs",
                type: "error",
                showCancelButton: false,
                confirmButtonClass: 'btn btn-danger',
                confirmButtonText: 'Ok!',
                buttonsStyling: false
            });
        }
        e.preventDefault();
    });
    $("form[name=CheckoutaddressForm]").submit(function (e) {
        var f = $(this);
        f.parsley().validate();
        if (f.parsley().isValid()) {
            var checker = $("#checker").val();
            var addressname = $("#addressname").val();
            var states = $("#states").val();
            var lgas = $("#lgas").val();
            var lcdas = $("#lcdas").val();
            var towns = $("#towns").val();
            var busstop = $("#busstops").val();
            var street = $("#streets").val();
            var desc = $("#desc").val();

            if (checker === "add" || checker === "Add") {
                var data = [addressname, states, lgas, lcdas, towns, busstop, street, desc, userid];
                sessionStorage.setItem("addressdisplayIn", "Profile");
                GetData("Product", "AddNewUserAddress", "LoadUserAddress", data);
            } else {
                var data = [addressname, states, lgas, lcdas, towns, busstop, street, desc, checker];
                GetData("Product", "EditNewUserAddress", "LoadAddUserAddressAfterEdit", data);
            }

        } else {
            swal({
                title: "Oop!!!",
                text: "Please check all inputs",
                type: "error",
                showCancelButton: false,
                confirmButtonClass: 'btn btn-danger',
                confirmButtonText: 'Ok!',
                buttonsStyling: false
            });
        }
        e.preventDefault();
    });

    //make complain
    $("form[name=complainCreate]").submit(function (e) {
        var f = $(this);
        var complainSubject = $("#complainSubject").val();
        var complainDescription = $("#complainDescription").val();
        var complainOrderNumber = $("#complainOrderNumber").val();
        var data = [userid, complainSubject, complainDescription, complainOrderNumber];
        $("#complainSubject").val("");
        $("#complainDescription").val("");
        $("#complainOrderNumber").val("");
        GetData("Product", "MakeComplain", "LoadMakeComplain", data);


        e.preventDefault();
    });
}
function Displayordernumb(data) {
    var parent = $(".orderNumberDetailStart");

    if (data[0] === "none") {
        parent.empty();
        var result = "NO order with that Order Number";
        parent.append(result);
    } else {
        var order = data[1];
        $("#orderDetailNumber").text(order["ordernumber"]);
        $("#orderDetailDate").text(order["bookeddate"] + " " + order["bookedtime"]);
        $("#orderDetailStatus").text(order["status"]);
        $("#orderDetailUserName").text(order["userName"]);
        $("#orderDetailAddress").text(order["deliveryaddress"]);
        $("#orderDetailPhone").text(order["userPhone"]);
        $("#orderDetailEmail").text(order["userEmail"]);
        $("#paymentType").text(order["paymentType"]);
    }
    $("#trackClose").click(function () {
        window.location.reload();
    });
}
function sorting() {
    var sort = document.getElementById("sortby").value;
    var products = productsin;
    var priceend = document.getElementById("end_price").value;
    var pricestart = document.getElementById("start_price").value;
    // alert(pricestart + "  " + priceend);
    var sortby = null;
    sortby = sortVar(sort);
    var temobj = new Object();
    // function to sort by putting the sort with parameter(key) and the index(value) in an objec, the 100000 which is incremented is added to take care of repetition
    // note that when the list goes beyond the number(999999) the sort may not function effectively.
    var j = 100000;
    $.each(products, function (id, data) {
        temobj[(data[sortby] + j).toLowerCase()] = id;
        j += 1;
        //          alert(id);                   
    });
    var sorted = textSorter(temobj, sort);
    Displaysortslide(products, sorted);
}//function to remove the naira sign behind the price box
function removesign(input) {
    var res = input.slice(1);
    return res;
}//function to sort the crteated object and then return the sorted index as an array which is later use to call the the items in the display and pagination page.
function textSorter(myObj, sort1) {
    var res = new Array();
    var i, len;
    myObj,
            keys = Object.keys(myObj),
            i, len = keys.length;
    if (sort1 == "name" || sort1 == "newest") {
        keys.sort();
        if (sort1 == "newest")
        {
            keys.reverse();
        }
    } else {
        if (sort1 == "lowestprice") {
            keys.sort(function (a, b) {
                return a - b
            });
        } else {
            keys.sort(function (a, b) {
                return b - a
            });
        }
    }
    for (i = 0; i < len; i++) {
        k = keys[i];
        //    console.log(k + ':' + myObj[k]);
        res[i] = myObj[k];
    }
    return res;
}
//this function is use to get the sorting condition as stated in the object list parameter so as to later use it to get the sort value for each items.
function sortVar(sort) {
    var sortby = null;
    switch (sort.toLowerCase()) {
        case "name":
        {
            sortby = "name";
            break;
        }
        case "highestprice":
        {
            sortby = "selling_price";
            break;
        }
        case "lowestprice":
        {
            sortby = "selling_price";
            break;
        }
        case "newest":
        {
            sortby = "date_added";
            break;
        }
        case "bestratings":
        {
            sortby = "ProductAverageRating";
            break;
        }
    }
    return sortby;
}
function handle(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        $(".searchBtn").click();
    }
}

function DisplayUserLogin(data) {
    if (data === "Account has not been activated") {
        swal({
            title: "Oops!",
            text: "Your account has not been activated and validated",
            type: "info",
            showCancelButton: false,
            confirmButtonClass: 'btn btn-info',
            confirmButtonText: 'Activate Account'
        }, function (isConfirm) {
            if (isConfirm) {
                window.location = extension + "LinksServlet?type=ConfirmEmail";
            }
        });
    } else if (data === "Incorrect Login Details") {
        swal({
            title: "Oops!",
            text: "Incorrect Login Details, Please try again!",
            type: "info",
            showCancelButton: false,
            confirmButtonClass: 'btn btn-info',
            confirmButtonText: 'Retry',
            onClose: function () {
                window.location = extension + "LinksServlet?type=Login";
            }
        });
    } else if (data === "Email or Phone Number Entered Doesn't Exist") {
        swal({
            title: "Oops!",
            text: "Email or Phone Number Entered Doesn't Exist!",
            type: "info",
            showCancelButton: false,
            confirmButtonClass: 'btn btn-info',
            confirmButtonText: 'Retry',
            onClose: function () {
                window.location = extension + "LinksServlet?type=Login";
            }
        });
    } else if (data === "Blocked") {
        swal({
            title: "Oops!",
            text: "Your account has been Blocked, please contact WM-Admin!",
            type: "info",
            showCancelButton: false,
            confirmButtonClass: 'btn btn-info',
            confirmButtonText: 'Ok',
            onClose: function () {
                window.location = extension + "LinksServlet?type=Login";
            }
        });
    } else {
        verifyUser();
        var redirect = sessionStorage.getItem("redirect");
        if (redirect === "" || redirect === "null" || redirect === null) {
            swal({
                title: "Welcome to The WealthMarket Shop",
                text: "Successful login",
                type: "success",
                showCancelButton: false,
                confirmButtonClass: 'btn btn-success',
                confirmButtonText: 'Go Shopping',
                onClose: function () {
                    verifyUser();
                    GetData("User", "GetMemberDetails", "LoadMemberDetails", userid);
                    sessionStorage.setItem("redirect", "");
                    window.location = extension + "LinksServlet?type=Index";
                }

            });
        } else if (redirect === "checkout") {
            swal({
                title: "CheckOut",
                text: "Successful login",
                type: "success",
                showCancelButton: false,
                confirmButtonClass: 'btn btn-success',
                confirmButtonText: 'Continue CheckOut',
                onClose: function () {
                    sessionStorage.setItem("redirect", "");
                    window.location = extension + "ControllerServlet?action=Link&type=CheckOut";
                }
            });
        } else if (redirect === "review") {
            var pid = sessionStorage.getItem("productid");
            window.location = extension + "ControllerServlet?action=Link&type=ProductReview&productid=" + pid;
        }

    }
}

function DisplayTopCategories(data, parent) {
    var childclone = parent.find(".clone");
    $.each(data, function (id, det) {
        var newchild = childclone.clone();
        newchild.removeClass("clone");
        newchild.removeClass("hide");
        var image_url = extension + "global_assets/app/img/CategoryImages/category-" + det["catid"] + ".png";
        if (imageExists(image_url) === false) {
            image_url = extension + "global_assets/app/img/CategoryImages/category-0.png";
        }
        newchild.find(".cat-display-image").attr("src", image_url);
        newchild.find(".cat-display-name").text(det["name"]).addClass("capitalise");
        newchild.find(".cat-display-desc").text(det["desc"]);
        var btncat = newchild.find(".cat-display-btn");
        btncat.click(function () {
            var catid = det["catid"];
            LoadProductPage(catid);
        });
        newchild.appendTo(parent);
    });
    childclone.hide();
}

function pagination(page) {
    //total items to be diplayed, input is the list of items index
    var totallength = input.length;
    // alter the page size to change the number of items display per page. 
    var pagesize = 5;
    // number of pages gotten from dividing total items by each page size
    var pages = Math.ceil(totallength / pagesize);
    var ul = $("#pagination");
    // to create the page numbers on new load from display product or priceslider or sorter
    if (pagecheck == "create") {
        $("#pagination").empty();
        var li = $('<li/>')
                .addClass('page-item')
                .addClass('previous')
                .attr('onClick', "pagination('previous')")
                .attr('id', 'previous')
                .appendTo(ul);
        var aaa = $('<a/>')
                .addClass('page-link')
                .attr('href', '#')
                //    .text(i)
                .appendTo(li);
        var ii = $('<i/>')
                .addClass('fa')
                .addClass('fa-angle-left')
                .attr('aria-hidden', 'true')
                .appendTo(aaa);
        for (i = 1; i <= pages; i++) {
            var li = $('<li/>')
                    .addClass('page-item')
                    .attr('onClick', 'pagination(' + i + ')')
                    .attr('id', 'page' + i)
                    .appendTo(ul);
            var aaa = $('<a/>')
                    .addClass('page-link')
                    .attr('href', '#')
                    .text(i)
                    .appendTo(li);
        }
        var li = $('<li/>')
                .addClass('page-item')
                .addClass('next')
                .attr('onClick', "pagination('next')")
                .attr('id', 'next')
                .appendTo(ul);
        var aaa = $('<a/>')
                .addClass('page-link')
                .attr('href', '#')
                //    .text(i)
                .appendTo(li);
        var ii = $('<i/>')
                .addClass('fa')
                .addClass('fa-angle-right')
                .attr('aria-hidden', 'true')
                .appendTo(aaa);
        pagecheck = null;
        //  <i class="fa fa-angle-right" aria-hidden="true"></i>
    }
    // onclick of next previous or page number events
    if (page == "next")
    {
        cur_page = cur_page + 1;
    } else if (page == "previous")
    {
        cur_page = cur_page - 1;
    } else {
        cur_page = page;
    }
    if (cur_page == "1") {
        $("#previous").addClass('hide');
    } else {
        $("#previous").removeClass('hide');
    }
    if (cur_page == pages) {
        $("#next").addClass('hide');
    } else {

        $("#next").removeClass('hide');
    }
    var i;
    // function to append each child on parent depending on index and current page
    var parent = $("#gridview");
    for (i = 0; i < totallength; i++) {
        var child = $(".cloneappend" + input[i]);
        if (i >= ((cur_page - 1) * pagesize) && i < (cur_page * pagesize)) {
            if (child.hasClass('hide')) {
                child.removeClass("hide");
            } else {
            }
        } else {
            if (child.hasClass('hide')) {
            } else {
                child.addClass('hide');
            }
        }
    }
    $("#pagetext").text("page " + cur_page + " of " + pages);
    //function to display and remove the next and previous button for last and first page respectively
    for (i = 1; i <= pages; i++) {
        var cur_pag = $("#page" + i);
        if (i == cur_page) {
            if (cur_pag.hasClass('active')) {
            } else {
                cur_pag.addClass("active");
            }
        } else {
            if (cur_pag.hasClass('active')) {
                cur_pag.removeClass('active');
            } else {
            }
        }
    }
}
//function to display sorted items according to index
function Displaysortslide(params, sorted) {
    var parent = $(".product-list");
    var parent1 = $("#gridView");
    var temp = new Array();
    //li.removeChild(txt);
    var endprice = parseFloat(removesign(document.getElementById("end_price").value));
    var startprice = parseFloat(removesign(document.getElementById("start_price").value));
    if (params !== "none") {
        var count = 0;
        var i, len;


        len = sorted.length;

        for (i = 0; i < len; i++)
        {

            var data = params[sorted[i]];

            var newchild = $(".cloneappend" + sorted[i]);
            var sellingprice = parseFloat(data["selling_price"]);
            if (sellingprice < startprice || sellingprice > endprice) {
                if (newchild.hasClass('hide')) {
                } else {
                    newchild.addClass('hide');
                }
            } else {
                temp[count] = sorted[i];
                if (newchild.hasClass('hide')) {
                    newchild.removeClass("hide");
                } else {
                }
                count++;
            }
            parent1.append(newchild);

        }
        $(".results-count").text(count);
        input = temp;
        pagecheck = "create";
        //after appending function to the parent we move on to pagination function to hide or display the page depending on there index and current page
        pagination(1);
    } else {
        $("<div />", {text: "No Result found"}).appendTo(parent);
    }
}

function DisplayProducts(params, parent) {
    if (params !== "none") {
        var count = 0;
        var childclone = parent.find(".clone");
        $.each(params, function (index, data) {
            var newchild = childclone.clone();
            newchild.removeClass("clone");
            newchild.removeClass("hide");
            newchild.addClass("cloneappend" + index);
            //newchild.id = index;
            var image_url = extension + "global_assets/app/img/ProductImages/product-" + data["product_id"] + ".png";
            if (imageExists(image_url) === false) {
                image_url = extension + "global_assets/app/img/ProductImages/product-0.png";
            }
            newchild.find(".product-list-Image").attr("src", image_url).addClass("img-responsive");
            var name = capitaliseFirstLetter(data["name"]);
            newchild.find(".product-list-name").text(name).addClass("truncate");
            var price = data["selling_price"];
            var newprice = PriceFormat(price);
            newchild.find(".product-list-price").text(newprice);
            newchild.find(".product-list-ratings").text(data["ProductAverageRating"]);
            newchild.find(".product-list-desc").text(data["description"]);
            var qtycheck = data["quantity"];
            if (qtycheck > 0) {
                newchild.find(".product-list-avail").text("In Stock");
            } else {
                newchild.find(".product-list-avail").text("Out Of Stock").addClass("text-danger");
            }
            var btnshow_details = newchild.find(".product-list-show-details");
            var pid = [data["product_id"]];
            btnshow_details.click(function () {
                window.location = extension + "ControllerServlet?action=Link&type=ProductDetails&productid=" + pid;
            });
            var btnadd_to_wishlist = newchild.find(".product-list-add-to-wishlist");
            btnadd_to_wishlist.click(function () {
                AddToWishList(pid);
            });
            var btnadd_to_cart = newchild.find(".product-list-add-to-cart");
            btnadd_to_cart.click(function () {
                ShopAddToCart(pid, 1, price);
            });
            count++;
            newchild.appendTo(parent);
        });
        childclone.hide();
        $(".results-count").text(count);
    } else {
        $("<div />", {text: "No Result found"}).appendTo(parent);
    }
}

function DisplayLeftFeatureProducts(params) {
    var parent = $(".leftFeatureProducts");
    if (params !== "none") {
        var childclone = parent.find(".clone");
        $.each(params, function (id, data) {
            var newchild = childclone.clone();
            newchild.removeClass("clone");
            newchild.removeClass("hide");
            var image_url = extension + "global_assets/app/img/ProductImages/product-" + data["product_id"] + ".png";
            if (imageExists(image_url) === false) {
                image_url = extension + "global_assets/app/img/ProductImages/product-0.png";
            }
            newchild.find(".feature-product-list-Image").attr("src", image_url);
            var name = capitaliseFirstLetter(data["name"]);
            var btnshow_details = newchild.find(".feature-product-list-name").text(name);
            var price = data["selling_price"];
            var newprice = PriceFormat(price);
            newchild.find(".feature-product-list-price").text(newprice);
            var pid = [data["product_id"]];
            btnshow_details.click(function () {
                window.location = extension + "ControllerServlet?action=Link&type=ProductDetails&productid=" + pid;
            });
            newchild.appendTo(parent);
        });
        childclone.hide();
    } else {
        $("<div />", {text: "No Result found"}).appendTo(parent);
    }
}

function DisplayLatestProducts(params, parent) {
    var childclone = parent.find(".clone");
    $.each(params, function (id, data) {
        var newchild = childclone.clone();
        newchild.removeClass("clone");
        newchild.removeClass("hide");
        var image_url = extension + "global_assets/app/img/ProductImages/product-" + data["product_id"] + ".png";
        if (imageExists(image_url) === false) {
            image_url = extension + "global_assets/app/img/ProductImages/product-0.png";
        }
        newchild.find(".product-list-Image").attr("src", image_url);
        var name = capitaliseFirstLetter(data["name"]);
        newchild.find(".product-list-name").text(name);
        var price = data["selling_price"];
        var newprice = PriceFormat(price);
        newchild.find(".product-list-price").text(newprice);
        newchild.find(".product-list-ratings").text(data["ProductAverageRating"]);
        newchild.find(".product-list-desc").text(data["description"]);
        var qtycheck = data["quantity"];
        if (qtycheck > 0) {
            newchild.find(".product-list-avail").text("In Stock");
        } else {
            newchild.find(".product-list-avail").text("Out Of Stock").addClass("text-danger");
        }
        var btnshow_details = newchild.find(".product-list-show-details");
        var pid = [data["product_id"]];
        btnshow_details.click(function () {
            window.location = extension + "ControllerServlet?action=Link&type=ProductDetails&productid=" + pid;
        });
        var btnadd_to_wishlist = newchild.find(".product-list-add-to-wishlist");
        btnadd_to_wishlist.click(function () {
            AddToWishList(pid);
        });
        var btnadd_to_cart = newchild.find(".product-list-add-to-cart");
        btnadd_to_cart.click(function () {
            ShopAddToCart(pid, 1, price);
        });
        newchild.appendTo(parent);
    });
    childclone.hide();
}

function DisplayGetProductReviews(params) {
    var parent = $("#productReviews");
    if (params !== "none") {
        var childclone = parent.find(".clone");
        $.each(params, function (id, data) {
            var newchild = childclone.clone();
            newchild.removeClass("clone");
            newchild.removeClass("hide");
            newchild.find(".product-review-username").text(data["Username"]);
            newchild.find(".product-review-comment").text(data["comment"]);
            newchild.find(".product-review-ratevalue").text(data["rateIndex"]);
            newchild.appendTo(parent);
        });
        childclone.hide();
    } else {
        $("<div />", {text: "No Result found"}).appendTo(parent);
    }
}

function DisplayProductDetails(data) {
    var name = capitaliseFirstLetter(data["name"]);
    var image_url1 = extension + "global_assets/app/img/ProductImages/product-" + data["product_id"] + ".png";
    if (imageExists(image_url1) === false) {
        image_url1 = extension + "assets/images/ProductImages/product-0.png";
    }
    $(".product-details-image").attr("src", image_url1);
    $(".product-details-image").attr("data-lazyload", image_url1);
    $(".product-details-image-li").attr("data-thumb", image_url1);

    $(".tp-bgimg").attr("src", image_url1);
    $(".tp-bgimg").css("background-image", "url('" + image_url1 + "'");
    $(".tp-thumb-image").css("background-image", "url('" + image_url1 + "'");

    $(".product-details-nametop").text(name + " details");
    $(".product-details-name").text(name);
    $(".product-review-name").text("review " + name);
    var price = PriceFormat(data["selling_price"]);
    $(".product-details-price").text(price);
    var reviewNumber = (data["reviewNumber"]);
    $(".product-details-rating").text(data["ProductAverageRating"] + " Reviews (" + reviewNumber + ")");
    $("#product-review-count").text(data["reviewNumber"]);
    $(".product-details-description").text(data["description"]);
    $(".product-details-id").text(data["product_id"]);
    $(".product-details-category").text(data["categoryName"]);

    var qtycheck = parseInt(data["quantity"]);
    if (qtycheck > 0) {
        $(".product-details-avail").text("In Stock");
    } else {
        $(".product-details-avail").text("Out Of Stock").addClass("text-danger");
        $(".addToCart").attr("disabled", true);

    }
    var prod_prop = data["properties"].split(";");
    var par = $(".product-details-prop");
    var childclone = par.find(".clone");
    $.each(prod_prop, function (id, prop) {
        var newchild = childclone.clone();
        newchild.removeClass("clone");
        newchild.removeClass("hide");
        newchild.find(".product-details-propName").text(prop);
        newchild.appendTo(par);
    });
    childclone.hide();
    $(".product-details-desc").text(data["description"]);
}

function DisplayUserProductReviews(data) {
    var parent = $(".user-product-review");
    var childclone = parent.find(".clone");
    $.each(data, function (id, details) {
        var newchild = childclone.clone();
        newchild.removeClass("clone");
        newchild.removeClass("hide");
        newchild.find(".user-review-product-name").text(details["ProductName"]);
        newchild.find(".user-review-product-comment").text(details["comment"]);
        newchild.find(".user-review-product-date").text(details["date"]);
        newchild.find(".user-review-product-time").text(details["time"]);
        newchild.find(".user-review-product-ratevalue").text(details["rateIndex"]);
        var image_url1 = extension + "global_assets/app/img/ProductImages/product-" + details["objectId"] + ".png";
        if (imageExists(image_url1) === false) {
            image_url1 = extension + "global_assets/app/img/ProductImages/product-0.png";
        }
        $(".user-review-product-image").attr("src", image_url1);
        newchild.appendTo(parent);
    });
    childclone.hide();
}

function LoadProductPage(catid) {
    window.location = extension + "ControllerServlet?action=Link&type=Search&cat=" + catid;
}

function DisplayMenuCategoriesList(data) {
    var CatList = data[0];
    var TopCatSubs = data[1];
    var parent = $("#product-menu-cat");
    if (data === "none") {
        parent.text("No Result");
    } else {
        var childclone = parent.find(".clone");
        $.each(TopCatSubs, function (id, subs) {
            var newchild = childclone.clone();
            newchild.removeClass("clone");
            newchild.removeClass("hide");
            newchild.addClass("category-clone");
            var details = CatList[id];
            var image_url2 = extension + "global_assets/app/img/CategoryImages/category-" + id + ".png";
            if (imageExists(image_url2) === false) {
                image_url2 = extension + "global_assets/app/img/CategoryImages/category-0.png";
            }
            newchild.find(".menu-category-image").attr("src", image_url2);
            var menucatbtn = newchild.find(".menu-category-name").text(capitaliseFirstLetter(details["name"]));
            menucatbtn.click(function () {
                LoadProductPage(id);
            });
            var subParent = newchild.find(".catSubs");
            var subchildclone = subParent.find(".subclone");
            var ndata = $.map(subs, function (el) {
                return el;
            });
            var subs2 = ndata.slice(0, 3);
            $.each(subs2, function (id, subid) {
                var newsubchild = subchildclone.clone();
                newsubchild.removeClass("subclone");
                newsubchild.removeClass("hide");
                newsubchild.addClass("sub-category-clone");
                var subdetails = CatList[subid];
                var btncatname = newsubchild.find(".menu-subcategory-name").text(capitaliseFirstLetter(subdetails["name"]));
                btncatname.click(function () {
                    LoadProductPage(subid);
                });
                newsubchild.appendTo(subParent);
            });
            newchild.appendTo(parent);
        });
        childclone.hide();
    }
    Accordion();
}

function DisplayProductSubCategories(data) {
    var parent = $("#sub-cat-list");
    if (data === "none") {
        var olddata = sessionStorage.getItem("data");
        DisplayProductSubCategories(olddata);
        parent.text("View All");
    } else {
        var CatList = data[0];
        var TopCatSubs = data[1];
        sessionStorage.setItem("data", data);
        var childclone = parent.find(".clone");
        $.each(TopCatSubs, function (id, subs) {
            var newchild = childclone.clone();
            newchild.removeClass("clone");
            newchild.removeClass("hide");
            var details = CatList[id];
            var menucatbtn = newchild.find(".sub-cat-list-name").text(capitaliseFirstLetter(details["name"]));
            menucatbtn.click(function () {
                LoadProductPage(id);
            });
            var subParent = newchild.find(".catSubs");
            var subchildclone = subParent.find(".subclone");
            var ndata = $.map(subs, function (el) {
                return el;
            });
            var subs2 = ndata.slice(0, 3);
            $.each(subs2, function (id, subid) {
                var newsubchild = subchildclone.clone();
                newsubchild.removeClass("subclone");
                newsubchild.removeClass("hide");
                var subdetails = CatList[subid];
                var btncatname = newsubchild.find(".sub-sub-cat-list-name").text(capitaliseFirstLetter(subdetails["name"]));
                btncatname.click(function () {
                    LoadProductPage(subid);
                });
                newsubchild.appendTo(subParent);
            });
            newchild.appendTo(parent);
        });
        childclone.hide();
    }
}

function DisplayAllProductCategories(data) {
    var CatList = data[0];
    var TopCatSubs = data[1];
    var parent = $("#productCategory");
    if (data === "none") {
        parent.text("No Result");
    } else {
        var childclone = parent.find(".clone");
        $.each(TopCatSubs, function (id, subs) {
            var newchild = childclone.clone();
            newchild.removeClass("clone");
            newchild.removeClass("hide");
            newchild.addClass("category-clone");
            var details = CatList[id];
            var image_url2 = extension + "global_assets/app/img/CategoryImages/category-" + id + ".png";
            if (imageExists(image_url2) === false) {
                image_url2 = extension + "global_assets/app/img/CategoryImages/category-0.png";
            }
            newchild.find(".category-image").attr("src", image_url2);
            newchild.find(".category-name").text(capitaliseFirstLetter(details["name"]));
            var subParent = newchild.find(".catSubs");
            var subchildclone = subParent.find(".subclone");
            var ndata = $.map(subs, function (el) {
                return el;
            });
            var subs2 = ndata.slice(0, 3);
            $.each(subs2, function (ind, subid) {
                var newsubchild = subchildclone.clone();
                newsubchild.removeClass("subclone");
                newsubchild.removeClass("hide");
                newsubchild.addClass("sub-category-clone");
                var subdetails = CatList[subid];
                var btncatname = newsubchild.find(".subcategory-name").text(capitaliseFirstLetter(subdetails["name"]));
                btncatname.click(function () {
                    LoadProductPage(subid);
                });
                newsubchild.find(".subcategory-desc").text(subdetails["description"]);
                var image_url = extension + "assets/images/CategoryImages/category-" + subid + ".png";
                if (imageExists(image_url) === false) {
                    image_url = extension + "assets/images/CategoryImages/category-0.png";
                }
                newsubchild.find(".subcategory-image").attr("src", image_url);
                newsubchild.appendTo(subParent);
            });
            newchild.appendTo(parent);
        });
        childclone.hide();
    }
    Accordion();
}

function DisplayGetAllCategories(data) {
    var List = data[0];
    var CatIDs = data[1];
    var SubCatIDs = data[2];
    var parent = $("#all-cat-list");
    if (data === "none") {
        parent.text("No Result");
    } else {
        //-------------------TOp Categery Start----------------------//
        var childclone = parent.find(".clone");
        $.each(List, function (topcatid, details) {
            var newchild = childclone.clone();
            newchild.removeClass("clone");
            newchild.removeClass("hide");
            newchild.addClass("topcategory-clone");
            var btntopcatname = newchild.find(".top-cat-name").text(capitaliseFirstLetter(details["name"]));
            btntopcatname.click(function () {
                LoadProductPage(topcatid);
            });

            //-------------------Categery Start----------------------//
            var Categories = CatIDs[topcatid];
            var catParent = newchild.find(".cat-list");
            var catclone = catParent.find(".cat-clone");
            $.each(Categories, function (cid, catdetails) {
                var catid = catdetails["id"];
                var catchild = catclone.clone();
                catchild.removeClass("cat-clone");
                catchild.removeClass("hide");
                catchild.addClass("category-clone");
                var btncatname = catchild.find(".cat-name").text(capitaliseFirstLetter(catdetails["name"]));
                btncatname.click(function () {
                    LoadProductPage(catid);
                });

                //-------------------Sub Categery Start----------------------//
                var SubCategories = SubCatIDs[catid];
                var subcatParent = newchild.find(".sub-cat-list");
                var subcatclone = subcatParent.find(".sub-cat-clone");
                $.each(SubCategories, function (sid, subcatdetails) {
                    var subid = subcatdetails["id"];
                    var subcatchild = subcatclone.clone();
                    subcatchild.removeClass("sub-cat-clone");
                    subcatchild.removeClass("hide");
                    subcatchild.addClass("subcategory-clone");
                    var subbtncatname = subcatchild.find(".sub-cat-name").text(capitaliseFirstLetter(subcatdetails["name"]));
                    subbtncatname.click(function () {
                        LoadProductPage(subid);
                    });
                    subcatchild.appendTo(subcatParent);
                });
                subcatclone.hide();
                //-------------------Sub Categery End----------------------//

                catchild.appendTo(catParent);
            });
            catclone.hide();
            //-------------------Categery End----------------------//

            newchild.appendTo(parent);
        });
        childclone.hide();
        //-------------------Top Categery End----------------------//
    }
}



function DisplayDropDownCategoriesList(data) {
    var parent = $(".top-cat-menu-display");
    var childclone = parent.find(".clone");
    $.each(data, function (id, detail) {
        var newchild = childclone.clone();
        newchild.removeClass("clone");
        newchild.removeClass("hide");
        var btn_menu_name = newchild.find(".top-cat-menu-name").text(detail["name"]);
        btn_menu_name.click(function () {
            var catid = detail["id"];
            LoadProductPage(catid);
        });
        newchild.appendTo(parent);
    });
    $(".viewall").appendTo(parent);
    childclone.hide();
}

function DisplayMemberDetails(data) {
    if (data[0] !== "none") {
        var result = data[0];

        var image_url = extension + "global_assets/app/img/ProfilePicture/user-" + result["userID"] + ".png";
        if (imageExists(image_url) === false) {
            image_url = extension + "global_assets/app/img/ProfilePicture/user-0.png";
        }
        $(".userImage").attr("src", image_url);
        $(".UserFirstName").text(result["first_name"]);
        $(".UserLastName").text(result["last_name"]);
        $(".UserEmailAddress").text(result["email"]);
        $(".UserPhone").text(result["phone_number"]);
        $(".UserPassword").text(result["password"]);
        $(".UserType").text(result["usertype"]);
        $(".UserDOB").text(result["dob"]);
        $(".UserGender").text(result["sex"]);
        $(".UserDateJoined").text(result["date_joined"]);
        $(".UserName").text(result["first_name"] + " " + result["last_name"]);
    }
    if (data[1] !== "none") {
        var res = data[1];
        var parent = $(".user-addresses");
        var childclone = parent.find(".clone");
        var count = 0;
        $.each(res, function (ind, item) {
            var newchild = childclone.clone();
            newchild.removeClass("clone");
            count++;
            newchild.find(".address-sn").text(count);
            newchild.find(".address-name").text(item["addressname"]);
            newchild.find(".UserAddress").text(item["addressString"]);
            var btnDelete = newchild.find(".btnDeleteAdd");
            btnDelete.click(function () {
                data = item["id"];
                swal({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'No, cancel!',
                    confirmButtonClass: 'btn btn-success',
                    cancelButtonClass: 'btn btn-danger',
                    buttonsStyling: false
                }).then(function (dismiss) {
                    if (dismiss.value) {
                        GetData("User", "DeleteUserAddress", "LoadAddress", data);
                    } else {
                        swal({
                            title: 'Safe',
                            text: "Your address is safe!",
                            type: 'success',
                            showCancelButton: false,
                            confirmButtonText: 'Ok!',
                            confirmButtonClass: 'btn btn-success',
                            buttonsStyling: false
                        });
                    }
                });
            });
            var btnEdit = newchild.find(".btnEditAdd");
            btnEdit.click(function () {
                var addID = item["id"];
                PopulateStates(item["state"]);
                PopulateLGAs(item["state"], item["lga"]); //populates the lga section
                PopulateLCDAsFromState(item["state"], item["lcda"]); //populates the lcda section
                PopulateTownsFromState(item["state"], item["town"]);
                PopulateBstopsFromTown(item["town"], item["busstop"]); //populates the bus stop section
                PopulateStreetsFromTown(item["town"], item["street"]);
                $(".bd-example-modaladdress").on("show.bs.modal", function () {

                    $("#addressname").val(item["addressname"]);
                    $("#userdesc").val(item[item["desc"]]);
                    $("#checker").val(addID);
                    $("addbtn").html('Edit').button("refresh");
                });
            });

            newchild.appendTo(parent);
        });
        $(".useraddressCount").text(count);
        childclone.hide();

    }
}

function DisplayUpdateUserDetails(data) {
    if (data === "success") {
        swal({
            title: "Detail Updated",
            text: "Your personal detail has been updated",
            type: "success",
            input: "text",
            showCancelButton: false,
            confirmButtonClass: 'btn btn-success',
            confirmButtonText: 'Ok!'
        }, function (isConfirm) {
            if (isConfirm) {
                GetData("User", "GetMemberDetails", "LoadMemberDetails", userid);
            }
        });
    } else {
        swal({
            title: "Oops!",
            text: "something went wrong",
            type: "info",
            showCancelButton: false,
            confirmButtonClass: 'btn btn-info',
            confirmButtonText: 'Retry'
        }, function (isConfirm) {
            if (isConfirm) {
                GetData("User", "GetMemberDetails", "LoadMemberDetails", userid);
            }
        });
    }
}

function DisplayWishList(data) {
    var parent = $("#WishListItems");
    parent.find(".clone-child").remove();
    if (data !== "none") {
        var count = 0;
        var childclone = parent.find(".clone");
        $.each(data, function (id, details) {
            count++;
            var newchild = childclone.clone();
            newchild.removeClass("clone");
            newchild.removeClass("hide");
            newchild.addClass("clone-child");
            var image_url = extension + "global_assets/app/img/ProductImages/product-" + details["product_id"] + ".png";
            if (imageExists(image_url) === false) {
                image_url = extension + "global_assets/app/img/ProductImages/product-0.png";
            }
            newchild.find(".WishproductSN").text(count);
            newchild.find(".WishproductImage").attr("src", image_url);
            var name = capitaliseFirstLetter(details["name"]);
            newchild.find(".WishproductName").text(name);
            newchild.find(".WishproductDesc").text(details["description"]);


            var Quantity = parseInt(details["quantity"]);
            if (Quantity > 0) {
                newchild.find(".WishproductQuantity").addClass("badge badge-success").text("In-Stock");
            } else {
                newchild.find(".WishproductQuantity").addClass("badge badge-danger").text("Out-of-Stock");
            }
            var price = details["selling_price"];
            var newprice = PriceFormat(price);
            newchild.find(".WishproductPrice").text(newprice);


            var btnRemoveFromWishList = newchild.find(".RemoveFromWishList");
            btnRemoveFromWishList.click(function () {
                var pid = details["product_id"];
                swal({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes!',
                    cancelButtonText: 'No!',
                    confirmButtonClass: 'btn btn-success',
                    cancelButtonClass: 'btn btn-danger',
                    buttonsStyling: false
                }).then(function (dismiss) {
                    if (dismiss.value) {
                        RemoveFromWishList(pid);
                    } else {
                        swal({
                            title: 'Safe',
                            text: "Your wishlist is safe!",
                            type: 'success',
                            showCancelButton: false,
                            confirmButtonText: 'Ok!',
                            confirmButtonClass: 'btn btn-success',
                            buttonsStyling: false
                        });
                    }
                });

            });
            var btnAddProductToCart = newchild.find(".AddProductToCart");
            btnAddProductToCart.click(function () {
                var pid = details["product_id"];
                swal({
                    title: 'Add To Cart?',
                    text: 'Adding ' + name + ' to Cart?',
                    type: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Continue!',
                    cancelButtonText: 'Cancel!',
                    confirmButtonClass: 'btn btn-success',
                    cancelButtonClass: 'btn btn-info',
                    buttonsStyling: false
                }).then(function (dismiss) {
                    if (dismiss.value) {
                        ShopAddToCart(pid, 1, details["selling_price"]);
                    } else {
                        swal({
                            title: 'Safe',
                            text: "Your product is safe!",
                            type: 'success',
                            showCancelButton: false,
                            confirmButtonText: 'Ok!',
                            confirmButtonClass: 'btn btn-success',
                            buttonsStyling: false
                        });
                    }
                });

            });
            newchild.appendTo(parent).show();
        });
        $(".WishProductsNum").text(count);
        childclone.hide();
    } else {
        $("#btnAddAllToCart").addClass("hide");
        $("#btnAddAllToCart").hide();
        $("#btnRemoveAllFromCart").addClass("hide");
        $("#btnRemoveAllFromCart").hide();
        parent.text("No Results").addClass("badge badge-danger btn-sm text-center");
    }

}

function DisplayOrderList(data) {
    var ordertype = sessionStorage.getItem("ordertype");
    var parent = "";
    if (ordertype === "All") {
        parent = $("#AllOrders");
    } else if (ordertype === "Pending") {
        parent = $("#PendingOrders");
    } else if (ordertype === "Processing") {
        parent = $("#ProcessingOrders");
    } else if (ordertype === "Shipped") {
        parent = $("#ShippedOrders");
    } else if (ordertype === "Cancelled") {
        parent = $("#CancelledOrders");
    } else if (ordertype === "Delivered") {
        parent = $("#DeliveredOrders");
    }
    parent.empty();
    if (data[0] !== "none") {
        var count = 0;
        $.each(data[0], function (id, order) {
            count++;
            var row = $("<tr />").appendTo(parent);
            $("<td />", {class: "", text: count}).appendTo(row);
            $("<td />", {class: "", text: order["bookeddate"]}).appendTo(row);
            var pname = $("<td />").appendTo(row);
            var orderProductIds = data[2][id];
            var counter = 0;
            $.each(orderProductIds, function (index, prodid) {
                var prod = data[1][prodid];
                counter++;
                var nam = $("<div />", {class: "", text: ""}).appendTo(pname);
                $("<span />", {class: "badge badge-success badge-rounded parts half-marginright", text: counter}).appendTo(nam);
                var name = capitaliseFirstLetter(prod["name"]);
                $("<span />", {class: "product-name bold normaltext parts", text: name}).appendTo(nam);

            });
            $("<td />", {class: "", text: order["ordernumber"]}).appendTo(row);
            var price = order["amount"];
            var newprice = PriceFormat(price);
            $("<td />", {text: newprice, class: "blacktext"}).appendTo(row);
            var sta = $("<td />").appendTo(row);
            var status = order["status"];
            if (status === "Pending") {
                $("<span />", {class: "badge badge-info", text: "Being Processed"}).appendTo(sta);
            } else if (status === "Processing") {
                $("<span />", {class: "badge badge-warning", text: order["status"]}).appendTo(sta);
            } else if (status === "Cancelled") {
                $("<span />", {class: "badge badge-danger", text: order["status"]}).appendTo(sta);
            } else if (status === "Shipped") {
                $("<span />", {class: "badge badge-primary", text: order["status"]}).appendTo(sta);
            } else if (status === "Delivered") {
                $("<span />", {class: "badge badge-success", text: order["status"]}).appendTo(sta);
            }
            var ddate = $("<td />").appendTo(row);
            $("<td />", {class: "badge badge-success btn-xs cursor", text: "View Details", click: function () {
                    GetData("Product", "GetPlacedOrder", "LoadPlacedOrderList", id);
                    $("#OrderDetails").modal("show");
                }}).appendTo(ddate);
        });

        $(".listedProductsNum").text(count);
    } else {
        var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "wide center", text: "No Result", colspan: "8"}).appendTo(row);
    }



}

function DisplayPlacedOrderList(data) {
    if (data[0] !== "none") {
        var count = 0;
        $.each(data[0], function (id, order) {
            $("#orderDetailNumber").text(order["ordernumber"]);
            $("#orderDetailDate").text(order["bookeddate"]);
            $("#orderDetailUserName").text(order["UserName"]);
            $("#orderDetailAddress").text(order["deliveryaddress"]);
            $("#orderDetailPhone").text(order["UserPhone"]);
            $("#orderDetailEmail").text(order["UserEmail"]);
            var stats = order["status"];
            var ordercnt = $("#orderDetailStatus");
            ordercnt.empty();
            if (stats === "Pending") {
                ordercnt.addClass("badge badge-info  badge-rounded").text("Being Processed");
                $("#cancelOrder").removeClass("hide");
                $("#cancelOrder").show();
            } else if (stats === "Processing") {
                ordercnt.addClass("badge badge-warning  badge-rounded").text("Processing");
                $("#cancelOrder").addClass("hide");
                $("#cancelOrder").hide();
            } else if (stats === "Cancelled") {
                ordercnt.addClass("badge badge-danger  badge-rounded").text("Cancelled");
                $("#cancelOrder").addClass("hide");
                $("#cancelOrder").hide();
            } else if (stats === "Shipped") {
                ordercnt.addClass("badge badge-primary  badge-rounded").text("Shipped");
                $("#cancelOrder").removeClass("hide");
                $("#cancelOrder").show();
            } else if (stats === "Delivered") {
                ordercnt.addClass("badge badge-success  badge-rounded").text("Delivered");
                $("#cancelOrder").addClass("hide");
                $("#cancelOrder").hide();
            }

            var deliveryfees = order["deliveryfee"];
            var Deliveryfees = PriceFormat(deliveryfees);
            $("#DeliDetailFees").text(Deliveryfees);
            var amt = order["amount"];
            var totalamt = PriceFormat(amt);
            var subtotal = amt - deliveryfees;
            $("#subDetailTotal").text(PriceFormat(subtotal));
            $(".totalDetailAmount").text(totalamt);
            $("#OrderID").text(id);
            var orderProductIds = data[2][id];
            var parent = $("#ProductOrderDetails");
            parent.empty();
            $.each(orderProductIds, function (index, prodid) {
                count++;
                var row = $("<tr />").appendTo(parent);
                $("<td />", {class: "smallerwide text-center", text: count}).appendTo(row);
                var pname = $("<td />").appendTo(row);
                var prod = data[1][prodid];
                var name = capitaliseFirstLetter(prod["name"]);
                $("<div />", {class: "product-name bold normaltext", text: name}).appendTo(pname);
                $("<td />", {class: "halfwide", text: prod["description"]}).appendTo(row);
                var review = $("<td />").appendTo(row);
                var btnreview;
                if (stats === "Delivered") {
                    btnreview = $("<button />", {class: "btn btn-success btn-sm", text: "Review"}).appendTo(review);
                } else {
                    btnreview = $("<button />", {class: "btn btn-success btn-sm", text: "Review", disabled: true}).appendTo(review);

                }
                btnreview.click(function () {
                    var pid = prod["product_id"];
                    window.location = extension + "ControllerServlet?action=Link&type=ProductReview&productid=" + pid;
                });
                var qty = parseInt(prod["pquantity"]);
                var price = parseInt(prod["pamount"]);
                var unitprice = parseInt(prod["price"]);
                $("<td />", {class: "text-center", text: qty}).appendTo(row);
                $("<td />", {class: "text-center", text: PriceFormat(unitprice)}).appendTo(row);
                $("<td />", {class: "text-center", text: PriceFormat(price)}).appendTo(row);
            });
        });
    } else {

    }

}

function DisplayPlacedOrderSummary(data) {
    if (data[0] !== "none") {
        var count = 0;
        $.each(data[0], function (id, order) {
            $(".orderDetailNumber").text(order["ordernumber"]);
            $(".orderDetailDate").text(order["bookeddate"]);
            $(".orderDetailUserName").text(order["UserName"]);
            $(".orderDetailAddress").text(order["deliveryaddress"]);
            $(".orderDetailPhone").text(order["UserPhone"]);
            $(".orderDetailEmail").text(order["UserEmail"]);
            var stats = order["status"];
            var ordercnt = $(".orderDetailStatus");
            ordercnt.empty();
            if (stats === "Pending") {
                ordercnt.addClass("badge badge-info  badge-rounded").text("Being Processed");
            } else if (stats === "Processing") {
                ordercnt.addClass("badge badge-warning  badge-rounded").text("Processing");
            } else if (stats === "Cancelled") {
                ordercnt.addClass("badge badge-danger  badge-rounded").text("Cancelled");
            } else if (stats === "Shipped") {
                ordercnt.addClass("badge badge-primary  badge-rounded").text("Shipped");
            } else if (stats === "Delivered") {
                ordercnt.addClass("badge badge-success  badge-rounded").text("Delivered");
                ;
            }

            var deliveryfees = order["deliveryfee"];
            var Deliveryfees = PriceFormat(deliveryfees);
            $("#DeliDetailFees").text(Deliveryfees);
            var amt = order["amount"];
            var totalamt = PriceFormat(amt);
            var subtotal = amt - deliveryfees;
            $("#subDetailTotal").text(PriceFormat(subtotal));
            $(".totalDetailAmount").text(totalamt);
            $("#OrderID").text(id);
            var orderProductIds = data[2][id];
            var parent = $("#ProductOrderDetails");
            parent.empty();
            $.each(orderProductIds, function (index, prodid) {
                count++;
                var row = $("<tr />").appendTo(parent);
                $("<td />", {class: "smallerwide text-center", text: count}).appendTo(row);
                var pname = $("<td />").appendTo(row);
                var prod = data[1][prodid];
                var name = capitaliseFirstLetter(prod["name"]);
                $("<div />", {class: "product-name bold normaltext", text: name}).appendTo(pname);
                $("<td />", {class: "halfwide", text: prod["description"]}).appendTo(row);
                var qty = parseInt(prod["pquantity"]);
                var price = parseInt(prod["pamount"]);
                var unitprice = parseInt(prod["price"]);
                $("<td />", {class: "text-center", text: qty}).appendTo(row);
                $("<td />", {class: "text-center", text: PriceFormat(unitprice)}).appendTo(row);
                $("<td />", {class: "text-center", text: PriceFormat(price)}).appendTo(row);
            });
        });

    } else {

    }

}

function DisplayCartList(result) {
    var parent = $("#CartItems");
    if (result !== "none") {
        var data = result[0];
        var count = 0;
        parent.find(".clone-child").remove();
        var childclone = parent.find(".clone");
        $.each(data, function (id, details) {
            count++;
            var newchild = childclone.clone();
            newchild.removeClass("clone");
            newchild.removeClass("hide");
            newchild.addClass("clone-child");
            newchild.find(".cartSN").text(count);
            var image_url = extension + "global_assets/app/img/ProductImages/product-" + details["product_id"] + ".png";
            if (imageExists(image_url) === false) {
                image_url = extension + "global_assets/app/img/ProductImages/product-0.png";
            }
            newchild.find(".cartImage").attr("src", image_url);
            var name = capitaliseFirstLetter(details["name"]);
            newchild.find(".cartProductName").text(name);
            newchild.find(".cartProductDesc").text(details["description"]);
            var quantity = parseInt(details["quantity"]);
            if (quantity > 0) {
                newchild.find(".cartQuantityCheck").addClass("btn btn-primary btn-sm border").text("In-Stock");
            } else {
                newchild.find(".cartQuantityCheck").addClass("btn btn-danger btn-sm border").text("Out-Of-Stock");
            }
            var price = details["selling_price"];
            var newprice = PriceFormat(price);
            newchild.find(".cartPrice").text(newprice);
            newchild.find(".cartQuantity").val(details["Quantity"]);
            var btnreduced = newchild.find(".reduced");
            btnreduced.click(function () {
                var Qua = $(this).closest(".custom").find(".productquan").val();
                var quant = parseInt(Qua);
                if (quant > 1) {
                    quant = parseInt(Qua) - 1;
                    $(this).closest(".custom").find(".productquan").val(quant);
                    var newamount = parseInt(price) * quant;
                    var NewProdAmount = PriceFormat(newamount);
                    newchild.find(".cartProdAmt").text(NewProdAmount);
                    var tamt1 = $(".cartTotalAmout").text();
                    var newtamt = tamt1.replace("₦", "");
                    newtamt = parseFloat(newtamt.replace(",", ""));
                    var tamt2 = parseInt(newtamt) - parseInt(price);
                    var NewTotalAmount = PriceFormat(tamt2);
                    $(".cartTotalAmout").text(NewTotalAmount);
                    var pid = details["product_id"];
                    UpdateCartProduct(pid, quant, newamount);
                } else {
                    swal({
                        title: "Product Quantity",
                        text: "Allowed numbers greater than 0",
                        type: "info",
                        input: "text",
                        showCancelButton: false,
                        confirmButtonClass: 'btn-info waves-effect waves-danger',
                        confirmButtonText: 'Ok!'
                    }, function (isConfirm) {
                        if (isConfirm) {
                            GetData("Product", "GetUserCartList", "LoadCartList");
                        }
                    });
                }
            });
            var btnincrease = newchild.find(".increase");
            btnincrease.click(function () {
                var Qua = $(this).closest(".custom").find(".productquan").val();
                var quant = parseInt(Qua);
                quant = parseInt(Qua) + 1;
                $(this).closest(".custom").find(".productquan").val(quant);
                var newamount = parseInt(price) * quant;
                var NewProdAmount = PriceFormat(newamount);
                newchild.find(".cartProdAmt").text(NewProdAmount);
                var tamt1 = $(".cartTotalAmout").text();
                var newtamt = tamt1.replace("₦", "");
                newtamt = parseFloat(newtamt.replace(",", ""));
                var tamt2 = parseInt(newtamt) + parseInt(price);
                var NewTotalAmount = PriceFormat(tamt2);
                $(".cartTotalAmout").text(NewTotalAmount);
                var pid = details["product_id"];
                UpdateCartProduct(pid, quant, newamount);
            });
            var amt = details["Amount"];
            var amount = PriceFormat(amt);
            newchild.find(".cartProdAmt").text(amount);

            var btnRemoveCartItem = newchild.find(".btnRemoveCartItem");
            btnRemoveCartItem.click(function () {
                var pid = details["product_id"];
                RemoveFromCartList(pid);
            });
            newchild.appendTo(parent).show();
        });
        childclone.hide();
        var tamount = PriceFormat(result[1]);
        $(".cartTotalAmout").text(tamount);


    } else {
        var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "wide center", text: "No Result", colspan: "8"}).appendTo(row);
    }

}

function DisplayCheckOutReviewCart(result) {
    var parent = $("#checkOutReview");
    if (result !== "none") {
        var data = result[0];
        var count = 0;
        parent.find(".clone-child").remove();
        var childclone = parent.find(".clone");
        $.each(data, function (ind, item) {
            var newchild = childclone.clone();
            newchild.removeClass("clone");
            newchild.removeClass("hide");
            newchild.addClass("clone-child");
            count++;
            newchild.find(".checkSn").text(count);
            var image_url = extension + "global_assets/app/img/ProductImages/product-" + item["product_id"] + ".png";
            if (imageExists(image_url) === false) {
                image_url = extension + "global_assets/app/img/ProductImages/product-0.png";
            }
            newchild.find(".checkPImage").attr("src", image_url);
            var name = capitaliseFirstLetter(item["name"]);
            newchild.find(".checPName").text(name);
            newchild.find(".checkPDesc").text(item["description"]);
            var quantity = parseInt(item["quantity"]);
            if (quantity > 0) {
                newchild.find(".checkPQuantityCheck").addClass("btn btn-outline-primary btn-sm border").text("In-Stock");
            } else {
                newchild.find(".checkPQuantityCheck").addClass("btn btn-danger btn-sm border").text("Out-Of-Stock");
            }
            var price = item["selling_price"];
            var newprice = PriceFormat(price);
            newchild.find(".checkPPrice").text(newprice);
            newchild.find(".checkPQuantity").text(item["Quantity"]).addClass("badge badge-success btn-sm p-2");
            var amt = item["Amount"];
            var amount = PriceFormat(amt);
            newchild.find(".checkProdAmt").text(amount);


            newchild.appendTo(parent);
        });
        childclone.hide();
        carttotalamount = PriceFormat(result[1]);
        $(".tamount").text(carttotalamount);
    } else {
        var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "wide center", text: "No Result", colspan: "8"}).appendTo(row);
    }

}

function DisplayActionWishList(data) {
    if (data[0] === "Add") {
        if (data[1] === "success") {
            swal({
                title: "My WishList",
                text: "Product added to your WishList",
                type: "success",
                input: "text",
                showCancelButton: false,
                confirmButtonClass: 'btn btn-success',
                confirmButtonText: 'Ok!'
            }, function (isConfirm) {
                if (isConfirm) {
                    GetData("Product", "GetUserWishList", "LoadWishList", userid);
                }
            });
        } else {
            swal({
                title: "Oops!",
                text: "Product is already in your WishList or something went wrong",
                type: "info",
                showCancelButton: false,
                confirmButtonClass: 'btn btn-info',
                confirmButtonText: 'Retry'
            }, function (isConfirm) {
                if (isConfirm) {
                    GetData("Product", "GetUserWishList", "LoadWishList", userid);
                }
            });
        }
    } else if (data[0] === "Remove") {
        if (data[1] === "successful" || data[1] === "success") {
            swal({
                title: "My WishList",
                text: "Product removed from your WishList",
                type: "success",
                input: "text",
                showCancelButton: false,
                confirmButtonClass: 'btn btn-success',
                confirmButtonText: 'Ok!'
            }, function (isConfirm) {
                if (isConfirm) {
                    GetData("Product", "GetUserWishList", "LoadWishList", userid);
                }
            });
        } else {
            swal({
                title: "Oops!",
                text: "Something went wrong",
                type: "info",
                showCancelButton: false,
                confirmButtonClass: 'btn btn-info',
                confirmButtonText: 'Retry'
            }, function (isConfirm) {
                if (isConfirm) {
                    GetData("Product", "GetUserWishList", "LoadWishList", userid);
                }
            });
        }
    } else if (data[0] === "Empty") {
        if (data[1] === "successful") {
            swal({
                title: "My WishList",
                text: "Your Wishlist is empty",
                type: "success",
                input: "text",
                showCancelButton: false,
                confirmButtonClass: 'btn btn-success',
                confirmButtonText: 'Ok!'
            }, function (isConfirm) {
                if (isConfirm) {
                    GetData("Product", "GetUserWishList", "LoadWishList", userid);
                }
            });
        } else {
            swal({
                title: "Oops!",
                text: "Something went wrong!",
                type: "info",
                showCancelButton: false,
                confirmButtonClass: 'btn btn-info',
                confirmButtonText: 'Retry'
            }, function (isConfirm) {
                if (isConfirm) {
                    GetData("Product", "GetUserWishList", "LoadWishList", userid);
                }
            });
        }
    }
}

function DisplayCartAction(data) {
    if (data[0] === "Add") {
        if (data[1] === "success") {
            swal({
                title: "My Shopping Cart",
                text: "Product added to your Cart",
                type: "success",
                showCancelButton: true,
                confirmButtonClass: 'btn btn-success btn-sm',
                confirmButtonText: "View Cart",
                cancelButtonText: "Continue Shopping",
                cancelButtonClass: 'btn btn-primary btn-sm'
            }, function (isConfirm) {
                if (isConfirm) {
                    window.location = extension + "LinksServlet?type=Cart";
                } else {
                    if (CheckUser()) {
                        userid = data[2];
                        GetData("Product", "GetUserCartCount", "LoadCartCount");
                    } else {
                        cart = data[2];
                        GetData("Product", "GetUserCartCount", "LoadCartCount");
                    }
                }
            });
        } else {
            swal({
                title: "Oops!",
                text: "Product is already in your Shopping Cart.",
                type: "info",
                showCancelButton: false,
                confirmButtonClass: 'btn btn-info btn-sm',
                confirmButtonText: 'Ok'
            }, function (isConfirm) {
                if (isConfirm) {
                    GetData("Product", "GetUserCartList", "LoadCartList");
                }
            });
        }
    } else if (data[0] === "Remove") {
        if (data[1] === "successful" || data[1] === "success") {
            swal({
                title: "My Shopping Cart",
                text: "Product deleted from your Shopping Cart",
                type: "success",
                confirmButtonClass: 'btn btn-success btn-sm',
                confirmButtonText: "Continue"
            }, function (isConfirm) {
                if (isConfirm) {
                    window.location.reload();
                    GetData("Product", "GetUserCartList", "LoadCartList");
                } else {
                    window.location.reload();
                    GetData("Product", "GetUserCartList", "LoadCartList");
                }
            });
        } else {
            swal({
                title: "Oops!",
                text: "Something went wrong",
                type: "info",
                showCancelButton: false,
                confirmButtonClass: 'btn btn-info btn-sm',
                confirmButtonText: 'Ok'
            }, function (isConfirm) {
                if (isConfirm) {
                    window.location.reload();
                    GetData("Product", "GetUserCartList", "LoadCartList");
                }
            });
        }
    } else if (data[0] === "Empty") {
        if (data[1] === "successful") {
            swal({
                title: "My Shopping Cart",
                text: "Your Shopping Cart is empty",
                type: "success",
                showCancelButton: true,
                confirmButtonClass: 'btn btn-success btn-sm',
                confirmButtonText: "View Cart",
                cancelButtonText: "Continue Shopping",
                cancelButtonClass: 'btn btn-primary btn-sm'
            }, function (isConfirm) {
                if (isConfirm) {
                    window.location = extension + "LinksServlet?type=Cart";
                } else {
                    window.location = extension + "LinksServlet?type=Index";
                }
            });
        } else {
            swal({
                title: "Oops!",
                text: "Something went wrong",
                type: "info",
                showCancelButton: false,
                confirmButtonClass: 'btn btn-info btn-sm',
                confirmButtonText: 'Ok'
            }, function (isConfirm) {
                if (isConfirm) {
                    GetData("Product", "GetUserCartList", "LoadCartList");
                }
            });
        }
    } else if (data[0] === "Update") {
    }
}

function DisplayOrderOption(data) {
    if (data[0] === "Cancel") {
        if (data[1] === "success") {
            swal({
                title: "My Orders",
                text: "Your order has been cancelled",
                type: "success",
                showCancelButton: false,
                confirmButtonClass: 'btn btn-success btn-sm',
                confirmButtonText: "Ok"
            }, function (isConfirm) {
                if (isConfirm) {
                    $("#userProfile").modal("show");
                    $("#OrderDetails").modal("hide");
                    var data = [userid, "All"];
                    sessionStorage.setItem("ordertype", "All");
                    GetData("Product", "GetUserCartCount", "LoadCartCount");
                    GetData("Product", "GetUserOrderList", "LoadOrderList", data);
                } else {
                }
            });
        } else {
            swal({
                title: "Oops!",
                text: "Something went wrong!",
                type: "info",
                showCancelButton: false,
                confirmButtonClass: 'btn btn-info btn-sm',
                confirmButtonText: 'Ok'
            }, function (isConfirm) {
                if (isConfirm) {
                    GetData("Product", "GetUserOrderList", "LoadOrderList", data);
                }
            });
        }
    }
}


function DisplayLoadCartCount(data) {
    if (data !== "") {
        $("#cartcount").text(data);
    } else {
        $("#cartcount").text(0);
    }
}

function DisplayAddress(data) {
    swal({
        title: "Address Added",
        text: "Your address has been added successfully",
        type: "success",
        showCancelButton: false,
        confirmButtonClass: 'btn btn-success',
        confirmButtonText: 'Ok!',
        onClose: function () {
            window.location.reload();
            GetData("User", "GetMemberDetails", "LoadMemberDetails", userid);
        }
    });

}

function DisplayReviewProduct(data) {
    swal({
        title: "Review Added",
        text: "Your review has been added successfully",
        type: data[0],
        showCancelButton: false,
        confirmButtonClass: 'btn btn-success btn-sm',
        confirmButtonText: 'Ok!'
    }, function (isConfirm) {
        if (isConfirm) {
            var pid = data[1];
            window.location = extension + "ControllerServlet?action=Link&type=ProductDetails&productid=" + pid;
        }
    });
}

function DisplayCheckOutAddress(data) {
    var parent = $("#addCheckoutDisplay");
    parent.empty();
    var res = data[1];
    $.each(res, function (id, addr) {
        //alert(JSON.stringify(addr));
        var col = $("<div />", {class: "col-md-4"}).appendTo(parent);
        var cardcol = $("<div />", {class: "col-md-2"}).appendTo(col);
        var cardbox = $("<div />", {class: "text-left card-box"}).appendTo(cardcol);
        var action = $("<div />").appendTo(cardbox);
        $("<input />", {type: "radio", class: "radio radio-success m-b-10 m-t-0", name: "radiobtn", click: function () {
                sessionStorage.setItem("addressID", addr["id"]);
                sessionStorage.setItem("addressType", "UseMyAddress");
                $("#enableCartReview").removeClass("hide");
                $("#enableCartReview").show();
                ComputeUseMyAddress();
            }}).appendTo(action);
        var txtleft = $("<div />", {class: "text-left col-md-10"}).appendTo(col);
        var paraname = $("<p />", {text: "Address Name: ", class: "bold text-dark font-15 normaltext"}).appendTo(txtleft);
        $("<span />", {text: addr["addressType"], class: "m-l-15 text-muted"}).appendTo(paraname);
        var parafulladdress = $("<p />", {text: "Full Address: ", class: "bold text-dark font-15 normaltext"}).appendTo(txtleft);
        $("<span />", {text: addr["fulladdress"], class: "m-l-15 text-muted"}).appendTo(parafulladdress);

//        var parastate = $("<p />", {text: "State: ", class: "bold text-dark font-15 normaltext"}).appendTo(txtleft);
//        $("<span />", {text: addr["state"], class: "m-l-15 text-muted"}).appendTo(parastate);
//        var paralga = $("<p />", {text: "Lga: ", class: "bold text-dark font-15 normaltext"}).appendTo(txtleft);
//        $("<span />", {text: addr["lga"], class: "m-l-15 text-muted"}).appendTo(paralga);
//        var paratown = $("<p />", {text: "Town: ", class: "bold text-dark font-15 normaltext"}).appendTo(txtleft);
//        $("<span />", {text: addr["town"], class: "m-l-15 text-muted"}).appendTo(paratown);
//        var parabusstop = $("<p />", {text: "Nearest Bus Stop: ", class: "bold text-dark font-15 normaltext"}).appendTo(txtleft);
//        $("<span />", {text: addr["busstop"], class: "m-l-15 text-muted"}).appendTo(parabusstop);
//        var parastreet = $("<p />", {text: "Street: ", class: "bold text-dark font-15 normaltext"}).appendTo(txtleft);
//        $("<span />", {text: addr["street"], class: "m-l-15 text-muted"}).appendTo(parastreet);
    });
}

function DisplayPasswordReset(data) {
    if (data === "success") {
        swal({
            title: "Email Sent",
            text: "Please check for an email from The WealthMarket and enter the recovery code in the box below.",
            type: "success",
            input: "text",
            showCancelButton: false,
            confirmButtonClass: 'btn btn-success',
            confirmButtonText: 'Ok!'
        }, function (isConfirm) {
            if (isConfirm) {
                $("#resetInstruction").text("Enter the new recovery code");
                $("#formSendEmail").hide();
                $("#formSendEmail").addClass("hide");
                $("#formValidateEmail").show();
                $("#formValidateEmail").removeClass("hide");
            }
        });
    } else {
        swal({
            title: "Oops!",
            text: "Please email entered doesn't exist or something went wrong!",
            type: "info",
            showCancelButton: false,
            confirmButtonClass: 'btn btn-info',
            confirmButtonText: 'Retry'
        }, function (isConfirm) {
            if (isConfirm) {
                window.location = extension + "LinksServlet?type=Reset";
            }
        });
    }
}

function DisplayPlaceOrder(data) {
    if (data[0] === "success") {
        swal({
            title: "My Order",
            text: "Your order has been placed!",
            type: "success",
            showCancelButton: false,
            confirmButtonClass: 'btn btn-success btn-sm',
            confirmButtonText: 'Ok!'
        }, function (isConfirm) {
            if (isConfirm) {
                var orderid = data[1];
                $("#chkoutProcess").hide();
                $("#chkoutProcess").addClass("hide");
                $("#chkoutSummary").removeClass("hide");
                $("#chkoutSummary").show();
                GetData("Product", "GetPlacedOrder", "LoadPlacedOrderSummary", orderid);
            }
        });
    } else {
        swal({
            title: "Oops!",
            text: "Something went wrong!",
            type: "info",
            showCancelButton: false,
            confirmButtonClass: 'btn btn-info btn-sm',
            confirmButtonText: 'Ok'
        });
    }
}

function DisplayFilterParameters(params) {
    var parent = $(".filterparametersList");
    parent.empty();
    var FilterParameters = params[0];
    $.each(FilterParameters, function (Property, Values) {
        var parameter = $("<div />", {class: "paddingtop marginbottom parts-top halfwide parameterContainer"}).appendTo(parent);
        $("<div />", {class: "bold mediumtext marginbottom parameterName bluetext", text: "Filter By " + capitaliseFirstLetter(Property)}).appendTo(parameter);
        var valRow = $("<div />").appendTo(parameter);
        $.each(Values, function (index, value) {
            $("<span />", {class: "parts minibtn whitebtn border half-padding-horizontal margin nomargintop nomarginleft mini-radius", text: value, click: function () {
                    $(this).toggleClass("whitebtn");
                    $(this).toggleClass("goldbtn");
                    var filterParameters = "";
                    $.each($(".parameterContainer"), function (index, item) {
                        var parameterName = $(this).children(".parameterName").text().replace("Filter By", "");
                        $.each($(this).children().children(".goldbtn"), function (selctedValueIndex, selectedValueItem) {
                            var parameterSelectedValues = $(this).text();
                            filterParameters += parameterName + "~" + parameterSelectedValues + ";";
                        });
                    });
                    if (filterParameters === "") {
                        var category_id = $("#catID").val();
                        var query = $("#query").val();
                        var sort_by = document.getElementById("sortby").value;
                        var data = [category_id, query, 0, sort_by];
                        GetData("Product", "GetProducts", "LoadSearchResults", data);
                    } else {
                        filtering(filterParameters);
                    }
                }}).appendTo(valRow);
        });
    });
}

function sortPriceL_H(parent, childSelector, keySelector) {
    $(".loader").show(500);
    var items = parent.find(childSelector).sort(function (a, b) {
        var vA = parseInt($(keySelector, a).text().replace(",", "").replace("₦", ""));
        var vB = parseInt($(keySelector, b).text().replace(",", "").replace("₦", ""));
        return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
    });
    parent.append(items);
    $(".loader").hide(500);
}

function sortPriceH_L(parent, childSelector, keySelector) {
    $(".loader").show(500);
    var items = parent.find(childSelector).sort(function (a, b) {
        var vA = parseInt($(keySelector, a).text().replace(",", "").replace("₦", ""));
        var vB = parseInt($(keySelector, b).text().replace(",", "").replace("₦", ""));
        return (vA > vB) ? -1 : (vA < vB) ? 1 : 0;
    });
    parent.append(items);
    $(".loader").hide(500);
}

function sortText(parent, childSelector, keySelector) {
    $(".loader").show(500);
    var items = parent.find(childSelector).sort(function (a, b) {
        var vA = $(keySelector, a).text().trim().toLowerCase().replace(/ /g, '');
        var vB = $(keySelector, b).text().trim().toLowerCase().replace(/ /g, '');
        return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
    });
    parent.append(items);
    $(".loader").hide(500);
}

function sortNum(parent, childSelector, keySelector) {
    $(".loader").show(500);
    var items = parent.find(childSelector).sort(function (a, b) {
        var vA = parseFloat($(keySelector, a).text().trim());
        var vB = parseFloat($(keySelector, b).text().trim());
        return (vA > vB) ? -1 : (vA < vB) ? 1 : 0;
    });
    parent.append(items);
    $(".loader").hide(500);
}

function DisplayPromoProducts(data) {
    var promoList = data[0];
    var promoProd = data[1];
    var parentPromo = $("#PromoProducts");
    var childclone = parentPromo.find(".promo-clone");
    $.each(promoList, function (id, promo) {
        var newchild = childclone.clone();
        newchild.removeClass("promo-clone");
        newchild.removeClass("hide");
        newchild.find(".promo-name").text(promo["name"]);
        var par = newchild.find("#promo-products-list");
        var PromoProducts = promoProd[id];
        DisplayProducts(PromoProducts, par);
        newchild.appendTo(parentPromo);
    });
    childclone.hide();
}

function DisplayPickUpCenters(data) {
    var parent = $("#Pickupcenters");
    parent.find(".newclone").remove();
    if (data === "none") {
    } else {
        var childclone = parent.find(".clone");
        var newchild = childclone.clone();
        newchild.removeClass("clone");
        newchild.removeClass("hide");
        newchild.addClass("newclone");
        var centerBtn = newchild.find(".centerBtn");
        centerBtn.click(function () {
            var pickupfees = PriceFormat(data["fees"]);
            sessionStorage.setItem("addressID", data["id"]);
            sessionStorage.setItem("addressType", "PickUpCenter");
            $("#ReviewContainer").removeClass("hide");
            $("#ReviewContainer").show();
            ComputePickUpAddress(pickupfees);
        });
        newchild.find(".centerName").text(data["name"]);
        newchild.find(".centerAddress").text(data["address"]);
        newchild.find(".centerWorking").text(data["working_hours"]);
        newchild.find(".centerFess").text(data["fees"]);
        newchild.find(".centerPhone").text(data["phone"]);
        newchild.appendTo(parent).show();
        childclone.hide();
        $(".actionInfo").removeClass("hide");
    }
}

function DisplayLoadPickUpStates(data) {
    var parent = $("#pickstates");
    parent.empty();
    if (data === "empty") {
    } else {
        parent.append($('<option/>').val(0).text("Select Pick-Up State"));
        $.each(data, function (id, name) {
            $("<option />", {text: capitaliseFirstLetter(name), value: id}).appendTo(parent);
        });
        parent.change(function () {
            var catid = $(this).val();
            GetData("Product", "GetStatePickUpCentres", "LoadStatePickUpCentres", catid);
        });
    }
}

function DisplayStatePickUpCentres(data) {
    var parent = $("#statecentres");
    parent.empty();
    if (data === "empty") {
    } else {
        parent.append($('<option/>').val(0).text("Select Pick-Up Center"));
        $.each(data, function (id, name) {
            $("<option />", {text: capitaliseFirstLetter(name), value: id}).appendTo(parent);
        });
        parent.change(function () {
            var id = $(this).val();
            GetData("User", "GetPickUpCentres", "LoadPickUpCenters", id);
        });
    }
}

function DisplayUserAvailableBalance(data) {
    if (data !== "none") {
        availableBalance = data[0];
        $(".UserAcctBalance").text(PriceFormat(data[0]));
        $(".UserAcctEscrowBalance").text(PriceFormat(data[1]));
    }
}

function AddToWishList(pid) {
    if (userid === null || userid === "" || userid === "null") {
        swal({
            title: "Oops!",
            text: "Please login to Add product to WishList",
            type: "info",
            showCancelButton: true,
            confirmButtonClass: 'btn btn-info btn-sm',
            confirmButtonText: 'Login',
            cancelButtonText: "Cancel",
            cancelButtonClass: 'btn btn-primary btn-sm'
        }, function (isConfirm) {
            if (isConfirm) {
                sessionStorage.setItem("redirect", "");
                window.location = extension + "ControllerServlet?action=Link&type=Login";
            } else {
            }
        });
    } else {
        var data = userid + ":" + pid;
        GetData("Product", "AddToWishList", "LoadAddWishList", data);
    }
}

function RemoveFromWishList(pid) {
    if (userid === null || userid === "" || userid === "null") {
        swal({
            title: "Oops!",
            text: "Please login to remove product from WishList",
            type: "info",
            showCancelButton: false,
            confirmButtonClass: 'btn btn-info',
            confirmButtonText: 'Ok'
        });
    } else {
        swal({
            title: "My Wishlist",
            text: "Delete product from your Wishlist?",
            type: "info",
            showCancelButton: true,
            confirmButtonClass: 'btn btn-danger',
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            cancelButtonClass: 'btn btn-primary'
        }, function (isConfirm) {
            if (isConfirm) {
                var data = [userid, pid];
                GetData("Product", "RemoveFromWishList", "LoadRemoveFromWishList", data);
            } else {
            }
        });

    }
}

function EmptyWishList() {
    if (userid === null || userid === "" || userid === "null") {
        swal({
            title: "Oops!",
            text: "Please login to Add product to WishList",
            type: "info",
            showCancelButton: false,
            confirmButtonClass: 'btn btn-info',
            confirmButtonText: 'Ok'
        });
    } else {
        swal({
            title: "My Wishlist",
            text: "Empty your Wishlist?",
            type: "success",
            showCancelButton: true,
            confirmButtonClass: 'btn btn-danger',
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            cancelButtonClass: 'btn btn-primary'
        }, function (isConfirm) {
            if (isConfirm) {
                GetData("Product", "EmptyWishList", "LoadEmptyWishList", userid);
            } else {

            }
        });

    }
}

function RemoveFromCartList(data) {
    swal({
        title: "My Shopping Cart",
        text: "Deleted product from your Shopping Cart?",
        type: "info",
        showCancelButton: true,
        confirmButtonClass: 'btn btn-danger btn-sm',
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: false,
        closeOnCancel: false,
        cancelButtonClass: 'btn btn-primary btn-sm'
    }, function (isConfirm) {
        if (isConfirm) {
            GetData("Product", "DeleteProductFromCart", "LoadRemoveFromCartList", data);
        } else {
            GetData("Product", "GetUserCartList", "LoadCartList");
        }
    });

}

function ShopAddToCart(productid, quantity, amount) {
    var productdetails = productid + ":" + quantity + ":" + amount + ";";
    GetData("Product", "AddToCart", "LoadCartAction", productdetails);
}

function AddAllToCart() {
    if (userid === null || userid === "" || userid === "null") {
        swal({
            title: "Oops!",
            text: "Please login to Add product to WishList",
            type: "info",
            showCancelButton: false,
            confirmButtonClass: 'btn btn-info',
            confirmButtonText: 'Ok'
        });
    } else {
        GetData("Product", "AddAllToCart", "LoadCartAction", userid);
    }
}

function EmptyCartList() {
    swal({
        title: "My Shopping Cart",
        text: "Emtpy your Shopping Cart?",
        type: "info",
        showCancelButton: true,
        confirmButtonClass: 'btn btn-danger btn-sm',
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: false,
        closeOnCancel: false,
        cancelButtonClass: 'btn btn-primary btn-sm'
    }, function (isConfirm) {
        if (isConfirm) {
            GetData("Product", "EmptyCartList", "LoadCartAction");
        } else {
            GetData("Product", "GetUserCartList", "LoadCartList");
        }
    });

}

function UpdateCartProduct(productid, quantity, amount) {
    var productdetails = productid + ":" + quantity + ":" + amount + ";";
    var data = [productid, productdetails];
    GetData("Product", "UpdateCartProduct", "LoadCartAction", data);
}

function PriceFormat(price) {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    });
    price = formatter.format(price);
    price = price.replace("NGN", "₦");
    return price.replace(".00", "");
}

function CalculatePercentage(userAmt) {
    var addedPerc = (parseInt(userAmt) * parseFloat(0.02));
    var newAmt = parseInt(userAmt) + parseInt(addedPerc);
    if (parseInt(userAmt) >= parseInt(2500)) {
        newAmt = parseInt(userAmt) + parseInt(100);
    }
    return newAmt;
}

function ComputeUseMyAddress() {
    var fees = PriceFormat(1500);
    $("#DeliveryFees").text(fees);
    var newcarttamt = carttotalamount.replace("₦", "").replace(",", "");
    var totalamt = 1500 + parseInt(newcarttamt);
    var orderamt = PriceFormat(totalamt);
    $("#FinalTotalAmount").text(orderamt);
}

function ComputePickUpAddress(pickupfees) {
    $("#DeliveryFees").text(pickupfees);
    var newcarttamt = carttotalamount.replace("₦", "").replace(",", "");
    var unformatpickupfees = pickupfees.replace("₦", "").replace(",", "");
    var totalamt = parseInt(unformatpickupfees) + parseInt(newcarttamt);
    var orderamt = PriceFormat(totalamt);
    $("#FinalTotalAmount").text(orderamt);
}

function PlaceOrder(FinalOrderAmount, FinalDeliveryFees, paymentType) {
    var addressID = sessionStorage.getItem("addressID");
    var addressType = sessionStorage.getItem("addressType");
    if (addressID === "" || addressID === "null" || addressID === null || addressType === "" || addressType === "null" || addressType === null) {
        swal({
            title: "Place Order",
            text: "Please fill shipping information",
            type: "info",
            confirmButtonClass: 'btn btn-info',
            confirmButtonText: "Ok"
        });
    } else {
        var data = [userid, FinalOrderAmount, FinalDeliveryFees, addressID, addressType, paymentType];
        GetData("Product", "PlaceOrder", "LoadPlaceOrder", data);
    }

}

function payWithPaystack(userID, paymentamount, email, actualamount, PaymentType) {
    var userDetail;
    if (username) {
        userDetail = username;
    } else {
        userDetail = email;
    }
    var handler = PaystackPop.setup({
        key: 'pk_test_b3685f824518679567d6356e2636fc184878e833',
        email: email,
        amount: paymentamount + "00",
        ref: '' + Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
        metadata: {
            custom_fields: [
                {
                    display_name: "Customer Name",
                    variable_name: "Customer Name",
                    value: userDetail
                },
                {
                    display_name: "Payment Type",
                    variable_name: "Payment Type",
                    value: PaymentType
                }
            ]
        },
        callback: function (response) {
            var data = [userID, actualamount, response.reference, response.trans, PaymentType];
            GetData("Accounts", "ValidatePaystackTransaction", "LoadPaymentResponse", data);
        },
        onClose: function () {
            swal({
                title: "PayStack CheckOut!",
                text: "CheckOut closed, transaction terminated",
                type: "error",
                showCancelButton: false,
                confirmButtonClass: 'btn btn-danger',
                confirmButtonText: 'Retry',
            }, function (isConfirm) {
                if (isConfirm) {
                    window.location.reload();
                }
            });
        }
    });
    handler.openIframe();
}

function DisplayPaymentResponse(data) {
    if (data[0] === "Shop Cash Payment") {
        swal({
            title: "Payment Advice",
            text: data[2],
            type: data[1],
            showCancelButton: false,
            confirmButtonClass: 'btn btn-' + data[1],
            confirmButtonText: 'Continue'
        }, function (isConfirm) {
            if (isConfirm) {
                if (data[1] === "success") {
                    var OrderAmount = $("#FinalTotalAmount").text();
                    var DeliveryFees = $("#DeliveryFees").text();
                    var FinalOrderAmount = OrderAmount.replace("₦", "").replace(",", ""); //total order amount
                    var FinalDeliveryFees = DeliveryFees.replace("₦", "").replace(",", "");//total delivery fees
                    FinalOrderAmount = $.trim(FinalOrderAmount);
                    PlaceOrder(FinalOrderAmount, FinalDeliveryFees, "WithCash");
                } else {
                    window.location.reload();
                }
            }
        });
    }
}


function InsertMissingSection(Section) {
    var data;
    var LGAValue = $('#pickup-lgas').val();
    var StateValue = $('#pickup-states').val();
    var TownValue = $('#pickup-towns').val();
    var BStopValue = $('#pickup-busstop').val();
    var LCDAValue = $('#pickup-lcdas').val();
    var NewAddition = $('#_new' + Section).val();
    switch (Section) {
        case "lcdas":
        {
            data = [Section, NewAddition, LGAValue, StateValue];
            break;
        }
        case "towns":
        {
            if (LCDAValue === "0" || LCDAValue === "Select Your LCDA") {
                data = [Section, NewAddition, LGAValue, StateValue];
            } else {
                data = [Section, NewAddition, LCDAValue, LGAValue, StateValue];
            }
            break;
        }
        case "busstop":
        {
            if (LCDAValue === "0" || LCDAValue === "Select Your LCDA") {
                data = [Section, NewAddition, TownValue, LGAValue];
            } else {
                data = [Section, NewAddition, TownValue, LCDAValue, LGAValue];
            }
            break;
        }
        case "street":
        {
            data = [Section, NewAddition, BStopValue, TownValue];
            break;
        }

    }
    GetData("User", "InsertSection", "LoadNewSection", data);
    $('#_new' + Section).val("");
}

function SetLCDAValues(section) {
    var value = $("#userlcdas").children("option:selected").val();
    var value1 = $("#lcdas").children("option:selected").val();
    var data = [value, section, "LCDA"];
    GetData("User", "GetValues", "Show" + section + "Value", data);
    var data1 = [value1, section, "LCDA"];
    GetData("User", "GetValues", "Show" + section + "Value", data1);
}
function SetTownValues(section) {
    var value = $("#usertowns").children("option:selected").val();
    var data = [value, section, "Town"];
    GetData("User", "GetValues", "Show" + section + "Value", data);
    var value1 = $("#towns").children("option:selected").val();
    var data1 = [value1, section, "Town"];
    GetData("User", "GetValues", "Show" + section + "Value", data1);
}
function SetBstopValues(section) {
    var value = $("#userbusstops").children("option:selected").val();
    var data = [value, section, "Bstop"];
    GetData("User", "GetValues", "Show" + section + "Value", data);
    var value1 = $("#busstops").children("option:selected").val();
    var data1 = [value1, section, "Bstop"];
    GetData("User", "GetValues", "Show" + section + "Value", data1);
}
function SetStreetValues(section) {
    var value = $("#userstreets").children("option:selected").val();
    var data = [value, section, "Street"];
    GetData("User", "GetValues", "Show" + section + "Value", data);
    var value1 = $("#streets").children("option:selected").val();
    var data1 = [value1, section, "Street"];
    GetData("User", "GetValues", "Show" + section + "Value", data1);
}
function SetLCDAValues1(section) {
    var value = $("#lcdas").children("option:selected").val();
    var data = [value, section, "LCDA"];
    GetData("User", "GetValues", "Show" + section + "Value", data);

}
function SetTownValues1(section) {
    var value = $("#towns").children("option:selected").val();
    var data = [value, section, "Town"];
    GetData("User", "GetValues", "Show" + section + "Value", data);

}
function SetBstopValues1(section) {
    var value = $("#busstops").children("option:selected").val();
    var data = [value, section, "Bstop"];
    GetData("User", "GetValues", "Show" + section + "Value", data);
}
function SetStreetValues1(section) {
    var value = $("#streets").children("option:selected").val();
    var data = [value, section, "Street"];
    GetData("User", "GetValues", "Show" + section + "Value", data);

}

//****************Display value
function DisplayLGAValue(params) {
    var SectionOptions = $("#userlgas").children();
    var SectionOptions1 = $("#lgas").children();
    SectionOptions.find("option:selected").removeAttr('selected');
    var value = params.toString();
    $.each(SectionOptions, function () {
        if ($(this).val() === value) {
            $(this).attr('selected', 'selected');
        }
    });
    $.each(SectionOptions1, function () {
        if ($(this).val() === value) {
            $(this).attr('selected', 'selected');
        }
    });

}
function DisplayStateValue(params) {
    var StateSectionOptions = $("#userstates").children();
    var StateSectionOptions1 = $("#states").children();
    StateSectionOptions.find("option:selected").removeAttr('selected');
    var value = params.toString();
    $.each(StateSectionOptions, function () {
        if ($(this).val() === value) {
            $(this).attr('selected', 'selected');
        }
    });
    $.each(StateSectionOptions1, function () {
        if ($(this).val() === value) {
            $(this).attr('selected', 'selected');
        }
    });
}
function DisplayLCDAValue(params) {
    var SectionOptions = $("#userlcdas").children();
    var SectionOptions1 = $("#lcdas").children();
    SectionOptions.find("option:selected").removeAttr('selected');
    var value = params.toString();
    $.each(SectionOptions, function () {
        if ($(this).val() === value) {
            $(this).attr('selected', 'selected');
        }
    });
    $.each(SectionOptions1, function () {
        if ($(this).val() === value) {
            $(this).attr('selected', 'selected');
        }
    });
}
function DisplayTownValue(params) {
    var SectionOptions = $("#usertowns").children();
    var SectionOptions1 = $("#towns").children();
    SectionOptions.find("option:selected").removeAttr('selected');
    var value = params.toString();
    $.each(SectionOptions, function () {
        if ($(this).val() === value) {
            $(this).attr('selected', 'selected');
        }
    });
    $.each(SectionOptions1, function () {
        if ($(this).val() === value) {
            $(this).attr('selected', 'selected');
        }
    });
}
function DisplayBstopValue(params) {
    var SectionOptions = $("#userbusstops").children();
    var SectionOptions1 = $("#busstops").children();
    SectionOptions.find("option:selected").removeAttr('selected');
    var value = params.toString();
    $.each(SectionOptions, function () {
        if ($(this).val() === value) {
            $(this).attr('selected', 'selected');
        }
    });
    $.each(SectionOptions1, function () {
        if ($(this).val() === value) {
            $(this).attr('selected', 'selected');
        }
    });
}
function DisplayNewSection(params) {
    var usersection;
    var usersection1;
    var Section = params[0];
    var Section_Name = params[1];
    var value = params[2];
    switch (Section) {
        case "lcdas":
        {
            usersection = "#userlcdas";
            usersection1 = "#lcdas";
            break;
        }
        case "towns":
        {
            usersection = "#usertowns";
            usersection1 = "#towns";
            break;
        }
        case "busstop":
        {
            usersection1 = "#busstops";
            usersection = "#userbusstops";
            break;
        }
        case "street":
        {
            usersection = "#userstreets";
            usersection1 = "#streets";
            break;
        }
    }
    //$("<option>").val(value).text(Section_Name).attr('selected', 'selected').appendTo(pickupsection);
    //pickupsection.append($('<option/>').val(value).text(Section_Name).attr('selected', 'selected'));
    $("<option>").val(value).text(Section_Name).attr('selected', 'selected').appendTo(usersection);
    $("<option>").val(value).text(Section_Name).attr('selected', 'selected').appendTo(usersection1);
}

function DisplayStates(data) {
//    hideLoader();
    var ds = $("#states");
    ds.empty();
    if (data === "empty") {
    } else {
        $('<option/>').val("0").text("Select State").appendTo(ds);
        $.each(data, function (index, value) {
            $.each(value, function (key, value) {
                $('<option>').val(key).text(value).appendTo(ds);
            });
            if (index === "") {

            } else {
                var fx = ds.children();
                $.each(fx, function () {
                    if ($(this).val() === index) {
                        $(this).attr('selected', 'selected');
                    }
                });
            }
        });
    }

    var ps = $("#userstates");
    ps.empty();
    if (data === "empty") {
    } else {
        $('<option/>').val("0").text("Select State").appendTo(ps);
        $.each(data, function (index, value) {
            $.each(value, function (key, value) {
                $('<option>').val(key).text(value).appendTo(ps);
            });
            if (index === "") {

            } else {
                var px = ps.children();
                $.each(px, function () {
                    if ($(this).val() === index) {
                        $(this).attr('selected', 'selected');
                    }
                });
            }
        });
    }


}
function Displaylgas(data) {
    var ds = $("#lgas");
    ds.empty();
    if (data === "empty") {
    } else {
        $('<option/>').val("0").text("Select LGA").appendTo(ds);
        $.each(data, function (index, value) {
            $.each(value, function (key, value) {
                $('<option>').val(key).text(value).appendTo(ds);
            });
            if (index === "") {

            } else {
                var fx = ds.children();
                $.each(fx, function () {
                    if ($(this).val() === index) {
                        $(this).attr('selected', 'selected');
                    }
                });
            }
        });
    }

    var ps = $("#userlgas");
    ps.empty();
    if (data === "empty") {
    } else {
        $('<option/>').val("0").text("Select LGA").appendTo(ps);
        $.each(data, function (index, value) {
            $.each(value, function (key, value) {
                $('<option>').val(key).text(value).appendTo(ps);
            });
            if (index === "") {

            } else {
                var px = ps.children();
                $.each(px, function () {
                    if ($(this).val() === index) {
                        $(this).attr('selected', 'selected');
                    }
                });
            }
        });
    }

//    hideLoader();

}
function DisplayLCDAs(data) {
    var ds = $("#lcdas");
    ds.empty();
    if (data === "empty") {
    } else {
        $('<option/>').val("0").text("Select LCDA").appendTo(ds);
        $.each(data, function (index, value) {
            $.each(value, function (key, value) {
                $('<option>').val(key).text(value).appendTo(ds);
            });
            if (index === "") {

            } else {
                var fx = ds.children();
                $.each(fx, function () {
                    if ($(this).val() === index) {
                        $(this).attr('selected', 'selected');
                    }
                });
            }
        });
    }

    var ps = $("#userlcdas");
    ps.empty();
    if (data === "empty") {
    } else {
        $('<option/>').val("0").text("Select LCDA").appendTo(ps);
        $.each(data, function (index, value) {
            $.each(value, function (key, value) {
                $('<option>').val(key).text(value).appendTo(ps);
            });
            if (index === "") {

            } else {
                var px = ps.children();
                $.each(px, function () {
                    if ($(this).val() === index) {
                        $(this).attr('selected', 'selected');
                    }
                });
            }
        });
    }

//    //    hideLoader();();
}
function DisplayTowns(data) {
    var ds = $("#towns");
    ds.empty();
    if (data === "empty") {
    } else {
        $('<option/>').val("0").text("Select Town").appendTo(ds);
        $.each(data, function (index, value) {
            $.each(value, function (key, value) {
                $('<option>').val(key).text(value).appendTo(ds);
            });
            if (index === "") {

            } else {
                var fx = ds.children();
                $.each(fx, function () {
                    if ($(this).val() === index) {
                        $(this).attr('selected', 'selected');
                    }
                });
            }
        });
    }

    var ps = $("#usertowns");
    ps.empty();
    if (data === "empty") {
    } else {
        $('<option/>').val("0").text("Select Town").appendTo(ps);
        $.each(data, function (index, value) {
            $.each(value, function (key, value) {
                $('<option>').val(key).text(value).appendTo(ps);
            });
            if (index === "") {

            } else {
                var px = ps.children();
                $.each(px, function () {
                    if ($(this).val() === index) {
                        $(this).attr('selected', 'selected');
                    }
                });
            }
        });
    }

    //    hideLoader();();
}
function DisplayBusStops(data) {
    var ds = $("#busstops");
    ds.empty();
    if (data === "empty") {
    } else {
        $('<option/>').val("0").text("Select Bus Stop").appendTo(ds);
        $.each(data, function (index, value) {
            $.each(value, function (key, value) {
                $('<option>').val(key).text(value).appendTo(ds);
            });
            if (index === "") {

            } else {
                var fx = ds.children();
                $.each(fx, function () {
                    if ($(this).val() === index) {
                        $(this).attr('selected', 'selected');
                    }
                });
            }
        });
    }

    var ps = $("#userbusstops");
    ps.empty();
    if (data === "empty") {
    } else {
        $('<option/>').val("0").text("Select Bus Stop").appendTo(ps);
        $.each(data, function (index, value) {
            $.each(value, function (key, value) {
                $('<option>').val(key).text(value).appendTo(ps);
            });
            if (index === "") {

            } else {
                var px = ps.children();
                $.each(px, function () {
                    if ($(this).val() === index) {
                        $(this).attr('selected', 'selected');
                    }
                });
            }
        });
    }

    //    hideLoader();();
}
function DisplayStreets(data) {
    var ds = $("#streets");
    ds.empty();
    if (data === "empty") {
    } else {
        $('<option/>').val("0").text("Select Street").appendTo(ds);
        $.each(data, function (index, value) {
            $.each(value, function (key, value) {
                $('<option>').val(key).text(value).appendTo(ds);
            });
            if (index === "") {

            } else {
                var fx = ds.children();
                $.each(fx, function () {
                    if ($(this).val() === index) {
                        $(this).attr('selected', 'selected');
                    }
                });
            }
        });
    }

    var ps = $("#userstreets");
    ps.empty();
    if (data === "empty") {
    } else {
        $('<option/>').val("0").text("Select Street").appendTo(ps);
        $.each(data, function (index, value) {
            $.each(value, function (key, value) {
                $('<option>').val(key).text(value).appendTo(ps);
            });
            if (index === "") {

            } else {
                var px = ps.children();
                $.each(px, function () {
                    if ($(this).val() === index) {
                        $(this).attr('selected', 'selected');
                    }
                });
            }
        });
    }

    //    hideLoader();();
}

$("._newL").click(function () {
    $('._newlcdas').val("");
    $('._hideL').show();
    $('#_newLok1').click(function () {
        if ($('._newlcdas').val() === "" || $('._newlcdas').val() === "0") {
            $('._hideL').hide();
        } else {
            $('._hideL').hide();
            InsertMissingSection("lcdas");
        }
    });
    $('#_newLok').click(function () {
        if ($('._newlcdas').val() === "" || $('._newlcdas').val() === "0") {
            $('._hideL').hide();
        } else {
            $('._hideL').hide();
            InsertMissingSection("lcdas");
        }
    });
});
$("._newT").click(function () {
    $('._newtowns').val("");
    $('._hideT').show();
    $('#_newTok1').click(function () {
        if ($('._newtowns').val() === "" || $('._newtowns').val() === "") {
            $('._hideT').hide();
        } else {
            $('._hideT').hide();
            InsertMissingSection("towns");
        }
    });
    $('#_newTok').click(function () {
        if ($('._newtowns').val() === "" || $('._newtowns').val() === "") {
            $('._hideT').hide();
        } else {
            $('._hideT').hide();
            InsertMissingSection("towns");
        }
    });
});
$('._newB').click(function () {
    $('._newbusstop').val("");
    $('._hideB').show();
    var cLcda = $("._lcda").val();
    $('#_newBok1').click(function () {
        if ($('._newbusstop').val() === "" || $('._newbusstop').val() === "") {
            $('._hideB').hide();
        } else {
            $('._hideB').hide();
            InsertMissingSection("busstop");
        }
    });
    $('#_newBok').click(function () {
        if ($('._newbusstop').val() === "" || $('._newbusstop').val() === "") {
            $('._hideB').hide();
        } else {
            $('._hideB').hide();
            InsertMissingSection("busstop");
        }
    });
});
$('._newS').click(function () {
    $('._newstreet').val("");
    $('._hideS').show();
    $('#_newSok1').click(function () {
        if ($('._newstreet').val() === "" || $('._newstreet').val() === "") {
            $('._hideS').hide();
        } else {
            $('._hideS').hide();
            InsertMissingSection("street");

        }
    });
    $('#_newSok').click(function () {
        if ($('._newstreet').val() === "" || $('._newstreet').val() === "") {
            $('._hideS').hide();
        } else {
            $('._hideS').hide();
            InsertMissingSection("street");

        }
    });
});
function DisplayAddUserAddress(data) {
    if (data === "success") {
        swal({
            title: "Address Added",
            text: "Successful",
            type: "success",
            showCancelButton: false,
            confirmButtonClass: 'btn btn-success btn-sm',
            confirmButtonText: "Ok",
            onClose: function () {
                $(".bd-example-modaladdress").modal("hide");
                window.location.reload();
            }
        });
    } else {
        swal({
            title: "Oops!",
            text: "Something went wrong!",
            type: "info",
            showCancelButton: false,
            confirmButtonClass: 'btn btn-info btn-sm',
            confirmButtonText: 'Ok',
            onClose: function () {
                window.location.reload();
                $(".bd-example-modaladdress").modal("hide");
            }
        });
    }
}
function DisplayAddUserAddressAfterEdit(data) {
    //    hideLoader();();
    if (data === "success") {
        swal({
            title: "Address Editted",
            text: "Successful",
            type: "success",
            showCancelButton: false,
            confirmButtonClass: 'btn btn-success btn-sm',
            confirmButtonText: "Ok",
            onClose: function () {
                $(".bd-example-modaladdress").modal("hide");
                window.location.reload();
            }
        });
    } else {
        swal({
            title: "Oops!",
            text: "Something went wrong!",
            type: "info",
            showCancelButton: false,
            confirmButtonClass: 'btn btn-info btn-sm',
            confirmButtonText: 'Ok',
            onClose: function () {
                window.location.reload();
                $(".bd-example-modaladdress").modal("hide");
            }
        });
    }
}
function PopulateStates(returnValue) {
    var Section = "State";
    var value = "157";
    var data = [value, Section, returnValue];
    GetData("User", "Populate", "LoadStates", data);
}
function PopulateLGAs(value, returnValue) {
    var data;
    var Section = "LGA";
    data = [value, Section, returnValue];
    GetData("User", "Populate", "LoadLGAs", data);
}
function PopulateLCDAsFromState(value, returnValue) {
    var data;
    var Section = "LCDAfromState";
    data = [value, Section, returnValue];
    GetData("User", "Populate", "LoadLCDAs", data);
}
function PopulateLCDAsFromLGA(value, returnValue) {
    var data;
    var Section = "LCDAfromLGA";
    data = [value, Section, returnValue];
    GetData("User", "Populate", "LoadLCDAs", data);
}
function PopulateTownsFromState(value, returnValue) {
    var data;
    var Section = "TownfromState";
    data = [value, Section, returnValue];
    GetData("User", "Populate", "LoadTowns", data);
}
function PopulateTownsFromLCDA(value, returnValue) {
    var data;
    var Section = "TownfromLCDA";
    data = [value, Section, returnValue];
    GetData("User", "Populate", "LoadTowns", data);
}
function PopulateTownsFromLGA(value, returnValue) {
    var data;
    var Section = "TownfromLGA";
    data = [value, Section, returnValue];
    GetData("User", "Populate", "LoadTowns", data);
}
function PopulateBstopsFromLGA(value, returnValue) {
    var data;
    var Section = "BstopfromLGA";
    data = [value, Section, returnValue];
    GetData("User", "Populate", "LoadBusStops", data);
}
function PopulateBstopsFromLCDA(value, returnValue) {
    var data;
    var Section = "BstopfromLCDA";
    data = [value, Section, returnValue];
    GetData("User", "Populate", "LoadBusStops", data);
}
function PopulateBstopsFromTown(value, returnValue) {
    var data;
    var Section = "BstopfromTown";
    data = [value, Section, returnValue];
    GetData("User", "Populate", "LoadBusStops", data);
}
function PopulateStreetsFromTown(value, returnValue) {
    var data;
    var Section = "StreetfromTown";
    data = [value, Section, returnValue];
    GetData("User", "Populate", "LoadStreets", data);
}
function PopulateStreetsFromBstop(value, returnValue) {
    var data;
    var Section = "StreetfromBstop";
    data = [value, Section, returnValue];
    GetData("User", "Populate", "LoadStreets", data);
}

function orderStatusPageFunction() {
    var orderNO = $("#orderNOinput");
    $(".OrderNoSubmit").click(function () {
        var OrderNum = orderNO.val();
        GetData("Product", "GetOrderNODetails", "LoadOrderNoDetails", OrderNum);
        $("#id_orders").addClass("active bg-white blacktext");
    });

}
function DisplayMakeComplain(params) {
    if (params == "success") {
        swal({
            title: 'Success',
            text: "Your complain has been logged!",
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok!',
            confirmButtonClass: 'btn btn-success',
            buttonsStyling: false
        });
    } else {
        swal({
            title: 'Ooops',
            text: "Something went wrong!",
            type: 'info',
            showCancelButton: false,
            confirmButtonText: 'Ok!',
            confirmButtonClass: 'btn btn-info',
            buttonsStyling: false
        });
    }
}
function linkToFunction(action, params) {
    switch (action) {
        case "LoadStates":
        {
            DisplayStates(params);
            break;
        }
        case "LoadLGAs":
        {
            Displaylgas(params);
            break;
        }
        case "LoadTowns":
        {
            DisplayTowns(params);
            break;
        }
        case "LoadLCDAs":
        {
            DisplayLCDAs(params);
            break;
        }
        case "LoadBusStops":
        {
            DisplayBusStops(params);
            break;
        }
        case "LoadStreets":
        {
            DisplayStreets(params);
            break;
        }
        case "ShowstateValue":
        {
            DisplayStateValue(params);
            break;
        }
        case "ShowlgaValue":
        {
            DisplayLGAValue(params);
            break;
        }
        case "ShowlcdaValue":
        {
            DisplayLCDAValue(params);
            break;
        }
        case "ShowtownValue":
        {
            DisplayTownValue(params);
            break;
        }
        case "ShowbstopValue":
        {
            DisplayBstopValue(params);
            break;
        }
        case "LoadNewSection":
        {
            DisplayNewSection(params);
            break;
        }
        case "LoadUserAddress":
        {
            DisplayAddUserAddress(params);
        }
        case "LoadAddUserAddressAfterEdit":
        {
            DisplayAddUserAddressAfterEdit(params);
        }



        case "LoadTopCategories":
        {
            var data = $.map(params, function (el) {
                return el;
            });
            var newParams1 = data.slice(0, 1);
            var parent1 = $(".topcategorydisplay1");
            DisplayTopCategories(newParams1, parent1);
            var newParams2 = data.slice(1, 2);
            var parent2 = $(".topcategorydisplay2");
            DisplayTopCategories(newParams2, parent2);
            var newParams3 = data.slice(2, 3);
            var parent3 = $(".topcategorydisplay3");
            DisplayTopCategories(newParams3, parent3);
            var newParams4 = data.slice(3, 4);
            var parent4 = $(".topcategorydisplay4");
            DisplayTopCategories(newParams4, parent4);
            var newParams5 = data.slice(4, 5);
            var parent5 = $(".topcategorydisplay5");
            DisplayTopCategories(newParams5, parent5);
            var newParams6 = data.slice(5, 6);
            var parent6 = $(".topcategorydisplay6");
            DisplayTopCategories(newParams6, parent6);
            break;
        }
        case "LoadAddress":
        {
            DisplayAddress(params);

            break;
        }
        case "LoadReviewProduct":
        {
            DisplayReviewProduct(params);

            break;
        }
        case "LoadUserLogin":
        {
            DisplayUserLogin(params);
            break;
        }
        case "LoadMemberDetails":
        {
            DisplayMemberDetails(params);
            DisplayCheckOutAddress(params);
            break;
        }
        case "LoadUserDetails":
        {
            DisplayUpdateUserDetails(params);
            break;
        }
        case "LoadAddWishList":
        {
            DisplayActionWishList(params);
            break;
        }
        case "LoadRemoveFromWishList":
        {
            DisplayActionWishList(params);
            break;
        }
        case "LoadRemoveFromCartList":
        {
            DisplayCartAction(params);
            break;
        }
        case "LoadEmptyWishList":
        {
            DisplayActionWishList(params);
            break;
        }
        case "LoadCartList":
        {
            DisplayCartList(params);
            DisplayCheckOutReviewCart(params);
            break;
        }
        case "LoadCartAction":
        {
            DisplayCartAction(params);
            break;
        }
        case "LoadCartCount":
        {
            DisplayLoadCartCount(params);
            break;
        }
        case "LoadUserProductReviews":
        {
            DisplayUserProductReviews(params);
            break;
        }
        case "LoadPickUpCenters":
        {
            DisplayPickUpCenters(params);
            break;
        }
        case "LoadPickUpStates":
        {
            DisplayLoadPickUpStates(params);
            break;
        }
        case "LoadStatePickUpCentres":
        {
            DisplayStatePickUpCentres(params);
            break;
        }
        case "LoadUserAvailableBalance":
        {
            DisplayUserAvailableBalance(params);
            break;
        }
        case "LoadCateogryProducts":
        {
            var data1 = params[0];
            var data2 = params[1];
            var data3 = params[2];
            var data4 = params[3];
            var data5 = params[4];
            var data6 = params[5];
            var data7 = params[6];
            var data8 = params[7];
            var parent1 = $(".products-category1");
            DisplayProducts(data1, parent1);
            var parent2 = $(".products-category2");
            DisplayProducts(data2, parent2);
            var parent3 = $(".products-category3");
            DisplayProducts(data3, parent3);
            var parent4 = $(".products-category4");
            DisplayProducts(data4, parent4);
            var parent5 = $(".products-category5");
            DisplayProducts(data5, parent5);
            var parent6 = $(".products-category6");
            DisplayProducts(data6, parent6);
            var parent7 = $(".products-category7");
            DisplayProducts(data7, parent7);
            var parent8 = $(".products-category8");
            DisplayProducts(data8, parent8);
            break;
        }
        case "LoadFeaturedProducts":
        {
            var data = $.map(params, function (el) {
                return el;
            });
            var paramGroup1 = data.slice(0, 1);
            var parent1 = $(".category-products1");
            DisplayProducts(paramGroup1, parent1);
            var paramGroup2 = data.slice(2, 3);
            var parent2 = $(".category-products2");
            DisplayProducts(paramGroup2, parent2);
            var paramGroup3 = data.slice(4, 5);
            var parent3 = $(".category-products3");
            DisplayProducts(paramGroup3, parent3);
            var paramGroup4 = data.slice(6, 7);
            var parent4 = $(".category-products4");
            DisplayProducts(paramGroup4, parent4);
            var paramGroup5 = data.slice(8, 9);
            var parent5 = $(".category-products5");
            DisplayProducts(paramGroup5, parent5);
            var paramGroup6 = data.slice(10, 11);
            var parent6 = $(".category-products6");
            DisplayProducts(paramGroup6, parent6);
            var paramGroup7 = data.slice(12, 13);
            var parent7 = $(".category-products7");
            DisplayProducts(paramGroup7, parent7);
            var paramGroup8 = data.slice(14, 15);
            var parent8 = $(".category-products8");
            DisplayProducts(paramGroup8, parent8);
            var paramGroup9 = data.slice(16, 17);
            var parent9 = $(".category-products9");
            DisplayProducts(paramGroup9, parent9);
            break;
        }
        case "LoadTopDeals":
        {
            var data = $.map(params, function (el) {
                return el;
            });
            var paramGroup = data.slice(0, 4);
            var parent = $("#topDeals");
            DisplayProducts(paramGroup, parent);
            break;
        }
        case "LoadLeftFeatureProducts":
        {
            var data = $.map(params, function (el) {
                return el;
            });
            var paramGroup = data.slice(0, 4);
            DisplayLeftFeatureProducts(paramGroup);
            break;
        }
        case "LoadRelatedProducts":
        {
            var data = $.map(params, function (el) {
                return el;
            });
            var paramGroup = data.slice(0, 4);
            var parent = $(".product_related");
            DisplayProducts(paramGroup, parent);
            break;
        }
        case "LoadLatestProducts":
        {
            var data = $.map(params, function (el) {
                return el;
            });
            var paramGroup = data.slice(0, 2);
            var paramGroup2 = data.slice(3, 5);
            var paramGroup3 = data.slice(6, 8);
            var paramGroup4 = data.slice(9, 11);
            var paramGroup5 = data.slice(12, 14);
            var paramGroup6 = data.slice(15, 17);
            var paramGroup7 = data.slice(18, 20);
            var parent = $(".List1");
            DisplayProducts(paramGroup, parent);
            var parent2 = $(".List2");
            DisplayProducts(paramGroup2, parent2);
            var parent3 = $(".List3");
            DisplayProducts(paramGroup3, parent3);
            var parent4 = $(".List4");
            DisplayProducts(paramGroup4, parent4);
            var parent5 = $(".List5");
            DisplayProducts(paramGroup5, parent5);
            var parent6 = $(".List6");
            DisplayProducts(paramGroup6, parent6);
            var parent7 = $(".List7");
            DisplayProducts(paramGroup7, parent7);
            break;
        }
        case "LoadWishList":
        {
            DisplayWishList(params);
            break;
        }
        case "LoadOrderList":
        {
            DisplayOrderList(params, parent);
            break;
        }
        case "LoadOrderOption":
        {
            DisplayOrderOption(params);
            break;
        }
        case "LoadPlacedOrderList":
        {
            DisplayPlacedOrderList(params);
            break;
        }
        case "LoadPlacedOrderSummary":
        {
            DisplayPlacedOrderSummary(params);
            break;
        }
        case "LoadSearchResults":
        {
            var categoryItems = params[0];
            var productItems = params[1];
            var propertyItems = params[2];

            var catName = categoryItems[0];
            var catDescription = categoryItems[1];
            var catID = categoryItems[2];
            if (catName === "") {
                catName = "All Products";
            }
            var imageUrl;
            if (catID === "0" || catID === 0) {
                imageUrl = extension + "global_assets/app/img/CategoryImages/category-0" + catID + ".png";
                $(".category_banner_desc").text("All WealthMarket products");
            } else {
                imageUrl = extension + "global_assets/app/img/CategoryImages/category-" + catID + ".png";
                $(".category_banner_desc").text(catDescription);
            }
            $(".categories_banner_area").css("background-image", "url('" + imageUrl + "'");
            $(".category_banner_name").text((capitaliseFirstLetter(catName)));

            var parent = $(".products-list");
            DisplayProducts(productItems, parent);
            DisplayFilterParameters(propertyItems);
            productsin = productItems;
            input = Object.keys(productItems);
            pagecheck = "create";
            // load pagination starting from the index page
            pagination(1);
            break;
        }
        case "LoadPromoResults":
        {
            DisplayPromoProducts(params);
            break;
        }
        case "LoadPassword":
        {
            DisplayPasswordReset(params);
            break;
        }
        case "LoadProductDetails":
        {
            DisplayProductDetails(params);
            break;
        }
        case "LoadGetProductReviews":
        {
            DisplayGetProductReviews(params);
            break;
        }

        case "LoadMenuCategories":
        {
            DisplayMenuCategoriesList(params);
            break;
        }
        case "LoadProductSubCategories":
        {
            DisplayProductSubCategories(params);
            break;
        }
        case "LoadGetAllCategories":
        {
            DisplayGetAllCategories(params);
            break;
        }
        case "LoadDropDownCategories":
        {

            var data = $.map(params, function (el) {
                return el;
            });
            var paramGroup = data.slice(0, 8);
            DisplayDropDownCategoriesList(paramGroup);
            break;
        }

        case "LoadPlaceOrder":
        {
            DisplayPlaceOrder(params);
            break;
        }
        case "LoadAllProductCategories":
        {

            DisplayAllProductCategories(params);
            break;
        }
        case "LoadOrderNoDetails":
        {
            Displayordernumb(params);
            break;
        }
        case "LoadPaymentResponse":
        {
            DisplayPaymentResponse(params);
            break;
        }
        case "LoadMakeComplain":
        {
            DisplayMakeComplain(params);
            break;
        }
    }

}


