var click_obj = '', is_window_action=0;

function bgHide() {
    $(".bg_color2").hide();
    $(".Open_div").hide();
    $(".commodity_detail").hide();
    $(".Specifications").hide();
}

function add_car_animat() {
    /*购物车购物按钮移动*/
    var end = $("#count_shop_num");
    var bezierDom = $('<span class="bezierDom">1</span>');
    bezierDom.fly({
        start: {
            left: window.click_obj.offset().left, //开始位置（必填）#fly元素会被设置成position: fixed
            top: window.click_obj.offset().top - $(document).scrollTop() //开始位置（必填）
        },
        autoPlay: true,
        speed: 2,
        vertex_Rtop: -30,
        end: {
            left: end.offset().left + 10, //结束位置（必填）
            top: end.offset().top - $(document).scrollTop() + 10, //结束位置（必填）
            width: 25, //结束时宽度
            height: 25 //结束时高度
        },
        onEnd: function() { //结束回调
            this.destory(); //移除dom
        }
    });
}

/*获取规格单个产品的个数*/
function getProSingleNum(pid, paramid) {
    // var gouwuche = readCookie(user_name + '_gouwuche');
    var num = 0;
    var curPro = $('#shop_car_line .shop_num[data-id="'+pid+'"][data-param="'+ paramid +'"]');
    if(curPro.length){
        num = curPro.find('.pro_num').text();
        /* if (gouwuche) {
            var aOrder = JSON.parse(gouwuche);
            for (key in aOrder) {
                if (key == (pid + '_' + paramid)) {
                    num = aOrder[key].num;
                }
            }
        } */
    }
    return parseInt(num);
}

/*获取单个产品的总的个数*/
function getProNum(pid) {
    // var gouwuche = readCookie(user_name + '_gouwuche');
    var num = 0;
    var curPro = $('#shop_car_line .shop_num[data-id="'+pid+'"]');
    curPro.each(function(i, dom){
        dom = $(dom);
        num += (dom.find('.pro_num').text() * 1);
    });
   /*  if (gouwuche) {
        var aOrder = JSON.parse(gouwuche);
        for (key in aOrder) {
            if (key.indexOf(pid + '_') === 0) {
                num += parseInt(aOrder[key].num);
            }
        }
    } */
    return num;
}

/*购物车数据显示*/
function shopCon(arithmetic, isExist, pid, appendTag) {
    if (!isExist && (arithmetic == 'add')) {
        if ($(".Open_con .Open_list").length > 0) {
            $(".Open_con").append(appendTag); //向购物车添加产品
        } else {
            $(".Open_con").html(appendTag); //向购物车添加产品
        }
    }
}

