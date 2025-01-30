<?php
    $inData = getRequestInfo();

    $userId    = $inData["userId"];
    $firstName = $inData["firstName"];
    $lastName  = $inData["lastName"];
    $phone = $inData["phone"];
    $phoneNew     = $inData["phoneNew"];
    $email     = $inData["email"];
    
    $conn = new mysqli("localhost", "DataGrant", "DatabaseCop4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Email = ? Phone = ? WHERE Phone = ? AND UserID = ?");
        $stmt->bind_param("sssssi", $firstName, $lastName, $email, $phoneNew, $phone, $userId);
        $stmt->execute();
        
        if($stmt->affected_rows > 0)
        {
            returnWithInfo("Contact updated successfully.");
        }
        else
        {
            returnWithError("No record updated. Please check that the contact exists and belongs to the user.");
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
        $retValue = '{"message":"' . $message . '", "error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
