<?php

    class Exception_Programming extends Exception_Game {
        
        public function __construct( $reason, $severity = SEVERITY_CRITICAL, $previous = NULL ) {
            
            parent::__construct( $reason, $severity, $previous );
        }
        
    }

?>