function carShopNew(actionObj, sn, param_id) {
    /*操作本身属性*/
    var arithmetic = actionObj.attr("data-action");

    /*操作父级属性*/
    var _parent = actionObj.parents('.shop_num');
    var sn = _parent.attr('data-sn');
    var param_name = _parent.attr('data-snname');
    var price = _parent.attr('data-price');
    var stock = _parent.attr('data-stock');
    var type = _parent.attr('data-type');
    var zk = _parent.attr('data-zk');
    var name = _parent.attr('data-name');
    var pid = _parent.attr("data-id");
    var paramid = _parent.attr('data-param');
    var ptype = _parent.attr('data-type');

    var reduce_num = parseInt(_parent.attr('data-reducenum'));
    var min_num = parseInt(_parent.attr('data-minnum'));
    if (actionObj.hasClass('addBtn') && !is_window_action) {
        var pro_single_count = 0;
    } else {
        var pro_single_count = parseInt(_parent.attr('data-count'));
        if (is_window_action) {
            pro_single_count = parseInt($("#pro_count_num").val());
            is_window_action = 0;
        }
    }
    var count_price = parseFloat($("#count_price").html());
    var count_num = parseInt($("#count_shop_num").html());//购物车总的数量
    var order = maxOrder();
    var pro_paramid = pid + '_' + paramid;
    var singleNum = 0;
    var tmp_car_price = 0;
    if (paramid && !actionObj.hasClass('addBtn') && !actionObj.hasClass('jianBtn')) {
        price = parseFloat($(".Specifications #sn_price").val());
    }
    singleNum = getProSingleNum(pid, paramid); /*获取购物车中该规格产品的数量*/

    var num = 0;
    num = parseInt(getProNum(pid)); /*获取购物车中该产品的所有规格中总的个数*/

    name = combineName(name, type, param_name); /*底部购物车中产品的名称*/
    if (zk > 0) { /*折扣价*/
        zk_price = nCount.div(zk, 10);
        price = nCount.mul(price, zk_price);
    }
    // var isExist = checkCookie(pid, paramid); /*验证是否添加过该产品*/
    var isExist = (function(){
        return !!($('#shop_car_line .shop_num[data-id="'+pid+'"][data-param="'+ paramid +'"]').length)
    }(pid, paramid));
    /*操作*/
    if (arithmetic == 'add') {
        var oneAddCatNum = 1;
        if (pro_single_count) {
            //弹窗
            num = num + pro_single_count;
            singleNum = singleNum + pro_single_count;
        } else {
            //列表
            if(singleNum == 0){
                singleNum+= reduce_num; //单个产品单数加一
                num+=reduce_num; //单个产品总数加一
                oneAddCatNum = reduce_num;
            }else{
                singleNum++; //单个产品单数加一
                num++; //单个产品总数加一
            }
        }

        if (!min_num) {
            singleNum = singleNum<min_num ? min_num : singleNum;
            num = num<min_num ? min_num : num;
        }

        if (parseInt(num) > parseInt(stock)) {
            alert('产品库存不足！');
            return false;
        }

        if (pro_single_count) {
            count_num = count_num + pro_single_count;
            tmp_car_price = nCount.mul(price, pro_single_count);
        } else {
            count_num+=oneAddCatNum; //购物车产品总数加一
            tmp_car_price = nCount.mul(price, 1);
        }

        if (actionObj.attr('data-car')) {
            add_car_animat();
            var proSpecName = '',namesArr = []; 
            if (param_name) {
                var arr11 = param_name.split('，');
                $.each(arr11,function(index,item){
                    namesArr.push(item.split('：')[1]);
                }) 
                proSpecName =  '('+namesArr.join('，')+')';
            }
            /*购物车数据*/
            var appendTag = '<div class="Open_list p_' + pro_paramid + ' shop_num" data-stock="' + stock + '" data-zk="' + zk + '" data-param="' + paramid + '" data-list="0" data-id="' + pid + '" data-price="' + price + '" data-type="' + ptype + '" data-reducenum="' + reduce_num + '" data-count="'+num+'"><span>' + name + proSpecName + '</span><p>￥<em class="market_price">' + price + '</em></p>';
            if (parseFloat(zk) != 0) {
                appendTag += '<p>' + zk + '折</p>';
            }
            appendTag += '<div class="add_int1 is_specifications"><a href="###" class="jia addBtn" data-action="add">+</a><font class="pro_num">' + singleNum + '</font><a href="###" class="jian jianBtn" data-action="reduce">-</a></div><input type="hidden" name="goods_num[]" value="' + num + '" class="tmp_num"/><input type="hidden" name="tmp_t[]" value="' + order + '"><input type="hidden" name="id[]" value="' + pid + '"><input type="hidden" name="param_val[]" value="' + param_name + '"><input type="hidden" name="market_price[]" value="' + price + '" id="goods_price_' + order + '"><input type="hidden" name="param_pro[]" value="' + pro_paramid + '"><input type="hidden" name="param_val_new[]" value=""><input type="hidden" name="sn[]" value="' + sn + '"></div></div>';
            shopCon(arithmetic, isExist, pid, appendTag);
        }
        $("#pid_" + pid).removeClass('show_cur');
        $("#no_choose_pro").css('display', 'none'); //隐藏"未选购商品"
        $("#go_shopping").removeClass('cur_choose'); //去结算去灰
        var iCountPrice = parseFloat(count_price + parseFloat(tmp_car_price)).toFixed(2); //购物车总金额
    } else if (arithmetic == 'reduce') {
        /* if (actionObj.attr('data-list')) { //列表点击jian显示购物车
            $(".Settlement_L a").trigger('click');
            return false;
        } */
        if (singleNum <= reduce_num || num <= reduce_num) {
            singleNum-=reduce_num; //单个产品单数减一
            num-=reduce_num; //单个产品总数减一
            count_num-=reduce_num;
        }else{
            singleNum--; //单个产品单数减一
            num--; //单个产品总数减一
            count_num--;
        }
        /* if (singleNum < reduce_num || num < reduce_num) {
            alert("该产品的最小订量为"+reduce_num);
            return;
        } */
        // count_num--; //购物车产品总数减一
        if (parseInt(singleNum) <= 0) {
            $(".Open_con .param_" + pid).remove(); //从购物车移除产品
            singleNum = 0;
        }
        if (num <= 0) { //列表页个数隐藏
            num = 0;
            $("#pid_" + pid).addClass('show_cur');
        }
        if (singleNum <= 0) { //购物车数据移除
            $(".p_" + pro_paramid).remove();
        }

        if (count_num <= 0) {
            $("#no_choose_pro").css('display', 'block'); //显示未选购商品
            $(".Open_con").html('<div style="padding:1px 0;text-align:center;color:#888;font-size:14px;">还未购买商品！</div>');
            count_num = 0;
            $("#go_shopping").addClass('cur_choose'); //去结算置灰
            bgHide();
        }
        var iCountPrice = parseFloat(count_price - parseFloat(price)).toFixed(2); //购物车总金额
    }
    if(document.cookie.indexOf('zz_userid') == -1){
        changeCookie(pid, sn, singleNum, paramid);
    }else{
        $.get("/Ajax/Product.php", { username: user_name, pid: pid, param_id: paramid, type:13 , num: singleNum},
        function(data){

        });
    }
    $(".p_" + pro_paramid).find(".pro_num").html(singleNum); //购物车数据显示
    $("#pid_" + pid).find(".pro_num").html(num); //列表数据显示
    $("#count_price").html(iCountPrice);
    $("#count_shop_num").html(count_num);
}

