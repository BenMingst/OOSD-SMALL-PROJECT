<?php
    $inData = getRequestInfo();
    
    $login     = $inData["login"];
    $password  = $inData["password"];
    $firstName = $inData["firstName"];
    $lastName  = $inData["lastName"];
    
    $conn = new mysqli("localhost", "DataGrant", "DatabaseCop4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else
    {        
        $stmt = $conn->prepare("INSERT INTO Users (Login, Password, firstName, lastName) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $login, $password, $firstName, $lastName);
        
        if($stmt->execute())
        {
            $newUserId = $conn->insert_id;
            returnWithInfo($firstName, $lastName, $newUserId);
        }
        else
        {
            returnWithError("Error signing up: " . $stmt->error);
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
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
    
    function returnWithInfo($firstName, $lastName, $id)
    {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
