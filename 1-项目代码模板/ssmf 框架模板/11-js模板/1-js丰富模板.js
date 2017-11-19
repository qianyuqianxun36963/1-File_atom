    /*
     * mySecondArea //二级文件 如：registerVerify
     * AAA          //模块类名大写
     * bbb          //模块类名小写
     * #模块#       //模块中文名
    */

    //初始化表格
    var bbbTable = null;

    function initbbbTable() {
        bbbTable = $$('#bbbTable').DataTable({  
            
            "bSort" : false, //是否启动各个字段的排序功能  

            "sAjaxSource" : "manage/mySecondArea/queryAAAList.do",  

            "fnDrawCallback":function(){
                //添加序号column(1) ‘1’代表序号的下表
                this.api().column(1).nodes().each(function(cell, i){cell.innerHTML =  i+1;});
            },

            // 列属性空值处理
            "columnDefs" : [ 
                {
                    targets: [0,1,2,3,4,5,6,7],
                    render: function(data, type, row, meta) {// 在这里 时间格式化、内容太多优化显示、一列显示多列值 等问题进行优化
                        if(data!=null){
                            var html = '<div class="" data-toggle="tooltip"  title="'+data+'">'+data+'</div>';
                        }else{
                            var html = '--';
                        }
                        
                        return html;
                    }
             }],

            "aoColumns": [
                {  
                    "data" : "bbbId",  
                    "defaultContent" : "", //此列默认值为""，以防数据中没有此值，DataTables加载数据的时候报错  
                    "visible" : false //此列不显示  
                }, {  
                    "data" : "courseSequenceNumber",  
                    "title" : "序号",  
                    "defaultContent" : "", 
                    "width": "10%",
                    "class" : "text-center"  
                }, {  
                    "data" : "bbbCode",  
                    "title" : "#模块#代码",  
                    "defaultContent" : "", 
                    "width": "15%",
                    "class" : "text-center"  
                }, {  
                    "data" : "bbbName",  
                    "title" : "#模块#名称",  
                    "defaultContent" : "",   
                    "width": "15%",
                    "class" : "text-center"  
                }, {  
                    "data" : "status",  
                    "title" : "#模块#状态",  
                    "defaultContent" : "",  
                    "width": "15%",
                    "sClass" : "text-center",
                    "fnCreatedCell":function(nTd, sData, oData, iRow, iCol) {
                        var status = oData.status;
                        var content = "" ;
                        if ("0" == status) {
                            content = "启用";
                        } else {
                            content = "停用";
                        }
                        $$(nTd).html(content);
                    }
                }, {  
                    //长度过长的列，渲染处理，使用tooltip悬停显示。
                    "data" : "detailAddress",  
                    "title" : "地址",  
                    "defaultContent" : "",  
                    "width": "40%",
                    "class" : "text-center"  
                    "render": function(data, type, row, meta) {
                        if(data){
                             data = data.substring(0, data.length - 1);
                                 var showdata=data;
                                 if(data.length>6){
                                     showdata=data.substring(0,6)+".."; 
                                 }
                               return '<div class="" data-toggle="tooltip"  title="'+data+'">'+showdata+'</div>';
                        }else{
                             return '--';
                        }
                    } 
                }, {    
                    "title" : "操作",  
                    "defaultContent" : "",  
                    "class" : "text-center",
                    "width": "15%",
                    "createdCell":function(nTd, sData, oData, iRow, iCol) {
                        var bbbId = oData.bbbId;
                        var content = '<button class="btn btn-xs blue" onclick="showAAAEditModal(\''+bbbId+'\')"> 编辑 </button>';
                        if (oData.isUse == '0') {
                            content += '<button class="btn btn-xs blue" onclick="deleteAAA(\''+bbbId+'\')"> 删除 </button>';
                        }
                        $$(nTd).html(content);
                    }
                }
            ],
                            
            // 服务器端，数据回调处理  
            "fnServerData": function retrieveData(sSource, aoData, fnCallback) 
            {
                aoData.push({"name":"id","value":$$("#bbbId_search").val()});
                aoData.push({"name":"status","value":$$("#status_search").val()});

                $$.ajax({
                    type: "POST",
                    url: sSource,
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(aoData),
                    success: function(data) 
                    {
                        if(data.status == "success")
                        {
                            fnCallback(data.bbbData);
                        }
                    }
                });
            }
        });  
    }

    /**
     * 初始化下拉框
     */
    function initDropDown() {
        //获取学历下拉框数据
        $("#education_search").append(getDropDownData("manage/dictionary/queryDictionaryByType.do?type=EDUCATION_BACKGROUND"););

        //获取学科下拉框数据
        var subjectHtml = getDropDownData("manage/dictionary/queryDictionaryByType.do?type=SUBJECT_TYPE");
        assembleDropDown("subject", subjectHtml);
    }

    /**
     * 功能描述：装载下拉框,这里处理的是多个下拉框的装载问题，
     * id^='ds'表示查找id以ds开头的所有元素，例如id="dsdd" id="dshhhh" 都是符合的元素
     */
    function assembleDropDown(idhead, html) {
        var subjectSelects = $("select[id^="+idhead+"]");
        selects.each(function() {
            $(this).append(html);
        });
    }

    /**
     * 全选
     */
    function siteChooseOrNoChoose(obj) {
        if($$(obj).is(":checked")) {
            $$(".checkbox").prop("checked", true);
        } else {
            $$(".checkbox").prop("checked", false);
        }
    }

    /**
     * 编辑模态框
     */
    function showAAAEditModal(bbbId) {
        $$.ajax({
            url:"manage/mySecondArea/queryAAAInfo.do",
            type:"post",
            data:{"bbbId":bbbId},
            dataType:"json",
            success:function(data) {
                if(data.status=="success") {
                    var bbbMap = data.bbbMap;
                    $$("#bbbId_edit").val(bbbMap.bbbId);
                    $$("#bbbCode_edit").val(bbbMap.bbbCode);
                    $$("#bbbName_edit").val(bbbMap.bbbName);
                    $$("#detailAddress_edit").val(bbbMap.detailAddress);
                    if(bbbMap.status == '1') {
                        $$("#status_1").attr("checked",'checked'); 
                    } else {
                        $$("#status_0").attr("checked",'checked'); 
                    }
                    $$("#bbbModal_edit").modal("show");
                } else {
                    showSuccessOrErrorModal("获取#模块#信息失败","error");
                }
            },
            error:function(e) {
                showSuccessOrErrorModal("请求出错了","error"); 
            }
        });
    }





    $$(document).ready(function()
            {    
        initbbbTable();
        /**
         * 
         * 功能描述：表单验证    
         */
        var bbbForm = $$("form[id^='bbbForm']");
        bbbForm.each(function() {
            $$(this).validate({
                rules: {
                    bbbCode: "required",
                    bbbName: "required",
                    status: "required"
                },
                submitHandler : function(form) {
                    var formId = form.id;
                    var flag = formId.substr(formId.indexOf("_") + 1);
                    saveAAA(flag);
                }
            });
        });    
    });

