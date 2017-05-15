<script type="text/javascript" src="<?php echo Yii::app()->theme->baseUrl; ?>/assets/js/ajaxfileupload.js"></script>
<script type="text/javascript">
    var $productId = <?php echo $productId; ?>;
    function ajaxFileUpload(){
        $('#uploadbutton').attr('disabled','disable');
        $("#loading").show();
        $.ajaxFileUpload(
        {
            url:'<?php echo Yii::app()->createUrl('search/caseImport');?>',
            secureuri:false,
            fileElementId:'casefilename',
            dataType: 'json',
            data:{product_id:$productId},
            success: function (data, status)
            {
                $('#uploadbutton').removeAttr('disabled');
                $("#loading").hide();
                alert(data.msg);
                $('#import_case_dialog').dialog('close');
                window.location.href=window.location.href;
                window.location.reload;
            },
            error: function (data, status, e)
            {
                $('#uploadbutton').removeAttr('disabled');
                $("#loading").hide();
                alert('failed'+data.msg);
            }
        }
    );
    }
</script>

<?php
$this->beginWidget('zii.widgets.jui.CJuiDialog', array(
    'id' => 'import_case_dialog',
    'htmlOptions' => array('style' => 'display:none'),
    'options' => array(
        'title' => Yii::t('CaseInfo', 'Please choose imported xml file'),
        'autoOpen' => false,
        'width' => '400px',
        'modal' => true,
        'height' => 'auto',
        'resizable' => false
    )
));
?>
<form id="fileuploader" method="post" action="" enctype="multipart/form-data" style="text-align: center;">
    <input type="file" id="casefilename" name="casefilename" size="30"/>
    <br/><br/>
    <input type="button" id="uploadbutton" class="btn" value="提交" onclick="ajaxFileUpload()"/>
    <img id="loading" src="<?php echo Yii::app()->theme->baseUrl; ?>/assets/images/loading.gif" style="display:none;" />
</form>
<?php
$this->endWidget('zii.widgets.jui.CJuiDialog');
?>