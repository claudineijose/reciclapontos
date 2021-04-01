UPDATE 
    [dbo].[AuthType]
SET
    [Password] = @Password
WHERE
    [UserId] = @UserId
    AND [Type] = 'P'