点击按钮触发方法：

    /**
     * 功能描述：查询按钮
     */
    function queryAAA()
    {    
        bbbTable.draw(); //刷新表格
    };


    /**
     * 删除#模块#信息
     * @param form
     * @returns
     */
    function deleteAAA(bbbId) {
        showConfirmModal("是否确定删除！",function(){
            $$.ajax({
                url:"manage/mySecondArea/deleteAAA.do",
                type:"post",
                data:{"bbbId":bbbId},
                dataType:"json",
                success:function(data) {
                    if(data.status=="success") {
                        showSuccessOrErrorModal(data.msg,"success"); 
                        bbbTable.fnDraw(); //刷新表格
                    } else {
                        showSuccessOrErrorModal(data.msg,"error");    
                    }         
                },
                error:function(e) {
                    showSuccessOrErrorModal("请求出错了","error"); 
                }
            });
        });
    }


    /**
     * 保存#模块#信息
     * @param form
     * @returns
     */
    function saveAAA(flag) {
        if(!$$.trim($$("#bbbCode_" + flag).val())) {
            showInfoModal("请输入#模块#代码");
        } else if(!$$.trim($$("#bbbName_" + flag).val())) {
            showInfoModal("请输入#模块#名称");
        } else if ($$("#bbbForm_" + flag).find('input:radio[name="status"]:checked').val() == null) {
            showInfoModal("请选择#模块#状态");
        }
        $$.ajax({
            url:"manage/mySecondArea/saveAAA.do",
            type:"post",
            data:$$("#bbbForm_" + flag).serialize(),
            dataType:"json",
            success:function(data) {
                if(data.status=="success") {
                    showSuccessOrErrorModal(data.msg,"success");
                    bbbTable.fnDraw(); //刷新表格
                    $$("#bbbForm_" + flag)[0].reset();
                    $$("#bbbModal_" + flag).modal("hide");
                } else {
                    showSuccessOrErrorModal(data.msg,"error");    
                }         
            },
            error:function(e) {
                showSuccessOrErrorModal("请求出错了","error"); 
            }
        });
    }

    var oldCourseMap = {};

    /**
     * 创建编辑记录
     */
    function createEditRecord() {
        var editRecord = "";
        editRecord += judgeFieldIsChange("#模块#代码",oldCourseMap.courseCode,$$("#bbbCode_edit").val());
        editRecord += judgeFieldIsChange("#模块#名称",oldCourseMap.courseName,$$("#bbbName_edit").val());
        ;
        var educations =  $$("#courseForm_edit").find("input[name='education']:checked");
        var educationName = "";
        educations.each(function() {
            educationName += $$(this).next().text() + ",";
        });
        educationName = educationName.substr(0,educationName.length - 1);
        editRecord += judgeFieldIsChange("学历",oldCourseMap.eduNames,educationName);
        return editRecord;
    }

    /**
     * 判断字段是否修改并记录
     */
    function judgeFieldIsChange(fieldName,oldVal,newVal) {
        var editRecord = "";
        if (oldVal != newVal) {
            editRecord += fieldName;
            editRecord += "由“";
            editRecord += oldVal;
            editRecord += "”改成“";
            editRecord += newVal;
            editRecord += "”；";
        }
        return editRecord;
    }
