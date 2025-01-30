<?php
    $inData = getRequestInfo();
    
    $userId    = $inData["userId"];
    $phone = $inData["phone"];

    $conn = new mysqli("localhost", "DataGrant", "DatabaseCop4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE Phone = ? AND UserID = ?");
        $stmt->bind_param("si", $phone, $userId);
        $stmt->execute();
        
        if($stmt->affected_rows > 0)
        {
            returnWithInfo("Contact deleted successfully.");
        }
        else
        {
            returnWithError("Error deleting contact or contact not found.");
        }
        
        $stmt->close();
        $conn->close();
    }
    
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }
    
    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }
    
    function returnWithError($err)
    {
        $retValue = '{"message":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
    
    function returnWithInfo($message)
    {
        $retValue = '{"message":"' . $message . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
