SELECT DISTINCT U.[Id]
      ,U.[Name]
      ,U.[Cpf]
      ,U.[UpdateDate]
	,U.[RG]
	,U.[Birthday]
	,U.[Mobile]
	,U.[Phone]
FROM [dbo].[User] U
INNER JOIN [dbo].[AuthType] T ON U.[Id] = T.[UserId] 
WHERE
    T.[Email] = @Email

SELECT T.[Type] AS [AuthType]
      ,T.[Password]
      ,T.[OAuthId]
      ,T.[Email]
FROM [dbo].[AuthType] T 
WHERE
	T.[Email] = @Email

SELECT DISTINCT A.[Id]
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
INNER JOIN [dbo].[AuthType] T ON A.[UserId] = T.[UserId] 
WHERE
    T.[Email] = @Email