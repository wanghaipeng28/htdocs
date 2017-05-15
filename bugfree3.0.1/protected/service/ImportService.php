<?php
/**
 * This is import class
 *
 * @package bugfree.protected.service
 */
class ImportService
{
    /**
     * label convert to field
     *
     * @param string $label
     * @param string $productId
     * @param string $infoType
     * @param array
     */
    private function fieldConv($label, $productId, $infoType)
    {
        $field = false;
        $isBasic = false;
        $clazz = ucfirst($infoType) . 'Info';
//      $basicFields = $clazz::model()->attributeLabels();
        $targetModel = new $clazz();
        $basicFields = $targetModel->attributeLabels();

        $customFields = FieldConfigService::getCustomFieldLabel($infoType, $productId);
        $notAllowFields = array('created_by', 'updated_by', 'created_by_name',
        'updated_by_name', 'created_at', 'updated_at', 'modified_by', 'related_result');

        foreach($notAllowFields as $field)
        {
            if(isset($basicFields[$field]))
            {
                unset($basicFields[$field]);
            }
        }

        $field = array_search($label, $basicFields);
        if($field)
        {
            // hard code for productmodule_id&module_name, assign_to&assign_to_name
            if('assign_to' == $field)
            {
                $field = 'assign_to_name';
            }
            if('module_name' == $field)
            {
                $field = 'productmodule_id';
            }
            $isBasic = true;
        }
        else
        {
            $field = array_search($label, $customFields);
        }

        return array($field, $isBasic);
    }

    /**
     * basic info convert
     *
     * @todo convert $action for bug import
     *
     * @param array $basicInfo
     * @return string
     */
    private function basicInfoConv($basicInfo)
    {
        // hard code for productmodule_id
        if(isset($basicInfo['productmodule_id']))
        {
             $moduleName = substr($basicInfo['productmodule_id'], strpos($basicInfo['productmodule_id'], ProductModule::MODULE_SPLITTER) + 1);
             $moduleInfo = ProductModule::model()->findByAttributes(array('product_id' => $productId, 'full_path_name' => $moduleName));
             if(!empty($moduleInfo))
             {
                 $basicInfo['productmodule_id'] = $moduleInfo->id;
             }
        }
        // hard code for id
        if(isset($basicInfo['id']) && '' == $basicInfo['id'])
        {
            unset($basicInfo['id']);
        }
        // hard code for delete_flag
        if(isset($basicInfo['delete_flag']))
        {
            if(isset($basicInfo['id']))
            {
                $basicInfo['delete_flag'] = 0;
            }
            else
            {
                $basicInfo['delete_flag'] = CommonService::getTrueFalseValue($basicInfo['delete_flag']);
            }
        }
        // hard code for repeat_step
        if(isset($basicInfo['repeat_step']))
        {
            $basicInfo['repeat_step'] = BBCode::bbcode2html($basicInfo['repeat_step']);
        }
        // hard code for case_step
        if(isset($basicInfo['case_step']))
        {
            $basicInfo['case_step'] = BBCode::bbcode2html($basicInfo['case_step']);
        }
        // hard code for result_step
        if(isset($basicInfo['result_step']))
        {
            $basicInfo['result_step'] = BBCode::bbcode2html($basicInfo['result_step']);
        }

        // @TODO convert for bug import
        $action = Info::ACTION_OPEN;

        return array($basicInfo, $action);
    }

    /**
     * get result msg
     *
     * @param array $results
     * @param string $infoType
     * @return string
     */
    private function getResultMsg($results, $infoType)
    {
        $msgGroup = ucfirst($infoType) . 'Info';
        $msg = '';
        $rowCount = $failedCount = 0;

        // sheet index
        foreach($results as $sidx => $sheetResults)
        {
            foreach($sheetResults as $ridx => $result)
            {
                $rowCount++;
                if(CommonService::$ApiResult['FAIL'] == $result['status'])
                {
                    $failedCount++;
                    $msg .= Yii::t($msgGroup, 'Sheet {sidx} row {ridx} import failed',
                            array('{sidx}' => $sidx + 1, '{ridx}' => $ridx + 2));
                    $msg .= '(';
                    $infos = array();
                    foreach($result['detail'] as $info)
                    {
                        if(is_array($info))
                        {
                            $infos[] = join(' ', $info);
                        }
                        else
                        {
                            $infos[] = $info;
                        }
                    }
                    $msg .= join(', ', $infos) . ")\n";
                }
            }
        }

        if(empty($result))
        {
            $msg = Yii::t($msgGroup, 'Parse sheet file error');
        }
        else
        {
            $msg = Yii::t($msgGroup,
                    'Import finished! Total cases: {param0}, succeed cases: {param1}, failed cases: {param2}',
                    array('{param0}' => $rowCount, '{param1}' => $rowCount - $failedCount, '{param2}' => $failedCount))
                . "\n\n" . $msg;
        }

        return $msg;
    }

    /**
     * import sheet data to bugfree
     *
     * @param mixed $sheet file or string
     * @param string $infoType
     */
    public function import($sheet, $productId, $infoType)
    {
        $sheetConv = new SheetConv();
        $data = $sheetConv->xml2array($sheet);
        $results = array();

        // sheet index
        foreach($data as $sidx => $items)
        {
            $sheetResult = array();
            // item index
            foreach($items as $iidx => $item)
            {
                // hard code for product_id
                $basicInfo = array('product_id' => $productId);
                $customInfo = array();
                $isEmpty = true;
                foreach($item as $key => $val)
                {
                    unset($item[$key]);
                    list($field, $isBasic) = $this->fieldConv($key, $productId, $infoType);
                    if($field)
                    {
                        if($isBasic)
                        {
                            $basicInfo[$field] = $val;
                        }
                        else
                        {
                            $customInfo[$field] = $val;
                        }
                    }
                    if('' != $val)
                    {
                        $isEmpty = false;
                    }
                }
                if(!$isEmpty)
                {
                    list($basicInfo, $action) = $this->basicInfoConv($basicInfo);
                    $sheetResult[] = InfoService::saveInfo($infoType, $action, $basicInfo, $customInfo, array(), array());
                }
            }
            $results[$sidx] = $sheetResult;
        }

        return $this->getResultMsg($results, $infoType);
    }
}
?>