<?php
    
    $index = ( 3 * 34 );
    
    for ( $row = 0; $row < 34; $row++ ) {
    
        for ( $col = 2; $col >= 0; $col-- ) {
            
            
            echo "div.g-dwl.id-$index {\n    background-position: " , ( -$col * 64 ) , "px ", ( -$row * 64 ), "px;\n}\n\n";
            $index--;
        }
        
    }
    
?>