<?php
    
    $index = ( 3 * 56 );
    
    for ( $row = 0; $row < 56; $row++ ) {
    
        for ( $col = 2; $col >= 0; $col-- ) {
            
            
            echo "div.g-art.id-$index: {\n    background-position: " , ( -$col * 64 ) , "px ", ( -$row * 64 ), "px;\n}\n\n";
            $index--;
        }
        
    }
    
?>