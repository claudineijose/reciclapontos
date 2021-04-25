SELECT T.[UserId] 
      ,T.[Type] AS [AuthType]
      ,T.[Password]
      ,T.[OAuthId]
      ,T.[Email]
FROM [dbo].[AuthType] T 
WHERE
	T.[Email] = @Email
      AND T.[Type] = @Type