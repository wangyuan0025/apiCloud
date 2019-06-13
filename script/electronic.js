window.addEventListener('apiready', function() {
    var id = api.pageParam.id;
    $('body').on('change', '.house-type', function() {
        getBuildingNumber(id);
        getElectronic();
    })
    $('body').on('change', '.house-type', function() {
        getBuildingNumber(id);
        getElectronic();
    })
    $('body').on('change', '.house-use', function() {
        getBuildingNumber(id);
        getElectronic();
    })
    $('body').on('change', '.building-number', function() {
        getUnit(id);
        getElectronic();
    })
    $('body').on('change', '.unit', function() {
        getElectronic();
    })
    $('body').on('change', '.house-type,.house-use,.unit,.building-number', function() {
        var house_type = $('.house-type').val(),
            house_use = $('.house-use').val(),
            building_number = $('.building-number').val(),
            unit = $('.unit').val();
        if (house_type && house_use) {
            var data = {
                values: {
                    building_id: id,
                    house_type: house_type,
                    house_use: house_use
                }
            }
        }
        // getElectronic()
    })

})

function getBuildingNumber(id) {
    var house_type = $('.house-type').val(),
        house_use = $('.house-use').val(),
        data = {
            values: {
                building_id:id,
                house_type: house_type,
                house_use: house_use
            }
        };
    ajax('index/Mobile/getBuildingNumber', data, 'get', function(ret, err) {
        if (ret) {
            console.log(JSON.stringify(ret))
            var html = '<option value="0">请选择楼栋</option>';
            for (var i = 0; i < ret.length; i++) {
                html += `<option value="${ret[i]}">${ret[i]}</option>`
            };
            $('.building-number').html(html);
        }
    })
}

function getUnit(id) {
    var house_type = $('.house-type').val(),
        house_use = $('.house-use').val(),
        building_number = $('.building-number').val(),
        data = {
            values: {
                building_id:id,
                house_type: house_type,
                house_use: house_use,
                building_number: building_number,
            }
        };

    ajax('index/Mobile/getUnit', data, 'get', function(ret, err) {
        if (ret) {
          if (ret) {
              console.log(JSON.stringify(ret))
              var html = '<option value="0">请选择单元</option>';
              for (var i = 0; i < ret.length; i++) {
                  html += `<option value="${ret[i]}">${ret[i]}</option>`
              };
              $('.unit').html(html);
          }
        }


    })
}

function getElectronic() {
    var house_type = $('.house-type').val(),
        house_use = $('.house-use').val(),
        building_number = $('.building-number').val(),
        unit = $('.unit').val(),
        data = {
            values: {
                house_type: house_type,
                house_use: house_use,
                // building_number:building_number,
                // unit:unit
            }
        }
        openLoader();
    ajax('index/Mobile/getelectronicdata', data, 'get', function(ret, err) {
        if (ret) {
            closeLoader();
            if(ret instanceof Array){
              showToast('没有相关房源');
              $('.electronic-house-content').html('');
            }else{
              var tpl_electronic=doT.template($('#tpl-electronic').html());
              $('.electronic-house-content').html(tpl_electronic(ret));
            }

            console.log(JSON.stringify(ret))
        }


    })
}
