<?php
    
    $buffer = isset( $_POST['buffer'] ) ? $_POST['buffer'] : '';
    
    file_put_contents( __DIR__.  '/../resources/styles/land.mss', $buffer );
    
    echo "resources/styles/land.mss was saved...";
?>