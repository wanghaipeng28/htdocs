<?php

/*
 *  BugFree is free software under the terms of the FreeBSD License.
 *  @link        http://www.bugfree.org.cn
 *  @package     BugFree
 */

/**
 * Description of ProductService
 *
 * @author youzhao.zxw<swustnjtu@gmail.com>
 * @version 3.0
 */
class ProductService
{
    const ERROR_GROUP_NOT_FOUND = 'group not found';
    const ERROR_USER_NOT_FOUND = 'user not found';

    /**
     * get product operation
     *
     * @author                                    youzhao.zxw<swustnjtu@gmail.com>
     * @param   int         $productId            product id
     * @param   string      $isDropped            is dropped
     * @return  string                            operation html string
     */
    public static function getProductOperation($productId, $isDropped)
    {
        $returnStr = '';
        $newIsDropped = 1 - $isDropped;
        $returnStr .= '<a class="with_underline" href="' . Yii::app()->createUrl('product/edit',
                        array('id' => $productId)) . '">' . Yii::t('Common', 'Edit') . '</a>';
        //only system_admin can copy,disable and enable product
        if(CommonService::$TrueFalseStatus['TRUE'] == Yii::app()->user->getState('system_admin'))
        {
            $returnStr .= '|<a class="with_underline" href="' . Yii::app()->createUrl('product/edit',
                            array('source_id' => $productId)) . '">' . Yii::t('Common', 'Copy') . '</a>';
//            $returnStr .= '|<a class="with_underline" href="index.php?r=product/disable&id=' . $productId .
//                    '&is_dropped=' . $newIsDropped . '" onclick="return confirm(\'' .
//                    Yii::t('Common', 'Are you sure?') . '\');">';
//            if(CommonService::$TrueFalseStatus['TRUE'] == $isDropped)
//            {
//                $returnStr .= Yii::t('Common', 'Enable') . '</a>';
//            }
//            else
//            {
//                $returnStr .= Yii::t('Common', 'Disable') . '</a>';
//            }
        }

        $returnStr .= '|<a class="with_underline" href="' .
                Yii::app()->createUrl('productModule/index',
                        array('product_id' => $productId)). '">' . Yii::t('Common', 'Modules') . '</a>';
        return $returnStr;
    }

    public static function getProductCustomFieldLink($productId)
    {
        $returnStr = '';
        $typeArr = array(Info::TYPE_BUG,Info::TYPE_CASE,  Info::TYPE_RESULT);
        foreach($typeArr as $type)
        {
            $returnStr .= '<a class="with_underline" href="'.Yii::app()->createUrl('fieldConfig/index',
                        array('product_id' => $productId,'type'=>$type)).'">'.  ucfirst($type).'</a>|';
        }
        $returnStr = rtrim($returnStr, '|');
        return $returnStr;
    }

    public static function isProductEditable($productId)
    {
        if(CommonService::$TrueFalseStatus['TRUE'] == Yii::app()->user->getState('system_admin'))
        {
            return true;
        }
        if(!empty($productId))
        {
            $productManagerIdArr = self::getProductManagerIds($productId);
            if(in_array(Yii::app()->user->id, $productManagerIdArr))
            {
                return true;
            }
        }
        return false;
    }

    public static function getProductGroupOption($productId)
    {
        $groupIdArr = self::getProductGroupIdArr($productId);
        $groupNameArr = array();
        $groupInfos = Yii::app()->db->createCommand()
                        ->select('name')
                        ->from('{{user_group}}')
                        ->where(array('in', 'id', $groupIdArr))
                        ->order('id')
                        ->queryAll();

        foreach($groupInfos as $groupInfo)
        {
            $groupNameArr[] = $groupInfo['name'];
        }
        return CHtml::dropDownList('productGroupList', '', $groupNameArr, array('style' => 'width:100%;'));
    }

    public static function getProductManagerOption($productId)
    {
        $managerArr = CommonService::splitStringToArray(',', self::getProductManagers($productId));
        return CHtml::dropDownList('productManagerList', '', $managerArr, array('style' => 'width:100%;'));
    }

