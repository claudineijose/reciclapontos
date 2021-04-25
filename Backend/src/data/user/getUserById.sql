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
    U.[Id] = @Id

SELECT T.[Type] AS [AuthType]
      ,T.[Password]
      ,T.[OAuthId]
      ,T.[Email]
FROM [dbo].[AuthType] T 
WHERE
	T.[UserId] = @Id

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
WHERE
	A.[UserId] = @Id  