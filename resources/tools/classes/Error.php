<?php
    
    class Error {
        
        static public function create( $reason ) {
            throw new Exception_Game( $reason );
        }
        
    }
    
?>