    public static function disableProduct($productId, $isDropped)
    {
        $resultInfo = array();
        $product = self::loadModel($productId);
        $oldRecordAttributs['is_dropped'] = $product->is_dropped;
        $product->is_dropped = $isDropped;
        if(!$product->save())
        {
            $resultInfo['status'] = CommonService::$ApiResult['FAIL'];
            $resultInfo['detail'] = $product->getErrors();
        }
        else
        {
            $addActionResult = AdminActionService::addActionNotes('product', BugfreeModel::ACTION_EDIT,
                            array('is_dropped' => $isDropped, 'id' => $productId), $oldRecordAttributs);
            $resultInfo['status'] = CommonService::$ApiResult['SUCCESS'];
        }
        return $resultInfo;
    }

    public static function copyProduct($sourceId, $params)
    {
        $resultInfo = array();
        $resultInfo = self::editProduct($params);
        if(CommonService::$ApiResult['SUCCESS'] == $resultInfo['status'])
        {
            $copyResult = self::copyProductFieldConfig($sourceId, $resultInfo['detail']['id']);
            if(CommonService::$ApiResult['FAIL'] == $copyResult['status'])
            {
                $resultInfo = $copyResult;
            }
        }
        return $resultInfo;
    }

    private static function copyProductFieldConfig($sourceProductId, $newProductId)
    {
        $resultInfo = array();
        $fieldConfigInfos = FieldConfig::model()->findAllByAttributes(array('product_id' => $sourceProductId));
        foreach($fieldConfigInfos as $fieldConfigInfo)
        {
            $createInfo = $fieldConfigInfo->attributes;
            if(('result' == $createInfo['type']) &&
                    (CommonService::$TrueFalseStatus['TRUE'] == $createInfo['edit_in_result']))
            {
                continue;
            }
            unset($createInfo['id']);
            $createInfo['product_id'] = $newProductId;
            $createInfo['editable_action_name'] = CommonService::splitStringToArray(',', $createInfo['editable_action']);
            $editResult = FieldConfigService::editFieldConfig($createInfo);
            if(CommonService::$ApiResult['FAIL'] == $editResult['status'])
            {
                return $editResult;
            }
        }
        $resultInfo['status'] = CommonService::$ApiResult['SUCCESS'];
        return $resultInfo;
    }

    public static function editProduct($params)
    {
        $resultInfo = array();
        $connection = Yii::app()->db;
        $transaction = $connection->beginTransaction();
        $actionType = BugfreeModel::ACTION_OPEN;
        $oldRecordAttributs = array();
        if(isset($params['id']))
        {
            $product = self::loadModel((int) $params['id']);
            $oldRecordAttributs = $product->attributes;
            $oldRecordAttributs['product_manager'] = $product->product_manager;
            if(!empty($product->group_name))
            {
                $oldRecordAttributs['group_name'] = join(',', $product->group_name);
            }
            $actionType = BugfreeModel::ACTION_EDIT;
        }
        else
        {
            $product = new Product();
        }

        if(!ProductService::isProductEditable($product['id']))
        {
            $resultInfo['status'] = CommonService::$ApiResult['FAIL'];
            $resultInfo['detail']['id'] = Yii::t('Common', 'Required URL not found or permission denied.');
            return $resultInfo;
        }

        try
        {
            $product->attributes = $params;
            if(!$product->save())
            {
                $resultInfo['status'] = CommonService::$ApiResult['FAIL'];
                $resultInfo['detail'] = $product->getErrors();
            }
            else
            {
                Yii::app()->db->createCommand()->delete('{{map_product_group}}',
                        'product_id=:productId', array(':productId' => $product->id));
                if(!empty($params['group_name']))
                {
                    foreach($params['group_name'] as $groupId)
                    {
                        $mapProductGroup = new MapProductGroup();
                        $mapProductGroup->product_id = $product->id;
                        $mapProductGroup->user_group_id = $groupId;
                        $mapProductGroup->save();
                    }
                }

                Yii::app()->db->createCommand()->delete('{{map_product_user}}',
                        'product_id=:productId', array(':productId' => $product->id));
                if('' != trim($params['product_manager']))
                {
                    $managerNameArr = CommonService::splitStringToArray(",", $params['product_manager']);
                    foreach($managerNameArr as $managerName)
                    {
                        $userInfo = TestUser::model()->findByAttributes(array('realname' => $managerName,
                                    'is_dropped' => CommonService::$TrueFalseStatus['FALSE']));
                        if($userInfo !== null)
                        {
                            $mapProductUser = new MapProductUser();
                            $mapProductUser->product_id = $product->id;
                            $mapProductUser->test_user_id = $userInfo->id;
                            $mapProductUser->save();
                        }
                        else
                        {
                            $resultInfo['status'] = CommonService::$ApiResult['FAIL'];
                            $resultInfo['detail'] = array('product_manager' => '[' . $managerName . ']' . Yii::t('TestUser', self::ERROR_USER_NOT_FOUND));
                            return $resultInfo;
                        }
                    }
                }
                $newRecord = self::loadModel($product->id);
                if(!empty($newRecord->group_name))
                {
                    $newRecord->group_name = join(',', $newRecord->group_name);
                }
                $addActionResult = AdminActionService::addActionNotes('product', $actionType, $newRecord, $oldRecordAttributs);
                if(!isset($params['id']))
                {
                    FieldConfigService::createAddOnTable($product->id);
                }
                $transaction->commit();
                $resultInfo['status'] = CommonService::$ApiResult['SUCCESS'];
                $resultInfo['detail'] = array('id' => $product->id);
            }
            return $resultInfo;
        }
        catch(Exception $e)
        {
            $transaction->rollBack();
            $resultInfo['status'] = CommonService::$ApiResult['FAIL'];
            $resultInfo['detail']['id'] = $e->getMessage();
        }
        return $resultInfo;
    }

