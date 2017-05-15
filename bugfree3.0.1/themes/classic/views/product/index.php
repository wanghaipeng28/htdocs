<div class="admin_search">
    <?php echo CHtml::beginForm(Yii::app()->createUrl('product/index'), 'get'); ?>
        <?php
            if(CommonService::$TrueFalseStatus['TRUE'] == Yii::app()->user->getState('system_admin'))
            {
                echo '<a class="add_link" href="'.Yii::app()->createUrl('product/edit').'" >'.Yii::t('Common', 'Add Product').'</a>';
            }
        ?>
        <input type="text" id="name" name="name" value="<?php echo $name; ?>">&nbsp;
        <input class="btn" type="submit" value="<?php echo Yii::t('Common', 'Post Query'); ?>">
        <input class="btn" type="reset" value="<?php echo Yii::t('Common', 'Reset Query'); ?>" onclick="window.location.href= '<?php echo Yii::app()->createUrl('product/index'); ?>'">
    <?php echo CHtml::endForm(); ?>
</div>
<?php
$this->widget('View', array(
    'id' => 'searchresult-grid',
    'dataProvider' => $dataProvider,
    'rowCssClassExpression' => 'CommonService::getRowCss($data["is_dropped"])',
    'columns' => array(
        'display_order',
        'id',
        'name',
        array('name' => Yii::t('Product','group_name'),'type'=>'raw','value' => 'ProductService::getProductGroupOption($data["id"])'),
        array('name' => Yii::t('Product','product_manager'),'type'=>'raw','value' => 'ProductService::getProductManagerOption($data["id"])'),
        array('name' => Yii::t('Common','Operation'),'type'=>'raw','value'=>'ProductService::getProductOperation($data["id"],$data["is_dropped"])'),
        array('name' => Yii::t('Common','Manage Fields'),'type'=>'raw','value'=>'ProductService::getProductCustomFieldLink($data["id"])'),
        array('name' => 'created_by', 'value' => 'CommonService::getUserRealName($data["created_by"])'),
        'created_at',
        array('name' => 'updated_by', 'value' => 'CommonService::getUserRealName($data["updated_by"])'),
        'updated_at'
    )
));
?>


