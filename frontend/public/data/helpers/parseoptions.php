<?php

/**
 * @param array $optionsArray
 * @return array
 */
function parseOptions($optionsArray) {

    if(count($optionsArray) < 2) {
        return [];
    }

    $parsedOptions = [];
    foreach($optionsArray as $option) {
        $option = trim($option);
        $option = explode(":", $option);
        $optionNumber = intval((explode(' ', trim($option[0])))[1]);
        $optionText = trim($option[1]);
        $parsedOptions[$optionNumber] = $optionText;
    }

    return $parsedOptions;

}