//验证是否添加过该产品
function checkCookie(pid, param_id) {
    var gouwuche = readCookie(user_name + '_gouwuche');
    var isCookie = 0;
    if (gouwuche) {
        var aOrder = JSON.parse(gouwuche);
        for (key in aOrder) {
            if (key == (pid + '_' + param_id)) {
                isCookie = 1;
            }
        }
    }
    return isCookie;
}

//获取购物车内最大排序值
function maxOrder() {
    var order_arr = [];
    var maxOrder = 0;
    $(".Open_con input[name='tmp_t[]']").each(function() {
        order_arr.push($(this).val());
    });
    if (order_arr.length > 0) {
        maxOrder = Math.max.apply(Math, order_arr);
    }
    return maxOrder;
}

//组装产品名称
function combineName(name, type, param_name) {
    if (type == 2) {
        // name = '【批发】' + name;
    }
    if (!isNaN(param_name*1) && param_name*1) {
        name = name + '(' + param_name + ')';
    }
    return name;
}
/**
 * 产品行和产品购物车内产品添加和减少
 */
$(function() {
    var tn = 1;
    $("#table_frame_R, #shop_car_line").on("click", ".jia, .jian", function(event) {
        window.click_obj = $(this);
        var that = $(this);
        var tip_sn = that.attr('data-sn');
        //手机选号
        var pro_feature = parseInt(that.closest(".shop_num").attr('data-feature'));
        var tmp_pid = that.closest(".shop_num").attr('data-id');
        if (pro_feature) {
            window.location.href = "/"+user_name+"/wap_pro/"+tmp_pid+".html";
            return;
        }

        if (that.parent().hasClass('disable_buy')) {
            alert("该产品暂不能购买，请选择其他产品！");
            return false;
        }
        click_obj = that;
        //验证是否有规格
        if (!that.parent().hasClass('is_specifications')) {
            var pro_type = that.parents('.shop_num').attr('data-type');
            if (that.attr('data-action') != 'reduce') {
                $.ajax({
                    type: "POST",
                    url: "/Ajax/Product.php?type=2",
                    data: {
                        username: user_name,
                        pid: tmp_pid,
                        ch_id: ch_id,
                        sn_type: pro_type
                    },
                    cache: false,
                    dataType: "json",
                    success: function(data) {
                        if (data.html) {
                            $(".Specifications").html(data.html);
                            guige_param = data.param;
                            $(".commodity_detail").hide();
                            $(".bg_color2").show();
                            $(".Specifications").show();
                        } else {
                            carShopNew(that);
                        }
                    }
                });
            } else {
                carShopNew(that);
            }
        } else {
            carShopNew(that);
        }
    });

    //弹窗中选好了
    $(".Specifications").on("click", '.choose_ok', function() {
        is_window_action = 1;
        if ($(this).hasClass("no_pay")) {
            alert("该产品规格暂无价格，请选择其他产品进行购买！");
        } else {
            var sn = $(this).siblings("#sn").val();
            var param_id = $(this).siblings("#sn_id").val();
            var pid = $(this).siblings("#sn_pid").val();
            var sn_name = $(this).siblings("#sn_name").val();
            var sn_price = $(this).siblings("#sn_price").val();
            var tmp_stock = $(this).siblings('#sn_stock').val();
            var tmp_type = $(this).attr('data-ptype');
            var pro_count_num = parseInt($("#pro_count_num").val());
            var old_num = parseInt($("#pid_" + pid).find('.pro_num').html());
            if (parseFloat(sn_price) <= 0) {
                alert('该规格已删除或暂无价格，请选择其他规格!');
                return false;
            }
            var tmpcount = pro_count_num+old_num;
            //验证cookie
            $("#pid_" + pid).parents('.shop_num').attr('data-stock', tmp_stock);
            $("#pid_" + pid).parents('.shop_num').attr('data-sn', sn);
            $("#pid_" + pid).parents('.shop_num').attr('data-param', param_id);
            $("#pid_" + pid).parents('.shop_num').attr('data-snname', sn_name);
            $("#pid_" + pid).parents('.shop_num').attr('data-price', sn_price);
            $("#pid_" + pid).parents('.shop_num').attr('data-type', tmp_type);
            $("#pid_" + pid).parents('.shop_num').attr('data-count', tmpcount);
            $("#pid_" + pid).find('.pro_num').html(tmpcount);
            $("#pid_" + pid).addClass('is_specifications');
            $("#pid_" + pid + ' .jia').trigger('click');
            $("#pid_" + pid).removeClass('is_specifications');
        }
        bgHide();
    });

    //弹窗删除产品
    $(".Specifications").on("click", '#del_pro', function() {
        var prosmallnum = parseInt($("#minnum").val());
        var pro_count_num = parseInt($("#pro_count_num").val());
        pro_count_num--;
        if (pro_count_num < prosmallnum) {
            alert("该产品的最小订量为"+prosmallnum);
            return;
        }
        if (pro_count_num >= 1) {
            $("#pro_count_num").val(pro_count_num);
        }
    });
    //弹窗添加产品
    $(".Specifications").on("click", '#add_pro', function() {
        var stock_num = parseInt($("#sn_stock").val());
        var pro_count_num = parseInt($("#pro_count_num").val());
            pro_count_num++;
        if (pro_count_num <= stock_num) {
            $("#pro_count_num").val(pro_count_num);
        } else {
            alert('库存不足');
            return false;
        }
    });

    $(".commodity_mony .add_shopcar").on("click", function() {
        var pid = $(this).siblings(".sn_pid").val();
        // $("#pid_" + pid).addClass('is_specifications');
        $("#pid_" + pid + " .jia").trigger('click');
        $("#pid_" + pid).removeClass('is_specifications');
        bgHide();
    });

    $("#go_shopping").on('click', function() {
        if ($(this).hasClass('cur_choose')) {
            alert('差一点就可以起送了');
            return false;
        }
        var checkLogin = readCookie('zz_userid');
        /* var gouwuche = readCookie(user_name + '_gouwuche');
        var cokie = JSON.parse(gouwuche);
        var cokieStr = JSON.stringify(cokie); */
        if (!checkLogin) {
            //跳转到登录页面
            alert('请先登录！');
            window.location.href = "/dom/denglu.php?username=" + user_name + "&regi=0&wap=1";
        } else {
             alert_layer();
            //清除立即购买生成的cookie
            writeCookie('is_liji', '', -1);
            writeCookie('liji_sn', '', -1);
            writeCookie('liji_pro_num', '', -1);  
            window.location.href = "/VFrontend/order/submitOrder/index?username=" + user_name;
            // $("#order_form").submit();
            /* $.ajax({
                type: "POST",
                url: "/Ajax/Product.php?type=8",
                dataType: "json",
                data: "cokie=" + cokieStr + "&username=" + user_name,
                success: function(data) {
                    if (data == 1) {
                        del_layer();
                        $("#order_form").submit();
                    }
                }
            }); */
        }
    });

    /*清空购物车*/
    $("#remove").on("click", function() {
        tn = 0;
        var std = UTCTimeDemo();
        alert_layer();
        if (confirm('您确定要清空购物车吗？')) {
            // var gouwuche = readCookie(user_name + '_gouwuche');
            if ($('#shop_car_line .Open_con .Open_list').length) {
                // var aOrder = JSON.parse(gouwuche);
                // var ordStr = '';
                // for (key in aOrder) {
                //     ordStr += key + ',';
                // }
                // ordStr = ordStr.substring(ordStr.length, -1);
                var f_v = function() {
                    writeCookie(user_name + '_gouwuche', '');
                    $(".Open_con").html('<div style="padding:1px 0;text-align:center;color:#888;font-size:14px;">还未购买商品！</div>');
                    $("#count_price").html(0);
                    $("#count_shop_num").html(0);
                    $("#no_choose_pro").css('display', 'block');
                    $("#go_shopping").addClass('cur_choose');
                    $("#table_frame_R .commodity_R").attr('data-count', 0);
                    $("#table_frame_R .pro_num").html('');
                    $("#table_frame_R .add_int").each(function() {
                        $(this).addClass('show_cur');
                    });
                    bgHide();
                    del_layer();
                }
                var checkLogin = readCookie('zz_userid');
                if (checkLogin) {
                    $.post('/Ajax/Product.php', {
                            type: 6,
                            username: user_name
                        },
                        function(data) {
                            f_v();
                        }, 'json');
                } else {
                    f_v();
                }
            }else{
                del_layer();
            }
        } else {
            del_layer();
        }
    });
    var win_H = ($(window).height()) - 40;
    if($('.bottom_foot').length){
        $(".frame_L").css("height", win_H - 100 + 'px');
        $(".frame_R").css("height", win_H - 60 + 'px');
    }else{
        $(".frame_L").css("height", win_H - 40 + 'px');
        $(".frame_R").css("height", win_H + 'px');
    }
    //分页
    $(".frame_R").scroll(function() {
        var $this = $(this);
        var scrollTop = $this.scrollTop(),
            scrollHeight = $this[0].scrollHeight,
            windowHeight = $this[0].clientHeight;
        if ((scrollTop + windowHeight) >= (scrollHeight-30) && !$("#listMore").is(":hidden")) {
            $("#listMore").find(".morebtn").trigger('click');
        }
    });
});

