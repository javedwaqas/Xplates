<?php
if (isset($GLOBALS["HTTP_RAW_POST_DATA"]))
{
    // Get the data
    $Data=$GLOBALS['HTTP_RAW_POST_DATA'];
 
 	// Extracting file name 
    $fileName=substr($Data, 0, strpos($Data, ","));
    // Extracting file data
    $Data=substr($Data, strpos($Data, ",")+1);
 
     // Save file.  

   // $fp = fopen( 'test.svg', 'wb' );
   
   $fp = fopen($fileName, 'wb' );
       
    fwrite( $fp, $Data);
    fclose( $fp );
}
?>