    public static function getProductGroupIdArr($productId)
    {
        $groupIdArr = array();
        $groupInfos = MapProductGroup::model()->findAllByAttributes(array('product_id' => $productId));
        foreach($groupInfos as $groupInfo)
        {
            $groupIdArr[] = $groupInfo['user_group_id'];
        }
        return $groupIdArr;
    }

    public static function getProductManagerIds($productId)
    {
        $managerIds = array();
        $managerInfos = MapProductUser::model()->findAllByAttributes(array('product_id' => $productId));
        foreach($managerInfos as $managerInfo)
        {
            $managerIds[] = $managerInfo['test_user_id'];
        }
        return $managerIds;
    }

    public static function getProductManagers($productId)
    {
        $managerNameStr = '';
        $managerIds = self::getProductManagerIds($productId);
        foreach($managerIds as $managerId)
        {
            $userInfo = TestUser::model()->findByPk($managerId);
            if($userInfo != null)
            {
                $managerNameStr .= $userInfo->realname . ",";
            }
        }
        if('' != $managerNameStr)
        {
            $managerNameStr = substr($managerNameStr, 0, strlen($managerNameStr) - 1);
        }
        return $managerNameStr;
    }

    public static function getProductAllFieldInfo($type, $productId)
    {
        $searchResult = Yii::app()->db->createCommand()
                        ->select('*')
                        ->from('{{field_config}}')
                        ->where('type = :type and product_id = :productId and is_dropped = :isDropped',
                                array(':type' => $type,
                                    ':productId' => $productId,
                                    ':isDropped' => CommonService::$TrueFalseStatus['FALSE']))
                        ->order('belong_group,display_order desc')
                        ->queryAll();
        return $searchResult;
    }

    public static function getSearchableCostomField($type, $productId)
    {
        $searchCustomFieldArr = array();
        $customFieldArr = self::getProductAllFieldInfo($type, $productId);
        $searchOperatorArr = FieldConfigService::getFieldTypeOperatorMapping();
        foreach($customFieldArr as $fieldInfo)
        {
            $searchCustomFieldArr[$fieldInfo['field_name']] = array('label' => $fieldInfo['field_label'],
                'type' => $searchOperatorArr[$fieldInfo['field_type']], 'isBasic' => false);
            if(FieldConfig::FIELD_TYPE_MULTISELECT == $fieldInfo['field_type'])
            {
                $searchCustomFieldArr[$fieldInfo['field_name']]['value'] = FieldConfigService::getSelectOption($fieldInfo['field_value']);
            }
            else if(FieldConfig::FIELD_TYPE_SINGLESELECT == $fieldInfo['field_type'])
            {
                $searchCustomFieldArr[$fieldInfo['field_name']]['value'] = FieldConfigService::getSelectOption($fieldInfo['field_value']);
                array_unshift($searchCustomFieldArr[$fieldInfo['field_name']]['value'], '');
            }
        }
        return $searchCustomFieldArr;
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer the ID of the model to be loaded
     */
    public static function loadModel($id)
    {
        $model = Product::model()->findByPk((int) $id);
        if($model === null)
        {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        else
        {
            $model->group_name = self::getProductGroupIdArr((int) $id);
            $model->product_manager = self::getProductManagers((int) $id);
        }

        return $model;
    }

}

?>
