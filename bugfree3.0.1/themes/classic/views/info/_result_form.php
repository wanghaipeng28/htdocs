<script type="text/javascript">
    window.onbeforeunload = confirmWhenExit;
</script>
<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'result-info-form',
	'enableAjaxValidation'=>false,
        'htmlOptions' => array('enctype' => 'multipart/form-data'),
)); ?>
	<?php echo $form->errorSummary($model); ?>
        <?php echo $form->hiddenField($model,'deleted_file_id',array('value'=>'','class'=>'deleted_file_id_class')); ?>
        <?php
        //lock_version should be the keyword to check if this record has been modified by other action
        echo $form->hiddenField($model,'lock_version',array('value'=>$model->lock_version));
        echo $form->hiddenField($model,'product_id');
        echo CHtml::hiddenField('templateTitle'); 
        ?>
        <?php echo CHtml::hiddenField('isPageDirty'); ?>
        <div>
        <div style="float: left;">
        <div class="row">
		<?php echo $form->label($model,'title',array('style'=>'padding-left:5px;')); ?>
                <span class="bugstatus_closed">&nbsp;</span>
                <?php echo $form->textField($model,'title',array('style'=>'width:580px;',
                    'readonly'=>'readonly','class'=>'readonly_field','title'=>$model->title)); ?>
	</div>
        <div class="row">
                <?php
                    echo $form->label($model,'productmodule_id',array('style'=>'padding-left:5px;'));
                ?>
                <span class="bugstatus_closed">&nbsp;</span>
                <?php
                    echo $form->hiddenField($model,'product_id');
                    if(ResultInfo::ACTION_BATCH_OPEN == $actionType)
                    {
                        echo CHtml::textField('product_module_name',Yii::t('Common','Mutiple items'),
                            array('style'=>'width:500px;',
                                'readonly'=>'readonly',
                                'class'=>'readonly_field',
                                'title'=>Yii::t('Common','Mutiple items')));
                    }
                    else
                    {
                        echo $form->hiddenField($model,'productmodule_id');
                        echo $form->textField($model,'module_name',array('style'=>'width:500px;',
                        'readonly'=>'readonly','class'=>'readonly_field','title'=>$model->module_name)); 
                    }                 
                ?>
	</div>
        </div>
        <div class="info_id">
            <span id="span_info_id">
                <?php
                if(!empty($model->id))
                {
                    echo $model->id;
                }
                else
                {
                    if(ResultInfo::ACTION_BATCH_OPEN == $actionType)
                    {
                        echo Yii::t('Common','Batch Run');
                    }
                    else
                    {
                        echo Yii::t('Common','New').ucfirst($infoType);
                    }                  
                }
                ?>
            </span>
        </div>
        </div>
        <div style="clear:both;">
            <fieldset style="width: 32%;float: left;">
                <legend><?php echo Yii::t('FieldConfig','result_status'); ?></legend>
                <div class="row">
                    <?php echo $form->label($model,'result_value'); ?>
                    <?php echo $form->dropDownList($model,'result_value',
                        $model->getResultValueOption(),
                            array('class'=>'required info_input',
                                'style'=>'width:190px;')); ?>
                </div>
                <div class="row">
                    <?php echo $form->label($model,'result_status'); ?>
                    <?php echo $form->dropDownList($model,'result_status',
                        $model->getStatusOption(),
                            array('class'=>'info_input',
                                'style'=>'width:190px;')); ?>
                </div>
                <div class="row">
                    <?php echo $form->label($model,'assign_to_name'); ?>
                    <?php $this->widget('application.extensions.autocomplete.AutoCompleteWidget', array(
                            'model' => $model,
                            'attribute' => 'assign_to_name',
                            'htmlOptions' => array('class'=>'info_input required'),
                            'urlOrData' => TestUser::getSearchUserUrl(TestUser::USER_TYPE_CLOSE)
                        ));?>
                </div>
                <div class="row">
                    <?php echo $form->label($model,'mail_to'); ?>
                    <?php $this->widget('application.extensions.autocomplete.AutoCompleteWidget', array(
                            'model' => $model,
                            'attribute' => 'mail_to',
                            'config' => '{multiple:true}',
                            'htmlOptions' => array('class'=>'info_input'),
                            'urlOrData' => TestUser::getSearchUserUrl()
                        ));?>
                </div>
                <?php echo empty($customfield['result_status'])?'':$customfield['result_status'] ; ?>
                <div class="row">
                    <?php echo $form->label($model,'updated_by'); ?>
                    <?php echo CHtml::encode(CommonService::getUserRealName($model->updated_by)); ?>
                </div>
                <div class="row">
                    <?php echo $form->label($model,'updated_at'); ?>
                    <?php echo CHtml::encode(CommonService::getDateStr($model->updated_at)); ?>
                </div>
            </fieldset>
            <div style="float: left;width: 33%">
            <fieldset>
                <legend><?php echo Yii::t('Common','Open'); ?></legend>
                <div class="row">
                    <?php echo $form->label($model,'created_by'); ?>
                    <?php echo CHtml::encode(CommonService::getUserRealName($model->created_by)); ?>
                </div>
                <div class="row">
                    <?php echo $form->label($model,'created_at'); ?>
                    <?php echo CHtml::encode(CommonService::getDateStr($model->created_at)); ?>
                </div>
                <?php echo empty($customfield['result_open'])?'':$customfield['result_open'] ; ?>
            </fieldset>
            <fieldset>
                <legend><?php echo Yii::t('FieldConfig','result_environment'); ?></legend>
                <?php echo empty($customfield['result_environment'])?'':$customfield['result_environment'] ; ?>
            </fieldset>
            </div>
            <div style="float:right;width: 33%;">
                <fieldset>
                <legend><?php echo Yii::t('Common','Other Info'); ?></legend>
                <?php echo empty($customfield['result_other'])?'':$customfield['result_other'] ; ?>
            </fieldset>
            <fieldset>
                <legend><?php echo Yii::t('FieldConfig','result_related'); ?></legend>
                <?php echo empty($customfield['result_related'])?'':$customfield['result_related'] ; ?>
                <div class="row">
                    <?php
                        echo $form->label($model,'related_case_id');
                        if(ResultInfo::ACTION_BATCH_OPEN == $actionType)
                        {
                            echo Yii::t('Common','Mutiple items');
                        }
                        else
                        {
                            echo $form->hiddenField($model,'related_case_id');
                            echo InfoService::getRelatedIdHtml('case', $model->related_case_id);
                        }

                    ?>
                </div>
                <div class="row">
                    <?php echo $form->label($model,'related_bug'); ?>
                    <?php echo InfoService::getRelatedIdHtml('bug', $model->related_bug) ?>
                </div>

            </fieldset>

            <fieldset>
                <legend>
                    <?php
                        echo Yii::t('Common','Attachments').'('.TestFileService::getFileSize(CommonService::getMaxFileSize()).')';
                    ?>
                </legend>
                <?php
                if(ResultInfo::ACTION_BATCH_OPEN != $actionType)
                {
                    echo $model->attachment_file;
                    $this->widget('CMultiFileUpload', array(
                         'model'=>$model,
                         'name' => 'attachment_file',
                         'accept'=>'',
                         'htmlOptions'=>array('class'=>'info_input'),
                         'remove'=>'<img src="'.Yii::app()->theme->baseUrl . '/assets/images/deletefile.gif" alt="remove" />',
                         'options'=>array()
                    ));
                }
                ?>
             </fieldset>
            </div>
            </div>
             <div style="clear:both;">
                <fieldset class="action_note" style="width:460px;">
                    <legend><?php echo Yii::t('Common','Comment'); ?></legend>
                    <div class="row" style="overflow: auto;padding: 2px;">
                        <?php
                        $this->widget('application.extensions.kindeditor4.KindEditorWidget',
                                array('model' => $model,'attribute' => 'action_note',
                                    'htmlOptions'=>array('style' => 'width:100px;'),
                                    'miniMode'=>true,'editorname'=>'action_note_editor'));
                        ?>
                    </div>
                    <?php echo ActionHistoryService::getActionHistory('result', $model->id, $model->product_id); ?>
                </fieldset>
                <fieldset style="width: 460px;float: right;">
                    <legend><?php echo Yii::t('ResultInfo','Steps'); ?></legend>
                    <div class="row">
                        <?php
                        if(ResultInfo::ACTION_BATCH_OPEN != $actionType)
                        {
                            $this->widget('application.extensions.kindeditor4.KindEditorWidget',
                                array('model' => $model,'attribute' => 'result_step',
                                    'htmlOptions'=>array('style' => 'width:100px;'),
                                    'editorname'=>'repeat_step_editor'));
                        }
                        else
                        {
                            echo Yii::t('Common','Mutiple items');
                        }
                        ?>
                    </div>
                </fieldset>
             </div>
<?php $this->endWidget(); ?>

</div><!-- form -->
