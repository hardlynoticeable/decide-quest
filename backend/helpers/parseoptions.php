<?php

/**
 * @param array $optionsArray
 * @return array
 */
function parseOptions($options) {
    $result = [];
    
    // If options is already an object/array, convert to array and return directly
    if (is_object($options)) {
        return (array)$options;
    }
    
    // If options is already an array, return directly
    if (is_array($options)) {
        return $options;
    }
    
    // If options is a string, try to parse it
    if (is_string($options)) {
        // Try to parse as JSON first
        $parsed = json_decode($options, true);
        if ($parsed !== null) {
            return $parsed;
        } else {
            // Fall back to parsing text format
            $options = array_filter(explode("\n", $options));
            foreach ($options as $item) {
                if (preg_match('/Option (\d+): (.+)/', $item, $matches)) {
                    $result["Option {$matches[1]}"] = $matches[2];
                }
            }
        }
    }

    return $result;
}