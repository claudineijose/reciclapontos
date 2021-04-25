SELECT U.[Id]
      ,U.[Name]
      ,U.[Cpf]
      ,U.[Email]
      ,U.[UpdateDate]
	,U.[RG]
	,U.[Birthday]
	,U.[Mobile]
	,U.[Phone]
FROM [dbo].[User] U
WHERE
    U.[Email] = @Email

SELECT T.[Type] AS [AuthType]
      ,T.[Password]
      ,T.[OAuthId]
      ,T.[Email]
FROM [dbo].[AuthType] T 
INNER JOIN [dbo].[User] U ON U.[Id] = T.[UserId] 
WHERE
	U.[Email] = @Email

SELECT A.[Id]
      ,A.[Type] AS [AddressType]
      ,A.[Zip]
      ,A.[Address]
      ,A.[Number]
      ,A.[Complement]
      ,A.[District]
      ,A.[City]
      ,A.[State]
      ,A.[Reference]
FROM [dbo].[Address] A 
INNER JOIN [dbo].[User] U ON U.[Id] = A.[UserId]
WHERE
    U.[Email] = @Email