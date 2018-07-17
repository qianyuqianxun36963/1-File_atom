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
                }, {    
                "title" : "录成绩",  
                "defaultContent" : "",  
                "class" : "text-center",
                "width": "25%",
                "createdCell":function(nTd, sData, oData, iRow, iCol) {
                    debugger;
                    var schoolRollId  = oData.schoolRollId;
                    var violateAction = oData.violateAction;
                    var violateActionName = oData.violateActionName;
                    if (violateAction == '' || violateAction == null) {
                        content = '<input type="text" id="score" onblur="noteScore(\''+schoolRollId+'\',this.value)" />';
                        stuCounts ++;
                    }else{
                        content = violateActionName;
                    }
                    $(nTd).html(content);
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

页面初始化相关

    $$(document).ready(function(){    
        initbbbTable();
        /**
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

        /**
        * 点击弹出模态窗，然后初始化模态框中的table。这里是通过给按钮加绑定事件完成的，也可以给按钮加绑定js函数。
        */
        $('#invoiceModal_func_add').on('shown.bs.modal', function(e) {
            if (!orderListTable) {
                initOrderListTable();
            } else {
                orderListTable.draw();
            }
        });

    });

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

模态窗相关

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

    // 弹出一录模态框
    function popUpFirstRecord() {
        $("#stuModalTittle").text("录入成绩(一录)");
        $("#enterFlag").text("一录成绩");
        $("#btnTwo").show();
        $(".inputList").initInput();
        debugger;
        //课程ID和课程编号，隐藏，用于查询等其他可能操作。
        $("#courseId_value").val(isNullThen($("#courseId_span").html()));
        
        //课程代码
        $("#courseCode_text").text(isNullThen($("#courseCode_span").html()));
        //课程名称
        $("#courseName_text").text(isNullThen($("#courseName_span").html()));
        //考试时间
        $("#examTime_text").text(isNullThen($("#examTime_span").html()));
        //应考人数
        $("#shouldExamPerson_text").text(isNullThen($("#shouldExamPerson_span").html()));
        //实考人数
        $("#actualExamPerson_text").text(isNullThen($("#actualExamPerson_span").html()));
        
        $("#firstRecordModal").modal('show');
        
        if (!order2InvoiceListTable) {
            initorder2InvoiceListTable();
        } else {
            order2InvoiceListTable.draw();
        }
    }


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

生成编辑记录：

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

导出数据的方法：

// 按钮点击事件。
/**
 * 功能描述：将当前查询的所有缴费记录导出到发票
 */
function generateInvoice_all() {
    var params = {};
    params.paymentStatus = $("#paymentStatus_ordersearch").val();
    params.hasGenInvoice = $("#hasGenInvoice_ordersearch").val();
    params.pointId = $("#pointId_ordersearch").val();
    params.learningBatch = $("#learningBatch_ordersearch").val();
    params.stuName = $("#stuName_ordersearch").val();
    params.schoolrollNo = $("#schoolrollNo_ordersearch").val();
    params.orderStarttime = $("#orderStarttime_ordersearch").val();
    params.orderEndtime = $("#orderEndtime_ordersearch").val();
    showConfirmModal("是否确认导出发票！", function() {
        
        var datas = JSON.stringify({
            "flag" : "all",
            "params" : params
        });
        $("#datas_export").val(datas);
        
        var url = encodeURI("manage/invoice/addInvoices.do?"
                + $("#addInvoiceExcelForm").serialize() + "&ACCESSTOKEN="
                + accessTokenId);
        $("#exportInvoiceExcelForm").attr('action', url);
        $("#exportInvoiceExcelForm").attr('target', '');
        $("#exportInvoiceExcelForm").submit();
        swal.close();
        if (swal.close()) {
            setTimeout(function() {
                debugger;
                order2InvoiceListTable.draw();
                invoiceTable.draw();
            }, 8000);
        }
        
//      $.ajax({
//          url : "manage/invoice/addInvoices.do",
//          dataType : "json",
//          type : "post",
//          traditional : true, // 数组格式转换 加上这个就可以了
//          data : {
//              "datas" : JSON.stringify({
//                  "flag" : "all",
//                  "params" : {
//                      "params" : params
//                  }
//              })
//          }, // 参数对象
//          success : function(data) {
//              if (data.status == "success") {
//                  showSuccessOrErrorModal(data.msg, "success");
//                  order2InvoiceListTable.draw(false);
//              } else if (data.status == "fail") {
//                  showSuccessOrErrorModal(data.msg, "error");
//              } else {
//                  showSuccessOrErrorModal(data.msg, "error");
//              }
//          },
//          error : function(data) {
//              showSuccessOrErrorModal(data.msg, "error");
//          }
//      });
    });
}


// 按钮点击事件，checkbox 多条选中记录。
/**
 * 功能描述：将选中的缴费记录导出到发票
 */
function generateInvoice_part() {
    var params = {};
    params.paymentStatus = $("#paymentStatus_ordersearch").val();
    params.hasGenInvoice = $("#hasGenInvoice_ordersearch").val();
    params.pointId = $("#pointId_ordersearch").val();
    params.learningBatch = $("#learningBatch_ordersearch").val();
    params.stuName = $("#stuName_ordersearch").val();
    params.schoolrollNo = $("#schoolrollNo_ordersearch").val();
    params.orderStarttime = $("#orderStarttime_ordersearch").val();
    params.orderEndtime = $("#orderEndtime_ordersearch").val();
    
    var rowdatas = [];
    $(".payCheckbox:checked").each(
        function() {
            debugger;
            var datas = order2InvoiceListTable.row(
                    this.parentNode.parentNode.parentNode).data();
            var rowdata = {};
            rowdata.studyCode = datas.studyCode;
            rowdata.amount = datas.amount;

            rowdata.pointId = datas.pointId;
            rowdata.schoolrollId = datas.schoolrollId;
            rowdatas.push(rowdata);
    });
    if (rowdatas.length < 1) {
        showInfoModal("请选择要生成发票的缴费记录！");
        return;
    } else {
        showConfirmModal("是否确认导出发票！", function() {
            debugger;
            var datas = JSON.stringify({
                "flag" : "part",
                "rowdatas" : rowdatas,
                "params" : params
            });
            $("#datas_export").val(datas);
            
            var url = encodeURI("manage/invoice/addInvoices.do?"
                    + $("#addInvoiceExcelForm").serialize() + "&ACCESSTOKEN="
                    + accessTokenId);
            $("#exportInvoiceExcelForm").attr('action', url);
            $("#exportInvoiceExcelForm").attr('target', '');
            $("#exportInvoiceExcelForm").submit();
            swal.close();
            if (swal.close()) {
                setTimeout(function() {
                    debugger;
                    order2InvoiceListTable.draw();
                    invoiceTable.draw();
                }, 8000);
            }
            
//          $.ajax({
//              url : "manage/invoice/addInvoices.do",
//              dataType : "json",
//              type : "post",
//              traditional : true, // 数组格式转换 加上这个就可以了
//              data : {
//                  "datas" : JSON.stringify({
//                      "flag" : "part",
//                      "rowdatas" : rowdatas,
//                      "params" : params
//                  })
//              }, // 参数对象
//              success : function(data) {
//                  if (data.status == "success") {
//                      showSuccessOrErrorModal(data.msg, "success");
//                      order2InvoiceListTable.draw(false);
//                  } else if (data.status == "fail") {
//                      showSuccessOrErrorModal(data.msg, "error");
//                  } else {
//                      showSuccessOrErrorModal(data.msg, "error");
//                  }
//              },
//              error : function(data) {
//                  showSuccessOrErrorModal(data.msg, "error");
//              }
//          });
        });
    }
}

//批量录入成绩,看下表格渲染

var stuCounts = 0;
var scores = new Map();

function noteScore(schoolRollId,score){
    scores.set(schoolRollId,score);
}

function submitForSecondInput(){
    var params = {};
    params.examBatch = $("#examBatch_value").val();
    params.courseId = $("#courseId_value").val();
    params.courseVersionId = $("#courseVersionId_value").val();
    
    var datas = JSON.stringify({
        "flag" : "0", //提交并需要二录。
        "params" : params,
        "scores" : scores
    });
    
    
}

// 公共方法，重置模态框查询条件
function startPageLoading() {
    $("#stuName_ordersearch").val("");
    $("#schoolrollNo_ordersearch").val("");
    $("#learningBatch_ordersearch").val("").selectpicker("refresh");
    $("#pointId_ordersearch").val("").selectpicker("refresh");
    $("#orderStarttime_ordersearch").val("");
    $("#orderEndtime_ordersearch").val("");
}

/**
<div class="" >
<!-- 上传 -->
<div class="col-sm-12 content-edu" id="fRegEvidenceCnt" >
    <div class="col-sm-2" style="text-align: right;">已上传的证明材料:
    </div>
    <br>
    <ul class="contentbox-edu" id="fRegEvidence" style="overflow:hidden">
    </ul>
</div>
<br>
<div class="portlet light bordered" style="padding: 12px 20px 15px 20px;">
     <div class="portlet-body" id="">
         <div class="row">
            <div class="col-md-6 modal-box">
                <div style="text-align: left;flex:4;">上传证明材料：</div>
                <div style="text-align: left;flex:8;">
                    <div class="input-group">
                        <span class="input-group-btn">
                        <a href="javascript:;" class="btn blue btn-xxs " id="" onclick="$('#uploadEvidence').click()">
                        <i class="fa fa-file"></i> 选择</a>
                        </span>
                    </div>
                    <input style="display:none" type="file" name="" id="uploadEvidence" accept="image/png,image/jpeg,application/pdf">
                </div>
            </div>
            <div class="col-md-4">
                <div class="progress"  id="fileEvidenceprogress" style="display:none;">
                    <div id="fileEvidenceprogressOne" class="progress-bar" role="progressbar progress-bar-success" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">
                            <div id="fileEvidenceprogressTwo">0%</div>
                    </div>
                </div></div>
         </div>
     </div>
 </div> <!-- 上传结束 --> 
</div>
**/


//上传证明材料-前端界面变化与文件上传
$('#uploadEvidence').on('change', function(e) {
    var filemaxsize = 1024 * 5; //5M
    var target = $(e.target);
    var Size = target[0].files[0].size / 1024;
    if(Size > filemaxsize) {
        alert('图片过大，请重新选择!');
        return false;
    }
    var fileName = $("#uploadEvidence").val().match(/[^\\]+\.[^\(]+/i);
//      $("#uploadEvidenceFileName").val(fileName);
    var fileInfos = getFileInfos("uploadEvidence","3","file");
    var resourcepath = fileInfos[0].resourcePath;
    uploadFiles("uploadEvidence","fileEvidenceprogress","fileEvidenceprogressOne","fileEvidenceprogressTwo",fileInfos)
    if(!this.files[0].type.match(/image.*/)) {
         addEvidenceDom("static/images/common/file-avatar.png","fTeacherEvidence",fileName,resourcepath,Size)
    } else {
        var reader = new FileReader();
        reader.readAsDataURL(this.files[0]);
        reader.onload = function(e){
            addEvidenceDom(this.result,"fTeacherEvidence",fileName,resourcepath,Size);
        }
    }
    //$(target).val("");
});

//上传证明材料-保存数据到数据库。
var uploadFiles=[];
$("#fTeacherEvidence li").each(function(){
	//获取每个li的文件的文件名路径和
	var resourcepath=$(this).attr("resourcepath");
	var fileSize=$(this).attr("fileSize");
	var realFileName=$(this).children(".txt-edu").children(".pic-title").attr("title").split(".");
	var fileName=realFileName[0];
	var fileType=realFileName[1];
	var files = {
			resourcepath : resourcepath,
			fileSize : fileSize,
			fileName : fileName,
			fileType : fileType
	}
	uploadFiles.push(files)
});