function changeCookie(id, sn, pro_num, param_id) {
    var gouwuche = readCookie(user_name + '_gouwuche');
    var isUpdate = 0;
    if (gouwuche) {
        var aOrder = JSON.parse(gouwuche);
        var i = 0;
        for (key in aOrder) {
            if (key == (id + '_' + param_id)) {
                if (pro_num <= 0) {
                    delete aOrder[key];
                } else {
                    aOrder[key] = {
                        'num': pro_num,
                        //'sn': aOrder[key].sn,
                        'sort': aOrder[key].sort
                    };
                    i = i + 1;
                }
                var tmp_str = JSON.stringify(aOrder);
                writeCookie(user_name + '_gouwuche', tmp_str, 3600 * 7);
                isUpdate = 1;
            } else {
                i = i + 1;
                continue;
            }
        }
        if (!isUpdate) {
            if(i>100){
                alert('购物车已满!');
                return false;
            }
            aOrder[id + '_' + param_id] = {
                'num': pro_num,
                //'sn': sn,
                'sort': i
            };
            var tmp_str = JSON.stringify(aOrder);
            writeCookie(user_name + '_gouwuche', tmp_str, 3600 * 7);
        }
    } else {
        var arrayObj = {};
        if (pro_num > 0) {
            arrayObj[id + "_" + param_id] = {
                'num': pro_num,
                //'sn': sn,
                'sort': 1
            };
            var tmp_str = JSON.stringify(arrayObj);
            writeCookie(user_name + '_gouwuche', tmp_str, 3600 * 7);
        }
    }
}

