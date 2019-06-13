window.addEventListener('apiready',function(){
  openLoader();
  var params=api.pageParam,
  data = {
    values: {
        agreement_id: params.agreement_id,
        type:params.type
    }
};
console.log(JSON.stringify(params));
  ajax('index/Mobile/previewAgreement',data,'get',function(ret,err){
    if(ret){
      closeLoader();
      var tpl_aggrement_list = doT.template($("#tpl-agreement-template").html());
      $("#agreement-template").html(tpl_aggrement_list(ret));
    }
    console.log(JSON.stringify(ret))
    console.log(JSON.stringify(err))

  })
})