function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}

/*获取产品购买金额*/
function countProductMoney(num, sn, paramid) {
    var _this = $(this);
    var iPid = _this.parents(".shop_num").attr("data-id");
    if (!iPid) {
        return false;
    }
    changeCookie(iPid, sn, num, paramid);

    /*
     * obj        单个产品价格条
     * price      单个产品价格
     * zk             按钮组合(折扣)
     * awardObj       赠品
     * full_cut_id 满减
     */
    var obj = $(this).parents(".ab_bose");
    var price = parseFloat($("#return_price_" + iPid).val());
    var zk = _this.parents(".shop_num").attr("data-zk");

    // var awardObj = _this.parents(".ev_t_product_yy_text").siblings(".new_wap_Gift");
    // var full_cut_id = awardObj.find('.full_cut').attr('data-id');

    /*
     * 1.有折扣折扣价,没折扣原价
     * 2.通过实际购买量获取产品总价格
     * 3.iCountPrice : 小计
     */
    if (zk > 0) {
        zk = nCount.div(zk, 10);
        price = nCount.mul(price, zk);
    }
    var iCountPrice = parseFloat(price * num).toFixed(2);
    if (/(\.00)$/.test(iCountPrice)) iCountPrice = parseInt(iCountPrice);

    $(".num_" + iPid).html(num);
    $(".all_" + iPid).val(iCountPrice);

    /*
     * 购物车数据更新
     */
    $("#shop_pro_" + iPid).find(".car_list_num").text(num);
    $("#shop_pro_" + iPid).find(".allPrice").val(iCountPrice);
    $("#shop_pro_" + iPid).find(".allNum").val(num);

    obj.find(".allPrice").val(iCountPrice);
    obj.find(".add_int").removeClass("show_cur");
    //计算所有产品总价
    countAllProductMoney();
}

function countAllProductMoney() {
    var iCountMoney = 0,
        iProCount = 0;
    var full_cut_arr = [];
    var tmp_arr = [];
    var proCon = [];

    var gouwuche = readCookie(user_name + '_gouwuche');
    if (gouwuche) {
        var cokie = JSON.parse(gouwuche);
        var cokieStr = JSON.stringify(cokie);

        $.ajax({
            type: "POST",
            url: "/Ajax/Product.php?type=7",
            data: {
                username: user_name,
                ch_id: ch_id,
                cokie: cokieStr
            },
            cache: false,
            dataType: "json",
            success: function(data) {
                add_car_animat();
                setTimeout(
                    "show_price(" + data.count_price + ", " + data.num + ")",
                    1000);
                // $("#count_price").html(data.count_price);      //总额
                // $('#count_shop_num').html(parseInt(data.num)); //结算
                del_layer();
            }
        });
    }

    if (iProCount > 0) {
        $("#send_price").parent(".Settlement_R").removeClass('cur_choose');
    }
    //满减
    // countFullCutMoney(full_cut_arr,tmpCountMoney);
}

function show_price(count_price, num) {
    $("#count_price").html(count_price); //总额
    $('#count_shop_num').html(parseInt(num)); //结算
}

//促销活动后价格显示
/*
 * 1.有满减，扣除满减金额放入合计中
 * 2.没有满减，将总金额放入合计当中
 */
function countFullCutMoney(full_cut_arr, iCountMoney) {
    if (full_cut_arr) {
        var full_cut_str = full_cut_arr.join('_');
        $.post(
            '/self_define/ajax_set_info.php', {
                type: 40,
                user_name: user_name,
                full_cut_str: full_cut_str
            },
            function(data) {
                var cut_money = parseFloat(data);
                if (cut_money > 0) {
                    $("#is_full_cut").show();
                    $('.shopcar_count').css('margin', '6px 10px');
                    $("#count_price").html(nCount.sub(iCountMoney, cut_money));
                    $("#cut_money").html(cut_money);
                } else {
                    $("#is_full_cut").hide();
                    $('.shopcar_count').css('margin', '17px 10px');
                    $("#count_price").html(iCountMoney);
                }
            }
        );
    } else {
        // $("#is_full_cut").hide();
        // $('.shopcar_count').css('margin','17px 10px');

        $("#count_price").html(iCountMoney);
    }
}

/*
 * 未登录不能提交购物车
 */
$("#order_submit").on("click", function() {
    var memberUserId = readCookie('zz_userid');
    if (!memberUserId) {
        var shopCarLogin = $("#shopCarLogin"),
            alt_content = shopCarLogin.find('.alt_content'),
            documentH = $(document).outerHeight(),
            documentST = $(document).scrollTop(),
            atop = documentST + ($(window).height() - 363) / 2;
        shopCarLogin.css({
            'height': documentH,
            'display': 'block'
        });
        alt_content.css({
            'top': atop + 'px',
            'margin-top': 0
        });
        return false;
    } else {
        $(".select_color_margin em").each(function() {
            if (!$(this).hasClass("cur")) {
                $(this).parents('li').remove();
            }
        });
    }
    $("#order_form").submit();
});
